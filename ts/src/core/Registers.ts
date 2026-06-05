import { Module, type OperationIO, type TSSVParameters, type IntRange, Expr, type Interface, Sig } from 'tssv/lib/core/TSSV'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { Casex, type Field, type RegisterType, generateAPBStr, calculateDecMask, replaceZerosWithX, AIGC2APB4, AIGCStr, padZeroes } from 'tssv/lib/tools/shared'
import { isObjectBindingPattern } from 'typescript'
import { isBooleanObject } from 'util/types'

function isIntRange16to64 (x: number | undefined): x is IntRange<16, 64> {
  return typeof x === 'number' && Number.isInteger(x) && x >= 16 && x <= 64
}
interface Register {
  type: RegisterType
  reset?: bigint
  description?: string
  size?: bigint
  width?: IntRange<1, 64>
  isSigned?: boolean
  fields?: Record<string, Field>
  repeat?: number
  hardUpdate?: number
  weOut?: boolean
  useBuf?: boolean
}

export class RegAddr {
  private addr: bigint
  private readonly stride: bigint
  constructor (start?: bigint, wordSize?: 32 | 64) {
    this.addr = start || 0n
    this.stride = BigInt((wordSize || 32) / 8)
  }

  next (): bigint {
    const nextAddr = this.addr
    this.addr += this.stride
    return nextAddr
  }
}

export interface RegisterBlockDef<T extends Record<string, bigint>> {
  wordSize: 32 | 64
  addrMap: T
  baseAddress?: bigint
  registers: { [name in keyof T]?: Register }
}

export interface RegisterBlockParameters extends TSSVParameters {
  busInterface?: 'Memory' | 'TL_UL'
  endianess?: 'little'
  busIDWidth?: 8
  busAddressWidth?: 32 | 12 | 16
}

export class RegisterBlock<T extends Record<string, bigint>> extends Module {
  declare params: RegisterBlockParameters
  regDefs: RegisterBlockDef<T>
  // Create signals and logic for this whole register SystemVerilog
  private setupSignalsExprs (regDefs: any, params: any, useComb: boolean | undefined = true,
    mappings: Record<string, string> | undefined = {}): { signals: Record<string, Sig>, expressions: Record<string, Expr> } {
    const reg_rd: Sig = this.addSignal('reg_rd', { width: 1, type: 'wire' })
    const reg_wr: Sig = this.addSignal('reg_wr', { width: 1, type: 'wire' })
    const reg_addr: Sig = this.addSignal('reg_addr', { width: params.busAddressWidth || 12, type: 'wire' })
    const reg_rdata: Sig = this.addSignal('reg_rdata', { width: regDefs.wordSize || 32, type: 'reg' })
    const reg_wdata: Sig = this.addSignal('reg_wdata', { width: regDefs.wordSize || 32, type: 'wire' })
    const next_rdata: Sig = this.addSignal('next_rdata', { width: regDefs.wordSize || 32, type: 'wire' })
    const inRange: Sig = this.addSignal('in_range', { width: 1, type: 'wire' })
    const next_rdataExpr: Expr = new Expr('')
    const inRangeExpr: Expr = new Expr('')
    const signals: Record<string, Sig> = { reg_rd, reg_wr, reg_addr, reg_rdata, reg_wdata, next_rdata, inRange }
    const expressions: Record<string, Expr> = { next_rdataExpr, inRangeExpr }
    if (useComb) {
      this.addCombAlways(
        {
          outputs: ['reg_wr', 'reg_rd', 'reg_addr', 'reg_wdata', generateAPBStr('prdata', mappings), generateAPBStr('pready', mappings)]
        },
        generateAPBStr(AIGCStr, mappings)
      )
    } else {
      this.addAssign({ in: new Expr(reg_rdata.toString()), out: generateAPBStr('prdata', mappings) })
      this.addAssign({ in: new Expr(generateAPBStr('psel && penable && pwrite', mappings)), out: reg_wr })
      this.addAssign({ in: new Expr(generateAPBStr('psel && !penable && !pwrite', mappings)), out: reg_rd })
      this.addAssign({ in: new Expr('1\'b1'), out: generateAPBStr('pready', mappings) })
    }
    this.slverrHandler(mappings)
    return { signals, expressions }
  }

  private extendIOs (busAddrWidth: number | undefined, wordSize: 32 | 64): void {
    this.IOs = {
      ...this.IOs,
      paddr: { direction: 'input', width: busAddrWidth || 12 },
      pwdata: { direction: 'input', width: wordSize || 32 },
      prdata: { direction: 'output', width: wordSize || 32 },
      psel: { direction: 'input', width: 1 },
      penable: { direction: 'input', width: 1 },
      pwrite: { direction: 'input', width: 1 },
      pready: { direction: 'output', width: 1 },
      pslverr: { direction: 'output', width: 1, type: 'reg' }
    }
  }

  private slverrHandler (mappings: Record<string, string> | undefined = {}): void {
    this.addSignal('slverr', { width: 1, type: 'wire' })
    this.addAssign({ in: new Expr(generateAPBStr('psel && !in_range', mappings)), out: 'slverr' })
    this.addRegister({ d: 'slverr', clk: 'clk', reset: 'rst_b', q: generateAPBStr('pslverr', mappings), resetVal: 0n })
  }

  private setupMatchPack (params: RegisterBlockParameters, reg: Extract<keyof T, string>, lower: boolean | undefined = true): [bigint, string, Sig, Sig, Register] {
    const regName = lower ? reg.toLowerCase() : reg
    const registers = this.regDefs.registers
    const baseAddr = this.regDefs.addrMap[reg]
    let thisReg: Register = { type: 'RW', width: this.regDefs.wordSize || 32 }
    if (registers[reg] !== undefined) {
      thisReg = registers[reg] || thisReg
    }
    const matchSig: Sig = this.addSignal(`dec_${regName}`, { width: 1, type: 'wire' })
    let pkSig: Sig = new Sig('unused')
    if (lower) {
      this.addAssign({ in: new Expr(`(reg_addr == ${params.busAddressWidth || 12}'h${padZeroes(baseAddr.toString(16).toUpperCase(), (params.busAddressWidth || 12) / 4)}) ? 1'd1 : 1'd0`), out: matchSig })
      if (thisReg.type !== 'W1T' && thisReg.type !== 'W1C' && thisReg.type !== 'W0C' && thisReg.type !== 'W0T') {
        pkSig = this.addSignal(`reg_${regName}`, { width: this.regDefs.wordSize || 32, type: (thisReg.type === 'RO') ? 'wire' : 'reg' })
      }
      return [baseAddr, regName, matchSig, pkSig, thisReg]
    } else { return [baseAddr, regName, matchSig, pkSig, thisReg] }
  }

  private setupRegIO (regName: string, thisReg: Register, pkSig: Sig, reg_wdata: Sig, WE_Sig: Sig): void {
    this.IOs[`cfg_${regName}`] = { direction: 'output', width: thisReg.width || this.regDefs.wordSize, isSigned: thisReg.isSigned || false }
    this.addRegister({ d: reg_wdata, clk: 'clk', reset: 'rst_b', q: pkSig, en: WE_Sig, resetVal: thisReg.reset || 0n })
    if (!thisReg.useBuf) {
      this.addAssign({ in: new Expr(pkSig.toString()), out: `cfg_${regName}` })
    } else {
      const bufSig: Sig = this.addSignal(`buf_${regName}`, { width: thisReg.width || this.regDefs.wordSize, type: 'reg' })
      this.body += this.generateBufferInstances(pkSig.toString(), `buf_${regName}`, 'AIGCIC_common_buf', thisReg.width || this.regDefs.wordSize)
      this.addAssign({ in: new Expr(bufSig.toString()), out: `cfg_${regName}` })
    }
  }

  private setupWOReg (regName: string, matchSig: Sig, pkSig: Sig, reg_wdata: Sig, thisReg: Register): void {
    const SC_Sig = this.addSignal(`${regName}_sc`, { width: 1, type: 'reg' })
    const WE_Sig = this.addSignal(`${regName}_we`, { width: 1, type: 'wire' })
    this.addAssign({ in: new Expr(`reg_wr && ${matchSig.toString()}`), out: WE_Sig })
    this.setupRegIO(regName, thisReg, pkSig, reg_wdata, WE_Sig)
    this.addRegister({ d: '32\'h0', clk: 'clk', reset: 'rst_b', q: pkSig, en: SC_Sig, resetVal: thisReg.reset || 0n })
    this.addRegister({ d: '1\'b1', clk: 'clk', reset: 'rst_b', q: SC_Sig, en: WE_Sig, resetVal: 0n })
    this.addRegister({ d: '1\'b0', clk: 'clk', reset: 'rst_b', q: SC_Sig, en: SC_Sig, resetVal: 0n })
  }

  private setupROReg (regName: string, pkSig: Sig, thisReg: Register): void {
    this.IOs['cfg_' + regName.toString()] = { direction: 'input', width: thisReg.width || this.regDefs.wordSize, isSigned: thisReg.isSigned || false }
    this.addAssign({ in: new Expr(`cfg_${regName}`), out: pkSig })
  }

  private setupRWReg (regName: string, matchSig: Sig, pkSig: Sig, reg_wdata: Sig, thisReg: Register, update: boolean | undefined = false): void {
    const WE_Sig = this.getOrAddSignal(`${regName}_we`, 1, 'wire')
    this.addAssign({ in: new Expr(`reg_wr && ${matchSig.toString()}`), out: WE_Sig })
    this.setupRegIO(regName, thisReg, pkSig, reg_wdata, WE_Sig)
    if (update) {
      this.IOs[`${regName}_update`] = { direction: 'input', width: 1, isSigned: false }
      this.IOs[`${regName}_update_value`] = { direction: 'input', width: thisReg.width || this.regDefs.wordSize, isSigned: thisReg.isSigned || false }
      this.addRegister({ d: `${regName}_update_value`, clk: 'clk', reset: 'rst_b', q: pkSig, en: `${regName}_update`, resetVal: thisReg.reset || 0n })
    }
  }

  private setupMemoryIntRWRegister (regName: string, thisReg: Register,
    params: RegisterBlockParameters, baseAddr: bigint, matchSig: Sig): void {
    const wstrbWidth = (params.busAddressWidth || 8) / 8
    const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth })

    this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchSig })

    const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
    const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
    this.addAssign({ in: new Expr(`${matchSig.toString()} && regs.RE`), out: RE_Sig })
    this.addAssign({ in: new Expr(`${matchSig.toString()} && regs.WE`), out: WE_Sig })

    this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb })
    if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
      Object.keys(thisReg.fields).forEach((fieldName, index) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const field = thisReg.fields![fieldName]
        const fieldSigName = `${regName}_field${index}`
        this.IOs[fieldSigName] = { direction: 'output', width: field.bitRange[0] - field.bitRange[1] + 1, isSigned: field.isSigned }
        this.addRegister({ d: new Expr(`regs.DATA_WR[${field.bitRange[0]}:${field.bitRange[1]}]`), clk: 'clk', reset: 'rst_b', q: fieldSigName, en: `${regName}_WE && ${wstrb.toString()}`, resetVal: field.reset || 0n })
      })
    } else {
      this.IOs[regName.toString()] = { direction: 'output', width: thisReg.width || this.regDefs.wordSize, isSigned: thisReg.isSigned }
      this.addSignal(`${regName}_d`, { width: this.regDefs.wordSize })
      this.addAssign({ in: new Expr(`regs.DATA_WR & ${wstrb.toString()}`), out: `${regName}_d` })

      this.addRegister({ d: 'regs.DATA_WR', clk: 'clk', reset: 'rst_b', q: regName.toString(), en: `${regName}_WE`, resetVal: thisReg.reset || 0n })
    }
  }

  private setWriteOneClearOrToggle (regName: string, pkSig: Sig, matchSig: Sig, thisReg: any, regDefs: any, type: 'W1C' | 'W1T' | 'W0T' | 'W0C'): void {
    const reg_wdata = this.addSignal(`${'reg_' + regName.toString()}_${type.toLowerCase()}`, { width: regDefs.wordSize || 32, type: 'wire' })
    const resetExpr = type === 'W1C' ? '& ~reg_wdata' : '^ reg_wdata'
    this.addAssign({ in: new Expr(`${'reg_' + regName.toString()} ${resetExpr}`), out: reg_wdata })

    const enableSignal = this.addSignal(`${regName}_${type.toLowerCase()}e`, { width: 1, type: 'wire' })
    this.addAssign({ in: new Expr(`reg_wr && ${matchSig.toString()}`), out: enableSignal })

    this.IOs['cfg_' + regName.toString()] = {
      direction: 'input',
      width: thisReg.width || regDefs.wordSize,
      isSigned: thisReg.isSigned || false
    }
    this.IOs['reg_' + regName.toString()] = {
      direction: 'output',
      width: thisReg.width || regDefs.wordSize,
      isSigned: thisReg.isSigned || false
    }
    this.addRegister({ d: reg_wdata, clk: 'clk', reset: 'rst_b', q: 'reg_' + regName.toString(), en: enableSignal, resetVal: thisReg.reset || 0n })
    this.addRegister({ d: 'cfg_' + regName.toString(), clk: 'clk', reset: 'rst_b', q: 'reg_' + regName.toString(), resetVal: thisReg.reset || 0n })
  }

  constructor (params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>, busInterface: Interface | Record<string, unknown>) {
    super({
      name: params.name,
      busInterface: params.busInterface || 'Memory',
      endianess: params.endianess || 'little'
    })
    this.regDefs = regDefs
    this.IOs = { clk: { direction: 'input', isClock: 'posedge' }, rst_b: { direction: 'input', isReset: 'lowasync' } }
    if (!((busInterface instanceof Memory) || (busInterface instanceof APB4) || typeof busInterface === 'object')) {
      throw Error('Unsupported interface')
    }
    if (busInterface instanceof Memory) {
      this.genRegBlkMemory(regDefs, params)
    } else if (busInterface instanceof APB4) {
      this.genRegBlkAPB4(regDefs, params)
    } else {
      this.extendIOs(params.busAddressWidth, regDefs.wordSize)
      const { signals, expressions } = this.setupSignalsExprs(regDefs, params, false)
      const { reg_rd, reg_wr, reg_addr, reg_rdata, reg_wdata, next_rdata, inRange } = signals
      let { next_rdataExpr, inRangeExpr } = expressions
      this.addAssign({ in: new Expr('paddr'), out: reg_addr })
      this.addAssign({ in: new Expr('pwdata'), out: reg_wdata })
      for (const reg in this.regDefs.addrMap) {
        const [, regName, matchSig, pkSig, thisReg] = this.setupMatchPack(params, reg)
        if (thisReg.weOut === true) {
          this.IOs[`${regName}_we`] = { direction: 'output', width: 1 }
        }
        if (thisReg.type === 'RW') {
          this.setupRWReg(regName, matchSig, pkSig, reg_wdata, thisReg)
        } else if (thisReg.type === 'RWU') {
          this.setupRWReg(regName, matchSig, pkSig, reg_wdata, thisReg, true)
        } else if (thisReg.type === 'WO') {
          this.setupWOReg(regName, matchSig, pkSig, reg_wdata, thisReg)
        } else if (thisReg.type === 'RO') {
          this.setupROReg(regName, pkSig, thisReg)
        } else if (thisReg.type === 'W1C' || thisReg.type === 'W1T' || thisReg.type === 'W0C' || thisReg.type === 'W0T') {
          this.setWriteOneClearOrToggle(regName, pkSig, matchSig, thisReg, regDefs, thisReg.type)
        }
        const readSignal: OperationIO = { a: matchSig, b: thisReg.type === 'WO' ? '32\'h0' : ((thisReg.type === 'W1C' || thisReg.type === 'W1T' || thisReg.type === 'W0T' || thisReg.type === 'W0C') ? `${'reg_' + regName.toString()}` : pkSig) }

        next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), regDefs.wordSize || 32))
        inRangeExpr = new Expr(this.addInRange({ a: matchSig, b: inRangeExpr.toString() }))
      }
      this.addAssign({ in: inRangeExpr, out: inRange })
      this.addAssign({ in: next_rdataExpr, out: next_rdata })
      this.addRegister({ d: next_rdata, clk: 'clk', reset: 'rst_b', q: reg_rdata, en: reg_rd, resetVal: 0n })
    }
  }

  private genRegBlkMemory (regDefs: RegisterBlockDef<T>, params: RegisterBlockParameters): void {
    const addrWidth = params.busAddressWidth

    if (!isIntRange16to64(addrWidth)) {
      throw new Error(`Invalid ADDR_WIDTH: ${addrWidth}, must be integer in [16, 64]`)
    }
    this.addInterface('regs', new Memory({
      DATA_WIDTH: regDefs.wordSize || 32,
      ADDR_WIDTH: addrWidth
    }, 'inward'))
    for (const reg in regDefs.addrMap) {
      const [baseAddr, regName, matchSig, , thisReg] = this.setupMatchPack(params, reg, false)
      if (thisReg.type === 'RW' || thisReg.type === 'HRW') {
        this.setupMemoryIntRWRegister(regName, thisReg, params, baseAddr, matchSig)
      } else if (thisReg.type === 'RO') {
        this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchSig })
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchSig.toString()} && regs.RE`), out: RE_Sig })
        this.IOs[regName.toString()] = { direction: 'output', width: thisReg.width || regDefs.wordSize, isSigned: thisReg.isSigned }
      } else if (thisReg.type === 'WO') {
        const wstrbWidth = (params.busAddressWidth || 8) / 8
        const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth })

        this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchSig })
        this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb })

        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchSig.toString()} && regs.WE`), out: WE_Sig })
        this.IOs[regName] = { direction: 'output', width: thisReg.width || regDefs.wordSize, isSigned: thisReg.isSigned }
        this.addAssign({ in: new Expr('regs.DATA_WR'), out: regName.toString() })
      } else if (thisReg.type === 'ROM') {
        if (thisReg.size) {
          this.addAssign({ in: new Expr(`(regs.ADDR >= ${baseAddr}) && (regs.ADDR <= (${Number(baseAddr.valueOf()) + ((Number(thisReg.size) * 4) - 1)}))`), out: matchSig })
        } else {
          this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchSig })
        }
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const ROM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        this.addAssign({ in: new Expr(`${matchSig.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr('regs.ADDR'), out: ROM_ADDR })
        this.IOs[`${regName}_rdata`] = { direction: 'output', width: thisReg.width || regDefs.wordSize, isSigned: thisReg.isSigned }
        this.IOs[`${regName}_re`] = { direction: 'output', width: 1 }
        this.IOs[`${regName}_ready`] = { direction: 'output', width: 1 }
        this.addRegister({ d: 'regs.READY', clk: 'clk', reset: 'rst_b', en: 'regs.WE', q: `${regName}_ready` })
      } else if (thisReg.type === 'RAM') {
        if (thisReg.size) {
          this.addAssign({ in: new Expr(`(regs.ADDR >= ${baseAddr}) && (regs.ADDR <= (${Number(baseAddr.valueOf()) + ((Number(thisReg.size) * 4) - 1)}))`), out: matchSig })
        } else {
          this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchSig })
        }
        const DEC_MASK = calculateDecMask(thisReg.size)
        // const PASS_MASK = calculatePassMask(thisReg.size)
        const Nmatch = this.addSignal(`${regName}_Nmatch`, { width: 1 })
        const RAM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.addAssign({ in: new Expr(`regs.ADDR & ${DEC_MASK} == ${baseAddr}`), out: Nmatch })
        this.addAssign({ in: new Expr(`${matchSig.toString()} && regs.RE`), out: RE_Sig }) // changed from Nmatch
        this.addAssign({ in: new Expr(`${matchSig.toString()} && regs.WE`), out: WE_Sig }) // changed from Nmatch
        this.addAssign({ in: new Expr('regs.ADDR'), out: RAM_ADDR }) // remove  & ${PASS_MASK}
        this.IOs[`${regName}_rdata`] = { direction: 'output', width: thisReg.width || regDefs.wordSize, isSigned: thisReg.isSigned }
        this.IOs[`${regName}_re`] = { direction: 'output', width: 1 }
        this.IOs[`${regName}_we`] = { direction: 'output', width: 1 }
        this.IOs[`${regName}_wdata`] = { direction: 'output', width: thisReg.width || regDefs.wordSize, isSigned: thisReg.isSigned }
        this.IOs[`${regName}_wstrb`] = { direction: 'output', width: thisReg.width || regDefs.wordSize }
        this.IOs[`${regName}_ready`] = { direction: 'output', width: 1 }
        this.addRegister({ d: 'regs.READY', clk: 'clk', reset: 'rst_b', en: `${regName}_WE`, q: `${regName}_ready` })
        this.addRegister({ d: 'regs.DATA_WR', clk: 'clk', reset: 'rst_b', en: `${regName}_WE`, q: `${regName}_wdata` })
        this.addRegister({ d: RE_Sig, clk: 'clk', reset: 'rst_b', en: `${regName}_WE`, q: `${regName}_re` })
        this.addRegister({ d: WE_Sig, clk: 'clk', reset: 'rst_b', en: `${regName}_WE`, q: `${regName}_we` })
        this.addRegister({ d: new Expr('1'), clk: 'clk', reset: 'rst_b', en: `${regName}_WE`, q: `${regName}_wstrb` })
      }
    }
    this.addCasexStr()
  }

  private genRegBlkAPB4 (regDefs: RegisterBlockDef<T>, params: RegisterBlockParameters): void {
    const addrWidth = params.busAddressWidth

    if (!isIntRange16to64(addrWidth)) {
      throw new Error(`Invalid ADDR_WIDTH: ${addrWidth}, must be integer in [16, 64]`)
    }
    this.addInterface('regs', new APB4({
      DATA_WIDTH: regDefs.wordSize || 32,
      ADDR_WIDTH: addrWidth
    }, 'inward'))
    const { signals, expressions } = this.setupSignalsExprs(regDefs, params, true, AIGC2APB4)
    const { reg_rd, reg_wr, reg_addr, reg_rdata, reg_wdata, next_rdata, inRange } = signals
    let { next_rdataExpr, inRangeExpr } = expressions
    for (const reg in this.regDefs.addrMap) {
      const [, regName, matchSig, pkSig, thisReg] = this.setupMatchPack(params, reg)
      if (thisReg.type === 'RW') {
        const RE_Sig = this.addSignal(`${regName}_re`, { width: 1 })
        this.addAssign({ in: new Expr(`reg_rd && ${matchSig.toString()}`), out: RE_Sig })
        this.setupRWReg(regName, matchSig, pkSig, reg_wdata, thisReg)
      } else if (thisReg.type === 'WO') {
        this.setupWOReg(regName, matchSig, pkSig, reg_wdata, thisReg)
      } else if (thisReg.type === 'RO') {
        this.setupROReg(regName, pkSig, thisReg)
      }
      const readSignal: OperationIO = { a: matchSig, b: thisReg.type === 'WO' ? '32\'h0' : ((thisReg.type === 'W1C' || thisReg.type === 'W1T' || thisReg.type === 'W0T' || thisReg.type === 'W0C') ? `${'reg_' + regName.toString()}` : pkSig) }
      next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), regDefs.wordSize || 32))
      inRangeExpr = new Expr(this.addInRange({ a: matchSig, b: inRangeExpr.toString() }))
    }
    this.addAssign({ in: inRangeExpr, out: inRange })
    this.addAssign({ in: next_rdataExpr, out: next_rdata })
    this.addRegister({ d: next_rdata, clk: 'clk', reset: 'rst_b', q: reg_rdata, en: reg_rd, resetVal: 0n })
  }

  private addCasexStr (): string {
    let casexString = `
  always @(regs.ADDR or regs.RE)
    if(regs.RE == 1) begin
      /* verilator lint_off CASEX */
      casex (regs.ADDR)
   `
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const baseAddr = this.regDefs.addrMap[regName]
      let readyStr = '1\'b1'
      let readSignal = ''
      let condStr = `     8'b${padZeroes(baseAddr.toString(2), 8)}`
      const register = this.regDefs.registers?.[regName]
      if (register?.type === 'ROM') {
        readSignal = `${regName}_rdata`
        readyStr = `${regName}_ready`
        condStr = `     8'b${padZeroes(replaceZerosWithX(baseAddr.toString(2)), 8)}`
      } else if (register?.type === 'RAM') {
        readSignal = `${regName}_wdata`
        readyStr = `${regName}_ready`
        condStr = `     8'b${padZeroes(replaceZerosWithX(baseAddr.toString(2)), 8)}`
      } else if (register?.type === 'RO') {
        readSignal = regName
      } else if (register?.type === 'RW') {
        if (register.fields && Object.keys(register.fields).length > 0) {
          readSignal = Object.keys(register.fields).map((fieldName, index) => `${regName}_field${index}`).reverse().join(', ')
          readSignal = `{${readSignal}}`
        } else {
          readSignal = regName
        }
      } else {
        readSignal = regName
      }
      const regCasex = new Casex(condStr, readSignal, readyStr)
      casexString += regCasex.toString()
    }
    casexString += '      default: regs.DATA_RD <= 0;\n'
    casexString += '    endcase\n'
    casexString += '  end'
    this.body += casexString
    return casexString
  }
}

// ... existing imports

// Bind the function to the RegisterBlock class
// RegisterBlock.prototype.addCasexStr = addCasexStr;
// (RegisterBlock.prototype as any).addCasexStr = addCasexStr
// ... existing class definition

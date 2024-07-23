/**
 * WRITE
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "     clk", "wave": "p........."},
 *     {"name": " DATA_WR", "wave": "x100......", "data": ["D"]},
 *     {"name": "    ADDR", "wave": "x100......", "data": ["A"]},
 *     {"name": "      WE", "wave": "01.......0"},
 *     {"name": "      RE", "wave": "0........."},
 *     {"name": " DATA_RD", "wave": "0........."},
 *     {"name": "   READY", "wave": "0-.......-"}
 *   ]
 * }
 * ```
 */

/**
 * READ
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "     clk", "wave": "p........."},
 *     {"name": " DATA_WR", "wave": "0........."},
 *     {"name": "    ADDR", "wave": "x100......", "data": ["A"]},
 *     {"name": "      WE", "wave": "0........."},
 *     {"name": "      RE", "wave": "01.......0"},
 *     {"name": " DATA_RD", "wave": "....x100..", "data": ["D"]},
 *     {"name": "   READY", "wave": "10......01"}
 *   ]
 * }
 * ```
 */

import { Module, type TSSVParameters, type IntRange, Expr, Interface } from 'tssv/lib/core/TSSV'

type RegisterType = 'RO' | 'RW' | 'WO' | 'RAM' | 'ROM' | string
interface Field {
  reset?: bigint
  description?: string
  bitRange: [IntRange<0, 63>, IntRange<0, 63>]
  isSigned?: boolean
}
interface Register {
  type: RegisterType
  reset?: bigint
  description?: string
  size?: bigint
  width?: IntRange<1, 64>
  isSigned?: boolean
  fields?: Record<string, Field>
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
  busAddressWidth?: 32
}

export interface Memory_Parameters extends TSSVParameters {
  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024

  ADDR_WIDTH?: IntRange<16, 64>
}

export type Memory_Role = 'outward' | 'inward' | undefined

export class Memory extends Interface {
  declare params: Memory_Parameters
  declare signals
  constructor (params: Memory_Parameters = {}, role: Memory_Role = undefined) {
    super(
      'memory',
      {
        DATA_WIDTH: params.DATA_WIDTH || 32,
        ADDR_WIDTH: params.ADDR_WIDTH || 32
      },
      role
    )
    this.signals =
    {
      ADDR: { width: this.params.ADDR_WIDTH || 32 },
      DATA_WR: { width: this.params.DATA_WIDTH || 32 },
      DATA_RD: { width: this.params.DATA_WIDTH || 32 },
      RE: { width: 1 },
      WE: { width: 1 },
      READY: { width: 1 }
    }
    this.modports = {
      outward: {
        ADDR: 'input',
        DATA_WR: 'output',
        DATA_RD: 'input',
        WE: 'output',
        RE: 'output',
        READY: 'input'
      },
      inward: {
        ADDR: 'output',
        DATA_WR: 'input',
        DATA_RD: 'output',
        WE: 'input',
        RE: 'input',
        READY: 'output'
      }
    }
  }
}

export class RegisterBlock<T extends Record<string, bigint>> extends Module {
  declare params: RegisterBlockParameters
  regDefs: RegisterBlockDef<T>

  constructor (params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>, busInterface: Interface) {
    super({
      name: params.name,
      busInterface: params.busInterface || 'Memory',
      endianess: params.endianess || 'little'
    })
    this.regDefs = regDefs

    // Define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }

    if (!(busInterface instanceof Memory)) {
      throw Error('Unsupported interface')
    }

    this.addInterface('regs', new Memory({
      DATA_WIDTH: regDefs.wordSize || 32,
      ADDR_WIDTH: params.busAddressWidth
    }, 'inward'))

    // Define base signals
    // const ADDR = this.addSignal('ADDR', { width: params.busAddressWidth })
    // const DATA_WR = this.addSignal('DATA_WR', { width: regDefs.wordSize || 32 })
    // const DATA_RD = this.addSignal('DATA_RD', { width: regDefs.wordSize || 32 })
    // const RE = this.addSignal('RE', { width: 1 })
    // const WE = this.addSignal('WE', { width: 1 })
    // this.addSignal('READY', { width: 1 })

    // Create signals and logic for registers
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const registers = this.regDefs.registers
      const baseAddr = this.regDefs.addrMap[regName]
      const matchExpr = this.addSignal(`${regName}_matchExpr`, { width: 1 })

      // Use original address for logic
      this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr })

      let thisReg: Register = {
        type: 'RW',
        width: regDefs.wordSize
      }
      if (registers[regName] !== undefined) {
        thisReg = registers[regName] || thisReg
      }

      if (thisReg.type === 'RW') {
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })

        if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
          Object.keys(thisReg.fields).forEach((fieldName, index) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const field = thisReg.fields![fieldName]
            const fieldSigName = `${regName}_field${index}`
            this.IOs[fieldSigName] = {
              direction: 'output',
              width: field.bitRange[0] - field.bitRange[1] + 1,
              isSigned: field.isSigned
            }
            this.addRegister({
              d: new Expr(`regs.DATA_WR[${field.bitRange[0]}:${field.bitRange[1]}]`),
              clk: 'clk',
              reset: 'rst_b',
              q: fieldSigName,
              en: 'regs.WE',
              resetVal: field.reset || 0n
            })
          })
        } else {
          this.IOs[regName.toString()] = {
            direction: 'output',
            width: thisReg.width || regDefs.wordSize,
            isSigned: thisReg.isSigned
          }
          this.addRegister({
            d: 'regs.DATA_WR',
            clk: 'clk',
            reset: 'rst_b',
            q: regName.toString(),
            en: 'regs.WE',
            resetVal: thisReg.reset || 0n
          })
        }
      } else if (thisReg.type === 'RO') {
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.IOs[regName.toString()] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
      } else if (thisReg.type === 'WO') {
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })
        this.IOs[regName.toString()] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.addAssign({ in: new Expr('regs.DATA_WR'), out: regName.toString() })
      } else if (thisReg.type === 'ROM') {
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const ROM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr('regs.ADDR'), out: ROM_ADDR })
        this.IOs[`${regName}_rdata`] = {
          direction: 'input',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName}_re`] = {
          direction: 'output',
          width: 1
        }
        this.addRegister({
          d: new Expr(`${regName}_rdata`),
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: 'regs.DATA_RD'
        })
        this.addRegister({
          d: RE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: `${regName}_re`
        })
      } else if (thisReg.type === 'RAM') {
        const DEC_MASK = this.calculateDecMask(thisReg.size)
        const PASS_MASK = this.calculatePassMask(thisReg.size)
        const Nmatch = this.addSignal(`${regName}_Nmatch`, { width: 1 })
        const RAM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.addAssign({ in: new Expr(`regs.ADDR & ${DEC_MASK} == ${baseAddr}`), out: Nmatch })
        this.addAssign({ in: new Expr(`${Nmatch.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${Nmatch.toString()} && regs.WE`), out: WE_Sig })
        this.addAssign({ in: new Expr(`regs.ADDR & ${PASS_MASK}`), out: RAM_ADDR })
        this.IOs[`${regName}_rdata`] = {
          direction: 'input',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName}_re`] = {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName}_we`] = {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName}_wdata`] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName}_wstrb`] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize
        }
        this.addRegister({
          d: new Expr(`${regName}_rdata`),
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: 'regs.DATA_RD'
        })
        this.addRegister({
          d: 'regs.DATA_WR',
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: `${regName}_wdata`
        })
        this.addRegister({
          d: RE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: `${regName}_re`
        })
        this.addRegister({
          d: WE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: `${regName}_we`
        })
        this.addRegister({
          d: new Expr('1'), // Assuming a simple write strobe signal
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: `${regName}_wstrb`
        })
      }
    }

    // this.addMux({ in: ['MEMO_rdata', 'MEM1_rdata'], sel: 'regs.ADDR', out: 'regs.DATA_RD' })

    const inputs: string[] = []
    let casexString = '   always_comb\n    /* verilator lint_off CASEX */\n    casex (regs.ADDR)\n'
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const baseAddr = this.regDefs.addrMap[regName]

      let readSignal = ''
      const register = this.regDefs.registers?.[regName]
      if (register?.type === 'ROM' || register?.type === 'RAM') {
        readSignal = `${regName}_rdata`
        inputs.push(`${regName}_rdata`)
      } else if (register?.type === 'RO') {
        readSignal = regName
        inputs.push(`${regName}`)
      } else if (register?.type === 'RW') {
        if (register.fields && Object.keys(register.fields).length > 0) {
          readSignal = Object.keys(register.fields).map((fieldName, index) => `${regName}_field${index}`).join(' | ')
          inputs.push(`${regName}_field0`)
          inputs.push(`${regName}_field1`)
        } else {
          readSignal = regName
          inputs.push(`${regName}`)
        }
      } else {
        readSignal = regName
        inputs.push(`${regName}`)
      }

      casexString += `      8'b${this.padAddress(baseAddr.toString(2), 8)}: regs.DATA_RD = ${readSignal};\n`
    }
    casexString += '      default: regs.DATA_RD = 0;\n'
    casexString += '    endcase\n'
    // Add the casex string to the body
    this.body += casexString

    // this.addCombAlways({ inputs: [], outputs: ['regs.DATA_RD'] }, casexString)
  }

  private padAddress (address: string, width: number): string {
    const padLength = width - address.length
    if (padLength <= 0) return address
    return address + 'X'.repeat(padLength)
  }

  private calculateDecMask (size?: bigint): string {
    if (size === undefined) return '0'
    const sizeBits = size.toString(2).length
    return `${sizeBits}'b${'1'.repeat(sizeBits / 2).padEnd(sizeBits, '0')}`
  }

  private calculatePassMask (size?: bigint): string {
    if (size === undefined) return '0'
    const sizeBits = size.toString(2).length
    return `${sizeBits}'b${'0'.repeat(sizeBits / 2).padEnd(sizeBits, '1')}`
  }
}

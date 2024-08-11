import { Module, type TSSVParameters, type IntRange, Expr, type Interface } from 'tssv/lib/core/TSSV'

import { Memory } from 'tssv/lib/interfaces/Memory'

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

/**
 * WRITE
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "     clk", "wave": "p........."},
 *     {"name": " data_wr", "wave": "03........", "data": ["D"]},
 *     {"name": "    addr", "wave": "04........", "data": ["A"]},
 *     {"name": "      we", "wave": "01.0......"},
 *     {"name": "      re", "wave": "0........."},
 *     {"name": " data_rd", "wave": "0........."},
 *     {"name": "   ready", "wave": "10.1......"}
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
 *     {"name": " data_wr", "wave": "0........."},
 *     {"name": "    addr", "wave": "04........", "data": ["A"]},
 *     {"name": "      we", "wave": "0........."},
 *     {"name": "      re", "wave": "01.0......"},
 *     {"name": " data_rd", "wave": "0.......5.", "data": ["D"]},
 *     {"name": "   ready", "wave": "10......1."}
 *   ]
 * }
 * ```
 */
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

    // Create signals and logic for registers
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const registers = this.regDefs.registers
      const baseAddr = this.regDefs.addrMap[regName]
      const matchExpr = this.addSignal(`${regName}_matchExpr`, { width: 1 })

      let thisReg: Register = {
        type: 'RW',
        width: regDefs.wordSize
      }
      if (registers[regName] !== undefined) {
        thisReg = registers[regName] || thisReg
      }

      if (thisReg.type === 'RW') {
        const wstrbWidth = (params.busAddressWidth || 8) / 8
        const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth })

        // Use original address for logic
        this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr })

        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })

        // new code
        this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb })

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
              en: `${regName}_WE && ${wstrb.toString()}`, // added && ${wstrb.toString()}
              resetVal: field.reset || 0n
            })
          })
        } else {
          this.IOs[regName.toString()] = {
            direction: 'output',
            width: thisReg.width || regDefs.wordSize,
            isSigned: thisReg.isSigned
          }

          this.addSignal(`${regName}_d`, { width: regDefs.wordSize })
          // new
          this.addAssign({ in: new Expr(`regs.DATA_WR & ${wstrb.toString()}`), out: `${regName}_d` })

          this.addRegister({
            d: 'regs.DATA_WR', // added & wstrb
            clk: 'clk',
            reset: 'rst_b',
            q: regName.toString(),
            en: `${regName}_WE`,
            resetVal: thisReg.reset || 0n
          })
        }
      } else if (thisReg.type === 'RO') {
        // Use original address for logic
        this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr })

        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.IOs[regName.toString()] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
      } else if (thisReg.type === 'WO') {
        const wstrbWidth = (params.busAddressWidth || 8) / 8
        const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth })

        // Use original address for logic
        this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr })
        this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb })

        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig })
        this.IOs[regName.toString()] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.addAssign({ in: new Expr('regs.DATA_WR'), out: regName.toString() })
      } else if (thisReg.type === 'ROM') {
        // Use original address for logic
        if (thisReg.size) {
          this.addAssign({ in: new Expr(`(regs.ADDR >= ${baseAddr}) && (regs.ADDR <= (${Number(baseAddr.valueOf()) + ((Number(thisReg.size) * 4) - 1)}))`), out: matchExpr })
        } else {
          this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr })
        }
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const ROM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig })
        this.addAssign({ in: new Expr('regs.ADDR'), out: ROM_ADDR })
        this.IOs[`${regName}_rdata`] = { // changed from input
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName}_re`] = {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName}_ready`] = {
          direction: 'output',
          width: 1
        }
        this.addRegister({
          d: 'regs.READY',
          clk: 'clk',
          reset: 'rst_b',
          en: 'regs.WE',
          q: `${regName}_ready`
        })
      } else if (thisReg.type === 'RAM') {
        // Use original address for logic
        if (thisReg.size) {
          this.addAssign({ in: new Expr(`(regs.ADDR >= ${baseAddr}) && (regs.ADDR <= (${Number(baseAddr.valueOf()) + ((Number(thisReg.size) * 4) - 1)}))`), out: matchExpr })
        } else {
          this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr })
        }
        const DEC_MASK = this.calculateDecMask(thisReg.size)
        // const PASS_MASK = this.calculatePassMask(thisReg.size)
        const Nmatch = this.addSignal(`${regName}_Nmatch`, { width: 1 })
        const RAM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.addAssign({ in: new Expr(`regs.ADDR & ${DEC_MASK} == ${baseAddr}`), out: Nmatch })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig }) // changed from Nmatch
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig }) // changed from Nmatch
        this.addAssign({ in: new Expr('regs.ADDR'), out: RAM_ADDR }) // remove  & ${PASS_MASK}
        this.IOs[`${regName}_rdata`] = { // changed input to output
          direction: 'output',
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
        this.IOs[`${regName}_ready`] = {
          direction: 'output',
          width: 1
        }
        this.addRegister({
          d: 'regs.READY',
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_ready`
        })
        this.addRegister({
          d: 'regs.DATA_WR',
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_wdata`
        })
        this.addRegister({
          d: RE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_re`
        })
        this.addRegister({
          d: WE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_we`
        })
        this.addRegister({
          d: new Expr('1'), // Assuming a simple write strobe signal
          clk: 'clk',
          reset: 'rst_b',
          en: `${regName}_WE`,
          q: `${regName}_wstrb`
        })
      }
    }
    let readyStr = ''
    const inputs: string[] = []
    let casexString = `
always @(regs.ADDR or regs.RE)
  if(regs.RE == 1) begin
    /* verilator lint_off CASEX */
    casex (regs.ADDR)
 `
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const baseAddr = this.regDefs.addrMap[regName]

      let readSignal = ''
      const register = this.regDefs.registers?.[regName]
      if (register?.type === 'ROM') { //  || register?.type === 'RAM'
        readSignal = `${regName}_rdata`
        inputs.push(`${regName}_rdata`)
        readyStr = `${regName}_ready`
        casexString +=
`     8'b${this.padZeroes(this.replaceZerosWithX(baseAddr.toString(2)), 8)}: begin
          regs.DATA_RD <= ${readSignal};
          regs.READY <= ${readyStr};
      end\n`
      } else if (register?.type === 'RAM') {
        readSignal = `${regName}_wdata`
        inputs.push(`${regName}_rdata`)
        readyStr = `${regName}_ready`
        casexString +=
`     8'b${this.padZeroes(this.replaceZerosWithX(baseAddr.toString(2)), 8)}: begin
          regs.DATA_RD <= ${readSignal};
          regs.READY <= ${readyStr};
      end\n`
      } else if (register?.type === 'RO') {
        readSignal = regName
        inputs.push(`${regName}`)
        readyStr = '1\'b1'
        casexString +=
`     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
          regs.DATA_RD <= ${readSignal};
          regs.READY <= ${readyStr};
      end\n`
      } else if (register?.type === 'RW') {
        if (register.fields && Object.keys(register.fields).length > 0) {
          readSignal = Object.keys(register.fields).map((fieldName, index) => `${regName}_field${index}`).reverse().join(', ')
          readSignal = `{${readSignal}}`
          inputs.push(`${regName}_field0`)
          inputs.push(`${regName}_field1`)
          readyStr = '1\'b1'
          casexString +=
`     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
          regs.DATA_RD <= ${readSignal};
          regs.READY <= ${readyStr};
      end\n`
        } else {
          readSignal = regName
          inputs.push(`${regName}`)
          readyStr = '1\'b1'
          casexString +=
`     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
          regs.DATA_RD <= ${readSignal};
          regs.READY <= ${readyStr};
      end\n`
        }
      } else {
        readSignal = regName
        inputs.push(`${regName}`)
        casexString +=
`     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
          regs.DATA_RD <= ${readSignal};
          regs.READY <= ${readyStr};
      end\n`
      }
    }
    casexString += '      default: regs.DATA_RD <= 0;\n'
    casexString += '    endcase\n'
    casexString += '  end'
    // Add the casex string to the body
    this.body += casexString
  }

  private replaceZerosWithX (binaryStr: string): string {
    // Replace all '0's with 'X's
    let modifiedStr = binaryStr.replace(/0/g, 'X')

    // Check if there is no '1' in the string
    if (!modifiedStr.includes('1')) {
      modifiedStr += 'X'
    }

    return modifiedStr
  }

  private padZeroes (address: string, width: number): string {
    const padLength = width - address.length
    if (padLength <= 0) return address
    return '0'.repeat(padLength) + address
  }

  private padZeroesRight (address: string, width: number): string {
    const padLength = width - address.length
    if (padLength <= 0) return address
    return address + '0'.repeat(padLength)
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

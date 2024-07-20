// import { Module, type TSSVParameters, type IntRange/*, Expr */ } from 'tssv/lib/core/TSSV'
// import { TL_UL } from 'tssv/lib/interfaces/TileLink'

// type RegisterType = 'RO' | 'RW' | 'WO' | 'RAM' | 'ROM' | string
// interface Field {
//   reset?: bigint
//   description?: string
//   bitRange: [IntRange<0, 63>, IntRange<0, 63>]
//   isSigned?: boolean
// }
// interface Register {
//   type: RegisterType
//   reset?: bigint
//   description?: string
//   size?: bigint
//   width?: IntRange<1, 64>
//   isSigned?: boolean
//   fields?: Record<string, Field>
// }

// export class RegAddr {
//   private addr: bigint
//   private readonly stride: bigint
//   constructor (start?: bigint, wordSize?: 32 | 64) {
//     this.addr = start || 0n
//     this.stride = BigInt((wordSize || 32) / 8)
//   }

//   next (): bigint {
//     const nextAddr = this.addr
//     this.addr += this.stride
//     return nextAddr
//   }
// }
// export interface RegisterBlockDef<T> {
//   wordSize: 32 | 64
//   addrMap: T
//   baseAddress?: bigint
//   registers: { [name in keyof T]?: Register }
// }

// export interface RegisterBlockParameters extends TSSVParameters {
//   busInterface?: 'TL_UL'
//   endianess?: 'little'
//   busIDWidth?: 8
//   busAddressWidth?: 32
// }

// /**
//  * This module implements a block of memory mapped control & status
//  * registers according to the definitions in the addrMap T, and the
//  * register defintions in regDefs
//  */

// // remove regDefs parameter: regDefs: RegisterBlock<T>
// export class RegisterBlock<T> extends Module {
//   declare params: RegisterBlockParameters
//   regDefs: RegisterBlockDef<T>
//   constructor (params: RegisterBlockParameters,
//     regDefs: RegisterBlockDef<T>) {
//     super({
//       // define the default parameter values
//       name: params.name,
//       busInterface: params.busInterface || 'TL_UL',
//       endianess: params.endianess || 'little'
//     })
//     this.regDefs = regDefs

//     // define IO signals
//     this.IOs = {
//       clk: { direction: 'input', isClock: 'posedge' },
//       rst_b: { direction: 'input', isReset: 'lowasync' }
//     }
//     this.addInterface('regs', new TL_UL({
//       DW: regDefs.wordSize || 32,
//       AIW: params.busIDWidth,
//       AW: params.busAddressWidth,
//       DIW: params.busIDWidth
//     }, 'inward'))

//     // let hasRAM = false
//     // let hasRW = false
//     // let hasROM = false
//     // let registerName = ''
//     // let ramName = ''
//     // let romName = ''

//     for (const reg in this.regDefs.addrMap) {
//       const regName = reg
//       const registers = this.regDefs.registers
//       let thisReg: Register = {
//         type: 'RW',
//         width: regDefs.wordSize
//       }
//       if (registers[regName] !== undefined) {
//         thisReg = registers[regName] || thisReg
//       }
//       if (thisReg.type === 'RW' ||
//           thisReg.type === 'RO' ||
//           thisReg.type === 'WO') {
//         if (thisReg.fields === undefined) {
//           this.IOs[regName.toString()] =
//             {
//               direction: 'output',
//               width: thisReg.width || regDefs.wordSize,
//               isSigned: thisReg.isSigned
//             }
//         } else {
//           for (const fieldName in thisReg.fields) {
//             const thisField = thisReg.fields[fieldName]
//             const width = thisField.bitRange[0] - thisField.bitRange[1] + 1
//             this.IOs[fieldName.toString()] =
//               {
//                 direction: 'output',
//                 width,
//                 isSigned: thisField.isSigned
//               }
//           }
//         }
//         if (thisReg.type === 'RW') {
//           // hasRW = true
//           // registerName = regName.toString()
//         }
//       } else if (thisReg.type === 'ROM') {
//         if (thisReg.fields !== undefined) throw Error('fields not supported for type ROM')
//         this.IOs[`${regName.toString()}_rdata`] =
//         {
//           direction: 'input',
//           width: thisReg.width || regDefs.wordSize,
//           isSigned: thisReg.isSigned
//         }
//         this.IOs[`${regName.toString()}_re`] =
//         {
//           direction: 'output',
//           width: 1
//         }
//         if (thisReg.type === 'ROM') {
//           // hasROM = true
//           // romName = `${regName.toString()}`
//         }
//       } else {
//         if (thisReg.fields !== undefined) throw Error('fields not supported for type ROM')
//         this.IOs[`${regName.toString()}_rdata`] =
//         {
//           direction: 'input',
//           width: thisReg.width || regDefs.wordSize,
//           isSigned: thisReg.isSigned
//         }
//         this.IOs[`${regName.toString()}_re`] =
//         {
//           direction: 'output',
//           width: 1
//         }
//         this.IOs[`${regName.toString()}_wdata`] =
//         {
//           direction: 'output',
//           width: thisReg.width || regDefs.wordSize,
//           isSigned: thisReg.isSigned
//         }
//         this.IOs[`${regName.toString()}_we`] =
//         {
//           direction: 'output',
//           width: 1
//         }
//         this.IOs[`${regName.toString()}_wstrb`] =
//         {
//           direction: 'output',
//           width: Math.ceil((thisReg.width || regDefs.wordSize) / 8)
//         }
//         if (thisReg.type === 'RAM') {
//           // hasRAM = true
//           // ramName = `${regName.toString()}`
//         }
//       }
//     }

//     // using registers
//     /*
//     if (hasRAM && hasRW) {
//       this.addRegister({
//         d: `${ramName}_wdata`,
//         clk: 'clk',
//         reset: 'rst_b',
//         en: `${ramName}_we`,
//         q: `${ramName}_rdata`
//       })
//       this.addAssign({ in: new Expr(`{${registerName}_field1,${registerName}_field0}`), out: `${ramName}_rdata` })
//     }

//     if (hasROM && hasRW) {
//       this.addRegister({
//         d: `${romName}_wdata`,
//         clk: 'clk',
//         reset: 'rst_b',
//         en: `${romName}_we`,
//         q: `${romName}_rdata`
//       })
//       this.addAssign({ in: new Expr(`{${registerName}_field1,${registerName}_field0}`), out: `${romName}_rdata` })
//     }
//     */
//   }
// }

// import { TL_UL } from 'tssv/lib/interfaces/TileLink'
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

  constructor (params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>) {
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

    this.addInterface('regs', new Memory({
      DATA_WIDTH: regDefs.wordSize || 32,
      ADDR_WIDTH: params.busAddressWidth
    }))

    // Define base signals
    const ADDR = this.addSignal('ADDR', { width: params.busAddressWidth })
    const DATA_WR = this.addSignal('DATA_WR', { width: regDefs.wordSize || 32 })
    const DATA_RD = this.addSignal('DATA_RD', { width: regDefs.wordSize || 32 })
    const RE = this.addSignal('RE', { width: 1 })
    const WE = this.addSignal('WE', { width: 1 })
    this.addSignal('READY', { width: 1 })

    // Create signals and logic for registers
    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const registers = this.regDefs.registers
      const baseAddr = this.regDefs.addrMap[regName]
      const matchExpr = this.addSignal(`${regName}_matchExpr`, { width: 1 })

      // Use original address for logic
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.addAssign({ in: new Expr(`${ADDR.toString()} == ${baseAddr}`), out: matchExpr })

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
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && ${RE.toString()}`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && ${WE.toString()}`), out: WE_Sig })

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
              d: new Expr(`${DATA_WR.toString()}[${field.bitRange[1]}:${field.bitRange[0]}]`),
              clk: 'clk',
              reset: 'rst_b',
              q: fieldSigName,
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
            d: DATA_WR.toString(),
            clk: 'clk',
            reset: 'rst_b',
            q: regName.toString(),
            en: 'WE',
            resetVal: thisReg.reset || 0n
          })
        }
      } else if (thisReg.type === 'RO') {
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && ${RE.toString()}`), out: RE_Sig })
      } else if (thisReg.type === 'WO') {
        const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && ${WE.toString()}`), out: WE_Sig })
        this.IOs[regName.toString()] = {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.addAssign({ in: new Expr(DATA_WR.toString()), out: regName.toString() })
      } else if (thisReg.type === 'ROM') {
        const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 })
        const ROM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth })
        this.addAssign({ in: new Expr(`${matchExpr.toString()} && ${RE.toString()}`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${ADDR.toString()}`), out: ROM_ADDR })
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
          en: 'WE',
          q: DATA_RD.toString()
        })
        this.addRegister({
          d: RE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: 'WE',
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
        this.addAssign({ in: new Expr(`(${ADDR.toString()} & ${DEC_MASK}) == ${baseAddr}`), out: Nmatch })
        this.addAssign({ in: new Expr(`${Nmatch.toString()} && ${RE.toString()}`), out: RE_Sig })
        this.addAssign({ in: new Expr(`${Nmatch.toString()} && ${WE.toString()}`), out: WE_Sig })
        this.addAssign({ in: new Expr(`${ADDR.toString()} & ${PASS_MASK}`), out: RAM_ADDR })
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
          en: 'WE',
          q: DATA_RD.toString()
        })
        this.addRegister({
          d: DATA_WR,
          clk: 'clk',
          reset: 'rst_b',
          en: 'WE',
          q: `${regName}_wdata`
        })
        this.addRegister({
          d: RE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: 'WE',
          q: `${regName}_re`
        })
        this.addRegister({
          d: WE_Sig,
          clk: 'clk',
          reset: 'rst_b',
          en: 'WE',
          q: `${regName}_we`
        })
        this.addRegister({
          d: new Expr('1'), // Assuming a simple write strobe signal
          clk: 'clk',
          reset: 'rst_b',
          en: 'WE',
          q: `${regName}_wstrb`
        })
      }
    }

    // Create a read multiplexer with padded address cases
    // const muxInputs: string[] = []
    // const caseStatements: string[] = []
    // for (const reg in this.regDefs.addrMap) {
    //   const regName = reg
    //   const thisReg: Register = this.regDefs.registers[regName] || {
    //     type: 'RW',
    //     width: regDefs.wordSize
    //   }

    //   if (thisReg.type === 'RW') {
    //     if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
    //       Object.keys(thisReg.fields).forEach((fieldName, index) => {
    //         muxInputs.push(`${regName}_field${index}`)
    //       })
    //     } else {
    //       muxInputs.push(regName.toString())
    //     }
    //   } else if (thisReg.type === 'ROM') {
    //     muxInputs.push(`${regName}_rdata`)
    //   } else if (thisReg.type === 'RAM') {
    //     muxInputs.push(`${regName}_rdata`)
    //   }

    //   // Use padded address only for multiplexer case
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //   const paddedAddr = this.padAddress(regName, params.busAddressWidth || 8)
    //   caseStatements.push(`when (${ADDR.toString()} === ${paddedAddr}) => ${muxInputs.join(', ')}`)
    // }
    // console.log(muxInputs)
    // this.addMux({
    //   in: muxInputs,
    //   sel: ADDR,
    //   out: DATA_RD.toString(),
    //   default: new Expr('0')
    // })
    let casexString =
`
casex(${ADDR.toString()})
`
    for (const regAddr in this.regDefs.addrMap) {
      casexString +=
`
      ${params.busAddressWidth}'b${this.regDefs.addrMap[regAddr.toString()].toString(2)}:
        ${DATA_RD.toString()} = ${regAddr}_rdata;
`
    }
    console.log(casexString)
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

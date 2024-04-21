import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import { TL_UL } from 'tssv/lib/interfaces/TL_UL'

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
  constructor (start?: bigint) {
    this.addr = start || 0n
  }

  next (): bigint {
    const nextAddr = this.addr
    this.addr += 4n
    return nextAddr
  }
}
export interface RegisterBlockDef<T> {
  wordSize: 32 | 64
  addrMap: T
  baseAddress?: bigint
  registers: { [name in keyof T]?: Register }
}

export interface RegisterBlockParameters extends TSSVParameters {
  busInterface?: 'TL_UL'
  endianess?: 'little'
  busIDWidth?: 8
  busAddressWidth?: 32
}

/**
 * This module implements a block of memory mapped control & status
 * registers according to the definitions in the addrMap T, and the
 * register defintions in regDefs
 */
export class RegisterBlock<T> extends Module {
  declare params: RegisterBlockParameters
  regDefs: RegisterBlockDef<T>
  constructor (params: RegisterBlockParameters,
    regDefs: RegisterBlockDef<T>) {
    super({
      // define the default parameter values
      name: params.name,
      busInterface: params.busInterface || 'TL_UL',
      endianess: params.endianess || 'little'
    })
    this.regDefs = regDefs

    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }
    this.addInterface('regs', new TL_UL({
      DW: regDefs.wordSize || 32,
      AIW: params.busIDWidth,
      AW: params.busAddressWidth,
      DIW: params.busIDWidth
    }, 'responder'))

    for (const reg in this.regDefs.addrMap) {
      const regName = reg
      const registers = this.regDefs.registers
      let thisReg: Register = {
        type: 'RW',
        width: regDefs.wordSize
      }
      if (registers[regName] !== undefined) {
        thisReg = registers[regName] || thisReg
      }
      if (thisReg.type === 'RW' ||
          thisReg.type === 'RO' ||
          thisReg.type === 'WO') {
        if (thisReg.fields === undefined) {
          this.IOs[regName.toString()] =
            {
              direction: 'output',
              width: thisReg.width || regDefs.wordSize,
              isSigned: thisReg.isSigned
            }
        } else {
          for (const fieldName in thisReg.fields) {
            const thisField = thisReg.fields[fieldName]
            const width = thisField.bitRange[0] - thisField.bitRange[1] + 1
            this.IOs[fieldName.toString()] =
              {
                direction: 'output',
                width,
                isSigned: thisField.isSigned
              }
          }
        }
      } else if (thisReg.type === 'ROM') {
        if (thisReg.fields !== undefined) throw Error('fields not supported for type ROM')
        this.IOs[`${regName.toString()}_rdata`] =
        {
          direction: 'input',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName.toString()}_re`] =
        {
          direction: 'output',
          width: 1
        }
      } else {
        if (thisReg.fields !== undefined) throw Error('fields not supported for type ROM')
        this.IOs[`${regName.toString()}_rdata`] =
        {
          direction: 'input',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName.toString()}_re`] =
        {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName.toString()}_wdata`] =
        {
          direction: 'output',
          width: thisReg.width || regDefs.wordSize,
          isSigned: thisReg.isSigned
        }
        this.IOs[`${regName.toString()}_we`] =
        {
          direction: 'output',
          width: 1
        }
        this.IOs[`${regName.toString()}_wstrb`] =
        {
          direction: 'output',
          width: Math.ceil((thisReg.width || regDefs.wordSize) / 8)
        }
      }
    }
  }
}

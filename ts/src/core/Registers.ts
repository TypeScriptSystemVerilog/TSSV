import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import { TL_UL } from 'tssv/lib/interfaces/TL_UL'

type RegisterType = 'RO' | 'RW' | 'WO' | 'RAM' | 'ROM' | string
interface Field {
  name: string
  reset?: bigint
  description?: string
  bitRange: [IntRange<0, 255>, IntRange<0, 255>]
}
interface Register {
  type: RegisterType
  reset?: bigint
  description?: string
  size?: bigint
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
  registers?: { [name in keyof T]?: Register }
}

export interface RegisterBlockParameters extends TSSVParameters {
  busInterface?: 'TL_UL'
  endianess?: 'little'
  busIDWidth?: 8
  busAddressWidth?: 32
}

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
  }
}

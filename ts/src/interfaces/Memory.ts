import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

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
          READY: { width: 1 },
          WSTRB: { width: (this.params.ADDR_WIDTH || 32) / 8 }
        }
    this.modports = {
      outward: {
        ADDR: 'input',
        DATA_WR: 'output',
        DATA_RD: 'input',
        WE: 'output',
        RE: 'output',
        READY: 'input',
        WSTRB: 'output'
      },
      inward: {
        ADDR: 'output',
        DATA_WR: 'input',
        DATA_RD: 'output',
        WE: 'input',
        RE: 'input',
        READY: 'output',
        WSTRB: 'input'
      }
    }
  }
}

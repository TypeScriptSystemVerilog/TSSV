import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { Memory } from 'tssv/lib/interfaces/Memory'

export interface APB_to_Memory_Parameters extends TSSVParameters {
  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024
  ADDR_WIDTH?: IntRange<16, 64>
}

/**
 * Converts an APB4 slave port into a Memory master port.
 * Instantiate this as a submodule inside a RegisterBlock when busInterface is 'APB'.
 */
export class APB_to_Memory extends Module {
  declare params: APB_to_Memory_Parameters

  constructor (params: APB_to_Memory_Parameters = {}) {
    super({
      name: params.name || 'APB_to_Memory',
      DATA_WIDTH: params.DATA_WIDTH || 32,
      ADDR_WIDTH: params.ADDR_WIDTH || 32
    })

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }

    this.addInterface('apb', new APB4(
      { DATA_WIDTH: params.DATA_WIDTH || 32, ADDR_WIDTH: params.ADDR_WIDTH || 32 },
      'inward'
    ))

    this.addInterface('mem', new Memory(
      { DATA_WIDTH: params.DATA_WIDTH || 32, ADDR_WIDTH: params.ADDR_WIDTH || 32 },
      'outward'
    ))

    // Address and write data pass straight through
    this.addAssign({ in: new Expr('apb.PADDR'), out: 'mem.ADDR' })
    this.addAssign({ in: new Expr('apb.PWDATA'), out: 'mem.DATA_WR' })
    this.addAssign({ in: new Expr('apb.PSTRB'), out: 'mem.WSTRB' })

    // Read data and ready pass back to APB master
    this.addAssign({ in: new Expr('mem.DATA_RD'), out: 'apb.PRDATA' })
    this.addAssign({ in: new Expr('apb.PSELx & apb.PENABLE'), out: 'apb.PREADY' })

    // No error conditions in a simple register block
    this.addAssign({ in: new Expr("1'b0"), out: 'apb.PSLVERR' })

    // Generate WE and RE from APB handshake signals
    this.addAssign({ in: new Expr('apb.PSELx & apb.PENABLE & apb.PWRITE'), out: 'mem.WE' })
    this.addAssign({ in: new Expr('apb.PSELx & apb.PENABLE & ~apb.PWRITE'), out: 'mem.RE' })
  }
}

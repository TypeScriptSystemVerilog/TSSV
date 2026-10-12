import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { Memory } from 'tssv/lib/interfaces/Memory'

export interface APB_to_Memory_Parameters extends TSSVParameters {
  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024
  ADDR_WIDTH?: IntRange<16, 64>
}

/**
 * Converts an APB4 slave port into a Memory master port. It issues the Memory request in the
 * APB setup phase and ends the access phase when the slave's `READY` is high, so a zero-wait
 * slave completes with no APB wait states. See {@link Memory} for the Memory contract.
 * Instantiate this as a submodule inside a RegisterBlock when busInterface is 'APB'.
 *
 * @see doc/modules/APB_to_Memory/APB_to_Memory-spec.md
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

    // Address, write data and strobes pass straight through. APB holds them from the setup
    // phase to the end of the access phase, which is the hold the Memory contract asks for.
    this.addAssign({ in: new Expr('apb.PADDR'), out: 'mem.ADDR' })
    this.addAssign({ in: new Expr('apb.PWDATA'), out: 'mem.DATA_WR' })
    this.addAssign({ in: new Expr('apb.PSTRB'), out: 'mem.WSTRB' })

    // The Memory request is a one-cycle pulse in the APB setup phase, so the slave captures it
    // on the edge that starts the access phase
    this.addAssign({ in: new Expr('apb.PSELx & ~apb.PENABLE & apb.PWRITE'), out: 'mem.WE' })
    this.addAssign({ in: new Expr('apb.PSELx & ~apb.PENABLE & ~apb.PWRITE'), out: 'mem.RE' })

    // The access phase ends when the slave's access settles. A zero-wait slave keeps READY
    // high, so the transfer has no APB wait states; read data is valid while READY is high
    this.addAssign({ in: new Expr('mem.READY'), out: 'apb.PREADY' })
    this.addAssign({ in: new Expr('mem.DATA_RD'), out: 'apb.PRDATA' })

    // No error conditions in a simple register block
    this.addAssign({ in: new Expr("1'b0"), out: 'apb.PSLVERR' })
  }
}

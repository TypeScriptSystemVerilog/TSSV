import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the APB4 TSSV Interface bundle
 */
export interface APB4_Parameters extends TSSVParameters {
  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024

  ADDR_WIDTH?: IntRange<16, 64>
}

export interface APB4_Signals extends Signals {
  PCLK: { width: 1 }
  PRESETn: { width: 1 }
  PADDR: Signal
  PSELx: { width: 1 }
  PENABLE: { width: 1 }
  PWRITE: { width: 1 }
  PRDATA: Signal
  PWDATA: Signal
  PPROT: { width: 3 }
  PSTRB: Signal
  PREADY: { width: 1 }
  PSLVERR: { width: 1 }
  PCLKEN: { width: 1 }
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type APB4_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the APB4 protocol
 */
export class APB4 extends Interface {
  declare params: APB4_Parameters
  declare signals: APB4_Signals
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'APB4',
    version: 'r0p0_0'
  }

  /**
   * Create a new APB4 Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: APB4_Parameters = {}, role: APB4_Role = undefined) {
    super(
      'APB4',
      {
        ADDR_WIDTH: params.ADDR_WIDTH || 32,
        DATA_WIDTH: params.DATA_WIDTH || 32
      },
      role
    )
    this.signals = {
      PCLK: { width: 1 },
      PRESETn: { width: 1 },
      PADDR: { width: params.ADDR_WIDTH || 32 },
      PSELx: { width: 1 },
      PENABLE: { width: 1 },
      PWRITE: { width: 1 },
      PRDATA: { width: params.DATA_WIDTH || 32 },
      PWDATA: { width: params.DATA_WIDTH || 32 },
      PPROT: { width: 3 },
      PSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
      PREADY: { width: 1 },
      PSLVERR: { width: 1 },
      PCLKEN: { width: 1 }
    }
    this.modports = {
      outward: {
        PCLK: 'input',
        PRESETn: 'input',
        PADDR: 'output',
        PSELx: 'output',
        PENABLE: 'output',
        PWRITE: 'output',
        PRDATA: 'input',
        PWDATA: 'output',
        PPROT: 'output',
        PSTRB: 'output',
        PREADY: 'input',
        PSLVERR: 'input',
        PCLKEN: 'input'
      },
      inward: {
        PCLK: 'input',
        PRESETn: 'input',
        PADDR: 'input',
        PSELx: 'input',
        PENABLE: 'input',
        PWRITE: 'input',
        PRDATA: 'output',
        PWDATA: 'input',
        PPROT: 'input',
        PSTRB: 'input',
        PREADY: 'output',
        PSLVERR: 'output',
        PCLKEN: 'input'
      }
    }
  }
}

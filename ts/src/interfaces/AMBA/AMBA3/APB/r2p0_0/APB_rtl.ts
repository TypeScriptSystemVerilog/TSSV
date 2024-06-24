import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the APB_rtl TSSV Interface bundle
 */
export interface APB_rtl_Parameters extends TSSVParameters {
  /**
   * Defines the bit width of the source identifier signal
   */
  AIW?: IntRange<1, 32>
  /**
   * Defines the bit width of the address signal
   */
  AW?: IntRange<8, 64>
  /**
   * Defines the bit width of the sink identifier signal
   */
  DIW?: IntRange<1, 32>
  /**
   * Defines the data bus width
   */
  DW?: 32 | 64
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type APB_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the APB_rtl protocol
 */
export class APB_rtl extends Interface {
  declare params: APB_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'APB_rtl',
    version: 'r2p0_0'
  }

  /**
   * Create a new APB_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: APB_rtl_Parameters = {}, role: APB_rtl_Role = undefined) {
    super(
      'APB_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      PCLK: { width: 1 },
      PRESETn: { width: 1 },
      PADDR: { width: params.AW || 32 },
      PSELx: { width: 1 },
      PENABLE: { width: 1 },
      PWRITE: { width: 1 },
      PRDATA: { width: params.DW || 32 },
      PWDATA: { width: params.DW || 32 },
      PREADY: { width: 1 },
      PSLVERR: { width: 1 },
      PCLKEN: { width: 1 }
    }
    this.modports = {
      master: {
        PCLK: 'input',
        PRESETn: 'input',
        PADDR: 'output',
        PSELx: 'output',
        PENABLE: 'output',
        PWRITE: 'output',
        PRDATA: 'input',
        PWDATA: 'output',
        PREADY: 'input',
        PSLVERR: 'input',
        PCLKEN: 'input'
      },
      slave: {
        PCLK: 'input',
        PRESETn: 'input',
        PADDR: 'input',
        PSELx: 'input',
        PENABLE: 'input',
        PWRITE: 'input',
        PRDATA: 'output',
        PWDATA: 'input',
        PREADY: 'output',
        PSLVERR: 'output',
        PCLKEN: 'input'
      }
    }
  }
}

import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the GFB_rtl TSSV Interface bundle
 */
export interface GFB_rtl_Parameters extends TSSVParameters {
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
export type GFB_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the GFB_rtl protocol
 */
export class GFB_rtl extends Interface {
  declare params: GFB_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA5',
    name: 'GFB_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new GFB_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: GFB_rtl_Parameters = {}, role: GFB_rtl_Role = undefined) {
    super(
      'GFB_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      FCLK: { width: 1 },
      FCLKEN: { width: 1 },
      FRESETn: { width: 1 },
      FADDR: { width: params.AW || 32 },
      FCMD: { width: 3 },
      FWDATA: { width: params.DW || 32 },
      FABORT: { width: 1 },
      FRDATA: { width: params.DW || 32 },
      FREADY: { width: 1 },
      FRESP: { width: 1 }
    }
    this.modports = {
      master: {
        FCLK: 'input',
        FCLKEN: 'input',
        FRESETn: 'input',
        FADDR: 'output',
        FCMD: 'output',
        FWDATA: 'output',
        FABORT: 'output',
        FRDATA: 'input',
        FREADY: 'input',
        FRESP: 'input'
      },
      slave: {
        FCLK: 'input',
        FCLKEN: 'input',
        FRESETn: 'input',
        FADDR: 'input',
        FCMD: 'input',
        FWDATA: 'input',
        FABORT: 'input',
        FRDATA: 'output',
        FREADY: 'output',
        FRESP: 'output'
      }
    }
  }
}

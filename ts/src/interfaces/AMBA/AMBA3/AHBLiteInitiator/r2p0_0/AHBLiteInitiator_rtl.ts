import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AHBLiteInitiator_rtl TSSV Interface bundle
 */
export interface AHBLiteInitiator_rtl_Parameters extends TSSVParameters {
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
export type AHBLiteInitiator_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the AHBLiteInitiator_rtl protocol
 */
export class AHBLiteInitiator_rtl extends Interface {
  declare params: AHBLiteInitiator_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'AHBLiteInitiator_rtl',
    version: 'r2p0_0'
  }

  /**
   * Create a new AHBLiteInitiator_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AHBLiteInitiator_rtl_Parameters = {}, role: AHBLiteInitiator_rtl_Role = undefined) {
    super(
      'AHBLiteInitiator_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      HCLK: { width: 1 },
      HCLKEN: { width: 1 },
      HRESETn: { width: 1 },
      HADDR: { width: params.AW || 32 },
      HBURST: { width: 3 },
      HMASTLOCK: { width: 1 },
      HPROT: { width: 4 },
      HSIZE: { width: 3 },
      HTRANS: { width: 2 },
      HWDATA: { width: params.DW || 32 },
      HWRITE: { width: 1 },
      HRDATA: { width: params.DW || 32 },
      HREADYOUT: { width: params.DIW || 8 },
      HRESP: { width: 1 },
      HSELx: { width: params.DIW || 8 },
      HREADY: { width: 1 },
      HRUSER: { width: params.DIW || 8 },
      HWUSER: { width: params.DIW || 8 },
      HAUSER: { width: params.DIW || 8 }
    }
    this.modports = {
      master: {
        HCLK: 'input',
        HCLKEN: 'input',
        HRESETn: 'input',
        HADDR: 'output',
        HBURST: 'output',
        HMASTLOCK: 'output',
        HPROT: 'output',
        HSIZE: 'output',
        HTRANS: 'output',
        HWDATA: 'output',
        HWRITE: 'output',
        HRDATA: 'input',
        HRESP: 'input',
        HREADY: 'input',
        HRUSER: 'input',
        HWUSER: 'output',
        HAUSER: 'output'
      },
      slave: {
        HCLK: 'input',
        HCLKEN: 'input',
        HRESETn: 'input',
        HADDR: 'input',
        HBURST: 'input',
        HMASTLOCK: 'input',
        HPROT: 'input',
        HSIZE: 'input',
        HTRANS: 'input',
        HWDATA: 'input',
        HWRITE: 'input',
        HRDATA: 'output',
        HRESP: 'output',
        HREADY: 'output',
        HRUSER: 'output',
        HWUSER: 'input',
        HAUSER: 'input'
      }
    }
  }
}

import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AHBLiteTarget TSSV Interface bundle
 */
export interface AHBLiteTarget_Parameters extends TSSVParameters {

  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024

  ADDR_WIDTH?: IntRange<16, 64>

  USER_WIDTH?: IntRange<0, 64>

  SLAVES?: number
}

export interface AHBLiteTarget_Signals extends Signals {
  HCLK: { width: 1 }
  HCLKEN: { width: 1 }
  HRESETn: { width: 1 }
  HADDR: Signal
  HBURST: { width: 3 }
  HMASTLOCK: { width: 1 }
  HPROT: { width: 4 }
  HSIZE: { width: 3 }
  HTRANS: { width: 2 }
  HWDATA: Signal
  HWRITE: { width: 1 }
  HRDATA: Signal
  HREADYOUT: { width: 1 }
  HRESP: { width: 1 }
  HSELx: { width: 1 }
  HREADY: { width: 1 }
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AHBLiteTarget_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the AHBLiteTarget protocol
 */
export class AHBLiteTarget extends Interface {
  declare params: AHBLiteTarget_Parameters
  declare signals: AHBLiteTarget_Signals
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'AHBLiteTarget',
    version: 'r2p0_0'
  }

  /**
   * Create a new AHBLiteTarget Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AHBLiteTarget_Parameters = {}, role: AHBLiteTarget_Role = undefined) {
    super(
      'AHBLiteTarget',
      {
        DATA_WIDTH: params.DATA_WIDTH || 32,
        ADDR_WIDTH: params.ADDR_WIDTH || 32,
        USER_WIDTH: params.USER_WIDTH || 0,
        SLAVES: params.SLAVES || 0
      },
      role
    )
    this.signals = {
      HCLK: { width: 1 },
      HCLKEN: { width: 1 },
      HRESETn: { width: 1 },
      HADDR: { width: params.ADDR_WIDTH || 32 },
      HBURST: { width: 3 },
      HMASTLOCK: { width: 1 },
      HPROT: { width: 4 },
      HSIZE: { width: 3 },
      HTRANS: { width: 2 },
      HWDATA: { width: params.DATA_WIDTH || 32 },
      HWRITE: { width: 1 },
      HRDATA: { width: params.DATA_WIDTH || 32 },
      HREADYOUT: { width: 1 },
      HRESP: { width: 1 },
      HSELx: { width: 1 },
      HREADY: { width: 1 }
    }
    if ((params.USER_WIDTH || 0) > 0) {
      this.signals.HRUSER = { width: params.USER_WIDTH }
      this.signals.HWUSER = { width: params.USER_WIDTH }
      this.signals.HAUSER = { width: params.USER_WIDTH }
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
        HREADYOUT: 'input',
        HRESP: 'input',
        HSELx: 'output',
        HREADY: 'output',
        HRUSER: 'input',
        HWUSER: 'output',
        HAUSER: 'output'
      }
    }
    if ((params.USER_WIDTH || 0) > 0) {
      this.modports.outward = {
        ...this.modports.outward,
        HRUSER: 'input',
        HWUSER: 'output',
        HAUSER: 'output'
      }
    }

    this.modports.inward = Object.fromEntries(
      Object.entries(this.modports.outward).map(([key, value]) =>
        [key, (value === 'input') ? 'output' : 'input']))
  }
}

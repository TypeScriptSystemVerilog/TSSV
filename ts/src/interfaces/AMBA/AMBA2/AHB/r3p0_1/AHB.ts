import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AHB TSSV Interface bundle
 */
export interface AHB_Parameters extends TSSVParameters {

  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024

  HPROT_WIDTH?: IntRange<4, 6>

  HRESP_WIDTH?: 1 | 2

  USER_WIDTH?: IntRange<0, 64>

  MASTERS?: number
}

export interface AHB_Signals extends Signals {
  HCLK: { width: 1 }
  HCLKEN: { width: 1 }
  HRESETn: { width: 1 }
  HADDR: { width: 32 }
  HBURST: { width: 3 }
  HMASTLOCK: { width: 1 }
  HPROT: Signal
  HSIZE: { width: 3 }
  HTRANS: { width: 2 }
  HWDATA: Signal
  HWRITE: { width: 1 }
  HRDATA: Signal
  HREADYOUT: { width: 1 }
  HRESP: Signal
  HSELx: { width: 1 }
  HREADY: { width: 1 }
  HBUSREQ: { width: 1 }
  HLOCK: { width: 1 }
  HGRANT: { width: 1 }
  HMASTER: Signal
  HSPLIT: Signal
  HBSTRB: Signal
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AHB_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the AHB protocol
 */
export class AHB extends Interface {
  declare params: AHB_Parameters
  declare signals: AHB_Signals
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA2',
    name: 'AHB',
    version: 'r3p0_1'
  }

  /**
   * Create a new AHB Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AHB_Parameters = {}, role: AHB_Role = undefined) {
    super(
      'AHB',
      {
        DATA_WIDTH: params.DATA_WIDTH || 32,
        HPROT_WIDTH: params.HPROT_WIDTH || 4,
        HRESP_WIDTH: params.HRESP_WIDTH || 1,
        USER_WIDTH: params.USER_WIDTH || 0,
        MASTERS: params.MASTERS || 0
      },
      role
    )
    this.signals = {
      HCLK: { width: 1 },
      HCLKEN: { width: 1 },
      HRESETn: { width: 1 },
      HADDR: { width: 32 },
      HBURST: { width: 3 },
      HMASTLOCK: { width: 1 },
      HPROT: { width: params.HPROT_WIDTH || 4 },
      HSIZE: { width: 3 },
      HTRANS: { width: 2 },
      HWDATA: { width: params.DATA_WIDTH || 32 },
      HWRITE: { width: 1 },
      HRDATA: { width: params.DATA_WIDTH || 32 },
      HREADYOUT: { width: 1 },
      HRESP: { width: params.HRESP_WIDTH || 1 },
      HSELx: { width: 1 },
      HREADY: { width: 1 },
      HBUSREQ: { width: 1 },
      HLOCK: { width: 1 },
      HGRANT: { width: 1 },
      HMASTER: { width: (params.MASTERS) ? Math.ceil(Math.log2(params.MASTERS)) : 0 },
      HSPLIT: { width: params.MASTERS || 1 },
      HBSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 }
    }
    if ((params.USER_WIDTH || 0) > 0) {
      this.signals.HRUSER = { width: params.USER_WIDTH }
      this.signals.HWUSER = { width: params.USER_WIDTH }
      this.signals.HAUSER = { width: params.USER_WIDTH }
    }
    this.modports = {
      outward: {
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
        HBUSREQ: 'output',
        HLOCK: 'output',
        HGRANT: 'input',
        HMASTER: 'input',
        HBSTRB: 'output',
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

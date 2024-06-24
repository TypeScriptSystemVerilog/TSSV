import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AHB5Initiator_rtl TSSV Interface bundle
 */
export interface AHB5Initiator_rtl_Parameters extends TSSVParameters {
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
export type AHB5Initiator_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the AHB5Initiator_rtl protocol
 */
export class AHB5Initiator_rtl extends Interface {
  declare params: AHB5Initiator_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA5',
    name: 'AHB5Initiator_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new AHB5Initiator_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AHB5Initiator_rtl_Parameters = {}, role: AHB5Initiator_rtl_Role = undefined) {
    super(
      'AHB5Initiator_rtl',
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
      HBURST: { width: params.DIW || 8 },
      HMASTLOCK: { width: 1 },
      HPROT: { width: params.DIW || 8 },
      HSIZE: { width: 3 },
      HNONSEC: { width: 1 },
      HEXCL: { width: 1 },
      HMASTER: { width: params.DIW || 8 },
      HTRANS: { width: 2 },
      HWRITE: { width: 1 },
      HWDATA: { width: params.DW || 32 },
      HWSTRB: { width: params.DIW || 8 },
      HRDATA: { width: params.DW || 32 },
      HREADY: { width: 1 },
      HRESP: { width: 1 },
      HEXOKAY: { width: 1 },
      HAUSER: { width: params.DIW || 8 },
      HWUSER: { width: params.DIW || 8 },
      HRUSER: { width: params.DIW || 8 },
      HBUSER: { width: params.DIW || 8 },
      HTRANSCHK: { width: 1 },
      HADDRCHK: { width: params.DIW || 8 },
      HCTRLCHK1: { width: 1 },
      HCTRLCHK2: { width: 1 },
      HPROTCHK: { width: 1 },
      HWSTRBCHK: { width: params.DIW || 8 },
      HWDATACHK: { width: params.DIW || 8 },
      HRDATACHK: { width: params.DIW || 8 },
      HREADYCHK: { width: 1 },
      HRESPCHK: { width: 1 },
      HAUSERCHK: { width: params.DIW || 8 },
      HRUSERCHK: { width: params.DIW || 8 },
      HWUSERCHK: { width: params.DIW || 8 },
      HBUSERCHK: { width: params.DIW || 8 }
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
        HNONSEC: 'output',
        HEXCL: 'output',
        HMASTER: 'output',
        HTRANS: 'output',
        HWRITE: 'output',
        HWDATA: 'output',
        HWSTRB: 'output',
        HRDATA: 'input',
        HREADY: 'input',
        HRESP: 'input',
        HEXOKAY: 'input',
        HAUSER: 'output',
        HWUSER: 'output',
        HRUSER: 'input',
        HBUSER: 'input',
        HTRANSCHK: 'output',
        HADDRCHK: 'output',
        HCTRLCHK1: 'output',
        HCTRLCHK2: 'output',
        HPROTCHK: 'output',
        HWSTRBCHK: 'output',
        HWDATACHK: 'output',
        HRDATACHK: 'input',
        HREADYCHK: 'input',
        HRESPCHK: 'input',
        HAUSERCHK: 'output',
        HRUSERCHK: 'input',
        HWUSERCHK: 'output',
        HBUSERCHK: 'input'
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
        HNONSEC: 'input',
        HEXCL: 'input',
        HMASTER: 'input',
        HTRANS: 'input',
        HWRITE: 'input',
        HWDATA: 'input',
        HWSTRB: 'input',
        HRDATA: 'output',
        HREADY: 'output',
        HRESP: 'output',
        HEXOKAY: 'output',
        HAUSER: 'input',
        HWUSER: 'input',
        HRUSER: 'output',
        HBUSER: 'output',
        HTRANSCHK: 'input',
        HADDRCHK: 'input',
        HCTRLCHK1: 'input',
        HCTRLCHK2: 'input',
        HPROTCHK: 'input',
        HWSTRBCHK: 'input',
        HWDATACHK: 'input',
        HRDATACHK: 'output',
        HREADYCHK: 'output',
        HRESPCHK: 'output',
        HAUSERCHK: 'input',
        HRUSERCHK: 'output',
        HWUSERCHK: 'input',
        HBUSERCHK: 'output'
      }
    }
  }
}

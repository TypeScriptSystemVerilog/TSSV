import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AXI_rtl TSSV Interface bundle
 */
export interface AXI_rtl_Parameters extends TSSVParameters {
  AWID_WIDTH?: IntRange<1, 16>

  WID_WIDTH?: IntRange<1, 16>

  BID_WIDTH?: IntRange<1, 16>

  ARID_WIDTH?: IntRange<1, 16>

  RID_WIDTH?: IntRange<1, 16>

  ADDR_WIDTH?: IntRange<16, 64>

  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512

  BURST_LEN_WIDTH?: IntRange<1, 16>

  USER_WIDTH?: IntRange<1, 64>

  RESP_WIDTH?: IntRange<2, 4>

  QOS?: 'true' | 'false'
}

/**
 * Defines the role of the Interface instance
 * outward is used in module port interfaces that are transaction initiators
 * inward is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI_rtl_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the AXI_rtl protocol
 */
export class AXI_rtl extends Interface {
  declare params: AXI_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'AXI_rtl',
    version: 'r2p0_0'
  }

  /**
   * Create a new AXI_rtl Interface bundle with either outward or inward port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose outward or inward port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AXI_rtl_Parameters = {}, role: AXI_rtl_Role = undefined) {
    super(
      'AXI_rtl',
      {
        AWID_WIDTH: params.AWID_WIDTH || 4,
        WID_WIDTH: params.WID_WIDTH || 4,
        BID_WIDTH: params.BID_WIDTH || 4,
        ARID_WIDTH: params.ARID_WIDTH || 4,
        RID_WIDTH: params.RID_WIDTH || 4,
        ADDR_WIDTH: params.ADDR_WIDTH || 32,
        DATA_WIDTH: params.DATA_WIDTH || 32,
        USER_WIDTH: params.USER_WIDTH || 0
      },
      role
    )
    this.signals = {
      ACLK: { width: 1 },
      ACLKEN: { width: 1 },
      ARESETn: { width: 1 },
      AWID: { width: params.AWID_WIDTH || 4 },
      AWADDR: { width: params.ADDR_WIDTH || 32 },
      AWLEN: { width: 4 },
      AWSIZE: { width: 3 },
      AWBURST: { width: 2 },
      AWLOCK: { width: 2 },
      AWCACHE: { width: 4 },
      AWPROT: { width: 3 },
      AWVALID: { width: 1 },
      AWREADY: { width: 1 },
      WID: { width: params.WID_WIDTH || 8 },
      WDATA: { width: params.DATA_WIDTH || 32 },
      WSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
      WLAST: { width: 1 },
      WVALID: { width: 1 },
      WREADY: { width: 1 },
      BID: { width: params.BID_WIDTH || 8 },
      BRESP: { width: 2 },
      BVALID: { width: 1 },
      BREADY: { width: 1 },
      ARID: { width: params.ARID_WIDTH || 8 },
      ARADDR: { width: params.ADDR_WIDTH || 32 },
      ARLEN: { width: 4 },
      ARSIZE: { width: 3 },
      ARBURST: { width: 2 },
      ARLOCK: { width: 2 },
      ARCACHE: { width: 4 },
      ARPROT: { width: 3 },
      ARVALID: { width: 1 },
      ARREADY: { width: 1 },
      RID: { width: params.RID_WIDTH || 8 },
      RDATA: { width: params.DATA_WIDTH || 32 },
      RRESP: { width: 2 },
      RLAST: { width: 1 },
      RVALID: { width: 1 },
      RREADY: { width: 1 },
      AWUSER: { width: params.USER_WIDTH || 0 },
      WUSER: { width: params.USER_WIDTH || 0 },
      BUSER: { width: params.USER_WIDTH || 0 },
      ARUSER: { width: params.USER_WIDTH || 0 },
      RUSER: { width: params.USER_WIDTH || 0 },
      ACLKCHK: { width: 1 },
      ACLKENCHK: { width: 1 },
      ARESETnCHK: { width: 1 },
      AWIDCHK: { width: params.AWID_WIDTH || 8 },
      AWADDRCHK: { width: params.ADDR_WIDTH || 8 },
      AWLENCHK: { width: params.BURST_LEN_WIDTH || 8 },
      AWVALIDCHK: { width: 1 },
      AWREADYCHK: { width: 1 },
      WIDCHK: { width: params.WID_WIDTH || 8 },
      WDATACHK: { width: params.DATA_WIDTH || 8 },
      WSTRBCHK: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
      WLASTCHK: { width: 1 },
      WVALIDCHK: { width: 1 },
      WREADYCHK: { width: 1 },
      BIDCHK: { width: params.BID_WIDTH || 8 },
      BRESPCHK: { width: params.RESP_WIDTH || 2 },
      BVALIDCHK: { width: 1 },
      BREADYCHK: { width: 1 },
      ARIDCHK: { width: params.ARID_WIDTH || 8 },
      ARADDRCHK: { width: params.ADDR_WIDTH || 8 },
      ARLENCHK: { width: params.BURST_LEN_WIDTH || 8 },
      ARVALIDCHK: { width: 1 },
      ARREADYCHK: { width: 1 },
      RIDCHK: { width: params.RID_WIDTH || 8 },
      RDATACHK: { width: params.DATA_WIDTH || 8 },
      RRESPCHK: { width: params.RESP_WIDTH || 8 },
      RLASTCHK: { width: 1 },
      RVALIDCHK: { width: 1 },
      RREADYCHK: { width: 1 },
      AWUSERCHK: { width: params.USER_WIDTH || 0 },
      WUSERCHK: { width: params.USER_WIDTH || 0 },
      BUSERCHK: { width: params.USER_WIDTH || 0 },
      ARUSERCHK: { width: params.USER_WIDTH || 0 },
      RUSERCHK: { width: params.USER_WIDTH || 0 },
      AWCTLCHK0: { width: 1 },
      AWCTLCHK1: { width: 1 },
      ARCTLCHK0: { width: 1 },
      ARCTLCHK1: { width: 1 }
    }
    // Add ARQOS and AWQOS if QOS is true
    if (params.QOS === 'true') {
      this.signals.ARQOS = { width: 4 }
      this.signals.AWQOS = { width: 4 }
    }
    this.modports = {
      outward: {
        ACLK: 'input',
        ACLKEN: 'input',
        ARESETn: 'input',
        AWID: 'output',
        AWADDR: 'output',
        AWLEN: 'output',
        AWSIZE: 'output',
        AWBURST: 'output',
        AWLOCK: 'output',
        AWCACHE: 'output',
        AWPROT: 'output',
        AWVALID: 'output',
        AWREADY: 'input',
        WID: 'output',
        WDATA: 'output',
        WSTRB: 'output',
        WLAST: 'output',
        WVALID: 'output',
        WREADY: 'input',
        BID: 'input',
        BRESP: 'input',
        BVALID: 'input',
        BREADY: 'output',
        ARID: 'output',
        ARADDR: 'output',
        ARLEN: 'output',
        ARSIZE: 'output',
        ARBURST: 'output',
        ARLOCK: 'output',
        ARCACHE: 'output',
        ARPROT: 'output',
        ARVALID: 'output',
        ARREADY: 'input',
        RID: 'input',
        RDATA: 'input',
        RRESP: 'input',
        RLAST: 'input',
        RVALID: 'input',
        RREADY: 'output',
        AWUSER: 'output',
        WUSER: 'output',
        BUSER: 'input',
        ARUSER: 'output',
        RUSER: 'input',
        ACLKCHK: 'input',
        ACLKENCHK: 'input',
        ARESETnCHK: 'input',
        AWIDCHK: 'output',
        AWADDRCHK: 'output',
        AWLENCHK: 'output',
        AWVALIDCHK: 'output',
        AWREADYCHK: 'input',
        WIDCHK: 'output',
        WDATACHK: 'output',
        WSTRBCHK: 'output',
        WLASTCHK: 'output',
        WVALIDCHK: 'output',
        WREADYCHK: 'input',
        BIDCHK: 'input',
        BRESPCHK: 'input',
        BVALIDCHK: 'input',
        BREADYCHK: 'output',
        ARIDCHK: 'output',
        ARADDRCHK: 'output',
        ARLENCHK: 'output',
        ARVALIDCHK: 'output',
        ARREADYCHK: 'input',
        RIDCHK: 'input',
        RDATACHK: 'input',
        RRESPCHK: 'input',
        RLASTCHK: 'input',
        RVALIDCHK: 'input',
        RREADYCHK: 'output',
        AWUSERCHK: 'output',
        WUSERCHK: 'output',
        BUSERCHK: 'input',
        ARUSERCHK: 'output',
        RUSERCHK: 'input',
        AWCTLCHK0: 'output',
        AWCTLCHK1: 'output',
        ARCTLCHK0: 'output',
        ARCTLCHK1: 'output'
      },
      inward: {
        ACLK: 'input',
        ACLKEN: 'input',
        ARESETn: 'input',
        AWID: 'input',
        AWADDR: 'input',
        AWLEN: 'input',
        AWSIZE: 'input',
        AWBURST: 'input',
        AWLOCK: 'input',
        AWCACHE: 'input',
        AWPROT: 'input',
        AWVALID: 'input',
        AWREADY: 'output',
        WID: 'input',
        WDATA: 'input',
        WSTRB: 'input',
        WLAST: 'input',
        WVALID: 'input',
        WREADY: 'output',
        BID: 'output',
        BRESP: 'output',
        BVALID: 'output',
        BREADY: 'input',
        ARID: 'input',
        ARADDR: 'input',
        ARLEN: 'input',
        ARSIZE: 'input',
        ARBURST: 'input',
        ARLOCK: 'input',
        ARCACHE: 'input',
        ARPROT: 'input',
        ARVALID: 'input',
        ARREADY: 'output',
        RID: 'output',
        RDATA: 'output',
        RRESP: 'output',
        RLAST: 'output',
        RVALID: 'output',
        RREADY: 'input',
        AWUSER: 'input',
        WUSER: 'input',
        BUSER: 'output',
        ARUSER: 'input',
        RUSER: 'output',
        ACLKCHK: 'input',
        ACLKENCHK: 'input',
        ARESETnCHK: 'input',
        AWIDCHK: 'input',
        AWADDRCHK: 'input',
        AWLENCHK: 'input',
        AWVALIDCHK: 'input',
        AWREADYCHK: 'output',
        WIDCHK: 'input',
        WDATACHK: 'input',
        WSTRBCHK: 'input',
        WLASTCHK: 'input',
        WVALIDCHK: 'input',
        WREADYCHK: 'output',
        BIDCHK: 'output',
        BRESPCHK: 'output',
        BVALIDCHK: 'output',
        BREADYCHK: 'input',
        ARIDCHK: 'input',
        ARADDRCHK: 'input',
        ARLENCHK: 'input',
        ARVALIDCHK: 'input',
        ARREADYCHK: 'output',
        RIDCHK: 'output',
        RDATACHK: 'output',
        RRESPCHK: 'output',
        RLASTCHK: 'output',
        RVALIDCHK: 'output',
        RREADYCHK: 'input',
        AWUSERCHK: 'input',
        WUSERCHK: 'input',
        BUSERCHK: 'output',
        ARUSERCHK: 'input',
        RUSERCHK: 'output',
        AWCTLCHK0: 'input',
        AWCTLCHK1: 'input',
        ARCTLCHK0: 'input',
        ARCTLCHK1: 'input'
      }
    }
    // Add modports for QOS signals if QOS is true
    if (params.QOS === 'true') {
      this.modports.outward.ARQOS = 'output' // input
      this.modports.outward.AWQOS = 'output' // input
      this.modports.inward.ARQOS = 'input' // output
      this.modports.inward.AWQOS = 'input' // output
    }
  }
}

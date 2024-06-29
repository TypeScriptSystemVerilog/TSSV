import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the ACE_rtl TSSV Interface bundle
 */
export interface ACE_rtl_Parameters extends TSSVParameters {
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
export type ACE_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the ACE_rtl protocol
 */
export class ACE_rtl extends Interface {
  declare params: ACE_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'ACE_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new ACE_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: ACE_rtl_Parameters = {}, role: ACE_rtl_Role = undefined) {
    super(
      'ACE_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      ACLK: { width: 1 },
      ACLKEN: { width: 1 },
      ARESETn: { width: 1 },
      AWID: { width: params.DIW || 8 },
      AWADDR: { width: params.AW || 32 },
      AWREGION: { width: 4 },
      AWDOMAIN: { width: 2 },
      AWSNOOP: { width: 3 },
      AWBAR: { width: 2 },
      AWUNIQUE: { width: 1 },
      AWLEN: { width: 8 },
      AWSIZE: { width: 3 },
      AWBURST: { width: 2 },
      AWLOCK: { width: 1 },
      AWCACHE: { width: 4 },
      AWPROT: { width: 3 },
      AWQOS: { width: 4 },
      AWVALID: { width: 1 },
      AWREADY: { width: 1 },
      WDATA: { width: params.DW || 32 },
      WSTRB: { width: params.DIW || 8 },
      WLAST: { width: 1 },
      WVALID: { width: 1 },
      WREADY: { width: 1 },
      BID: { width: params.DIW || 8 },
      BRESP: { width: 2 },
      BVALID: { width: 1 },
      BREADY: { width: 1 },
      ARID: { width: params.DIW || 8 },
      ARADDR: { width: params.AW || 32 },
      ARREGION: { width: 4 },
      ARDOMAIN: { width: 2 },
      ARSNOOP: { width: 4 },
      ARBAR: { width: 2 },
      ARLEN: { width: 8 },
      ARSIZE: { width: 3 },
      ARBURST: { width: 2 },
      ARLOCK: { width: 1 },
      ARCACHE: { width: 4 },
      ARPROT: { width: 3 },
      ARQOS: { width: 4 },
      ARVALID: { width: 1 },
      ARREADY: { width: 1 },
      RID: { width: params.DIW || 8 },
      RDATA: { width: params.DW || 32 },
      RRESP: { width: 4 },
      RLAST: { width: 1 },
      RVALID: { width: 1 },
      RREADY: { width: 1 },
      ACADDR: { width: params.AW || 32 },
      ACSNOOP: { width: 4 },
      ACPROT: { width: 3 },
      ACVALID: { width: 1 },
      ACREADY: { width: 1 },
      CRRESP: { width: 5 },
      CRVALID: { width: 1 },
      CRREADY: { width: 1 },
      CDDATA: { width: params.DW || 32 },
      CDLAST: { width: 1 },
      CDVALID: { width: 1 },
      CDREADY: { width: 1 },
      RACK: { width: 1 },
      WACK: { width: 1 },
      AWUSER: { width: params.DIW || 8 },
      WUSER: { width: params.DIW || 8 },
      BUSER: { width: params.DIW || 8 },
      ARUSER: { width: params.DIW || 8 },
      RUSER: { width: params.DIW || 8 }
    }
    this.modports = {
      master: {
        ACLK: 'input',
        ACLKEN: 'input',
        ARESETn: 'input',
        AWID: 'output',
        AWADDR: 'output',
        AWREGION: 'output',
        AWDOMAIN: 'output',
        AWSNOOP: 'output',
        AWBAR: 'output',
        AWUNIQUE: 'output',
        AWLEN: 'output',
        AWSIZE: 'output',
        AWBURST: 'output',
        AWLOCK: 'output',
        AWCACHE: 'output',
        AWPROT: 'output',
        AWQOS: 'output',
        AWVALID: 'output',
        AWREADY: 'input',
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
        ARREGION: 'output',
        ARDOMAIN: 'output',
        ARSNOOP: 'output',
        ARBAR: 'output',
        ARLEN: 'output',
        ARSIZE: 'output',
        ARBURST: 'output',
        ARLOCK: 'output',
        ARCACHE: 'output',
        ARPROT: 'output',
        ARQOS: 'output',
        ARVALID: 'output',
        ARREADY: 'input',
        RID: 'input',
        RDATA: 'input',
        RRESP: 'input',
        RLAST: 'input',
        RVALID: 'input',
        RREADY: 'output',
        ACADDR: 'input',
        ACSNOOP: 'input',
        ACPROT: 'input',
        ACVALID: 'input',
        ACREADY: 'output',
        CRRESP: 'output',
        CRVALID: 'output',
        CRREADY: 'input',
        CDDATA: 'output',
        CDLAST: 'output',
        CDVALID: 'output',
        CDREADY: 'input',
        RACK: 'output',
        WACK: 'output',
        AWUSER: 'output',
        WUSER: 'output',
        BUSER: 'input',
        ARUSER: 'output',
        RUSER: 'input'
      },
      slave: {
        ACLK: 'input',
        ACLKEN: 'input',
        ARESETn: 'input',
        AWID: 'input',
        AWADDR: 'input',
        AWREGION: 'input',
        AWDOMAIN: 'input',
        AWSNOOP: 'input',
        AWBAR: 'input',
        AWUNIQUE: 'input',
        AWLEN: 'input',
        AWSIZE: 'input',
        AWBURST: 'input',
        AWLOCK: 'input',
        AWCACHE: 'input',
        AWPROT: 'input',
        AWQOS: 'input',
        AWVALID: 'input',
        AWREADY: 'output',
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
        ARREGION: 'input',
        ARDOMAIN: 'input',
        ARSNOOP: 'input',
        ARBAR: 'input',
        ARLEN: 'input',
        ARSIZE: 'input',
        ARBURST: 'input',
        ARLOCK: 'input',
        ARCACHE: 'input',
        ARPROT: 'input',
        ARQOS: 'input',
        ARVALID: 'input',
        ARREADY: 'output',
        RID: 'output',
        RDATA: 'output',
        RRESP: 'output',
        RLAST: 'output',
        RVALID: 'output',
        RREADY: 'input',
        ACADDR: 'output',
        ACSNOOP: 'output',
        ACPROT: 'output',
        ACVALID: 'output',
        ACREADY: 'input',
        CRRESP: 'input',
        CRVALID: 'input',
        CRREADY: 'output',
        CDDATA: 'input',
        CDLAST: 'input',
        CDVALID: 'input',
        CDREADY: 'output',
        RACK: 'input',
        WACK: 'input',
        AWUSER: 'input',
        WUSER: 'input',
        BUSER: 'output',
        ARUSER: 'input',
        RUSER: 'output'
      }
    }
  }
}

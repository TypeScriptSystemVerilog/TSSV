import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the ACE_Lite_RO TSSV Interface bundle
 */
export interface ACE_Lite_RO_Parameters extends TSSVParameters {
  ID_WIDTH?: IntRange<1, 16>

  ADDR_WIDTH?: IntRange<16, 64>

  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512

  USER_WIDTH?: IntRange<1, 64>

  QOS?: 'withQOS' | 'noQOS'

  REGION?: 'withREGION' | 'noREGION'

}

export interface ACE_Lite_RO_Signals extends Signals {
  ACLK: { width: 1 }
  ACLKEN: { width: 1 }
  ARESETn: { width: 1 }
  AWID: Signal
  AWADDR: Signal
  AWDOMAIN: { width: 2 }
  AWSNOOP: { width: 3 }
  AWBAR: { width: 2 }
  AWLEN: { width: 8 }
  AWSIZE: { width: 3 }
  AWBURST: { width: 2 }
  AWLOCK: { width: 1 }
  AWCACHE: { width: 4 }
  AWPROT: { width: 3 }
  AWVALID: { width: 1 }
  AWREADY: { width: 1 }
  WDATA: Signal
  WSTRB: Signal
  WLAST: { width: 1 }
  WVALID: { width: 1 }
  WREADY: { width: 1 }
  BID: Signal
  BRESP: { width: 2 }
  BVALID: { width: 1 }
  BREADY: { width: 1 }
  ARID: Signal
  ARADDR: Signal
  ARDOMAIN: { width: 2 }
  ARSNOOP: { width: 4 }
  ARBAR: { width: 2 }
  ARLEN: { width: 8 }
  ARSIZE: { width: 3 }
  ARBURST: { width: 2 }
  ARLOCK: { width: 1 }
  ARCACHE: { width: 4 }
  ARPROT: { width: 3 }
  ARVALID: { width: 1 }
  ARREADY: { width: 1 }
  RID: Signal
  RDATA: Signal
  RRESP: { width: 2 }
  RLAST: { width: 1 }
  RVALID: { width: 1 }
  RREADY: { width: 1 }
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type ACE_Lite_RO_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the ACE_Lite_RO protocol
 */
export class ACE_Lite_RO extends Interface {
  declare params: ACE_Lite_RO_Parameters
  declare signals: ACE_Lite_RO_Signals
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'ACE-Lite_RO',
    version: 'r0p0_0'
  }

  /**
   * Create a new ACE_Lite_RO Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: ACE_Lite_RO_Parameters = {}, role: ACE_Lite_RO_Role = undefined) {
    super(
      'ACE_Lite_RO',
      {
        DATA_WIDTH: params.DATA_WIDTH || 32,
        ADDR_WIDTH: params.ADDR_WIDTH || 32,
        ID_WIDTH: params.ID_WIDTH || 4,
        USER_WIDTH: params.USER_WIDTH || 0,
        QOS: params.QOS || 'withQOS',
        REGION: params.REGION || 'noREGION'
      },
      role
    )
    this.signals = {
      ACLK: { width: 1 },
      ACLKEN: { width: 1 },
      ARESETn: { width: 1 },
      AWID: { width: params.ID_WIDTH || 4 },
      AWADDR: { width: params.ADDR_WIDTH || 32 },
      AWDOMAIN: { width: 2 },
      AWSNOOP: { width: 3 },
      AWBAR: { width: 2 },
      AWLEN: { width: 8 },
      AWSIZE: { width: 3 },
      AWBURST: { width: 2 },
      AWLOCK: { width: 1 },
      AWCACHE: { width: 4 },
      AWPROT: { width: 3 },
      AWVALID: { width: 1 },
      AWREADY: { width: 1 },
      WDATA: { width: params.DATA_WIDTH || 32 },
      WSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
      WLAST: { width: 1 },
      WVALID: { width: 1 },
      WREADY: { width: 1 },
      BID: { width: params.ID_WIDTH || 4 },
      BRESP: { width: 2 },
      BVALID: { width: 1 },
      BREADY: { width: 1 },
      ARID: { width: params.ID_WIDTH || 4 },
      ARADDR: { width: params.ADDR_WIDTH || 32 },
      ARDOMAIN: { width: 2 },
      ARSNOOP: { width: 4 },
      ARBAR: { width: 2 },
      ARLEN: { width: 8 },
      ARSIZE: { width: 3 },
      ARBURST: { width: 2 },
      ARLOCK: { width: 1 },
      ARCACHE: { width: 4 },
      ARPROT: { width: 3 },
      ARVALID: { width: 1 },
      ARREADY: { width: 1 },
      RID: { width: params.ID_WIDTH || 4 },
      RDATA: { width: params.DATA_WIDTH || 32 },
      RRESP: { width: 2 },
      RLAST: { width: 1 },
      RVALID: { width: 1 },
      RREADY: { width: 1 }
    }
    if ((params.USER_WIDTH || 0) > 0) {
      this.signals.AWUSER = { width: params.USER_WIDTH }
      this.signals.WUSER = { width: params.USER_WIDTH }
      this.signals.BUSER = { width: params.USER_WIDTH }
      this.signals.ARUSER = { width: params.USER_WIDTH }
      this.signals.RUSER = { width: params.USER_WIDTH }
    }
    if (params.QOS === 'withQOS') {
      this.signals.ARQOS = { width: 4 }
      this.signals.AWQOS = { width: 4 }
    }
    if (params.REGION === 'withREGION') {
      this.signals.ARREGION = { width: 4 }
      this.signals.AWREGION = { width: 4 }
    }
    this.modports = {
      outward: {
        ACLK: 'input',
        ACLKEN: 'input',
        ARESETn: 'input',
        AWID: 'output',
        AWADDR: 'output',
        AWDOMAIN: 'output',
        AWSNOOP: 'output',
        AWBAR: 'output',
        AWLEN: 'output',
        AWSIZE: 'output',
        AWBURST: 'output',
        AWLOCK: 'output',
        AWCACHE: 'output',
        AWPROT: 'output',
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
        ARDOMAIN: 'output',
        ARSNOOP: 'output',
        ARBAR: 'output',
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
        RREADY: 'output'
      }
    }
    if ((params.USER_WIDTH || 0) > 0) {
      this.modports.outward = {
        ...this.modports.outward,
        AWUSER: 'output',
        WUSER: 'output',
        BUSER: 'input',
        ARUSER: 'output',
        RUSER: 'input'
      }
    }
    // Add modports for QOS signals if QOS is true
    if (params.QOS === 'withQOS') {
      this.modports.outward = {
        ...this.modports.outward,
        ARQOS: 'output',
        AWQOS: 'output'
      }
    }

    if (params.REGION === 'withREGION') {
      this.modports.outward = {
        ...this.modports.outward,
        AWREGION: 'output',
        ARREGION: 'output'
      }
    }

    this.modports.inward = Object.fromEntries(
      Object.entries(this.modports.outward).map(([key, value]) =>
        [key, (value === 'input') ? 'output' : 'input']))
  }
}

import { type TSSVParameters, type IntRange, Interface, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AXI4 TSSV Interface bundle
 */
export interface AXI4_Parameters extends TSSVParameters {

  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024

  ADDR_WIDTH?: IntRange<16, 64>

  ID_WIDTH?: IntRange<1, 16>

  USER_WIDTH?: IntRange<0, 64>

  QOS?: 'withQOS' | 'noQOS'

  REGION?: 'withREGION' | 'noREGION'

}

export interface AXI4_Signals extends Signals {
  AWID: { width: number }
  AWADDR: { width: number }
  AWLEN: { width: 8 }
  AWSIZE: { width: 3 }
  AWBURST: { width: 2 }
  AWLOCK: { width: 1 }
  AWCACHE: { width: 4 }
  AWPROT: { width: 3 }
  AWVALID: { width: 1 }
  AWREADY: { width: 1 }
  AWUSER?: { width: number }
  AWQOS?: { width: 4 }
  AWREGION?: { width: 4 }

  WDATA: { width: number }
  WSTRB: { width: number }
  WLAST: { width: 1 }
  WVALID: { width: 1 }
  WREADY: { width: 1 }
  WUSER?: { width: number }

  BID: { width: number }
  BRESP: { width: 2 }
  BVALID: { width: 1 }
  BREADY: { width: 1 }
  BUSER?: { width: number }

  ARID: { width: number }
  ARADDR: { width: number }
  ARLEN: { width: 8 }
  ARSIZE: { width: 3 }
  ARBURST: { width: 2 }
  ARLOCK: { width: 1 }
  ARCACHE: { width: 4 }
  ARPROT: { width: 3 }
  ARVALID: { width: 1 }
  ARREADY: { width: 1 }
  ARUSER?: { width: number }
  ARREGION?: { width: 4 }

  RID: { width: number }
  RDATA: { width: number }
  RRESP: { width: 2 }
  RLAST: { width: 1 }
  RVALID: { width: 1 }
  RREADY: { width: 1 }
  RUSER?: { width: number }
  RQOS?: { width: 4 }

}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI4_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the AXI4 protocol
 */
export class AXI4 extends Interface {
  declare params: AXI4_Parameters
  declare signals: AXI4_Signals
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'AXI4',
    version: 'r0p0_0'
  }

  /**
   * Create a new AXI4 Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AXI4_Parameters = {}, role: AXI4_Role = undefined) {
    super(
      'AXI4',
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
      AWID: { width: params.ID_WIDTH || 4 },
      AWADDR: { width: params.ADDR_WIDTH || 32 },
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
      this.signals.AWUSER = { width: params.USER_WIDTH || 1 }
      this.signals.WUSER = { width: params.USER_WIDTH || 1 }
      this.signals.BUSER = { width: params.USER_WIDTH || 1 }
      this.signals.ARUSER = { width: params.USER_WIDTH || 1 }
      this.signals.RUSER = { width: params.USER_WIDTH || 1 }
    }
    // Add ARQOS and AWQOS if QOS is true
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
        AWID: 'output',
        AWADDR: 'output',
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

type IncludeValues<T, K extends keyof T, V> = {
  [P in keyof T]: P extends K ? Extract<T[P], V> : T[P];
}

export type AXI4_inward = IncludeValues<AXI4, 'role', 'inward'>
export type AXI4_outward = IncludeValues<AXI4, 'role', 'outward'>

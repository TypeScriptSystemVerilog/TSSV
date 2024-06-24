import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AXI4_RO_rtl TSSV Interface bundle
 */
export interface AXI4_RO_rtl_Parameters extends TSSVParameters {
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
export type AXI4_RO_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the AXI4_RO_rtl protocol
 */
export class AXI4_RO_rtl extends Interface {
  declare params: AXI4_RO_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'AXI4_RO_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new AXI4_RO_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AXI4_RO_rtl_Parameters = {}, role: AXI4_RO_rtl_Role = undefined) {
    super(
      'AXI4_RO_rtl',
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
      AWLEN: { width: params.DIW || 8 },
      AWSIZE: { width: params.DIW || 8 },
      AWBURST: { width: params.DIW || 8 },
      AWLOCK: { width: params.DIW || 8 },
      AWCACHE: { width: params.DIW || 8 },
      AWPROT: { width: params.DIW || 8 },
      AWQOS: { width: params.DIW || 8 },
      AWREGION: { width: params.AW || 32 },
      AWVALID: { width: params.DIW || 8 },
      AWREADY: { width: params.DIW || 8 },
      WDATA: { width: params.DW || 32 },
      WSTRB: { width: params.DIW || 8 },
      WLAST: { width: params.DIW || 8 },
      WVALID: { width: params.DIW || 8 },
      WREADY: { width: params.DIW || 8 },
      BID: { width: params.DIW || 8 },
      BRESP: { width: params.DIW || 8 },
      BVALID: { width: params.DIW || 8 },
      BREADY: { width: params.DIW || 8 },
      ARID: { width: params.DIW || 8 },
      ARADDR: { width: params.AW || 32 },
      ARLEN: { width: 8 },
      ARSIZE: { width: 3 },
      ARBURST: { width: 2 },
      ARLOCK: { width: 1 },
      ARCACHE: { width: 4 },
      ARPROT: { width: 3 },
      ARQOS: { width: 4 },
      ARREGION: { width: 4 },
      ARVALID: { width: 1 },
      ARREADY: { width: 1 },
      RID: { width: params.DIW || 8 },
      RDATA: { width: params.DW || 32 },
      RRESP: { width: 2 },
      RLAST: { width: 1 },
      RVALID: { width: 1 },
      RREADY: { width: 1 },
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
        AWLEN: 'output',
        AWSIZE: 'output',
        AWBURST: 'output',
        AWLOCK: 'output',
        AWCACHE: 'output',
        AWPROT: 'output',
        AWQOS: 'output',
        AWREGION: 'output',
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
        ARREGION: 'output',
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
        RUSER: 'input'
      },
      slave: {
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
        AWQOS: 'input',
        AWREGION: 'input',
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
        ARLEN: 'input',
        ARSIZE: 'input',
        ARBURST: 'input',
        ARLOCK: 'input',
        ARCACHE: 'input',
        ARPROT: 'input',
        ARQOS: 'input',
        ARREGION: 'input',
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
        RUSER: 'output'
      }
    }
  }
}

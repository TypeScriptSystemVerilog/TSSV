import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AXI4Stream_rtl TSSV Interface bundle
 */
export interface AXI4Stream_rtl_Parameters extends TSSVParameters {
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
export type AXI4Stream_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the AXI4Stream_rtl protocol
 */
export class AXI4Stream_rtl extends Interface {
  declare params: AXI4Stream_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'AXI4Stream_rtl',
    version: 'r0p0_1'
  }

  /**
   * Create a new AXI4Stream_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AXI4Stream_rtl_Parameters = {}, role: AXI4Stream_rtl_Role = undefined) {
    super(
      'AXI4Stream_rtl',
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
      TVALID: { width: 1 },
      TREADY: { width: 1 },
      TDATA: { width: params.DW || 32 },
      TSTRB: { width: params.DIW || 8 },
      TKEEP: { width: params.DIW || 8 },
      TLAST: { width: 1 },
      TID: { width: params.DIW || 8 },
      TDEST: { width: params.DIW || 8 },
      TUSER: { width: params.DIW || 8 },
      TWAKEUP: { width: 1 }
    }
    this.modports = {
      master: {
        ACLK: 'input',
        ACLKEN: 'input',
        ARESETn: 'input',
        TVALID: 'output',
        TREADY: 'input',
        TDATA: 'output',
        TSTRB: 'output',
        TKEEP: 'output',
        TLAST: 'output',
        TID: 'output',
        TDEST: 'output',
        TUSER: 'output',
        TWAKEUP: 'output'
      },
      slave: {
        ACLK: 'input',
        ACLKEN: 'input',
        ARESETn: 'input',
        TVALID: 'input',
        TREADY: 'output',
        TDATA: 'input',
        TSTRB: 'input',
        TKEEP: 'input',
        TLAST: 'input',
        TID: 'input',
        TDEST: 'input',
        TUSER: 'input',
        TWAKEUP: 'input'
      }
    }
  }
}

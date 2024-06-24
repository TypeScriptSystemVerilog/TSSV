import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the AXI5_Stream_rtl TSSV Interface bundle
 */
export interface AXI5_Stream_rtl_Parameters extends TSSVParameters {
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
export type AXI5_Stream_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the AXI5_Stream_rtl protocol
 */
export class AXI5_Stream_rtl extends Interface {
  declare params: AXI5_Stream_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA5',
    name: 'AXI5-Stream_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new AXI5_Stream_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: AXI5_Stream_rtl_Parameters = {}, role: AXI5_Stream_rtl_Role = undefined) {
    super(
      'AXI5_Stream_rtl',
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
      ACLKENCHK: { width: 1 },
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
      TWAKEUP: { width: 1 },
      TVALIDCHK: { width: 1 },
      TREADYCHK: { width: 1 },
      TDATACHK: { width: params.DIW || 8 },
      TSTRBCHK: { width: params.DIW || 8 },
      TKEEPCHK: { width: params.DIW || 8 },
      TLASTCHK: { width: 1 },
      TIDCHK: { width: params.DIW || 8 },
      TDESTCHK: { width: params.DIW || 8 },
      TUSERCHK: { width: params.DIW || 8 },
      TWAKEUPCHK: { width: 1 }
    }
    this.modports = {
      master: {
        ACLK: 'input',
        ACLKEN: 'input',
        ACLKENCHK: 'input',
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
        TWAKEUP: 'output',
        TVALIDCHK: 'output',
        TREADYCHK: 'input',
        TDATACHK: 'output',
        TSTRBCHK: 'output',
        TKEEPCHK: 'output',
        TLASTCHK: 'output',
        TIDCHK: 'output',
        TDESTCHK: 'output',
        TUSERCHK: 'output',
        TWAKEUPCHK: 'output'
      },
      slave: {
        ACLK: 'input',
        ACLKEN: 'input',
        ACLKENCHK: 'input',
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
        TWAKEUP: 'input',
        TVALIDCHK: 'input',
        TREADYCHK: 'output',
        TDATACHK: 'input',
        TSTRBCHK: 'input',
        TKEEPCHK: 'input',
        TLASTCHK: 'input',
        TIDCHK: 'input',
        TDESTCHK: 'input',
        TUSERCHK: 'input',
        TWAKEUPCHK: 'input'
      }
    }
  }
}

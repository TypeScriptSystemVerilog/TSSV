import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the ATB_rtl TSSV Interface bundle
 */
export interface ATB_rtl_Parameters extends TSSVParameters {
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
export type ATB_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the ATB_rtl protocol
 */
export class ATB_rtl extends Interface {
  declare params: ATB_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'ATB_rtl',
    version: 'r2p0_0'
  }

  /**
   * Create a new ATB_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: ATB_rtl_Parameters = {}, role: ATB_rtl_Role = undefined) {
    super(
      'ATB_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      ATCLK: { width: 1 },
      ATCLKEN: { width: 1 },
      ATRESETn: { width: 1 },
      ATBYTES: { width: params.DIW || 8 },
      ATDATA: { width: params.DW || 32 },
      ATID: { width: 7 },
      ATREADY: { width: 1 },
      ATVALID: { width: 1 },
      AFVALID: { width: 1 },
      AFREADY: { width: 1 }
    }
    this.modports = {
      master: {
        ATCLK: 'input',
        ATCLKEN: 'input',
        ATRESETn: 'input',
        ATBYTES: 'output',
        ATDATA: 'output',
        ATID: 'output',
        ATREADY: 'input',
        ATVALID: 'output',
        AFVALID: 'input',
        AFREADY: 'output'
      },
      slave: {
        ATCLK: 'input',
        ATCLKEN: 'input',
        ATRESETn: 'input',
        ATBYTES: 'input',
        ATDATA: 'input',
        ATID: 'input',
        ATREADY: 'output',
        ATVALID: 'input',
        AFVALID: 'output',
        AFREADY: 'input'
      }
    }
  }
}

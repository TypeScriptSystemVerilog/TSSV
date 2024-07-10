import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the ATB TSSV Interface bundle
 */
export interface ATB_Parameters extends TSSVParameters {

  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024

  TRACE_DATA_WIDTH?: IntRange<4, 16>
}

export interface ATB_Signals extends Signals {
  ATCLK: { width: 1 }
  ATCLKEN: { width: 1 }
  ATRESETn: { width: 1 }
  ATBYTES: Signal
  ATDATA: Signal
  ATID: { width: 7 }
  ATREADY: { width: 1 }
  ATVALID: { width: 1 }
  AFVALID: { width: 1 }
  AFREADY: { width: 1 }
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type ATB_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the ATB protocol
 */
export class ATB extends Interface {
  declare params: ATB_Parameters
  declare signals: ATB_Signals
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'ATB',
    version: 'r2p0_0'
  }

  /**
   * Create a new ATB Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: ATB_Parameters = {}, role: ATB_Role = undefined) {
    super(
      'ATB',
      {
        DATA_WIDTH: params.DATA_WIDTH || 32,
        TRACE_DATA_WIDTH: params.TRACE_DATA_WIDTH || 4
      },
      role
    )
    this.signals = {
      ATCLK: { width: 1 },
      ATCLKEN: { width: 1 },
      ATRESETn: { width: 1 },
      ATBYTES: { width: params.TRACE_DATA_WIDTH || 4 },
      ATDATA: { width: params.DATA_WIDTH || 32 },
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

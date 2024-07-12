import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the P_Channel TSSV Interface bundle
 */
export interface P_Channel_Parameters extends TSSVParameters {
  PERIPHERALS?: IntRange<0, 64>

  STATES?: IntRange<0, 64>
}

export interface P_Channel_Signals extends Signals {
  RESETn: { width: 1 }
  PACTIVE: Signal
  PSTATE: Signal
  PREQ: { width: 1 }
  PACCEPT: { width: 1 }
  PDENY: { width: 1 }
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type P_Channel_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the P_Channel protocol
 */
export class P_Channel extends Interface {
  declare params: P_Channel_Parameters
  declare signals: P_Channel_Signals
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'P-Channel',
    version: 'r0p0_0'
  }

  /**
   * Create a new P_Channel Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: P_Channel_Parameters = {}, role: P_Channel_Role = undefined) {
    super(
      'P_Channel',
      {
        PERIPHERALS: params.PERIPHERALS || 0,
        STATES: params.STATES || 0
      },
      role
    )
    this.signals = {
      RESETn: { width: 1 },
      PACTIVE: { width: params.PERIPHERALS || 0 },
      PSTATE: { width: params.STATES || 0 },
      PREQ: { width: 1 },
      PACCEPT: { width: 1 },
      PDENY: { width: 1 }
    }
    this.modports = {
      outward: {
        RESETn: 'input',
        PACTIVE: 'input',
        PSTATE: 'output',
        PREQ: 'output',
        PACCEPT: 'input',
        PDENY: 'input'
      },
      inward: {
        RESETn: 'input',
        PACTIVE: 'output',
        PSTATE: 'input',
        PREQ: 'input',
        PACCEPT: 'output',
        PDENY: 'output'
      }
    }
  }
}

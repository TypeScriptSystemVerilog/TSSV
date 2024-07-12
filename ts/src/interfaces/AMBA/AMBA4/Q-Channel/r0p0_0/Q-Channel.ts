import { type TSSVParameters, Interface, type Signals } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the Q_Channel TSSV Interface bundle
 */
export interface Q_Channel_Parameters extends TSSVParameters {
  // no parameters
}

export interface Q_Channel_Signals extends Signals {
  QACTIVE: { width: 1 }
  QREQn: { width: 1 }
  QACCEPTn: { width: 1 }
  QDENY: { width: 1 }
}

/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type Q_Channel_Role = 'outward' | 'inward' | undefined

/**
 * TSSV Interface bundle for the Q_Channel protocol
 */
export class Q_Channel extends Interface {
  declare params: Q_Channel_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'Q-Channel',
    version: 'r0p0_0'
  }

  /**
   * Create a new Q_Channel Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: Q_Channel_Parameters = {}, role: Q_Channel_Role = undefined) {
    super(
      'Q_Channel',
      {},
      role
    )
    this.signals = {
      QACTIVE: { width: 1 },
      QREQn: { width: 1 },
      QACCEPTn: { width: 1 },
      QDENY: { width: 1 }
    }
    this.modports = {
      outward: {
        QACTIVE: 'input',
        QREQn: 'output',
        QACCEPTn: 'input',
        QDENY: 'input'
      },
      inward: {
        QACTIVE: 'output',
        QREQn: 'input',
        QACCEPTn: 'output',
        QDENY: 'output'
      }
    }
  }
}

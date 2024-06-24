import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the Q_Channel_rtl TSSV Interface bundle
 */
export interface Q_Channel_rtl_Parameters extends TSSVParameters {
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
export type Q_Channel_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the Q_Channel_rtl protocol
 */
export class Q_Channel_rtl extends Interface {
  declare params: Q_Channel_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'Q-Channel_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new Q_Channel_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: Q_Channel_rtl_Parameters = {}, role: Q_Channel_rtl_Role = undefined) {
    super(
      'Q_Channel_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      QACTIVE: { width: 1 },
      QREQn: { width: 1 },
      QACCEPTn: { width: 1 },
      QDENY: { width: 1 },
      QACTIVECHK: { width: 1 },
      QREQCHK: { width: 1 },
      QACCEPTCHK: { width: 1 },
      QDENYCHK: { width: 1 }
    }
    this.modports = {
      master: {
        QACTIVE: 'input',
        QREQn: 'output',
        QACCEPTn: 'input',
        QDENY: 'input',
        QACTIVECHK: 'input',
        QREQCHK: 'output',
        QACCEPTCHK: 'input',
        QDENYCHK: 'input'
      },
      slave: {
        QACTIVE: 'output',
        QREQn: 'input',
        QACCEPTn: 'output',
        QDENY: 'output',
        QACTIVECHK: 'output',
        QREQCHK: 'input',
        QACCEPTCHK: 'output',
        QDENYCHK: 'output'
      }
    }
  }
}

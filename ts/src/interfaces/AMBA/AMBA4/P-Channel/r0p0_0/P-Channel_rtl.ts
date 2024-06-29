import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the P_Channel_rtl TSSV Interface bundle
 */
export interface P_Channel_rtl_Parameters extends TSSVParameters {
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
export type P_Channel_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the P_Channel_rtl protocol
 */
export class P_Channel_rtl extends Interface {
  declare params: P_Channel_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'P-Channel_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new P_Channel_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: P_Channel_rtl_Parameters = {}, role: P_Channel_rtl_Role = undefined) {
    super(
      'P_Channel_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      RESETn: { width: 1 },
      PACTIVE: { width: params.DIW || 8 },
      PSTATE: { width: params.DIW || 8 },
      PREQ: { width: 1 },
      PACCEPT: { width: 1 },
      PDENY: { width: 1 },
      PACTIVECHK: { width: params.DIW || 8 },
      PSTATECHK: { width: params.DIW || 8 },
      PREQCHK: { width: 1 },
      PACCEPTCHK: { width: 1 },
      PDENYCHK: { width: 1 }
    }
    this.modports = {
      master: {
        RESETn: 'input',
        PACTIVE: 'input',
        PSTATE: 'output',
        PREQ: 'output',
        PACCEPT: 'input',
        PDENY: 'input',
        PACTIVECHK: 'input',
        PSTATECHK: 'output',
        PREQCHK: 'output',
        PACCEPTCHK: 'input',
        PDENYCHK: 'input'
      },
      slave: {
        RESETn: 'input',
        PACTIVE: 'output',
        PSTATE: 'input',
        PREQ: 'input',
        PACCEPT: 'output',
        PDENY: 'output',
        PACTIVECHK: 'output',
        PSTATECHK: 'input',
        PREQCHK: 'input',
        PACCEPTCHK: 'output',
        PDENYCHK: 'output'
      }
    }
  }
}

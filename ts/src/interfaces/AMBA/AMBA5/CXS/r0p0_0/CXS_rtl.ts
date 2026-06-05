import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the CXS_rtl TSSV Interface bundle
 */
export interface CXS_rtl_Parameters extends TSSVParameters {
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
export type CXS_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the CXS_rtl protocol
 */
export class CXS_rtl extends Interface {
  declare params: CXS_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA5',
    name: 'CXS_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new CXS_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: CXS_rtl_Parameters = {}, role: CXS_rtl_Role = undefined) {
    super(
      'CXS_rtl',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals = {
      CLK: { width: 1 },
      CLKEN: { width: 1 },
      CLKENCHK: { width: 1 },
      RESETn: { width: 1 },
      CXSVALID: { width: 1 },
      CXSDATA: { width: params.DIW || 8 },
      CXSCNTL: { width: params.DIW || 8 },
      CXSLAST: { width: 1 },
      CXSPRCLTYPE: { width: 3 },
      CXSCRDGNT: { width: 1 },
      CXSCRDRTN: { width: 1 },
      CXSACTIVEREQ: { width: 1 },
      CXSACTIVEACK: { width: 1 },
      CXSDEACTHINT: { width: 1 },
      CXSVALIDCHK: { width: 1 },
      CXSDATACHK: { width: params.DIW || 8 },
      CXSCNTLCHK: { width: params.DIW || 8 },
      CXSLASTCHK: { width: 1 },
      CXSPRCLTYPECHK: { width: 1 },
      CXSCRDGNTCHK: { width: 1 },
      CXSCRDRTNCHK: { width: 1 },
      CXSACTIVEREQCHK: { width: 1 },
      CXSACTIVEACKCHK: { width: 1 }
    }
    this.modports = {
      master: {
        CLK: 'input',
        CLKEN: 'input',
        CLKENCHK: 'input',
        RESETn: 'input',
        CXSVALID: 'output',
        CXSDATA: 'output',
        CXSCNTL: 'output',
        CXSLAST: 'output',
        CXSPRCLTYPE: 'output',
        CXSCRDGNT: 'input',
        CXSCRDRTN: 'output',
        CXSACTIVEREQ: 'output',
        CXSACTIVEACK: 'input',
        CXSDEACTHINT: 'input',
        CXSVALIDCHK: 'output',
        CXSDATACHK: 'output',
        CXSCNTLCHK: 'output',
        CXSLASTCHK: 'output',
        CXSPRCLTYPECHK: 'output',
        CXSCRDGNTCHK: 'input',
        CXSCRDRTNCHK: 'output',
        CXSACTIVEREQCHK: 'output',
        CXSACTIVEACKCHK: 'input'
      },
      slave: {
        CLK: 'input',
        CLKEN: 'input',
        CLKENCHK: 'input',
        RESETn: 'input',
        CXSVALID: 'input',
        CXSDATA: 'input',
        CXSCNTL: 'input',
        CXSLAST: 'input',
        CXSPRCLTYPE: 'input',
        CXSCRDGNT: 'output',
        CXSCRDRTN: 'input',
        CXSACTIVEREQ: 'input',
        CXSACTIVEACK: 'output',
        CXSDEACTHINT: 'output',
        CXSVALIDCHK: 'input',
        CXSDATACHK: 'input',
        CXSCNTLCHK: 'input',
        CXSLASTCHK: 'input',
        CXSPRCLTYPECHK: 'input',
        CXSCRDGNTCHK: 'output',
        CXSCRDRTNCHK: 'input',
        CXSACTIVEREQCHK: 'input',
        CXSACTIVEACKCHK: 'output'
      }
    }
  }
}

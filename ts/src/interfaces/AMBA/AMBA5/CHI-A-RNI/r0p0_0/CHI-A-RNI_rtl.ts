import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * Interface defining the parameters of the CHI_A_RNI_rtl TSSV Interface bundle
 */
export interface CHI_A_RNI_rtl_Parameters extends TSSVParameters {
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
export type CHI_A_RNI_rtl_Role = 'master' | 'slave' | undefined

/**
 * TSSV Interface bundle for the CHI_A_RNI_rtl protocol
 */
export class CHI_A_RNI_rtl extends Interface {
  declare params: CHI_A_RNI_rtl_Parameters
  /**
   * VLNV Metadata
   */
  static readonly VLNV = {
    vendor: 'amba.com',
    library: 'AMBA5',
    name: 'CHI-A-RNI_rtl',
    version: 'r0p0_0'
  }

  /**
   * Create a new CHI_A_RNI_rtl Interface bundle with either master or slave port interface
   * or just a bundle of interconnect wires
   * @param params param value set
   * @param role sets the role of this instance to choose master or slave port interface
   * or just a bundle of interconnect wires
   */
  constructor (params: CHI_A_RNI_rtl_Parameters = {}, role: CHI_A_RNI_rtl_Role = undefined) {
    super(
      'CHI_A_RNI_rtl',
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
      RESETn: { width: 1 },
      TXLINKACTIVEREQ: { width: 1 },
      TXLINKACTIVEACK: { width: 1 },
      RXLINKACTIVEREQ: { width: 1 },
      RXLINKACTIVEACK: { width: 1 },
      TXSACTIVE: { width: 1 },
      RXSACTIVE: { width: 1 },
      TXREQFLITPEND: { width: 1 },
      TXREQFLITV: { width: 1 },
      TXREQFLIT_QoS: { width: 4 },
      TXREQFLIT_TgtID: { width: 7 },
      TXREQFLIT_SrcID: { width: 7 },
      TXREQFLIT_TxnID: { width: 8 },
      TXREQFLIT_Opcode: { width: 5 },
      TXREQFLIT_Size: { width: 3 },
      TXREQFLIT_Addr: { width: 44 },
      TXREQFLIT_NS: { width: 1 },
      TXREQFLIT_LikelyShared: { width: 1 },
      TXREQFLIT_AllowRetry: { width: 1 },
      TXREQFLIT_Order: { width: 2 },
      TXREQFLIT_PCrdType: { width: 2 },
      TXREQFLIT_MemAttr: { width: 4 },
      TXREQFLIT_SnpAttr: { width: 2 },
      TXREQFLIT_LPID: { width: 3 },
      TXREQFLIT_Excl: { width: 1 },
      TXREQFLIT_ExpCompAck: { width: 1 },
      TXREQFLIT_RSVDC: { width: params.DIW || 8 },
      TXREQLCRDV: { width: 1 },
      TXRSPFLITPEND: { width: 1 },
      TXRSPFLITV: { width: 1 },
      TXRSPFLIT_QoS: { width: 4 },
      TXRSPFLIT_TgtID: { width: 7 },
      TXRSPFLIT_SrcID: { width: 7 },
      TXRSPFLIT_TxnID: { width: 8 },
      TXRSPFLIT_Opcode: { width: 4 },
      TXRSPFLIT_RespErr: { width: 2 },
      TXRSPFLIT_Resp: { width: 3 },
      TXRSPFLIT_DBID: { width: 8 },
      TXRSPFLIT_PCrdType: { width: 2 },
      TXRSPLCRDV: { width: 1 },
      TXDATFLITPEND: { width: 1 },
      TXDATFLITV: { width: 1 },
      TXDATFLIT_QoS: { width: 4 },
      TXDATFLIT_TgtID: { width: 7 },
      TXDATFLIT_SrcID: { width: 7 },
      TXDATFLIT_TxnID: { width: 8 },
      TXDATFLIT_Opcode: { width: 3 },
      TXDATFLIT_RespErr: { width: 2 },
      TXDATFLIT_Resp: { width: 3 },
      TXDATFLIT_DBID: { width: 8 },
      TXDATFLIT_CCID: { width: 2 },
      TXDATFLIT_DataID: { width: 2 },
      TXDATFLIT_RSVDC: { width: params.DIW || 8 },
      TXDATFLIT_BE: { width: params.DIW || 8 },
      TXDATFLIT_Data: { width: params.DW || 32 },
      TXDATLCRDV: { width: 1 },
      RXRSPFLITPEND: { width: 1 },
      RXRSPFLITV: { width: 1 },
      RXRSPFLIT_QoS: { width: 4 },
      RXRSPFLIT_TgtID: { width: 7 },
      RXRSPFLIT_SrcID: { width: 7 },
      RXRSPFLIT_TxnID: { width: 8 },
      RXRSPFLIT_Opcode: { width: 4 },
      RXRSPFLIT_RespErr: { width: 2 },
      RXRSPFLIT_Resp: { width: 3 },
      RXRSPFLIT_DBID: { width: 8 },
      RXRSPFLIT_PCrdType: { width: 2 },
      RXRSPLCRDV: { width: 1 },
      RXDATFLITPEND: { width: 1 },
      RXDATFLITV: { width: 1 },
      RXDATFLIT_QoS: { width: 4 },
      RXDATFLIT_TgtID: { width: 7 },
      RXDATFLIT_SrcID: { width: 7 },
      RXDATFLIT_TxnID: { width: 8 },
      RXDATFLIT_Opcode: { width: 3 },
      RXDATFLIT_RespErr: { width: 2 },
      RXDATFLIT_Resp: { width: 3 },
      RXDATFLIT_DBID: { width: 8 },
      RXDATFLIT_CCID: { width: 2 },
      RXDATFLIT_DataID: { width: 2 },
      RXDATFLIT_RSVDC: { width: params.DIW || 8 },
      RXDATFLIT_BE: { width: params.DIW || 8 },
      RXDATFLIT_Data: { width: params.DW || 32 },
      RXDATLCRDV: { width: 1 }
    }
    this.modports = {
      master: {
        CLK: 'input',
        CLKEN: 'input',
        RESETn: 'input',
        TXLINKACTIVEREQ: 'output',
        TXLINKACTIVEACK: 'input',
        RXLINKACTIVEREQ: 'input',
        RXLINKACTIVEACK: 'output',
        TXSACTIVE: 'output',
        RXSACTIVE: 'input',
        TXREQFLITPEND: 'output',
        TXREQFLITV: 'output',
        TXREQFLIT_QoS: 'output',
        TXREQFLIT_TgtID: 'output',
        TXREQFLIT_SrcID: 'output',
        TXREQFLIT_TxnID: 'output',
        TXREQFLIT_Opcode: 'output',
        TXREQFLIT_Size: 'output',
        TXREQFLIT_Addr: 'output',
        TXREQFLIT_NS: 'output',
        TXREQFLIT_LikelyShared: 'output',
        TXREQFLIT_AllowRetry: 'output',
        TXREQFLIT_Order: 'output',
        TXREQFLIT_PCrdType: 'output',
        TXREQFLIT_MemAttr: 'output',
        TXREQFLIT_SnpAttr: 'output',
        TXREQFLIT_LPID: 'output',
        TXREQFLIT_Excl: 'output',
        TXREQFLIT_ExpCompAck: 'output',
        TXREQFLIT_RSVDC: 'output',
        TXREQLCRDV: 'input',
        TXRSPFLITPEND: 'output',
        TXRSPFLITV: 'output',
        TXRSPFLIT_QoS: 'output',
        TXRSPFLIT_TgtID: 'output',
        TXRSPFLIT_SrcID: 'output',
        TXRSPFLIT_TxnID: 'output',
        TXRSPFLIT_Opcode: 'output',
        TXRSPFLIT_RespErr: 'output',
        TXRSPFLIT_Resp: 'output',
        TXRSPFLIT_DBID: 'output',
        TXRSPFLIT_PCrdType: 'output',
        TXRSPLCRDV: 'input',
        TXDATFLITPEND: 'output',
        TXDATFLITV: 'output',
        TXDATFLIT_QoS: 'output',
        TXDATFLIT_TgtID: 'output',
        TXDATFLIT_SrcID: 'output',
        TXDATFLIT_TxnID: 'output',
        TXDATFLIT_Opcode: 'output',
        TXDATFLIT_RespErr: 'output',
        TXDATFLIT_Resp: 'output',
        TXDATFLIT_DBID: 'output',
        TXDATFLIT_CCID: 'output',
        TXDATFLIT_DataID: 'output',
        TXDATFLIT_RSVDC: 'output',
        TXDATFLIT_BE: 'output',
        TXDATFLIT_Data: 'output',
        TXDATLCRDV: 'input',
        RXRSPFLITPEND: 'input',
        RXRSPFLITV: 'input',
        RXRSPFLIT_QoS: 'input',
        RXRSPFLIT_TgtID: 'input',
        RXRSPFLIT_SrcID: 'input',
        RXRSPFLIT_TxnID: 'input',
        RXRSPFLIT_Opcode: 'input',
        RXRSPFLIT_RespErr: 'input',
        RXRSPFLIT_Resp: 'input',
        RXRSPFLIT_DBID: 'input',
        RXRSPFLIT_PCrdType: 'input',
        RXRSPLCRDV: 'output',
        RXDATFLITPEND: 'input',
        RXDATFLITV: 'input',
        RXDATFLIT_QoS: 'input',
        RXDATFLIT_TgtID: 'input',
        RXDATFLIT_SrcID: 'input',
        RXDATFLIT_TxnID: 'input',
        RXDATFLIT_Opcode: 'input',
        RXDATFLIT_RespErr: 'input',
        RXDATFLIT_Resp: 'input',
        RXDATFLIT_DBID: 'input',
        RXDATFLIT_CCID: 'input',
        RXDATFLIT_DataID: 'input',
        RXDATFLIT_RSVDC: 'input',
        RXDATFLIT_BE: 'input',
        RXDATFLIT_Data: 'input',
        RXDATLCRDV: 'output'
      },
      slave: {
        CLK: 'input',
        CLKEN: 'input',
        RESETn: 'input',
        TXLINKACTIVEREQ: 'input',
        TXLINKACTIVEACK: 'output',
        RXLINKACTIVEREQ: 'output',
        RXLINKACTIVEACK: 'input',
        TXSACTIVE: 'input',
        RXSACTIVE: 'output',
        TXREQFLITPEND: 'input',
        TXREQFLITV: 'input',
        TXREQFLIT_QoS: 'input',
        TXREQFLIT_TgtID: 'input',
        TXREQFLIT_SrcID: 'input',
        TXREQFLIT_TxnID: 'input',
        TXREQFLIT_Opcode: 'input',
        TXREQFLIT_Size: 'input',
        TXREQFLIT_Addr: 'input',
        TXREQFLIT_NS: 'input',
        TXREQFLIT_LikelyShared: 'input',
        TXREQFLIT_AllowRetry: 'input',
        TXREQFLIT_Order: 'input',
        TXREQFLIT_PCrdType: 'input',
        TXREQFLIT_MemAttr: 'input',
        TXREQFLIT_SnpAttr: 'input',
        TXREQFLIT_LPID: 'input',
        TXREQFLIT_Excl: 'input',
        TXREQFLIT_ExpCompAck: 'input',
        TXREQFLIT_RSVDC: 'input',
        TXREQLCRDV: 'output',
        TXRSPFLITPEND: 'input',
        TXRSPFLITV: 'input',
        TXRSPFLIT_QoS: 'input',
        TXRSPFLIT_TgtID: 'input',
        TXRSPFLIT_SrcID: 'input',
        TXRSPFLIT_TxnID: 'input',
        TXRSPFLIT_Opcode: 'input',
        TXRSPFLIT_RespErr: 'input',
        TXRSPFLIT_Resp: 'input',
        TXRSPFLIT_DBID: 'input',
        TXRSPFLIT_PCrdType: 'input',
        TXRSPLCRDV: 'output',
        TXDATFLITPEND: 'input',
        TXDATFLITV: 'input',
        TXDATFLIT_QoS: 'input',
        TXDATFLIT_TgtID: 'input',
        TXDATFLIT_SrcID: 'input',
        TXDATFLIT_TxnID: 'input',
        TXDATFLIT_Opcode: 'input',
        TXDATFLIT_RespErr: 'input',
        TXDATFLIT_Resp: 'input',
        TXDATFLIT_DBID: 'input',
        TXDATFLIT_CCID: 'input',
        TXDATFLIT_DataID: 'input',
        TXDATFLIT_RSVDC: 'input',
        TXDATFLIT_BE: 'input',
        TXDATFLIT_Data: 'input',
        TXDATLCRDV: 'output',
        RXRSPFLITPEND: 'output',
        RXRSPFLITV: 'output',
        RXRSPFLIT_QoS: 'output',
        RXRSPFLIT_TgtID: 'output',
        RXRSPFLIT_SrcID: 'output',
        RXRSPFLIT_TxnID: 'output',
        RXRSPFLIT_Opcode: 'output',
        RXRSPFLIT_RespErr: 'output',
        RXRSPFLIT_Resp: 'output',
        RXRSPFLIT_DBID: 'output',
        RXRSPFLIT_PCrdType: 'output',
        RXRSPLCRDV: 'input',
        RXDATFLITPEND: 'output',
        RXDATFLITV: 'output',
        RXDATFLIT_QoS: 'output',
        RXDATFLIT_TgtID: 'output',
        RXDATFLIT_SrcID: 'output',
        RXDATFLIT_TxnID: 'output',
        RXDATFLIT_Opcode: 'output',
        RXDATFLIT_RespErr: 'output',
        RXDATFLIT_Resp: 'output',
        RXDATFLIT_DBID: 'output',
        RXDATFLIT_CCID: 'output',
        RXDATFLIT_DataID: 'output',
        RXDATFLIT_RSVDC: 'output',
        RXDATFLIT_BE: 'output',
        RXDATFLIT_Data: 'output',
        RXDATLCRDV: 'input'
      }
    }
  }
}

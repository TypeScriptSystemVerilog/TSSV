import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/**
 * interface defining the parameters of the TL_UL TSSV Interface bundle
 */
export interface TL_UL_Parameters extends TSSVParameters {
  /**
     * defines the bit width of the source identifier signal
     */
  AIW?: IntRange<1, 32>
  /**
     * defines the bit width of the address signal
     */
  AW?: IntRange<8, 64>
  /**
     * defines the bit with of the sink identifier signal
     */
  DIW?: IntRange<1, 32>
  /**
     * defines the data bus width
     */
  DW?: 32 | 64
}

/**
 * Defines the role of the Interface instance
 * producer is used in module port interfaces that are transaction initiators
 * responder is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type TL_UL_Role = 'producer' | 'responder' | undefined

/**
 * TSSV Interface bundle for the Tilelink Uncached Lightweight (TL-UL) protocol
 */
export class TL_UL extends Interface {
  declare params: TL_UL_Parameters
  /**
     * create a new TL_UL Interface bundle with either producer or responder port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose producer or responder port interface
     * or just a bundle of interconnect wires
     */
  constructor (params: TL_UL_Parameters = {}, role: TL_UL_Role = undefined) {
    super(
      'TL_UL',
      {
        AIW: params.AIW || 8,
        AW: params.AW || 32,
        DIW: params.DIW || 8,
        DW: params.DW || 32
      },
      role
    )
    this.signals =
            {
              a_valid: { width: 1 },
              a_ready: { width: 1 },
              a_opcode: { width: 3 },
              a_address: { width: this.params.AW },
              a_data: { width: this.params.DW },
              a_source: { width: this.params.AIW },
              a_size: { width: 2 },
              a_mask: { width: (this.params.DW || 32) / 8 },

              d_valid: { width: 1 },
              d_ready: { width: 1 },
              d_opcode: { width: 3 },
              d_error: { width: 1 },
              d_size: { width: 2 },
              d_data: { width: this.params.DW },
              d_source: { width: this.params.AIW },
              d_sink: { width: this.params.DIW }
            }

    this.modports = {
      producer: {
        a_valid: 'output',
        a_ready: 'input',
        a_opcode: 'output',
        a_address: 'output',
        a_data: 'output',
        a_source: 'output',
        a_size: 'output',
        a_mask: 'output',

        d_valid: 'input',
        d_ready: 'output',
        d_opcode: 'input',
        d_error: 'input',
        d_size: 'input',
        d_data: 'input',
        d_source: 'input',
        d_sink: 'input'
      },
      responder: {
        a_valid: 'input',
        a_ready: 'output',
        a_opcode: 'input',
        a_address: 'input',
        a_data: 'input',
        a_source: 'input',
        a_size: 'input',
        a_mask: 'input',

        d_valid: 'output',
        d_ready: 'input',
        d_opcode: 'output',
        d_error: 'output',
        d_size: 'output',
        d_data: 'output',
        d_source: 'output',
        d_sink: 'output'
      }
    }
  }
}

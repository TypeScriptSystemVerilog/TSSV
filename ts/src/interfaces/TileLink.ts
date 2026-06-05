import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV'

/**
   * Tilelink specifies 3 distinct protocol (conformance) levels
   * TL_UL : Uncached, Light-weight
   * TL_UH : Uncached, Heavy-weight
   * TL_C  : Cached
   *
   * | Feature               | TL_UL | TL_UH | TL_C
   * |-----------------------|-------|-------|------
   * | Read/Write operations | y     | y     | y
   * | Multibeat messages    | .     | y     | y
   * | Atomic operations     | .     | y     | y
   * | Hint operations       | .     | y     | y
   * | Cache block transfers | .     | .     | y
   * | Channels B+C+E        | .     | .     | y
   *
   */

/**
 * interface defining the parameters of the Tilelink Interface bundle
 */
export interface TileLinkParameters extends TSSVParameters {

  /**
       * Width of the data bus in bytes. Must be a power of two.
       */
  w?: 4 | 8 | 16 | 32 | 64 | 128

  /**
       * Width of each address field in bits.
       */
  a?: IntRange<16, 64>

  /**
       * Width of each size field in bits.
       */
  z?: IntRange<2, 10>

  /**
       * Number of bits needed to disambiguate per-link master sources.
       * width of the source identifiers
       */
  o?: IntRange<1, 32>

  /**
       * Number of bits needed to disambiguate per-link slave sinks.
       * width of the sink identifiers
       */
  i?: IntRange<1, 32>

}

/**
 * Defines the role of the Interface bundle instance
 *
 * the direction outward/inward refers to the port direction
 * of the primary control channel (channel a in the case of Tilelink)
 *
 * outward is port bundle for an outward connection
 * - examples
 *   - interface leaving a requester(master) component
 *   - interface leaving an interconnect component
 *   - interface leaving a transformation component
 * inward is a port bundle for an inward connection
 * - examples
 *   - interface entering a responder(slave) component
 *   - interface entering interconnect component
 *   - interface entering a transformation component
 * undefined creates a bundle of interconnect wires, not ports
 *
 */
export type TileLinkRole = 'outward' | 'inward' | undefined

export interface TLSignalsUncached extends Signals {
  a_opcode: { width: 3 }
  a_param: { width: 3 }
  a_size: Signal
  a_source: Signal
  a_address: Signal
  a_mask: Signal
  a_data: Signal
  a_corrupt: { width: 1 }
  a_valid: { width: 1 }
  a_ready: { width: 1 }

  // d channel
  d_opcode: { width: 3 }
  d_param: { width: 2 }
  d_size: Signal
  d_source: Signal
  d_sink: Signal
  d_denied: { width: 1 }
  d_data: Signal
  d_corrupt: { width: 1 }
  d_valid: { width: 1 }
  d_ready: { width: 1 }

}

export interface TLSignalsCached extends TLSignalsUncached {
  // b channel
  b_opcode: { width: 3 }
  b_param: { width: 3 }
  b_size: Signal
  b_source: Signal
  b_address: Signal
  b_mask: Signal
  b_data: Signal
  b_corrupt: { width: 1 }
  b_valid: { width: 1 }
  b_ready: { width: 1 }

  // c channel
  c_opcode: { width: 3 }
  c_param: { width: 3 }
  c_size: Signal
  c_source: Signal
  c_address: Signal
  c_data: Signal
  c_corrupt: { width: 1 }
  c_valid: { width: 1 }
  c_ready: { width: 1 }

  // e channel
  e_sink: Signal
  e_valid: { width: 1 }
  e_ready: { width: 1 }

}

/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
export class TL_UL extends Interface {
  declare params: TileLinkParameters
  declare signals: TLSignalsUncached
  /**
         * create a new TileLink interface bundle with either producer or inward port interface
         * or just a bundle of interconnect wires
         * @param params param value set
         * @param role sets the role of this instance to choose producer or inward port interface
         * or just a bundle of interconnect wires
         */
  constructor (params: TileLinkParameters, role: TileLinkRole = undefined) {
    super(
      'TL_UL',
      {
        w: params.w || 4,
        a: params.a || 32,
        z: params.z || 2,
        o: params.o || 8,
        i: params.i || 8
      },
      role
    )
    this.signals =
        {
          // a channel
          a_opcode: { width: 3 },
          a_param: { width: 3 },
          a_size: { width: this.params.z },
          a_source: { width: this.params.o },
          a_address: { width: this.params.a },
          a_mask: { width: this.params.w },
          a_data: { width: (this.params.w || 4) * 8 },
          a_corrupt: { width: 1 },
          a_valid: { width: 1 },
          a_ready: { width: 1 },

          // d channel
          d_opcode: { width: 3 },
          d_param: { width: 2 },
          d_size: { width: this.params.z },
          d_source: { width: this.params.o },
          d_sink: { width: this.params.i },
          d_denied: { width: 1 },
          d_data: { width: (this.params.w || 4) * 8 },
          d_corrupt: { width: 1 },
          d_valid: { width: 1 },
          d_ready: { width: 1 }
        }

    this.modports = {
      outward: {
        // a channel
        a_opcode: 'output',
        a_param: 'output',
        a_size: 'output',
        a_source: 'output',
        a_address: 'output',
        a_mask: 'output',
        a_data: 'output',
        a_corrupt: 'output',
        a_valid: 'output',
        a_ready: 'input',

        // d channel
        d_opcode: 'input',
        d_param: 'input',
        d_size: 'input',
        d_source: 'input',
        d_sink: 'input',
        d_denied: 'input',
        d_data: 'input',
        d_corrupt: 'input',
        d_valid: 'input',
        d_ready: 'output'
      }
    }

    this.modports.inward = Object.fromEntries(
      Object.entries(this.modports.outward).map(([key, value]) =>
        [key, (value === 'input') ? 'output' : 'input']))
  }
}

/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UH level
 */
export class TL_UH extends Interface {
  declare params: TileLinkParameters
  declare signals: TLSignalsUncached
  /**
         * create a new TileLink interface bundle with either producer or inward port interface
         * or just a bundle of interconnect wires
         * @param params param value set
         * @param role sets the role of this instance to choose producer or inward port interface
         * or just a bundle of interconnect wires
         */
  constructor (params: TileLinkParameters, role: TileLinkRole = undefined) {
    super(
      'TL_UH',
      {
        w: params.w || 4,
        a: params.a || 32,
        z: params.z || 2,
        o: params.o || 8,
        i: params.i || 8
      },
      role
    )
    this.signals =
        {
          // a channel
          a_opcode: { width: 3 },
          a_param: { width: 3 },
          a_size: { width: this.params.z },
          a_source: { width: this.params.o },
          a_address: { width: this.params.a },
          a_mask: { width: this.params.w },
          a_data: { width: (this.params.w || 4) * 8 },
          a_corrupt: { width: 1 },
          a_valid: { width: 1 },
          a_ready: { width: 1 },

          // d channel
          d_opcode: { width: 3 },
          d_param: { width: 2 },
          d_size: { width: this.params.z },
          d_source: { width: this.params.o },
          d_sink: { width: this.params.i },
          d_denied: { width: 1 },
          d_data: { width: (this.params.w || 4) * 8 },
          d_corrupt: { width: 1 },
          d_valid: { width: 1 },
          d_ready: { width: 1 }
        }

    this.modports = {
      outward: {
        // a channel
        a_opcode: 'output',
        a_param: 'output',
        a_size: 'output',
        a_source: 'output',
        a_address: 'output',
        a_mask: 'output',
        a_data: 'output',
        a_corrupt: 'output',
        a_valid: 'output',
        a_ready: 'input',

        // d channel
        d_opcode: 'input',
        d_param: 'input',
        d_size: 'input',
        d_source: 'input',
        d_sink: 'input',
        d_denied: 'input',
        d_data: 'input',
        d_corrupt: 'input',
        d_valid: 'input',
        d_ready: 'output'
      }
    }

    this.modports.inward = Object.fromEntries(
      Object.entries(this.modports.outward).map(([key, value]) =>
        [key, (value === 'input') ? 'output' : 'input']))
  }
}

/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
export class TL_C extends Interface {
  declare params: TileLinkParameters
  declare signals: TLSignalsCached
  /**
         * create a new TileLink interface bundle with either producer or inward port interface
         * or just a bundle of interconnect wires
         * @param params param value set
         * @param role sets the role of this instance to choose producer or inward port interface
         * or just a bundle of interconnect wires
         */
  constructor (params: TileLinkParameters, role: TileLinkRole = undefined) {
    super(
      'TL_UL',
      {
        w: params.w || 4,
        a: params.a || 32,
        z: params.z || 2,
        o: params.o || 8,
        i: params.i || 8
      },
      role
    )
    this.signals =
        {
          // a channel
          a_opcode: { width: 3 },
          a_param: { width: 3 },
          a_size: { width: this.params.z },
          a_source: { width: this.params.o },
          a_address: { width: this.params.a },
          a_mask: { width: this.params.w },
          a_data: { width: (this.params.w || 4) * 8 },
          a_corrupt: { width: 1 },
          a_valid: { width: 1 },
          a_ready: { width: 1 },

          // d channel
          d_opcode: { width: 3 },
          d_param: { width: 2 },
          d_size: { width: this.params.z },
          d_source: { width: this.params.o },
          d_sink: { width: this.params.i },
          d_denied: { width: 1 },
          d_data: { width: (this.params.w || 4) * 8 },
          d_corrupt: { width: 1 },
          d_valid: { width: 1 },
          d_ready: { width: 1 },

          // b channel
          b_opcode: { width: 3 },
          b_param: { width: 3 },
          b_size: { width: this.params.z },
          b_source: { width: this.params.o },
          b_address: { width: this.params.a },
          b_mask: { width: this.params.w },
          b_data: { width: (this.params.w || 4) * 8 },
          b_corrupt: { width: 1 },
          b_valid: { width: 1 },
          b_ready: { width: 1 },

          // c channel
          c_opcode: { width: 3 },
          c_param: { width: 3 },
          c_size: { width: this.params.z },
          c_source: { width: this.params.o },
          c_address: { width: this.params.a },
          c_data: { width: (this.params.w || 4) * 8 },
          c_corrupt: { width: 1 },
          c_valid: { width: 1 },
          c_ready: { width: 1 },

          // e channel
          e_sink: { width: this.params.i },
          e_valid: { width: 1 },
          e_ready: { width: 1 }
        }

    this.modports = {
      outward: {
        // a channel
        a_opcode: 'output',
        a_param: 'output',
        a_size: 'output',
        a_source: 'output',
        a_address: 'output',
        a_mask: 'output',
        a_data: 'output',
        a_corrupt: 'output',
        a_valid: 'output',
        a_ready: 'input',

        // d channel
        d_opcode: 'input',
        d_param: 'input',
        d_size: 'input',
        d_source: 'input',
        d_sink: 'input',
        d_denied: 'input',
        d_data: 'input',
        d_corrupt: 'input',
        d_valid: 'input',
        d_ready: 'output',

        // b channel
        b_opcode: 'output',
        b_param: 'output',
        b_size: 'output',
        b_source: 'output',
        b_address: 'output',
        b_mask: 'output',
        b_data: 'output',
        b_corrupt: 'output',
        b_valid: 'output',
        b_ready: 'input',

        // c channel
        c_opcode: 'output',
        c_param: 'output',
        c_size: 'output',
        c_source: 'output',
        c_address: 'output',
        c_data: 'output',
        c_corrupt: 'output',
        c_valid: 'output',
        c_ready: 'input',

        // e channel
        e_sink: 'input',
        e_valid: 'input',
        e_ready: 'output'
      }
    }

    this.modports.inward = Object.fromEntries(
      Object.entries(this.modports.outward).map(([key, value]) =>
        [key, (value === 'input') ? 'output' : 'input']))
  }
}

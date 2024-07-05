import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
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
    w?: 4 | 8 | 16 | 32 | 64 | 128;
    /**
         * Width of each address field in bits.
         */
    a?: IntRange<16, 64>;
    /**
         * Width of each size field in bits.
         */
    z?: IntRange<2, 10>;
    /**
         * Number of bits needed to disambiguate per-link master sources.
         * width of the source identifiers
         */
    o?: IntRange<1, 32>;
    /**
         * Number of bits needed to disambiguate per-link slave sinks.
         * width of the sink identifiers
         */
    i?: IntRange<1, 32>;
}
/**
 * Defines the role of the Interface instance
 * requester(a.k.a. master) is used in module port interfaces that are transaction initiators
 * responder(a.k.a slave) is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type TileLinkRole = 'requester' | 'responder' | undefined;
export interface TLSignalsUncached extends Signals {
    a_opcode: {
        width: 3;
    };
    a_param: {
        width: 3;
    };
    a_size: Signal;
    a_source: Signal;
    a_address: Signal;
    a_mask: Signal;
    a_data: Signal;
    a_corrupt: {
        width: 1;
    };
    a_valid: {
        width: 1;
    };
    a_ready: {
        width: 1;
    };
    d_opcode: {
        width: 3;
    };
    d_param: {
        width: 2;
    };
    d_size: Signal;
    d_source: Signal;
    d_sink: Signal;
    d_denied: {
        width: 1;
    };
    d_data: Signal;
    d_corrupt: {
        width: 1;
    };
    d_valid: {
        width: 1;
    };
    d_ready: {
        width: 1;
    };
}
export interface TLSignalsCached extends TLSignalsUncached {
    b_opcode: {
        width: 3;
    };
    b_param: {
        width: 3;
    };
    b_size: Signal;
    b_source: Signal;
    b_address: Signal;
    b_mask: Signal;
    b_data: Signal;
    b_corrupt: {
        width: 1;
    };
    b_valid: {
        width: 1;
    };
    b_ready: {
        width: 1;
    };
    c_opcode: {
        width: 3;
    };
    c_param: {
        width: 3;
    };
    c_size: Signal;
    c_source: Signal;
    c_address: Signal;
    c_data: Signal;
    c_corrupt: {
        width: 1;
    };
    c_valid: {
        width: 1;
    };
    c_ready: {
        width: 1;
    };
    e_sink: Signal;
    e_valid: {
        width: 1;
    };
    e_ready: {
        width: 1;
    };
}
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
export declare class TL_UL extends Interface {
    params: TileLinkParameters;
    signals: TLSignalsUncached;
    /**
           * create a new TileLink interface bundle with either producer or responder port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or responder port interface
           * or just a bundle of interconnect wires
           */
    constructor(params: TileLinkParameters, role?: TileLinkRole);
}
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UH level
 */
export declare class TL_UH extends Interface {
    params: TileLinkParameters;
    signals: TLSignalsUncached;
    /**
           * create a new TileLink interface bundle with either producer or responder port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or responder port interface
           * or just a bundle of interconnect wires
           */
    constructor(params: TileLinkParameters, role?: TileLinkRole);
}
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
export declare class TL_C extends Interface {
    params: TileLinkParameters;
    signals: TLSignalsCached;
    /**
           * create a new TileLink interface bundle with either producer or responder port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or responder port interface
           * or just a bundle of interconnect wires
           */
    constructor(params: TileLinkParameters, role?: TileLinkRole);
}

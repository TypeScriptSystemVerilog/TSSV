import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV';
/**
 * interface defining the parameters of the TL_UL TSSV Interface bundle
 */
export interface TL_UL_Parameters extends TSSVParameters {
    /**
       * defines the bit width of the source identifier signal
       */
    AIW?: IntRange<1, 32>;
    /**
       * defines the bit width of the address signal
       */
    AW?: IntRange<8, 64>;
    /**
       * defines the bit with of the sink identifier signal
       */
    DIW?: IntRange<1, 32>;
    /**
       * defines the data bus width
       */
    DW?: 32 | 64;
}
/**
 * Defines the role of the Interface instance
 * producer is used in module port interfaces that are transaction initiators
 * responder is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type TL_UL_Role = 'producer' | 'responder' | undefined;
/**
 * TSSV Interface bundle for the Tilelink Uncached Lightweight (TL-UL) protocol
 */
export declare class TL_UL extends Interface {
    params: TL_UL_Parameters;
    /**
       * create a new TL_UL Interface bundle with either producer or responder port interface
       * or just a bundle of interconnect wires
       * @param params param value set
       * @param role sets the role of this instance to choose producer or responder port interface
       * or just a bundle of interconnect wires
       */
    constructor(params?: TL_UL_Parameters, role?: TL_UL_Role);
}

import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
/**
 * configuration parameters of the SFIFO module
 */
export interface SFIFO_Parameters extends TSSVParameters {
    /**
       * bit width of SFIFO data
       */
    dataWidth: IntRange<1, 256>;
    /**
       * number of data words in the SFIFO
       */
    depth: bigint;
    /**
     * output 'almost_empty' and 'almost_full'
     */
    InclAlmostDepth?: 'InclAlmostDepth' | 'none';
    /**
     * 'almost_empty' depth
     */
    almost_empty_depth?: bigint;
    /**
     * 'almost_full' depth
     */
    almost_full_depth?: bigint;
    /**
     * 'almost_full' depth
     */
    rw_mode?: '1rw' | '1r_1w';
}
export declare class SFIFO extends Module {
    params: SFIFO_Parameters;
    constructor(params: SFIFO_Parameters);
}
export default SFIFO;

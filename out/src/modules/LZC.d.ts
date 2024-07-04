import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
/**
 * configuration parameters of the LZC module
 */
export interface LZC_Parameters extends TSSVParameters {
    /**
       * bit width of LZC data
       */
    dataWidth: IntRange<1, 256>;
}
export declare class LZC extends Module {
    params: LZC_Parameters;
    constructor(params: LZC_Parameters);
}
export default LZC;

import TSSV from 'tssv/lib/core/TSSV';
/**
 * configuration parameters of the FIR module
 */
export interface FIR_Parameters extends TSSV.TSSVParameters {
    /**
       * Array containing the coefficients of the FIR filter
       */
    coefficients: bigint[];
    /**
       * bit width of the FIR input data
       */
    inWidth?: TSSV.IntRange<1, 32>;
    /**
       * bit width of the FIR output data
       * @remarks result will be saturated or ign extended as needed
       */
    outWidth?: TSSV.IntRange<1, 32>;
    /**
       * right to apply to the FIR result to scale down the output
       */
    rShift?: TSSV.IntRange<0, 32>;
}
export declare class FIR extends TSSV.Module {
    params: FIR_Parameters;
    constructor(params: FIR_Parameters);
}
export default FIR;

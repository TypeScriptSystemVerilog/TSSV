import TSSV from 'tssv/lib/core/TSSV';
type inWidthType = TSSV.IntRange<1, 32>;
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
    inWidth?: inWidthType;
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
/**
 * FIR Interface
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "     clk", "wave": "p........."},
 *     {"name": "      en", "wave": "01.0.1.01."},
 *     {"name": " data_in", "wave": "x34..56.78", "data": ["i0", "i1", "i2", "i3", "i4", "i5"]},
 *     {"name": "data_out", "wave": "x.34..56.7", "data": ["o0", "o1", "o2", "o3", "o4", "o5"]}
 *   ]
 * }
 * ```
 */
export interface FIR_Ports extends TSSV.IOSignals {
    clk: {
        direction: 'input';
        isClock: 'posedge';
    };
    rst_b: {
        direction: 'input';
        isReset: 'lowasync';
    };
    en: {
        direction: 'input';
    };
    data_in: {
        direction: 'input';
        width: inWidthType;
        isSigned: true;
    };
    data_out: {
        direction: 'output';
        width: number;
        isSigned: true;
    };
}
export declare class FIR extends TSSV.Module {
    params: FIR_Parameters;
    IOs: FIR_Ports;
    constructor(params: FIR_Parameters);
}
export default FIR;

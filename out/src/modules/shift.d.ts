import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
/**
 * configuration parameters of the shift module
 */
export interface shift_Parameters extends TSSVParameters {
    /**
       * bit width of shift data
       */
    dataWidth: IntRange<1, 256>;
    /**
       * Select shift direction, left or right
       */
    shift_direct?: 'left' | 'right';
    /**
       * Shift length
       */
    shift_val: IntRange<1, 256>;
    /**
       * Indicate whether the input data is a signed number
       */
    isSigned?: 'signed' | 'unsigned';
}
export declare class shift extends Module {
    params: shift_Parameters;
    constructor(params: shift_Parameters);
}
export default shift;

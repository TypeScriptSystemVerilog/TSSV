import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
/**
 * configuration parameters of the ROM module
 */
export interface ROM_Parameters extends TSSVParameters {
    /**
       * bit width of ROM data
       */
    dataWidth: IntRange<1, 256>;
    /**
       * endianness of ROM data
       */
    endianness?: 'big' | 'little';
    split_setting?: 'interal' | 'split2two';
}
export declare class ROM extends Module {
    params: ROM_Parameters;
    MemInitFile: string | number[] | Uint8Array;
    rcf_path?: string;
    constructor(params: ROM_Parameters, MemInitFile: string | number[] | Uint8Array, rcf_path?: string);
}

import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
export interface seq_Parameters extends TSSVParameters {
    data_Width?: IntRange<1, 32>;
}
export declare class addAlways extends Module {
    params: seq_Parameters;
    constructor(params: seq_Parameters);
}

import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
export interface Adder_Parameters extends TSSVParameters {
    aWidth?: IntRange<1, 32>;
    bWidth?: IntRange<1, 32>;
}
export declare class Adder extends Module {
    params: Adder_Parameters;
    constructor(params: Adder_Parameters);
}
export interface Subber_Parameters extends TSSVParameters {
    aWidth?: IntRange<1, 32>;
    bWidth?: IntRange<1, 32>;
}
export declare class Subber extends Module {
    params: Adder_Parameters;
    constructor(params: Adder_Parameters);
}

import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
export interface Adder_Parameters extends TSSVParameters {
    aWidth?: IntRange<1, 32>;
    bWidth?: IntRange<1, 32>;
}
export declare class Adder extends Module {
    params: Adder_Parameters;
    constructor(params: Adder_Parameters);
}
export interface Adder3_Parameters extends TSSVParameters {
    aWidth?: IntRange<1, 32>;
    bWidth?: IntRange<1, 32>;
    cWidth?: IntRange<1, 32>;
}
export declare class Adder3 extends Module {
    params: Adder3_Parameters;
    constructor(params: Adder_Parameters);
}
export interface testMem_Parameters extends TSSVParameters {
    dataWidth: IntRange<1, 32>;
    depth: bigint;
}
export declare class testMem extends Module {
    params: testMem_Parameters;
    constructor(params: testMem_Parameters);
}
export interface testAddrDecode_Parameters extends TSSVParameters {
    numBlocks: IntRange<1, 32>;
    blockSize: bigint;
    addrWidth: IntRange<1, 64>;
    baseAddr: bigint;
}
export declare class testAddrDecode extends Module {
    params: testAddrDecode_Parameters;
    constructor(params: testAddrDecode_Parameters);
}

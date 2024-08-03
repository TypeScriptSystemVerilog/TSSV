import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV';
export interface Memory_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ADDR_WIDTH?: IntRange<16, 64>;
}
export type Memory_Role = 'outward' | 'inward' | undefined;
export declare class Memory extends Interface {
    params: Memory_Parameters;
    signals: {
        ADDR: {
            width: 16 | 32 | 64 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 36 | 26 | 27 | 28 | 29 | 30 | 31 | 33 | 34 | 35 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63;
        };
        DATA_WR: {
            width: 32 | 64 | 128 | 256 | 512 | 1024;
        };
        DATA_RD: {
            width: 32 | 64 | 128 | 256 | 512 | 1024;
        };
        RE: {
            width: number;
        };
        WE: {
            width: number;
        };
        READY: {
            width: number;
        };
        WSTRB: {
            width: number;
        };
    };
    constructor(params?: Memory_Parameters, role?: Memory_Role);
}

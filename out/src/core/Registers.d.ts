import { Module, type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV';
type RegisterType = 'RO' | 'RW' | 'WO' | 'RAM' | 'ROM' | string;
interface Field {
    reset?: bigint;
    description?: string;
    bitRange: [IntRange<0, 63>, IntRange<0, 63>];
    isSigned?: boolean;
}
interface Register {
    type: RegisterType;
    reset?: bigint;
    description?: string;
    size?: bigint;
    width?: IntRange<1, 64>;
    isSigned?: boolean;
    fields?: Record<string, Field>;
}
export declare class RegAddr {
    private addr;
    private readonly stride;
    constructor(start?: bigint, wordSize?: 32 | 64);
    next(): bigint;
}
export interface RegisterBlockDef<T extends Record<string, bigint>> {
    wordSize: 32 | 64;
    addrMap: T;
    baseAddress?: bigint;
    registers: {
        [name in keyof T]?: Register;
    };
}
export interface RegisterBlockParameters extends TSSVParameters {
    busInterface?: 'Memory' | 'TL_UL';
    endianess?: 'little';
    busIDWidth?: 8;
    busAddressWidth?: 32;
}
export interface Memory_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ADDR_WIDTH?: IntRange<16, 64>;
}
export type Memory_Role = 'outward' | 'inward' | undefined;
export declare class Memory extends Interface {
    params: Memory_Parameters;
    signals: {
        ADDR: {
            width: 16 | 32 | 64 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 36 | 63 | 26 | 27 | 28 | 29 | 30 | 31 | 33 | 34 | 35 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62;
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
    };
    constructor(params?: Memory_Parameters, role?: Memory_Role);
}
export declare class RegisterBlock<T extends Record<string, bigint>> extends Module {
    params: RegisterBlockParameters;
    regDefs: RegisterBlockDef<T>;
    constructor(params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>);
    private padAddress;
    private calculateDecMask;
    private calculatePassMask;
}
export {};

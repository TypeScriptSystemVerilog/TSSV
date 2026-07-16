import { Module, type TSSVParameters, type IntRange, type Interface } from 'tssv/lib/core/TSSV';
export declare enum RegisterType {
    RO = "RO",
    RW = "RW",
    WO = "WO",
    RAM = "RAM",
    ROM = "ROM"
}
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
    busInterface?: 'Memory' | 'TL_UL' | 'APB';
    endianess?: 'little';
    busIDWidth?: 8;
    busAddressWidth?: 32;
}
export declare class RegisterBlock<T extends Record<string, bigint>> extends Module {
    params: RegisterBlockParameters;
    regDefs: RegisterBlockDef<T>;
    constructor(params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>, busInterface: Interface);
    private replaceZerosWithX;
    private padZeroes;
    private padZeroesRight;
    private calculateDecMask;
    private calculatePassMask;
    writeRALF(): string;
}
export {};

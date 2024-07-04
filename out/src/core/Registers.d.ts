import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV';
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
export interface RegisterBlockDef<T> {
    wordSize: 32 | 64;
    addrMap: T;
    baseAddress?: bigint;
    registers: {
        [name in keyof T]?: Register;
    };
}
export interface RegisterBlockParameters extends TSSVParameters {
    busInterface?: 'TL_UL';
    endianess?: 'little';
    busIDWidth?: 8;
    busAddressWidth?: 32;
}
/**
 * This module implements a block of memory mapped control & status
 * registers according to the definitions in the addrMap T, and the
 * register defintions in regDefs
 */
export declare class RegisterBlock<T> extends Module {
    params: RegisterBlockParameters;
    regDefs: RegisterBlockDef<T>;
    constructor(params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>);
}
export {};

import { Module, type TSSVParameters, type IntRange, type Interface } from 'tssv/lib/core/TSSV';
import { type Field, type RegisterType } from 'tssv/lib/tools/shared';
interface Register {
    type: RegisterType;
    reset?: bigint;
    description?: string;
    size?: bigint;
    width?: IntRange<1, 64>;
    isSigned?: boolean;
    fields?: Record<string, Field>;
    repeat?: number;
    hardUpdate?: number;
    weOut?: boolean;
    useBuf?: boolean;
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
    busAddressWidth?: 32 | 12 | 16;
}
export declare class RegisterBlock<T extends Record<string, bigint>> extends Module {
    params: RegisterBlockParameters;
    regDefs: RegisterBlockDef<T>;
    private setupSignalsExprs;
    private extendIOs;
    private slverrHandler;
    private setupMatchPack;
    private setupRegIO;
    private setupWOReg;
    private setupROReg;
    private setupRWReg;
    private setupMemoryIntRWRegister;
    private setWriteOneClearOrToggle;
    constructor(params: RegisterBlockParameters, regDefs: RegisterBlockDef<T>, busInterface: Interface | Record<string, unknown>);
    private genRegBlkMemory;
    private genRegBlkAPB4;
    private addCasexStr;
}
export {};

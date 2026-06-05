import { Module, type TSSVParameters } from 'tssv/lib/core/TSSV';
import { type OriginationUnfold } from 'tssv/lib/tools/shared';
export type PortsType = 'RD2_HS' | 'RF2_HS' | 'RA1_HD' | 'RA1_HS' | 'RF1_HS' | 'RF1_HD' | 'VROM_HD';
export interface SRAM_WRAPPER_Parameters extends TSSVParameters {
    dataWidth: number;
    depth: bigint;
    ports: PortsType;
    split_direction: 'depth' | 'width';
    writeEnableMask?: 'none' | 'bit';
    macroConfig?: string;
}
export declare class SRAM_WRAPPER extends Module {
    params: SRAM_WRAPPER_Parameters;
    private readonly subSrams;
    constructor(params: SRAM_WRAPPER_Parameters, compSrams?: OriginationUnfold[]);
    private setupIOs;
    private splitDepth;
    private splitWidth;
    private genRegInWrapper;
}
export default SRAM_WRAPPER;

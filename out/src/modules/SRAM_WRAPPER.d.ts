import { Module, type TSSVParameters } from 'tssv/lib/core/TSSV';
/**
 * configuration parameters of the SRAM WRAPPER
 */
export interface SRAM_WRAPPER_Parameters extends TSSVParameters {
    dataWidth: number;
    depth: bigint;
    ports: 'RD2_HS' | 'RF2_HS' | 'RA1_HD' | 'RA1_HS' | 'RF1_HS' | 'RF1_HD' | 'VROM_HD';
    writeEnableMask?: 'none' | 'bit';
    macroConfig?: string;
    subSrams?: Array<{
        instName: string;
        module: string;
        width: number;
        depth: bigint;
        bitBig: number;
    }>;
}
export declare class SRAM_WRAPPER extends Module {
    params: SRAM_WRAPPER_Parameters;
    private readonly subSrams;
    constructor(params: SRAM_WRAPPER_Parameters);
    private instantiateSubSrams;
}
export default SRAM_WRAPPER;

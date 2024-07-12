import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the ATB TSSV Interface bundle
 */
export interface ATB_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    TRACE_DATA_WIDTH?: IntRange<4, 16>;
}
export interface ATB_Signals extends Signals {
    ATCLK: {
        width: 1;
    };
    ATCLKEN: {
        width: 1;
    };
    ATRESETn: {
        width: 1;
    };
    ATBYTES: Signal;
    ATDATA: Signal;
    ATID: {
        width: 7;
    };
    ATREADY: {
        width: 1;
    };
    ATVALID: {
        width: 1;
    };
    AFVALID: {
        width: 1;
    };
    AFREADY: {
        width: 1;
    };
    SYNCREQ: {
        width: 1;
    };
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type ATB_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the ATB protocol
 */
export declare class ATB extends Interface {
    params: ATB_Parameters;
    signals: ATB_Signals;
    /**
     * VLNV Metadata
     */
    static readonly VLNV: {
        vendor: string;
        library: string;
        name: string;
        version: string;
    };
    /**
     * Create a new ATB Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: ATB_Parameters, role?: ATB_Role);
}

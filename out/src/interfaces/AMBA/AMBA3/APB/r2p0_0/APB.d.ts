import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the APB TSSV Interface bundle
 */
export interface APB_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ADDR_WIDTH?: IntRange<16, 64>;
}
export interface APB_Signals extends Signals {
    PCLK: {
        width: 1;
    };
    PRESETn: {
        width: 1;
    };
    PADDR: Signal;
    PSELx: {
        width: 1;
    };
    PENABLE: {
        width: 1;
    };
    PWRITE: {
        width: 1;
    };
    PRDATA: Signal;
    PWDATA: Signal;
    PREADY: {
        width: 1;
    };
    PSLVERR: {
        width: 1;
    };
    PCLKEN: {
        width: 1;
    };
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type APB_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the APB protocol
 */
export declare class APB extends Interface {
    params: APB_Parameters;
    signals: APB_Signals;
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
     * Create a new APB Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: APB_Parameters, role?: APB_Role);
}

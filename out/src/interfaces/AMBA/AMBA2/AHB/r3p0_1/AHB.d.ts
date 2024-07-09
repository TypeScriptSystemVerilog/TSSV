import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AHB TSSV Interface bundle
 */
export interface AHB_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    HPROT_WIDTH?: IntRange<4, 6>;
    HRESP_WIDTH?: 1 | 2;
    USER_WIDTH?: IntRange<0, 64>;
    MASTERS?: number;
}
export interface AHB_Signals extends Signals {
    HCLK: {
        width: 1;
    };
    HCLKEN: {
        width: 1;
    };
    HRESETn: {
        width: 1;
    };
    HADDR: {
        width: 32;
    };
    HBURST: {
        width: 3;
    };
    HMASTLOCK: {
        width: 1;
    };
    HPROT: Signal;
    HSIZE: {
        width: 3;
    };
    HTRANS: {
        width: 2;
    };
    HWDATA: Signal;
    HWRITE: {
        width: 1;
    };
    HRDATA: Signal;
    HREADYOUT: {
        width: 1;
    };
    HRESP: Signal;
    HSELx: {
        width: 1;
    };
    HREADY: {
        width: 1;
    };
    HBUSREQ: {
        width: 1;
    };
    HLOCK: {
        width: 1;
    };
    HGRANT: {
        width: 1;
    };
    HMASTER: Signal;
    HSPLIT: Signal;
    HBSTRB: Signal;
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AHB_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AHB protocol
 */
export declare class AHB extends Interface {
    params: AHB_Parameters;
    signals: AHB_Signals;
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
     * Create a new AHB Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AHB_Parameters, role?: AHB_Role);
}

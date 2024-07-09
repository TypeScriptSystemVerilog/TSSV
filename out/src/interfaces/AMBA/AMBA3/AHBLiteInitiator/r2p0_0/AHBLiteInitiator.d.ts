import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AHBLiteInitiator TSSV Interface bundle
 */
export interface AHBLiteInitiator_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ADDR_WIDTH?: IntRange<16, 64>;
    USER_WIDTH?: IntRange<0, 64>;
    SLAVES?: number;
}
export interface AHBLiteIntiator_Signals extends Signals {
    HCLK: {
        width: 1;
    };
    HCLKEN: {
        width: 1;
    };
    HRESETn: {
        width: 1;
    };
    HADDR: Signal;
    HBURST: {
        width: 3;
    };
    HMASTLOCK: {
        width: 1;
    };
    HPROT: {
        width: 4;
    };
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
    HRESP: {
        width: 1;
    };
    HSELx: Signal;
    HREADY: {
        width: 1;
    };
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AHBLiteInitiator_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AHBLiteInitiator protocol
 */
export declare class AHBLiteInitiator extends Interface {
    params: AHBLiteInitiator_Parameters;
    signals: AHBLiteIntiator_Signals;
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
     * Create a new AHBLiteInitiator Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AHBLiteInitiator_Parameters, role?: AHBLiteInitiator_Role);
}

import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AHBLite TSSV Interface bundle
 */
export interface AHBLite_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ADDR_WIDTH?: IntRange<16, 64>;
    USER_WIDTH?: IntRange<0, 64>;
}
export interface AHBLite_Signals extends Signals {
    HCLK: {
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
    HSELx: {
        width: 1;
    };
    HREADY: {
        width: 1;
    };
    HCLKEN: {
        width: 1;
    };
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AHBLite_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AHBLite protocol
 */
export declare class AHBLite extends Interface {
    params: AHBLite_Parameters;
    signals: AHBLite_Signals;
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
     * Create a new AHBLite Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AHBLite_Parameters, role?: AHBLite_Role);
}

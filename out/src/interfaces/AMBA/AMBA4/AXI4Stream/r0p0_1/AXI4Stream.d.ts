import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AXI4Stream TSSV Interface bundle
 */
export interface AXI4Stream_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ID_WIDTH?: IntRange<1, 16>;
    USER_WIDTH?: IntRange<0, 64>;
    TDEST_WIDTH?: IntRange<4, 16>;
}
export interface AXI4Stream_Signals extends Signals {
    ACLK: {
        width: 1;
    };
    ACLKEN: {
        width: 1;
    };
    ARESETn: {
        width: 1;
    };
    TVALID: {
        width: 1;
    };
    TREADY: {
        width: 1;
    };
    TDATA: Signal;
    TSTRB: Signal;
    TKEEP: Signal;
    TLAST: {
        width: 1;
    };
    TID: Signal;
    TDEST: Signal;
    TWAKEUP: {
        width: 1;
    };
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI4Stream_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AXI4Stream protocol
 */
export declare class AXI4Stream extends Interface {
    params: AXI4Stream_Parameters;
    singals: AXI4Stream_Signals;
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
     * Create a new AXI4Stream Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AXI4Stream_Parameters, role?: AXI4Stream_Role);
}

import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AXI TSSV Interface bundle
 */
export interface AXI_Parameters extends TSSVParameters {
    ID_WIDTH?: IntRange<1, 16>;
    ADDR_WIDTH?: IntRange<16, 64>;
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512;
    USER_WIDTH?: IntRange<1, 64>;
    QOS?: 'withQOS' | 'noQOS';
    REGION?: 'withREGION' | 'noREGION';
}
export interface AXI_Signals extends Signals {
    ACLK: {
        width: 1;
    };
    ACLKEN: {
        width: 1;
    };
    ARESETn: {
        width: 1;
    };
    AWID: Signal;
    AWADDR: Signal;
    AWLEN: {
        width: 4;
    };
    AWSIZE: {
        width: 3;
    };
    AWBURST: {
        width: 2;
    };
    AWLOCK: {
        width: 2;
    };
    AWCACHE: {
        width: 4;
    };
    AWPROT: {
        width: 3;
    };
    AWVALID: {
        width: 1;
    };
    AWREADY: {
        width: 1;
    };
    WID: Signal;
    WDATA: Signal;
    WSTRB: Signal;
    WLAST: {
        width: 1;
    };
    WVALID: {
        width: 1;
    };
    WREADY: {
        width: 1;
    };
    BID: Signal;
    BRESP: {
        width: 2;
    };
    BVALID: {
        width: 1;
    };
    BREADY: {
        width: 1;
    };
    ARID: Signal;
    ARADDR: Signal;
    ARLEN: {
        width: 4;
    };
    ARSIZE: {
        width: 3;
    };
    ARBURST: {
        width: 2;
    };
    ARLOCK: {
        width: 2;
    };
    ARCACHE: {
        width: 4;
    };
    ARPROT: {
        width: 3;
    };
    ARVALID: {
        width: 1;
    };
    ARREADY: {
        width: 1;
    };
    RID: Signal;
    RDATA: Signal;
    RRESP: {
        width: 2;
    };
    RLAST: {
        width: 1;
    };
    RVALID: {
        width: 1;
    };
    RREADY: {
        width: 1;
    };
}
/**
 * Defines the role of the Interface instance
 * outward is used in module port interfaces that are transaction initiators
 * inward is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AXI protocol
 */
export declare class AXI extends Interface {
    params: AXI_Parameters;
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
     * Create a new AXI Interface bundle with either outward or inward port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose outward or inward port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AXI_Parameters, role?: AXI_Role);
}

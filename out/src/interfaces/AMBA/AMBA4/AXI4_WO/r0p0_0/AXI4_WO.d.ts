import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AXI4_WO TSSV Interface bundle
 */
export interface AXI4_WO_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ADDR_WIDTH?: IntRange<16, 64>;
    ID_WIDTH?: IntRange<1, 16>;
    USER_WIDTH?: IntRange<0, 64>;
    QOS?: 'withQOS' | 'noQOS';
    REGION?: 'withREGION' | 'noREGION';
}
export interface AXI4_WO_Signals extends Signals {
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
        width: 8;
    };
    AWSIZE: {
        width: 3;
    };
    AWBURST: {
        width: 2;
    };
    AWLOCK: {
        width: 1;
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
        width: 8;
    };
    ARSIZE: {
        width: 3;
    };
    ARBURST: {
        width: 2;
    };
    ARLOCK: {
        width: 1;
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
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI4_WO_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AXI4_WO protocol
 */
export declare class AXI4_WO extends Interface {
    params: AXI4_WO_Parameters;
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
     * Create a new AXI4_WO Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AXI4_WO_Parameters, role?: AXI4_WO_Role);
}

import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AXI_RO TSSV Interface bundle
 */
export interface AXI_RO_Parameters extends TSSVParameters {
    ID_WIDTH?: IntRange<1, 16>;
    ADDR_WIDTH?: IntRange<16, 64>;
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512;
    USER_WIDTH?: IntRange<1, 64>;
    QOS?: 'withQOS' | 'noQOS';
    REGION?: 'withREGION' | 'noREGION';
}
export interface AXI_RO_Signals extends Signals {
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
    AWLEN: Signal;
    AWSIZE: Signal;
    AWBURST: Signal;
    AWLOCK: Signal;
    AWCACHE: Signal;
    AWPROT: Signal;
    AWVALID: Signal;
    AWREADY: Signal;
    WID: Signal;
    WDATA: Signal;
    WSTRB: Signal;
    WLAST: Signal;
    WVALID: Signal;
    WREADY: Signal;
    BID: Signal;
    BRESP: Signal;
    BVALID: Signal;
    BREADY: Signal;
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
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI_RO_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AXI_RO protocol
 */
export declare class AXI_RO extends Interface {
    params: AXI_RO_Parameters;
    signals: AXI_RO_Signals;
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
     * Create a new AXI_RO Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AXI_RO_Parameters, role?: AXI_RO_Role);
}

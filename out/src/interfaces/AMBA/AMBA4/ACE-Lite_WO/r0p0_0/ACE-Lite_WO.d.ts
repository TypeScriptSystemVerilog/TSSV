import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the ACE_Lite_WO TSSV Interface bundle
 */
export interface ACE_Lite_WO_Parameters extends TSSVParameters {
    ID_WIDTH?: IntRange<1, 16>;
    ADDR_WIDTH?: IntRange<16, 64>;
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512;
    USER_WIDTH?: IntRange<1, 64>;
    QOS?: 'withQOS' | 'noQOS';
    REGION?: 'withREGION' | 'noREGION';
}
export interface ACE_Lite_WO_Signals extends Signals {
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
    AWDOMAIN: {
        width: 2;
    };
    AWSNOOP: {
        width: 3;
    };
    AWBAR: {
        width: 2;
    };
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
    ARDOMAIN: {
        width: 2;
    };
    ARSNOOP: {
        width: 4;
    };
    ARBAR: {
        width: 2;
    };
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
export type ACE_Lite_WO_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the ACE_Lite_WO protocol
 */
export declare class ACE_Lite_WO extends Interface {
    params: ACE_Lite_WO_Parameters;
    signals: ACE_Lite_WO_Signals;
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
     * Create a new ACE_Lite_WO Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: ACE_Lite_WO_Parameters, role?: ACE_Lite_WO_Role);
}

import { type TSSVParameters, type IntRange, Interface, type Signal, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the ACP TSSV Interface bundle
 */
export interface ACP_Parameters extends TSSVParameters {
    ID_WIDTH?: IntRange<1, 16>;
    ADDR_WIDTH?: IntRange<16, 64>;
    LEN_WIDTH?: IntRange<4, 8>;
    USER_WIDTH?: IntRange<1, 64>;
    QOS?: 'withQOS' | 'noQOS';
    REGION?: 'withREGION' | 'noREGION';
}
export interface ACP_Signals extends Signals {
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
    AWLEN: Signal;
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
    WDATA: {
        width: 128;
    };
    WSTRB: {
        width: 16;
    };
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
    ARLEN: Signal;
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
    RDATA: {
        width: 128;
    };
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
export type ACP_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the ACP protocol
 */
export declare class ACP extends Interface {
    params: ACP_Parameters;
    signals: ACP_Signals;
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
     * Create a new ACP Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: ACP_Parameters, role?: ACP_Role);
}

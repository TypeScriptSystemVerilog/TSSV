import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AXI_rtl TSSV Interface bundle
 */
export interface AXI_rtl_Parameters extends TSSVParameters {
    AWID_WIDTH?: IntRange<1, 16>;
    WID_WIDTH?: IntRange<1, 16>;
    BID_WIDTH?: IntRange<1, 16>;
    ARID_WIDTH?: IntRange<1, 16>;
    RID_WIDTH?: IntRange<1, 16>;
    ADDR_WIDTH?: 32 | 64;
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512;
    BURST_LEN_WIDTH?: IntRange<1, 16>;
    USER_WIDTH?: IntRange<1, 64>;
    RESP_WIDTH?: IntRange<2, 4>;
    QOS?: 'true' | 'false';
}
/**
 * Defines the role of the Interface instance
 * outward is used in module port interfaces that are transaction initiators
 * inward is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI_rtl_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AXI_rtl protocol
 */
export declare class AXI_rtl extends Interface {
    params: AXI_rtl_Parameters;
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
     * Create a new AXI_rtl Interface bundle with either outward or inward port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose outward or inward port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AXI_rtl_Parameters, role?: AXI_rtl_Role);
}

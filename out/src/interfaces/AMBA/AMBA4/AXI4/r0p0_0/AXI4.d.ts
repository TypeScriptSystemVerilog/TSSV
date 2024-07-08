import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the AXI4 TSSV Interface bundle
 */
export interface AXI4_Parameters extends TSSVParameters {
    DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024;
    ADDR_WIDTH?: IntRange<16, 64>;
    AWID_WIDTH?: IntRange<1, 16>;
    WID_WIDTH?: IntRange<1, 16>;
    BID_WIDTH?: IntRange<1, 16>;
    ARID_WIDTH?: IntRange<1, 16>;
    RID_WIDTH?: IntRange<1, 16>;
    USER_WIDTH?: IntRange<0, 64>;
    QOS?: 'withQOS' | 'noQOS';
    REGION?: 'withREGION' | 'noREGION';
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type AXI4_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the AXI4 protocol
 */
export declare class AXI4 extends Interface {
    params: AXI4_Parameters;
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
     * Create a new AXI4 Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: AXI4_Parameters, role?: AXI4_Role);
}

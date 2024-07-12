import { type TSSVParameters, Interface, type Signals } from 'tssv/lib/core/TSSV';
/**
 * Interface defining the parameters of the LPI TSSV Interface bundle
 */
export interface LPI_Parameters extends TSSVParameters {
}
export interface LPI_Signals extends Signals {
    CLK: {
        width: 1;
    };
    CLKEN: {
        width: 1;
    };
    RESETn: {
        width: 1;
    };
    CSYSREQ: {
        width: 1;
    };
    CSYSACK: {
        width: 1;
    };
    CACTIVE: {
        width: 1;
    };
}
/**
 * Defines the role of the Interface instance
 * master is used in module port interfaces that are transaction initiators
 * slave is used in module port interfaces that are transaction responders
 * leave role undefined to create just a bundle of interconnect wires
 */
export type LPI_Role = 'outward' | 'inward' | undefined;
/**
 * TSSV Interface bundle for the LPI protocol
 */
export declare class LPI extends Interface {
    params: LPI_Parameters;
    signals: LPI_Signals;
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
     * Create a new LPI Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params?: LPI_Parameters, role?: LPI_Role);
}

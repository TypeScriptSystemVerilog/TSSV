import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the LPI_rtl protocol
 */
export class LPI_rtl extends Interface {
    /**
     * Create a new LPI_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('LPI_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role);
        this.signals = {
            CLK: { width: 1 },
            CLKEN: { width: 1 },
            RESETn: { width: 1 },
            CSYSREQ: { width: 1 },
            CSYSACK: { width: 1 },
            CACTIVE: { width: 1 }
        };
        this.modports = {
            master: {
                CLK: 'input',
                CLKEN: 'input',
                RESETn: 'input',
                CSYSREQ: 'output',
                CSYSACK: 'input',
                CACTIVE: 'input'
            },
            slave: {
                CLK: 'input',
                CLKEN: 'input',
                RESETn: 'input',
                CSYSREQ: 'input',
                CSYSACK: 'output',
                CACTIVE: 'output'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
LPI_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'LPI_rtl',
    version: 'r2p0_0'
};

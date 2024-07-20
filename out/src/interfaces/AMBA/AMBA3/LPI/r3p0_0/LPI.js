import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the LPI protocol
 */
export class LPI extends Interface {
    /**
     * Create a new LPI Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('LPI', {}, role);
        this.signals = {
            CLK: { width: 1 },
            CLKEN: { width: 1 },
            RESETn: { width: 1 },
            CSYSREQ: { width: 1 },
            CSYSACK: { width: 1 },
            CACTIVE: { width: 1 }
        };
        this.modports = {
            outward: {
                CLK: 'input',
                CLKEN: 'input',
                RESETn: 'input',
                CSYSREQ: 'output',
                CSYSACK: 'input',
                CACTIVE: 'input'
            },
            inward: {
                CLK: 'input',
                CLKEN: 'input',
                RESETn: 'input',
                CSYSREQ: 'input',
                CSYSACK: 'output',
                CACTIVE: 'output'
            }
        };
        this.modports.inward = Object.fromEntries(Object.entries(this.modports.outward).map(([key, value]) => [key, (value === 'input') ? 'output' : 'input']));
    }
}
/**
 * VLNV Metadata
 */
LPI.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'LPI',
    version: 'r3p0_0'
};

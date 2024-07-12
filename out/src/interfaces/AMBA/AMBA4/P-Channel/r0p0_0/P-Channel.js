import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the P_Channel protocol
 */
export class P_Channel extends Interface {
    /**
     * Create a new P_Channel Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('P_Channel', {
            PERIPHERALS: params.PERIPHERALS || 0,
            STATES: params.STATES || 0
        }, role);
        this.signals = {
            RESETn: { width: 1 },
            PACTIVE: { width: params.PERIPHERALS || 0 },
            PSTATE: { width: params.STATES || 0 },
            PREQ: { width: 1 },
            PACCEPT: { width: 1 },
            PDENY: { width: 1 }
        };
        this.modports = {
            outward: {
                RESETn: 'input',
                PACTIVE: 'input',
                PSTATE: 'output',
                PREQ: 'output',
                PACCEPT: 'input',
                PDENY: 'input'
            },
            inward: {
                RESETn: 'input',
                PACTIVE: 'output',
                PSTATE: 'input',
                PREQ: 'input',
                PACCEPT: 'output',
                PDENY: 'output'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
P_Channel.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'P-Channel',
    version: 'r0p0_0'
};

import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the Q_Channel protocol
 */
export class Q_Channel extends Interface {
    /**
     * Create a new Q_Channel Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('Q_Channel', {}, role);
        this.signals = {
            QACTIVE: { width: 1 },
            QREQn: { width: 1 },
            QACCEPTn: { width: 1 },
            QDENY: { width: 1 }
        };
        this.modports = {
            outward: {
                QACTIVE: 'input',
                QREQn: 'output',
                QACCEPTn: 'input',
                QDENY: 'input'
            },
            inward: {
                QACTIVE: 'output',
                QREQn: 'input',
                QACCEPTn: 'output',
                QDENY: 'output'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
Q_Channel.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'Q-Channel',
    version: 'r0p0_0'
};

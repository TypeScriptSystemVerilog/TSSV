import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the Q_Channel_rtl protocol
 */
export class Q_Channel_rtl extends Interface {
    /**
     * Create a new Q_Channel_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('Q_Channel_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role);
        this.signals = {
            QACTIVE: { width: 1 },
            QREQn: { width: 1 },
            QACCEPTn: { width: 1 },
            QDENY: { width: 1 },
            QACTIVECHK: { width: 1 },
            QREQCHK: { width: 1 },
            QACCEPTCHK: { width: 1 },
            QDENYCHK: { width: 1 }
        };
        this.modports = {
            master: {
                QACTIVE: 'input',
                QREQn: 'output',
                QACCEPTn: 'input',
                QDENY: 'input',
                QACTIVECHK: 'input',
                QREQCHK: 'output',
                QACCEPTCHK: 'input',
                QDENYCHK: 'input'
            },
            slave: {
                QACTIVE: 'output',
                QREQn: 'input',
                QACCEPTn: 'output',
                QDENY: 'output',
                QACTIVECHK: 'output',
                QREQCHK: 'input',
                QACCEPTCHK: 'output',
                QDENYCHK: 'output'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
Q_Channel_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'Q-Channel_rtl',
    version: 'r0p0_0'
};

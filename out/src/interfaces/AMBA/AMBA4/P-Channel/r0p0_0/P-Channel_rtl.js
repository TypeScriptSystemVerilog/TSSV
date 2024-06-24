import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the P_Channel_rtl protocol
 */
export class P_Channel_rtl extends Interface {
    /**
     * Create a new P_Channel_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('P_Channel_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role);
        this.signals = {
            RESETn: { width: 1 },
            PACTIVE: { width: params.DIW || 8 },
            PSTATE: { width: params.DIW || 8 },
            PREQ: { width: 1 },
            PACCEPT: { width: 1 },
            PDENY: { width: 1 },
            PACTIVECHK: { width: params.DIW || 8 },
            PSTATECHK: { width: params.DIW || 8 },
            PREQCHK: { width: 1 },
            PACCEPTCHK: { width: 1 },
            PDENYCHK: { width: 1 }
        };
        this.modports = {
            master: {
                RESETn: 'input',
                PACTIVE: 'input',
                PSTATE: 'output',
                PREQ: 'output',
                PACCEPT: 'input',
                PDENY: 'input',
                PACTIVECHK: 'input',
                PSTATECHK: 'output',
                PREQCHK: 'output',
                PACCEPTCHK: 'input',
                PDENYCHK: 'input'
            },
            slave: {
                RESETn: 'input',
                PACTIVE: 'output',
                PSTATE: 'input',
                PREQ: 'input',
                PACCEPT: 'output',
                PDENY: 'output',
                PACTIVECHK: 'output',
                PSTATECHK: 'input',
                PREQCHK: 'input',
                PACCEPTCHK: 'output',
                PDENYCHK: 'output'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
P_Channel_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'P-Channel_rtl',
    version: 'r0p0_0'
};

import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the GFB_rtl protocol
 */
export class GFB_rtl extends Interface {
    /**
     * Create a new GFB_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('GFB_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role);
        this.signals = {
            FCLK: { width: 1 },
            FCLKEN: { width: 1 },
            FRESETn: { width: 1 },
            FADDR: { width: params.AW || 32 },
            FCMD: { width: 3 },
            FWDATA: { width: params.DW || 32 },
            FABORT: { width: 1 },
            FRDATA: { width: params.DW || 32 },
            FREADY: { width: 1 },
            FRESP: { width: 1 }
        };
        this.modports = {
            master: {
                FCLK: 'input',
                FCLKEN: 'input',
                FRESETn: 'input',
                FADDR: 'output',
                FCMD: 'output',
                FWDATA: 'output',
                FABORT: 'output',
                FRDATA: 'input',
                FREADY: 'input',
                FRESP: 'input'
            },
            slave: {
                FCLK: 'input',
                FCLKEN: 'input',
                FRESETn: 'input',
                FADDR: 'input',
                FCMD: 'input',
                FWDATA: 'input',
                FABORT: 'input',
                FRDATA: 'output',
                FREADY: 'output',
                FRESP: 'output'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
GFB_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA5',
    name: 'GFB_rtl',
    version: 'r0p0_0'
};

import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the APB4_rtl protocol
 */
export class APB4_rtl extends Interface {
    /**
     * Create a new APB4_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('APB4_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role);
        this.signals = {
            PCLK: { width: 1 },
            PRESETn: { width: 1 },
            PADDR: { width: params.AW || 32 },
            PSELx: { width: 1 },
            PENABLE: { width: 1 },
            PWRITE: { width: 1 },
            PRDATA: { width: params.DW || 32 },
            PWDATA: { width: params.DW || 32 },
            PPROT: { width: 3 },
            PSTRB: { width: params.DIW || 8 },
            PREADY: { width: 1 },
            PSLVERR: { width: 1 },
            PCLKEN: { width: 1 }
        };
        this.modports = {
            master: {
                PCLK: 'input',
                PRESETn: 'input',
                PADDR: 'output',
                PSELx: 'output',
                PENABLE: 'output',
                PWRITE: 'output',
                PRDATA: 'input',
                PWDATA: 'output',
                PPROT: 'output',
                PSTRB: 'output',
                PREADY: 'input',
                PSLVERR: 'input',
                PCLKEN: 'input'
            },
            slave: {
                PCLK: 'input',
                PRESETn: 'input',
                PADDR: 'input',
                PSELx: 'input',
                PENABLE: 'input',
                PWRITE: 'input',
                PRDATA: 'output',
                PWDATA: 'input',
                PPROT: 'input',
                PSTRB: 'input',
                PREADY: 'output',
                PSLVERR: 'output',
                PCLKEN: 'input'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
APB4_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'APB4_rtl',
    version: 'r0p0_0'
};

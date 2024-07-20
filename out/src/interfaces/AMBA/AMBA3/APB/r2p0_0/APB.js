import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the APB protocol
 */
export class APB extends Interface {
    /**
     * Create a new APB Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('APB', {
            ADDR_WIDTH: params.ADDR_WIDTH || 32,
            DATA_WIDTH: params.DATA_WIDTH || 32
        }, role);
        this.signals = {
            PCLK: { width: 1 },
            PRESETn: { width: 1 },
            PADDR: { width: params.ADDR_WIDTH || 32 },
            PSELx: { width: 1 },
            PENABLE: { width: 1 },
            PWRITE: { width: 1 },
            PRDATA: { width: params.DATA_WIDTH || 32 },
            PWDATA: { width: params.DATA_WIDTH || 32 },
            PREADY: { width: 1 },
            PSLVERR: { width: 1 },
            PCLKEN: { width: 1 }
        };
        this.modports = {
            outward: {
                PCLK: 'input',
                PRESETn: 'input',
                PADDR: 'output',
                PSELx: 'output',
                PENABLE: 'output',
                PWRITE: 'output',
                PRDATA: 'input',
                PWDATA: 'output',
                PREADY: 'input',
                PSLVERR: 'input',
                PCLKEN: 'input'
            },
            inward: {
                PCLK: 'input',
                PRESETn: 'input',
                PADDR: 'input',
                PSELx: 'input',
                PENABLE: 'input',
                PWRITE: 'input',
                PRDATA: 'output',
                PWDATA: 'input',
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
APB.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'APB',
    version: 'r2p0_0'
};

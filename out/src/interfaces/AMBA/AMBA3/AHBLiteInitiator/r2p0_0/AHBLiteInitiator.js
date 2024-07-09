import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the AHBLiteInitiator protocol
 */
export class AHBLiteInitiator extends Interface {
    /**
     * Create a new AHBLiteInitiator Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('AHBLiteInitiator', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            ADDR_WIDTH: params.ADDR_WIDTH || 32,
            USER_WIDTH: params.USER_WIDTH || 0,
            SLAVES: params.SLAVES || 0
        }, role);
        this.signals = {
            HCLK: { width: 1 },
            HCLKEN: { width: 1 },
            HRESETn: { width: 1 },
            HADDR: { width: params.ADDR_WIDTH || 32 },
            HBURST: { width: 3 },
            HMASTLOCK: { width: 1 },
            HPROT: { width: 4 },
            HSIZE: { width: 3 },
            HTRANS: { width: 2 },
            HWDATA: { width: params.DATA_WIDTH || 32 },
            HWRITE: { width: 1 },
            HRDATA: { width: params.DATA_WIDTH || 32 },
            HREADYOUT: { width: 1 },
            HRESP: { width: 1 },
            HSELx: { width: params.SLAVES || 8 },
            HREADY: { width: 1 }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            this.signals.HRUSER = { width: params.USER_WIDTH };
            this.signals.HWUSER = { width: params.USER_WIDTH };
            this.signals.HAUSER = { width: params.USER_WIDTH };
        }
        this.modports = {
            outward: {
                HCLK: 'input',
                HCLKEN: 'input',
                HRESETn: 'input',
                HADDR: 'output',
                HBURST: 'output',
                HMASTLOCK: 'output',
                HPROT: 'output',
                HSIZE: 'output',
                HTRANS: 'output',
                HWDATA: 'output',
                HWRITE: 'output',
                HRDATA: 'input',
                HRESP: 'input',
                HREADY: 'input',
                HRUSER: 'input',
                HWUSER: 'output',
                HAUSER: 'output'
            }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            this.modports.outward = {
                ...this.modports.outward,
                HRUSER: 'input',
                HWUSER: 'output',
                HAUSER: 'output'
            };
        }
        this.modports.inward = Object.fromEntries(Object.entries(this.modports.outward).map(([key, value]) => [key, (value === 'input') ? 'output' : 'input']));
    }
}
/**
 * VLNV Metadata
 */
AHBLiteInitiator.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'AHBLiteInitiator',
    version: 'r2p0_0'
};

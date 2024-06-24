import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the AHBLiteInitiator_rtl protocol
 */
export class AHBLiteInitiator_rtl extends Interface {
    /**
     * Create a new AHBLiteInitiator_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('AHBLiteInitiator_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role);
        this.signals = {
            HCLK: { width: 1 },
            HCLKEN: { width: 1 },
            HRESETn: { width: 1 },
            HADDR: { width: params.AW || 32 },
            HBURST: { width: 3 },
            HMASTLOCK: { width: 1 },
            HPROT: { width: 4 },
            HSIZE: { width: 3 },
            HTRANS: { width: 2 },
            HWDATA: { width: params.DW || 32 },
            HWRITE: { width: 1 },
            HRDATA: { width: params.DW || 32 },
            HREADYOUT: { width: params.DIW || 8 },
            HRESP: { width: 1 },
            HSELx: { width: params.DIW || 8 },
            HREADY: { width: 1 },
            HRUSER: { width: params.DIW || 8 },
            HWUSER: { width: params.DIW || 8 },
            HAUSER: { width: params.DIW || 8 }
        };
        this.modports = {
            master: {
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
            },
            slave: {
                HCLK: 'input',
                HCLKEN: 'input',
                HRESETn: 'input',
                HADDR: 'input',
                HBURST: 'input',
                HMASTLOCK: 'input',
                HPROT: 'input',
                HSIZE: 'input',
                HTRANS: 'input',
                HWDATA: 'input',
                HWRITE: 'input',
                HRDATA: 'output',
                HRESP: 'output',
                HREADY: 'output',
                HRUSER: 'output',
                HWUSER: 'input',
                HAUSER: 'input'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
AHBLiteInitiator_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'AHBLiteInitiator_rtl',
    version: 'r2p0_0'
};

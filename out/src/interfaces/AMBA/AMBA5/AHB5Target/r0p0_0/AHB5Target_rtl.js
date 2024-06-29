import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the AHB5Target_rtl protocol
 */
export class AHB5Target_rtl extends Interface {
    /**
     * Create a new AHB5Target_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('AHB5Target_rtl', {
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
            HBURST: { width: params.DIW || 8 },
            HMASTLOCK: { width: 1 },
            HPROT: { width: params.DIW || 8 },
            HSIZE: { width: 3 },
            HNONSEC: { width: 1 },
            HEXCL: { width: 1 },
            HMASTER: { width: params.DIW || 8 },
            HTRANS: { width: 2 },
            HWRITE: { width: 1 },
            HWDATA: { width: params.DW || 32 },
            HWSTRB: { width: params.DIW || 8 },
            HRDATA: { width: params.DW || 32 },
            HREADY: { width: 1 },
            HREADYOUT: { width: 1 },
            HRESP: { width: 1 },
            HEXOKAY: { width: 1 },
            HSELx: { width: 1 },
            HAUSER: { width: params.DIW || 8 },
            HWUSER: { width: params.DIW || 8 },
            HRUSER: { width: params.DIW || 8 },
            HBUSER: { width: params.DIW || 8 },
            HTRANSCHK: { width: 1 },
            HADDRCHK: { width: params.DIW || 8 },
            HCTRLCHK1: { width: 1 },
            HCTRLCHK2: { width: 1 },
            HPROTCHK: { width: 1 },
            HWSTRBCHK: { width: params.DIW || 8 },
            HWDATACHK: { width: params.DIW || 8 },
            HRDATACHK: { width: params.DIW || 8 },
            HREADYOUTCHK: { width: 1 },
            HREADYCHK: { width: 1 },
            HRESPCHK: { width: 1 },
            HSELxCHK: { width: 1 },
            HAUSERCHK: { width: params.DIW || 8 },
            HRUSERCHK: { width: params.DIW || 8 },
            HWUSERCHK: { width: params.DIW || 8 },
            HBUSERCHK: { width: params.DIW || 8 }
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
                HNONSEC: 'output',
                HEXCL: 'output',
                HMASTER: 'output',
                HTRANS: 'output',
                HWRITE: 'output',
                HWDATA: 'output',
                HWSTRB: 'output',
                HRDATA: 'input',
                HREADY: 'output',
                HREADYOUT: 'input',
                HRESP: 'input',
                HEXOKAY: 'input',
                HSELx: 'output',
                HAUSER: 'output',
                HWUSER: 'output',
                HRUSER: 'input',
                HBUSER: 'input',
                HTRANSCHK: 'output',
                HADDRCHK: 'output',
                HCTRLCHK1: 'output',
                HCTRLCHK2: 'output',
                HPROTCHK: 'output',
                HWSTRBCHK: 'output',
                HWDATACHK: 'output',
                HRDATACHK: 'input',
                HREADYOUTCHK: 'input',
                HREADYCHK: 'output',
                HRESPCHK: 'input',
                HSELxCHK: 'output',
                HAUSERCHK: 'output',
                HRUSERCHK: 'input',
                HWUSERCHK: 'output',
                HBUSERCHK: 'input'
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
                HNONSEC: 'input',
                HEXCL: 'input',
                HMASTER: 'input',
                HTRANS: 'input',
                HWRITE: 'input',
                HWDATA: 'input',
                HWSTRB: 'input',
                HRDATA: 'output',
                HREADY: 'input',
                HREADYOUT: 'output',
                HRESP: 'output',
                HEXOKAY: 'output',
                HSELx: 'input',
                HAUSER: 'input',
                HWUSER: 'input',
                HRUSER: 'output',
                HBUSER: 'output',
                HTRANSCHK: 'input',
                HADDRCHK: 'input',
                HCTRLCHK1: 'input',
                HCTRLCHK2: 'input',
                HPROTCHK: 'input',
                HWSTRBCHK: 'input',
                HWDATACHK: 'input',
                HRDATACHK: 'output',
                HREADYOUTCHK: 'output',
                HREADYCHK: 'input',
                HRESPCHK: 'output',
                HSELxCHK: 'input',
                HAUSERCHK: 'input',
                HRUSERCHK: 'output',
                HWUSERCHK: 'input',
                HBUSERCHK: 'output'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
AHB5Target_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA5',
    name: 'AHB5Target_rtl',
    version: 'r0p0_0'
};

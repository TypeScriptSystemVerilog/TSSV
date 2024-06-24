import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the AXI4Stream_rtl protocol
 */
export class AXI4Stream_rtl extends Interface {
    /**
     * Create a new AXI4Stream_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('AXI4Stream_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role);
        this.signals = {
            ACLK: { width: 1 },
            ACLKEN: { width: 1 },
            ARESETn: { width: 1 },
            TVALID: { width: 1 },
            TREADY: { width: 1 },
            TDATA: { width: params.DW || 32 },
            TSTRB: { width: params.DIW || 8 },
            TKEEP: { width: params.DIW || 8 },
            TLAST: { width: 1 },
            TID: { width: params.DIW || 8 },
            TDEST: { width: params.DIW || 8 },
            TUSER: { width: params.DIW || 8 },
            TWAKEUP: { width: 1 }
        };
        this.modports = {
            master: {
                ACLK: 'input',
                ACLKEN: 'input',
                ARESETn: 'input',
                TVALID: 'output',
                TREADY: 'input',
                TDATA: 'output',
                TSTRB: 'output',
                TKEEP: 'output',
                TLAST: 'output',
                TID: 'output',
                TDEST: 'output',
                TUSER: 'output',
                TWAKEUP: 'output'
            },
            slave: {
                ACLK: 'input',
                ACLKEN: 'input',
                ARESETn: 'input',
                TVALID: 'input',
                TREADY: 'output',
                TDATA: 'input',
                TSTRB: 'input',
                TKEEP: 'input',
                TLAST: 'input',
                TID: 'input',
                TDEST: 'input',
                TUSER: 'input',
                TWAKEUP: 'input'
            }
        };
    }
}
/**
 * VLNV Metadata
 */
AXI4Stream_rtl.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'AXI4Stream_rtl',
    version: 'r0p0_1'
};

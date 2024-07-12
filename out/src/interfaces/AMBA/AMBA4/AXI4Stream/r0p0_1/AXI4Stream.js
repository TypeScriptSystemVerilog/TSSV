import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the AXI4Stream protocol
 */
export class AXI4Stream extends Interface {
    /**
     * Create a new AXI4Stream Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('AXI4Stream', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            ID_WIDTH: params.ID_WIDTH || 4,
            USER_WIDTH: params.USER_WIDTH || 0,
            TDEST_WIDTH: params.TDEST_WIDTH || 4
        }, role);
        this.signals = {
            ACLK: { width: 1 },
            ACLKEN: { width: 1 },
            ARESETn: { width: 1 },
            TVALID: { width: 1 },
            TREADY: { width: 1 },
            TDATA: { width: params.DATA_WIDTH || 32 },
            TSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
            TKEEP: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
            TLAST: { width: 1 },
            TID: { width: params.ID_WIDTH || 8 },
            TDEST: { width: params.TDEST_WIDTH || 4 },
            TWAKEUP: { width: 1 }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            this.signals.TUSER = { width: params.USER_WIDTH };
        }
        this.modports = {
            outward: {
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
                TWAKEUP: 'output'
            },
            inward: {
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
                TWAKEUP: 'input'
            }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            this.modports.outward = {
                TUSER: 'input'
            };
            this.modports.inward = {
                TUSER: 'output'
            };
        }
    }
}
/**
 * VLNV Metadata
 */
AXI4Stream.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'AXI4Stream',
    version: 'r0p0_1'
};

import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the AXI_WO protocol
 */
export class AXI_WO extends Interface {
    /**
     * Create a new AXI_WO Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('AXI_WO', {
            ID_WIDTH: params.ID_WIDTH || 4,
            ADDR_WIDTH: params.ADDR_WIDTH || 32,
            DATA_WIDTH: params.DATA_WIDTH || 32,
            USER_WIDTH: params.USER_WIDTH || 0,
            QOS: params.QOS || 'withQOS',
            REGION: params.REGION || 'noREGION'
        }, role);
        this.signals = {
            ACLK: { width: 1 },
            ACLKEN: { width: 1 },
            ARESETn: { width: 1 },
            AWID: { width: params.ID_WIDTH || 4 },
            AWADDR: { width: params.ADDR_WIDTH || 32 },
            AWLEN: { width: 4 },
            AWSIZE: { width: 3 },
            AWBURST: { width: 2 },
            AWLOCK: { width: 2 },
            AWCACHE: { width: 4 },
            AWPROT: { width: 3 },
            AWVALID: { width: 1 },
            AWREADY: { width: 1 },
            WID: { width: params.ID_WIDTH || 4 },
            WDATA: { width: params.DATA_WIDTH || 32 },
            WSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
            WLAST: { width: 1 },
            WVALID: { width: 1 },
            WREADY: { width: 1 },
            BID: { width: params.ID_WIDTH || 4 },
            BRESP: { width: 2 },
            BVALID: { width: 1 },
            BREADY: { width: 1 },
            ARID: { width: params.ID_WIDTH || 4 },
            ARADDR: { width: params.ADDR_WIDTH || 32 },
            ARLEN: { width: 4 },
            ARSIZE: { width: 3 },
            ARBURST: { width: 2 },
            ARLOCK: { width: 2 },
            ARCACHE: { width: 4 },
            ARPROT: { width: 3 },
            ARVALID: { width: 1 },
            ARREADY: { width: 1 },
            RID: { width: params.ID_WIDTH || 4 },
            RDATA: { width: params.DATA_WIDTH || 32 },
            RRESP: { width: 2 },
            RLAST: { width: 1 },
            RVALID: { width: 1 },
            RREADY: { width: 1 }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            this.signals.AWUSER = { width: params.USER_WIDTH };
            this.signals.WUSER = { width: params.USER_WIDTH };
            this.signals.BUSER = { width: params.USER_WIDTH };
            this.signals.ARUSER = { width: params.USER_WIDTH };
            this.signals.RUSER = { width: params.USER_WIDTH };
        }
        if (params.QOS === 'withQOS') {
            this.signals.ARQOS = { width: 4 };
            this.signals.AWQOS = { width: 4 };
        }
        if (params.REGION === 'withREGION') {
            this.signals.ARREGION = { width: 4 };
            this.signals.AWREGION = { width: 4 };
        }
        this.modports = {
            master: {
                ACLK: 'input',
                ACLKEN: 'input',
                ARESETn: 'input',
                AWID: 'output',
                AWADDR: 'output',
                AWLEN: 'output',
                AWSIZE: 'output',
                AWBURST: 'output',
                AWLOCK: 'output',
                AWCACHE: 'output',
                AWPROT: 'output',
                AWVALID: 'output',
                AWREADY: 'input',
                WID: 'output',
                WDATA: 'output',
                WSTRB: 'output',
                WLAST: 'output',
                WVALID: 'output',
                WREADY: 'input',
                BID: 'input',
                BRESP: 'input',
                BVALID: 'input',
                BREADY: 'output',
                ARID: 'output',
                ARADDR: 'output',
                ARLEN: 'output',
                ARSIZE: 'output',
                ARBURST: 'output',
                ARLOCK: 'output',
                ARCACHE: 'output',
                ARPROT: 'output',
                ARVALID: 'output',
                ARREADY: 'input',
                RID: 'input',
                RDATA: 'input',
                RRESP: 'input',
                RLAST: 'input',
                RVALID: 'input',
                RREADY: 'output'
            }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            this.modports.outward = {
                ...this.modports.outward,
                AWUSER: 'output',
                WUSER: 'output',
                BUSER: 'input',
                ARUSER: 'output',
                RUSER: 'input'
            };
        }
        if (params.QOS === 'withQOS') {
            this.modports.outward = {
                ...this.modports.outward,
                ARQOS: 'output',
                AWQOS: 'output'
            };
        }
        if (params.REGION === 'withREGION') {
            this.modports.outward = {
                ...this.modports.outward,
                AWREGION: 'output',
                ARREGION: 'output'
            };
        }
        this.modports.inward = Object.fromEntries(Object.entries(this.modports.outward).map(([key, value]) => [key, (value === 'input') ? 'output' : 'input']));
    }
}
/**
 * VLNV Metadata
 */
AXI_WO.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA3',
    name: 'AXI_WO',
    version: 'r2p0_0'
};

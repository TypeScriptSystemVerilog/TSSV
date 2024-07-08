import { Interface } from 'tssv/lib/core/TSSV';
/**
 * TSSV Interface bundle for the AXI4 protocol
 */
export class AXI4 extends Interface {
    /**
     * Create a new AXI4 Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    constructor(params = {}, role = undefined) {
        super('AXI4', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            ADDR_WIDTH: params.ADDR_WIDTH || 32,
            ID_WIDTH: params.AWID_WIDTH || 4,
            USER_WIDTH: params.USER_WIDTH || 0,
            QOS: params.QOS || 'withQOS',
            REGION: params.REGION || 'noREGION'
        }, role);
        this.signals = {
            AWID: { width: params.ID_WIDTH || 4 },
            AWADDR: { width: params.ADDR_WIDTH || 32 },
            AWLEN: { width: 8 },
            AWSIZE: { width: 3 },
            AWBURST: { width: 2 },
            AWLOCK: { width: 1 },
            AWCACHE: { width: 4 },
            AWPROT: { width: 3 },
            AWVALID: { width: 1 },
            AWREADY: { width: 1 },
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
            ARLEN: { width: 8 },
            ARSIZE: { width: 3 },
            ARBURST: { width: 2 },
            ARLOCK: { width: 1 },
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
        // Add ARQOS and AWQOS if QOS is true
        if (params.QOS === 'withQOS') {
            this.signals.ARQOS = { width: 4 };
            this.signals.AWQOS = { width: 4 };
        }
        if (params.REGION === 'withREGION') {
            this.signals.ARREGION = { width: 4 };
            this.signals.AWREGION = { width: 4 };
        }
        this.modports = {
            outward: {
                AWID: 'output',
                AWADDR: 'output',
                AWLEN: 'output',
                AWSIZE: 'output',
                AWBURST: 'output',
                AWLOCK: 'output',
                AWCACHE: 'output',
                AWPROT: 'output',
                AWQOS: 'output',
                AWVALID: 'output',
                AWREADY: 'input',
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
                ARQOS: 'output',
                ARVALID: 'output',
                ARREADY: 'input',
                RID: 'input',
                RDATA: 'input',
                RRESP: 'input',
                RLAST: 'input',
                RVALID: 'input',
                RREADY: 'output'
            },
            inward: {
                AWID: 'input',
                AWADDR: 'input',
                AWLEN: 'input',
                AWSIZE: 'input',
                AWBURST: 'input',
                AWLOCK: 'input',
                AWCACHE: 'input',
                AWPROT: 'input',
                AWQOS: 'input',
                AWVALID: 'input',
                AWREADY: 'output',
                WDATA: 'input',
                WSTRB: 'input',
                WLAST: 'input',
                WVALID: 'input',
                WREADY: 'output',
                BID: 'output',
                BRESP: 'output',
                BVALID: 'output',
                BREADY: 'input',
                ARID: 'input',
                ARADDR: 'input',
                ARLEN: 'input',
                ARSIZE: 'input',
                ARBURST: 'input',
                ARLOCK: 'input',
                ARCACHE: 'input',
                ARPROT: 'input',
                ARQOS: 'input',
                ARVALID: 'input',
                ARREADY: 'output',
                RID: 'output',
                RDATA: 'output',
                RRESP: 'output',
                RLAST: 'output',
                RVALID: 'output',
                RREADY: 'input'
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
            this.modports.inward = {
                ...this.modports.inward,
                AWUSER: 'input',
                WUSER: 'input',
                BUSER: 'output',
                ARUSER: 'input',
                RUSER: 'output'
            };
        }
        // Add modports for QOS signals if QOS is true
        if (params.QOS === 'withQOS') {
            this.modports.outward = {
                ...this.modports.outward,
                ARQOS: 'output',
                AWQOS: 'output'
            };
            this.modports.inward = {
                ...this.modports.inward,
                ARQOS: 'input',
                AWQOS: 'input'
            };
        }
        if (params.REGION === 'withREGION') {
            this.modports.outward = {
                ...this.modports.outward,
                AWREGION: 'output',
                ARREGION: 'output'
            };
            this.modports.inward = {
                ...this.modports.inward,
                AWREGION: 'input',
                ARREGION: 'input'
            };
        }
    }
}
/**
 * VLNV Metadata
 */
AXI4.VLNV = {
    vendor: 'amba.com',
    library: 'AMBA4',
    name: 'AXI4',
    version: 'r0p0_0'
};

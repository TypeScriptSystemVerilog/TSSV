"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AXI4Stream = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the AXI4Stream protocol
 */
var AXI4Stream = /** @class */ (function (_super) {
    __extends(AXI4Stream, _super);
    /**
     * Create a new AXI4Stream Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function AXI4Stream(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'AXI4Stream', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            ID_WIDTH: params.ID_WIDTH || 4,
            USER_WIDTH: params.USER_WIDTH || 0,
            TDEST_WIDTH: params.TDEST_WIDTH || 4
        }, role) || this;
        _this.signals = {
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
            _this.signals.TUSER = { width: params.USER_WIDTH };
        }
        _this.modports = {
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
            _this.modports.outward = {
                TUSER: 'input'
            };
            _this.modports.inward = {
                TUSER: 'output'
            };
        }
        return _this;
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
    return AXI4Stream;
}(TSSV_1.Interface));
exports.AXI4Stream = AXI4Stream;

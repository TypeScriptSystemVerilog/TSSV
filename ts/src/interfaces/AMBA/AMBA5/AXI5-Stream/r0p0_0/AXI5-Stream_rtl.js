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
exports.AXI5_Stream_rtl = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the AXI5_Stream_rtl protocol
 */
var AXI5_Stream_rtl = /** @class */ (function (_super) {
    __extends(AXI5_Stream_rtl, _super);
    /**
     * Create a new AXI5_Stream_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function AXI5_Stream_rtl(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'AXI5_Stream_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role) || this;
        _this.signals = {
            ACLK: { width: 1 },
            ACLKEN: { width: 1 },
            ACLKENCHK: { width: 1 },
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
            TWAKEUP: { width: 1 },
            TVALIDCHK: { width: 1 },
            TREADYCHK: { width: 1 },
            TDATACHK: { width: params.DIW || 8 },
            TSTRBCHK: { width: params.DIW || 8 },
            TKEEPCHK: { width: params.DIW || 8 },
            TLASTCHK: { width: 1 },
            TIDCHK: { width: params.DIW || 8 },
            TDESTCHK: { width: params.DIW || 8 },
            TUSERCHK: { width: params.DIW || 8 },
            TWAKEUPCHK: { width: 1 }
        };
        _this.modports = {
            master: {
                ACLK: 'input',
                ACLKEN: 'input',
                ACLKENCHK: 'input',
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
                TWAKEUP: 'output',
                TVALIDCHK: 'output',
                TREADYCHK: 'input',
                TDATACHK: 'output',
                TSTRBCHK: 'output',
                TKEEPCHK: 'output',
                TLASTCHK: 'output',
                TIDCHK: 'output',
                TDESTCHK: 'output',
                TUSERCHK: 'output',
                TWAKEUPCHK: 'output'
            },
            slave: {
                ACLK: 'input',
                ACLKEN: 'input',
                ACLKENCHK: 'input',
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
                TWAKEUP: 'input',
                TVALIDCHK: 'input',
                TREADYCHK: 'output',
                TDATACHK: 'input',
                TSTRBCHK: 'input',
                TKEEPCHK: 'input',
                TLASTCHK: 'input',
                TIDCHK: 'input',
                TDESTCHK: 'input',
                TUSERCHK: 'input',
                TWAKEUPCHK: 'input'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    AXI5_Stream_rtl.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA5',
        name: 'AXI5-Stream_rtl',
        version: 'r0p0_0'
    };
    return AXI5_Stream_rtl;
}(TSSV_1.Interface));
exports.AXI5_Stream_rtl = AXI5_Stream_rtl;

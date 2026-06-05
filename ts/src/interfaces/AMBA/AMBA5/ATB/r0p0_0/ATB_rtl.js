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
exports.ATB_rtl = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the ATB_rtl protocol
 */
var ATB_rtl = /** @class */ (function (_super) {
    __extends(ATB_rtl, _super);
    /**
     * Create a new ATB_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function ATB_rtl(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'ATB_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role) || this;
        _this.signals = {
            ATCLK: { width: 1 },
            ATCLKEN: { width: 1 },
            ATRESETn: { width: 1 },
            ATBYTES: { width: params.DIW || 8 },
            ATDATA: { width: params.DW || 32 },
            ATID: { width: 7 },
            ATREADY: { width: 1 },
            ATVALID: { width: 1 },
            ATWAKEUP: { width: 1 },
            AFVALID: { width: 1 },
            AFREADY: { width: 1 },
            SYNCREQ: { width: 1 }
        };
        _this.modports = {
            master: {
                ATCLK: 'input',
                ATCLKEN: 'input',
                ATRESETn: 'input',
                ATBYTES: 'output',
                ATDATA: 'output',
                ATID: 'output',
                ATREADY: 'input',
                ATVALID: 'output',
                ATWAKEUP: 'output',
                AFVALID: 'input',
                AFREADY: 'output',
                SYNCREQ: 'input'
            },
            slave: {
                ATCLK: 'input',
                ATCLKEN: 'input',
                ATRESETn: 'input',
                ATBYTES: 'input',
                ATDATA: 'input',
                ATID: 'input',
                ATREADY: 'output',
                ATVALID: 'input',
                ATWAKEUP: 'input',
                AFVALID: 'output',
                AFREADY: 'input',
                SYNCREQ: 'output'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    ATB_rtl.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA5',
        name: 'ATB_rtl',
        version: 'r0p0_0'
    };
    return ATB_rtl;
}(TSSV_1.Interface));
exports.ATB_rtl = ATB_rtl;

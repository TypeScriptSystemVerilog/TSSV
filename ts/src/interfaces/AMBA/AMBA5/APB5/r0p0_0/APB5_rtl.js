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
exports.APB5_rtl = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the APB5_rtl protocol
 */
var APB5_rtl = /** @class */ (function (_super) {
    __extends(APB5_rtl, _super);
    /**
     * Create a new APB5_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function APB5_rtl(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'APB5_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role) || this;
        _this.signals = {
            PCLK: { width: 1 },
            PCLKEN: { width: 1 },
            PCLKENCHK: { width: 1 },
            PRESETn: { width: 1 },
            PADDR: { width: params.AW || 32 },
            PPROT: { width: 3 },
            PNSE: { width: 1 },
            PSUBSYSID: { width: params.DIW || 8 },
            PSELx: { width: 1 },
            PENABLE: { width: 1 },
            PWRITE: { width: 1 },
            PWDATA: { width: params.DW || 32 },
            PSTRB: { width: params.DIW || 8 },
            PREADY: { width: 1 },
            PRDATA: { width: params.DW || 32 },
            PSLVERR: { width: 1 },
            PWAKEUP: { width: 1 },
            PAUSER: { width: params.DIW || 8 },
            PWUSER: { width: params.DIW || 8 },
            PRUSER: { width: params.DIW || 8 },
            PBUSER: { width: params.DIW || 8 },
            PADDRCHK: { width: params.DIW || 8 },
            PCTRLCHK: { width: 1 },
            PSUBSYSIDCHK: { width: 1 },
            PSELxCHK: { width: 1 },
            PENABLECHK: { width: 1 },
            PWDATACHK: { width: params.DIW || 8 },
            PSTRBCHK: { width: 1 },
            PREADYCHK: { width: 1 },
            PRDATACHK: { width: params.DIW || 8 },
            PSLVERRCHK: { width: 1 },
            PWAKEUPCHK: { width: 1 },
            PAUSERCHK: { width: params.DIW || 8 },
            PWUSERCHK: { width: params.DIW || 8 },
            PRUSERCHK: { width: params.DIW || 8 },
            PBUSERCHK: { width: params.DIW || 8 }
        };
        _this.modports = {
            master: {
                PCLK: 'input',
                PCLKEN: 'input',
                PCLKENCHK: 'input',
                PRESETn: 'input',
                PADDR: 'output',
                PPROT: 'output',
                PNSE: 'output',
                PSUBSYSID: 'output',
                PSELx: 'output',
                PENABLE: 'output',
                PWRITE: 'output',
                PWDATA: 'output',
                PSTRB: 'output',
                PREADY: 'input',
                PRDATA: 'input',
                PSLVERR: 'input',
                PWAKEUP: 'output',
                PAUSER: 'output',
                PWUSER: 'output',
                PRUSER: 'input',
                PBUSER: 'input',
                PADDRCHK: 'output',
                PCTRLCHK: 'output',
                PSUBSYSIDCHK: 'output',
                PSELxCHK: 'output',
                PENABLECHK: 'output',
                PWDATACHK: 'output',
                PSTRBCHK: 'output',
                PREADYCHK: 'input',
                PRDATACHK: 'input',
                PSLVERRCHK: 'input',
                PWAKEUPCHK: 'output',
                PAUSERCHK: 'output',
                PWUSERCHK: 'output',
                PRUSERCHK: 'input',
                PBUSERCHK: 'input'
            },
            slave: {
                PCLK: 'input',
                PCLKEN: 'input',
                PCLKENCHK: 'input',
                PRESETn: 'input',
                PADDR: 'input',
                PPROT: 'input',
                PNSE: 'input',
                PSUBSYSID: 'input',
                PSELx: 'input',
                PENABLE: 'input',
                PWRITE: 'input',
                PWDATA: 'input',
                PSTRB: 'input',
                PREADY: 'output',
                PRDATA: 'output',
                PSLVERR: 'output',
                PWAKEUP: 'input',
                PAUSER: 'input',
                PWUSER: 'input',
                PRUSER: 'output',
                PBUSER: 'output',
                PADDRCHK: 'input',
                PCTRLCHK: 'input',
                PSUBSYSIDCHK: 'input',
                PSELxCHK: 'input',
                PENABLECHK: 'input',
                PWDATACHK: 'input',
                PSTRBCHK: 'input',
                PREADYCHK: 'output',
                PRDATACHK: 'output',
                PSLVERRCHK: 'output',
                PWAKEUPCHK: 'input',
                PAUSERCHK: 'input',
                PWUSERCHK: 'input',
                PRUSERCHK: 'output',
                PBUSERCHK: 'output'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    APB5_rtl.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA5',
        name: 'APB5_rtl',
        version: 'r0p0_0'
    };
    return APB5_rtl;
}(TSSV_1.Interface));
exports.APB5_rtl = APB5_rtl;

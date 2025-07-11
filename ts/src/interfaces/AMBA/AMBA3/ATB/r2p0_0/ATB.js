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
exports.ATB = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the ATB protocol
 */
var ATB = /** @class */ (function (_super) {
    __extends(ATB, _super);
    /**
     * Create a new ATB Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function ATB(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'ATB', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            TRACE_DATA_WIDTH: params.TRACE_DATA_WIDTH || 4
        }, role) || this;
        _this.signals = {
            ATCLK: { width: 1 },
            ATCLKEN: { width: 1 },
            ATRESETn: { width: 1 },
            ATBYTES: { width: params.TRACE_DATA_WIDTH || 4 },
            ATDATA: { width: params.DATA_WIDTH || 32 },
            ATID: { width: 7 },
            ATREADY: { width: 1 },
            ATVALID: { width: 1 },
            AFVALID: { width: 1 },
            AFREADY: { width: 1 }
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
                AFVALID: 'input',
                AFREADY: 'output'
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
                AFVALID: 'output',
                AFREADY: 'input'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    ATB.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA3',
        name: 'ATB',
        version: 'r2p0_0'
    };
    return ATB;
}(TSSV_1.Interface));
exports.ATB = ATB;

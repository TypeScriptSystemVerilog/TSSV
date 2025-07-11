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
exports.APB4 = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the APB4 protocol
 */
var APB4 = /** @class */ (function (_super) {
    __extends(APB4, _super);
    /**
     * Create a new APB4 Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function APB4(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'APB4', {
            ADDR_WIDTH: params.ADDR_WIDTH || 32,
            DATA_WIDTH: params.DATA_WIDTH || 32
        }, role) || this;
        _this.signals = {
            PCLK: { width: 1 },
            PRESETn: { width: 1 },
            PADDR: { width: params.ADDR_WIDTH || 32 },
            PSELx: { width: 1 },
            PENABLE: { width: 1 },
            PWRITE: { width: 1 },
            PRDATA: { width: params.DATA_WIDTH || 32 },
            PWDATA: { width: params.DATA_WIDTH || 32 },
            PPROT: { width: 3 },
            PSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
            PREADY: { width: 1 },
            PSLVERR: { width: 1 },
            PCLKEN: { width: 1 }
        };
        _this.modports = {
            outward: {
                PCLK: 'input',
                PRESETn: 'input',
                PADDR: 'output',
                PSELx: 'output',
                PENABLE: 'output',
                PWRITE: 'output',
                PRDATA: 'input',
                PWDATA: 'output',
                PPROT: 'output',
                PSTRB: 'output',
                PREADY: 'input',
                PSLVERR: 'input',
                PCLKEN: 'input'
            },
            inward: {
                PCLK: 'input',
                PRESETn: 'input',
                PADDR: 'input',
                PSELx: 'input',
                PENABLE: 'input',
                PWRITE: 'input',
                PRDATA: 'output',
                PWDATA: 'input',
                PPROT: 'input',
                PSTRB: 'input',
                PREADY: 'output',
                PSLVERR: 'output',
                PCLKEN: 'input'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    APB4.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA4',
        name: 'APB4',
        version: 'r0p0_0'
    };
    return APB4;
}(TSSV_1.Interface));
exports.APB4 = APB4;

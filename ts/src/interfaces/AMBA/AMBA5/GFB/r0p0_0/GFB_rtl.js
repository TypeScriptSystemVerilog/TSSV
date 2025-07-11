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
exports.GFB_rtl = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the GFB_rtl protocol
 */
var GFB_rtl = /** @class */ (function (_super) {
    __extends(GFB_rtl, _super);
    /**
     * Create a new GFB_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function GFB_rtl(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'GFB_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role) || this;
        _this.signals = {
            FCLK: { width: 1 },
            FCLKEN: { width: 1 },
            FRESETn: { width: 1 },
            FADDR: { width: params.AW || 32 },
            FCMD: { width: 3 },
            FWDATA: { width: params.DW || 32 },
            FABORT: { width: 1 },
            FRDATA: { width: params.DW || 32 },
            FREADY: { width: 1 },
            FRESP: { width: 1 }
        };
        _this.modports = {
            master: {
                FCLK: 'input',
                FCLKEN: 'input',
                FRESETn: 'input',
                FADDR: 'output',
                FCMD: 'output',
                FWDATA: 'output',
                FABORT: 'output',
                FRDATA: 'input',
                FREADY: 'input',
                FRESP: 'input'
            },
            slave: {
                FCLK: 'input',
                FCLKEN: 'input',
                FRESETn: 'input',
                FADDR: 'input',
                FCMD: 'input',
                FWDATA: 'input',
                FABORT: 'input',
                FRDATA: 'output',
                FREADY: 'output',
                FRESP: 'output'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    GFB_rtl.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA5',
        name: 'GFB_rtl',
        version: 'r0p0_0'
    };
    return GFB_rtl;
}(TSSV_1.Interface));
exports.GFB_rtl = GFB_rtl;

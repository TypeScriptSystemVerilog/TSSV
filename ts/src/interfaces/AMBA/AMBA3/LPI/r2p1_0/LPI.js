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
exports.LPI = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the LPI protocol
 */
var LPI = /** @class */ (function (_super) {
    __extends(LPI, _super);
    /**
     * Create a new LPI Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function LPI(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'LPI', {}, role) || this;
        _this.signals = {
            CLK: { width: 1 },
            CLKEN: { width: 1 },
            RESETn: { width: 1 },
            CSYSREQ: { width: 1 },
            CSYSACK: { width: 1 },
            CACTIVE: { width: 1 }
        };
        _this.modports = {
            outward: {
                CLK: 'input',
                CLKEN: 'input',
                RESETn: 'input',
                CSYSREQ: 'output',
                CSYSACK: 'input',
                CACTIVE: 'input'
            },
            inward: {
                CLK: 'input',
                CLKEN: 'input',
                RESETn: 'input',
                CSYSREQ: 'input',
                CSYSACK: 'output',
                CACTIVE: 'output'
            }
        };
        _this.modports.inward = Object.fromEntries(Object.entries(_this.modports.outward).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, (value === 'input') ? 'output' : 'input'];
        }));
        return _this;
    }
    /**
     * VLNV Metadata
     */
    LPI.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA3',
        name: 'LPI',
        version: 'r2p1_0'
    };
    return LPI;
}(TSSV_1.Interface));
exports.LPI = LPI;

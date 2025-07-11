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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AHBLiteInitiator = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the AHBLiteInitiator protocol
 */
var AHBLiteInitiator = /** @class */ (function (_super) {
    __extends(AHBLiteInitiator, _super);
    /**
     * Create a new AHBLiteInitiator Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function AHBLiteInitiator(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'AHBLiteInitiator', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            ADDR_WIDTH: params.ADDR_WIDTH || 32,
            USER_WIDTH: params.USER_WIDTH || 0,
            SLAVES: params.SLAVES || 0
        }, role) || this;
        _this.signals = {
            HCLK: { width: 1 },
            HCLKEN: { width: 1 },
            HRESETn: { width: 1 },
            HADDR: { width: params.ADDR_WIDTH || 32 },
            HBURST: { width: 3 },
            HMASTLOCK: { width: 1 },
            HPROT: { width: 4 },
            HSIZE: { width: 3 },
            HTRANS: { width: 2 },
            HWDATA: { width: params.DATA_WIDTH || 32 },
            HWRITE: { width: 1 },
            HRDATA: { width: params.DATA_WIDTH || 32 },
            HREADYOUT: { width: 1 },
            HRESP: { width: 1 },
            HSELx: { width: params.SLAVES || 8 },
            HREADY: { width: 1 }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            _this.signals.HRUSER = { width: params.USER_WIDTH };
            _this.signals.HWUSER = { width: params.USER_WIDTH };
            _this.signals.HAUSER = { width: params.USER_WIDTH };
        }
        _this.modports = {
            outward: {
                HCLK: 'input',
                HCLKEN: 'input',
                HRESETn: 'input',
                HADDR: 'output',
                HBURST: 'output',
                HMASTLOCK: 'output',
                HPROT: 'output',
                HSIZE: 'output',
                HTRANS: 'output',
                HWDATA: 'output',
                HWRITE: 'output',
                HRDATA: 'input',
                HRESP: 'input',
                HREADY: 'input',
                HRUSER: 'input',
                HWUSER: 'output',
                HAUSER: 'output'
            }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            _this.modports.outward = __assign(__assign({}, _this.modports.outward), { HRUSER: 'input', HWUSER: 'output', HAUSER: 'output' });
        }
        _this.modports.inward = Object.fromEntries(Object.entries(_this.modports.outward).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, (value === 'input') ? 'output' : 'input'];
        }));
        return _this;
    }
    /**
     * VLNV Metadata
     */
    AHBLiteInitiator.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA3',
        name: 'AHBLiteInitiator',
        version: 'r2p0_0'
    };
    return AHBLiteInitiator;
}(TSSV_1.Interface));
exports.AHBLiteInitiator = AHBLiteInitiator;

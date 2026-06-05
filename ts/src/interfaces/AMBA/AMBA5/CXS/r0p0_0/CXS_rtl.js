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
exports.CXS_rtl = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the CXS_rtl protocol
 */
var CXS_rtl = /** @class */ (function (_super) {
    __extends(CXS_rtl, _super);
    /**
     * Create a new CXS_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function CXS_rtl(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'CXS_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role) || this;
        _this.signals = {
            CLK: { width: 1 },
            CLKEN: { width: 1 },
            CLKENCHK: { width: 1 },
            RESETn: { width: 1 },
            CXSVALID: { width: 1 },
            CXSDATA: { width: params.DIW || 8 },
            CXSCNTL: { width: params.DIW || 8 },
            CXSLAST: { width: 1 },
            CXSPRCLTYPE: { width: 3 },
            CXSCRDGNT: { width: 1 },
            CXSCRDRTN: { width: 1 },
            CXSACTIVEREQ: { width: 1 },
            CXSACTIVEACK: { width: 1 },
            CXSDEACTHINT: { width: 1 },
            CXSVALIDCHK: { width: 1 },
            CXSDATACHK: { width: params.DIW || 8 },
            CXSCNTLCHK: { width: params.DIW || 8 },
            CXSLASTCHK: { width: 1 },
            CXSPRCLTYPECHK: { width: 1 },
            CXSCRDGNTCHK: { width: 1 },
            CXSCRDRTNCHK: { width: 1 },
            CXSACTIVEREQCHK: { width: 1 },
            CXSACTIVEACKCHK: { width: 1 }
        };
        _this.modports = {
            master: {
                CLK: 'input',
                CLKEN: 'input',
                CLKENCHK: 'input',
                RESETn: 'input',
                CXSVALID: 'output',
                CXSDATA: 'output',
                CXSCNTL: 'output',
                CXSLAST: 'output',
                CXSPRCLTYPE: 'output',
                CXSCRDGNT: 'input',
                CXSCRDRTN: 'output',
                CXSACTIVEREQ: 'output',
                CXSACTIVEACK: 'input',
                CXSDEACTHINT: 'input',
                CXSVALIDCHK: 'output',
                CXSDATACHK: 'output',
                CXSCNTLCHK: 'output',
                CXSLASTCHK: 'output',
                CXSPRCLTYPECHK: 'output',
                CXSCRDGNTCHK: 'input',
                CXSCRDRTNCHK: 'output',
                CXSACTIVEREQCHK: 'output',
                CXSACTIVEACKCHK: 'input'
            },
            slave: {
                CLK: 'input',
                CLKEN: 'input',
                CLKENCHK: 'input',
                RESETn: 'input',
                CXSVALID: 'input',
                CXSDATA: 'input',
                CXSCNTL: 'input',
                CXSLAST: 'input',
                CXSPRCLTYPE: 'input',
                CXSCRDGNT: 'output',
                CXSCRDRTN: 'input',
                CXSACTIVEREQ: 'input',
                CXSACTIVEACK: 'output',
                CXSDEACTHINT: 'output',
                CXSVALIDCHK: 'input',
                CXSDATACHK: 'input',
                CXSCNTLCHK: 'input',
                CXSLASTCHK: 'input',
                CXSPRCLTYPECHK: 'input',
                CXSCRDGNTCHK: 'output',
                CXSCRDRTNCHK: 'input',
                CXSACTIVEREQCHK: 'input',
                CXSACTIVEACKCHK: 'output'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    CXS_rtl.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA5',
        name: 'CXS_rtl',
        version: 'r0p0_0'
    };
    return CXS_rtl;
}(TSSV_1.Interface));
exports.CXS_rtl = CXS_rtl;

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
exports.P_Channel = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the P_Channel protocol
 */
var P_Channel = /** @class */ (function (_super) {
    __extends(P_Channel, _super);
    /**
     * Create a new P_Channel Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function P_Channel(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'P_Channel', {
            PERIPHERALS: params.PERIPHERALS || 0,
            STATES: params.STATES || 0
        }, role) || this;
        _this.signals = {
            RESETn: { width: 1 },
            PACTIVE: { width: params.PERIPHERALS || 0 },
            PSTATE: { width: params.STATES || 0 },
            PREQ: { width: 1 },
            PACCEPT: { width: 1 },
            PDENY: { width: 1 }
        };
        _this.modports = {
            outward: {
                RESETn: 'input',
                PACTIVE: 'input',
                PSTATE: 'output',
                PREQ: 'output',
                PACCEPT: 'input',
                PDENY: 'input'
            },
            inward: {
                RESETn: 'input',
                PACTIVE: 'output',
                PSTATE: 'input',
                PREQ: 'input',
                PACCEPT: 'output',
                PDENY: 'output'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    P_Channel.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA4',
        name: 'P-Channel',
        version: 'r0p0_0'
    };
    return P_Channel;
}(TSSV_1.Interface));
exports.P_Channel = P_Channel;

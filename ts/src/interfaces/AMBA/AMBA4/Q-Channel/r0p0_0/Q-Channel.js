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
exports.Q_Channel = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the Q_Channel protocol
 */
var Q_Channel = /** @class */ (function (_super) {
    __extends(Q_Channel, _super);
    /**
     * Create a new Q_Channel Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function Q_Channel(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'Q_Channel', {}, role) || this;
        _this.signals = {
            QACTIVE: { width: 1 },
            QREQn: { width: 1 },
            QACCEPTn: { width: 1 },
            QDENY: { width: 1 }
        };
        _this.modports = {
            outward: {
                QACTIVE: 'input',
                QREQn: 'output',
                QACCEPTn: 'input',
                QDENY: 'input'
            },
            inward: {
                QACTIVE: 'output',
                QREQn: 'input',
                QACCEPTn: 'output',
                QDENY: 'output'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    Q_Channel.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA4',
        name: 'Q-Channel',
        version: 'r0p0_0'
    };
    return Q_Channel;
}(TSSV_1.Interface));
exports.Q_Channel = Q_Channel;

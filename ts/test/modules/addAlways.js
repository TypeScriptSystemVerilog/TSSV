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
exports.addAlways = void 0;
// import library
var TSSV_1 = require("tssv/lib/core/TSSV");
var addAlways = /** @class */ (function (_super) {
    __extends(addAlways, _super);
    function addAlways(params) {
        var _this = _super.call(this, {
            // define the default parameter values
            name: params.name,
            data_Width: params.data_Width || 8
        }) || this;
        // define IO signals
        _this.IOs = {
            clk: { direction: 'input', type: 'wire', isClock: 'posedge' },
            rst_b: { direction: 'input', type: 'wire', isReset: 'lowasync' },
            en: { direction: 'input', type: 'wire' },
            data_in: { direction: 'input', type: 'wire', width: _this.params.data_Width },
            data_out: { direction: 'output', type: 'wire', width: _this.params.data_Width },
            a: { direction: 'input', type: 'wire' },
            b: { direction: 'input', type: 'wire' },
            c: { direction: 'output', type: 'logic' }
        };
        // always_ff test
        // exclude sensitivityList
        var seq_body1 = "\n        begin\n          ".concat('data_out', " <= ").concat('data_in', ";  \n        end \n\n        ");
        _this.addSequentialAlways({ clk: 'clk', reset: 'rst_b', outputs: ['data_out'] }, seq_body1);
        // include correct sensitivityList
        var seq_body2 = "\n        always_ff @( posedge clk or negedge rst_b )\n            begin\n              ".concat('data_out', " <= ").concat('data_in', ";  \n            end\n        ");
        _this.addSequentialAlways({ clk: 'clk', reset: 'rst_b', outputs: ['data_out'] }, seq_body2);
        // always_comb test
        // exclude sensitivityList
        var comb_body1 = "            begin\n              c = a & b;  \n            end\n        ";
        _this.addCombAlways({ inputs: ['a', 'b'], outputs: ['c'] }, comb_body1);
        // include correct sensitivityList
        var comb_body2 = "\n        always @( a or b )\n            begin\n              c = a & b;  \n            end\n        ";
        _this.addCombAlways({ inputs: ['a', 'b'], outputs: ['c'] }, comb_body2);
        return _this;
    }
    return addAlways;
}(TSSV_1.Module));
exports.addAlways = addAlways;

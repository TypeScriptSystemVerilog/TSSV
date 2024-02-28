"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adder3 = exports.Adder = void 0;
const TSSV_1 = require("./TSSV");
class Adder extends TSSV_1.Module {
    constructor(params) {
        super({
            // define the default parameter values
            aWidth: params.aWidth || 8,
            bWidth: params.bWidth || 8
        });
        // define IO signals
        this.IOs = {
            a: { type: 'input', width: this.params.aWidth, isSigned: true },
            b: { type: 'input', width: this.params.bWidth, isSigned: true },
            sum: { type: 'output', width: Math.max((this.params.aWidth || 1), (this.params.bWidth || 1)) + 1, isSigned: true }
        };
        this.addAdder({ a: 'a', b: 'b', result: 'sum' });
    }
}
exports.Adder = Adder;
class Adder3 extends TSSV_1.Module {
    constructor(params) {
        super({
            // define the default parameter values
            aWidth: params.aWidth || 8,
            bWidth: params.bWidth || 8,
            cWidth: params.bWidth || 8
        });
        // define IO signals
        const sumWidth = Math.max((this.params.aWidth || 1), (this.params.bWidth || 1, (this.params.cWidth || 1))) + 2;
        this.IOs = {
            a: { type: 'input', width: this.params.aWidth, isSigned: true },
            b: { type: 'input', width: this.params.bWidth, isSigned: true },
            c: { type: 'input', width: this.params.bWidth, isSigned: true },
            sum: { type: 'output', width: sumWidth, isSigned: true }
        };
        const psumWidth = Math.max((this.params.aWidth || 1), (this.params.bWidth || 1)) + 1;
        let psum = this.addSignal('psum', { type: 'wire', width: psumWidth });
        this.addSubmodule('add1', new Adder({ aWidth: this.params.aWidth, bWidth: this.params.bWidth }), { sum: 'psum' });
        this.addSubmodule('add2', new Adder({ aWidth: this.params.cWidth, bWidth: psumWidth }), { a: "c", b: "psum", sum: 'sum' });
    }
}
exports.Adder3 = Adder3;
let test = new Adder3({ aWidth: 8, bWidth: 8, cWidth: 8 });
console.log(test.writeSystemVerilog());
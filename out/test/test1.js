import { Module } from 'TSSV/lib/TSSV';
import { TL_UL } from 'TSSV/lib/TL_UL';
import { writeFileSync } from 'fs';
export class Adder extends Module {
    constructor(params) {
        super({
            // define the default parameter values
            aWidth: params.aWidth || 8,
            bWidth: params.bWidth || 8
        });
        // add Tilelink UL responder interface
        this.addInterface('regs', new TL_UL({}, 'responder'));
        // define IO signals
        this.IOs = {
            a: { direction: 'input', width: this.params.aWidth, isSigned: true },
            b: { direction: 'input', width: this.params.bWidth, isSigned: true },
            sum: { direction: 'output', width: Math.max((this.params.aWidth || 1), (this.params.bWidth || 1)) + 1, isSigned: true }
        };
        this.addAdder({ a: 'a', b: 'b', result: 'sum' });
    }
}
export class Adder3 extends Module {
    constructor(params) {
        super({
            // define the default parameter values
            aWidth: params.aWidth || 8,
            bWidth: params.bWidth || 8,
            cWidth: params.bWidth || 8
        });
        this.addInterface('regs1', new TL_UL({}));
        this.addInterface('regs2', new TL_UL({}));
        // define IO signals
        const sumWidth = Math.max((this.params.aWidth || 1), (this.params.bWidth || 1, (this.params.cWidth || 1))) + 2;
        this.IOs = {
            a: { direction: 'input', width: this.params.aWidth, isSigned: true },
            b: { direction: 'input', width: this.params.bWidth, isSigned: true },
            c: { direction: 'input', width: this.params.bWidth, isSigned: true },
            sum: { direction: 'output', width: sumWidth, isSigned: true }
        };
        const psumWidth = Math.max((this.params.aWidth || 1), (this.params.bWidth || 1)) + 1;
        const psum = this.addSignal('psum', { width: psumWidth });
        this.addSubmodule('add1', new Adder({ aWidth: this.params.aWidth, bWidth: this.params.bWidth }), { sum: psum, regs: 'regs1' });
        this.addSubmodule('add2', new Adder({ aWidth: this.params.cWidth, bWidth: psumWidth }), { a: "c", b: "psum", sum: 'sum', regs: 'regs2' });
    }
}
const test1 = new Adder3({ aWidth: 8, bWidth: 8, cWidth: 8 });
try {
    writeFileSync('sv-examples/test1.sv', test1.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}

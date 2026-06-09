import TSSV from 'tssv/lib/core/TSSV';
import { RegisterBlock } from 'tssv/lib/core/Registers';
import { Memory } from 'tssv/lib/interfaces/Memory';
export class FIR extends TSSV.Module {
    constructor(params) {
        super({
            // define the default parameter values
            name: params.name,
            coefficients: params.coefficients,
            inWidth: params.inWidth || 8,
            outWidth: params.outWidth || 9,
            rShift: params.rShift || 2
        });
        // define IO signals
        this.IOs = {
            clk: { direction: 'input', isClock: 'posedge' },
            rst_b: { direction: 'input', isReset: 'lowasync' },
            en: { direction: 'input' },
            data_in: { direction: 'input', width: this.params.inWidth || 8, isSigned: true },
            data_out: { direction: 'output', width: this.params.outWidth || 9, isSigned: true }
        };
        // construct logic
        const numTaps = this.params.coefficients.length;
        // pre-declare signals that will receive each coefficient from the register block
        const coeffSigs = [];
        for (let i = 0; i < numTaps; i++) {
            coeffSigs.push(this.addSignal(`coeff_${i}`, { width: 32, isSigned: true }));
        }
        // build coefficient register block dynamically — one RW register per tap,
        // reset values taken from the coefficients parameter
        const coeffAddrMap = {};
        const coeffRegisters = {};
        for (let i = 0; i < numTaps; i++) {
            coeffAddrMap[`COEFF_${i}`] = BigInt(i * 4);
            coeffRegisters[`COEFF_${i}`] = {
                type: 'RW',
                reset: this.params.coefficients[i] ?? 0n,
                isSigned: true,
                width: 32,
                description: `FIR tap ${i} coefficient`
            };
        }
        const coeffRegBlock = new RegisterBlock({ name: `${this.params.name ?? 'fir'}_coeffRegs`, busAddressWidth: 32 }, { wordSize: 32, addrMap: coeffAddrMap, registers: coeffRegisters }, new Memory());
        // bind clk/rst_b; wire COEFF_N outputs to coeff_N signals;
        // Memory bus ports left unbound — they are promoted to FIR ports
        const coeffBindings = { clk: 'clk', rst_b: 'rst_b' };
        for (let i = 0; i < numTaps; i++) {
            coeffBindings[`COEFF_${i}`] = coeffSigs[i] ?? new TSSV.Sig('0');
        }
        this.addSubmodule('coeff_block', coeffRegBlock, coeffBindings, true, true);
        let nextTapIn = new TSSV.Sig('data_in');
        const products = [];
        let coeffSum = 0;
        for (let i = 0; i < numTaps; i++) {
            // construct tap delay line
            const thisTap = this.addSignal(`tap_${i}`, { width: this.params.inWidth, isSigned: true });
            this.addRegister({ d: nextTapIn, clk: 'clk', reset: 'rst_b', en: 'en', q: thisTap });
            // multipliers now driven by runtime-configurable coefficient registers
            products.push(this.addMultiplier({ a: thisTap, b: coeffSigs[i] ?? new TSSV.Sig('0') }));
            coeffSum += Math.abs(Number(this.params.coefficients[i] ?? 0n));
            nextTapIn = thisTap;
        }
        // construct final vector sum
        const sumWidth = (this.params.inWidth || 0) + this.bitWidth(coeffSum);
        const productsExt = products.map((p) => `${sumWidth}'(${p.toString()})`);
        this.addSignal('sum', { width: sumWidth, isSigned: true });
        this.addRegister({
            d: new TSSV.Expr(`${productsExt.join(' + ')}`),
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'sum'
        });
        // round and saturate to final output
        this.addSignal('rounded', { width: sumWidth - (this.params.rShift || 0) + 1, isSigned: true });
        this.addRound({ in: 'sum', out: 'rounded', rShift: this.params.rShift || 1 });
        this.addSignal('saturated', { width: this.params.outWidth, isSigned: true });
        this.addSaturate({ in: 'rounded', out: 'saturated' });
        this.addRegister({
            d: 'saturated',
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'data_out'
        });
    }
}
export default FIR;

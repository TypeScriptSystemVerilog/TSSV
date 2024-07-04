import { Module, Sig, Expr } from 'tssv/lib/core/TSSV';
export class FIR extends Module {
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
            data_in: { direction: 'input', width: this.params.inWidth, isSigned: true },
            data_out: { direction: 'output', width: this.params.outWidth, isSigned: true }
        };
        // construct logic
        let nextTapIn = new Sig('data_in');
        const products = [];
        let coeffSum = 0;
        for (let i = 0; i < this.params.coefficients.length; i++) {
            // construct tap delay line
            const thisTap = this.addSignal(`tap_${i}`, { width: this.params.inWidth, isSigned: true });
            this.addRegister({ d: nextTapIn, clk: 'clk', reset: 'rst_b', en: 'en', q: thisTap });
            // construct tap multipliers
            products.push(this.addMultiplier({ a: thisTap, b: this.params.coefficients[i] }));
            coeffSum += Math.abs(Number(this.params.coefficients[i]));
            nextTapIn = thisTap;
        }
        // construct final vector sum
        const sumWidth = (this.params.inWidth || 0) + this.bitWidth(coeffSum);
        const productsExt = products.map((p) => `${sumWidth}'(${p.toString()})`);
        this.addSignal('sum', { width: sumWidth, isSigned: true });
        this.addRegister({
            d: new Expr(`${productsExt.join(' + ')}`),
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

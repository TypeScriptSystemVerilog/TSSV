import {Module, TSSVParameters, IntRange, Sig, Expr} from './TSSV'

export interface FIR_Parameters extends TSSVParameters {
    coefficients: Array<bigint>
    numTaps?:   IntRange<1,100>
    inWidth?:   IntRange<1,32> 
    outWidth?:  IntRange<1,32> 
    rShift?:    IntRange<0,32>
}


export class FIR extends Module {
    declare params: FIR_Parameters
    constructor(params: FIR_Parameters) {            
        super({
            //default parameter values
            name: params.name,
            coefficients: params.coefficients,
            numTaps: params.numTaps || 10,
            inWidth: params.inWidth || 8,
            outWidth: params.outWidth || 9,
            rShift: params.rShift || 2
        })

        // define IO
        this.IOs = {
            clk:      { type: 'input', isClock: 'posedge' },
            rst_b:    { type: 'input', isReset: 'lowasync'},
            en:       { type: 'input', },
            data_in:  { type: 'input', width: this.params.inWidth, isSigned: true },
            data_out: { type: 'output', width: this.params.outWidth, isSigned: true }            
        }
        
        // constructor logic
        let nextTapIn:Sig = new Sig("data_in")
        let products: Sig[] = []
        let coeffSum = 0;
        for(var i = 0; i < (this.params.numTaps||0); i++) {
            // construct tap delay line
            const thisTap = this.addSignal(`tap_${i}`, {type:'reg', width:this.params.inWidth, isSigned: true})
            this.addRegister({d:nextTapIn.toString(), clk:'clk', reset:'rst_b', en:'en'})

            // construct tap moultipliers
            products.push(this.addMultiplier({a:thisTap.toString(), b:this.params.coefficients[i]}))
            coeffSum += Math.abs(Number(this.params.coefficients[i]))

            nextTapIn = thisTap
        }

        // construct final vector sum
        const sumWidth = (this.params.inWidth||0) + this.bitWidth(coeffSum)
        this.addSignal('sum', { type: 'reg', width: sumWidth,  isSigned: true })
        this.addRegister({
            d: new Expr(`${products.join(' + ')}`),
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'sum'
        })

        // round and saturate to final output
        this.addSignal('rounded',{ type: 'wire', width: sumWidth - (this.params.rShift||0) + 1,  isSigned: true })
        this.addRound({in: 'sum', out:'rounded', rShift:this.params.rShift||1})
        this.addSignal('saturated',{ type: 'wire', width: this.params.outWidth,  isSigned: true })
        this.addSaturate({in:'sum', out:'saturated'})
        this.addRegister({
            d: 'saturated',
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'data_out'
        })

    }
}


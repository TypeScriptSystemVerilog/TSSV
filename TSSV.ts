let TSSV = () => {
    type IntRange<
    START extends number,
    END extends number,
    ARR extends unknown[] = [],
    ACC extends number = never> = ARR['length'] extends END
    ? ACC | START | END
    : IntRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>

    type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
    type Defaults<T> = Required<Pick<T, OptionalKeys<T>>>

    interface scalarConst {

    }
    interface baseSignal {
        width?: IntRange<0,512> | number
        isClock?: 'posedge' | 'negedge'
        isReset?: 'lowasync' | 'highasync' | 'lowsync' | 'highsync'
        isSigned?: boolean
        isVector?: IntRange<0,512> | number
        description?: string
    }

    interface IOSignal  extends baseSignal {
        type: 'input' | 'output' | 'inout' | 'output reg', 
    }

    interface IOSignals {[name: string] : IOSignal}

    interface Signal extends baseSignal {
        type: 'wire' | 'reg' | 'const', 
        value?: bigint | Array<bigint>
    }

    interface Signals {[name: string] : Signal}

    interface Parameters { 
        name?: string | undefined
        [name: string]: string | bigint | IntRange<number,number> | Array<bigint> | undefined 
    }

    type exprFunc = () => string

    class module {

        name: string
        params: Parameters
        IOs : IOSignals
        signals: Signals
        
        constructor(params: Parameters = {}, IOs: IOSignals = {}, signals = {}, body= "") {
            this.params = params
            if(typeof params.name === 'string') {
                this.name = params.name
            } else {
                let mapFunc = (p: any) => {
                    if(typeof p === 'object') {
                        return 'HASH' //FIXME
                    }
                    return p
                }
                this.name = this.constructor.name + '_' + Object.values(params).filter((p)=>(p !== undefined)).map(mapFunc).join('_')
            }
            this.params.name = this.name
            this.IOs = IOs
            this.signals = signals
            this.body = body
        }

        addSignal(name: string, signal: Signal) {
            this.signals[name] = signal
        }

        addRegister(io: {
            d : string | exprFunc,
            clk: string, 
            reset?: string,
            resetVal?: bigint,
            en?: string | exprFunc,
            q?: string
        }) {
            let qName: string | undefined = io.q
            if(typeof io.d === 'string') {
                const dSig = this.IOs[io.d] || this.signals[io.d]
                if(!dSig) throw Error(`${io.d} signal not found`)
                if(io.q === undefined) {
                    qName = `${io.d}_q`
                    if(this.signals[qName] || this.IOs[qName]) throw Error(`${qName} signal already exists`)
                    this.signals[qName] = {...dSig, type:'reg'}
                }
            }            
            if(io.q) {
                let qSig: Signal | IOSignal = this.signals[io.q]
                if(!qSig) {
                    qSig =this.IOs[io.q]
                }
                if(!io.q) throw Error(`${io.q} signal not found`)
                switch(qSig.type) {
                case 'wire':
                    qSig.type = 'reg'
                    break
                case 'output':
                    qSig.type = 'output reg'
                    break
                case 'reg':
                case 'output reg':
                    break
                default:
                    throw Error(`${io.q} is unsupported signal type ${qSig.type}`)
                }
                qName = io.q
            }
            if(qName === undefined) {
                throw Error(`addRegister(${JSON.stringify(io)}) auto q naming only allowed when d is a simple signal, not an expression`)
            }
            const d = (typeof io.d === 'string') ? io.d : io.d()
            const clkSig = this.IOs[io.clk] || this.signals[io.clk]
            if(!clkSig || !clkSig.isClock) throw Error('${io.clk} is not a clock signal')
            let resetSensitivity = '' 
            let resetStyle = '#NONE#'
            if(io.reset) {
                const rstSig = this.IOs[io.reset] || this.signals[io.reset]
                if(!rstSig || !rstSig.isReset) throw Error(`${io.reset} is not a reset signal`)
                switch(rstSig.isReset) {
                    case 'highasync' :
                        resetSensitivity = ` or posedge ${io.reset}`
                        break
                    case 'lowasync' :
                        resetSensitivity = ` or negedge ${io.reset}`
                        break
                }
                resetStyle = rstSig.isReset
            }
            const sensitivityList = `@( ${clkSig.isClock} ${io.clk} ${resetSensitivity} )`
            let enableExpr = "#NONE#" 
            if(io.en !== undefined) {
                enableExpr = (typeof io.en === 'string') ? io.en : io.en()
            }
            console.log(`d: ${d}`)
            console.log(`sensitivity: ${sensitivityList}`)
            if(!this.registerBlocks[sensitivityList]) {
                this.registerBlocks[sensitivityList] = {}
            }
            if(!this.registerBlocks[sensitivityList][resetStyle]) {
                this.registerBlocks[sensitivityList][resetStyle] = {}
            }
            if(!this.registerBlocks[sensitivityList][resetStyle][enableExpr]) {
                this.registerBlocks[sensitivityList][resetStyle][enableExpr] = {q: d}
            }
        }

        bitWidth(a: number | bigint, isSigned: boolean = false) : number {
            return (Math.ceil(Math.log2( Math.abs(Number(a)) + Number(a >= 0) ) + Number(isSigned || (a<0))))
        }

        addMultiplier(io : {
            a : string | bigint,
            b : string | bigint,
            result?: string
        }): string {
            let aOperand: string | undefined = undefined
            let bOperand: string | undefined = undefined
            let aAuto = io.a
            let bAuto = io.b
            let aWidth = 0
            let bWidth = 0
            let aSigned = false
            let bSigned = false
            if(typeof io.a === 'string') {
                const aSig = this.signals[io.a] || this.IOs[io.a]
                if(!aSig) throw Error(`${io.a} signal not found`)
                aOperand = io.a
                aWidth = Number(aSig.width)
                aSigned = aSig.isSigned || false
            } else {
                aWidth = this.bitWidth(io.a)
                aSigned = (io.a < 0)
                aOperand = (aSigned) ? `-${aWidth}'sd${Math.abs(Number(io.a))}` : `${aWidth}'d${io.a}`
                aAuto = aOperand.replace('-','m').replace("'","")
            }
            if(typeof io.b === 'string') {
                const bSig = this.signals[io.b] || this.IOs[io.b]
                if(!bSig) throw Error(`${io.b} signal not found`)
                bOperand = io.b
                bWidth = Number(bSig.width)
                bSigned = bSig.isSigned || false
            } else {
                bWidth = this.bitWidth(io.b)
                bSigned = (io.b < 0)
                bOperand = (bSigned) ? `-${bWidth}'sd${Math.abs(Number(io.b))}` : `${bWidth}'d${io.b}`
                bAuto = bOperand.replace('-','m').replace("'","")
            }
            let result = "#NONE#"
            if(typeof io.result === 'string') {
                const resultSig =  this.signals[io.result] || this.IOs[io.result]
                if(!resultSig) throw Error(`${io.result} signal not found`)
                if(resultSig.isSigned === undefined) {
                    resultSig.isSigned = (aSigned || bSigned)
                }
                if((aSigned || bSigned) && (!(resultSig.isSigned))) throw Error(`${io.result} must be signed`)
                if(resultSig.width||0 < (aWidth + bWidth)) console.warn(`${io.result} truncted output`)
                result =  io.result
            } else {
                result = `prod_${aAuto}x${bAuto}`
                this.signals[result] = {type:'wire', isSigned:(aSigned || bSigned), width:(aWidth + bWidth)}
            }
            this.body +=
`   assign ${result} = ${aOperand} * ${bOperand};
`
            return result
        }

        addConstSignal(name: string, value: bigint, isSigned: boolean = false, width: number | undefined = undefined) {
            const minWidth = this.bitWidth(value, isSigned)
            const resolvedWidth = (width === undefined) ?  minWidth : width
            if(resolvedWidth < minWidth) throw Error(`width:${resolvedWidth} is insufficient for value: ${value}`)
            this.signals[name] = {type:'const', value: value, isSigned: isSigned, width: resolvedWidth}
        }

        addConstSignals(name: string, values: Array<bigint>, isSigned: boolean = false, width: number | undefined = undefined) : Array<string> {
            let signalNames = [...Array(values.length).keys()].map((p:number)=>{ return `${name}_${p}`})
            signalNames.forEach((p,i) => {
                this.addConstSignal(p, values[i], isSigned || (values[i] < 0), width)
            })
            return signalNames
        }

        debug() {
            console.log(this.name)
            console.log(this.params)
            console.log(this.IOs)
            console.log(this.signals)
            console.log(this.body)
            console.log(this.registerBlocks)
        }

        writeSystemVerilog(): string {
            let verilog: string = 
`
module ${this.name} ()

${this.body}

endmodule
`

            return verilog
        }
        protected body: string
        protected registerBlocks: {
            [sensitivity:string] : {
                [resetStyle:string] : {
                    [enable:string] : {
                        [q:string] : string
                    }
                }
            }
        } = {}
    }

    interface FIR_Parameters extends Parameters {
        coefficients: Array<bigint>
        numTaps?:   IntRange<1,100>
        inWidth?:   IntRange<1,32> 
        outWidth?:  IntRange<1,32> 
        rShift?:    IntRange<0,32>
    }

    class FIR extends module {
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
            let nextTapIn = "data_in"
            let products: string[] = []
            let coeffSum = 0;
            for(var i = 0; i < (this.params.numTaps||0); i++) {
                // construct tap delay line
                const thisTap = `tap_${i}`
                this.addSignal(thisTap, {type:'reg', width:this.params.inWidth})
                this.addRegister({d:nextTapIn, clk:"clk", reset:"rst_b", en:"en"})

                // construct tap moultipliers
                products.push(this.addMultiplier({a:thisTap, b:this.params.coefficients[i]}))
                coeffSum += Math.abs(Number(this.params.coefficients[i]))

                nextTapIn = thisTap
            }

            // construct final vector sum
            const sumWidth = params.inWidth||0 + this.bitWidth(coeffSum)
            this.signals.sum = { type: 'reg', width: sumWidth,  isSigned: true }
            this.addRegister({
                d: () => { return `${products.join(' + ')}`},
                clk: "clk",
                reset: "rst_b",
                en: "en",
                q: "sum"
            })
        }
    }

    let myFir = new FIR({name: 'myFIR', numTaps: 4, coefficients: [1n, 2n, 3n, 4n]})
    myFir.debug()
    console.log(myFir.writeSystemVerilog())

    let myFir2 = new FIR({numTaps: 5, coefficients: [2n, -2n, 4n, -4n, 8n]})
    myFir2.debug()
    console.log(myFir2.writeSystemVerilog())
    
}

TSSV()


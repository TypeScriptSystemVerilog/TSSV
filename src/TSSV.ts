//export default function TSSV() {
    export type IntRange<
    START extends number,
    END extends number,
    ARR extends unknown[] = [],
    ACC extends number = never> = ARR['length'] extends END
    ? ACC | START | END
    : IntRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>

    interface baseSignal {
        width?: number
        isClock?: 'posedge' | 'negedge'
        isReset?: 'lowasync' | 'highasync' | 'lowsync' | 'highsync'
        isSigned?: boolean
        isVector?: number
        description?: string
    }

    interface IOSignal  extends baseSignal {
        type: 'input' | 'output' | 'inout' | 'output reg', 
    }

    export interface IOSignals {[name: string] : IOSignal}

    export class Sig  {
        constructor(name: string) {
           this.name = name
           this.type = 'Sig' 
        }
        toString = ():string => {
            return this.name
        }
        protected name: string
        readonly type: 'Sig'
    }

    export class Expr  {
        constructor(name: string) {
           this.name = name
           this.type = 'Expr' 
        }
        toString = ():string => {
            return this.name
        }
        protected name: string
        readonly type: 'Expr'
    }

    interface Signal extends baseSignal {
        type: 'wire' | 'reg' | 'const', 
        value?: bigint | Array<bigint>
    }

    interface Signals {[name: string] : Signal}

    type ParameterValue = string | bigint | IntRange<number,number> | Array<bigint> 
    export interface TSSVParameters { 
        name?: string | undefined
        [name: string]: ParameterValue | undefined 
    }

    //type exprFunc = () => string

    interface OperationIO  {
        a : string | Sig | bigint,
        b : string | Sig | bigint,
        result?: string | Sig
    }

    enum BinaryOp  {
        MULTIPLY= '*',
        ADD= '+',
        SUBTRACT= '-',
        BITWISE_AND= '&',
        BITWISE_OR= '|'
    }

    export class Module {

        name: string
        params: TSSVParameters
        IOs : IOSignals
        signals: Signals
        
        constructor(params: TSSVParameters = {}, IOs: IOSignals = {}, signals = {}, body= "") {
            this.params = params
            if(typeof params.name === 'string') {
                this.name = params.name
            } else {
                let mapFunc = (p: any) => {
                    if(typeof p === 'object') {
                        return this.simpleHash(p.toString())
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

        simpleHash(str: string): string {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
              const char = str.charCodeAt(i);
              hash = (hash << 5) - hash + char;
            }
            // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
            return (hash >>> 0).toString(36).padStart(7, '0');
        }

        findSignal(sig:Sig|string, throwOnFalse: boolean = false, caller:any = null): Signal | IOSignal {
            const thisSig = this.IOs[sig.toString()] || this.signals[sig.toString()]
            if(!thisSig && throwOnFalse) {
                let errString = ""
                if(typeof caller === 'function') {
                    errString = `${sig.toString()} signal not found in ${caller.name}()`
                } else {
                    errString = `${caller.toString()}: ${sig.toString()} signal not found`
                }
                throw Error(errString)
            }
            return thisSig
        }

        addSignal(name: string, signal: Signal):Sig {
            if(this.findSignal(name)) throw Error(`${name} signal already exists`)
            this.signals[name] = signal
            return new Sig(name)
        }

        addRegister(io: {
            d : string | Sig | Expr,
            clk: string | Sig, 
            reset?: string | Sig,
            resetVal?: bigint,
            en?: string | Sig | Expr,
            q?: string | Sig
        }): Sig {
            let qName: string | Sig | undefined = io.q
            if((typeof io.d === 'string') || (io.d.type === 'Sig')) {
                const dSig = this.findSignal(io.d, true, this.addRegister)
                if(io.q === undefined) {
                    qName = `${io.d}_q`
                    if(this.signals[qName] || this.IOs[qName]) throw Error(`${qName} signal already exists`)
                    this.signals[qName] = {...dSig, type:'reg'}
                }
            }            
            if(io.q) {
               let qSig = this.findSignal(io.q, true, this.addRegister)
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
            const d = io.d.toString()
            const clkSig = this.findSignal(io.clk, true, this.addRegister)
            if(!clkSig.isClock) throw Error('${io.clk} is not a clock signal')
            let resetSensitivity = '' 
            let resetCondition = '#NONE#'
            if(io.reset) {
                const rstSig = this.findSignal(io.reset, true, this.addRegister)
                if(!rstSig.isReset) throw Error(`${io.reset} is not a reset signal`)
                switch(rstSig.isReset) {
                    case 'highasync' :
                        resetSensitivity = ` or posedge ${io.reset}`
                        resetCondition = `${io.reset}`
                        break
                    case 'lowasync' :
                        resetSensitivity = ` or negedge ${io.reset}`
                        resetCondition = `!${io.reset}`
                        break
                    case 'lowsync' :
                        resetCondition = `!${io.reset}`
                        break
                    case 'highsync' :
                        resetCondition = `${io.reset}`
                        break
                    default:
                    }
            }
            const sensitivityList = `@( ${clkSig.isClock} ${io.clk} ${resetSensitivity} )`
            let enableExpr = "#NONE#" 
            if(io.en !== undefined) {                
                enableExpr = io.en.toString()
            }
            //console.log(`d: ${d}`)
            //console.log(`sensitivity: ${sensitivityList}`)
            if(!this.registerBlocks[sensitivityList]) {
                this.registerBlocks[sensitivityList] = {}
            }
            if(!this.registerBlocks[sensitivityList][resetCondition]) {
                this.registerBlocks[sensitivityList][resetCondition] = {}
            }
            if(!this.registerBlocks[sensitivityList][resetCondition][enableExpr]) {
                this.registerBlocks[sensitivityList][resetCondition][enableExpr] = {}
            }
            this.registerBlocks[sensitivityList][resetCondition][enableExpr][qName.toString()] = {d: d, resetVal: io.resetVal}
            if(typeof qName === 'string') {
                return new Sig(qName)
            }
            return qName
        }

        bitWidth(a: number | bigint, isSigned: boolean = false) : number {
            return (Math.ceil(Math.log2( Math.abs(Number(a)) + Number(a >= 0) ) + Number(isSigned || (a<0))))
        }

        addRound(io: {
            in: string|Sig,
            out: string|Sig,
            rShift: string | Sig | number
        }, roundMode: 'roundUp' | 'roundDown' | 'roundToZero' = 'roundUp'): Sig {
            if(roundMode !== 'roundUp') throw Error(`FIXME: ${roundMode} not implemented yet`)
            const inSig = this.findSignal(io.in, true, this.addRound)
            const outSig = this.findSignal(io.out, true, this.addRound)
            let rShiftString = io.rShift.toString()
            if(typeof io.rShift !== 'number') {
                const rShiftSig = this.findSignal(io.rShift, true, this.addRound)
                if(rShiftSig.isSigned) throw Error(`right shift signal ${io.rShift} must be unsigned`)                    
            }
            if(inSig.isSigned != outSig.isSigned) throw Error(`sign mode must match ${io.in}, ${io.out}`)
            this.body += `   assign ${io.out} = (${io.in} + (1'd1<<(${rShiftString }-1)))>>>${rShiftString};\n`
            if(typeof io.out === 'string') {
                return new Sig(io.out)
            }
            return io.out
        }


        addSaturate(io: {
            in: string | Sig,
            out: string | Sig
        }, satMode: 'simple' | 'balanced' | 'none' = 'simple'): Sig {
            if(satMode !== 'simple') throw Error(`FIXME: ${satMode} not implemented yet`)
            const inSig = this.findSignal(io.in, true, this.addSaturate)
            const outSig = this.findSignal(io.out, true, this.addSaturate)
            if(inSig.isSigned != outSig.isSigned) throw Error(`sign mode must match ${io.in}, ${io.out}`)
            if(inSig.isSigned) {
                const sat = 1<<((outSig.width||1) - 1)
                const maxSatString = `${outSig.width}'sd${sat-1}`
                const minSatString = `-${outSig.width}'sd${sat}`
                this.body += 
`   assign ${io.out} = (${io.in} > ${maxSatString}) ? ${maxSatString} :
                       ((${io.in} < ${minSatString}) ? ${minSatString} : ${io.in});
`
            } else {
                const sat = (1<<((outSig.width||1) - 1)) - 1
                const maxSatString = `${outSig.width}'d${sat}`
                this.body += 
`   assign ${io.out} = (${io.in} > ${maxSatString}) ? ${maxSatString} : ${io.in});
`
            }
            if(typeof io.out === 'string') {
                return new Sig(io.out)
            }
            return io.out
        }

        addOperation(
            op: BinaryOp, 
            io : OperationIO): Sig {
            const nameMap = {
                '*' : {
                    name: 'prod',
                    autoWidth: (a:number,b:number) => {return a + b}
                },
                '-' : {
                    name: 'diff',
                    autoWidth: (a:number,b:number) => {return Math.max(a,b) + 1}
                },
                '+' : {
                    name:'sum',
                    autoWidth: (a:number,b:number) => {return Math.max(a,b) + 1}
                },
                '&' : {
                    name:'mask',
                    autoWidth: (a:number,b:number) => {return Math.max(a,b)}
                },
                '|' : {
                    name:'bitset',
                    autoWidth: (a:number,b:number) => {return Math.max(a,b)}
                }               
            }
            let aOperand: string | Sig | undefined = undefined
            let bOperand: string | Sig | undefined = undefined
            let aAuto = io.a
            let bAuto = io.b
            let aWidth = 0
            let bWidth = 0
            let aSigned = false
            let bSigned = false
            if(typeof io.a !== 'bigint') {
                const aSig = this.findSignal(io.a, true, this.addOperation)
                aOperand = io.a
                aWidth = Number(aSig.width)
                aSigned = aSig.isSigned || false
            } else {
                aWidth = this.bitWidth(io.a)
                aSigned = (io.a < 0)
                aOperand = (aSigned) ? `-${aWidth}'sd${Math.abs(Number(io.a))}` : `${aWidth}'d${io.a}`
                aAuto = aOperand.replace('-','m').replace("'","")
            }
            if(typeof io.b !== 'bigint') {
                const bSig = this.findSignal(io.b, true, this.addOperation)
                bOperand = io.b
                bWidth = Number(bSig.width)
                bSigned = bSig.isSigned || false
            } else {
                bWidth = this.bitWidth(io.b)
                bSigned = (io.b < 0)
                bOperand = (bSigned) ? `-${bWidth}'sd${Math.abs(Number(io.b))}` : `${bWidth}'d${io.b}`
                bAuto = bOperand.replace('-','m').replace("'","")
            }
            let result : string | Sig = "#NONE#"
            if(io.result !== undefined) {
                const resultSig = this.findSignal(io.result, true, this.addOperation)
                if(resultSig.isSigned === undefined) {
                    resultSig.isSigned = (aSigned || bSigned)
                }
                if((aSigned || bSigned) && (!(resultSig.isSigned))) throw Error(`${io.result} must be signed`)
                if((resultSig.width||0) < (aWidth + bWidth)) console.warn(`${io.result} truncted output`)
                result =  io.result
            } else {
                result = `${nameMap[op].name}_${aAuto}x${bAuto}`
                this.signals[result] = {
                    type:'wire', 
                    isSigned:(aSigned || bSigned), 
                    width:nameMap[op].autoWidth(aWidth,bWidth)
                }
            }
            this.body +=`   assign ${result.toString()} = ${aOperand} ${op} ${bOperand};\n`
            if(typeof result === 'string') {
                return new Sig(result)
            }
            return result
        }

        addMultiplier(io: OperationIO):Sig {
            return this.addOperation(BinaryOp.MULTIPLY, io)
        }

        addAdder(io: OperationIO):Sig {
            return this.addOperation(BinaryOp.ADD, io)
        }

        addSubstractor(io: OperationIO):Sig {
            return this.addOperation(BinaryOp.SUBTRACT, io)
        }

        addConstSignal(name: string, value: bigint, isSigned: boolean = false, width: number | undefined = undefined): Sig {
            const minWidth = this.bitWidth(value, isSigned)
            const resolvedWidth = (width === undefined) ?  minWidth : width
            if(resolvedWidth < minWidth) throw Error(`width:${resolvedWidth} is insufficient for value: ${value}`)
            this.signals[name] = {type:'const', value: value, isSigned: isSigned, width: resolvedWidth}
            return new Sig(name)
        }

        addConstSignals(name: string, values: Array<bigint>, isSigned: boolean = false, width: number | undefined = undefined) : Array<Sig> {
            let signalNames = [...Array(values.length).keys()].map((p:number)=>{ return `${name}_${p}`})
            let retVal : Array<Sig> = []
            signalNames.forEach((p,i) => {
                retVal.push(this.addConstSignal(p, values[i], isSigned || (values[i] < 0), width))
            })
            return retVal
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
            // assemble TSSVParameters
            let paramsArray: string[] = []
            if(this.params) {
                //FIXME - need separate SV Verilog parameter container
                /*
                for (var key of Object.keys(this.params)) {
                    let param = this.params[key]
                    // console.log(`${key}: ${param} ${typeof param}`)
                    if(typeof param === 'number') {
                        paramsArray.push(`parameter ${key} = ${param.toString()}`) 
                    }
                }
                */
            }
            let paramsString = ""
            if(paramsArray.length > 0) {
                paramsString = `    #(${paramsArray.join(',\n    ')})`
            }

            // construct IO definition
            let IOArray: string[] = []
            Object.keys(this.IOs).map((key) => {
                let rangeString = ""
                let signString = (this.IOs[key].isSigned) ? " signed" : ""
                if((this.IOs[key].width || 0) > 1) {
                    rangeString = `[${Number(this.IOs[key].width)-1}:0]`
                }
                IOArray.push(`${this.IOs[key].type}${signString} ${rangeString} ${key}`)
            })
            let IOString: string = `   ${IOArray.join(',\n   ')}`

            // construct signal list
            let signalArray: string[] = []
            Object.keys(this.signals).map((key) => {
                let rangeString = ""
                let signString = (this.signals[key].isSigned) ? " signed" : ""
                if((this.signals[key].width || 0) > 1) {
                    rangeString = `[${Number(this.signals[key].width) - 1}:0]`
                }
                signalArray.push(`${this.signals[key].type}${signString} ${rangeString} ${key}`)
            })
            let signalString: string = `   ${signalArray.join(';\n   ')}`

            for(var sensitivity in this.registerBlocks) {
                for(var resetCondition in this.registerBlocks[sensitivity]) {
                    for(var enable in this.registerBlocks[sensitivity][resetCondition]) {
                        const regs = this.registerBlocks[sensitivity][resetCondition][enable]
                        let resetString = "   "                        
                        if(resetCondition != "#NONE#") {
                            let resetAssignments: string[] = []
                            Object.keys(regs).map((key) => {
                                const reg = regs[key]
                                //console.log(reg)
                                resetAssignments.push(`           ${key} <= 'd${reg.resetVal||0};`)
                            })
                            resetString =
`     if(${resetCondition})
        begin
${resetAssignments.join('\n')}
        end
      else `      
                        }                        

                        let enableString = (enable == "#NONE#") ? "" : `if(${enable})`

                        let functionalAssigments : string[] = []
                        Object.keys(regs).map((key) => {
                            const reg = regs[key]
                            //console.log(reg)
                            functionalAssigments.push(`           ${key} <= ${reg.d};`)
                        })


                        this.body +=
`
   always ${sensitivity}
${resetString}${enableString}
        begin
${functionalAssigments.join('\n')}
        end
`

                    }
                }
            }

            let verilog: string = 
`
module ${this.name} ${paramsString}
   (
${IOString}
   )

${signalString};

${this.body}

endmodule
`

            return verilog
        }
        protected body: string
        protected registerBlocks: {
            [sensitivity:string] : {
                [resetCondition:string] : {
                    [enable:string] : {
                        [q:string] : {d: string, resetVal?: bigint}
                    }
                }
            }
        } = {}
    }

    export default {Module, Sig, Expr}
//}

//TSSV()


/**
 * IntRange type allows specifify a type that allows a range of integer values
 * Used in Parameter types on TSSV modules where the parameters have range restrictions
 */
export type IntRange<
    START extends number,
END extends number,
ARR extends unknown[] = [],
ACC extends number = never> = ARR['length'] extends END
    ? ACC | START | END
    : IntRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>


type ParameterValue = string | bigint | IntRange<number,number> | Array<bigint>
export interface TSSVParameters { 
        name?: string | undefined
        [name: string]: ParameterValue | undefined 
}
    
interface SVEnum {
    typeName: string
    width: number
    values: {[key:string] : bigint }
}

interface baseSignal {
    type?: 'wire' | 'reg' | 'const' | 'logic' | 'enum'
    width?: number
    isClock?: 'posedge' | 'negedge'
    isReset?: 'lowasync' | 'highasync' | 'lowsync' | 'highsync'
    isSigned?: boolean
    isVector?: number
    description?: string
    enum?: SVEnum
}

type PortDirection = 'input' | 'output' | 'inout'

/**
 * defines an IO signal (a.k.a port of the the TSSV module)
 */
interface IOSignal  extends baseSignal {
    direction: PortDirection 
}

/**
 * The IO interface bundle of a TSSV Module
 */
export interface IOSignals {[name: string] : IOSignal}


/**
 * container class of a TSSV signal used to pass signals
 * among add* primtives and submodules to define interconnections
 */
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

/**
 * container class of a TSSV expression, or a RHS assignment in the
 * generated output
 */
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
    value?: bigint | Array<bigint>
}

interface Signals {[name: string] : Signal}



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

export class Interface {
    name: string
    params: TSSVParameters
    signals: Signals
    role?: string
    modports?: {[role:string] : {[key:string] : PortDirection }}
    constructor(name: string, params: TSSVParameters = {}, role: string | undefined  = undefined, signals = {} ) {
        this.name = name
        this.params = params
        this.role = role
        this.signals = signals
    }
    
    interfaceName():string {
        const vName = `${this.name}_${Object.values(this.params).join('_')}`
        return vName
    }

    writeSystemVerilog(): string {
        const signalArray: string[] = []
        Object.keys(this.signals).map((key) => {
            let rangeString = ""
            const signString = (this.signals[key].isSigned) ? " signed" : ""
            if((this.signals[key].width || 0) > 1) {
                rangeString = `[${Number(this.signals[key].width) - 1}:0]`
            }
            signalArray.push(`${this.signals[key].type || 'logic'}${signString} ${rangeString} ${key}`)
        })
        const signalString: string = `   ${signalArray.join(';\n   ')}`

        let modportsString: string = ''
        for(const modport in this.modports) {
            const thisModport = this.modports[modport]
            const modportArray: string[] = []
            Object.keys(thisModport).map((name) => {
                modportArray.push(`      ${thisModport[name]} ${name}`)
            })
            modportsString += `
    modport ${modport} (
${modportArray.join(',\n')}
    );           
`
        }
        const verilog = `
interface ${this.interfaceName()};

${signalString};

${modportsString}

endinterface
        
`

        return verilog
    }
}

/**
* The Module class is the base class for all TSSV modules.
*/
export class Module {
    
    /**
    * name contains the resulting SystemVerilog module name
    */
    readonly name: string

    protected params: TSSVParameters
    protected IOs : IOSignals
    protected signals: Signals
    protected submodules: {[key:string] : {
        module: Module
        bindings: {[port:string]: string|Sig}
    }}
    protected interfaces: {[key:string]:  Interface }
    
    /**
     * base constructor
     * @param params parameter value bundle
     * @param IOs IO port bundle
     * @param signals signal bundle
     * @param body SystemVerilog body text
     */
    constructor(params: TSSVParameters = {}, IOs: IOSignals = {}, signals = {}, body= "") {
        this.params = params
        if(typeof params.name === 'string') {
            this.name = params.name
        } else {
            const mapFunc = (p: ParameterValue | undefined) => {
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
        this.submodules = {}
        this.interfaces = {}
    }

    protected bindingRules = {
        'input' : ['input', 'wire', 'reg', 'const', 'logic', 'enum'],
        'output' : ['output','wire', 'logic', 'enum'],
        'inout' : ['inout', 'wire']
    }

    /**
     * adds an interface signal bundle
     * @param instanceName the name for this instance of the signal bundle
     * @param _interface the type of interface to add
     * @returns the resulting interface for connecting to modules and add* primitives
     */
    addInterface( 
        instanceName:string,
        _interface: Interface):Interface  {
        if(this.interfaces[instanceName]) throw Error(`${instanceName} interface already exists`)
        this.interfaces[instanceName] = _interface
        return _interface
    }

    /**
     * instantiate another module a a submodule
     * @param instanceName sets the instance mane
     * @param submodule the module to instantiate
     * @param bindings define the connections of the submodule
     * @param autoBind find signals in parent with matching name for signals that are not explicitly bound
     * @returns returns the resulting submodule instance
     */
    addSubmodule(
        instanceName:string, 
        submodule:Module, 
        bindings: {[port:string]: string|Sig}, 
        autoBind:boolean=true):Module {
        if(this.submodules.instanceName !== undefined) throw Error(`submodule with instance name ${instanceName} already exists`)
        const thisModule = {
            module: submodule,
            bindings: bindings
        }
        this.submodules[instanceName] = thisModule
        if(autoBind) {
            for(const thisPort in submodule.IOs) {
                if(!thisModule.bindings[thisPort]) {
                    if(this.IOs[thisPort]) {
                        thisModule.bindings[thisPort] = thisPort
                    } else if(this.signals[thisPort]) {
                        thisModule.bindings[thisPort] = thisPort
                    } else if(submodule.IOs[thisPort].direction === 'input'){
                        throw  Error(`unbound input on ${submodule.name}: ${thisPort}`)
                    }
                }
            }
            for(const _interface in submodule.interfaces) {
                const thisInterface = submodule.interfaces[_interface]
                if(thisInterface.role  && thisInterface.modports) {
                    if(!thisModule.bindings[_interface]) {
                        if(this.interfaces[_interface]) {
                            thisModule.bindings[_interface] = _interface
                        } else {
                            throw Error(`unbound interface on ${submodule.name}: ${_interface}`)
                        }
                    }
                }
            }
        }

        for(const port in thisModule.bindings) {
            const thisPort = submodule.IOs[port]
            const thisInterface = submodule.interfaces[port]
            if(thisPort) {
                const thisSig = this.findSignal(bindings[port], true, this.addSubmodule)            
                if(!(this.bindingRules[thisPort.direction].includes(thisSig.type || 'logic'))) throw Error(`illegal binding ${port}(${bindings[port]})`)
            } else if(thisInterface && (typeof port === 'string')) {
                const thisInt = this.interfaces[bindings[port].toString()]
                if(thisInt.role) {
                    if(thisInt.role !== thisInterface.role) throw Error(`${port} interface role mismatch on ${submodule.name}`)
                }
            } else {
                throw Error(`${port} not found on module ${submodule.name}`)
            }
        }
        
        return thisModule.module
    }


    protected simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
        return (hash >>> 0).toString(36).padStart(7, '0');
    }

    // we do not call the caller, we just grab the name for an error message
    // so the explicit anys are fine
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    protected findSignal(sig:Sig|string, throwOnFalse: boolean = false, caller: ((...args: any[]) => any) | string | null = null): Signal | IOSignal {
        const thisSig = this.IOs[sig.toString()] || this.signals[sig.toString()]
        if(!thisSig && throwOnFalse) {
            let errString = ""
            if(typeof caller === 'function') {
                errString = `${sig.toString()} signal not found in ${caller.name}()`
            } else if (caller !== null) {
                errString = `${caller.toString()}: ${sig.toString()} signal not found`
            }
            throw Error(errString)
        }
        return thisSig
    }

    /**
     * add a signal to the SystemVerilog module
     * @param name name of the signal
     * @param signal parameters of the signal
     * @returns signal that can be passed to other add* functions to make connections
     */
    addSignal(name: string, signal: Signal):Sig {
        if(this.findSignal(name)) throw Error(`${name} signal already exists`)
        this.signals[name] = signal
        return new Sig(name)
    }

    /**
     * add a DFF register(can be multi-bit) to the d input
     * @param io the input/output of the register 
     * @returns return the q output signal
     */
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
                this.signals[qName] = {...dSig, type:'logic'}
            }
        }            
        if(io.q) {
            const qSig = this.findSignal(io.q, true, this.addRegister)
            switch(qSig.type) {
            case undefined:    
            case 'wire':
                qSig.type = 'logic'
                break
            case 'reg':
            case 'logic':
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

    /**
     * get the number of bits need to represent an integer value
     * @param a the value to determine the bit width of
     * @param isSigned whether the value should be treated as a signed number
     * @returns the minimum bit width needed to represent the value
     */
    bitWidth(a: number | bigint, isSigned: boolean = false) : number {
        return (Math.ceil(Math.log2( Math.abs(Number(a)) + Number(a >= 0) ) + Number(isSigned || (a<0))))
    }

    /**
     * add a rounding operation to scale down and reduce the bit width of a signal
     * @param io the input/output signals of the round operation the rShift signal determines
     * the number of LSBs to round away.  The rShift signal can be either a liternal constant or a variable
     * shift.  When using a variable shift,  care should be taken to minimize the number of bits to
     * minimize the impact on the timing path of the resulting logic.
     * @param roundMode determines the type of rounding to apply
     * @returns the signal of the rounded result
     */
    addRound(io: {
        in: string|Sig,
        out: string|Sig,
        rShift: string | Sig | number
    }, roundMode: 'roundUp' | 'roundDown' | 'roundToZero' = 'roundUp'): Sig {
        if(roundMode !== 'roundUp') throw Error(`FIXME: ${roundMode} not implemented yet`)
        const inSig = this.findSignal(io.in, true, this.addRound)
        const outSig = this.findSignal(io.out, true, this.addRound)
        const rShiftString = io.rShift.toString()
        if(typeof io.rShift !== 'number') {
            const rShiftSig = this.findSignal(io.rShift, true, this.addRound)
            if(rShiftSig.isSigned) throw Error(`right shift signal ${io.rShift} must be unsigned`)                    
        }
        if(inSig.isSigned != outSig.isSigned) throw Error(`sign mode must match ${io.in}, ${io.out}`)
        this.body += `   assign ${io.out} = ${outSig.width}'((${io.in} + (${inSig.width}'d1<<(${rShiftString}-1)))>>>${rShiftString});\n`
        if(typeof io.out === 'string') {
            return new Sig(io.out)
        }
        return io.out
    }

    /**
     * add a Saturate operation to limit the bit width of a signal without overflow
     * @param io the input and output signals of the saturation operation
     * @param satMode determines the behavior of the saturation
     * @returns signal of the result of the saturation
     */
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
            const maxSatStringIn = `${inSig.width}'sd${sat-1}`
            const minSatStringIn = `-${inSig.width}'sd${sat}`
            const maxSatString = `${outSig.width}'sd${sat-1}`
            const minSatString = `-${outSig.width}'sd${sat}`
            this.body += 
		`   assign ${io.out} = (${io.in} > ${maxSatStringIn}) ? ${maxSatString} :
                       ((${io.in} < ${minSatStringIn}) ? ${minSatString} : ${outSig.width}'(${io.in}));
`
        } else {
            const sat = (1<<((outSig.width||1) - 1)) - 1
            const maxSatStringIn = `${outSig.width}'d${sat}`
            const maxSatString = `${outSig.width}'d${sat}`
            this.body += 
		`   assign ${io.out} = (${io.in} > ${maxSatStringIn}) ? ${maxSatString} : ${outSig.width}'(${io.in});
`
        }
        if(typeof io.out === 'string') {
            return new Sig(io.out)
        }
        return io.out
    }

    addSequentialAlways(
        io: {      
            clk: string | Sig, 
            reset?: string | Sig,
            outputs: (string| Sig)[]
        },
        body: string
    ) : void {
        for(const name in io.outputs) {
            const thisSig = this.findSignal(io.outputs[name], true, this.addSequentialAlways)
            switch(thisSig.type) {
                case undefined:    
                case 'wire':
                    thisSig.type = 'logic'
                    break
                case 'reg':
                case 'logic':
                    break
                default:
                    throw Error(`${name} is unsupported signal type ${thisSig.type}`)
                }
        }
        const clkSig = this.findSignal(io.clk, true, this.addRegister)
        if(!clkSig.isClock) throw Error('${io.clk} is not a clock signal')
        let resetSensitivity = '' 
        if(io.reset) {
            const rstSig = this.findSignal(io.reset, true, this.addRegister)
            if(!rstSig.isReset) throw Error(`${io.reset} is not a reset signal`)
            switch(rstSig.isReset) {
            case 'highasync' :
                resetSensitivity = `or posedge ${io.reset}`
                break
            case 'lowasync' :
                resetSensitivity = `or negedge ${io.reset}`
                break
            default:
            }
        }
        const sensitivityList = `@( ${clkSig.isClock} ${io.clk} ${resetSensitivity} )`
        if(body.includes('always_ff')) {
            const clkSenseMatch = body.replace(/\s+/g, ' ').includes(`${clkSig.isClock} ${io.clk}`)
            const resetSenseMatch = (resetSensitivity === '') || body.replace(/\s+/g, ' ').includes(resetSensitivity)            
            if(clkSenseMatch && resetSenseMatch) {
                this.body += body    
            } else {
                throw Error (`Sensitivity mismatch: ${sensitivityList} : ${body}`)
            }
        } else {
            this.body += `always_ff ${sensitivityList}\n`
            this.body += body
        }
    }

    addCombAlways(
        io: {      
            inputs?: (string | Sig)[], 
            outputs: (string| Sig)[]
        },
        body: string
    ) : void {
        for(const name in io.outputs) {
            const thisSig = this.findSignal(io.outputs[name], true, this.addCombAlways)
            switch(thisSig.type) {
                case undefined:    
                case 'wire':
                    thisSig.type = 'logic'
                    break
                case 'reg':
                case 'logic':
                    break
                default:
                    throw Error(`${name} is unsupported signal type ${thisSig.type}`)
                }
        }
        let sensitivityList: string | null = null
        if(io.inputs) {
            for(const name in io.inputs) {
               this.findSignal(io.inputs[name], true, this.addSequentialAlways)
            }
            sensitivityList = `@( ${io.inputs.join(' or ')} )`
        }            
        if(body.includes('always')) {
            const SenseMatch = body.replace(/\s+/g, ' ').includes(`${sensitivityList}`)          
            if(SenseMatch) {
                this.body += body    
            } else {
                throw Error (`Sensitivity mismatch: ${sensitivityList} : ${body}`)
            }
        } else if(sensitivityList) {
            this.body += `always ${sensitivityList}\n`
            this.body += body
        } else {
            this.body += `always_comb\n`
            this.body += body
        }
    }

    protected addOperation(
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
                console.log()
                if((resultSig.width||0) < nameMap[op].autoWidth(aWidth,bWidth)) console.warn(`${io.result} truncated output`)
                result =  io.result
            } else {
                result = `${nameMap[op].name}_${aAuto}x${bAuto}`
                this.signals[result] = {
                    type:'logic', 
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

    /**
     * adds an arithmetic adder to the generated SystemVerilog module
     * @param io the input/output interface of the adder
     * @returns the sum result
     */
    addAdder(io: OperationIO):Sig {
        return this.addOperation(BinaryOp.ADD, io)
    }

    /**
     * adds an arithemetic subtractor to the generated SystemVerilog module
     * @param io the input/output interface of the subtractor
     * @returns the difference result
     */
    addSubtractor(io: OperationIO):Sig {
        return this.addOperation(BinaryOp.SUBTRACT, io)
    }

    /**
     * add a constant literal signal to the generated SystemVerilog module
     * @param name signal name
     * @param value signal literal value
     * @param isSigned whether the signal is signed or not
     * @param width bit width of the resulting signal
     * @returns 
     */
    addConstSignal(name: string, value: bigint, isSigned: boolean = false, width: number | undefined = undefined): Sig {
        const minWidth = this.bitWidth(value, isSigned)
        const resolvedWidth = (width === undefined) ?  minWidth : width
        if(resolvedWidth < minWidth) throw Error(`width:${resolvedWidth} is insufficient for value: ${value}`)
        this.signals[name] = {type:'const', value: value, isSigned: isSigned, width: resolvedWidth}
        return new Sig(name)
    }

    /**
     * add an array of constant literal signals to the generated SystemVerilog module
     * @param name signal name
     * @param values the literal values of the array
     * @param isSigned whether the signals are signed or not
     * @param width bit width of the resulting signals
     * @returns The array of signals
     */
    addConstSignals(name: string, values: Array<bigint>, isSigned: boolean = false, width: number | undefined = undefined) : Array<Sig> {
        const signalNames = [...Array(values.length).keys()].map((p:number)=>{ return `${name}_${p}`})
        const retVal : Array<Sig> = []
        signalNames.forEach((p,i) => {
            retVal.push(this.addConstSignal(p, values[i], isSigned || (values[i] < 0), width))
        })
        return retVal
    }

    /**
     * add a SystemVerilog continuous assign statement
     * @param io expression that is the right hand side of the assigment
     * @returns signal that is the left hand side of the assignment
     */
    addAssign(io:{in:Expr, out:string|Sig}) : Sig {
        const outSig = this.findSignal(io.out, true, this.addAssign)
        if(!(outSig.type === 'wire' || outSig.type === 'logic')) {
            throw Error(`${io.out.toString()} signal must be either wire or logic in assign statement`)
        }
        this.body += `  assign ${io.out.toString()} = ${io.in.toString()}`
        if(typeof io.out === 'string') {
            return new Sig(io.out)
        }
        return io.out
    }

    /**
     * add a multiplexer to the TSSV module
     * @param io The input/output signals connected to the multiplexer
     * @returns signal of the multiplexer output
     */
    addMux(io:{in:Array<string|Sig|Expr>, sel:string|Sig|Expr, out:string|Sig}):Sig {
        const selWidth = Math.ceil(Math.log2(io.in.length))
        let selString =  io.sel.toString()
        if((typeof io.sel === 'string') || (io.sel.type === 'Sig')) {
            const selSig = this.findSignal(io.sel, true, this.addMux)
            if(selSig.width||1 < selWidth) throw Error(`${io.sel.toString()} signal does not have enough bits as Mux select`)
            if(selSig.width||1 > selWidth) {
                selString = `${io.sel.toString()}[${selWidth-1}:0]`
            }
        }
        const outSig = this.findSignal(io.out, true, this.addMux)
        switch(outSig.type) {
            case undefined:
            case 'wire':
                outSig.type = 'logic'
                break
            case 'reg':
            case 'logic':
                break
            default:
                throw Error(`${io.out} is unsupported signal type ${outSig.type}`)
            }
        let caseAssignments = ''
        for(const i in io.in) {
            const rhExpr = `${io.in[i].toString()}`
            caseAssignments += `     case ${selWidth}'d{i}: ${io.out} = ${rhExpr}`
        }
        this.body +=
`  always_comb
    unique case(${selString})
${caseAssignments}
      default: {${outSig.width}{1'bx}}
`
        if(typeof io.out === 'string') {
            return new Sig(io.out)
        }
        return io.out
    }

    /**
     * print some debug information to the console
     */
    debug() {
        console.log(this.name)
        console.log(this.params)
        console.log(this.IOs)
        console.log(this.signals)
        console.log(this.body)
        console.log(this.registerBlocks)
    }

    /**
     * write the generated SystemVerilog code to a string
     * @returns string containing the generated SystemVerilog code for this module
     */
    writeSystemVerilog(): string {
        // assemble TSSVParameters
        const paramsArray: string[] = []
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
        const IOArray: string[] = []
        const signalArray: string[] = []
        let interfacesString = ''
        Object.keys(this.IOs).map((key) => {
            let rangeString = ""
            const signString = (this.IOs[key].isSigned) ? " signed" : ""
            if((this.IOs[key].width || 0) > 1) {
                rangeString = `[${Number(this.IOs[key].width)-1}:0]`
            }
            IOArray.push(`${this.IOs[key].direction} ${this.IOs[key].type || 'logic'}${signString} ${rangeString} ${key}`)
        })
        Object.keys(this.interfaces).map((key) => {
            const thisInterface = this.interfaces[key]
            if(thisInterface.role) {
                if(thisInterface.modports) {
                    const thisModports = thisInterface.modports[thisInterface.role]
                    if(!thisModports) throw Error(`${thisInterface.name} : inconsistent modports`)
                    /*
                    Object.keys(thisModports).map((name) => {
                        let thisSignal = thisInterface.signals[name] 
                        if(!thisSignal) `${thisInterface.name}: modport missing signal ${name}`
                        let rangeString = ""
                        let signString = (thisSignal.isSigned) ? " signed" : ""
                        if((thisSignal.width || 0) > 1) {
                            rangeString = `[${Number(thisSignal.width)-1}:0]`
                        }
                        IOArray.push(`${thisModports[name]} ${thisSignal.type || 'logic'}${signString} ${rangeString} ${name}`)
                    })
                    */
                   if(!Module.printedInterfaces[thisInterface.interfaceName()]) {
                       interfacesString += thisInterface.writeSystemVerilog()
                       Module.printedInterfaces[thisInterface.interfaceName()] = true
                   }
                   IOArray.push(`${thisInterface.interfaceName()}.${thisInterface.role} ${key}`)
                } else {
                    throw Error(`${thisInterface.name} has role/modport inconsistency`)
                }
            } else {
                signalArray.push(`${thisInterface.interfaceName()} ${key}`)
            }
        })
        const IOString: string = `   ${IOArray.join(',\n   ')}`

        // construct signal list
        Object.keys(this.signals).map((key) => {
            let rangeString = ""
            const signString = (this.signals[key].isSigned) ? " signed" : ""
            if((this.signals[key].width || 0) > 1) {
                rangeString = `[${Number(this.signals[key].width) - 1}:0]`
            }
            signalArray.push(`${this.signals[key].type || 'logic'}${signString} ${rangeString} ${key}`)
        })
        let signalString: string = `   ${signalArray.join(';\n   ')}`
        if(signalArray.length) signalString += ';'

        for(const sensitivity in this.registerBlocks) {
            for(const resetCondition in this.registerBlocks[sensitivity]) {
                for(const enable in this.registerBlocks[sensitivity][resetCondition]) {
                    const regs = this.registerBlocks[sensitivity][resetCondition][enable]
                    let resetString = "   "                        
                    if(resetCondition != "#NONE#") {
                        const resetAssignments: string[] = []
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

                    const enableString = (enable == "#NONE#") ? "" : `if(${enable})`

                    const functionalAssigments : string[] = []
                    Object.keys(regs).map((key) => {
                        const reg = regs[key]
                        //console.log(reg)
                        functionalAssigments.push(`           ${key} <= ${reg.d};`)
                    })


                    this.body +=
`
   always_ff ${sensitivity}
${resetString}${enableString}
        begin
${functionalAssigments.join('\n')}
        end
`

                }
            }
        }

        let subModulesString = ""
        for(const moduleInstance in this.submodules) {
            const thisSubmodule = this.submodules[moduleInstance]
            const printed : {[key:string]:boolean}= {}
            if(!printed[thisSubmodule.module.name]) {
                printed[thisSubmodule.module.name] = true
                subModulesString += thisSubmodule.module.writeSystemVerilog()
            }
            const bindingsArray:Array<string> = []
            for(const binding in thisSubmodule.bindings) {
                bindingsArray.push(`        .${binding}(${thisSubmodule.bindings[binding]})`)
            }
            this.body+=
`
    ${thisSubmodule.module.name} ${moduleInstance}
      (
${bindingsArray.join(',\n')}        
      );
`
        }

        const verilog: string = 
`
${interfacesString}        
${subModulesString}
        
/* verilator lint_off WIDTH */        
module ${this.name} ${paramsString}
   (
${IOString}
   );

${signalString}

${this.body}

endmodule
/* verilator lint_on WIDTH */        
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
    protected static printedInterfaces : {[key:string]: boolean} = {}
}

export default {Module, Sig, Expr}



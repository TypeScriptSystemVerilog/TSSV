/** @module Base */
import { readFileSync } from 'fs'
import { parseSVModules, selectSVModule } from './SVModuleHeader.js'
import { runVerible } from '../tools/formatters/verible.js'

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

type ParameterValue =
  string | boolean | bigint | IntRange<number, number> | bigint[] | string[] |
  Array<IntRange<number, number>> |
  object

export interface TSSVParameters {
  name?: string | undefined
  [name: string]: ParameterValue | undefined
}

interface SVEnum {
  typeName: string
  width: number
  values: Record<string, bigint>
}

/**
 * SystemVerilog attributes for a signal or port declaration, keyed by attribute name.
 * A string value is emitted quoted, a number or bigint bare, and `true` as the name alone.
 *
 * @example
 * ```typescript
 * this.addSignal('mem', { width: 8, isArray: 4n, attributes: { ram_style: 'distributed' } })
 * // (* ram_style = "distributed" *) logic [7:0] mem[0:3];
 * ```
 */
export type SVAttributes = Record<string, string | number | bigint | true>

/**
 * signal parameters
 */
interface baseSignal {
  type?: 'wire' | 'reg' | 'const logic' | 'logic' | 'enum'
  width?: number
  isClock?: 'posedge' | 'negedge'
  isReset?: 'lowasync' | 'highasync' | 'lowsync' | 'highsync'
  isSigned?: boolean
  isArray?: bigint
  description?: string
  enum?: SVEnum
  /**
   * attributes emitted in front of the declaration, as `(* name = value *)`. Not supported on
   * interface signals.
   */
  attributes?: SVAttributes
}

/**
 * Formats a declaration's attributes as `(* a = "x", b = 1, c *) `, or '' if it has none.
 * @param declName the declared signal or port, for error messages
 * @param attributes the declaration's attributes
 * @returns the attribute instance, with a trailing space
 */
function attributePrefix (declName: string, attributes: SVAttributes | undefined): string {
  if (attributes === undefined) return ''
  const specs: string[] = []
  for (const [name, value] of Object.entries(attributes)) {
    if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(name)) {
      throw Error(`${declName}: attribute name '${name}' is not a legal SystemVerilog identifier`)
    }
    if (value === true) {
      specs.push(name)
    } else if (typeof value === 'string') {
      if (/["\\\r\n]/.test(value)) {
        throw Error(`${declName}: attribute ${name} value ${JSON.stringify(value)} contains a quote, backslash or newline`)
      }
      specs.push(`${name} = "${value}"`)
    } else if (typeof value === 'bigint' || (typeof value === 'number' && Number.isSafeInteger(value))) {
      specs.push(`${name} = ${value.toString()}`)
    } else {
      throw Error(`${declName}: attribute ${name} has unsupported value ${String(value)}`)
    }
  }
  return (specs.length > 0) ? `(* ${specs.join(', ')} *) ` : ''
}

type PortDirection = 'input' | 'output' | 'inout'

/**
 * defines an IO signal (a.k.a port of the the TSSV module)
 */
interface IOSignal extends baseSignal {
  direction: PortDirection
}

/**
 * The IO interface bundle of a TSSV Module
 */
export type IOSignals = Record<string, IOSignal>

/**
 * options for `Module.addSystemVerilogSubmodule()`
 */
export interface SVImportOptions {
  /** module to instantiate when the file declares more than one */
  moduleName?: string
  /** path to verible-verilog-syntax, used to parse the module header (default: found on PATH) */
  veribleSyntaxPath?: string
}

/**
 * container class of a TSSV signal used to pass signals
 * among add* primtives and submodules to define interconnections
 */
export class Sig {
  constructor (name: string) {
    this.name = name
    this.type = 'Sig'
  }

  toString = (): string => {
    return this.name
  }

  protected name: string
  readonly type: 'Sig'
}

export type ExprParams = Record<string, string | number | bigint>
/**
 * container class of a TSSV expression, or a RHS assignment in the
 * generated output
 */
export class Expr {
  constructor (def: string | ((p: ExprParams) => string), params?: ExprParams) {
    if (typeof def === 'string') {
      this.text = def
      this.func = null
      if (params) throw Error('Expr params can only be used with func() type expressions')
      this.params = null
    } else {
      this.text = null
      this.func = def
      if (params) {
        this.params = params
      } else {
        this.params = {}
      }
    }
    this.type = 'Expr'
  }

  toString = (): string => {
    if (this.text) {
      return this.text
    } else if (this.func) {
      return this.func(this.params || {})
    }
    return ''
  }

  params: ExprParams | null
  protected text: string | null
  protected func: ((p: ExprParams) => string) | null
  readonly type: 'Expr'
}

export interface Signal extends baseSignal {
  value?: bigint | bigint[]
}

export type Signals = Record<string, Signal | undefined>

interface OperationIO {
  a: string | Sig | bigint
  b: string | Sig | bigint
  result?: string | Sig
}

/**
 * Options for a top-level `Module.writeSystemVerilog()` call, which is how a design is emitted
 * across more than one file.
 *
 * An emission defines every module and interface it reaches, and by default each top-level call
 * starts from nothing — so emitting a DUT and then a testbench that instantiates it produces the
 * DUT twice, once per file. `exclude` carries the first emission's definitions into the second,
 * which then instantiates and references them instead of defining them again.
 *
 * ```typescript
 * const defined = new Set<string>()
 * const dutSV = dut.writeSystemVerilog({ defined })            // defines the DUT hierarchy
 * const tbSV = tb.writeSystemVerilog({ exclude: defined })     // references it
 * ```
 *
 * Whichever call runs first defines anything the two share, so emission order decides where a
 * shared interface lands. This is the rule that already governs a single emission — the first
 * module to need a definition emits it — extended across calls rather than reset between them.
 *
 * Both files must be given to the simulator or synthesis tool together: the second no longer
 * defines what it references.
 */
export interface SVEmitOptions {
  /**
   * Module and interface names that a previous emission already defined. They are instantiated
   * and referenced as usual, but not defined again.
   */
  exclude?: ReadonlySet<string>
  /**
   * If provided, receives the name of every module and interface this call defined. Names from
   * `exclude` are not added, so passing one set as `defined` and then as `exclude` accumulates
   * across an arbitrary number of files.
   */
  defined?: Set<string>
}

export interface FormatterConfig {
  engine: 'verible' | 'internal' | 'off'
  veriblePath?: string
  veribleFlags?: string[]
  failOnFormatError?: boolean
  formatTimeoutMs?: number
}

enum BinaryOp {
  MULTIPLY = '*',
  ADD = '+',
  SUBTRACT = '-',
  BITWISE_AND = '&',
  BITWISE_OR = '|'
}

/**
 * Interface is a class to define a signal bundle for a standardized
 * interface.  It wraps the modport functionality of an SV interface
 * allowing different port views of the signal bundle as well as
 * just a bundle of wires.   Interfaces simpilfy interface signal binding
 * by combining all signals into a single bundled bind.
 */
export class Interface {
  name: string
  params: TSSVParameters
  signals: Signals
  role?: string
  modports?: Record<string, Record<string, PortDirection>>
  constructor (name: string, params: TSSVParameters = {}, role: string | undefined = undefined, signals = {}) {
    this.name = name
    this.params = params
    this.role = role
    this.signals = signals
  }

  interfaceName (): string {
    const vName = `${this.name}_${Object.values(this.params).join('_')}`
    return vName
  }

  writeSystemVerilog (): string {
    const signalArray: string[] = []
    Object.keys(this.signals).forEach((key) => {
      const thisSignal = this.signals[key]
      if (thisSignal) {
        if (Object.keys(thisSignal.attributes ?? {}).length > 0) {
          throw Error(`${this.name}.${key}: attributes are not supported on interface signals`)
        }
        let rangeString = ''
        const signString = (thisSignal.isSigned) ? ' signed' : ''
        if ((thisSignal.width || 0) > 1) {
          rangeString = `[${Number(thisSignal.width) - 1}:0]`
        }
        signalArray.push(`${thisSignal.type || 'logic'}${signString} ${rangeString} ${key}`)
      }
    })
    const signalString: string = `   ${signalArray.join(';\n   ')}`

    let modportsString: string = ''
    for (const modport in this.modports) {
      const thisModport = this.modports[modport]
      const modportArray: string[] = []
      Object.keys(thisModport).forEach((name) => {
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

export type Interfaces = Record<string, Interface>

/**
* The Module class is the base class for all TSSV modules.
*/
export class Module<P extends TSSVParameters = TSSVParameters, IO extends IOSignals = IOSignals> {
  /**
    * name contains the resulting SystemVerilog module name
    */
  readonly name: string

  protected params: P
  protected IOs: IO
  protected static formatterConfig: FormatterConfig = { engine: 'verible', failOnFormatError: true }
  protected signals: Signals
  protected submodules: Record<string, {
    module: Module
    bindings: Record<string, string | Sig | bigint>
  }>

  protected interfaces: Interfaces

  /**
     * base constructor
     * @param params parameter value bundle
     * @param IOs IO port bundle
     * @param signals signal bundle
     * @param body SystemVerilog body text
     */
  constructor (params: P = {} as P, IOs: IO = {} as IO, signals = {}, body = '') {
    this.params = params
    if (typeof params.name === 'string') {
      this.name = params.name
    } else {
      const mapFunc = (p: ParameterValue | undefined): (ParameterValue | undefined) => {
        if (typeof p === 'object') {
          return this.simpleHash(JSON.stringify(p, function (key, value) {
            if (typeof value === 'bigint') {
              return value.toString()
            }
            return value
          }))
        }
        return p
      }
      this.name = this.constructor.name + '_' + Object.values(params).filter((p) => (p !== undefined)).map(mapFunc).join('_')
    }
    this.params.name = this.name
    this.IOs = IOs
    this.signals = signals
    this.body = body
    this.submodules = {}
    this.interfaces = {}
    this.verilogParams = {}
  }

  setVerilogParameter (param: string): void {
    if (!this.params[param]) {
      throw Error(`${param} does not exist!`)
    } else {
      const thisParam = this.params[param]
      if ((typeof thisParam === 'string') || (typeof thisParam === 'number') || (typeof thisParam === 'bigint')) {
        this.verilogParams[param] = true
      } else {
        throw Error(`unsupported type of parameter ${param} in setVerilogParameter()`)
      }
    }
  }

  static setFormatterConfig (config: FormatterConfig): void {
    Module.formatterConfig = config
  }

  protected bindingRules = {
    input: ['input', 'wire', 'reg', 'const logic', 'logic', 'enum'],
    output: ['output', 'wire', 'logic', 'enum'],
    inout: ['inout', 'wire']
  }

  /**
     * adds an interface signal bundle
     * @param instanceName the name for this instance of the signal bundle
     * @param _interface the type of interface to add
     * @returns the resulting interface for connecting to modules and add* primitives
     */
  addInterface (
    instanceName: string,
    _interface: Interface): Interface {
    if (this.interfaces[instanceName]) throw Error(`${instanceName} interface already exists`)
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
  addSubmodule (
    instanceName: string,
    submodule: Module,
    bindings: Record<string, string | Sig | bigint>,
    autoBind: boolean = true,
    createMissing: boolean = false,
    autoWidthExtension: boolean = false): Module {
    if (this.submodules.instanceName !== undefined) throw Error(`submodule with instance name ${instanceName} already exists`)
    const thisModule = {
      module: submodule,
      bindings
    }
    this.submodules[instanceName] = thisModule
    if (autoBind) {
      for (const thisPort in submodule.IOs) {
        if (!thisModule.bindings[thisPort]) {
          if (this.IOs[thisPort]) {
            thisModule.bindings[thisPort] = thisPort
          } else if (this.signals[thisPort]) {
            thisModule.bindings[thisPort] = thisPort
          } else if (createMissing) {
            const thisIO = submodule.IOs[thisPort]
            this.addSignal(thisPort, {
              width: thisIO.width,
              isSigned: thisIO.isSigned,
              isClock: thisIO.isClock,
              isReset: thisIO.isReset,
              isArray: thisIO.isArray
            })
            thisModule.bindings[thisPort] = thisPort
          } else if (submodule.IOs[thisPort].direction === 'input') {
            throw Error(`unbound input on ${submodule.name}: ${thisPort}`)
          }
        }
      }
      for (const _interface in submodule.interfaces) {
        const thisInterface = submodule.interfaces[_interface]
        if (thisInterface.role && thisInterface.modports) {
          if (!thisModule.bindings[_interface]) {
            if (this.interfaces[_interface]) {
              thisModule.bindings[_interface] = _interface
            } else if (createMissing) {
              this.addInterface(_interface,
                new Interface(thisInterface.name,
                  thisInterface.params,
                  undefined,
                  thisInterface.signals)
              )
              thisModule.bindings[_interface] = _interface
            } else {
              throw Error(`unbound interface on ${submodule.name}: ${_interface}`)
            }
          }
        }
      }
    }

    for (const port in thisModule.bindings) {
      const thisPort = submodule.IOs[port]
      const thisInterface = submodule.interfaces[port]
      if (thisPort) {
        let thisBinding = bindings[port]
        if (typeof thisBinding === 'bigint') {
          thisBinding = this.addConstSignal(undefined, thisBinding, (thisBinding < 0n), thisPort.width)
          bindings[port] = thisBinding
        }
        const thisSig = this.findSignal(thisBinding, true, this.addSubmodule, true)
        if (thisSig.isSigned && (thisPort.isSigned !== true)) {
          throw Error(`Error: signed signals can only be connected to signed ports, port: ${port.toString()}, signal: ${thisBinding.toString()}}`)
        }
        if (thisSig.isSigned) {
          if ((thisSig.width || 1) > (thisPort.width || 1)) {
            throw Error(`Error: binding signal is too wide for port, port: ${port.toString()}, signal: ${thisBinding.toString()}}, signal width: ${thisSig.width}, port width: ${thisPort.width}`)
          }
        } else {
          if (thisPort.isSigned) {
            if (((thisSig.width || 1) + 1) > (thisPort.width || 1)) {
              throw Error(`Error: binding signal is too wide for port, port: ${port.toString()}, signal: ${thisBinding.toString()}}, signed and unsigned mismatch extra bit is needed to sign unsigned number`)
            }
          } else {
            if ((thisSig.width || 1) > (thisPort.width || 1)) {
              throw Error(`Error: binding signal is too wide for port, port: ${port.toString()}, signal: ${thisBinding.toString()}}, signal width: ${thisSig.width}, port width: ${thisPort.width}`)
            }
          }
        }
        if (autoWidthExtension && (thisPort.direction === 'input')) {
          // sign or zero extend input automatically
          if ((thisSig.width || 1) < (thisPort.width || 1)) {
            const extBits = (thisPort.width || 1) - (thisSig.width || 1)
            const s_or_u = (thisPort.isSigned) ? 's' : 'u'
            const extSigName = `ext_w${extBits}${s_or_u}_${thisBinding.toString()}`
            if (this.findSignal(extSigName) === undefined) {
              const extSig = this.addSignal(extSigName, thisPort)
              if (thisSig.isSigned) {
                const signBit = (thisSig.width || 1) - 1
                this.addAssign(
                  {
                    in: new Expr(`{{${extBits}{${thisBinding.toString()}[${signBit}]}},${thisBinding.toString()}}`),
                    out: extSig
                  })
              } else {
                this.addAssign({ in: new Expr(`{${extBits}'d0,${thisBinding.toString()}}`), out: extSig })
              }
              bindings[port] = extSig
            } else {
              bindings[port] = extSigName
            }
          }
        } else {
          if ((thisSig.width || 1) !== (thisPort.width || 1)) {
            throw Error(`Error: binding signal width mismatch, port: ${port.toString()}, signal: ${thisBinding.toString()}}, port width: ${thisPort.width}, signal width: ${thisSig.width}`)
          }
        }
        if (!(this.bindingRules[thisPort.direction].includes(thisSig.type || 'logic'))) throw Error(`illegal binding ${port}(${bindings[port].toString()})`)
      } else if (thisInterface && (typeof port === 'string')) {
        const boundName = bindings[port].toString()
        const thisInt = this.interfaces[boundName]
        if (thisInt === undefined) throw Error(`${port}: interface '${boundName}' not found in ${this.name}`)
        // An interface's SV type is its name plus its parameter values, so two instances of the
        // same class with different parameters (widths, or a parameter that selects the signal
        // set) are different SV types and cannot be connected.
        if (thisInt.interfaceName() !== thisInterface.interfaceName()) {
          throw Error(`${port} interface type mismatch on ${submodule.name}: ${thisInt.interfaceName()} vs ${thisInterface.interfaceName()}`)
        }
        if (thisInt.role) {
          if (thisInt.role !== thisInterface.role) throw Error(`${port} interface role mismatch on ${submodule.name}`)
        }
      } else {
        throw Error(`${port} not found on module ${submodule.name}`)
      }
    }

    return thisModule.module
  }

  /**
   * instantiate a module from an existing SystemVerilog file.  The module name and the
   * direction of each bound port are taken from the file's module header.
   * @param instanceName the name of the instance
   * @param SVFilePath path to the SystemVerilog source file
   * @param params SV parameter overrides for the instance
   * @param bindings map of submodule port name to parent signal
   * @param autoBind automatically bind unbound ports to same-named parent signals
   * @param options `moduleName` selects the module to instantiate when the file declares
   * more than one (default: the only module in the file, or the one named after the file);
   * `veribleSyntaxPath` locates verible-verilog-syntax, which parses the module header
   * @returns the imported submodule
   */
  addSystemVerilogSubmodule (
    instanceName: string,
    SVFilePath: string,
    params: TSSVParameters,
    bindings: Record<string, string | Sig>,
    autoBind: boolean = true,
    options: SVImportOptions = {}): Module {
    const { moduleName, veribleSyntaxPath } = options
    const SVString = readFileSync(SVFilePath, { encoding: 'utf8', flag: 'r' }).toString()
    const header = selectSVModule(parseSVModules(SVString, { veribleSyntaxPath }), SVFilePath, moduleName)
    const vIOs: IOSignals = {}
    for (const port in bindings) {
      const kind = header.ports[port]
      if (kind === undefined) throw Error(`${port} is not a port of module ${header.name} in ${SVFilePath}`)
      if (kind === 'interface' || kind === 'ref') throw Error(`${kind} port ${port} of module ${header.name} is not supported by addSystemVerilogSubmodule`)
      const thisSignal = this.findSignal(bindings[port])
      vIOs[port] = { ...thisSignal, direction: kind }
    }
    const vModuleName = header.name
    const vModule = new Module(
      { name: vModuleName, ...params },
      vIOs,
      {},
      SVString
    )
    for (const p in vModule.params) {
      if (p !== 'name') { vModule.setVerilogParameter(p) }
    }
    vModule.writeSystemVerilog = (): string => { return SVString }
    return this.addSubmodule(instanceName, vModule, bindings, autoBind)
  }

  protected simpleHash (str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
    }
    // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
    return (hash >>> 0).toString(36).padStart(7, '0')
  }

  protected bigintToSigName (value: bigint, isSigned?: boolean, width?: number): string {
    if (isSigned === undefined) {
      isSigned = (value < 0n)
    }
    if (width === undefined) {
      width = this.bitWidth(value, isSigned)
    }
    if (width < this.bitWidth(value, isSigned)) {
      throw Error(`${width} is not enougn bits to hold value ${value}`)
    }
    const absVal = (value < 0n) ? `m${-value.toString()}` : value.toString()
    return `const_w${width}${isSigned ? 's' : 'u'}${absVal}`
  }

  // we do not call the caller, we just grab the name for an error message
  // so the explicit anys are fine
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  protected findSignal (sig: Sig | string | bigint, throwOnFalse: boolean = false, caller: ((...args: any[]) => any) | string | null = null, throwOnArray?: boolean): Signal | IOSignal {
    const sigString = (typeof sig === 'bigint') ? this.bigintToSigName(sig) : sig.toString()
    const thisSig = this.IOs[sigString] || this.signals[sigString]

    if (!thisSig) {
      const sigParts = sigString.split('.')
      if (sigParts.length === 2) {
        const [interfaceName, signalName] = sigParts
        const interfaceObj = this.interfaces[interfaceName]

        if (interfaceObj) {
          const interfaceSignal = interfaceObj.signals[signalName]
          if (interfaceSignal) {
            return interfaceSignal
          }
        }
      }

      if (throwOnFalse) {
        let errString = ''
        if (typeof caller === 'function') {
          errString = `${sig.toString()} signal not found in ${caller.name}()`
        } else if (caller !== null) {
          errString = `${caller.toString()}: ${sig.toString()} signal not found`
        }
        throw Error(errString)
      }
    }

    if (throwOnArray && thisSig.isArray) {
      let errString = ''
      if (typeof caller === 'function') {
        errString = `${sig.toString()} array signal used as normal signal in ${caller.name}()`
      } else if (caller !== null) {
        errString = `${caller.toString()}: ${sig.toString()} array signal used as normal signal`
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
  addSignal (name: string, signal: Signal): Sig {
    if (this.findSignal(name)) throw Error(`${name} signal already exists`)
    this.signals[name] = signal
    return new Sig(name)
  }

  /**
     * add a DFF register(can be multi-bit) to the d input
     * @param io the input/output of the register
     * @returns return the q output signal
     */
  addRegister (io: {
    d: string | Sig | Expr
    clk: string | Sig
    reset?: string | Sig
    resetVal?: bigint
    en?: string | Sig | Expr
    q?: string | Sig
  }): Sig {
    let qName: string | Sig | undefined = io.q
    if ((typeof io.d === 'string') || (io.d.type === 'Sig')) {
      const dSig = this.findSignal(io.d, true, this.addRegister, true)
      if (io.q === undefined) {
        qName = `${io.d.toString()}_q`
        if (this.signals[qName] || this.IOs[qName]) throw Error(`${qName} signal already exists`)
        // q describes a different net from d, so it doesn't inherit d's attributes
        const { attributes: _dAttributes, ...dDef } = dSig
        this.signals[qName] = { ...dDef, type: 'logic' }
      }
    }
    if (io.q) {
      const qSig = this.findSignal(io.q, true, this.addRegister, true)
      switch (qSig.type) {
        case undefined:
        case 'wire':
          qSig.type = 'logic'
          break
        case 'reg':
        case 'logic':
          break
        default:
          throw Error(`${io.q.toString()} is unsupported signal type ${qSig.type}`)
      }
      qName = io.q
    }
    if (qName === undefined) {
      throw Error(`addRegister(${JSON.stringify(io)}) auto q naming only allowed when d is a simple signal, not an expression`)
    }
    const d = io.d.toString()
    const clkSig = this.findSignal(io.clk, true, this.addRegister, true)
    if (!clkSig.isClock) throw Error(`${io.clk.toString()} is not a clock signal`)
    let resetSensitivity = ''
    let resetCondition = '#NONE#'
    if (io.reset) {
      const rstSig = this.findSignal(io.reset, true, this.addRegister, true)
      if (!rstSig.isReset) throw Error(`${io.reset.toString()} is not a reset signal`)
      switch (rstSig.isReset) {
        case 'highasync' :
          resetSensitivity = ` or posedge ${io.reset.toString()}`
          resetCondition = `${io.reset.toString()}`
          break
        case 'lowasync' :
          resetSensitivity = ` or negedge ${io.reset.toString()}`
          resetCondition = `!${io.reset.toString()}`
          break
        case 'lowsync' :
          resetCondition = `!${io.reset.toString()}`
          break
        case 'highsync' :
          resetCondition = `${io.reset.toString()}`
          break
        default:
      }
    }
    const sensitivityList = `@( ${clkSig.isClock} ${io.clk.toString()} ${resetSensitivity} )`
    let enableExpr = '#NONE#'
    if (io.en !== undefined) {
      enableExpr = io.en.toString()
    }
    // console.log(`d: ${d}`)
    // console.log(`sensitivity: ${sensitivityList}`)
    if (!this.registerBlocks[sensitivityList]) {
      this.registerBlocks[sensitivityList] = {}
    }
    if (!this.registerBlocks[sensitivityList][resetCondition]) {
      this.registerBlocks[sensitivityList][resetCondition] = {}
    }
    if (!this.registerBlocks[sensitivityList][resetCondition][enableExpr]) {
      this.registerBlocks[sensitivityList][resetCondition][enableExpr] = {}
    }
    this.registerBlocks[sensitivityList][resetCondition][enableExpr][qName.toString()] = { d, resetVal: io.resetVal }
    if (typeof qName === 'string') {
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
  bitWidth (a: number | bigint, isSigned: boolean = false): number {
    return (Math.ceil(Math.log2(Math.abs(Number(a)) + Number(a >= 0)) + Number(isSigned || (a < 0))))
  }

  /**
     * add a rounding operation to scale down and reduce the bit width of a signal: `out` is
     * `in / 2^rShift`, rounded as `roundMode` says.
     * @param io the input/output signals of the round operation. `in` and `out` must have the same
     * signedness. `rShift` determines the number of LSBs to round away. It can be either a literal
     * constant, from 0 to `in`'s width minus 1, or a variable shift: an unsigned signal whose value
     * stays in that range. When using a variable shift, care should be taken to minimize the
     * number of bits to minimize the impact on the timing path of the resulting logic.
     * Every mode but `rm` adds a bias before the shift. The sum is a signal named `<out>_biased`,
     * one bit wider than `in`, so it can't overflow. A result that doesn't fit `out` keeps its
     * low bits: `out` needs `in`'s width minus `rShift`, plus one bit, to hold every result.
     * @param roundMode determines the type of rounding to apply: `rp` rounds half up (towards
     * +∞), `rm` rounds down, `rz` rounds towards zero, `rn` rounds half to even, and `rna`
     * rounds half away from zero
     * @returns the signal of the rounded result
     */
  addRound (io: {
    in: string | Sig
    out: string | Sig
    rShift: string | Sig | number
  }, roundMode: 'rp' | 'rm' | 'rz' | 'rn' | 'rna' = 'rp'): Sig {
    const inSig = this.findSignal(io.in, true, this.addRound, true)
    const outSig = this.findSignal(io.out, true, this.addRound, true)
    if (inSig.isSigned !== outSig.isSigned) throw Error(`sign mode must match ${io.in.toString()}, ${io.out.toString()}`)
    if (!['rp', 'rm', 'rz', 'rn', 'rna'].includes(roundMode)) throw Error('roundMode not found')
    const inName = io.in.toString()
    const outName = io.out.toString()
    const inWidth = Number(inSig.width ?? 1)
    const outWidth = Number(outSig.width ?? 1)
    const signed = inSig.isSigned === true
    const shr = signed ? '>>>' : '>>' // WIDTH-5
    const shl = signed ? '<<<' : '<<'
    // The result, cast to out's width where it differs (WIDTH-3, WIDTH-7)
    const toOut = (expr: string, exprWidth: number): string => exprWidth === outWidth ? expr : `${outWidth}'(${expr})`

    let shift: string
    let shiftWidth = 0
    if (typeof io.rShift === 'number') {
      if (!Number.isInteger(io.rShift) || io.rShift < 0 || io.rShift >= inWidth) {
        throw Error(`addRound: rShift ${io.rShift} must be an integer from 0 to ${inWidth - 1}`)
      }
      if (io.rShift === 0) {
        this.body += `   assign ${outName} = ${toOut(inName, inWidth)};\n`
        return typeof io.out === 'string' ? new Sig(io.out) : io.out
      }
      shift = `${io.rShift}`
    } else {
      const rShiftSig = this.findSignal(io.rShift, true, this.addRound, true)
      if (rShiftSig.isSigned) throw Error(`right shift signal ${io.rShift.toString()} must be unsigned`)
      shift = io.rShift.toString()
      shiftWidth = Number(rShiftSig.width ?? 1)
    }

    if (roundMode === 'rm' || (roundMode === 'rz' && !signed)) {
      // round down: the shift alone
      this.body += `   assign ${outName} = ${toOut(`${inName} ${shr} ${shift}`, inWidth)};\n`
    } else {
      // Add a bias, then shift. The sum gets one more bit than in, so it can't overflow, and
      // a named signal (WIDTH-6). With 2^s the weight of the shifted-out bits, half = 2^(s-1):
      //   rp:  half                         round half up
      //   rz:  in < 0 ? 2^s - 1 : 0         round towards zero
      //   rna: in < 0 ? half - 1 : half     round half away from zero
      //   rn:  in[s] ? half : half - 1      round half to even
      const w = inWidth + 1
      const lit = (v: bigint | number): string => `${w}'${signed ? 's' : ''}d${v}`
      const negative = `${inName}[${inWidth - 1}]`
      let ones: string // 2^s - 1
      let half: string
      let halfLess1: string
      if (shiftWidth === 0) {
        const s = BigInt(shift)
        ones = lit((1n << s) - 1n)
        half = lit(1n << (s - 1n))
        halfLess1 = lit((1n << (s - 1n)) - 1n)
      } else {
        // For a variable s, from 2^s; half and half - 1 are both 0 when s is 0
        const pow = `(${lit(1)} ${shl} ${shift})`
        ones = `(${pow} - ${lit(1)})`
        half = `(${pow} ${shr} 1)`
        halfLess1 = `(${ones} ${shr} 1)`
      }
      const bias = {
        rp: half,
        rz: `${negative} ? ${ones} : ${lit(0)}`,
        rna: signed ? `${negative} ? ${halfLess1} : ${half}` : half,
        rn: `${inName}[${shift}] ? ${half} : ${halfLess1}`
      }[roundMode]
      const biased = this.addSignal(`${outName.replace(/\W/g, '_')}_biased`, { width: w, isSigned: signed })
      this.body += `   assign ${biased.toString()} = ${w}'(${inName}) + (${bias});\n`
      this.body += `   assign ${outName} = ${toOut(`${biased.toString()} ${shr} ${shift}`, w)};\n`
    }
    if (typeof io.out === 'string') {
      return new Sig(io.out)
    }
    return io.out
  }

  /**
     * add a Saturate operation to limit the bit width of a signal without overflow
     * @param io the input and output signals of the saturation operation. They must have the same
     * signedness. An `out` at least as wide as `in` gets `in` extended, except that `balanced`
     * still clamps a signed `in` of the same width.
     * @param satMode determines the behavior of the saturation. `simple` clamps `in` to `out`'s
     * range. `balanced` clamps a signed `in` to a range symmetric about zero, from
     * `-(2^(n-1) - 1)` to `2^(n-1) - 1` for an `n`-bit `out`; for an unsigned `in` it's `simple`.
     * `none` doesn't clamp: an unsigned `in` keeps its low bits, and a signed `in` out of range
     * keeps its sign and its low `n - 1` bits.
     * @returns signal of the result of the saturation
     */
  addSaturate (io: {
    in: string | Sig
    out: string | Sig
  }, satMode: 'simple' | 'balanced' | 'none' = 'simple'): Sig {
    const inSig = this.findSignal(io.in, true, this.addSaturate, true)
    const outSig = this.findSignal(io.out, true, this.addSaturate, true)
    if (inSig.isSigned !== outSig.isSigned) throw Error(`sign mode must match ${io.in.toString()}, ${io.out.toString()}`)
    const inName = io.in.toString()
    const outName = io.out.toString()
    const inWidth = Number(inSig.width ?? 1)
    const outWidth = Number(outSig.width ?? 1)
    // in at out's width: extended (WIDTH-3) or truncated (WIDTH-7)
    const fit = inWidth === outWidth ? inName : `${outWidth}'(${inName})`
    let expr: string
    if (inSig.isSigned) {
      const lit = (v: bigint, w: number): string => `${v < 0n ? '-' : ''}${w}'sd${v < 0n ? -v : v}`
      const max = (1n << BigInt(outWidth - 1)) - 1n
      const min = (satMode === 'balanced') ? -max : -max - 1n
      // in can pass max or min only if it's wider than out, or, for balanced, as wide
      const canPassMax = inWidth > outWidth
      const canPassMin = inWidth > outWidth || (satMode === 'balanced' && inWidth === outWidth)
      const aboveMax = `${inName} > ${lit(max, inWidth)}`
      const belowMin = `${inName} < ${lit(min, inWidth)}`
      if (satMode === 'none') {
        // keep the sign, and wrap the rest
        const low = outWidth > 1 ? `, ${inName}[${outWidth - 2}:0]` : ''
        expr = canPassMax ? `(${aboveMax}) ? $signed({1'b0${low}}) : (${belowMin}) ? $signed({1'b1${low}}) : ${fit}` : fit
      } else {
        expr = `${canPassMax ? `(${aboveMax}) ? ${lit(max, outWidth)} : ` : ''}${canPassMin ? `(${belowMin}) ? ${lit(min, outWidth)} : ` : ''}${fit}`
      }
    } else {
      const max = (1n << BigInt(outWidth)) - 1n
      if (inWidth <= outWidth) {
        expr = fit
      } else if (satMode === 'none') {
        expr = `${inName}[${outWidth - 1}:0]`
      } else {
        expr = `(${inName} > ${inWidth}'d${max}) ? ${outWidth}'d${max} : ${fit}`
      }
    }
    this.body += `   assign ${outName} = ${expr};\n`
    if (typeof io.out === 'string') {
      return new Sig(io.out)
    }
    return io.out
  }

  addSequentialAlways (
    io: {
      clk: string | Sig
      reset?: string | Sig
      outputs: Array<string | Sig>
    },
    body: string
  ): void {
    for (const output of io.outputs) {
      const thisSig = this.findSignal(output, true, this.addSequentialAlways)
      switch (thisSig.type) {
        case undefined:
        case 'wire':
          thisSig.type = 'logic'
          break
        case 'reg':
        case 'logic':
          break
        default:
          throw Error(`${output.toString()} is unsupported signal type ${thisSig.type}`)
      }
    }
    const clkSig = this.findSignal(io.clk, true, this.addRegister, true)
    if (!clkSig.isClock) throw Error(`${io.clk.toString()} is not a clock signal`)
    let resetSensitivity = ''
    if (io.reset) {
      const rstSig = this.findSignal(io.reset, true, this.addRegister, true)
      if (!rstSig.isReset) throw Error(`${io.reset.toString()} is not a reset signal`)
      switch (rstSig.isReset) {
        case 'highasync' :
          resetSensitivity = `or posedge ${io.reset.toString()}`
          break
        case 'lowasync' :
          resetSensitivity = `or negedge ${io.reset.toString()}`
          break
        default:
      }
    }
    const sensitivityList = `@( ${clkSig.isClock} ${io.clk.toString()} ${resetSensitivity} )`
    if (body.includes('always_ff')) {
      const clkSenseMatch = body.replace(/\s+/g, ' ').includes(`${clkSig.isClock} ${io.clk.toString()}`)
      const resetSenseMatch = (resetSensitivity === '') || body.replace(/\s+/g, ' ').includes(resetSensitivity)
      if (clkSenseMatch && resetSenseMatch) {
        this.body += body
      } else {
        throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`)
      }
    } else {
      this.body += `always_ff ${sensitivityList}\n`
      this.body += body
    }
  }

  addCombAlways (
    io: {
      inputs?: Array<string | Sig>
      outputs: Array<string | Sig>
    },
    body: string
  ): void {
    for (const output of io.outputs) {
      const thisSig = this.findSignal(output, true, this.addCombAlways)
      switch (thisSig.type) {
        case undefined:
        case 'wire':
          thisSig.type = 'logic'
          break
        case 'reg':
        case 'logic':
          break
        default:
          throw Error(`${output.toString()} is unsupported signal type ${thisSig.type}`)
      }
    }
    let sensitivityList: string | null = null
    if (io.inputs) {
      for (const input of io.inputs) {
        this.findSignal(input, true, this.addCombAlways)
      }
      sensitivityList = `@( ${io.inputs.join(' or ')} )`
    }
    if (body.includes('always')) {
      const SenseMatch = body.replace(/\s+/g, ' ').includes(`${sensitivityList}`)
      if (SenseMatch) {
        this.body += body
      } else {
        throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`)
      }
    } else if (sensitivityList) {
      this.body += `always ${sensitivityList}\n`
      this.body += body
    } else {
      this.body += 'always_comb\n'
      this.body += body
    }
  }

  addLatchAlways (
    io: {
      inputs?: Array<string | Sig>
      outputs: Array<string | Sig>
    },
    body: string
  ): void {
    for (const output of io.outputs) {
      const thisSig = this.findSignal(output, true, this.addLatchAlways)
      switch (thisSig.type) {
        case undefined:
        case 'wire':
          thisSig.type = 'logic'
          break
        case 'reg':
        case 'logic':
          break
        default:
          throw Error(`${output.toString()} is unsupported signal type ${thisSig.type}`)
      }
    }
    let sensitivityList: string | null = null
    if (io.inputs) {
      for (const input of io.inputs) {
        this.findSignal(input, true, this.addLatchAlways)
      }
      sensitivityList = `@( ${io.inputs.join(' or ')} )`
    }
    if (body.includes('always')) {
      const SenseMatch = body.replace(/\s+/g, ' ').includes(`${sensitivityList}`)
      if (SenseMatch) {
        this.body += body
      } else {
        throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`)
      }
    } else if (sensitivityList) {
      this.body += `always ${sensitivityList}\n`
      this.body += body
    } else {
      this.body += 'always_latch\n'
      this.body += body
    }
  }

  protected addOperation (
    op: BinaryOp,
    io: OperationIO): Sig {
    const nameMap = {
      '*': {
        name: 'prod',
        autoWidth: (a: number, b: number) => { return a + b }
      },
      '-': {
        name: 'diff',
        autoWidth: (a: number, b: number) => { return Math.max(a, b) + 1 }
      },
      '+': {
        name: 'sum',
        autoWidth: (a: number, b: number) => { return Math.max(a, b) + 1 }
      },
      '&': {
        name: 'mask',
        autoWidth: (a: number, b: number) => { return Math.max(a, b) }
      },
      '|': {
        name: 'bitset',
        autoWidth: (a: number, b: number) => { return Math.max(a, b) }
      }
    }
    // An operand is a signal or a literal. `auto` is its part of an auto-sized result's name.
    interface Operand { expr: string, literal?: bigint, width: number, signed: boolean, auto: string }
    const operand = (x: string | Sig | bigint): Operand => {
      if (typeof x === 'bigint') {
        const width = Math.max(1, this.bitWidth(x))
        // The names of auto-sized results come from how literals used to be written; keep them.
        const auto = (x < 0n ? `-${width}'d${-x}` : `${width + 1}'d${x}`).replace('-', 'm').replace("'", '')
        return { expr: '', literal: x, width, signed: x < 0n, auto }
      }
      const sig = this.findSignal(x, true, this.addOperation, true)
      return { expr: x.toString(), width: Number(sig.width ?? 1), signed: sig.isSigned === true, auto: x.toString() }
    }
    const a = operand(io.a)
    const b = operand(io.b)
    const signed = a.signed || b.signed
    // In a signed operation an unsigned operand gains a zero sign bit (WIDTH-4), so a sum or
    // difference needs one more bit. A product doesn't: the unsigned operand is never negative.
    const signedWidth = (x: Operand): number => (signed && !x.signed && op !== BinaryOp.MULTIPLY) ? x.width + 1 : x.width
    const naturalWidth = nameMap[op].autoWidth(signedWidth(a), signedWidth(b))

    let result: string | Sig
    let width: number
    if (io.result !== undefined) {
      const resultSig = this.findSignal(io.result, true, this.addOperation, true)
      if (resultSig.isSigned === undefined) {
        resultSig.isSigned = signed
      }
      if (signed && (!(resultSig.isSigned))) throw Error(`${io.result.toString()} must be signed`)
      width = Number(resultSig.width ?? 1)
      if (width < naturalWidth) console.warn(`${io.result.toString()} truncated output`)
      result = io.result
    } else {
      result = `${nameMap[op].name}_${a.auto}x${b.auto}`
      width = naturalWidth
      this.signals[result] = { type: 'logic', isSigned: signed, width }
    }

    // Compute at the result's width: each operand cast to it (WIDTH-3), which keeps the low bits
    // of a narrower result, and each literal written at it with the operation's signedness (WIDTH-1).
    const term = (x: Operand): string => {
      if (x.literal !== undefined) {
        const mask = (1n << BigInt(width)) - 1n
        let v = x.literal & mask
        if (signed && v > (mask >> 1n)) v -= mask + 1n
        return `${v < 0n ? '-' : ''}${width}'${signed ? 's' : ''}d${v < 0n ? -v : v}`
      }
      const [expr, exprWidth] = (signed && !x.signed) ? [`$signed({1'b0, ${x.expr}})`, x.width + 1] : [x.expr, x.width]
      return exprWidth === width ? expr : `${width}'(${expr})`
    }
    this.body += `   assign ${result.toString()} = ${term(a)} ${op} ${term(b)};\n`
    if (typeof result === 'string') {
      return new Sig(result)
    }
    return result
  }

  /**
     * adds an arithmetic multiplier to the generated SystemVerilog module
     * @param io the input/output interface of the multiplier. `a` and `b` are signals or bigint
     * literals. If either is signed, or a negative literal, the product is signed, and an
     * unsigned signal is converted with `$signed({1'b0, x})`. Without `result`, the product is a
     * new signal as wide as both operands together, which holds every product. With `result`,
     * the product is computed at `result`'s width; a narrower `result` keeps the low bits, and
     * logs a warning.
     * @returns the product result
     */
  addMultiplier (io: OperationIO): Sig {
    return this.addOperation(BinaryOp.MULTIPLY, io)
  }

  /**
     * adds an arithmetic adder to the generated SystemVerilog module
     * @param io the input/output interface of the adder. `a` and `b` are signals or bigint
     * literals. If either is signed, or a negative literal, the sum is signed, and an unsigned
     * signal is converted with `$signed({1'b0, x})`, which adds a bit. Without `result`, the sum
     * is a new signal one bit wider than the wider operand, which holds every sum. With
     * `result`, the sum is computed at `result`'s width; a narrower `result` keeps the low bits,
     * and logs a warning.
     * @returns the sum result
     */
  addAdder (io: OperationIO): Sig {
    return this.addOperation(BinaryOp.ADD, io)
  }

  /**
     * adds an arithmetic subtractor to the generated SystemVerilog module
     * @param io the input/output interface of the subtractor: `a - b`. The widths and signedness
     * follow {@link Module.addAdder}.
     * @returns the difference result
     */
  addSubtractor (io: OperationIO): Sig {
    return this.addOperation(BinaryOp.SUBTRACT, io)
  }

  /**
     * add a constant literal signal to the generated SystemVerilog module
     * @param name signal name
     * @param value signal literal value. It's declared with a sized literal at the signal's width.
     * @param isSigned whether the signal is signed or not
     * @param width bit width of the resulting signal
     * @returns
     */
  addConstSignal (name: string | undefined, value: bigint, isSigned: boolean = false, width: number | undefined = undefined): Sig {
    const minWidth = this.bitWidth(value, isSigned)
    const resolvedWidth = (width === undefined) ? minWidth : width
    if (value < 0) isSigned = true
    if (resolvedWidth < minWidth) throw Error(`width:${resolvedWidth} is insufficient for value: ${value}`)
    if (name === undefined) {
      name = this.bigintToSigName(value, isSigned, resolvedWidth)
    }
    if (this.signals[name] === undefined) {
      this.signals[name] = { type: 'const logic', value, isSigned, width: resolvedWidth }
    }
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
  addConstSignals (name: string, values: bigint[], isSigned: boolean = false, width: number | undefined = undefined): Sig[] {
    const signalNames = [...Array(values.length).keys()].map((p: number) => { return `${name}_${p}` })
    const retVal: Sig[] = []
    signalNames.forEach((p, i) => {
      retVal.push(this.addConstSignal(p, values[i], isSigned || (values[i] < 0), width))
    })
    return retVal
  }

  /**
     * add a SystemVerilog continuous assign statement
     * @param io expression that is the right hand side of the assigment
     * @returns signal that is the left hand side of the assignment
     */
  addAssign (io: { in: Expr, out: string | Sig }): Sig {
    const outSig = this.findSignal(io.out, true, this.addAssign, true)
    if (outSig.type && (!(outSig.type === 'wire' || outSig.type === 'logic'))) {
      throw Error(`${io.out.toString()} signal must be either wire or logic in assign statement`)
    }
    this.body += `  assign ${io.out.toString()} = ${io.in.toString()};\n`
    if (typeof io.out === 'string') {
      return new Sig(io.out)
    }
    return io.out
  }

  /**
     * add a multiplexer to the TSSV module
     * @param io The input/output signals connected to the multiplexer. `in` needs at least two
     * entries, and `sel` picks one; a `sel` signal wider than it needs is sliced to its low bits.
     * A signal input narrower than `out` is extended to it, with the input's signedness; one wider
     * than `out` is an error. An `Expr` input is used as given. A `sel` value past the last input
     * gives `default`, or all X.
     * @returns signal of the multiplexer output
     */
  addMux (io: { in: Array<string | Sig | Expr>, sel: string | Sig | Expr, out: string | Sig, default?: string | Sig | Expr }): Sig {
    if (io.in.length < 2) throw Error(`addMux: ${io.out.toString()} needs at least 2 inputs, got ${io.in.length}`)
    const selWidth = Math.ceil(Math.log2(io.in.length))
    let selString = io.sel.toString()
    if ((typeof io.sel === 'string') || (io.sel.type === 'Sig')) {
      const selSig = this.findSignal(io.sel, true, this.addMux, true)
      if ((selSig.width || 1) < selWidth) throw Error(`${io.sel.toString()} signal does not have enough bits as Mux select, select signal width: ${selSig.width} is less than select width ${selWidth}`)
      if ((selSig.width || 1) > selWidth) {
        selString = `${io.sel.toString()}[${selWidth - 1}:0]`
      }
    }
    const outSig = this.findSignal(io.out, true, this.addMux, true)
    switch (outSig.type) {
      case undefined:
      case 'wire':
        outSig.type = 'logic'
        break
      case 'reg':
      case 'logic':
        break
      default:
        throw Error(`${io.out.toString()} is unsupported signal type ${outSig.type}`)
    }
    let defaultString = `{${outSig.width}{1'bx}}`
    if (io.default) {
      defaultString = io.default.toString()
    }
    const outWidth = Number(outSig.width ?? 1)
    let caseAssignments = ''
    let selIndex = 0
    for (const input of io.in) {
      let rhExpr = `${input.toString()}`
      // A signal input narrower than out is extended to it (WIDTH-3); a wider one is an error.
      // An Expr input's width isn't known, so it's used as given.
      if ((typeof input === 'string') || (input.type === 'Sig')) {
        const inSig = this.findSignal(input, false)
        const inWidth = Number(inSig?.width ?? 1)
        if (inSig !== undefined && inWidth > outWidth) {
          throw Error(`addMux: input ${input.toString()} is ${inWidth} bits, wider than ${io.out.toString()} (${outWidth} bits)`)
        }
        if (inSig !== undefined && inWidth < outWidth) rhExpr = `${outWidth}'(${rhExpr})`
      }
      caseAssignments += `      ${selWidth}'d${selIndex}: ${io.out.toString()} = ${rhExpr};\n`
      selIndex++
    }
    this.body +=
`  always_comb
    unique case(${selString})
${caseAssignments}
      default: ${io.out.toString()} = ${defaultString};
    endcase
`
    if (typeof io.out === 'string') {
      return new Sig(io.out)
    }
    return io.out
  }

  /**
   * Append a raw SystemVerilog snippet to this module's body.
   *
   * By default (`indentMode: 'relative'`), the snippet is normalized before
   * being appended:
   * - Leading and trailing blank lines are removed.
   * - The minimum indentation shared by all non-empty lines is stripped,
   *   so indentation is computed relative to the snippet's own left margin.
   * - Three spaces of indentation are added to every line so the result sits
   *   correctly inside the generated `module … endmodule` block.
   * - A single trailing newline is guaranteed.
   *
   * This makes it safe to pass indented template literals directly from
   * TypeScript without worrying about the surrounding indentation level.
   *
   * Pass `indentMode: 'verbatim'` to append the string exactly as-is, skipping
   * the indent stripping and re-indentation. The trim and newline options still
   * apply in verbatim mode.
   *
   * @param body - SystemVerilog text to append.
   * @param opts - Optional settings.
   * @param opts.indentMode - `'relative'` (default) strips and re-indents
   *   relative to the snippet's own minimum indent; `'verbatim'` appends
   *   without modifying indentation.
   * @param opts.trimLeadingBlankLines - Remove blank lines at the start of the
   *   snippet before processing. Defaults to `true`.
   * @param opts.trimTrailingBlankLines - Remove blank lines at the end of the
   *   snippet before processing. Defaults to `true`.
   * @param opts.ensureTrailingNewline - Guarantee the appended text ends with
   *   a newline. Defaults to `true`.
   */
  addBody (body: string, opts?: {
    indentMode?: 'relative' | 'verbatim'
    trimLeadingBlankLines?: boolean
    trimTrailingBlankLines?: boolean
    ensureTrailingNewline?: boolean
  }): void {
    const trimLeading = opts?.trimLeadingBlankLines ?? true
    const trimTrailing = opts?.trimTrailingBlankLines ?? true
    const ensureNewline = opts?.ensureTrailingNewline ?? true

    const lines = body.split('\n')

    if (trimLeading) while (lines.length > 0 && lines[0].trim() === '') lines.shift()
    if (trimTrailing) while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop()

    if (lines.length === 0) return

    if (opts?.indentMode === 'verbatim') {
      const result = lines.join('\n')
      this.body += ensureNewline && !result.endsWith('\n') ? result + '\n' : result
      return
    }

    // compute minimum left indent across non-empty lines
    const minIndent = lines
      .filter(line => line.trim() !== '')
      .reduce((min, line) => {
        const match = line.match(/^(\s*)/)
        return Math.min(min, match ? match[1].length : 0)
      }, Infinity)

    const indent = '   '
    const stripped = lines
      .map(line => line.trim() === '' ? '' : indent + line.slice(minIndent === Infinity ? 0 : minIndent))
      .join('\n')

    this.body += ensureNewline ? stripped + '\n' : stripped
  }

  /**
   * Append a single pre-formatted SystemVerilog line to this module's body.
   *
   * The line is appended verbatim with a trailing newline added. No indentation
   * normalization is performed — the caller is responsible for any leading
   * whitespace. Use {@link addBody} when passing multi-line template literals
   * that benefit from automatic indent stripping.
   *
   * @param line - A single line of SystemVerilog text (no trailing newline needed).
   */
  addBodyLine (line: string): void {
    this.body += line + '\n'
  }

  /**
     * print some debug information to the console
     */
  debug (): void {
    console.log(this.name)
    console.log(this.params)
    console.log(this.IOs)
    console.log(this.signals)
    console.log(this.body)
    console.log(this.registerBlocks)
  }

  /**
   * Convert a ParameterValue into a compact, readable string suitable for Verilog comments.
   * Deterministic ordering for objects/records.
   */
  protected formatParameterValue (v: ParameterValue): string {
    if (typeof v === 'bigint') return v.toString() + 'n'
    if (typeof v === 'string' || typeof v === 'number') return String(v)

    if (Array.isArray(v)) {
      return '[' + v.map((x) => this.formatParameterValue(x as ParameterValue)).join(', ') + ']'
    }

    if (typeof v === 'object' && v !== null) {
      const rec = v as Record<string, ParameterValue | undefined>
      const entries = Object.entries(rec)
        .filter((entry): entry is [string, ParameterValue] => entry[1] !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))

      // Nice-ish IntRange formatting if it looks like {min:number,max:number} or similar.
      const looksNumeric =
        entries.length > 0 && entries.every(([, val]) => typeof val === 'number')

      if (looksNumeric) {
        return '{' + entries.map(([k, val]) => `${k}:${val as number}`).join(', ') + '}'
      }

      return '{ ' + entries.map(([k, val]) => `${k}=${this.formatParameterValue(val)}`).join(', ') + ' }'
    }

    return String(v)
  }

  /**
   * Flatten parameters into `// key.path = value` lines.
   * Good for embedding at the top of generated Verilog.
   */
  protected formatParametersForComment (
    params: TSSVParameters = this.params,
    opts?: {
      prefix?: string
      skipName?: boolean
    }
  ): string {
    const lines: string[] = []
    const prefix = opts?.prefix ?? '// '
    const skipName = opts?.skipName ?? true

    const walk = (obj: Record<string, ParameterValue | undefined>, path: string[]): void => {
      const keys = Object.keys(obj).sort()
      for (const key of keys) {
        if (skipName && key === 'name') continue

        const val = obj[key]
        if (val === undefined) continue

        // Avoid recursing into arrays; those format inline.
        const isPlainObject =
          typeof val === 'object' && val !== null && !Array.isArray(val)

        if (isPlainObject) {
          walk(val as Record<string, ParameterValue | undefined>, [...path, key])
        } else {
          const fullPath = [...path, key].join('.')
          lines.push(`   ${prefix}${fullPath} = ${this.formatParameterValue(val)}`)
        }
      }
    }

    walk(params, [])
    return lines.join('\n')
  }

  /**
   * Convenience wrapper that emits a nice comment block.
   */
  protected formatParametersAsVerilogComment (params: TSSVParameters = this.params): string {
    const body = this.formatParametersForComment(params)
    if (!body.trim()) return ''
    return [
      '\n   // ------------------------------------------------------------------',
      '   // Parameters',
      '   // ------------------------------------------------------------------',
      body,
      '   // ------------------------------------------------------------------\n'
    ].join('\n')
  }

  /**
     * write the generated SystemVerilog code to a string
     * @param options controls emission across several files - see {@link SVEmitOptions}. Applies
     *   to a top-level call only; the recursion into submodules passes nothing.
     * @returns string containing the generated SystemVerilog code for this module
     */
  writeSystemVerilog (options?: SVEmitOptions): string {
    if (Module.svGenDepth === 0) {
      Module.printedInterfaces = {}
      Module.printedModules = {}
      if (options?.exclude !== undefined) {
        if (options.exclude.has(this.name)) {
          throw Error(
            `${this.name} is excluded from its own writeSystemVerilog() call, so this emission ` +
            'would define a module a previous one already defined')
        }
        // A name is either a module or an interface, never both, so seeding both sets keeps
        // the caller from having to tell them apart.
        for (const name of options.exclude) {
          Module.printedInterfaces[name] = true
          Module.printedModules[name] = true
        }
      }
      // Only submodules were ever recorded, never the module being emitted - so without this a
      // later emission excluding this one's output would still define this module a second time.
      Module.printedModules[this.name] = true
    }
    Module.svGenDepth++
    try {
      const sv = this._writeSystemVerilog()
      if (Module.svGenDepth === 1) {
        if (options?.defined !== undefined) {
          const excluded = options.exclude
          for (const name of Object.keys(Module.printedModules).concat(Object.keys(Module.printedInterfaces))) {
            if (excluded?.has(name) !== true) options.defined.add(name)
          }
        }
        if (Module.formatterConfig.engine !== 'off') {
          return this.applyFormatter(sv)
        }
      }
      return sv
    } finally {
      Module.svGenDepth--
    }
  }

  private applyFormatter (sv: string): string {
    if (Module.formatterConfig.engine === 'verible') {
      return runVerible(sv, Module.formatterConfig)
    }
    return sv
  }

  private _writeSystemVerilog (): string {
    // assemble TSSVParameters
    const paramsArray: string[] = []
    if (this.params) {
      // FIXME - need separate SV Verilog parameter container
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
    let paramsString = ''
    if (paramsArray.length > 0) {
      paramsString = `    #(${paramsArray.join(',\n    ')})`
    }

    // construct IO definition
    const IOArray: string[] = []
    const signalArray: string[] = []
    let interfacesString = ''
    Object.keys(this.IOs).forEach((key) => {
      let rangeString = ''
      const signString = (this.IOs[key].isSigned) ? ' signed' : ''
      if (this.IOs[key].isArray) throw Error(`${key}: Array IOs not supported`)
      if ((this.IOs[key].width || 0) > 1) {
        rangeString = `[${Number(this.IOs[key].width) - 1}:0]`
      }
      IOArray.push(`${attributePrefix(`${this.name}.${key}`, this.IOs[key].attributes)}${this.IOs[key].direction} ${this.IOs[key].type || 'logic'}${signString} ${rangeString} ${key}`)
    })
    Object.keys(this.interfaces).forEach((key) => {
      const thisInterface = this.interfaces[key]
      if (thisInterface.role) {
        if (thisInterface.modports) {
          const thisModports = thisInterface.modports[thisInterface.role]
          if (!thisModports) throw Error(`${thisInterface.name} : inconsistent modports`)
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
          if (!Module.printedInterfaces[thisInterface.interfaceName()]) {
            interfacesString += thisInterface.writeSystemVerilog()
            Module.printedInterfaces[thisInterface.interfaceName()] = true
          }
          IOArray.push(`${thisInterface.interfaceName()}.${thisInterface.role} ${key}`)
        } else {
          throw Error(`${thisInterface.name} has role/modport inconsistency`)
        }
      } else {
        signalArray.push(`${thisInterface.interfaceName()} ${key}()`)
      }
    })
    const IOString: string = `   ${IOArray.join(',\n   ')}`

    // construct signal list
    Object.keys(this.signals).forEach((key) => {
      const thisSignal = this.signals[key]
      if (thisSignal) {
        let rangeString = ''
        let arrayString = ''
        let valueString = ''
        const signString = (thisSignal.isSigned) ? ' signed' : ''
        if ((thisSignal.width || 0) > 1) {
          rangeString = `[${Number(thisSignal.width) - 1}:0]`
        }
        if (thisSignal.isArray && ((thisSignal.isArray || 0) > 1)) {
          arrayString = ` [0:${(thisSignal.isArray || 0n) - 1n}]`
        }
        if (thisSignal.type === 'const logic') {
          // a sized literal (WIDTH-1): a bare decimal is a 32-bit integer, and wider values go wrong
          const value = thisSignal.value ?? 0n
          if (typeof value === 'bigint') {
            const magnitude = value < 0n ? -value : value
            valueString = ` = ${value < 0n ? '-' : ''}${thisSignal.width ?? 1}'${thisSignal.isSigned ? 's' : ''}d${magnitude}`
          } else {
            valueString = ` = ${value.toString()}`
          }
        }
        signalArray.push(`${attributePrefix(`${this.name}.${key}`, thisSignal.attributes)}${thisSignal.type || 'logic'}${signString} ${rangeString} ${key}${arrayString}${valueString}`)
      }
    })
    let signalString: string = `   ${signalArray.join(';\n   ')}`
    if (signalArray.length > 0) signalString += ';'

    let generatedBody = ''
    for (const sensitivity in this.registerBlocks) {
      for (const resetCondition in this.registerBlocks[sensitivity]) {
        for (const enable in this.registerBlocks[sensitivity][resetCondition]) {
          const regs = this.registerBlocks[sensitivity][resetCondition][enable]
          let resetString = '   '
          if (resetCondition !== '#NONE#') {
            const resetAssignments: string[] = []
            Object.keys(regs).forEach((key) => {
              const reg = regs[key]
              // console.log(reg)
              const resetVal = reg.resetVal ?? 0n
              const resetLiteral = resetVal < 0n ? `-'d${-resetVal}` : `'d${resetVal}`
              resetAssignments.push(`           ${key} <= ${resetLiteral};`)
            })
            resetString =
`     if(${resetCondition})
        begin
${resetAssignments.join('\n')}
        end
      else `
          }

          const enableString = (enable === '#NONE#') ? '' : `if(${enable})`

          const functionalAssigments: string[] = []
          Object.keys(regs).forEach((key) => {
            const reg = regs[key]
            // console.log(reg)
            functionalAssigments.push(`           ${key} <= ${reg.d};`)
          })

          generatedBody +=
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

    let subModulesString = ''
    for (const moduleInstance in this.submodules) {
      const thisSubmodule = this.submodules[moduleInstance]
      let paramsBind = ''
      if (!Module.printedModules[thisSubmodule.module.name]) {
        Module.printedModules[thisSubmodule.module.name] = true
        subModulesString += thisSubmodule.module.writeSystemVerilog()
      }
      const bindingsArray: string[] = []
      for (const binding in thisSubmodule.bindings) {
        bindingsArray.push(`        .${binding}(${thisSubmodule.bindings[binding].toString()})`)
      }
      const vParamsArray: string[] = []
      for (const p in thisSubmodule.module.verilogParams) {
        let pString
        if ((typeof thisSubmodule.module.params[p] === 'number') ||
            (typeof thisSubmodule.module.params[p] === 'bigint')) {
          pString = thisSubmodule.module.params[p]?.toString()
        } else if (typeof thisSubmodule.module.params[p] === 'string') {
          pString = `"${thisSubmodule.module.params[p]?.toString()}"`
        }
        if (pString !== undefined) {
          vParamsArray.push(`.${p}(${pString})`)
        }
      }
      if (vParamsArray.length > 0) {
        paramsBind = `#(${vParamsArray.join(',')}) `
      }
      generatedBody +=
`
    ${thisSubmodule.module.name} ${paramsBind}${moduleInstance}
      (
${bindingsArray.join(',\n')}
      );
`
    }

    // returns s with a guaranteed trailing newline, or '' if s is blank
    const opt = (s: string): string => {
      if (!s.trim()) return ''
      return s.endsWith('\n') ? s : s + '\n'
    }

    const verilog: string =
`${opt(interfacesString)}${opt(subModulesString)}/* verilator lint_off WIDTH */
module ${this.name} ${paramsString}
   (
${IOString}
   );
${opt(this.formatParametersAsVerilogComment(this.params))}${opt(signalString)}
${opt(this.body)}${opt(generatedBody)}
endmodule
/* verilator lint_on WIDTH */
`

    return verilog
  }

  protected body: string
  protected registerBlocks: Record<string, Record<string, Record<string, Record<string, { d: string, resetVal?: bigint }>>>> = {}

  protected static printedInterfaces: Record<string, boolean> = {}
  private static printedModules: Record<string, boolean> = {}
  private static svGenDepth = 0

  protected verilogParams: Record<string, boolean>
}

export function serialize (obj: any, indent?: number, bigIntSuffix = 'n'): string {
  const serialized = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'bigint') {
      return `0x${value.toString(16)}${bigIntSuffix}`
    }
    return value
  }, indent)
  return serialized
}

export function deserialize (serialized: string): any {
  const revived = JSON.parse(serialized, (key, value) => {
    const hexPattern = /^0x[0-9a-fA-F]+n$/
    if (typeof value === 'string' && hexPattern.test(value)) {
      return BigInt(value.slice(0, -1))
    }
    return value
  })
  return revived
}

export default { Module, Sig, Expr }

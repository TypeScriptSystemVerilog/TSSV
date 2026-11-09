/** @module Base */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, join } from 'path'
import { type SVModuleHeader, parseSVModules, selectSVModule } from './SVModuleHeader.js'
import { expandSVFileList, guardSVImport, importGuard } from './SVFileList.js'
import { type ModuleTable, checkModule } from './ModuleCheck.js'
import { type ContractManifest, type ModulePorts, type PortContract, contractText, resolveContract, wrapperSV } from './PortContract.js'
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

/** A value a module parameter can take: an entry of {@link TSSVParameters} */
export type ParameterValue =
  string | boolean | bigint | IntRange<number, number> | bigint[] | string[] |
  Array<IntRange<number, number>> |
  object

/**
 * A module's parameters, the first argument of {@link Module}'s constructor. Each module class
 * extends it with its own keys.
 */
export interface TSSVParameters {
  /**
   * the SystemVerilog module name. Without it, the name is derived from the class name and the
   * other parameters' values (`doc/framework/concepts.md` §2); the constructor then sets it
   */
  name?: string | undefined
  [name: string]: ParameterValue | undefined
}

/** A SystemVerilog enum type for a signal of type `'enum'`: its type name, width and values */
export interface SVEnum {
  /** the enum's type name */
  typeName: string
  /** the width of the enum's base type, in bits */
  width: number
  /** each enumerator's name and value */
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
 * signal parameters, shared by {@link Signal} and {@link IOSignal}
 */
export interface baseSignal {
  /** the declaration's SystemVerilog type; default `'logic'`. `'const logic'` is a constant's, set by {@link Module.addConstSignal} */
  type?: 'wire' | 'reg' | 'const logic' | 'logic' | 'enum'
  /** the width in bits; default 1. A width over 1 is declared `[width-1:0]` */
  width?: number
  /**
   * marks a clock and its active edge. {@link Module.addRegister} and
   * {@link Module.addSequentialAlways} need it on their `clk`
   */
  isClock?: 'posedge' | 'negedge'
  /**
   * marks a reset: its active level, and whether it is asynchronous (in the `always_ff` event
   * control) or synchronous. The builders that take a `reset` read its polarity from here
   */
  isReset?: 'lowasync' | 'highasync' | 'lowsync' | 'highsync'
  /** declares the signal `signed` */
  isSigned?: boolean
  /** makes an internal signal an unpacked array of this many entries, `name [0:N-1]`. Ports can't be arrays */
  isArray?: bigint
  /** a description of the signal for readers and tools; the core doesn't emit it */
  description?: string
  /** the enum type of a signal of type `'enum'`; the core doesn't emit it */
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

/**
 * Wraps one generated module's or interface's SV in the include guard that
 * `writeSystemVerilogFiles()` writes, with a `` `include `` of each file in `includes` for
 * `USE_INCLUDES` builds. Only generated SV gets this guard: an imported file gets its own
 * `SVIMPORT__` guard instead (`guardSVImport()`).
 * @param name the module or interface name; the guard macro is `DEF__<name>__`
 * @param includes the names of the files to include, with their extensions
 * @param sv the definition
 * @returns the contents of `<name>.sv`
 */
function guardSVFile (name: string, includes: string[], sv: string): string {
  const guard = `DEF__${name}__`
  const includeBlock = includes.length === 0
    ? ''
    : ['`ifdef USE_INCLUDES', ...includes.map(i => `\`include "${i}"`), '`endif //USE_INCLUDES', ''].join('\n')
  // Drop the blank lines at the start (one or more runs of whitespace ending in a newline), so
  // the definition starts right after the guard, and the whitespace at the end
  const body = sv.replace(/^(\s*\n)+/, '').trimEnd()
  return `\`ifndef ${guard}\n\`define ${guard}\n${includeBlock}\n${body}\n\n\`endif //!${guard}\n`
}

/** The direction of a port, or of an interface signal in a modport */
export type PortDirection = 'input' | 'output' | 'inout'

/**
 * defines an IO signal (a.k.a port of the the TSSV module)
 */
export interface IOSignal extends baseSignal {
  /** the port's direction, seen from inside the module */
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
  /** the module to instantiate, which one of the files must declare. Required: it's never inferred */
  moduleName: string
}

/**
 * container class of a TSSV signal used to pass signals
 * among add* primtives and submodules to define interconnections
 *
 * @remarks
 * A `Sig` holds only a name: width and metadata live in the module's `IOs` and `signals`
 * tables, and two `Sig`s with the same name are the same signal. A builder takes a plain string
 * wherever it takes a `Sig`, and most return one, to pass to the next call
 * (`doc/framework/concepts.md` §3).
 */
export class Sig {
  /** @param name the signal's name in the module */
  constructor (name: string) {
    this.name = name
    this.type = 'Sig'
  }

  /** @returns the signal's name, so a `Sig` can go in a template string */
  toString = (): string => {
    return this.name
  }

  /** @internal */
  protected name: string
  /** always `'Sig'`: tells a `Sig` from an `Expr` */
  readonly type: 'Sig'
}

/** The parameters of an {@link Expr} built from a function: the function's argument */
export type ExprParams = Record<string, string | number | bigint>
/**
 * container class of a TSSV expression, or a RHS assignment in the
 * generated output
 */
export class Expr {
  /**
   * @param def the expression's SystemVerilog text, or a function that returns it from `params`
   * @param params the argument `def` is called with, when `def` is a function; default `{}`
   * @throws if `params` is given with a string `def`
   */
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

  /** @returns the expression's SystemVerilog text: `def`, or `def(params)` */
  toString = (): string => {
    if (this.text) {
      return this.text
    } else if (this.func) {
      return this.func(this.params || {})
    }
    return ''
  }

  /** the argument a function `def` is called with; `null` for a string `def` */
  params: ExprParams | null
  /** @internal */
  protected text: string | null
  /** @internal */
  protected func: ((p: ExprParams) => string) | null
  /** always `'Expr'`: tells an `Expr` from a `Sig` */
  readonly type: 'Expr'
}

/** An internal signal of a module: the second argument of {@link Module.addSignal} */
export interface Signal extends baseSignal {
  /** a constant's value, set by {@link Module.addConstSignal} and {@link Module.addConstSignals} */
  value?: bigint | bigint[]
}

/** A module's internal signals, by name */
export type Signals = Record<string, Signal | undefined>

/** The `io` of {@link Module.addAdder}, {@link Module.addSubtractor} and {@link Module.addMultiplier} */
export interface OperationIO {
  /** the first operand: a signal, or a literal written at its own width */
  a: string | Sig | bigint
  /** the second operand: a signal, or a literal written at its own width */
  b: string | Sig | bigint
  /**
   * the output, an existing signal or port; the operation is computed at its width. Default: a
   * new signal sized to hold every result, named `prod_<a>x<b>`, `sum_<a>x<b>` or `diff_<a>x<b>`
   */
  result?: string | Sig
}

/** The `io` of {@link Module.addMux}: the inputs, the select, the output and the default */
export interface MuxIO {
  /**
   * the inputs, at least two: input `i` is selected when `sel` is `i`. A signal input narrower
   * than `out` is extended to it, with the input's signedness; one wider than `out` is an error.
   * An `Expr` input is used as given
   */
  in: Array<string | Sig | Expr>
  /**
   * the select. A signal needs at least `ceil(log2(in.length))` bits; a wider one is sliced to
   * its low bits. An `Expr` is used as given
   */
  sel: string | Sig | Expr
  /** the output, an existing signal or port. A `wire` or untyped one becomes `logic` */
  out: string | Sig
  /** what `out` takes for a `sel` past the last input; default all X */
  default?: string | Sig | Expr
}

/** The `io` of {@link Module.addRegister}: the register's inputs, its output, and its reset value */
export interface RegisterIO {
  /** the D input: a signal, or an expression. With an expression, `q` is required */
  d: string | Sig | Expr
  /** the clock; it must carry `isClock` metadata, whose edge the register uses */
  clk: string | Sig
  /**
   * the reset; it must carry `isReset` metadata, which gives its polarity and whether it is
   * asynchronous. Without it, the register has no reset
   */
  reset?: string | Sig
  /**
   * the value `q` takes on reset; default 0, written as `'0`. Any other value is written as a
   * literal sized to `q`. It must be a bigint constant (SV guide SEQ-6)
   */
  resetVal?: bigint
  /** the clock enable: `q` loads `d` only while it is high. Without it, `q` loads `d` on every clock edge */
  en?: string | Sig | Expr
  /**
   * the Q output, an existing signal or port. Default: a new internal signal `<d>_q` with `d`'s
   * width, signedness and other metadata, except its attributes
   */
  q?: string | Sig
}

/** How {@link Module.writeSystemVerilogFiles} formats the SV it writes: {@link Module.setFormatterConfig} */
export interface FormatterConfig {
  /** `'verible'` runs `verible-verilog-format`; `'internal'` and `'off'` leave the text as generated */
  engine: 'verible' | 'internal' | 'off'
  /** the formatter binary; default `verible-verilog-format` on `PATH` */
  veriblePath?: string
  /** extra command-line flags for the formatter */
  veribleFlags?: string[]
  /**
   * on a formatter failure (Verible missing, a timeout, a crash, or a syntax error), throw rather
   * than warn and return the text unformatted. It covers only the formatter: a syntax error in a
   * module fails the check `writeSystemVerilogFiles()` runs on that module first, whatever this
   * says.
   */
  failOnFormatError?: boolean
  /** how long the formatter may run on one file, in milliseconds; default 60000 */
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
  /** the interface's base name; {@link Interface.interfaceName} appends the parameter values */
  name: string
  /** the parameters; their values name the SV interface type */
  params: TSSVParameters
  /** the bundle's signals, by name */
  signals: Signals
  /**
   * the modport a module sees, which makes the instance a port of that module. An instance
   * without a role is a local bundle: a signal of the module, not a port
   */
  role?: string
  /** each modport's signals and their directions, by modport name */
  modports?: Record<string, Record<string, PortDirection>>
  /**
   * @param name the base name of the SV interface type
   * @param params the parameters, whose values are appended to `name` to name the type
   * @param role the modport the module sees; omit it for a local bundle
   * @param signals the bundle's signals
   */
  constructor (name: string, params: TSSVParameters = {}, role: string | undefined = undefined, signals = {}) {
    this.name = name
    this.params = params
    this.role = role
    this.signals = signals
  }

  /**
   * The SV interface type's name: `name`, then each parameter value, joined with `_`. Two
   * instances bind only if their names match, so two `Memory` instances with different
   * `DATA_WIDTH`s are different types.
   * @returns the SV interface type's name, e.g. `memory_bidi_32_32`
   */
  interfaceName (): string {
    const vName = `${this.name}_${Object.values(this.params).join('_')}`
    return vName
  }
}

/**
 * The definition of `intf`'s interface, `interface <interfaceName()>; ... endinterface`,
 * unformatted. Internal to emission: `Module.writeSystemVerilogFiles()` writes it to the
 * interface's own file.
 */
function interfaceSystemVerilog (intf: Interface): string {
  const signalArray: string[] = []
  Object.keys(intf.signals).forEach((key) => {
    const thisSignal = intf.signals[key]
    if (thisSignal) {
      if (Object.keys(thisSignal.attributes ?? {}).length > 0) {
        throw Error(`${intf.name}.${key}: attributes are not supported on interface signals`)
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
  for (const modport in intf.modports) {
    const thisModport = intf.modports[modport]
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
interface ${intf.interfaceName()};

${signalString};

${modportsString}

endinterface
        
`

  return verilog
}

/** A module's interface instances, by instance name */
export type Interfaces = Record<string, Interface>

/**
 * A parameter value as canonical JSON, the text a derived module name hashes. Object keys are
 * sorted by plain string comparison, so key order doesn't matter. Bigints are written as integers,
 * so `8n` and `8` match and neither matches `'8'`. `undefined` is dropped from objects and written
 * as `null` in arrays, as JSON does, and a number JSON can't write (`NaN`, `Infinity`) as its text.
 */
function canonicalJSON (value: unknown): string {
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'number' && !Number.isFinite(value)) return String(value)
  if (Array.isArray(value)) {
    return '[' + value.map((v) => (v === undefined ? 'null' : canonicalJSON(v))).join(',') + ']'
  }
  if (typeof value === 'object' && value !== null) {
    const rec = value as Record<string, unknown>
    const keys = Object.keys(rec).filter((key) => rec[key] !== undefined).sort()
    return '{' + keys.map((key) => JSON.stringify(key) + ':' + canonicalJSON(rec[key])).join(',') + '}'
  }
  return JSON.stringify(value) ?? 'null'
}

/**
* The Module class is the base class for all TSSV modules.
*
* @remarks
* A module class extends `Module`, calls `super(params, IOs?, signals?, body?)` in its
* constructor, then describes its logic with the `add*()` builders below. Each builder checks
* its arguments and records the result; {@link Module.writeSystemVerilogFiles} emits the SV
* (`doc/framework/concepts.md` §1).
*/
export class Module<P extends TSSVParameters = TSSVParameters, IO extends IOSignals = IOSignals> {
  /**
    * name contains the resulting SystemVerilog module name: `params.name` if it is set, otherwise
    * one derived from the class name and the parameter values (`doc/framework/concepts.md` §2)
    */
  readonly name: string

  /** the module's parameters, as passed to the constructor, with `name` set to the module name */
  protected params: P
  /** the module's plain ports, by name. A subclass may assign it in its constructor, after `super()` */
  protected IOs: IO
  /** @internal */
  protected static formatterConfig: FormatterConfig = { engine: 'verible', failOnFormatError: true }
  /** @internal */
  protected signals: Signals
  /** the submodule instances {@link Module.addSubmodule} added, by instance name */
  protected submodules: Record<string, {
    /** the instantiated module */
    module: Module
    /** what each of the submodule's ports is bound to, by port name */
    bindings: Record<string, string | Sig | bigint>
  }>

  /** the interface instances {@link Module.addInterface} added, by instance name: its interface ports and local bundles */
  protected interfaces: Interfaces

  // The port contracts declared on this module, in the order declared
  private readonly contracts: PortContract[] = []

  /**
     * base constructor
     * @param params parameter value bundle. Without a `name`, the module name is `<ClassName>_`
     * followed by one segment per other key, sorted by key (`doc/framework/concepts.md` §2)
     * @param IOs IO port bundle
     * @param signals signal bundle: internal signals declared up front
     * @param body SystemVerilog body text, emitted verbatim in the module body
     */
  constructor (params: P = {} as P, IOs: IO = {} as IO, signals = {}, body = '') {
    this.params = params
    if (typeof params.name === 'string') {
      this.name = params.name
    } else {
      // Every key but name, in plain string order, so the key order of params doesn't matter
      const keys = Object.keys(params).filter((key) => key !== 'name').sort()
      this.name = this.constructor.name + '_' + keys.map((key) => this.nameSegment(params[key])).join('_')
    }
    this.params.name = this.name
    this.IOs = IOs
    this.signals = signals
    this.body = body
    this.submodules = {}
    this.interfaces = {}
    this.verilogParams = {}
  }

  /**
   * Marks a parameter to be passed as a SystemVerilog parameter override, `#(.P(value))`, wherever
   * this module is instantiated.
   *
   * @remarks
   * TSSV modules resolve their own parameters during elaboration and declare no SV `parameter`s,
   * so this only makes sense for a module imported with
   * {@link Module.addSystemVerilogSubmodule}, which does declare it. A string value is passed
   * quoted (`doc/framework/concepts.md` §2, "SystemVerilog parameters").
   * @param param the name of a key of {@link Module.params}
   * @throws `<param> does not exist!` if the parameter is missing or falsy (`0`, `''` and
   * `false` included)
   * @throws `unsupported type of parameter <param> in setVerilogParameter()` if its value isn't a
   * string, number or bigint
   * @group Output and utilities
   */
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

  /**
   * Sets how {@link Module.writeSystemVerilogFiles} formats the SV it writes, for every module.
   * The default runs Verible and throws if it fails: `{ engine: 'verible', failOnFormatError: true }`.
   * @param config the formatter configuration; it replaces the whole previous one
   * @group Output and utilities
   */
  static setFormatterConfig (config: FormatterConfig): void {
    Module.formatterConfig = config
  }

  /** @internal */
  protected bindingRules = {
    input: ['input', 'wire', 'reg', 'const logic', 'logic', 'enum'],
    output: ['output', 'wire', 'logic', 'enum'],
    inout: ['inout', 'wire']
  }

  /**
     * adds an interface signal bundle
     *
     * @remarks
     * An instance with a role is an interface port: the module header gets
     * `<interfaceName()>.<role> <instanceName>`. One without a role is a local bundle, declared
     * in the module as `<interfaceName()> <instanceName> ()`, for connecting two submodules
     * (`doc/framework/concepts.md` §4). Logic refers to a member as `<instanceName>.<SIGNAL>`.
     * @param instanceName the name for this instance of the signal bundle
     * @param _interface the type of interface to add
     * @returns the resulting interface for connecting to modules and add* primitives
     * @throws `<instanceName> interface already exists` if the module already has an interface of that name
     * @example An inward Memory port
     * {@includeCode ../../doc-examples/core/addInterface.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addInterface/InterfaceExample.sv}
     * @group Signals and ports
     */
  addInterface (
    instanceName: string,
    _interface: Interface): Interface {
    if (this.interfaces[instanceName]) throw Error(`${instanceName} interface already exists`)
    this.interfaces[instanceName] = _interface
    return _interface
  }

  /**
   * This module's ports as seen from outside: its plain ports, in declaration order, then each
   * interface port with the signals of its modport, in the modport's order. A local interface
   * bundle (one without a role) is not a port. Wrappers that bring every port out, such as a
   * port contract's and the tests' lint wrappers (`ts/test/models/lintWrapper.ts`), are built from it.
   * @returns the ports, each with its direction, width and signedness
   * @throws `<module>.<port>: no modport <role>` if an interface port's role names no modport
   * @group Signals and ports
   */
  ports (): ModulePorts {
    const plain = Object.entries(this.IOs).map(([name, io]) =>
      ({ name, direction: io.direction, width: Number(io.width ?? 1), isSigned: io.isSigned === true }))
    const interfaces: ModulePorts['interfaces'] = []
    for (const [port, intf] of Object.entries(this.interfaces)) {
      if (intf.role === undefined) continue // a local bundle, not a port
      const modport = intf.modports?.[intf.role]
      if (modport === undefined) throw Error(`${this.name}.${port}: no modport ${intf.role}`)
      interfaces.push({
        port,
        type: intf.interfaceName(),
        signals: Object.entries(modport).map(([name, direction]) =>
          ({ name, direction, width: Number(intf.signals[name]?.width ?? 1), isSigned: intf.signals[name]?.isSigned === true }))
      })
    }
    return { plain, interfaces }
  }

  /**
   * Promises that this module has no combinational path from input bit `from` to output bit
   * `to`: every path between them goes through a flop. scripts/check-port-contracts.mjs checks it
   * on every configuration a test generates, by tying `to` back into `from` in a wrapper and
   * linting it with Verilator, which reports any path as a combinational loop
   * (doc/framework/concepts.md, "Port contracts"). Declare it once the ports exist. The module's
   * SV names its contracts in a comment block after the Parameters block.
   *
   * Each endpoint names one bit: a one-bit port (`'in_ready'`), a one-bit signal of an interface
   * port (`'in.ready'`), or one bit of a wider one (`'ready_bus[2]'`, `'out.ready_bus[2]'`). A
   * promise about a whole vector is one contract per bit.
   *
   * {@link Module.writeSystemVerilogFiles} also writes `<outDir>/<name>.contracts.json` for a
   * module with contracts, holding the wrappers the check lints.
   * @param from one bit of an input
   * @param to one bit of an output
   * @throws `<module>: no combinational path from <from> to <to>: <problem>` if `from` isn't one
   * bit of an input or `to` one bit of an output: an endpoint that doesn't parse, a missing port,
   * interface port or signal, the wrong direction, a wide signal without `[i]`, a one-bit signal
   * with one, or a bit out of range
   * @throws `<module>: no combinational path from <from> to <to> is already declared` for a
   * contract declared twice
   * @throws `<module>.<port>: no modport <role>` if an interface port's role names no modport
   * @example A registered valid
   * {@includeCode ../../doc-examples/core/addNoCombinationalPathContract.ts#example}
   *
   * The SystemVerilog it emits:
   *
   * {@includeCode ../../../doc/examples/core/addNoCombinationalPathContract/ContractExample.sv}
   * @group Signals and ports
   */
  addNoCombinationalPathContract (from: string, to: string): void {
    const contract = { from, to }
    resolveContract(this.name, this.ports(), contract)
    if (this.contracts.some(c => c.from === from && c.to === to)) {
      throw Error(`${this.name}: ${contractText(contract)} is already declared`)
    }
    this.contracts.push(contract)
  }

  /**
   * The port contracts this module declares, in the order declared, as copies
   * @group Signals and ports
   */
  get portContracts (): readonly PortContract[] {
    return this.contracts.map(c => ({ ...c }))
  }

  /**
   * The `<name>.contracts.json` that writeSystemVerilogFiles() writes for a module with port
   * contracts: a wrapper of every port left open, and one per contract with its loop closed.
   */
  private contractManifest (): ContractManifest {
    const ports = this.ports()
    const header = (what: string): string => `// ${what}\n// Generated by writeSystemVerilogFiles() for scripts/check-port-contracts.mjs`
    const wrapper = (top: string, sv: string): { top: string, sv: string } => ({ top, sv: guardSVFile(top, [`${this.name}.sv`], sv) })
    const openTop = `${this.name}__contract_open`
    return {
      module: this.name,
      open: wrapper(openTop, wrapperSV(this.name, ports, openTop, header(`${this.name} with every port brought out and no contract closed`))),
      contracts: this.contracts.map((c, k) => {
        const top = `${this.name}__contract_${k}`
        const text = contractText(c)
        return { contract: text, ...wrapper(top, wrapperSV(this.name, ports, top, header(`${this.name} with the loop of its port contract closed: ${text}`), resolveContract(this.name, ports, c))) }
      })
    }
  }

  /**
     * instantiate another module as a submodule
     *
     * @remarks
     * Each binding connects a submodule port to a parent signal or port (a string or `Sig`,
     * `inst.SIGNAL` included), to a bigint constant, which becomes a `const logic` signal of the
     * port's width, or, for an interface port, to a parent interface instance. Every binding is
     * checked here:
     *
     * - A signed signal binds only to a signed port. An unsigned signal on a signed port needs
     *   a port one bit wider than the signal.
     * - Widths must match, unless `autoWidthExtension` extends a narrower signal on an input.
     * - The signal's `type` must suit the port's direction: an input takes an input, `wire`,
     *   `reg`, `const logic`, `logic` or `enum`; an output an output, `wire`, `logic` or `enum`;
     *   an inout an inout or `wire`.
     * - An interface port binds to a parent interface of the same SV type
     *   ({@link Interface.interfaceName}). If the parent's instance has a role (it is a port),
     *   the roles must match; a role-less local bundle binds to any role.
     *
     * With `autoBind`, an unbound output that matches nothing in the parent is left unconnected.
     * Without it, unbound ports aren't looked at. `doc/framework/concepts.md` §5 has the details.
     * @param instanceName sets the instance name
     * @param submodule the module to instantiate
     * @param bindings define the connections of the submodule: a port name to a parent signal,
     * a bigint constant, or a parent interface instance's name
     * @param autoBind find signals in parent with matching name for signals that are not explicitly bound:
     * each unbound port, and each unbound interface port, binds to the parent's port, signal or
     * interface of the same name
     * @param createMissing with `autoBind`, an unbound port that matches nothing in the parent
     * gets a new internal signal of the port's width and metadata, and an unbound interface port
     * a new role-less local bundle. It never adds a parent port: to bring a submodule's bus out,
     * give the parent a port of the same interface type and bind to it
     * @param autoWidthExtension extend a signal narrower than the input port it is bound to,
     * instead of throwing: a new signal `ext_w<bits><s|u>_<signal>`, assigned the signal sign
     * extended if it is signed and zero extended if not, binds to the port. Outputs aren't extended
     * @returns returns the resulting submodule instance
     * @throws `submodule with instance name <instanceName> already exists`
     * @throws `unbound input on <submodule>: <port>` or `unbound interface on <submodule>: <port>`
     * when `autoBind` finds no match and `createMissing` is false
     * @throws `<port> not found on module <submodule>` for a binding to a port the submodule doesn't have
     * @throws `<signal> signal not found in addSubmodule()` for a binding to a signal the parent
     * doesn't have, or `<signal> array signal used as normal signal in addSubmodule()` for an array
     * @throws `Error: signed signals can only be connected to signed ports, ...`
     * @throws `Error: binding signal is too wide for port, ...`, or `Error: binding signal width mismatch, ...`
     * for a width that doesn't fit the port
     * @throws `illegal binding <port>(<signal>)` for a signal type the port's direction doesn't take
     * @throws `<port>: interface '<name>' not found in <parent>`,
     * `<port> interface type mismatch on <submodule>: <parent type> vs <child type>`, or
     * `<port> interface role mismatch on <submodule>` for an interface binding that fails its checks
     * @throws `width:<width> is insufficient for value: <value>` for a bigint binding too wide for its port
     * @example Two instances of one module, chained
     * {@includeCode ../../doc-examples/core/addSubmodule.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addSubmodule/SubmoduleExample.sv}
     * @group Hierarchy
     */
  addSubmodule (
    instanceName: string,
    submodule: Module,
    bindings: Record<string, string | Sig | bigint>,
    autoBind: boolean = true,
    createMissing: boolean = false,
    autoWidthExtension: boolean = false): Module {
    if (this.submodules[instanceName] !== undefined) throw Error(`submodule with instance name ${instanceName} already exists`)
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
   * instantiate a module from existing SystemVerilog files.  The module name and the
   * direction of each bound port are taken from the module's header.
   *
   * `SVFilePath` is a path or a list of paths, each an SV file or a `.f` filelist that names
   * more files (see `expandSVFileList()` in `SVFileList.ts` for the rules). Environment variables in
   * a path, written `$NAME` or `${NAME}`, are expanded, and the path must then be absolute:
   * `$TSSV_ROOT/ts/test/leaf.sv`, not `ts/test/leaf.sv`. A path in a `.f` may be relative to the
   * `.f` file's directory.
   *
   * `options.moduleName` names the module to instantiate, which one of the files must declare.
   * It is required, and never inferred from the files or their names.
   *
   * The files themselves are emitted untouched. `writeSystemVerilogFiles()` writes each one once,
   * to a file of its own name, inside the include guard
   * `` `ifndef SVIMPORT__<file name without extension>__ ``, so SV that reaches a file more than
   * once, from two imports or from two emitted files compiled together, defines what it holds
   * once.
   * @param instanceName the name of the instance
   * @param SVFilePath the SystemVerilog files, and `.f` filelists naming them
   * @param params SV parameter overrides for the instance
   * @param bindings map of submodule port name to parent signal
   * @param autoBind automatically bind unbound ports to same-named parent signals
   * @param options `moduleName`, the module to instantiate
   * @returns the imported submodule
   * @throws `addSystemVerilogSubmodule('<instanceName>'): options.moduleName is required, ...` if
   * `options.moduleName` is missing or empty
   * @throws if a path names an unset environment variable, is relative, or names no file, or a
   * `.f` holds a simulator option or reads itself ({@link SVFileList.expandSVFileList})
   * @throws `<file>: SystemVerilog syntax error at line <l>, column <c> near '<text>'` for a file
   * that doesn't parse
   * @throws `module <moduleName> not found in <files>, which declare ...` if no file declares the module
   * @throws `<port> is not a port of module <module> in <file>` for a binding to a port the module
   * doesn't have, or `<kind> port <port> of module <module> is not supported by addSystemVerilogSubmodule`
   * for an `interface` or `ref` port
   * @throws `<param> does not exist!` for a falsy entry of `params` ({@link Module.setVerilogParameter})
   * @throws whatever {@link Module.addSubmodule} throws for the instance and its bindings
   * @example An existing SV adder, with its width set
   * {@includeCode ../../doc-examples/core/addSystemVerilogSubmodule.ts#example}
   *
   * The SystemVerilog it emits, next to an untouched copy of `sat_add.sv`:
   *
   * {@includeCode ../../../doc/examples/core/addSystemVerilogSubmodule/SVImportExample.sv}
   * @group Hierarchy
   */
  addSystemVerilogSubmodule (
    instanceName: string,
    SVFilePath: string | readonly string[],
    params: TSSVParameters,
    bindings: Record<string, string | Sig>,
    autoBind: boolean,
    options: SVImportOptions): Module {
    // A JavaScript caller can leave it out, whatever the type says
    const moduleName = (options as SVImportOptions | undefined)?.moduleName
    if (typeof moduleName !== 'string' || moduleName === '') {
      throw Error(`addSystemVerilogSubmodule('${instanceName}'): options.moduleName is required, the module to instantiate`)
    }
    const sources = expandSVFileList(SVFilePath, 'SVFilePath').map(path => ({ path, text: readFileSync(path, 'utf8') }))
    // Each file is parsed on its own, so a syntax error names its file
    const fileOf = new Map<SVModuleHeader, string>()
    for (const { path, text } of sources) {
      let headers: SVModuleHeader[]
      try {
        headers = parseSVModules(text)
      } catch (e) {
        throw Error(`${path}: ${(e as Error).message}`)
      }
      for (const h of headers) fileOf.set(h, path)
    }
    const header = selectSVModule([...fileOf.keys()], sources.map(s => s.path), moduleName)
    const vIOs: IOSignals = {}
    for (const port in bindings) {
      const kind = header.ports[port]
      if (kind === undefined) throw Error(`${port} is not a port of module ${header.name} in ${fileOf.get(header)}`)
      if (kind === 'interface' || kind === 'ref') throw Error(`${kind} port ${port} of module ${header.name} is not supported by addSystemVerilogSubmodule`)
      const thisSignal = this.findSignal(bindings[port])
      vIOs[port] = { ...thisSignal, direction: kind }
    }
    const vModuleName = header.name
    const vModule = new Module(
      { name: vModuleName, ...params },
      vIOs
    )
    for (const p in vModule.params) {
      if (p !== 'name') { vModule.setVerilogParameter(p) }
    }
    vModule.importedFiles = sources
    return this.addSubmodule(instanceName, vModule, bindings, autoBind)
  }

  /**
   * The hash a derived module name holds for a value that can't go into it as is: 41 bits of the
   * SHA-256 of the value's canonical JSON, as 8 lowercase base-36 characters (2^41 < 36^8). Text
   * that refers to the hash in a module's name, such as a parameter comment, should use it too.
   * @param value the parameter value
   * @returns 8 characters from `0-9a-z`
   * @group Output and utilities
   */
  protected nameHash (value: unknown): string {
    const digest = createHash('sha256').update(canonicalJSON(value)).digest('hex')
    // The digest's first 44 bits, less the lowest 3
    return (BigInt('0x' + digest.slice(0, 11)) >> 3n).toString(36).padStart(8, '0')
  }

  // One parameter value's segment in a derived module name (doc/framework/concepts.md §2)
  private nameSegment (value: ParameterValue | undefined): string {
    if (value === undefined) return 'X'
    if (typeof value === 'boolean') return String(value)
    if (typeof value === 'bigint' || (typeof value === 'number' && Number.isInteger(value))) {
      const n = BigInt(value)
      return n < 0n ? 'm' + (-n).toString() : n.toString()
    }
    // 1 to 16 letters, digits, '_' or '$'. A segment always follows '<ClassName>_', so it may start
    // with a digit and the name is still a legal SV identifier
    if (typeof value === 'string' && /^[A-Za-z0-9_$]{1,16}$/.test(value)) return value
    return this.nameHash(value)
  }

  /** @internal */
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

  /** @internal */
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
     *
     * @remarks
     * The signal is declared in the module body, `logic [width-1:0] name;` by default, with
     * `signed`, its array range and its attributes if it has them. A builder that drives a `wire`
     * or untyped signal from an always block or a register turns it into `logic`.
     * @param name name of the signal
     * @param signal parameters of the signal: `{}` for a 1-bit `logic`
     * @returns signal that can be passed to other add* functions to make connections
     * @throws `<name> signal already exists` if the module already has a port, signal or
     * interface member of that name
     * @example A signed internal signal
     * {@includeCode ../../doc-examples/core/addSignal.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addSignal/SignalExample.sv}
     * @group Signals and ports
     */
  addSignal (name: string, signal: Signal): Sig {
    if (this.findSignal(name)) throw Error(`${name} signal already exists`)
    this.signals[name] = signal
    return new Sig(name)
  }

  /**
     * add a DFF register(can be multi-bit) to the d input. `resetVal` must be a bigint constant
     * (SV guide SEQ-6). Emission checks the `always_ff` block the register goes in,
     * as it checks every always block, so `reset` must be the same kind (`isReset`) as every other
     * reset in the module (RST-2).
     *
     * @remarks
     * Registers that share the same clock, reset and enable are merged into one `always_ff`
     * block. The reset's `isReset` metadata sets its polarity, and whether it is in the event
     * control:
     *
     * | `isReset` | Event control | Reset condition |
     * |---|---|---|
     * | `'lowasync'` | `posedge clk or negedge rst_b` | `!rst_b` |
     * | `'highasync'` | `posedge clk or posedge rst` | `rst` |
     * | `'lowsync'` | `posedge clk` | `!rst_b` |
     * | `'highsync'` | `posedge clk` | `rst` |
     *
     * The clock's edge comes from its `isClock`. A `q` that is a `wire` or has no type becomes
     * `logic`. `doc/framework/concepts.md` §6 has how the blocks are built.
     * @param io the input/output of the register. With a reset, q resets to `resetVal` (default 0),
     * written as `'0`, or as a literal sized to q
     * @returns return the q output signal
     * @throws `<signal> signal not found in addRegister()` for a `d`, `q`, `clk` or `reset` the
     * module doesn't have, or `<signal> array signal used as normal signal in addRegister()` for an array
     * @throws `<d>_q signal already exists` if `q` is omitted and `<d>_q` exists
     * @throws `addRegister(...) auto q naming only allowed when d is a simple signal, not an
     * expression` if `q` is omitted and `d` is an `Expr`
     * @throws `<q> is unsupported signal type <type>` for a `q` that isn't `logic`, `reg`, `wire` or untyped
     * @throws `<clk> is not a clock signal` or `<reset> is not a reset signal` for a `clk` without
     * `isClock` or a `reset` without `isReset`
     * @throws `addRegister(<q>): resetVal must be a bigint constant ...` for a `resetVal` that isn't a bigint
     * @example An 8-bit register with an enable and an active-low asynchronous reset
     * {@includeCode ../../doc-examples/core/addRegister.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addRegister/RegisterExample.sv}
     * @group Registers
     */
  addRegister (io: RegisterIO): Sig {
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
    // The type says resetVal is a bigint; this catches a signal passed from JavaScript, or cast
    const resetVal: unknown = io.resetVal
    if (resetVal !== undefined && typeof resetVal !== 'bigint') {
      throw Error(`addRegister(${qName.toString()}): resetVal must be a bigint constant (SEQ-6: reset values must be constants)`)
    }
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
     * @returns the minimum bit width needed to represent the value. Signed, or for a negative
     * value, that includes a sign bit
     * @example
     * ```typescript
     * this.bitWidth(255)       // 8
     * this.bitWidth(128, true) // 9: a sign bit too
     * this.bitWidth(-8)        // 4
     * ```
     * @group Output and utilities
     */
  bitWidth (a: number | bigint, isSigned: boolean = false): number {
    return (Math.ceil(Math.log2(Math.abs(Number(a)) + Number(a >= 0)) + Number(isSigned || (a < 0))))
  }

  /**
     * add a rounding operation to scale down and reduce the bit width of a signal: `out` is
     * `in / 2^rShift`, rounded as `roundMode` says.
     * @remarks
     * | `roundMode` | Rounds |
     * |---|---|
     * | `'rp'` (default) | half up, toward positive infinity |
     * | `'rm'` | down, toward negative infinity (floor): the shift alone |
     * | `'rz'` | toward zero; for an unsigned `in`, the same as `'rm'` |
     * | `'rn'` | half to even |
     * | `'rna'` | half away from zero; for an unsigned `in`, the same as `'rp'` |
     *
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
     * @param io.in the signal to round; it must exist
     * @param io.out the signal that takes the result; it must exist, with `in`'s signedness. Declare
     * it before the call
     * @param io.rShift the number of bits to shift right: a number, or the name or `Sig` of an
     * unsigned signal
     * @returns the signal of the rounded result
     * @throws `<signal> signal not found in addRound()` for an `in`, `out` or `rShift` signal the
     * module doesn't have, or `<signal> array signal used as normal signal in addRound()` for an array
     * @throws `sign mode must match <in>, <out>` if `in` and `out` differ in signedness
     * @throws `roundMode not found` for a mode not in the table
     * @throws `addRound: rShift <n> must be an integer from 0 to <width - 1>` for a constant shift out of range
     * @throws `right shift signal <rShift> must be unsigned` for a signed shift signal
     * @throws `<out>_biased signal already exists` if the bias signal's name is taken
     * @example Round a 16-bit sum to 9 bits, dropping 8 bits, half to even
     * {@includeCode ../../doc-examples/core/addRound.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addRound/RoundExample.sv}
     * @group Arithmetic
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
     * @remarks
     * | `satMode` | For an `n`-bit `out` |
     * |---|---|
     * | `'simple'` (default) | clamps to `[-2^(n-1), 2^(n-1) - 1]` if signed, `[0, 2^n - 1]` if unsigned |
     * | `'balanced'` | clamps a signed `in` to `[-(2^(n-1) - 1), 2^(n-1) - 1]`, the same magnitude both ways; an unsigned one as `'simple'` does |
     * | `'none'` | no clamp: an unsigned `in` keeps its low `n` bits; a signed `in` out of range keeps its sign and its low `n - 1` bits |
     *
     * @param io the input and output signals of the saturation operation. They must have the same
     * signedness. An `out` at least as wide as `in` gets `in` extended, except that `balanced`
     * still clamps a signed `in` of the same width.
     * @param satMode determines the behavior of the saturation. `simple` clamps `in` to `out`'s
     * range. `balanced` clamps a signed `in` to a range symmetric about zero, from
     * `-(2^(n-1) - 1)` to `2^(n-1) - 1` for an `n`-bit `out`; for an unsigned `in` it's `simple`.
     * `none` doesn't clamp: an unsigned `in` keeps its low bits, and a signed `in` out of range
     * keeps its sign and its low `n - 1` bits.
     * @param io.in the signal to saturate; it must exist
     * @param io.out the signal that takes the result; it must exist, with `in`'s signedness.
     * Declare it before the call, at the width to saturate to
     * @returns signal of the result of the saturation
     * @throws `<signal> signal not found in addSaturate()` for an `in` or `out` the module doesn't
     * have, or `<signal> array signal used as normal signal in addSaturate()` for an array
     * @throws `sign mode must match <in>, <out>` if `in` and `out` differ in signedness
     * @example Saturate a signed 12-bit value to 8 bits
     * {@includeCode ../../doc-examples/core/addSaturate.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addSaturate/SaturateExample.sv}
     * @group Arithmetic
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

  /**
   * Add an `always_ff` block. The builder writes the header, `always_ff @(<clock edge> <clk> or
   * <reset edge> <reset>)`, from `clk` and `reset`; a body that has its own header must match it.
   * {@link writeSystemVerilogFiles} checks the block against the SV guide, as it checks every always
   * block in the module: COMB-2, SEQ-1, SEQ-4, SEQ-5, SEQ-6 and RST-2 apply to this one.
   * @param io the block's clock, its reset if it has one, and the signals it assigns, which
   * become `logic`
   * @param io.clk the clock; it must carry `isClock`, whose edge the header uses
   * @param io.reset the reset; it must carry `isReset`. An asynchronous one joins the event
   * control on its active edge; a synchronous one doesn't, and the body tests it
   * @param io.outputs the signals the block assigns: each must exist, and one that is a `wire` or
   * untyped becomes `logic`
   * @param body the block's statements, usually `begin : <name> ... end`. If it holds
   * `always_ff`, the builder adds no header, and the body's must name the clock edge and the
   * reset edge
   * @throws `<output> signal not found in addSequentialAlways()` for an output the module doesn't have
   * @throws `<output> is unsupported signal type <type>` for an output that isn't `logic`, `reg`, `wire` or untyped
   * @throws `<signal> signal not found in addRegister()` for a `clk` or `reset` the module doesn't
   * have (the message names `addRegister`), or `<signal> array signal used as normal signal in addRegister()`
   * @throws `<clk> is not a clock signal` or `<reset> is not a reset signal` for a `clk` without
   * `isClock` or a `reset` without `isReset`
   * @throws `Sensitivity mismatch: <event control> : <body>` if the body's own header doesn't name the
   * clock and reset edges
   * @example A counter with an active-low asynchronous reset
   * {@includeCode ../../doc-examples/core/addSequentialAlways.ts#example}
   *
   * The SystemVerilog it emits:
   *
   * {@includeCode ../../../doc/examples/core/addSequentialAlways/SequentialAlwaysExample.sv}
   * @group Sequential logic
   */
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
    const header = body.includes('always_ff') ? '' : `always_ff ${sensitivityList}\n`
    if (header === '') {
      const clkSenseMatch = body.replace(/\s+/g, ' ').includes(`${clkSig.isClock} ${io.clk.toString()}`)
      const resetSenseMatch = (resetSensitivity === '') || body.replace(/\s+/g, ' ').includes(resetSensitivity)
      if (!clkSenseMatch || !resetSenseMatch) {
        throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`)
      }
    }
    this.body += header + body
  }

  /**
   * Add a combinational block: `always_comb`, or, with `inputs`, the older `always @( ... )` form.
   * {@link writeSystemVerilogFiles} checks the block against the SV guide, as it checks every always
   * block in the module: COMB-2 and COMB-3 apply to this one.
   * @param io the signals the block assigns, which become `logic`; `inputs` gives a sensitivity
   * list instead of `always_comb`
   * @param io.inputs the sensitivity list, each of which must exist: the header is then
   * `always @( <a> or <b> ... )`. Without it, `always_comb`, which needs none
   * @param io.outputs the signals the block assigns: each must exist, and one that is a `wire` or
   * untyped becomes `logic`
   * @param body the block's statements, usually `begin : <name> ... end`. If it holds `always`,
   * the builder adds no header; the body's must then be `always @( ... )` over `inputs`
   * @throws `<signal> signal not found in addCombAlways()` for an input or output the module doesn't have
   * @throws `<output> is unsupported signal type <type>` for an output that isn't `logic`, `reg`, `wire` or untyped
   * @throws `Sensitivity mismatch: <list> : <body>` if the body has its own header and it doesn't
   * hold `@( <inputs> )`, or there are no `inputs`
   * @example An AND gate in an always_comb block
   * {@includeCode ../../doc-examples/core/addCombAlways.ts#example}
   *
   * The SystemVerilog it emits:
   *
   * {@includeCode ../../../doc/examples/core/addCombAlways/CombAlwaysExample.sv}
   * @group Combinational logic
   */
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
    const header = body.includes('always') ? '' : sensitivityList ? `always ${sensitivityList}\n` : 'always_comb\n'
    if (header === '' && !body.replace(/\s+/g, ' ').includes(`${sensitivityList}`)) {
      throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`)
    }
    this.body += header + body
  }

  /**
   * Add an `always_latch` block, for a latch built by intent (TSSV guide BUILD-5).
   * {@link writeSystemVerilogFiles} checks the block against the SV guide, as it checks every always
   * block in the module: COMB-2 applies to this one.
   * @param io the signals the block assigns, which become `logic`; `inputs` gives a sensitivity
   * list instead of `always_latch`
   * @param io.inputs the sensitivity list, each of which must exist: the header is then
   * `always @( <a> or <b> ... )`. Without it, `always_latch`
   * @param io.outputs the signals the block assigns: each must exist, and one that is a `wire` or
   * untyped becomes `logic`
   * @param body the block's statements, usually `begin : <name> ... end`. If it holds `always`,
   * the builder adds no header; the body's must then be `always @( ... )` over `inputs`
   * @throws `<signal> signal not found in addLatchAlways()` for an input or output the module doesn't have
   * @throws `<output> is unsupported signal type <type>` for an output that isn't `logic`, `reg`, `wire` or untyped
   * @throws `Sensitivity mismatch: <list> : <body>` if the body has its own header and it doesn't
   * hold `@( <inputs> )`, or there are no `inputs`
   * @example A transparent-high latch
   * {@includeCode ../../doc-examples/core/addLatchAlways.ts#example}
   *
   * The SystemVerilog it emits:
   *
   * {@includeCode ../../../doc/examples/core/addLatchAlways/LatchAlwaysExample.sv}
   * @group Sequential logic
   */
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
    const header = body.includes('always') ? '' : sensitivityList ? `always ${sensitivityList}\n` : 'always_latch\n'
    if (header === '' && !body.replace(/\s+/g, ' ').includes(`${sensitivityList}`)) {
      throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`)
    }
    this.body += header + body
  }

  /** @internal */
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

    // Plain `a op b`, with no operand cast to the result's width (WIDTH-3). In a signed
    // operation an unsigned signal is `$signed({1'b0, x})` (WIDTH-4). A literal is written at its
    // own width, with the operation's signedness and so, in a signed operation, a sign bit
    // (WIDTH-1). A negative literal is the negation of a signed literal that holds its magnitude
    // and a sign bit: -8 is `-5'sd8`. A result narrower than the natural width gets one outer
    // cast, which keeps its low bits (WIDTH-2).
    const term = (x: Operand): string => {
      if (x.literal === undefined) return (signed && !x.signed) ? `$signed({1'b0, ${x.expr}})` : x.expr
      const v = x.literal < 0n ? -x.literal : x.literal
      return `${x.literal < 0n ? '-' : ''}${Math.max(1, this.bitWidth(v, signed))}'${signed ? 's' : ''}d${v}`
    }
    const expr = `${term(a)} ${op} ${term(b)}`
    this.body += `   assign ${result.toString()} = ${width < naturalWidth ? `${width}'(${expr})` : expr};\n`
    if (typeof result === 'string') {
      return new Sig(result)
    }
    return result
  }

  /**
     * adds an arithmetic multiplier to the generated SystemVerilog module
     * @param io the input/output interface of the multiplier. `a` and `b` are signals or bigint
     * literals. If either is signed, or a negative literal, the product is signed, and an
     * unsigned signal is converted with `$signed({1'b0, x})`. The product is written plain,
     * `a * b`, with no operand casts. Without `result`, it's a new signal as wide as both
     * operands together, which holds every product. With `result`, it's computed at `result`'s
     * width; a narrower `result` gets one outer cast, `W'(a * b)`, which keeps the low bits, and
     * logs a warning. A literal is written at its own width, with a sign bit in a signed product.
     * A negative literal is negated: `a * -8n` gives `a * -5'sd8`.
     *
     * The rules are the SV guide's WIDTH-1 to WIDTH-4, and the same for {@link Module.addAdder} and
     * {@link Module.addSubtractor}, except the auto-sized width.
     * @returns the product result
     * @throws `<signal> signal not found in addOperation()` for an operand or `result` the module
     * doesn't have, or `<signal> array signal used as normal signal in addOperation()` for an array
     * @throws `<result> must be signed` for an unsigned `result` of a signed product
     * @example A signed 8-bit by unsigned 4-bit product
     * {@includeCode ../../doc-examples/core/addMultiplier.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addMultiplier/MultiplierExample.sv}
     * @group Arithmetic
     */
  addMultiplier (io: OperationIO): Sig {
    return this.addOperation(BinaryOp.MULTIPLY, io)
  }

  /**
     * adds an arithmetic adder to the generated SystemVerilog module
     * @param io the input/output interface of the adder. `a` and `b` are signals or bigint
     * literals. If either is signed, or a negative literal, the sum is signed, and an unsigned
     * signal is converted with `$signed({1'b0, x})`, which adds a bit. The sum is written plain,
     * `a + b`, with no operand casts. Without `result`, it's a new signal one bit wider than the
     * wider operand, which holds every sum. With `result`, it's computed at `result`'s width; a
     * narrower `result` gets one outer cast, `W'(a + b)`, which keeps the low bits, and logs a
     * warning. A literal is written at its own width, with a sign bit in a signed sum. A negative
     * literal is negated: `a + -8n` gives `a + -5'sd8`.
     * @returns the sum result
     * @throws `<signal> signal not found in addOperation()` for an operand or `result` the module
     * doesn't have, or `<signal> array signal used as normal signal in addOperation()` for an array
     * @throws `<result> must be signed` for an unsigned `result` of a signed sum
     * @example An 8-bit signal plus a literal, into a named result
     * {@includeCode ../../doc-examples/core/addAdder.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addAdder/AdderExample.sv}
     * @group Arithmetic
     */
  addAdder (io: OperationIO): Sig {
    return this.addOperation(BinaryOp.ADD, io)
  }

  /**
     * adds an arithmetic subtractor to the generated SystemVerilog module
     * @param io the input/output interface of the subtractor: `a - b`. The widths and signedness
     * follow {@link Module.addAdder}.
     * @returns the difference result
     * @throws `<signal> signal not found in addOperation()` for an operand or `result` the module
     * doesn't have, or `<signal> array signal used as normal signal in addOperation()` for an array
     * @throws `<result> must be signed` for an unsigned `result` of a signed difference
     * @example A signed difference, auto-sized
     * {@includeCode ../../doc-examples/core/addSubtractor.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addSubtractor/SubtractorExample.sv}
     * @group Arithmetic
     */
  addSubtractor (io: OperationIO): Sig {
    return this.addOperation(BinaryOp.SUBTRACT, io)
  }

  /**
     * add a constant literal signal to the generated SystemVerilog module: `const logic [W-1:0] name = W'd<value>;`
     * @param name signal name. Without one, `const_w<width><s|u><value>`, with `m` before the
     * magnitude of a negative value. A name that is already a signal is returned as is, and
     * nothing new is declared
     * @param value signal literal value. It's declared with a sized literal at the signal's width.
     * @param isSigned whether the signal is signed or not. A negative value is always signed
     * @param width bit width of the resulting signal. Default: the fewest bits that hold `value`
     * ({@link Module.bitWidth})
     * @returns the constant's signal
     * @throws `width:<width> is insufficient for value: <value>` for a `width` too narrow for `value`
     * @example An 8-bit constant
     * {@includeCode ../../doc-examples/core/addConstSignal.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addConstSignal/ConstSignalExample.sv}
     * @group Signals and ports
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
     * add an array of constant literal signals to the generated SystemVerilog module: one
     * {@link Module.addConstSignal} per value, named `<name>_0`, `<name>_1`, ...
     * @param name signal name: the prefix of each constant's name
     * @param values the literal values of the array
     * @param isSigned whether the signals are signed or not. A negative value's constant is always signed
     * @param width bit width of the resulting signals. Default: each value's own minimum width
     * @returns The array of signals
     * @throws `width:<width> is insufficient for value: <value>` for a `width` too narrow for a value
     * @example Three coefficients at one width
     * {@includeCode ../../doc-examples/core/addConstSignals.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addConstSignals/ConstSignalsExample.sv}
     * @group Signals and ports
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
     * add a SystemVerilog continuous assign statement: `assign <out> = <in>;`
     * @param io expression that is the right hand side of the assigment
     * @param io.in the right-hand side, written as given; the core doesn't parse it
     * @param io.out the left-hand side, an existing `wire`, `logic` or untyped signal or port
     * @returns signal that is the left hand side of the assignment
     * @throws `<out> signal not found in addAssign()` for an `out` the module doesn't have, or
     * `<out> array signal used as normal signal in addAssign()` for an array
     * @throws `<out> signal must be either wire or logic in assign statement` for an `out` of another type
     * @example Masking a bus
     * {@includeCode ../../doc-examples/core/addAssign.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addAssign/AssignExample.sv}
     * @group Combinational logic
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
     *
     * @remarks
     * The mux is an `always_comb` block holding a `unique case` on `sel`, one item per input.
     * @returns signal of the multiplexer output
     * @throws `addMux: <out> needs at least 2 inputs, got <n>` for fewer than two inputs
     * @throws `<signal> signal not found in addMux()` for a `sel` or `out` signal the module doesn't
     * have, or `<signal> array signal used as normal signal in addMux()` for an array
     * @throws `<sel> signal does not have enough bits as Mux select, ...` for a `sel` signal too narrow
     * @throws `<out> is unsupported signal type <type>` for an `out` that isn't `logic`, `reg`, `wire` or untyped
     * @throws `addMux: input <in> is <n> bits, wider than <out> (<m> bits)` for a signal input wider than `out`
     * @example A three-input multiplexer with a default
     * {@includeCode ../../doc-examples/core/addMux.ts#example}
     *
     * The SystemVerilog it emits:
     *
     * {@includeCode ../../../doc/examples/core/addMux/MuxExample.sv}
     * @group Combinational logic
     */
  addMux (io: MuxIO): Sig {
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
   * @remarks
   * Use it for logic the `add*()` builders can't express. The text isn't parsed here, but
   * {@link Module.writeSystemVerilogFiles} checks the module's SV, raw text included: it must
   * parse, and every always block in it is checked against the SV guide.
   * @example A function and a use of it
   * {@includeCode ../../doc-examples/core/addBody.ts#example}
   *
   * The SystemVerilog it emits:
   *
   * {@includeCode ../../../doc/examples/core/addBody/BodyExample.sv}
   * @group Raw SystemVerilog
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
   * @example One assign, indented by the caller
   * {@includeCode ../../doc-examples/core/addBodyLine.ts#example}
   *
   * The SystemVerilog it emits:
   *
   * {@includeCode ../../../doc/examples/core/addBodyLine/BodyLineExample.sv}
   * @group Raw SystemVerilog
   */
  addBodyLine (line: string): void {
    this.body += line + '\n'
  }

  /**
     * print some debug information to the console: the module's name, parameters, ports,
     * signals and body text
     * @group Output and utilities
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
   * @internal
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
   *
   * @remarks
   * Keys are sorted; a nested object's keys are joined with `.`, and `undefined` values are left
   * out. A subclass overrides it to shorten a parameter, as {@link Registers.RegisterBlock} does
   * for its register map.
   * @param params the parameters to list; default the module's
   * @param opts.prefix the text before each `key = value`; default `// `
   * @param opts.skipName leave out `name`; default `true`
   * @returns one indented line per parameter, joined with newlines
   * @group Output and utilities
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
   * @internal
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
   * The comment block that names this module's port contracts in its SV, after the Parameters
   * block, or '' for a module without contracts.
   */
  private formatPortContractsAsVerilogComment (): string {
    if (this.contracts.length === 0) return ''
    return [
      '\n   // ------------------------------------------------------------------',
      "   // Port contracts, checked by TSSV's scripts/check-port-contracts.mjs",
      '   // ------------------------------------------------------------------',
      ...this.contracts.map(c => `   // ${contractText(c)}`),
      '   // ------------------------------------------------------------------\n'
    ].join('\n')
  }

  private applyFormatter (sv: string): string {
    if (Module.formatterConfig.engine === 'verible') {
      return runVerible(sv, Module.formatterConfig)
    }
    return sv
  }

  /**
   * Writes this module and everything it reaches one definition per file: `<outDir>/<name>.sv`
   * for each module and each interface, each defined once.
   *
   * Each file sits inside an include guard, `DEF__<name>__` for what it defines, and a module's
   * file includes the files of the interfaces it uses and the modules it instantiates directly:
   *
   * ```systemverilog
   * `ifndef DEF__mid__
   * `define DEF__mid__
   * `ifdef USE_INCLUDES
   * `include "memory_rd_only_32_32.sv"
   * `include "leaf.sv"
   * `endif //USE_INCLUDES
   *
   * module mid
   *    ...
   * endmodule
   *
   * `endif //!DEF__mid__
   * ```
   *
   * A module with no interfaces and no submodules, and every interface, has the guard only. The
   * guard lets a file be reached more than once, from two parents or from the command line as
   * well, and still define its module once.
   *
   * ```typescript
   * const files = top.writeSystemVerilogFiles('build/rtl')   // leaves first, top last
   * ```
   *
   * The files can be built two ways:
   * - With `USE_INCLUDES`, name only the top file and let the includes find the rest:
   *   `verilator --lint-only +define+USE_INCLUDES +incdir+build/rtl build/rtl/top.sv`
   * - Without it, name every file, on the command line or in a filelist:
   *   `verilator --lint-only <every path in files>`
   *
   * The files a module imported with `addSystemVerilogSubmodule()` reads are written untouched,
   * each once, under its own name, inside its `SVIMPORT__<file name without extension>__` guard
   * and nothing else. A generated file never wraps one: the `DEF__` guard is for generated SV
   * only. A module that instantiates an imported one includes all of that import's files, in
   * order. Two different imported files that would share a guard throw, naming both. An imported
   * module has no generated SV of its own, so calling this on one throws: write the module that
   * instantiates it instead.
   *
   * A module that declares port contracts ({@link addNoCombinationalPathContract}) also gets
   * `<outDir>/<name>.contracts.json`, which holds the wrappers scripts/check-port-contracts.mjs
   * lints to check them. It isn't SV, so it isn't among the paths returned.
   *
   * Generated names must be legal SystemVerilog identifiers, because they name files and macros.
   * No two files' names may differ only in case, because they are one file on macOS and Windows.
   * Two different modules with the same name are still written as one (#122). Files already in
   * `outDir` that this call doesn't write are left in place. Every file is generated before
   * any is written, so a call that throws writes nothing.
   *
   * Each module it writes is checked against the SV guide first: `verible-verilog-syntax`
   * parses the module's SV, and every always block in it is checked, whether a builder or raw
   * SV ({@link addBody}) wrote it. A syntax error or a broken rule throws, and the error lists
   * every violation in the module. The check runs before formatting, and throws whatever the
   * formatter configuration says, `failOnFormatError: false` and `engine: 'off'` included. The
   * module's signal table says which signals are resets (`isReset`), of which kind, and which
   * are constants. The rules:
   * - COMB-2: a local declared with an initializer must be `automatic`.
   * - COMB-3: no nonblocking assignments in a combinational block: `always_comb`, `always @*`,
   *   or `always` with a list of levels. `<=` as a comparison, as in `if (a <= b)`, is fine.
   * - SEQ-1: in a sequential block (`always_ff`, or `always` with an edge), `=` only for the
   *   block's own locals; every other assignment uses `<=`.
   * - SEQ-4: a sequential block has one clock, on `posedge` or `negedge`. Every term of its
   *   event control that isn't a reset is a clock.
   * - SEQ-5: an async reset is in the event control, on its active edge; a sync reset isn't.
   * - SEQ-6: in a reset branch, no assignment reads one of the module's signals, ports or
   *   interfaces. Constants, parameters and enum values are fine. A reset branch is the `if`
   *   branch of `if (!rst_n)` or the `else` branch of `if (rst_n)`; for an active-high reset, of
   *   `if (rst)` or `if (!rst)`.
   * - RST-2: the module's sequential blocks use one reset kind.
   * - RST-4: a reset isn't generated in logic. This covers each reset that isn't an input port,
   *   and each signal bound to a submodule's reset port. Each must be driven by a submodule
   *   output or a sequential block, or be assigned one of those or an input: as it is, one bit
   *   of it, or inverted (`!r`, `~r`).
   * @param outDir the directory to write to, created if it doesn't exist
   * @returns the paths written, each after every file it includes, so this module's is last
   * @throws `writeSystemVerilogFiles: <name> was imported with addSystemVerilogSubmodule(), ...`
   * when called on an imported module
   * @throws `<module>: <violation>`, or `<module>: <n> SV-guide violations: ...`, for a module whose SV
   * doesn't parse or breaks one of the rules above
   * @throws `writeSystemVerilogFiles: ... can't name a file and its include guard: ...` for a name
   * that isn't a legal identifier, `writeSystemVerilogFiles: ... and ... would be written to ...`
   * for two names that differ only in case, and `writeSystemVerilogFiles: <file> and <file> would
   * both be guarded by <guard>, ...` for two imported files that would share a guard
   * @throws `<port>: Array IOs not supported` for a port with `isArray`, `<name> has role/modport
   * inconsistency` or `<name> : inconsistent modports` for an interface port whose role names no
   * modport, and an error naming the declaration for a bad attribute (an illegal name, a string
   * holding a quote, backslash or newline, an unsupported value, or any attribute on an interface signal)
   * @throws the formatter's diagnostic, if it fails and `failOnFormatError` is true (the default)
   * @group Output and utilities
   */
  writeSystemVerilogFiles (outDir: string): string[] {
    if (this.importedFiles !== undefined) {
      throw Error(`writeSystemVerilogFiles: ${this.name} was imported with addSystemVerilogSubmodule(), so ` +
        'it has no generated SV to write. Write the module that instantiates it')
    }
    // A generated module or interface, written to `<name>.sv` inside its DEF guard, or an imported
    // file, named by its path and written under its own name inside its SVIMPORT guard
    interface Unit { kind: 'module' | 'interface' | 'imported file', name: string, file: string, usedBy?: string, contents: () => string }
    const units: Unit[] = []
    const seen = new Set<string>()
    // Each imported file's unit and text, by its guard: a file that several imports read is
    // written once, and two different files that would share a guard throw
    const imported = new Map<string, { unit: Unit, text: string }>()
    // The files of module m's import, each added once; returns their file names, in order
    const importFiles = (m: Module, usedBy: string): string[] => (m.importedFiles ?? []).map(({ path, text }) => {
      const guard = importGuard(path)
      const other = imported.get(guard)
      if (other === undefined) {
        const unit: Unit = { kind: 'imported file', name: path, file: basename(path), usedBy, contents: () => guardSVImport(path, text) }
        imported.set(guard, { unit, text })
        units.push(unit)
        return unit.file
      }
      if (other.text !== text) {
        throw Error(`writeSystemVerilogFiles: ${other.unit.name} and ${path} would both be guarded by ${guard}, ` +
          'so wherever both are compiled the second would be dropped. Rename one of them')
      }
      return other.unit.file
    })
    // Post-order, so each file lands after everything it includes. A local interface bundle's
    // type is usually defined first by the submodule port it connects, which carries modports.
    const visit = (m: Module, usedBy?: string): void => {
      if (seen.has(`module ${m.name}`)) return
      seen.add(`module ${m.name}`)
      const submoduleFiles: string[] = []
      for (const { module } of Object.values(m.submodules)) {
        let files = [`${module.name}.sv`]
        if (module.importedFiles === undefined) {
          visit(module, m.name)
        } else {
          files = importFiles(module, m.name)
        }
        for (const file of files) if (!submoduleFiles.includes(file)) submoduleFiles.push(file)
      }
      const interfaceNames: string[] = []
      for (const intf of Object.values(m.interfaces)) {
        const name = intf.interfaceName()
        if (!seen.has(`interface ${name}`)) {
          seen.add(`interface ${name}`)
          units.push({ kind: 'interface', name, file: `${name}.sv`, usedBy: m.name, contents: () => guardSVFile(name, [], this.applyFormatter(interfaceSystemVerilog(intf))) })
        }
        if (!interfaceNames.includes(name)) interfaceNames.push(name)
      }
      const includes = [...interfaceNames.map(name => `${name}.sv`), ...submoduleFiles]
      units.push({ kind: 'module', name: m.name, file: `${m.name}.sv`, usedBy, contents: () => guardSVFile(m.name, includes, m.applyFormatter(m.moduleSystemVerilog())) })
      if (m.contracts.length > 0) manifests.push(m)
    }
    // The modules with port contracts, each of which gets a <name>.contracts.json
    const manifests: Module[] = []
    visit(this)

    const describe = (u: Unit): string =>
      `${u.kind} ${u.name} (${u.usedBy === undefined ? 'the top module' : `used by ${u.usedBy}`})`
    const byFileName = new Map<string, Unit>()
    for (const u of units) {
      // A simple SystemVerilog identifier: a letter or underscore, then letters, digits,
      // underscores or `$`. Escaped identifiers (\foo) can't name a file or a macro, so they fail.
      if (u.kind !== 'imported file' && !/^[A-Za-z_][A-Za-z0-9_$]*$/.test(u.name)) {
        throw Error(`writeSystemVerilogFiles: ${describe(u)} can't name a file and its include guard: ` +
          'it is not a legal SystemVerilog identifier')
      }
      const other = byFileName.get(u.file.toLowerCase())
      if (other !== undefined) {
        throw Error(`writeSystemVerilogFiles: ${describe(other)} and ${describe(u)} would be written to ` +
          'the same file on a case-insensitive file system')
      }
      byFileName.set(u.file.toLowerCase(), u)
    }

    // Generate everything before writing anything, so a failure leaves no partial output
    const files = units.map(u => ({ path: join(outDir, u.file), sv: u.contents() }))
    const contractFiles = manifests.map(m => ({ path: join(outDir, `${m.name}.contracts.json`), json: JSON.stringify(m.contractManifest(), null, 2) + '\n' }))
    mkdirSync(outDir, { recursive: true })
    for (const { path, sv } of files) writeFileSync(path, sv)
    for (const { path, json } of contractFiles) writeFileSync(path, json)
    return files.map(f => f.path)
  }

  /**
   * This module's own definition, `module <name> ... endmodule`, unformatted, after checking it
   * against the SV guide. It instantiates its submodules and uses its interfaces but defines
   * neither: `writeSystemVerilogFiles()` writes those to files of their own.
   */
  private moduleSystemVerilog (): string {
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
              // '0 for zero; otherwise a literal sized to the register (WIDTH-1). An unsized
              // literal is a 32-bit integer, so a wider value gets a WIDTH warning.
              const resetVal = reg.resetVal ?? 0n
              const qSig = this.findSignal(key, false)
              const sign = qSig?.isSigned === true ? 's' : ''
              const resetLiteral = resetVal === 0n
                ? "'0"
                : `${resetVal < 0n ? '-' : ''}${qSig?.width ?? 1}'${sign}d${resetVal < 0n ? -resetVal : resetVal}`
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

    for (const moduleInstance in this.submodules) {
      const thisSubmodule = this.submodules[moduleInstance]
      let paramsBind = ''
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

    const moduleString: string =
`module ${this.name} ${paramsString}
   (
${IOString}
   );
${opt(this.formatParametersAsVerilogComment(this.params))}${opt(this.formatPortContractsAsVerilogComment())}${opt(signalString)}
${opt(this.body)}${opt(generatedBody)}
endmodule
`

    // the SV guide's rules, on this module's SV; each submodule checked its own
    const resetBindings: ModuleTable['resetBindings'] = []
    for (const instance in this.submodules) {
      const { module, bindings } = this.submodules[instance]
      for (const port in bindings) {
        if (module.IOs[port]?.isReset) resetBindings.push({ instance, port, binding: bindings[port].toString() })
      }
    }
    checkModule({ name: this.name, signals: { ...this.IOs, ...this.signals }, interfaces: Object.keys(this.interfaces), resetBindings }, moduleString)

    return moduleString
  }

  private body: string
  /**
   * set by addSystemVerilogSubmodule() on the module it imports: the files it read, untouched
   * @internal
   */
  protected importedFiles?: ReadonlyArray<{ path: string, text: string }>
  /** @internal */
  protected registerBlocks: Record<string, Record<string, Record<string, Record<string, { d: string, resetVal?: bigint }>>>> = {}

  /** @internal */
  protected verilogParams: Record<string, boolean>
}

/** @internal */
export function serialize (obj: any, indent?: number, bigIntSuffix = 'n'): string {
  const serialized = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'bigint') {
      return `0x${value.toString(16)}${bigIntSuffix}`
    }
    return value
  }, indent)
  return serialized
}

/** @internal */
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

/** @internal */
export default { Module, Sig, Expr }

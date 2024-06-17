/**
 * IntRange type allows specifify a type that allows a range of integer values
 * Used in Parameter types on TSSV modules where the parameters have range restrictions
 */
export type IntRange<START extends number, END extends number, ARR extends unknown[] = [], ACC extends number = never> = ARR['length'] extends END ? ACC | START | END : IntRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>;
type ParameterValue = string | bigint | IntRange<number, number> | bigint[];
export interface TSSVParameters {
    name?: string | undefined;
    [name: string]: ParameterValue | undefined;
}
interface SVEnum {
    typeName: string;
    width: number;
    values: Record<string, bigint>;
}
/**
 * signal parameters
 */
interface baseSignal {
    type?: 'wire' | 'reg' | 'const logic' | 'logic' | 'enum';
    width?: number;
    isClock?: 'posedge' | 'negedge';
    isReset?: 'lowasync' | 'highasync' | 'lowsync' | 'highsync';
    isSigned?: boolean;
    isArray?: bigint;
    description?: string;
    enum?: SVEnum;
}
type PortDirection = 'input' | 'output' | 'inout';
/**
 * defines an IO signal (a.k.a port of the the TSSV module)
 */
interface IOSignal extends baseSignal {
    direction: PortDirection;
}
/**
 * The IO interface bundle of a TSSV Module
 */
export type IOSignals = Record<string, IOSignal>;
/**
 * container class of a TSSV signal used to pass signals
 * among add* primtives and submodules to define interconnections
 */
export declare class Sig {
    constructor(name: string);
    toString: () => string;
    protected name: string;
    readonly type: 'Sig';
}
export type ExprParams = Record<string, string | number | bigint>;
/**
 * container class of a TSSV expression, or a RHS assignment in the
 * generated output
 */
export declare class Expr {
    constructor(def: string | ((p: ExprParams) => string), params?: ExprParams);
    toString: () => string;
    params: ExprParams | null;
    protected text: string | null;
    protected func: ((p: ExprParams) => string) | null;
    readonly type: 'Expr';
}
interface Signal extends baseSignal {
    value?: bigint | bigint[];
}
type Signals = Record<string, Signal>;
interface OperationIO {
    a: string | Sig | bigint;
    b: string | Sig | bigint;
    result?: string | Sig;
}
declare enum BinaryOp {
    MULTIPLY = "*",
    ADD = "+",
    SUBTRACT = "-",
    BITWISE_AND = "&",
    BITWISE_OR = "|"
}
/**
 * Interface is a class to define a signal bundle for a standardized
 * interface.  It wraps the modport functionality of an SV interface
 * allowing different port views of the signal bundle as well as
 * just a bundle of wires.   Interfaces simpilfy interface signal binding
 * by combining all signals into a single bundled bind.
 */
export declare class Interface {
    name: string;
    params: TSSVParameters;
    signals: Signals;
    role?: string;
    modports?: Record<string, Record<string, PortDirection>>;
    constructor(name: string, params?: TSSVParameters, role?: string | undefined, signals?: {});
    interfaceName(): string;
    writeSystemVerilog(): string;
}
/**
* The Module class is the base class for all TSSV modules.
*/
export declare class Module {
    /**
      * name contains the resulting SystemVerilog module name
      */
    readonly name: string;
    protected params: TSSVParameters;
    protected IOs: IOSignals;
    protected signals: Signals;
    protected submodules: Record<string, {
        module: Module;
        bindings: Record<string, string | Sig | bigint>;
    }>;
    protected interfaces: Record<string, Interface>;
    /**
       * base constructor
       * @param params parameter value bundle
       * @param IOs IO port bundle
       * @param signals signal bundle
       * @param body SystemVerilog body text
       */
    constructor(params?: TSSVParameters, IOs?: IOSignals, signals?: {}, body?: string);
    setVerilogParameter(param: string): void;
    protected bindingRules: {
        input: string[];
        output: string[];
        inout: string[];
    };
    /**
       * adds an interface signal bundle
       * @param instanceName the name for this instance of the signal bundle
       * @param _interface the type of interface to add
       * @returns the resulting interface for connecting to modules and add* primitives
       */
    addInterface(instanceName: string, _interface: Interface): Interface;
    /**
       * instantiate another module a a submodule
       * @param instanceName sets the instance mane
       * @param submodule the module to instantiate
       * @param bindings define the connections of the submodule
       * @param autoBind find signals in parent with matching name for signals that are not explicitly bound
       * @returns returns the resulting submodule instance
       */
    addSubmodule(instanceName: string, submodule: Module, bindings: Record<string, string | Sig | bigint>, autoBind?: boolean, createMissing?: boolean, autoWidthExtension?: boolean): Module;
    addSystemVerilogSubmodule(instanceName: string, SVFilePath: string, params: TSSVParameters, bindings: Record<string, string | Sig>, autoBind?: boolean): Module;
    protected simpleHash(str: string): string;
    protected bigintToSigName(value: bigint, isSigned?: boolean, width?: number): string;
    protected findSignal(sig: Sig | string | bigint, throwOnFalse?: boolean, caller?: ((...args: any[]) => any) | string | null, throwOnArray?: boolean): Signal | IOSignal;
    /**
       * add a signal to the SystemVerilog module
       * @param name name of the signal
       * @param signal parameters of the signal
       * @returns signal that can be passed to other add* functions to make connections
       */
    addSignal(name: string, signal: Signal): Sig;
    /**
       * add a DFF register(can be multi-bit) to the d input
       * @param io the input/output of the register
       * @returns return the q output signal
       */
    addRegister(io: {
        d: string | Sig | Expr;
        clk: string | Sig;
        reset?: string | Sig;
        resetVal?: bigint;
        en?: string | Sig | Expr;
        q?: string | Sig;
    }): Sig;
    /**
       * get the number of bits need to represent an integer value
       * @param a the value to determine the bit width of
       * @param isSigned whether the value should be treated as a signed number
       * @returns the minimum bit width needed to represent the value
       */
    bitWidth(a: number | bigint, isSigned?: boolean): number;
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
        in: string | Sig;
        out: string | Sig;
        rShift: string | Sig | number;
    }, roundMode?: 'rp' | 'rm' | 'rz' | 'rn' | 'rna'): Sig;
    /**
       * add a Saturate operation to limit the bit width of a signal without overflow
       * @param io the input and output signals of the saturation operation
       * @param satMode determines the behavior of the saturation
       * @returns signal of the result of the saturation
       */
    addSaturate(io: {
        in: string | Sig;
        out: string | Sig;
    }, satMode?: 'simple' | 'balanced' | 'none'): Sig;
    addSequentialAlways(io: {
        clk: string | Sig;
        reset?: string | Sig;
        outputs: Array<string | Sig>;
    }, body: string): void;
    addCombAlways(io: {
        inputs?: Array<string | Sig>;
        outputs: Array<string | Sig>;
    }, body: string): void;
    protected addOperation(op: BinaryOp, io: OperationIO): Sig;
    addMultiplier(io: OperationIO): Sig;
    /**
       * adds an arithmetic adder to the generated SystemVerilog module
       * @param io the input/output interface of the adder
       * @returns the sum result
       */
    addAdder(io: OperationIO): Sig;
    /**
       * adds an arithemetic subtractor to the generated SystemVerilog module
       * @param io the input/output interface of the subtractor
       * @returns the difference result
       */
    addSubtractor(io: OperationIO): Sig;
    /**
       * add a constant literal signal to the generated SystemVerilog module
       * @param name signal name
       * @param value signal literal value
       * @param isSigned whether the signal is signed or not
       * @param width bit width of the resulting signal
       * @returns
       */
    addConstSignal(name: string | undefined, value: bigint, isSigned?: boolean, width?: number | undefined): Sig;
    /**
       * add an array of constant literal signals to the generated SystemVerilog module
       * @param name signal name
       * @param values the literal values of the array
       * @param isSigned whether the signals are signed or not
       * @param width bit width of the resulting signals
       * @returns The array of signals
       */
    addConstSignals(name: string, values: bigint[], isSigned?: boolean, width?: number | undefined): Sig[];
    /**
       * add a SystemVerilog continuous assign statement
       * @param io expression that is the right hand side of the assigment
       * @returns signal that is the left hand side of the assignment
       */
    addAssign(io: {
        in: Expr;
        out: string | Sig;
    }): Sig;
    /**
       * add a multiplexer to the TSSV module
       * @param io The input/output signals connected to the multiplexer
       * @returns signal of the multiplexer output
       */
    addMux(io: {
        in: Array<string | Sig | Expr>;
        sel: string | Sig | Expr;
        out: string | Sig;
        default?: string | Sig | Expr;
    }): Sig;
    /**
       * print some debug information to the console
       */
    debug(): void;
    /**
       * write the generated SystemVerilog code to a string
       * @returns string containing the generated SystemVerilog code for this module
       */
    writeSystemVerilog(): string;
    protected body: string;
    protected registerBlocks: Record<string, Record<string, Record<string, Record<string, {
        d: string;
        resetVal?: bigint;
    }>>>>;
    protected static printedInterfaces: Record<string, boolean>;
    protected verilogParams: Record<string, boolean>;
}
declare const _default: {
    Module: typeof Module;
    Sig: typeof Sig;
    Expr: typeof Expr;
};
export default _default;

[**tssv**](README.md)

***

[tssv](README.md) / Base

# Base

## Enumerations

### BinaryOp

#### Enumeration Members

##### MULTIPLY

```ts
MULTIPLY: "*";
```

##### ADD

```ts
ADD: "+";
```

##### SUBTRACT

```ts
SUBTRACT: "-";
```

##### BITWISE\_AND

```ts
BITWISE_AND: "&";
```

##### BITWISE\_OR

```ts
BITWISE_OR: "|";
```

## Classes

### Sig

container class of a TSSV signal used to pass signals
among add* primtives and submodules to define interconnections

#### Constructors

##### Constructor

```ts
new Sig(name): Sig;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

###### Returns

[`Sig`](#sig)

#### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="name-1"></a> `name` | `protected` | `string` |
| <a id="type-2"></a> `type` | `readonly` | `"Sig"` |

#### Methods

##### toString()

```ts
toString(): string;
```

###### Returns

`string`

***

### Expr

container class of a TSSV expression, or a RHS assignment in the
generated output

#### Constructors

##### Constructor

```ts
new Expr(def, params?): Expr;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `def` | `string` \| ((`p`) => `string`) |
| `params?` | [`ExprParams`](#exprparams) |

###### Returns

[`Expr`](#expr)

#### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="params"></a> `params` | `public` | [`ExprParams`](#exprparams) \| `null` |
| <a id="text"></a> `text` | `protected` | `string` \| `null` |
| <a id="func"></a> `func` | `protected` | ((`p`) => `string`) \| `null` |
| <a id="type-3"></a> `type` | `readonly` | `"Expr"` |

#### Methods

##### toString()

```ts
toString(): string;
```

###### Returns

`string`

***

### Interface

Interface is a class to define a signal bundle for a standardized
interface.  It wraps the modport functionality of an SV interface
allowing different port views of the signal bundle as well as
just a bundle of wires.   Interfaces simpilfy interface signal binding
by combining all signals into a single bundled bind.

#### Extended by

- [`Memory`](Memory.md#memory)

#### Constructors

##### Constructor

```ts
new Interface(
   name, 
   params?, 
   role?, 
   signals?
): Interface;
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `name` | `string` | `undefined` |
| `params` | [`TSSVParameters`](#tssvparameters) | `{}` |
| `role` | `string` \| `undefined` | `undefined` |
| `signals` | \{ \} | `{}` |

###### Returns

[`Interface`](#interface)

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="name-2"></a> `name` | `string` |
| <a id="params-1"></a> `params` | [`TSSVParameters`](#tssvparameters) |
| <a id="signals-1"></a> `signals` | [`Signals`](#signals) |
| <a id="role"></a> `role?` | `string` |
| <a id="modports"></a> `modports?` | `Record`\<`string`, `Record`\<`string`, [`PortDirection`](#portdirection)\>\> |

#### Methods

##### interfaceName()

```ts
interfaceName(): string;
```

###### Returns

`string`

##### writeSystemVerilog()

```ts
writeSystemVerilog(): string;
```

###### Returns

`string`

***

### Module

The Module class is the base class for all TSSV modules.

#### Extended by

- [`RegisterBlock`](Registers.md#registerblock)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `P` *extends* [`TSSVParameters`](#tssvparameters) | [`TSSVParameters`](#tssvparameters) |
| `IO` *extends* [`IOSignals`](#iosignals) | [`IOSignals`](#iosignals) |

#### Constructors

##### Constructor

```ts
new Module<P, IO>(
   params?, 
   IOs?, 
   signals?, 
   body?
): Module<P, IO>;
```

base constructor

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `params` | `P` | `...` | parameter value bundle |
| `IOs` | `IO` | `...` | IO port bundle |
| `signals` | \{ \} | `{}` | signal bundle |
| `body` | `string` | `''` | SystemVerilog body text |

###### Returns

[`Module`](#module)\<`P`, `IO`\>

#### Properties

| Property | Modifier | Type | Default value | Description |
| ------ | ------ | ------ | ------ | ------ |
| <a id="name-3"></a> `name` | `readonly` | `string` | `undefined` | name contains the resulting SystemVerilog module name |
| <a id="params-2"></a> `params` | `protected` | `P` | `undefined` | - |
| <a id="ios"></a> `IOs` | `protected` | `IO` | `undefined` | - |
| <a id="formatterconfig-1"></a> `formatterConfig` | `static` | [`FormatterConfig`](#formatterconfig) | `undefined` | - |
| <a id="signals-2"></a> `signals` | `protected` | [`Signals`](#signals) | `undefined` | - |
| <a id="submodules"></a> `submodules` | `protected` | `Record`\<`string`, \{ `module`: [`Module`](#module); `bindings`: `Record`\<`string`, `string` \| [`Sig`](#sig) \| `bigint`\>; \}\> | `undefined` | - |
| <a id="interfaces-1"></a> `interfaces` | `protected` | [`Interfaces`](#interfaces) | `undefined` | - |
| <a id="bindingrules"></a> `bindingRules` | `protected` | `object` | `undefined` | - |
| `bindingRules.input` | `public` | `string`[] | `undefined` | - |
| `bindingRules.output` | `public` | `string`[] | `undefined` | - |
| `bindingRules.inout` | `public` | `string`[] | `undefined` | - |
| <a id="body"></a> `body` | `protected` | `string` | `undefined` | - |
| <a id="registerblocks"></a> `registerBlocks` | `protected` | `Record`\<`string`, `Record`\<`string`, `Record`\<`string`, `Record`\<`string`, \{ `d`: `string`; `resetVal?`: `bigint`; \}\>\>\>\> | `{}` | - |
| <a id="printedinterfaces"></a> `printedInterfaces` | `static` | `Record`\<`string`, `boolean`\> | `{}` | - |
| <a id="verilogparams"></a> `verilogParams` | `protected` | `Record`\<`string`, `boolean`\> | `undefined` | - |

#### Methods

##### setVerilogParameter()

```ts
setVerilogParameter(param): void;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `param` | `string` |

###### Returns

`void`

##### setFormatterConfig()

```ts
static setFormatterConfig(config): void;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`FormatterConfig`](#formatterconfig) |

###### Returns

`void`

##### addInterface()

```ts
addInterface(instanceName, _interface): Interface;
```

adds an interface signal bundle

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `instanceName` | `string` | the name for this instance of the signal bundle |
| `_interface` | [`Interface`](#interface) | the type of interface to add |

###### Returns

[`Interface`](#interface)

the resulting interface for connecting to modules and add* primitives

##### addSubmodule()

```ts
addSubmodule(
   instanceName, 
   submodule, 
   bindings, 
   autoBind?, 
   createMissing?, 
   autoWidthExtension?
): Module;
```

instantiate another module a a submodule

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `instanceName` | `string` | `undefined` | sets the instance mane |
| `submodule` | [`Module`](#module) | `undefined` | the module to instantiate |
| `bindings` | `Record`\<`string`, `string` \| [`Sig`](#sig) \| `bigint`\> | `undefined` | define the connections of the submodule |
| `autoBind` | `boolean` | `true` | find signals in parent with matching name for signals that are not explicitly bound |
| `createMissing` | `boolean` | `false` | - |
| `autoWidthExtension` | `boolean` | `false` | - |

###### Returns

[`Module`](#module)

returns the resulting submodule instance

##### addSystemVerilogSubmodule()

```ts
addSystemVerilogSubmodule(
   instanceName, 
   SVFilePath, 
   params, 
   bindings, 
   autoBind?, 
   options?
): Module;
```

instantiate a module from an existing SystemVerilog file.  The module name and the
direction of each bound port are taken from the file's module header.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `instanceName` | `string` | `undefined` | the name of the instance |
| `SVFilePath` | `string` | `undefined` | path to the SystemVerilog source file |
| `params` | [`TSSVParameters`](#tssvparameters) | `undefined` | SV parameter overrides for the instance |
| `bindings` | `Record`\<`string`, `string` \| [`Sig`](#sig)\> | `undefined` | map of submodule port name to parent signal |
| `autoBind` | `boolean` | `true` | automatically bind unbound ports to same-named parent signals |
| `options` | [`SVImportOptions`](#svimportoptions) | `{}` | `moduleName` selects the module to instantiate when the file declares more than one (default: the only module in the file, or the one named after the file); `veribleSyntaxPath` locates verible-verilog-syntax, which parses the module header |

###### Returns

[`Module`](#module)

the imported submodule

##### simpleHash()

```ts
protected simpleHash(str): string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `str` | `string` |

###### Returns

`string`

##### bigintToSigName()

```ts
protected bigintToSigName(
   value, 
   isSigned?, 
   width?
): string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `bigint` |
| `isSigned?` | `boolean` |
| `width?` | `number` |

###### Returns

`string`

##### findSignal()

```ts
protected findSignal(
   sig, 
   throwOnFalse?, 
   caller?, 
   throwOnArray?
): IOSignal | Signal;
```

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `sig` | `string` \| `bigint` \| [`Sig`](#sig) | `undefined` |
| `throwOnFalse` | `boolean` | `false` |
| `caller` | `string` \| ((...`args`) => `any`) \| `null` | `null` |
| `throwOnArray?` | `boolean` | `undefined` |

###### Returns

[`IOSignal`](#iosignal) \| [`Signal`](#signal)

##### addSignal()

```ts
addSignal(name, signal): Sig;
```

add a signal to the SystemVerilog module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | name of the signal |
| `signal` | [`Signal`](#signal) | parameters of the signal |

###### Returns

[`Sig`](#sig)

signal that can be passed to other add* functions to make connections

##### addRegister()

```ts
addRegister(io): Sig;
```

add a DFF register(can be multi-bit) to the d input

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | \{ `d`: `string` \| [`Sig`](#sig) \| [`Expr`](#expr); `clk`: `string` \| [`Sig`](#sig); `reset?`: `string` \| [`Sig`](#sig); `resetVal?`: `bigint`; `en?`: `string` \| [`Sig`](#sig) \| [`Expr`](#expr); `q?`: `string` \| [`Sig`](#sig); \} | the input/output of the register |
| `io.d` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | - |
| `io.clk` | `string` \| [`Sig`](#sig) | - |
| `io.reset?` | `string` \| [`Sig`](#sig) | - |
| `io.resetVal?` | `bigint` | - |
| `io.en?` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | - |
| `io.q?` | `string` \| [`Sig`](#sig) | - |

###### Returns

[`Sig`](#sig)

return the q output signal

##### bitWidth()

```ts
bitWidth(a, isSigned?): number;
```

get the number of bits need to represent an integer value

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `a` | `number` \| `bigint` | `undefined` | the value to determine the bit width of |
| `isSigned` | `boolean` | `false` | whether the value should be treated as a signed number |

###### Returns

`number`

the minimum bit width needed to represent the value

##### addRound()

```ts
addRound(io, roundMode?): Sig;
```

add a rounding operation to scale down and reduce the bit width of a signal

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `io` | \{ `in`: `string` \| [`Sig`](#sig); `out`: `string` \| [`Sig`](#sig); `rShift`: `string` \| `number` \| [`Sig`](#sig); \} | `undefined` | the input/output signals of the round operation the rShift signal determines the number of LSBs to round away. The rShift signal can be either a liternal constant or a variable shift. When using a variable shift, care should be taken to minimize the number of bits to minimize the impact on the timing path of the resulting logic. |
| `io.in` | `string` \| [`Sig`](#sig) | `undefined` | - |
| `io.out` | `string` \| [`Sig`](#sig) | `undefined` | - |
| `io.rShift` | `string` \| `number` \| [`Sig`](#sig) | `undefined` | - |
| `roundMode` | `"rp"` \| `"rm"` \| `"rz"` \| `"rn"` \| `"rna"` | `'rp'` | determines the type of rounding to apply |

###### Returns

[`Sig`](#sig)

the signal of the rounded result

##### addSaturate()

```ts
addSaturate(io, satMode?): Sig;
```

add a Saturate operation to limit the bit width of a signal without overflow

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `io` | \{ `in`: `string` \| [`Sig`](#sig); `out`: `string` \| [`Sig`](#sig); \} | `undefined` | the input and output signals of the saturation operation |
| `io.in` | `string` \| [`Sig`](#sig) | `undefined` | - |
| `io.out` | `string` \| [`Sig`](#sig) | `undefined` | - |
| `satMode` | `"balanced"` \| `"none"` \| `"simple"` | `'simple'` | determines the behavior of the saturation |

###### Returns

[`Sig`](#sig)

signal of the result of the saturation

##### addSequentialAlways()

```ts
addSequentialAlways(io, body): void;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `io` | \{ `clk`: `string` \| [`Sig`](#sig); `reset?`: `string` \| [`Sig`](#sig); `outputs`: (`string` \| [`Sig`](#sig))[]; \} |
| `io.clk` | `string` \| [`Sig`](#sig) |
| `io.reset?` | `string` \| [`Sig`](#sig) |
| `io.outputs` | (`string` \| [`Sig`](#sig))[] |
| `body` | `string` |

###### Returns

`void`

##### addCombAlways()

```ts
addCombAlways(io, body): void;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `io` | \{ `inputs?`: (`string` \| [`Sig`](#sig))[]; `outputs`: (`string` \| [`Sig`](#sig))[]; \} |
| `io.inputs?` | (`string` \| [`Sig`](#sig))[] |
| `io.outputs` | (`string` \| [`Sig`](#sig))[] |
| `body` | `string` |

###### Returns

`void`

##### addLatchAlways()

```ts
addLatchAlways(io, body): void;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `io` | \{ `inputs?`: (`string` \| [`Sig`](#sig))[]; `outputs`: (`string` \| [`Sig`](#sig))[]; \} |
| `io.inputs?` | (`string` \| [`Sig`](#sig))[] |
| `io.outputs` | (`string` \| [`Sig`](#sig))[] |
| `body` | `string` |

###### Returns

`void`

##### addOperation()

```ts
protected addOperation(op, io): Sig;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `op` | [`BinaryOp`](#binaryop) |
| `io` | [`OperationIO`](#operationio) |

###### Returns

[`Sig`](#sig)

##### addMultiplier()

```ts
addMultiplier(io): Sig;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `io` | [`OperationIO`](#operationio) |

###### Returns

[`Sig`](#sig)

##### addAdder()

```ts
addAdder(io): Sig;
```

adds an arithmetic adder to the generated SystemVerilog module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | [`OperationIO`](#operationio) | the input/output interface of the adder |

###### Returns

[`Sig`](#sig)

the sum result

##### addSubtractor()

```ts
addSubtractor(io): Sig;
```

adds an arithemetic subtractor to the generated SystemVerilog module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | [`OperationIO`](#operationio) | the input/output interface of the subtractor |

###### Returns

[`Sig`](#sig)

the difference result

##### addConstSignal()

```ts
addConstSignal(
   name, 
   value, 
   isSigned?, 
   width?
): Sig;
```

add a constant literal signal to the generated SystemVerilog module

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `name` | `string` \| `undefined` | `undefined` | signal name |
| `value` | `bigint` | `undefined` | signal literal value |
| `isSigned` | `boolean` | `false` | whether the signal is signed or not |
| `width` | `number` \| `undefined` | `undefined` | bit width of the resulting signal |

###### Returns

[`Sig`](#sig)

##### addConstSignals()

```ts
addConstSignals(
   name, 
   values, 
   isSigned?, 
   width?
): Sig[];
```

add an array of constant literal signals to the generated SystemVerilog module

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `name` | `string` | `undefined` | signal name |
| `values` | `bigint`[] | `undefined` | the literal values of the array |
| `isSigned` | `boolean` | `false` | whether the signals are signed or not |
| `width` | `number` \| `undefined` | `undefined` | bit width of the resulting signals |

###### Returns

[`Sig`](#sig)[]

The array of signals

##### addAssign()

```ts
addAssign(io): Sig;
```

add a SystemVerilog continuous assign statement

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | \{ `in`: [`Expr`](#expr); `out`: `string` \| [`Sig`](#sig); \} | expression that is the right hand side of the assigment |
| `io.in` | [`Expr`](#expr) | - |
| `io.out` | `string` \| [`Sig`](#sig) | - |

###### Returns

[`Sig`](#sig)

signal that is the left hand side of the assignment

##### addMux()

```ts
addMux(io): Sig;
```

add a multiplexer to the TSSV module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | \{ `in`: (`string` \| [`Sig`](#sig) \| [`Expr`](#expr))[]; `sel`: `string` \| [`Sig`](#sig) \| [`Expr`](#expr); `out`: `string` \| [`Sig`](#sig); `default?`: `string` \| [`Sig`](#sig) \| [`Expr`](#expr); \} | The input/output signals connected to the multiplexer |
| `io.in` | (`string` \| [`Sig`](#sig) \| [`Expr`](#expr))[] | - |
| `io.sel` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | - |
| `io.out` | `string` \| [`Sig`](#sig) | - |
| `io.default?` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | - |

###### Returns

[`Sig`](#sig)

signal of the multiplexer output

##### addBody()

```ts
addBody(body, opts?): void;
```

Append a raw SystemVerilog snippet to this module's body.

By default (`indentMode: 'relative'`), the snippet is normalized before
being appended:
- Leading and trailing blank lines are removed.
- The minimum indentation shared by all non-empty lines is stripped,
  so indentation is computed relative to the snippet's own left margin.
- Three spaces of indentation are added to every line so the result sits
  correctly inside the generated `module … endmodule` block.
- A single trailing newline is guaranteed.

This makes it safe to pass indented template literals directly from
TypeScript without worrying about the surrounding indentation level.

Pass `indentMode: 'verbatim'` to append the string exactly as-is, skipping
the indent stripping and re-indentation. The trim and newline options still
apply in verbatim mode.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | `string` | SystemVerilog text to append. |
| `opts?` | \{ `indentMode?`: `"relative"` \| `"verbatim"`; `trimLeadingBlankLines?`: `boolean`; `trimTrailingBlankLines?`: `boolean`; `ensureTrailingNewline?`: `boolean`; \} | Optional settings. |
| `opts.indentMode?` | `"relative"` \| `"verbatim"` | `'relative'` (default) strips and re-indents relative to the snippet's own minimum indent; `'verbatim'` appends without modifying indentation. |
| `opts.trimLeadingBlankLines?` | `boolean` | Remove blank lines at the start of the snippet before processing. Defaults to `true`. |
| `opts.trimTrailingBlankLines?` | `boolean` | Remove blank lines at the end of the snippet before processing. Defaults to `true`. |
| `opts.ensureTrailingNewline?` | `boolean` | Guarantee the appended text ends with a newline. Defaults to `true`. |

###### Returns

`void`

##### addBodyLine()

```ts
addBodyLine(line): void;
```

Append a single pre-formatted SystemVerilog line to this module's body.

The line is appended verbatim with a trailing newline added. No indentation
normalization is performed — the caller is responsible for any leading
whitespace. Use [addBody](#addbody) when passing multi-line template literals
that benefit from automatic indent stripping.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `line` | `string` | A single line of SystemVerilog text (no trailing newline needed). |

###### Returns

`void`

##### debug()

```ts
debug(): void;
```

print some debug information to the console

###### Returns

`void`

##### formatParameterValue()

```ts
protected formatParameterValue(v): string;
```

Convert a ParameterValue into a compact, readable string suitable for Verilog comments.
Deterministic ordering for objects/records.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | [`ParameterValue`](#parametervalue) |

###### Returns

`string`

##### formatParametersForComment()

```ts
protected formatParametersForComment(params?, opts?): string;
```

Flatten parameters into `// key.path = value` lines.
Good for embedding at the top of generated Verilog.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`TSSVParameters`](#tssvparameters) |
| `opts?` | \{ `prefix?`: `string`; `skipName?`: `boolean`; \} |
| `opts.prefix?` | `string` |
| `opts.skipName?` | `boolean` |

###### Returns

`string`

##### formatParametersAsVerilogComment()

```ts
protected formatParametersAsVerilogComment(params?): string;
```

Convenience wrapper that emits a nice comment block.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`TSSVParameters`](#tssvparameters) |

###### Returns

`string`

##### writeSystemVerilog()

```ts
writeSystemVerilog(options?): string;
```

write the generated SystemVerilog code to a string

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`SVEmitOptions`](#svemitoptions) | controls emission across several files - see [SVEmitOptions](#svemitoptions). Applies to a top-level call only; the recursion into submodules passes nothing. |

###### Returns

`string`

string containing the generated SystemVerilog code for this module

## Interfaces

### TSSVParameters

#### Extended by

- [`RegisterBlockParameters`](Registers.md#registerblockparameters)
- [`Memory_Parameters`](Memory.md#memory_parameters)

#### Indexable

```ts
[name: string]: ParameterValue | undefined
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="name"></a> `name?` | `string` |

***

### SVEnum

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="typename"></a> `typeName` | `string` |
| <a id="width"></a> `width` | `number` |
| <a id="values"></a> `values` | `Record`\<`string`, `bigint`\> |

***

### baseSignal

signal parameters

#### Extended by

- [`Signal`](#signal)
- [`IOSignal`](#iosignal)

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="type"></a> `type?` | `"wire"` \| `"reg"` \| `"const logic"` \| `"logic"` \| `"enum"` |
| <a id="width-1"></a> `width?` | `number` |
| <a id="isclock"></a> `isClock?` | `"posedge"` \| `"negedge"` |
| <a id="isreset"></a> `isReset?` | `"lowasync"` \| `"highasync"` \| `"lowsync"` \| `"highsync"` |
| <a id="issigned"></a> `isSigned?` | `boolean` |
| <a id="isarray"></a> `isArray?` | `bigint` |
| <a id="description"></a> `description?` | `string` |
| <a id="enum"></a> `enum?` | [`SVEnum`](#svenum) |

***

### IOSignal

defines an IO signal (a.k.a port of the the TSSV module)

#### Extends

- [`baseSignal`](#basesignal)

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="type-1"></a> `type?` | `"wire"` \| `"reg"` \| `"const logic"` \| `"logic"` \| `"enum"` | [`baseSignal`](#basesignal).[`type`](#type) |
| <a id="width-2"></a> `width?` | `number` | [`baseSignal`](#basesignal).[`width`](#width-1) |
| <a id="isclock-1"></a> `isClock?` | `"posedge"` \| `"negedge"` | [`baseSignal`](#basesignal).[`isClock`](#isclock) |
| <a id="isreset-1"></a> `isReset?` | `"lowasync"` \| `"highasync"` \| `"lowsync"` \| `"highsync"` | [`baseSignal`](#basesignal).[`isReset`](#isreset) |
| <a id="issigned-1"></a> `isSigned?` | `boolean` | [`baseSignal`](#basesignal).[`isSigned`](#issigned) |
| <a id="isarray-1"></a> `isArray?` | `bigint` | [`baseSignal`](#basesignal).[`isArray`](#isarray) |
| <a id="description-1"></a> `description?` | `string` | [`baseSignal`](#basesignal).[`description`](#description) |
| <a id="enum-1"></a> `enum?` | [`SVEnum`](#svenum) | [`baseSignal`](#basesignal).[`enum`](#enum) |
| <a id="direction"></a> `direction` | [`PortDirection`](#portdirection) | - |

***

### SVImportOptions

options for `Module.addSystemVerilogSubmodule()`

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="modulename"></a> `moduleName?` | `string` | module to instantiate when the file declares more than one |
| <a id="veriblesyntaxpath"></a> `veribleSyntaxPath?` | `string` | path to verible-verilog-syntax, used to parse the module header (default: found on PATH) |

***

### Signal

signal parameters

#### Extends

- [`baseSignal`](#basesignal)

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="type-4"></a> `type?` | `"wire"` \| `"reg"` \| `"const logic"` \| `"logic"` \| `"enum"` | [`baseSignal`](#basesignal).[`type`](#type) |
| <a id="width-3"></a> `width?` | `number` | [`baseSignal`](#basesignal).[`width`](#width-1) |
| <a id="isclock-2"></a> `isClock?` | `"posedge"` \| `"negedge"` | [`baseSignal`](#basesignal).[`isClock`](#isclock) |
| <a id="isreset-2"></a> `isReset?` | `"lowasync"` \| `"highasync"` \| `"lowsync"` \| `"highsync"` | [`baseSignal`](#basesignal).[`isReset`](#isreset) |
| <a id="issigned-2"></a> `isSigned?` | `boolean` | [`baseSignal`](#basesignal).[`isSigned`](#issigned) |
| <a id="isarray-2"></a> `isArray?` | `bigint` | [`baseSignal`](#basesignal).[`isArray`](#isarray) |
| <a id="description-2"></a> `description?` | `string` | [`baseSignal`](#basesignal).[`description`](#description) |
| <a id="enum-2"></a> `enum?` | [`SVEnum`](#svenum) | [`baseSignal`](#basesignal).[`enum`](#enum) |
| <a id="value"></a> `value?` | `bigint` \| `bigint`[] | - |

***

### OperationIO

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="a"></a> `a` | `string` \| `bigint` \| [`Sig`](#sig) |
| <a id="b"></a> `b` | `string` \| `bigint` \| [`Sig`](#sig) |
| <a id="result"></a> `result?` | `string` \| [`Sig`](#sig) |

***

### SVEmitOptions

Options for a top-level `Module.writeSystemVerilog()` call, which is how a design is emitted
across more than one file.

An emission defines every module and interface it reaches, and by default each top-level call
starts from nothing — so emitting a DUT and then a testbench that instantiates it produces the
DUT twice, once per file. `exclude` carries the first emission's definitions into the second,
which then instantiates and references them instead of defining them again.

```typescript
const defined = new Set<string>()
const dutSV = dut.writeSystemVerilog({ defined })            // defines the DUT hierarchy
const tbSV = tb.writeSystemVerilog({ exclude: defined })     // references it
```

Whichever call runs first defines anything the two share, so emission order decides where a
shared interface lands. This is the rule that already governs a single emission — the first
module to need a definition emits it — extended across calls rather than reset between them.

Both files must be given to the simulator or synthesis tool together: the second no longer
defines what it references.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="exclude"></a> `exclude?` | `ReadonlySet`\<`string`\> | Module and interface names that a previous emission already defined. They are instantiated and referenced as usual, but not defined again. |
| <a id="defined"></a> `defined?` | `Set`\<`string`\> | If provided, receives the name of every module and interface this call defined. Names from `exclude` are not added, so passing one set as `defined` and then as `exclude` accumulates across an arbitrary number of files. |

***

### FormatterConfig

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="engine"></a> `engine` | `"internal"` \| `"off"` \| `"verible"` |
| <a id="veriblepath"></a> `veriblePath?` | `string` |
| <a id="veribleflags"></a> `veribleFlags?` | `string`[] |
| <a id="failonformaterror"></a> `failOnFormatError?` | `boolean` |
| <a id="formattimeoutms"></a> `formatTimeoutMs?` | `number` |

## Type Aliases

### IntRange

```ts
type IntRange<START, END, ARR, ACC> = ARR["length"] extends END ? ACC | START | END : IntRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR["length"]>;
```

IntRange type allows specifify a type that allows a range of integer values
Used in Parameter types on TSSV modules where the parameters have range restrictions

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `START` *extends* `number` | - |
| `END` *extends* `number` | - |
| `ARR` *extends* `unknown`[] | \[\] |
| `ACC` *extends* `number` | `never` |

***

### ParameterValue

```ts
type ParameterValue = 
  | string
  | boolean
  | bigint
  | IntRange<number, number>
  | bigint[]
  | string[]
  | IntRange<number, number>[]
  | object;
```

***

### PortDirection

```ts
type PortDirection = "input" | "output" | "inout";
```

***

### IOSignals

```ts
type IOSignals = Record<string, IOSignal>;
```

The IO interface bundle of a TSSV Module

***

### ExprParams

```ts
type ExprParams = Record<string, string | number | bigint>;
```

***

### Signals

```ts
type Signals = Record<string, Signal | undefined>;
```

***

### Interfaces

```ts
type Interfaces = Record<string, Interface>;
```

## Variables

### default

```ts
default: object;
```

#### Type Declaration

| Name | Type |
| ------ | ------ |
| <a id="property-module"></a> `Module` | *typeof* [`Module`](#module) |
| <a id="property-sig"></a> `Sig` | *typeof* [`Sig`](#sig) |
| <a id="property-expr"></a> `Expr` | *typeof* [`Expr`](#expr) |

## Functions

### serialize()

```ts
function serialize(
   obj, 
   indent?, 
   bigIntSuffix?
): string;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `obj` | `any` | `undefined` |
| `indent?` | `number` | `undefined` |
| `bigIntSuffix?` | `string` | `'n'` |

#### Returns

`string`

***

### deserialize()

```ts
function deserialize(serialized): any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `serialized` | `string` |

#### Returns

`any`

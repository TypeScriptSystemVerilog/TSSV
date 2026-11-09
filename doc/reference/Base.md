[**tssv**](README.md)

***

[tssv](README.md) / Base

# Base

## Classes

### Sig

container class of a TSSV signal used to pass signals
among add* primtives and submodules to define interconnections

#### Remarks

A `Sig` holds only a name: width and metadata live in the module's `IOs` and `signals`
tables, and two `Sig`s with the same name are the same signal. A builder takes a plain string
wherever it takes a `Sig`, and most return one, to pass to the next call
(`doc/framework/concepts.md` §3).

#### Constructors

##### Constructor

```ts
new Sig(name): Sig;
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | the signal's name in the module |

###### Returns

[`Sig`](#sig)

#### Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="type-2"></a> `type` | `readonly` | `"Sig"` | always `'Sig'`: tells a `Sig` from an `Expr` |

#### Methods

##### toString()

```ts
toString(): string;
```

###### Returns

`string`

the signal's name, so a `Sig` can go in a template string

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

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `def` | `string` \| ((`p`) => `string`) | the expression's SystemVerilog text, or a function that returns it from `params` |
| `params?` | [`ExprParams`](#exprparams) | the argument `def` is called with, when `def` is a function; default `{}` |

###### Returns

[`Expr`](#expr)

###### Throws

if `params` is given with a string `def`

#### Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="params"></a> `params` | `public` | [`ExprParams`](#exprparams) \| `null` | the argument a function `def` is called with; `null` for a string `def` |
| <a id="type-3"></a> `type` | `readonly` | `"Expr"` | always `'Expr'`: tells an `Expr` from a `Sig` |

#### Methods

##### toString()

```ts
toString(): string;
```

###### Returns

`string`

the expression's SystemVerilog text: `def`, or `def(params)`

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

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `name` | `string` | `undefined` | the base name of the SV interface type |
| `params` | [`TSSVParameters`](#tssvparameters) | `{}` | the parameters, whose values are appended to `name` to name the type |
| `role` | `string` \| `undefined` | `undefined` | the modport the module sees; omit it for a local bundle |
| `signals` | \{ \} | `{}` | the bundle's signals |

###### Returns

[`Interface`](#interface)

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="name-1"></a> `name` | `string` | the interface's base name; [Interface.interfaceName](#interfacename-1) appends the parameter values |
| <a id="params-1"></a> `params` | [`TSSVParameters`](#tssvparameters) | the parameters; their values name the SV interface type |
| <a id="signals-1"></a> `signals` | [`Signals`](#signals) | the bundle's signals, by name |
| <a id="role"></a> `role?` | `string` | the modport a module sees, which makes the instance a port of that module. An instance without a role is a local bundle: a signal of the module, not a port |
| <a id="modports"></a> `modports?` | `Record`\<`string`, `Record`\<`string`, [`PortDirection`](#portdirection)\>\> | each modport's signals and their directions, by modport name |

#### Methods

##### interfaceName()

```ts
interfaceName(): string;
```

The SV interface type's name: `name`, then each parameter value, joined with `_`. Two
instances bind only if their names match, so two `Memory` instances with different
`DATA_WIDTH`s are different types.

###### Returns

`string`

the SV interface type's name, e.g. `memory_bidi_32_32`

***

### Module

The Module class is the base class for all TSSV modules.

#### Remarks

A module class extends `Module`, calls `super(params, IOs?, signals?, body?)` in its
constructor, then describes its logic with the `add*()` builders below. Each builder checks
its arguments and records the result; [Module.writeSystemVerilogFiles](#writesystemverilogfiles) emits the SV
(`doc/framework/concepts.md` §1).

#### Extended by

- [`RegisterBlock`](Registers.md#registerblock)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `P` *extends* [`TSSVParameters`](#tssvparameters) | [`TSSVParameters`](#tssvparameters) |
| `IO` *extends* [`IOSignals`](#iosignals) | [`IOSignals`](#iosignals) |

#### Signals and ports

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

###### Remarks

An instance with a role is an interface port: the module header gets
`<interfaceName()>.<role> <instanceName>`. One without a role is a local bundle, declared
in the module as `<interfaceName()> <instanceName> ()`, for connecting two submodules
(`doc/framework/concepts.md` §4). Logic refers to a member as `<instanceName>.<SIGNAL>`.

###### Throws

`<instanceName> interface already exists` if the module already has an interface of that name

###### Example

**An inward Memory port**

```ts
// With a role ('inward'), the instance is a port of the module
m.addInterface('regs', new Memory({ DATA_WIDTH: 32, ADDR_WIDTH: 32 }, 'inward'))
// Logic names a member as <instance>.<SIGNAL>
m.addAssign({ in: new Expr('regs.ADDR'), out: 'addr' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__InterfaceExample__
`define DEF__InterfaceExample__
`ifdef USE_INCLUDES
`include "memory_bidi_32_32.sv"
`endif //USE_INCLUDES

module InterfaceExample (
    output logic [31:0] addr,
    memory_bidi_32_32.inward regs
);

  assign addr = regs.ADDR;

endmodule

`endif //!DEF__InterfaceExample__
```

##### ports()

```ts
ports(): ModulePorts;
```

This module's ports as seen from outside: its plain ports, in declaration order, then each
interface port with the signals of its modport, in the modport's order. A local interface
bundle (one without a role) is not a port. Wrappers that bring every port out, such as a
port contract's and the tests' lint wrappers (`ts/test/models/lintWrapper.ts`), are built from it.

###### Returns

[`ModulePorts`](PortContract.md#moduleports)

the ports, each with its direction, width and signedness

###### Throws

`<module>.<port>: no modport <role>` if an interface port's role names no modport

##### addNoCombinationalPathContract()

```ts
addNoCombinationalPathContract(from, to): void;
```

Promises that this module has no combinational path from input bit `from` to output bit
`to`: every path between them goes through a flop. scripts/check-port-contracts.mjs checks it
on every configuration a test generates, by tying `to` back into `from` in a wrapper and
linting it with Verilator, which reports any path as a combinational loop
(doc/framework/concepts.md, "Port contracts"). Declare it once the ports exist. The module's
SV names its contracts in a comment block after the Parameters block.

Each endpoint names one bit: a one-bit port (`'in_ready'`), a one-bit signal of an interface
port (`'in.ready'`), or one bit of a wider one (`'ready_bus[2]'`, `'out.ready_bus[2]'`). A
promise about a whole vector is one contract per bit.

[Module.writeSystemVerilogFiles](#writesystemverilogfiles) also writes `<outDir>/<name>.contracts.json` for a
module with contracts, holding the wrappers the check lints.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `from` | `string` | one bit of an input |
| `to` | `string` | one bit of an output |

###### Returns

`void`

###### Throws

`<module>: no combinational path from <from> to <to>: <problem>` if `from` isn't one
bit of an input or `to` one bit of an output: an endpoint that doesn't parse, a missing port,
interface port or signal, the wrong direction, a wide signal without `[i]`, a one-bit signal
with one, or a bit out of range

###### Throws

`<module>: no combinational path from <from> to <to> is already declared` for a
contract declared twice

###### Throws

`<module>.<port>: no modport <role>` if an interface port's role names no modport

###### Example

**A registered valid**

```ts
// Every path from in_valid to out_valid goes through a flop
m.addNoCombinationalPathContract('in_valid', 'out_valid')
```

The SystemVerilog it emits:

```sv
`ifndef DEF__ContractExample__
`define DEF__ContractExample__

module ContractExample (
    input  logic clk,
    input  logic rst_b,
    input  logic in_valid,
    output logic out_valid
);

  // ------------------------------------------------------------------
  // Port contracts, checked by TSSV's scripts/check-port-contracts.mjs
  // ------------------------------------------------------------------
  // no combinational path from in_valid to out_valid
  // ------------------------------------------------------------------

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      out_valid <= '0;
    end else begin
      out_valid <= in_valid;
    end

endmodule

`endif //!DEF__ContractExample__
```

##### portContracts

###### Get Signature

```ts
get portContracts(): readonly PortContract[];
```

The port contracts this module declares, in the order declared, as copies

###### Returns

readonly [`PortContract`](PortContract.md#portcontract)[]

##### addSignal()

```ts
addSignal(name, signal): Sig;
```

add a signal to the SystemVerilog module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | name of the signal |
| `signal` | [`Signal`](#signal) | parameters of the signal: `{}` for a 1-bit `logic` |

###### Returns

[`Sig`](#sig)

signal that can be passed to other add* functions to make connections

###### Remarks

The signal is declared in the module body, `logic [width-1:0] name;` by default, with
`signed`, its array range and its attributes if it has them. A builder that drives a `wire`
or untyped signal from an always block or a register turns it into `logic`.

###### Throws

`<name> signal already exists` if the module already has a port, signal or
interface member of that name

###### Example

**A signed internal signal**

```ts
const neg = m.addSignal('neg', { width: 8, isSigned: true })
m.addAssign({ in: new Expr('-a'), out: neg })
m.addAssign({ in: new Expr(`${neg.toString()} >>> 1`), out: 'y' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__SignalExample__
`define DEF__SignalExample__

module SignalExample (
    input  logic signed [7:0] a,
    output logic signed [7:0] y
);
  logic signed [7:0] neg;

  assign neg = -a;
  assign y   = neg >>> 1;

endmodule

`endif //!DEF__SignalExample__
```

##### addConstSignal()

```ts
addConstSignal(
   name, 
   value, 
   isSigned?, 
   width?
): Sig;
```

add a constant literal signal to the generated SystemVerilog module: `const logic [W-1:0] name = W'd<value>;`

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `name` | `string` \| `undefined` | `undefined` | signal name. Without one, `const_w<width><s|u><value>`, with `m` before the magnitude of a negative value. A name that is already a signal is returned as is, and nothing new is declared |
| `value` | `bigint` | `undefined` | signal literal value. It's declared with a sized literal at the signal's width. |
| `isSigned` | `boolean` | `false` | whether the signal is signed or not. A negative value is always signed |
| `width` | `number` \| `undefined` | `undefined` | bit width of the resulting signal. Default: the fewest bits that hold `value` ([Module.bitWidth](#bitwidth)) |

###### Returns

[`Sig`](#sig)

the constant's signal

###### Throws

`width:<width> is insufficient for value: <value>` for a `width` too narrow for `value`

###### Example

**An 8-bit constant**

```ts
const max = m.addConstSignal('MAX_LEVEL', 200n, false, 8)
m.addAssign({ in: new Expr(`level >= ${max.toString()}`), out: 'full' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__ConstSignalExample__
`define DEF__ConstSignalExample__

module ConstSignalExample (
    input logic [7:0] level,
    output logic full
);
  const logic [7:0] MAX_LEVEL = 8'd200;

  assign full = level >= MAX_LEVEL;

endmodule

`endif //!DEF__ConstSignalExample__
```

##### addConstSignals()

```ts
addConstSignals(
   name, 
   values, 
   isSigned?, 
   width?
): Sig[];
```

add an array of constant literal signals to the generated SystemVerilog module: one
[Module.addConstSignal](#addconstsignal) per value, named `<name>_0`, `<name>_1`, ...

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `name` | `string` | `undefined` | signal name: the prefix of each constant's name |
| `values` | `bigint`[] | `undefined` | the literal values of the array |
| `isSigned` | `boolean` | `false` | whether the signals are signed or not. A negative value's constant is always signed |
| `width` | `number` \| `undefined` | `undefined` | bit width of the resulting signals. Default: each value's own minimum width |

###### Returns

[`Sig`](#sig)[]

The array of signals

###### Throws

`width:<width> is insufficient for value: <value>` for a `width` too narrow for a value

###### Example

**Three coefficients at one width**

```ts
const coeffs = m.addConstSignals('COEFF', [3n, -5n, 12n], true, 6)
m.addAssign({ in: new Expr(coeffs.join(' + ')), out: 'total' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__ConstSignalsExample__
`define DEF__ConstSignalsExample__

module ConstSignalsExample (
    output logic signed [5:0] total
);
  const logic signed [5:0] COEFF_0 = 6'sd3;
  const logic signed [5:0] COEFF_1 = -6'sd5;
  const logic signed [5:0] COEFF_2 = 6'sd12;

  assign total = COEFF_0 + COEFF_1 + COEFF_2;

endmodule

`endif //!DEF__ConstSignalsExample__
```

#### Registers

##### addRegister()

```ts
addRegister(io): Sig;
```

add a DFF register(can be multi-bit) to the d input. `resetVal` must be a bigint constant
(SV guide SEQ-6). Emission checks the `always_ff` block the register goes in,
as it checks every always block, so `reset` must be the same kind (`isReset`) as every other
reset in the module (RST-2).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | [`RegisterIO`](#registerio) | the input/output of the register. With a reset, q resets to `resetVal` (default 0), written as `'0`, or as a literal sized to q |

###### Returns

[`Sig`](#sig)

return the q output signal

###### Remarks

Registers that share the same clock, reset and enable are merged into one `always_ff`
block. The reset's `isReset` metadata sets its polarity, and whether it is in the event
control:

| `isReset` | Event control | Reset condition |
|---|---|---|
| `'lowasync'` | `posedge clk or negedge rst_b` | `!rst_b` |
| `'highasync'` | `posedge clk or posedge rst` | `rst` |
| `'lowsync'` | `posedge clk` | `!rst_b` |
| `'highsync'` | `posedge clk` | `rst` |

The clock's edge comes from its `isClock`. A `q` that is a `wire` or has no type becomes
`logic`. `doc/framework/concepts.md` §6 has how the blocks are built.

###### Throws

`<signal> signal not found in addRegister()` for a `d`, `q`, `clk` or `reset` the
module doesn't have, or `<signal> array signal used as normal signal in addRegister()` for an array

###### Throws

`<d>_q signal already exists` if `q` is omitted and `<d>_q` exists

###### Throws

`addRegister(...) auto q naming only allowed when d is a simple signal, not an
expression` if `q` is omitted and `d` is an `Expr`

###### Throws

`<q> is unsupported signal type <type>` for a `q` that isn't `logic`, `reg`, `wire` or untyped

###### Throws

`<clk> is not a clock signal` or `<reset> is not a reset signal` for a `clk` without
`isClock` or a `reset` without `isReset`

###### Throws

`addRegister(<q>): resetVal must be a bigint constant ...` for a `resetVal` that isn't a bigint

###### Example

**An 8-bit register with an enable and an active-low asynchronous reset**

```ts
m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', en: 'en', q: 'q' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__RegisterExample__
`define DEF__RegisterExample__

module RegisterExample (
    input logic clk,
    input logic rst_b,
    input logic en,
    input logic [7:0] d,
    output logic [7:0] q
);

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else if (en) begin
      q <= d;
    end

endmodule

`endif //!DEF__RegisterExample__
```

#### Combinational logic

##### addCombAlways()

```ts
addCombAlways(io, body): void;
```

Add a combinational block: `always_comb`, or, with `inputs`, the older `always @( ... )` form.
[writeSystemVerilogFiles](#writesystemverilogfiles) checks the block against the SV guide, as it checks every always
block in the module: COMB-2 and COMB-3 apply to this one.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | \{ `inputs?`: (`string` \| [`Sig`](#sig))[]; `outputs`: (`string` \| [`Sig`](#sig))[]; \} | the signals the block assigns, which become `logic`; `inputs` gives a sensitivity list instead of `always_comb` |
| `io.inputs?` | (`string` \| [`Sig`](#sig))[] | the sensitivity list, each of which must exist: the header is then `always @( <a> or <b> ... )`. Without it, `always_comb`, which needs none |
| `io.outputs` | (`string` \| [`Sig`](#sig))[] | the signals the block assigns: each must exist, and one that is a `wire` or untyped becomes `logic` |
| `body` | `string` | the block's statements, usually `begin : <name> ... end`. If it holds `always`, the builder adds no header; the body's must then be `always @( ... )` over `inputs` |

###### Returns

`void`

###### Throws

`<signal> signal not found in addCombAlways()` for an input or output the module doesn't have

###### Throws

`<output> is unsupported signal type <type>` for an output that isn't `logic`, `reg`, `wire` or untyped

###### Throws

`Sensitivity mismatch: <list> : <body>` if the body has its own header and it doesn't
hold `@( <inputs> )`, or there are no `inputs`

###### Example

**An AND gate in an always\_comb block**

```ts
m.addCombAlways({ outputs: ['y'] }, `
  begin : and_gate
    y = a & b;
  end
`)
```

The SystemVerilog it emits:

```sv
`ifndef DEF__CombAlwaysExample__
`define DEF__CombAlwaysExample__

module CombAlwaysExample (
    input  logic a,
    input  logic b,
    output logic y
);

  always_comb begin : and_gate
    y = a & b;
  end

endmodule

`endif //!DEF__CombAlwaysExample__
```

##### addAssign()

```ts
addAssign(io): Sig;
```

add a SystemVerilog continuous assign statement: `assign <out> = <in>;`

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | \{ `in`: [`Expr`](#expr); `out`: `string` \| [`Sig`](#sig); \} | expression that is the right hand side of the assigment |
| `io.in` | [`Expr`](#expr) | the right-hand side, written as given; the core doesn't parse it |
| `io.out` | `string` \| [`Sig`](#sig) | the left-hand side, an existing `wire`, `logic` or untyped signal or port |

###### Returns

[`Sig`](#sig)

signal that is the left hand side of the assignment

###### Throws

`<out> signal not found in addAssign()` for an `out` the module doesn't have, or
`<out> array signal used as normal signal in addAssign()` for an array

###### Throws

`<out> signal must be either wire or logic in assign statement` for an `out` of another type

###### Example

**Masking a bus**

```ts
m.addAssign({ in: new Expr('data & mask'), out: 'masked' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__AssignExample__
`define DEF__AssignExample__

module AssignExample (
    input  logic [7:0] data,
    input  logic [7:0] mask,
    output logic [7:0] masked
);

  assign masked = data & mask;

endmodule

`endif //!DEF__AssignExample__
```

##### addMux()

```ts
addMux(io): Sig;
```

add a multiplexer to the TSSV module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | [`MuxIO`](#muxio) | The input/output signals connected to the multiplexer. `in` needs at least two entries, and `sel` picks one; a `sel` signal wider than it needs is sliced to its low bits. A signal input narrower than `out` is extended to it, with the input's signedness; one wider than `out` is an error. An `Expr` input is used as given. A `sel` value past the last input gives `default`, or all X. |

###### Returns

[`Sig`](#sig)

signal of the multiplexer output

###### Remarks

The mux is an `always_comb` block holding a `unique case` on `sel`, one item per input.

###### Throws

`addMux: <out> needs at least 2 inputs, got <n>` for fewer than two inputs

###### Throws

`<signal> signal not found in addMux()` for a `sel` or `out` signal the module doesn't
have, or `<signal> array signal used as normal signal in addMux()` for an array

###### Throws

`<sel> signal does not have enough bits as Mux select, ...` for a `sel` signal too narrow

###### Throws

`<out> is unsupported signal type <type>` for an `out` that isn't `logic`, `reg`, `wire` or untyped

###### Throws

`addMux: input <in> is <n> bits, wider than <out> (<m> bits)` for a signal input wider than `out`

###### Example

**A three-input multiplexer with a default**

```ts
m.addMux({ in: ['a', 'b', 'c'], sel: 'sel', out: 'out', default: 'a' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__MuxExample__
`define DEF__MuxExample__

module MuxExample (
    input  logic [3:0] a,
    input  logic [3:0] b,
    input  logic [3:0] c,
    input  logic [1:0] sel,
    output logic [3:0] out
);

  always_comb
    unique case (sel)
      2'd0: out = a;
      2'd1: out = b;
      2'd2: out = c;

      default: out = a;
    endcase

endmodule

`endif //!DEF__MuxExample__
```

#### Sequential logic

##### addSequentialAlways()

```ts
addSequentialAlways(io, body): void;
```

Add an `always_ff` block. The builder writes the header, `always_ff @(<clock edge> <clk> or
<reset edge> <reset>)`, from `clk` and `reset`; a body that has its own header must match it.
[writeSystemVerilogFiles](#writesystemverilogfiles) checks the block against the SV guide, as it checks every always
block in the module: COMB-2, SEQ-1, SEQ-4, SEQ-5, SEQ-6 and RST-2 apply to this one.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | \{ `clk`: `string` \| [`Sig`](#sig); `reset?`: `string` \| [`Sig`](#sig); `outputs`: (`string` \| [`Sig`](#sig))[]; \} | the block's clock, its reset if it has one, and the signals it assigns, which become `logic` |
| `io.clk` | `string` \| [`Sig`](#sig) | the clock; it must carry `isClock`, whose edge the header uses |
| `io.reset?` | `string` \| [`Sig`](#sig) | the reset; it must carry `isReset`. An asynchronous one joins the event control on its active edge; a synchronous one doesn't, and the body tests it |
| `io.outputs` | (`string` \| [`Sig`](#sig))[] | the signals the block assigns: each must exist, and one that is a `wire` or untyped becomes `logic` |
| `body` | `string` | the block's statements, usually `begin : <name> ... end`. If it holds `always_ff`, the builder adds no header, and the body's must name the clock edge and the reset edge |

###### Returns

`void`

###### Throws

`<output> signal not found in addSequentialAlways()` for an output the module doesn't have

###### Throws

`<output> is unsupported signal type <type>` for an output that isn't `logic`, `reg`, `wire` or untyped

###### Throws

`<signal> signal not found in addRegister()` for a `clk` or `reset` the module doesn't
have (the message names `addRegister`), or `<signal> array signal used as normal signal in addRegister()`

###### Throws

`<clk> is not a clock signal` or `<reset> is not a reset signal` for a `clk` without
`isClock` or a `reset` without `isReset`

###### Throws

`Sensitivity mismatch: <event control> : <body>` if the body's own header doesn't name the
clock and reset edges

###### Example

**A counter with an active-low asynchronous reset**

```ts
// The builder writes the header, always_ff @(posedge clk or negedge rst_b)
m.addSequentialAlways({ clk: 'clk', reset: 'rst_b', outputs: ['count'] }, `
  begin : count_up
    if (!rst_b) count <= '0;
    else        count <= count + 4'd1;
  end
`)
```

The SystemVerilog it emits:

```sv
`ifndef DEF__SequentialAlwaysExample__
`define DEF__SequentialAlwaysExample__

module SequentialAlwaysExample (
    input logic clk,
    input logic rst_b,
    output logic [3:0] count
);

  always_ff @(posedge clk or negedge rst_b) begin : count_up
    if (!rst_b) count <= '0;
    else count <= count + 4'd1;
  end

endmodule

`endif //!DEF__SequentialAlwaysExample__
```

##### addLatchAlways()

```ts
addLatchAlways(io, body): void;
```

Add an `always_latch` block, for a latch built by intent (TSSV guide BUILD-5).
[writeSystemVerilogFiles](#writesystemverilogfiles) checks the block against the SV guide, as it checks every always
block in the module: COMB-2 applies to this one.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | \{ `inputs?`: (`string` \| [`Sig`](#sig))[]; `outputs`: (`string` \| [`Sig`](#sig))[]; \} | the signals the block assigns, which become `logic`; `inputs` gives a sensitivity list instead of `always_latch` |
| `io.inputs?` | (`string` \| [`Sig`](#sig))[] | the sensitivity list, each of which must exist: the header is then `always @( <a> or <b> ... )`. Without it, `always_latch` |
| `io.outputs` | (`string` \| [`Sig`](#sig))[] | the signals the block assigns: each must exist, and one that is a `wire` or untyped becomes `logic` |
| `body` | `string` | the block's statements, usually `begin : <name> ... end`. If it holds `always`, the builder adds no header; the body's must then be `always @( ... )` over `inputs` |

###### Returns

`void`

###### Throws

`<signal> signal not found in addLatchAlways()` for an input or output the module doesn't have

###### Throws

`<output> is unsupported signal type <type>` for an output that isn't `logic`, `reg`, `wire` or untyped

###### Throws

`Sensitivity mismatch: <list> : <body>` if the body has its own header and it doesn't
hold `@( <inputs> )`, or there are no `inputs`

###### Example

**A transparent-high latch**

```ts
m.addLatchAlways({ outputs: ['q'] }, `
  begin : hold
    if (en) q = d;
  end
`)
```

The SystemVerilog it emits:

```sv
`ifndef DEF__LatchAlwaysExample__
`define DEF__LatchAlwaysExample__

module LatchAlwaysExample (
    input logic en,
    input logic [7:0] d,
    output logic [7:0] q
);

  always_latch begin : hold
    if (en) q = d;
  end

endmodule

`endif //!DEF__LatchAlwaysExample__
```

#### Arithmetic

##### addRound()

```ts
addRound(io, roundMode?): Sig;
```

add a rounding operation to scale down and reduce the bit width of a signal: `out` is
`in / 2^rShift`, rounded as `roundMode` says.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `io` | \{ `in`: `string` \| [`Sig`](#sig); `out`: `string` \| [`Sig`](#sig); `rShift`: `string` \| `number` \| [`Sig`](#sig); \} | `undefined` | the input/output signals of the round operation. `in` and `out` must have the same signedness. `rShift` determines the number of LSBs to round away. It can be either a literal constant, from 0 to `in`'s width minus 1, or a variable shift: an unsigned signal whose value stays in that range. When using a variable shift, care should be taken to minimize the number of bits to minimize the impact on the timing path of the resulting logic. Every mode but `rm` adds a bias before the shift. The sum is a signal named `<out>_biased`, one bit wider than `in`, so it can't overflow. A result that doesn't fit `out` keeps its low bits: `out` needs `in`'s width minus `rShift`, plus one bit, to hold every result. |
| `io.in` | `string` \| [`Sig`](#sig) | `undefined` | the signal to round; it must exist |
| `io.out` | `string` \| [`Sig`](#sig) | `undefined` | the signal that takes the result; it must exist, with `in`'s signedness. Declare it before the call |
| `io.rShift` | `string` \| `number` \| [`Sig`](#sig) | `undefined` | the number of bits to shift right: a number, or the name or `Sig` of an unsigned signal |
| `roundMode` | `"rp"` \| `"rm"` \| `"rz"` \| `"rn"` \| `"rna"` | `'rp'` | determines the type of rounding to apply: `rp` rounds half up (towards +∞), `rm` rounds down, `rz` rounds towards zero, `rn` rounds half to even, and `rna` rounds half away from zero |

###### Returns

[`Sig`](#sig)

the signal of the rounded result

###### Remarks

| `roundMode` | Rounds |
|---|---|
| `'rp'` (default) | half up, toward positive infinity |
| `'rm'` | down, toward negative infinity (floor): the shift alone |
| `'rz'` | toward zero; for an unsigned `in`, the same as `'rm'` |
| `'rn'` | half to even |
| `'rna'` | half away from zero; for an unsigned `in`, the same as `'rp'` |

###### Throws

`<signal> signal not found in addRound()` for an `in`, `out` or `rShift` signal the
module doesn't have, or `<signal> array signal used as normal signal in addRound()` for an array

###### Throws

`sign mode must match <in>, <out>` if `in` and `out` differ in signedness

###### Throws

`roundMode not found` for a mode not in the table

###### Throws

`addRound: rShift <n> must be an integer from 0 to <width - 1>` for a constant shift out of range

###### Throws

`right shift signal <rShift> must be unsigned` for a signed shift signal

###### Throws

`<out>_biased signal already exists` if the bias signal's name is taken

###### Example

**Round a 16-bit sum to 9 bits, dropping 8 bits, half to even**

```ts
// rounded has 16 - 8 + 1 bits, enough for every result
m.addRound({ in: 'sum', out: 'rounded', rShift: 8 }, 'rn')
```

The SystemVerilog it emits:

```sv
`ifndef DEF__RoundExample__
`define DEF__RoundExample__

module RoundExample (
    input  logic signed [15:0] sum,
    output logic signed [ 8:0] rounded
);
  logic signed [16:0] rounded_biased;

  assign rounded_biased = 17'(sum) + (sum[8] ? 17'sd128 : 17'sd127);
  assign rounded = 9'(rounded_biased >>> 8);

endmodule

`endif //!DEF__RoundExample__
```

##### addSaturate()

```ts
addSaturate(io, satMode?): Sig;
```

add a Saturate operation to limit the bit width of a signal without overflow

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `io` | \{ `in`: `string` \| [`Sig`](#sig); `out`: `string` \| [`Sig`](#sig); \} | `undefined` | the input and output signals of the saturation operation. They must have the same signedness. An `out` at least as wide as `in` gets `in` extended, except that `balanced` still clamps a signed `in` of the same width. |
| `io.in` | `string` \| [`Sig`](#sig) | `undefined` | the signal to saturate; it must exist |
| `io.out` | `string` \| [`Sig`](#sig) | `undefined` | the signal that takes the result; it must exist, with `in`'s signedness. Declare it before the call, at the width to saturate to |
| `satMode` | `"balanced"` \| `"none"` \| `"simple"` | `'simple'` | determines the behavior of the saturation. `simple` clamps `in` to `out`'s range. `balanced` clamps a signed `in` to a range symmetric about zero, from `-(2^(n-1) - 1)` to `2^(n-1) - 1` for an `n`-bit `out`; for an unsigned `in` it's `simple`. `none` doesn't clamp: an unsigned `in` keeps its low bits, and a signed `in` out of range keeps its sign and its low `n - 1` bits. |

###### Returns

[`Sig`](#sig)

signal of the result of the saturation

###### Remarks

| `satMode` | For an `n`-bit `out` |
|---|---|
| `'simple'` (default) | clamps to `[-2^(n-1), 2^(n-1) - 1]` if signed, `[0, 2^n - 1]` if unsigned |
| `'balanced'` | clamps a signed `in` to `[-(2^(n-1) - 1), 2^(n-1) - 1]`, the same magnitude both ways; an unsigned one as `'simple'` does |
| `'none'` | no clamp: an unsigned `in` keeps its low `n` bits; a signed `in` out of range keeps its sign and its low `n - 1` bits |

###### Throws

`<signal> signal not found in addSaturate()` for an `in` or `out` the module doesn't
have, or `<signal> array signal used as normal signal in addSaturate()` for an array

###### Throws

`sign mode must match <in>, <out>` if `in` and `out` differ in signedness

###### Example

**Saturate a signed 12-bit value to 8 bits**

```ts
m.addSaturate({ in: 'wide', out: 'narrow' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__SaturateExample__
`define DEF__SaturateExample__

module SaturateExample (
    input  logic signed [11:0] wide,
    output logic signed [ 7:0] narrow
);

  assign narrow = (wide > 12'sd127) ? 8'sd127 : (wide < -12'sd128) ? -8'sd128 : 8'(wide);

endmodule

`endif //!DEF__SaturateExample__
```

##### addMultiplier()

```ts
addMultiplier(io): Sig;
```

adds an arithmetic multiplier to the generated SystemVerilog module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | [`OperationIO`](#operationio) | the input/output interface of the multiplier. `a` and `b` are signals or bigint literals. If either is signed, or a negative literal, the product is signed, and an unsigned signal is converted with `$signed({1'b0, x})`. The product is written plain, `a * b`, with no operand casts. Without `result`, it's a new signal as wide as both operands together, which holds every product. With `result`, it's computed at `result`'s width; a narrower `result` gets one outer cast, `W'(a * b)`, which keeps the low bits, and logs a warning. A literal is written at its own width, with a sign bit in a signed product. A negative literal is negated: `a * -8n` gives `a * -5'sd8`. The rules are the SV guide's WIDTH-1 to WIDTH-4, and the same for [Module.addAdder](#addadder) and [Module.addSubtractor](#addsubtractor), except the auto-sized width. |

###### Returns

[`Sig`](#sig)

the product result

###### Throws

`<signal> signal not found in addOperation()` for an operand or `result` the module
doesn't have, or `<signal> array signal used as normal signal in addOperation()` for an array

###### Throws

`<result> must be signed` for an unsigned `result` of a signed product

###### Example

**A signed 8-bit by unsigned 4-bit product**

```ts
// Without result, the product is a new signal prod_samplexgain, 8 + 4 bits wide
const prod = m.addMultiplier({ a: 'sample', b: 'gain' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__MultiplierExample__
`define DEF__MultiplierExample__

module MultiplierExample (
    input logic signed [7:0] sample,
    input logic [3:0] gain,
    output logic signed [11:0] scaled
);
  logic signed [11:0] prod_samplexgain;

  assign prod_samplexgain = sample * $signed({1'b0, gain});
  assign scaled = prod_samplexgain;

endmodule

`endif //!DEF__MultiplierExample__
```

##### addAdder()

```ts
addAdder(io): Sig;
```

adds an arithmetic adder to the generated SystemVerilog module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | [`OperationIO`](#operationio) | the input/output interface of the adder. `a` and `b` are signals or bigint literals. If either is signed, or a negative literal, the sum is signed, and an unsigned signal is converted with `$signed({1'b0, x})`, which adds a bit. The sum is written plain, `a + b`, with no operand casts. Without `result`, it's a new signal one bit wider than the wider operand, which holds every sum. With `result`, it's computed at `result`'s width; a narrower `result` gets one outer cast, `W'(a + b)`, which keeps the low bits, and logs a warning. A literal is written at its own width, with a sign bit in a signed sum. A negative literal is negated: `a + -8n` gives `a + -5'sd8`. |

###### Returns

[`Sig`](#sig)

the sum result

###### Throws

`<signal> signal not found in addOperation()` for an operand or `result` the module
doesn't have, or `<signal> array signal used as normal signal in addOperation()` for an array

###### Throws

`<result> must be signed` for an unsigned `result` of a signed sum

###### Example

**An 8-bit signal plus a literal, into a named result**

```ts
// next is narrower than the 9-bit natural width: the sum keeps its low 8 bits, with a warning
m.addAdder({ a: 'count', b: 1n, result: 'next' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__AdderExample__
`define DEF__AdderExample__

module AdderExample (
    input  logic [7:0] count,
    output logic [7:0] next
);

  assign next = 8'(count + 1'd1);

endmodule

`endif //!DEF__AdderExample__
```

##### addSubtractor()

```ts
addSubtractor(io): Sig;
```

adds an arithmetic subtractor to the generated SystemVerilog module

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `io` | [`OperationIO`](#operationio) | the input/output interface of the subtractor: `a - b`. The widths and signedness follow [Module.addAdder](#addadder). |

###### Returns

[`Sig`](#sig)

the difference result

###### Throws

`<signal> signal not found in addOperation()` for an operand or `result` the module
doesn't have, or `<signal> array signal used as normal signal in addOperation()` for an array

###### Throws

`<result> must be signed` for an unsigned `result` of a signed difference

###### Example

**A signed difference, auto-sized**

```ts
// b is unsigned, so it is $signed({1'b0, b}), 9 bits: the difference is 10 bits, signed
const diff = m.addSubtractor({ a: 'a', b: 'b' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__SubtractorExample__
`define DEF__SubtractorExample__

module SubtractorExample (
    input logic signed [7:0] a,
    input logic [7:0] b,
    output logic signed [9:0] y
);
  logic signed [9:0] diff_axb;

  assign diff_axb = a - $signed({1'b0, b});
  assign y = diff_axb;

endmodule

`endif //!DEF__SubtractorExample__
```

#### Hierarchy

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

instantiate another module as a submodule

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `instanceName` | `string` | `undefined` | sets the instance name |
| `submodule` | [`Module`](#module) | `undefined` | the module to instantiate |
| `bindings` | `Record`\<`string`, `string` \| [`Sig`](#sig) \| `bigint`\> | `undefined` | define the connections of the submodule: a port name to a parent signal, a bigint constant, or a parent interface instance's name |
| `autoBind` | `boolean` | `true` | find signals in parent with matching name for signals that are not explicitly bound: each unbound port, and each unbound interface port, binds to the parent's port, signal or interface of the same name |
| `createMissing` | `boolean` | `false` | with `autoBind`, an unbound port that matches nothing in the parent gets a new internal signal of the port's width and metadata, and an unbound interface port a new role-less local bundle. It never adds a parent port: to bring a submodule's bus out, give the parent a port of the same interface type and bind to it |
| `autoWidthExtension` | `boolean` | `false` | extend a signal narrower than the input port it is bound to, instead of throwing: a new signal `ext_w<bits><s|u>_<signal>`, assigned the signal sign extended if it is signed and zero extended if not, binds to the port. Outputs aren't extended |

###### Returns

[`Module`](#module)

returns the resulting submodule instance

###### Remarks

Each binding connects a submodule port to a parent signal or port (a string or `Sig`,
`inst.SIGNAL` included), to a bigint constant, which becomes a `const logic` signal of the
port's width, or, for an interface port, to a parent interface instance. Every binding is
checked here:

- A signed signal binds only to a signed port. An unsigned signal on a signed port needs
  a port one bit wider than the signal.
- Widths must match, unless `autoWidthExtension` extends a narrower signal on an input.
- The signal's `type` must suit the port's direction: an input takes an input, `wire`,
  `reg`, `const logic`, `logic` or `enum`; an output an output, `wire`, `logic` or `enum`;
  an inout an inout or `wire`.
- An interface port binds to a parent interface of the same SV type
  ([Interface.interfaceName](#interfacename-1)). If the parent's instance has a role (it is a port),
  the roles must match; a role-less local bundle binds to any role.

With `autoBind`, an unbound output that matches nothing in the parent is left unconnected.
Without it, unbound ports aren't looked at. `doc/framework/concepts.md` §5 has the details.

###### Throws

`submodule with instance name <instanceName> already exists`

###### Throws

`unbound input on <submodule>: <port>` or `unbound interface on <submodule>: <port>`
when `autoBind` finds no match and `createMissing` is false

###### Throws

`<port> not found on module <submodule>` for a binding to a port the submodule doesn't have

###### Throws

`<signal> signal not found in addSubmodule()` for a binding to a signal the parent
doesn't have, or `<signal> array signal used as normal signal in addSubmodule()` for an array

###### Throws

`Error: signed signals can only be connected to signed ports, ...`

###### Throws

`Error: binding signal is too wide for port, ...`, or `Error: binding signal width mismatch, ...`
for a width that doesn't fit the port

###### Throws

`illegal binding <port>(<signal>)` for a signal type the port's direction doesn't take

###### Throws

`<port>: interface '<name>' not found in <parent>`,
`<port> interface type mismatch on <submodule>: <parent type> vs <child type>`, or
`<port> interface role mismatch on <submodule>` for an interface binding that fails its checks

###### Throws

`width:<width> is insufficient for value: <value>` for a bigint binding too wide for its port

###### Example

**Two instances of one module, chained**

```ts
// stage is a PipeStage module, with ports clk, rst_b, d and q. Its clk and rst_b
// bind to the parent's ports of the same name (autoBind)
m.addSubmodule('stage0', stage, { d: 'in', q: 'mid' })
m.addSubmodule('stage1', stage, { d: 'mid', q: 'out' })
```

The SystemVerilog it emits:

```sv
`ifndef DEF__SubmoduleExample__
`define DEF__SubmoduleExample__
`ifdef USE_INCLUDES
`include "PipeStage.sv"
`endif //USE_INCLUDES

module SubmoduleExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] in,
    output logic [7:0] out
);
  logic [7:0] mid;

  PipeStage stage0 (
      .d(in),
      .q(mid),
      .clk(clk),
      .rst_b(rst_b)
  );

  PipeStage stage1 (
      .d(mid),
      .q(out),
      .clk(clk),
      .rst_b(rst_b)
  );

endmodule

`endif //!DEF__SubmoduleExample__
```

##### addSystemVerilogSubmodule()

```ts
addSystemVerilogSubmodule(
   instanceName, 
   SVFilePath, 
   params, 
   bindings, 
   autoBind, 
   options
): Module;
```

instantiate a module from existing SystemVerilog files.  The module name and the
direction of each bound port are taken from the module's header.

`SVFilePath` is a path or a list of paths, each an SV file or a `.f` filelist that names
more files (see `expandSVFileList()` in `SVFileList.ts` for the rules). Environment variables in
a path, written `$NAME` or `${NAME}`, are expanded, and the path must then be absolute:
`$TSSV_ROOT/ts/test/leaf.sv`, not `ts/test/leaf.sv`. A path in a `.f` may be relative to the
`.f` file's directory.

`options.moduleName` names the module to instantiate, which one of the files must declare.
It is required, and never inferred from the files or their names.

The files themselves are emitted untouched. `writeSystemVerilogFiles()` writes each one once,
to a file of its own name, inside the include guard
`` `ifndef SVIMPORT__<file name without extension>__ ``, so SV that reaches a file more than
once, from two imports or from two emitted files compiled together, defines what it holds
once.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `instanceName` | `string` | the name of the instance |
| `SVFilePath` | `string` \| readonly `string`[] | the SystemVerilog files, and `.f` filelists naming them |
| `params` | [`TSSVParameters`](#tssvparameters) | SV parameter overrides for the instance |
| `bindings` | `Record`\<`string`, `string` \| [`Sig`](#sig)\> | map of submodule port name to parent signal |
| `autoBind` | `boolean` | automatically bind unbound ports to same-named parent signals |
| `options` | [`SVImportOptions`](#svimportoptions) | `moduleName`, the module to instantiate |

###### Returns

[`Module`](#module)

the imported submodule

###### Throws

`addSystemVerilogSubmodule('<instanceName>'): options.moduleName is required, ...` if
`options.moduleName` is missing or empty

###### Throws

if a path names an unset environment variable, is relative, or names no file, or a
`.f` holds a simulator option or reads itself ([SVFileList.expandSVFileList](SVFileList.md#expandsvfilelist))

###### Throws

`<file>: SystemVerilog syntax error at line <l>, column <c> near '<text>'` for a file
that doesn't parse

###### Throws

`module <moduleName> not found in <files>, which declare ...` if no file declares the module

###### Throws

`<port> is not a port of module <module> in <file>` for a binding to a port the module
doesn't have, or `<kind> port <port> of module <module> is not supported by addSystemVerilogSubmodule`
for an `interface` or `ref` port

###### Throws

`<param> does not exist!` for a falsy entry of `params` ([Module.setVerilogParameter](#setverilogparameter))

###### Throws

whatever [Module.addSubmodule](#addsubmodule) throws for the instance and its bindings

###### Example

**An existing SV adder, with its width set**

```ts
// The path starts with $TSSV_ROOT: a relative path throws
m.addSystemVerilogSubmodule('u_add', '$TSSV_ROOT/ts/doc-examples/core/sv/sat_add.sv',
  { W: 16n }, { a: 'x', b: 'z', y: 'sum' }, false, { moduleName: 'sat_add' })
```

The SystemVerilog it emits, next to an untouched copy of `sat_add.sv`:

```sv
`ifndef DEF__SVImportExample__
`define DEF__SVImportExample__
`ifdef USE_INCLUDES
`include "sat_add.sv"
`endif //USE_INCLUDES

module SVImportExample (
    input  logic [15:0] x,
    input  logic [15:0] z,
    output logic [15:0] sum
);

  sat_add #(
      .W(16)
  ) u_add (
      .a(x),
      .b(z),
      .y(sum)
  );

endmodule

`endif //!DEF__SVImportExample__
```

#### Raw SystemVerilog

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

###### Remarks

Use it for logic the `add*()` builders can't express. The text isn't parsed here, but
[Module.writeSystemVerilogFiles](#writesystemverilogfiles) checks the module's SV, raw text included: it must
parse, and every always block in it is checked against the SV guide.

###### Example

**A function and a use of it**

```ts
// The template literal's own indentation is stripped, and the text re-indented
m.addBody(`
    function automatic logic parity_of(input logic [7:0] d);
      return ^d;
    endfunction

    assign parity = parity_of(data);
`)
```

The SystemVerilog it emits:

```sv
`ifndef DEF__BodyExample__
`define DEF__BodyExample__

module BodyExample (
    input logic [7:0] data,
    output logic parity
);

  function automatic logic parity_of(input logic [7:0] d);
    return ^d;
  endfunction

  assign parity = parity_of(data);

endmodule

`endif //!DEF__BodyExample__
```

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

###### Example

**One assign, indented by the caller**

```ts
m.addBodyLine('   assign y = ~a;')
```

The SystemVerilog it emits:

```sv
`ifndef DEF__BodyLineExample__
`define DEF__BodyLineExample__

module BodyLineExample (
    input  logic a,
    output logic y
);

  assign y = ~a;

endmodule

`endif //!DEF__BodyLineExample__
```

#### Output and utilities

##### setVerilogParameter()

```ts
setVerilogParameter(param): void;
```

Marks a parameter to be passed as a SystemVerilog parameter override, `#(.P(value))`, wherever
this module is instantiated.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param` | `string` | the name of a key of [Module.params](#params-2) |

###### Returns

`void`

###### Remarks

TSSV modules resolve their own parameters during elaboration and declare no SV `parameter`s,
so this only makes sense for a module imported with
[Module.addSystemVerilogSubmodule](#addsystemverilogsubmodule), which does declare it. A string value is passed
quoted (`doc/framework/concepts.md` §2, "SystemVerilog parameters").

###### Throws

`<param> does not exist!` if the parameter is missing or falsy (`0`, `''` and
`false` included)

###### Throws

`unsupported type of parameter <param> in setVerilogParameter()` if its value isn't a
string, number or bigint

##### setFormatterConfig()

```ts
static setFormatterConfig(config): void;
```

Sets how [Module.writeSystemVerilogFiles](#writesystemverilogfiles) formats the SV it writes, for every module.
The default runs Verible and throws if it fails: `{ engine: 'verible', failOnFormatError: true }`.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`FormatterConfig`](#formatterconfig) | the formatter configuration; it replaces the whole previous one |

###### Returns

`void`

##### nameHash()

```ts
protected nameHash(value): string;
```

The hash a derived module name holds for a value that can't go into it as is: 41 bits of the
SHA-256 of the value's canonical JSON, as 8 lowercase base-36 characters (2^41 < 36^8). Text
that refers to the hash in a module's name, such as a parameter comment, should use it too.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | the parameter value |

###### Returns

`string`

8 characters from `0-9a-z`

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

the minimum bit width needed to represent the value. Signed, or for a negative
value, that includes a sign bit

###### Example

```typescript
this.bitWidth(255)       // 8
this.bitWidth(128, true) // 9: a sign bit too
this.bitWidth(-8)        // 4
```

##### debug()

```ts
debug(): void;
```

print some debug information to the console: the module's name, parameters, ports,
signals and body text

###### Returns

`void`

##### formatParametersForComment()

```ts
protected formatParametersForComment(params?, opts?): string;
```

Flatten parameters into `// key.path = value` lines.
Good for embedding at the top of generated Verilog.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`TSSVParameters`](#tssvparameters) | the parameters to list; default the module's |
| `opts?` | \{ `prefix?`: `string`; `skipName?`: `boolean`; \} | - |
| `opts.prefix?` | `string` | the text before each `key = value`; default `// ` |
| `opts.skipName?` | `boolean` | leave out `name`; default `true` |

###### Returns

`string`

one indented line per parameter, joined with newlines

###### Remarks

Keys are sorted; a nested object's keys are joined with `.`, and `undefined` values are left
out. A subclass overrides it to shorten a parameter, as [Registers.RegisterBlock](Registers.md#registerblock) does
for its register map.

##### writeSystemVerilogFiles()

```ts
writeSystemVerilogFiles(outDir): string[];
```

Writes this module and everything it reaches one definition per file: `<outDir>/<name>.sv`
for each module and each interface, each defined once.

Each file sits inside an include guard, `DEF__<name>__` for what it defines, and a module's
file includes the files of the interfaces it uses and the modules it instantiates directly:

```systemverilog
`ifndef DEF__mid__
`define DEF__mid__
`ifdef USE_INCLUDES
`include "memory_rd_only_32_32.sv"
`include "leaf.sv"
`endif //USE_INCLUDES

module mid
   ...
endmodule

`endif //!DEF__mid__
```

A module with no interfaces and no submodules, and every interface, has the guard only. The
guard lets a file be reached more than once, from two parents or from the command line as
well, and still define its module once.

```typescript
const files = top.writeSystemVerilogFiles('build/rtl')   // leaves first, top last
```

The files can be built two ways:
- With `USE_INCLUDES`, name only the top file and let the includes find the rest:
  `verilator --lint-only +define+USE_INCLUDES +incdir+build/rtl build/rtl/top.sv`
- Without it, name every file, on the command line or in a filelist:
  `verilator --lint-only <every path in files>`

The files a module imported with `addSystemVerilogSubmodule()` reads are written untouched,
each once, under its own name, inside its `SVIMPORT__<file name without extension>__` guard
and nothing else. A generated file never wraps one: the `DEF__` guard is for generated SV
only. A module that instantiates an imported one includes all of that import's files, in
order. Two different imported files that would share a guard throw, naming both. An imported
module has no generated SV of its own, so calling this on one throws: write the module that
instantiates it instead.

A module that declares port contracts ([addNoCombinationalPathContract](#addnocombinationalpathcontract)) also gets
`<outDir>/<name>.contracts.json`, which holds the wrappers scripts/check-port-contracts.mjs
lints to check them. It isn't SV, so it isn't among the paths returned.

Generated names must be legal SystemVerilog identifiers, because they name files and macros.
No two files' names may differ only in case, because they are one file on macOS and Windows.
Two different modules with the same name are still written as one (#122). Files already in
`outDir` that this call doesn't write are left in place. Every file is generated before
any is written, so a call that throws writes nothing.

Each module it writes is checked against the SV guide first: `verible-verilog-syntax`
parses the module's SV, and every always block in it is checked, whether a builder or raw
SV ([addBody](#addbody)) wrote it. A syntax error or a broken rule throws, and the error lists
every violation in the module. The check runs before formatting, and throws whatever the
formatter configuration says, `failOnFormatError: false` and `engine: 'off'` included. The
module's signal table says which signals are resets (`isReset`), of which kind, and which
are constants. The rules:
- COMB-2: a local declared with an initializer must be `automatic`.
- COMB-3: no nonblocking assignments in a combinational block: `always_comb`, `always @*`,
  or `always` with a list of levels. `<=` as a comparison, as in `if (a <= b)`, is fine.
- SEQ-1: in a sequential block (`always_ff`, or `always` with an edge), `=` only for the
  block's own locals; every other assignment uses `<=`.
- SEQ-4: a sequential block has one clock, on `posedge` or `negedge`. Every term of its
  event control that isn't a reset is a clock.
- SEQ-5: an async reset is in the event control, on its active edge; a sync reset isn't.
- SEQ-6: in a reset branch, no assignment reads one of the module's signals, ports or
  interfaces. Constants, parameters and enum values are fine. A reset branch is the `if`
  branch of `if (!rst_n)` or the `else` branch of `if (rst_n)`; for an active-high reset, of
  `if (rst)` or `if (!rst)`.
- RST-2: the module's sequential blocks use one reset kind.
- RST-4: a reset isn't generated in logic. This covers each reset that isn't an input port,
  and each signal bound to a submodule's reset port. Each must be driven by a submodule
  output or a sequential block, or be assigned one of those or an input: as it is, one bit
  of it, or inverted (`!r`, `~r`).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `outDir` | `string` | the directory to write to, created if it doesn't exist |

###### Returns

`string`[]

the paths written, each after every file it includes, so this module's is last

###### Throws

`writeSystemVerilogFiles: <name> was imported with addSystemVerilogSubmodule(), ...`
when called on an imported module

###### Throws

`<module>: <violation>`, or `<module>: <n> SV-guide violations: ...`, for a module whose SV
doesn't parse or breaks one of the rules above

###### Throws

`writeSystemVerilogFiles: ... can't name a file and its include guard: ...` for a name
that isn't a legal identifier, `writeSystemVerilogFiles: ... and ... would be written to ...`
for two names that differ only in case, and `writeSystemVerilogFiles: <file> and <file> would
both be guarded by <guard>, ...` for two imported files that would share a guard

###### Throws

`<port>: Array IOs not supported` for a port with `isArray`, `<name> has role/modport
inconsistency` or `<name> : inconsistent modports` for an interface port whose role names no
modport, and an error naming the declaration for a bad attribute (an illegal name, a string
holding a quote, backslash or newline, an unsupported value, or any attribute on an interface signal)

###### Throws

the formatter's diagnostic, if it fails and `failOnFormatError` is true (the default)

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
| `params` | `P` | `...` | parameter value bundle. Without a `name`, the module name is `<ClassName>_` followed by one segment per other key, sorted by key (`doc/framework/concepts.md` §2) |
| `IOs` | `IO` | `...` | IO port bundle |
| `signals` | \{ \} | `{}` | signal bundle: internal signals declared up front |
| `body` | `string` | `''` | SystemVerilog body text, emitted verbatim in the module body |

###### Returns

[`Module`](#module)\<`P`, `IO`\>

#### Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="name-2"></a> `name` | `readonly` | `string` | name contains the resulting SystemVerilog module name: `params.name` if it is set, otherwise one derived from the class name and the parameter values (`doc/framework/concepts.md` §2) |
| <a id="params-2"></a> `params` | `protected` | `P` | the module's parameters, as passed to the constructor, with `name` set to the module name |
| <a id="ios"></a> `IOs` | `protected` | `IO` | the module's plain ports, by name. A subclass may assign it in its constructor, after `super()` |
| <a id="submodules"></a> `submodules` | `protected` | `Record`\<`string`, \{ `module`: [`Module`](#module); `bindings`: `Record`\<`string`, `string` \| [`Sig`](#sig) \| `bigint`\>; \}\> | the submodule instances [Module.addSubmodule](#addsubmodule) added, by instance name |
| <a id="interfaces-1"></a> `interfaces` | `protected` | [`Interfaces`](#interfaces) | the interface instances [Module.addInterface](#addinterface) added, by instance name: its interface ports and local bundles |
| <a id="body"></a> `body` | `protected` | `string` | - |

## Interfaces

### TSSVParameters

A module's parameters, the first argument of [Module](#module)'s constructor. Each module class
extends it with its own keys.

#### Extended by

- [`RegisterBlockParameters`](Registers.md#registerblockparameters)
- [`Memory_Parameters`](Memory.md#memory_parameters)

#### Indexable

```ts
[name: string]: ParameterValue | undefined
```

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="name"></a> `name?` | `string` | the SystemVerilog module name. Without it, the name is derived from the class name and the other parameters' values (`doc/framework/concepts.md` §2); the constructor then sets it |

***

### SVEnum

A SystemVerilog enum type for a signal of type `'enum'`: its type name, width and values

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="typename"></a> `typeName` | `string` | the enum's type name |
| <a id="width"></a> `width` | `number` | the width of the enum's base type, in bits |
| <a id="values"></a> `values` | `Record`\<`string`, `bigint`\> | each enumerator's name and value |

***

### baseSignal

signal parameters, shared by [Signal](#signal) and [IOSignal](#iosignal)

#### Extended by

- [`IOSignal`](#iosignal)
- [`Signal`](#signal)

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="type"></a> `type?` | `"const logic"` \| `"wire"` \| `"reg"` \| `"logic"` \| `"enum"` | the declaration's SystemVerilog type; default `'logic'`. `'const logic'` is a constant's, set by [Module.addConstSignal](#addconstsignal) |
| <a id="width-1"></a> `width?` | `number` | the width in bits; default 1. A width over 1 is declared `[width-1:0]` |
| <a id="isclock"></a> `isClock?` | `"posedge"` \| `"negedge"` | marks a clock and its active edge. [Module.addRegister](#addregister) and [Module.addSequentialAlways](#addsequentialalways) need it on their `clk` |
| <a id="isreset"></a> `isReset?` | `"lowasync"` \| `"highasync"` \| `"lowsync"` \| `"highsync"` | marks a reset: its active level, and whether it is asynchronous (in the `always_ff` event control) or synchronous. The builders that take a `reset` read its polarity from here |
| <a id="issigned"></a> `isSigned?` | `boolean` | declares the signal `signed` |
| <a id="isarray"></a> `isArray?` | `bigint` | makes an internal signal an unpacked array of this many entries, `name [0:N-1]`. Ports can't be arrays |
| <a id="description"></a> `description?` | `string` | a description of the signal for readers and tools; the core doesn't emit it |
| <a id="enum"></a> `enum?` | [`SVEnum`](#svenum) | the enum type of a signal of type `'enum'`; the core doesn't emit it |
| <a id="attributes"></a> `attributes?` | [`SVAttributes`](#svattributes) | attributes emitted in front of the declaration, as `(* name = value *)`. Not supported on interface signals. |

***

### IOSignal

defines an IO signal (a.k.a port of the the TSSV module)

#### Extends

- [`baseSignal`](#basesignal)

#### Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="type-1"></a> `type?` | `"const logic"` \| `"wire"` \| `"reg"` \| `"logic"` \| `"enum"` | the declaration's SystemVerilog type; default `'logic'`. `'const logic'` is a constant's, set by [Module.addConstSignal](#addconstsignal) | [`baseSignal`](#basesignal).[`type`](#type) |
| <a id="width-2"></a> `width?` | `number` | the width in bits; default 1. A width over 1 is declared `[width-1:0]` | [`baseSignal`](#basesignal).[`width`](#width-1) |
| <a id="isclock-1"></a> `isClock?` | `"posedge"` \| `"negedge"` | marks a clock and its active edge. [Module.addRegister](#addregister) and [Module.addSequentialAlways](#addsequentialalways) need it on their `clk` | [`baseSignal`](#basesignal).[`isClock`](#isclock) |
| <a id="isreset-1"></a> `isReset?` | `"lowasync"` \| `"highasync"` \| `"lowsync"` \| `"highsync"` | marks a reset: its active level, and whether it is asynchronous (in the `always_ff` event control) or synchronous. The builders that take a `reset` read its polarity from here | [`baseSignal`](#basesignal).[`isReset`](#isreset) |
| <a id="issigned-1"></a> `isSigned?` | `boolean` | declares the signal `signed` | [`baseSignal`](#basesignal).[`isSigned`](#issigned) |
| <a id="isarray-1"></a> `isArray?` | `bigint` | makes an internal signal an unpacked array of this many entries, `name [0:N-1]`. Ports can't be arrays | [`baseSignal`](#basesignal).[`isArray`](#isarray) |
| <a id="description-1"></a> `description?` | `string` | a description of the signal for readers and tools; the core doesn't emit it | [`baseSignal`](#basesignal).[`description`](#description) |
| <a id="enum-1"></a> `enum?` | [`SVEnum`](#svenum) | the enum type of a signal of type `'enum'`; the core doesn't emit it | [`baseSignal`](#basesignal).[`enum`](#enum) |
| <a id="attributes-1"></a> `attributes?` | [`SVAttributes`](#svattributes) | attributes emitted in front of the declaration, as `(* name = value *)`. Not supported on interface signals. | [`baseSignal`](#basesignal).[`attributes`](#attributes) |
| <a id="direction"></a> `direction` | [`PortDirection`](#portdirection) | the port's direction, seen from inside the module | - |

***

### SVImportOptions

options for `Module.addSystemVerilogSubmodule()`

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="modulename"></a> `moduleName` | `string` | the module to instantiate, which one of the files must declare. Required: it's never inferred |

***

### Signal

An internal signal of a module: the second argument of [Module.addSignal](#addsignal)

#### Extends

- [`baseSignal`](#basesignal)

#### Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="type-4"></a> `type?` | `"const logic"` \| `"wire"` \| `"reg"` \| `"logic"` \| `"enum"` | the declaration's SystemVerilog type; default `'logic'`. `'const logic'` is a constant's, set by [Module.addConstSignal](#addconstsignal) | [`baseSignal`](#basesignal).[`type`](#type) |
| <a id="width-3"></a> `width?` | `number` | the width in bits; default 1. A width over 1 is declared `[width-1:0]` | [`baseSignal`](#basesignal).[`width`](#width-1) |
| <a id="isclock-2"></a> `isClock?` | `"posedge"` \| `"negedge"` | marks a clock and its active edge. [Module.addRegister](#addregister) and [Module.addSequentialAlways](#addsequentialalways) need it on their `clk` | [`baseSignal`](#basesignal).[`isClock`](#isclock) |
| <a id="isreset-2"></a> `isReset?` | `"lowasync"` \| `"highasync"` \| `"lowsync"` \| `"highsync"` | marks a reset: its active level, and whether it is asynchronous (in the `always_ff` event control) or synchronous. The builders that take a `reset` read its polarity from here | [`baseSignal`](#basesignal).[`isReset`](#isreset) |
| <a id="issigned-2"></a> `isSigned?` | `boolean` | declares the signal `signed` | [`baseSignal`](#basesignal).[`isSigned`](#issigned) |
| <a id="isarray-2"></a> `isArray?` | `bigint` | makes an internal signal an unpacked array of this many entries, `name [0:N-1]`. Ports can't be arrays | [`baseSignal`](#basesignal).[`isArray`](#isarray) |
| <a id="description-2"></a> `description?` | `string` | a description of the signal for readers and tools; the core doesn't emit it | [`baseSignal`](#basesignal).[`description`](#description) |
| <a id="enum-2"></a> `enum?` | [`SVEnum`](#svenum) | the enum type of a signal of type `'enum'`; the core doesn't emit it | [`baseSignal`](#basesignal).[`enum`](#enum) |
| <a id="attributes-2"></a> `attributes?` | [`SVAttributes`](#svattributes) | attributes emitted in front of the declaration, as `(* name = value *)`. Not supported on interface signals. | [`baseSignal`](#basesignal).[`attributes`](#attributes) |
| <a id="value"></a> `value?` | `bigint` \| `bigint`[] | a constant's value, set by [Module.addConstSignal](#addconstsignal) and [Module.addConstSignals](#addconstsignals) | - |

***

### OperationIO

The `io` of [Module.addAdder](#addadder), [Module.addSubtractor](#addsubtractor) and [Module.addMultiplier](#addmultiplier)

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="a"></a> `a` | `string` \| `bigint` \| [`Sig`](#sig) | the first operand: a signal, or a literal written at its own width |
| <a id="b"></a> `b` | `string` \| `bigint` \| [`Sig`](#sig) | the second operand: a signal, or a literal written at its own width |
| <a id="result"></a> `result?` | `string` \| [`Sig`](#sig) | the output, an existing signal or port; the operation is computed at its width. Default: a new signal sized to hold every result, named `prod_<a>x<b>`, `sum_<a>x<b>` or `diff_<a>x<b>` |

***

### MuxIO

The `io` of [Module.addMux](#addmux): the inputs, the select, the output and the default

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="in"></a> `in` | (`string` \| [`Sig`](#sig) \| [`Expr`](#expr))[] | the inputs, at least two: input `i` is selected when `sel` is `i`. A signal input narrower than `out` is extended to it, with the input's signedness; one wider than `out` is an error. An `Expr` input is used as given |
| <a id="sel"></a> `sel` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | the select. A signal needs at least `ceil(log2(in.length))` bits; a wider one is sliced to its low bits. An `Expr` is used as given |
| <a id="out"></a> `out` | `string` \| [`Sig`](#sig) | the output, an existing signal or port. A `wire` or untyped one becomes `logic` |
| <a id="default"></a> `default?` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | what `out` takes for a `sel` past the last input; default all X |

***

### RegisterIO

The `io` of [Module.addRegister](#addregister): the register's inputs, its output, and its reset value

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="d"></a> `d` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | the D input: a signal, or an expression. With an expression, `q` is required |
| <a id="clk"></a> `clk` | `string` \| [`Sig`](#sig) | the clock; it must carry `isClock` metadata, whose edge the register uses |
| <a id="reset"></a> `reset?` | `string` \| [`Sig`](#sig) | the reset; it must carry `isReset` metadata, which gives its polarity and whether it is asynchronous. Without it, the register has no reset |
| <a id="resetval"></a> `resetVal?` | `bigint` | the value `q` takes on reset; default 0, written as `'0`. Any other value is written as a literal sized to `q`. It must be a bigint constant (SV guide SEQ-6) |
| <a id="en"></a> `en?` | `string` \| [`Sig`](#sig) \| [`Expr`](#expr) | the clock enable: `q` loads `d` only while it is high. Without it, `q` loads `d` on every clock edge |
| <a id="q"></a> `q?` | `string` \| [`Sig`](#sig) | the Q output, an existing signal or port. Default: a new internal signal `<d>_q` with `d`'s width, signedness and other metadata, except its attributes |

***

### FormatterConfig

How [Module.writeSystemVerilogFiles](#writesystemverilogfiles) formats the SV it writes: [Module.setFormatterConfig](#setformatterconfig)

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="engine"></a> `engine` | `"internal"` \| `"off"` \| `"verible"` | `'verible'` runs `verible-verilog-format`; `'internal'` and `'off'` leave the text as generated |
| <a id="veriblepath"></a> `veriblePath?` | `string` | the formatter binary; default `verible-verilog-format` on `PATH` |
| <a id="veribleflags"></a> `veribleFlags?` | `string`[] | extra command-line flags for the formatter |
| <a id="failonformaterror"></a> `failOnFormatError?` | `boolean` | on a formatter failure (Verible missing, a timeout, a crash, or a syntax error), throw rather than warn and return the text unformatted. It covers only the formatter: a syntax error in a module fails the check `writeSystemVerilogFiles()` runs on that module first, whatever this says. |
| <a id="formattimeoutms"></a> `formatTimeoutMs?` | `number` | how long the formatter may run on one file, in milliseconds; default 60000 |

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

A value a module parameter can take: an entry of [TSSVParameters](#tssvparameters)

***

### SVAttributes

```ts
type SVAttributes = Record<string, string | number | bigint | true>;
```

SystemVerilog attributes for a signal or port declaration, keyed by attribute name.
A string value is emitted quoted, a number or bigint bare, and `true` as the name alone.

#### Example

```typescript
this.addSignal('mem', { width: 8, isArray: 4n, attributes: { ram_style: 'distributed' } })
// (* ram_style = "distributed" *) logic [7:0] mem[0:3];
```

***

### PortDirection

```ts
type PortDirection = "input" | "output" | "inout";
```

The direction of a port, or of an interface signal in a modport

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

The parameters of an [Expr](#expr) built from a function: the function's argument

***

### Signals

```ts
type Signals = Record<string, Signal | undefined>;
```

A module's internal signals, by name

***

### Interfaces

```ts
type Interfaces = Record<string, Interface>;
```

A module's interface instances, by instance name

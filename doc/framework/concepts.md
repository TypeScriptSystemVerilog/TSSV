# How a TSSV module is elaborated and emitted

This guide explains how the core works as a system: what happens between `new MyModule(...)`
and the SystemVerilog text that `writeSystemVerilog()` returns. It is for engineers and agents
new to TSSV, and for anyone reviewing a change to `ts/src/core/`.

It doesn't list signatures. For those, follow the links into the generated reference in
[`doc/reference/`](../reference/README.md). For a worked module, read the
[FIR tutorial](../tutorials/fir.md); for register blocks, [registers.md](registers.md); for
signal bundles, [adding-an-interface.md](../interfaces/adding-an-interface.md).

Statements below describe the code on `main`. Where the code doesn't check something you might
expect it to, the guide says so.

## 1. The lifecycle: describe, then emit

A TSSV module is a TypeScript object that describes one SystemVerilog module. Building one has
two phases.

1. **Elaboration.** The constructor calls `super(params, ...)` and then `this.add*()` methods.
   Each call checks its arguments against what the module already holds and records the result
   in the module's tables. No SystemVerilog file is written.
2. **Emission.** `writeSystemVerilog()` walks those tables, the module's own and its
   submodules', and returns the whole design as one string. Writing it to a file is up to the
   caller.

```typescript
import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'

interface Accum_Parameters extends TSSVParameters {
  width: number
}

class Accum extends Module {
  declare params: Accum_Parameters
  constructor (params: Accum_Parameters) {
    super(params)                                    // fixes this.name: Accum_8
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      in: { direction: 'input', width: params.width },
      sum: { direction: 'output', width: params.width }
    }
    this.addRegister({                               // recorded, not yet emitted
      d: new Expr('sum + in'), clk: 'clk', reset: 'rst_b', q: 'sum'
    })
  }
}

const sv = new Accum({ width: 8 }).writeSystemVerilog()   // emission happens here
```

What each table holds, and which calls fill it:

| Table | Holds | Filled by |
|---|---|---|
| `IOs` | Ports: name → direction, width and metadata | Assigned in the constructor; `RegisterBlock` also adds to it |
| `signals` | Internal signals, by name | `addSignal`, `addConstSignal`, and calls that create a signal for you |
| `interfaces` | Interface instances, ports and local bundles alike | `addInterface` |
| `submodules` | Child instances with their port bindings | `addSubmodule`, `addSystemVerilogSubmodule` |
| `registerBlocks` | Flops, grouped by clock, reset and enable | `addRegister` |
| `body` | Raw SystemVerilog text, appended in call order | `addAssign`, `add*Always`, `addMux`, the arithmetic helpers, `addBody`, `addBodyLine` |

What follows from this design:

- **Most errors surface at elaboration.** An unbound input, a width mismatch, a missing clock
  flag: the `add*()` call that causes it throws, with the constructor on the stack. Emission
  itself can still fail. An array port, a role with no matching modport, or a Verible
  formatting failure (§7) throws there.
- **Order inside the constructor matters for lookups, not for output position.** A call can
  only refer to signals that already exist when it runs. Where the result lands in the emitted
  module is fixed by the table it goes into, not by call order (§7).
- **A module can also be built without a subclass.** `new Module(params, IOs, signals, body)`
  is enough for a testbench or a wrapper. `ts/test/test_import.ts` builds its testbench this
  way.

## 2. Parameters and the module name

The first constructor argument is a parameter bag that extends `TSSVParameters`: any keys you
like, plus an optional `name`. Parameters are TypeScript values that the constructor uses to
decide what to build. They don't become SystemVerilog `parameter`s: every distinct set of
values produces its own SV module.

The SV module name is fixed in `super()`:

- If `params.name` is a string, it is the module name.
- Otherwise the name is `<ClassName>_<value>_<value>...`: the class name, then every parameter
  *value* (not key) in insertion order, joined by `_`. `undefined` values are skipped. Objects
  and arrays are replaced by a 7-character base-36 hash of their JSON.

| Parameters | Module name |
|---|---|
| `{ width: 8, mode: 'fast', flag: true, big: 5n, skip: undefined }` on class `Adder` | `Adder_8_fast_true_5` |
| `{ width: 8, taps: [1n, 2n] }` on class `Adder` | `Adder_8_1p9jptr` |
| `{ name: 'my_add', width: 8 }` | `my_add` |

Either way, `this.name` is then written back into `this.params.name`, so after `super()` it is
always set. Every parameter except `name` is also listed in a comment block at the top of the
emitted module.

**Emission keeps the first definition for each module name and drops the rest** (§7). Two
instances with the same name are assumed to be the same module. That makes the name a promise,
and it is up to you to keep it. Set `name` explicitly when:

- **The module's structure depends on anything other than its parameter values**, such as a
  constructor argument outside `params` or a global. `RegisterBlock` is the standing example:
  its register map is a separate argument, so two unnamed blocks with different maps are both
  named `RegisterBlock_Memory_little`. The second block's definition is silently dropped, and
  its instance points at the first block's definition.
- **A value doesn't make a legal SV identifier.** A string value with a hyphen or space, or a
  negative number, goes into the name as-is.
- **Something outside TSSV refers to the module by name**: a testbench top, a Makefile's top
  module, a hand-written instantiation. A derived name changes whenever a parameter is added.

### SystemVerilog parameters

TSSV modules don't declare SV `parameter`s. A module's own parameters are resolved during
elaboration, so the emitted module has none.
[`setVerilogParameter()`](../reference/Base.md#setverilogparameter) marks a parameter to be
passed as an override (`#(.P(value))`) wherever the module is *instantiated*. That only makes
sense for an imported SV module, which does declare it (§8). Two limits apply. The value must be
a string, number or bigint. It must also be truthy: `0`, `''` and `false` are rejected with
`<P> does not exist!` ([#85](https://github.com/TypeScriptSystemVerilog/TSSV/issues/85)).

## 3. Signals: `Sig`, `Expr` and signal metadata

The core resolves every signal by name. A [`Sig`](../reference/Base.md#sig) holds only a name.
It doesn't carry width or type, and two `Sig`s with the same name are the same signal. Most
methods accept a plain string wherever they accept a `Sig`. They return `Sig`s so the result
can be passed to the next call.

To resolve a name, the core looks in `IOs` first, then in `signals`, then, for a name of the
form `inst.SIG`, in the signals of the interface instance `inst`. A method that needs the
signal throws if none of these has it.

The metadata lives in those tables, as the `IOSignal` (ports) and `Signal` (internal) entries:

| Field | Meaning | Used by |
|---|---|---|
| `width` | Bit width; `undefined` means 1 | Declarations, binding checks, auto-sized results |
| `isSigned` | Declared `signed` | Binding checks, arithmetic sign handling |
| `isClock` | `'posedge'` or `'negedge'`; the edge flops on this clock use | `addRegister`, `addSequentialAlways` (both reject an unflagged clock) |
| `isReset` | `'lowasync'`, `'highasync'`, `'lowsync'` or `'highsync'`; polarity, and whether the reset joins the sensitivity list | `addRegister`, `addSequentialAlways` (both reject an unflagged reset) |
| `type` | `'logic'` (the default), `'wire'`, `'reg'`, `'const logic'` or `'enum'` | Declarations, binding rules; `add*Always`, `addMux` and `addRegister` promote `wire`/unset outputs to `logic` |
| `isArray` | Unpacked array depth (a bigint); internal signals only | Declarations. A port can't be an array, and most methods refuse an array signal |
| `value` | The constant of a `'const logic'` signal | `addConstSignal` |

An [`Expr`](../reference/Base.md#expr) is a right-hand side: SystemVerilog text, or a function
of a parameter record that returns the text. The core doesn't parse it. An `Expr` is converted
to text as soon as an `add*()` call receives it, so changing its `params` afterwards changes
nothing.

Some methods name the signals they create. You'll see these names in emitted SV:

| Name | Created by |
|---|---|
| `<d>_q` | `addRegister` when `q` is omitted (copies `d`'s metadata) |
| `sum_<a>x<b>`, `diff_…`, `prod_…` | `addAdder`, `addSubtractor`, `addMultiplier` when `result` is omitted |
| `const_w<width><s\|u><value>` (`m` prefix for negative) | A bigint submodule binding (§5). The arithmetic helpers write bigint operands as literals instead |
| `ext_w<bits><s\|u>_<signal>` | `addSubmodule` with `autoWidthExtension` (§5) |

## 4. Interfaces

An [`Interface`](../reference/Base.md#interface) is a bundle of signals plus a set of modports,
each giving every signal a direction. It has a name and its own parameters. Its SV type name,
from `interfaceName()`, is the name followed by the parameter values: `memory_32_32`, or
`AXI4_32_32_4_0_withQOS_noREGION`. Two instances are the same SV type only if those strings are
equal.

`addInterface(instanceName, intf)` adds an instance to the module. Whether it is a port depends
on its **role**:

- **With a role** (`new Memory({}, 'inward')`), the instance is a port. The module header gets
  `memory_32_32.inward regs`, and the role must name one of the interface's modports. The
  bundled interfaces use `inward` (responder) and `outward` (initiator), except the generated
  AMBA5 classes (`*_rtl.ts`), which use `master` and `slave`.
- **Without a role** (`new Memory({})`), it is a local bundle declared inside the module
  (`memory_32_32 w ();`). Use it to connect two child instances to each other.

Logic inside the module refers to a member as `inst.SIGNAL`, both in `Expr` text and as a
binding (`{ addr: 'regs.ADDR' }`).

### Binding checks

When `addSubmodule` binds a child's interface port to one of the parent's instances, it checks
three things. Each failure throws:

| Check | Error |
|---|---|
| The bound name is an interface instance in the parent | `<port>: interface '<name>' not found in <parent>` |
| Parent instance and child port are the same SV type: their `interfaceName()` strings are equal, so a different class, or the same class with a different parameter value, fails | `<port> interface type mismatch on <child>: <parent type> vs <child type>` |
| If the parent's instance has a role (it is itself a port), the roles are equal. A role-less local bundle binds to a child port of any role | `<port> interface role mismatch on <child>` |

The second row means a `Memory` with `DATA_WIDTH: 64` can't be bound to a child port declared
with `DATA_WIDTH: 32`. The third means a parent passing its own `inward` port down to a child
can only bind it to an `inward` child port.

An interface's SV definition is written out the first time a module that has it as a **port**
is emitted. A local bundle on its own doesn't cause the definition to be written. In practice
some child always has the matching port, but a module that only declares a local bundle emits
a reference to an undefined interface.

How to write a new interface class is in
[adding-an-interface.md](../interfaces/adding-an-interface.md).

## 5. Submodules

[`addSubmodule(instanceName, submodule, bindings, autoBind, createMissing, autoWidthExtension)`](../reference/Base.md#addsubmodule)
records a child instance. `bindings` maps a child port name to what it connects to in the
parent:

- a parent signal or port, as a string or `Sig` (including `inst.SIGNAL` members);
- a bigint constant, which becomes a `const logic` signal of the port's width;
- for an interface port, the name of a parent interface instance (§4).

### `autoBind` (default `true`)

For each child port the bindings leave unbound, autoBind tries these in order:

1. A parent port or signal with the same name is bound to it.
2. Otherwise, with `createMissing`, a new **internal** signal with the port's metadata is added
   to the parent and bound.
3. Otherwise an unbound **input** throws `unbound input on <child>: <port>`. Unbound outputs
   and inouts are left out of the instance, which leaves them unconnected.

Interface ports with a role go through the same steps. Step 1 looks for a parent interface with
the same name. Step 2 creates a role-less local bundle, and step 3 throws for any direction.

With `autoBind` off, only the bindings you pass are made, and nothing is checked for missing
inputs.

**`createMissing` doesn't add ports to the parent.** It creates local signals and bundles, so
anything the child exposes through them is reachable only from inside the parent. To expose a
child's port or bus, declare the parent's own port (in `IOs`, or `addInterface` with a role)
and bind to it. `RegisterBlock` inside FIR is bound this way: its `regs` bus becomes an internal
`memory_32_32 regs ();` in FIR, although FIR's spec describes a `regs` port ([#83](https://github.com/TypeScriptSystemVerilog/TSSV/issues/83)).

### Checks on every binding

Each binding, explicit or automatic, is checked:

- The port exists on the child, or `<port> not found on module <child>`.
- The signal isn't an array.
- **Sign.** A signed signal can only drive a signed port. An unsigned signal driving a signed
  port needs a spare bit: it must be strictly narrower than the port.
- **Width.** The signal may not be wider than the port. It must be exactly as wide, unless
  `autoWidthExtension` is set and the port is an input. In that case a narrower signal is
  extended through a new `ext_w<bits><s|u>_<signal>` signal: sign-extended if the signal is
  signed, otherwise zero-extended. Bindings of the same signal that need the same extension
  share one extension signal.
- **Type.** This checks the parent signal's `type`, with unset counting as `logic`. A child
  input can be driven by a signal of any type. A child output can't drive a `reg` or
  `const logic` signal. A child inout needs a signal declared with `type: 'wire'`.

### Things `addSubmodule` doesn't check

- **Repeated instance names.** Adding a second child with an existing instance name replaces
  the first one silently. ([#84](https://github.com/TypeScriptSystemVerilog/TSSV/issues/84))
- **Shared bindings objects.** The `bindings` object is stored and then mutated, as autoBind
  and constant/extension handling add or rewrite entries. Pass a fresh object to each call.

## 6. Registers: how `addRegister` builds `always_ff` blocks

[`addRegister({ d, clk, reset?, resetVal?, en?, q? })`](../reference/Base.md#addregister) adds
one flop (any width). It doesn't write an always block. It files the flop under three keys, and
emission writes one `always_ff` per distinct combination:

1. **Sensitivity**: the clock's edge and name, plus the reset's edge if the reset is
   asynchronous;
2. **Reset condition**: `rst` or `!rst_b` by polarity, or none if `reset` is omitted;
3. **Enable**: the `en` text, or none.

Flops that share all three end up in the same block, in the order they were added. The blocks
come out in the order each combination was first seen.

```typescript
this.addRegister({ d: 'a', clk: 'clk', reset: 'rst_b', en: 'en' })                  // a_q
this.addRegister({ d: 'b', clk: 'clk', reset: 'rst_b', en: 'en', resetVal: 3n })    // b_q, same block
this.addRegister({ d: new Expr('a + b'), clk: 'clk', reset: 'rst_b', q: 's' })       // no enable: new block
this.addRegister({ d: 'a', clk: 'clk', q: 'a_noreset' })                            // no reset: new block
```

```systemverilog
always_ff @(posedge clk or negedge rst_b)
  if (!rst_b) begin
    a_q <= 'd0;
    b_q <= 'd3;
  end else if (en) begin
    a_q <= a;
    b_q <= b;
  end

always_ff @(posedge clk or negedge rst_b)
  if (!rst_b) begin
    s <= 'd0;
  end else begin
    s <= a + b;
  end

always_ff @(posedge clk) begin
  a_noreset <= a;
end
```

Further rules:

- `clk` must carry `isClock`, and `reset` must carry `isReset`. The reset kind decides both the
  sensitivity list and the polarity of the condition:

  | `isReset` | Added to sensitivity | Reset condition |
  |---|---|---|
  | `'lowasync'` | `or negedge rst_b` | `!rst_b` |
  | `'highasync'` | `or posedge rst` | `rst` |
  | `'lowsync'` | nothing | `!rst_b` |
  | `'highsync'` | nothing | `rst` |

- `resetVal` defaults to `0n` and is written as an unsized literal (`'d3`, `-'d3`).
- If `q` is omitted, `d` must be a plain signal; the flop is named `<d>_q` and copies `d`'s
  metadata. With an `Expr` as `d`, pass `q`.
- `addSequentialAlways` is the hand-written alternative: you write the body and it adds (or
  checks) the `always_ff @(...)` header from the same clock and reset metadata. Use it when the
  next-state logic doesn't fit `d`/`en`.

`RegisterBlock` is a different thing: a generated memory-mapped register file. See
[registers.md](registers.md).

## 7. Emission

[`writeSystemVerilog()`](../reference/Base.md#module) returns the module and everything it
instantiates as one string.

### What a file contains, in order

1. The definitions of the interfaces this module has as ports, unless already written.
2. The definition of every submodule, depth first, each preceded by its own interface and
   submodule definitions. Each module name is written once.
3. The module itself:
   - the header: ports from `IOs`, then interface ports (`type.role name`);
   - a comment block listing the parameters;
   - signal declarations, including local interface bundles;
   - `body`, in call order: `addAssign`, `add*Always`, `addMux`, the arithmetic helpers,
     `addBody`/`addBodyLine`;
   - the `always_ff` blocks built from `addRegister` (§6);
   - the submodule instances, in the order they were added.

The module is wrapped in `/* verilator lint_off WIDTH */` … `/* verilator lint_on WIDTH */`.

### One definition per name

Definitions are deduplicated **by name** within one top-level `writeSystemVerilog()` call. The
first instance with a given module name, or interface type name, writes the definition, and
later ones are only instantiated. That is why the name rules in §2 matter: nothing compares the
contents of two same-named modules. Each top-level call starts afresh, so calling it twice
gives the same text twice.

### Several files: `SVEmitOptions` (#46)

By default each top-level call defines everything it reaches. Emit a DUT and then a testbench
that instantiates it, and the DUT is defined in both files, which the simulator rejects. Pass
[`SVEmitOptions`](../reference/Base.md#svemitoptions) to split a design across files:

```typescript
const defined = new Set<string>()
const dutSV = dut.writeSystemVerilog({ defined })            // defines the DUT hierarchy
const tbSV = tb.writeSystemVerilog({ exclude: defined })     // references it
```

- `defined` collects every module and interface name the call wrote, including the top module.
- `exclude` lists names a previous call already wrote. They are instantiated but not defined
  again. Pass one set as `defined` to one call and as `exclude` to the next, and it accumulates
  across any number of files.
- Whichever call runs first defines anything the files share (a common interface, say).
- Excluding the module you're emitting throws.
- The files depend on each other. Give them to the simulator or synthesis tool together.

`ts/test/test_multiFileEmission.ts` checks that the files together define exactly what a
single-file emission does, with nothing defined twice.

### Formatting with Verible

The returned text is passed through `verible-verilog-format` before it is returned. This
happens once, on the top-level call's output. The configuration is a static setting shared by
every module:

```typescript
Module.setFormatterConfig({
  engine: 'verible',          // 'verible' | 'internal' | 'off'
  failOnFormatError: true,    // throw on a formatter failure; otherwise warn and return unformatted text
  veriblePath: '/opt/verible/bin/verible-verilog-format',   // default: found on PATH
  veribleFlags: ['--indentation_spaces=2'],
  formatTimeoutMs: 60000      // the default; raise it for very large designs
})
```

- The default is `{ engine: 'verible', failOnFormatError: true }`, so generation fails if
  Verible isn't installed, times out or crashes. The thrown message carries its diagnostic.
- **A syntax error doesn't fail generation.** On a syntax error `verible-verilog-format` exits
  with status 0 and returns its input unformatted, and the core discards its error output.
  Unformatted output is the only sign. Lint generated SV with Verilator to catch these. ([#87](https://github.com/TypeScriptSystemVerilog/TSSV/issues/87))
- `setFormatterConfig` **replaces** the whole configuration. Fields you leave out are unset,
  not kept from the default. Leave out `failOnFormatError` and failures become warnings.
- `'internal'` is accepted, but today it does nothing: it skips formatting, as `'off'` does.

## 8. Importing existing SystemVerilog

[`addSystemVerilogSubmodule(instanceName, path, params, bindings, autoBind, options)`](../reference/Base.md#addsystemverilogsubmodule)
instantiates a module from an existing `.sv` file:

1. It reads the file and runs `verible-verilog-syntax` on it. The parser in
   [`SVModuleHeader.ts`](../reference/SVModuleHeader.md) reads each module's name and port
   directions from the syntax tree. It handles ANSI headers (`input logic [7:0] a,`), where a
   port without a direction inherits the previous one, and non-ANSI headers (`input a;` in the
   module body). A syntax error in the file throws with its line and column.
2. It picks the module: `options.moduleName` if given; otherwise the file's only module, or the
   module named after the file.
3. It builds a stand-in `Module` named after the SV module, with one port for each **bound**
   port. Its direction comes from the file's header. Its width and sign are copied from the
   parent signal bound to it.
4. Each entry in `params` is marked with `setVerilogParameter` and appears as `#(.P(value))` on
   the instance.
5. The file's text, unchanged, becomes the module's definition in the output. It is written
   once per module name, like any other definition.

What this means in practice:

- **Width and sign aren't checked against the file.** The stand-in's ports are copied from the
  parent signals, so they always match. A mismatch shows up in your simulator or linter, not
  in TSSV.
- **Only bound ports exist.** Ports you don't bind are left unconnected, and `autoBind` has
  nothing to bind. List every port you need.
- **Interface and `ref` ports can't be bound.** Binding one throws. A name that isn't a port of
  the module throws too.
- **Parameter values must be truthy** (§2): `0`, `''` and `false` throw ([#85](https://github.com/TypeScriptSystemVerilog/TSSV/issues/85)).

`IpXactComponent` (`doc/modules/IpXactComponent/IpXactComponent-spec.md`) builds on the same
header parser to wrap an SV module described by an IP-XACT component file.

## Where to go next

| To | Read |
|---|---|
| Look up a method's signature and parameters | [`doc/reference/`](../reference/README.md) |
| Follow one module from TypeScript to simulation | [`doc/tutorials/fir.md`](../tutorials/fir.md) |
| Generate a memory-mapped register block | [registers.md](registers.md) |
| Add an interface class | [adding-an-interface.md](../interfaces/adding-an-interface.md) |
| Write the SV text that `add*Always()` and `addBody()` take | [`doc/rtl-style/sv-style/sv-coding-style.md`](../rtl-style/sv-style/sv-coding-style.md) |
| Simulate the output | [simulation.md](simulation.md) |

# TSSV Coding Style

Rules for the TypeScript that generates a TSSV module: its parameters and width calculation,
the module's structure, which builder to use, naming, and its test script. The SystemVerilog
that the module emits follows the SV guide,
[`../sv-style/sv-coding-style.md`](../sv-style/sv-coding-style.md). A module follows both.

Every rule has a stable ID (`PARAM-3`, `BUILD-4`, …). Cite the ID in reviews and commit
messages. The ID prefixes here (`PARAM`, `MOD`, `BUILD`, `IDENT`, `TEST`) are never used by the
SV guide, so an ID names one rule in one guide. Never renumber a rule: if one is retired, mark
it *retired* and leave its number in place.

**MUST** rules are required. A violation is a bug unless a comment explains it. **SHOULD**
rules are the default; deviate only with a reason in a comment.

Some of these rules started in the SV guide and moved here. The old IDs still resolve: the SV
guide keeps a *moved* note under each one.

| Old ID (SV guide) | Now |
|---|---|
| WIDTH-8 | PARAM-3 |
| RST-1 | MOD-4 |
| NAME-3 | BUILD-1 |
| COMB-8 | BUILD-2 |
| SEQ-3 | BUILD-3 |
| COMB-7 | BUILD-4 |
| LATCH-1 | BUILD-5 |
| NAME-2 | BUILD-6 |
| NAME-1 | IDENT-1 |
| LINT-2 | TEST-1 |

## Quick checklist

Before you open a PR that adds or changes a module:

- [ ] Every value that changes the generated SV is a typed parameter, passed to `super()` with its default applied (PARAM-1, PARAM-2)
- [ ] Widths are computed in TypeScript and appear as numbers in the SV; the module declares no SV `parameter` (PARAM-3, PARAM-4)
- [ ] Clocks and resets are marked `isClock` / `isReset` where they're declared (MOD-3)
- [ ] Builders write every `always` header; no `inputs` lists, no `always` keyword in a body string (BUILD-4)
- [ ] Raw SV goes through `addBody()`, never `this.body +=` (BUILD-7)
- [ ] A `ts/test/` script generates every structural configuration of the module (TEST-1, TEST-2)
- [ ] The generated SV follows the SV guide, including its own quick checklist

## 1. Parameters and widths

A TSSV module is elaborated in TypeScript. The constructor reads the parameter values, decides
what to build, and calls the builders. Every distinct set of parameter values becomes its own SV
module, named after those values (`<Class>_<value>_<value>…`, set in the `Module` constructor in
`ts/src/core/Base.ts`). The emitted SV has no parameters of its own. The rules in this section
keep that model honest.

**PARAM-1 (MUST): Declare a typed parameters interface.**
Name it `<Module>_Parameters` and extend `TSSVParameters`. Give each parameter a JSDoc comment
saying what it controls, and make a parameter optional when it has a default. Restrict values
in the type where TypeScript can: `IntRange<lo, hi>` for an integer range, a union of literals
for a fixed set. A bad value then fails to compile instead of producing bad SV.

<!-- ts: do file
emit(new Delay({ dataWidth: 8, stages: 2 }))
-->
```ts
import { Module, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'

/** configuration parameters of the Delay module */
export interface Delay_Parameters extends TSSVParameters {
  /** bit width of the delayed data */
  dataWidth: IntRange<1, 64>
  /** number of register stages between d and q */
  stages?: 1 | 2 | 3
}

/** delays `d` by a fixed number of clock cycles */
export class Delay extends Module {
  declare params: Delay_Parameters
  constructor (params: Delay_Parameters) {
    super({
      name: params.name,
      dataWidth: params.dataWidth,
      stages: params.stages ?? 1
    })
    const w = this.params.dataWidth
    const stages = this.params.stages ?? 1
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      d: { direction: 'input', width: w },
      q: { direction: 'output', width: w }
    }
    let prev = 'd'
    for (let i = 0; i < stages; i++) {
      const stage = i === stages - 1 ? 'q' : `dly_${i}_q`
      if (stage !== 'q') this.addSignal(stage, { width: w })
      this.addRegister({ d: prev, clk: 'clk', reset: 'rst_n', q: stage })
      prev = stage
    }
  }
}
```

<!-- ts: dont file tserror TS2322
-->
```ts
import { SFIFO } from 'tssv/lib/modules/SFIFO'

// Don't: dataWidth is an IntRange<1, 256>, so 0 doesn't compile
const fifo = new SFIFO({ dataWidth: 0, depth: 4n })
```

**PARAM-2 (MUST): Pass every value that changes the generated SV to `super()`, with its default applied.**
The module's name is built from the values passed to `super()`, and emission keeps only the
first definition of each name. So a value that changes the SV but isn't in that call gives two
different modules the same name, and the second one silently becomes a copy of the first.
Keep every such value in the parameters object, never in another constructor argument or a
global. Apply defaults in the `super()` call (`params.stages ?? 1`, as in PARAM-1), so that
leaving a parameter out and passing its default produce the same module and name.

Set `name` explicitly when something outside TSSV refers to the module by name, such as a
testbench top or a Makefile. A derived name changes whenever a parameter is added.

<!-- ts: dont file throws "both modules are named Invert_4"
const a = new Invert({ width: 4 }, true)
const b = new Invert({ width: 4 }, false)
expect(a.name !== b.name, `both modules are named ${a.name}`)
-->
```ts
import { Module, Expr, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'

interface Invert_Parameters extends TSSVParameters {
  width: IntRange<1, 64>
}

// Don't: `invert` changes the SV, but it isn't a parameter, so it isn't in the module name
class Invert extends Module {
  constructor (params: Invert_Parameters, invert: boolean) {
    super(params)
    this.IOs = {
      a: { direction: 'input', width: params.width },
      y: { direction: 'output', width: params.width }
    }
    this.addAssign({ in: new Expr(invert ? '~a' : 'a'), out: 'y' })
  }
}
```

<!-- ts: do file
const a = new Invert({ width: 4, invert: true })
const b = new Invert({ width: 4 })
expect(a.name !== b.name, `both modules are named ${a.name}`)
expect(b.name === new Invert({ width: 4, invert: false }).name, 'the default changed the name')
emit(a)
emit(b)
-->
```ts
import { Module, Expr, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'

interface Invert_Parameters extends TSSVParameters {
  width: IntRange<1, 64>
  /** invert a on its way to y (default false) */
  invert?: boolean
}

// Do: Invert_4_true and Invert_4_false
class Invert extends Module {
  declare params: Invert_Parameters
  constructor (params: Invert_Parameters) {
    super({ name: params.name, width: params.width, invert: params.invert ?? false })
    this.IOs = {
      a: { direction: 'input', width: params.width },
      y: { direction: 'output', width: params.width }
    }
    this.addAssign({ in: new Expr(this.params.invert === true ? '~a' : 'a'), out: 'y' })
  }
}
```

**PARAM-3 (SHOULD): Compute every width in TypeScript and emit it as a number.**
Do each width calculation in the module class, with `this.bitWidth()` or plain arithmetic,
and interpolate the result into any SV string that needs it. Don't hand-compute widths and
write them into SV strings. Don't compute them in SV (`$clog2`) either. The generated RTL then
shows every signal's width directly, so it can be read and reviewed without working out
parameter expressions.

<!-- ts: do body emits "output logic [3:0] ptr_q"
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
-->
```ts
// Do: a pointer that wraps after `depth` entries; every width comes from depth
const depth = 10n
const w = this.bitWidth(depth - 1n)
this.IOs.ptr_q = { direction: 'output', width: w }
this.addSignal('ptr_nxt', { width: w })
this.addAssign({
  in: new Expr(`(ptr_q == ${w}'d${depth - 1n}) ? '0 : ${w}'(ptr_q + ${w}'d1)`),
  out: 'ptr_nxt'
})
this.addRegister({ d: 'ptr_nxt', clk: 'clk', reset: 'rst_n', q: 'ptr_q' })
```

<!-- ts: dont body
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
ptr_q: { direction: 'output', width: 4 }
-->
```ts
// Don't: 4 and 9 silently assume depth = 10; change the depth and this is wrong
this.addSignal('ptr_nxt', { width: 4 })
this.addAssign({ in: new Expr("(ptr_q == 4'd9) ? '0 : 4'(ptr_q + 4'd1)"), out: 'ptr_nxt' })
this.addRegister({ d: 'ptr_nxt', clk: 'clk', reset: 'rst_n', q: 'ptr_q' })
```

**PARAM-4 (MUST): Don't declare SV parameters in a TSSV module.**
A TSSV module is configured by its TypeScript parameters (PARAM-2), so its SV needs no
`parameter`. Don't add one through `addBody()` to make the emitted module configurable from SV:
the builders have already sized every signal with numbers, so changing the parameter in SV
can't resize them. A `localparam` that names a constant, such as a state encoding, is fine.
Give it a value computed in TypeScript.

`setVerilogParameter()` passes a parameter override (`#(.P(value))`) where a module is
instantiated. It exists for SV modules imported with `addSystemVerilogSubmodule()`, which
declare their own parameters. Don't use it on a TSSV module.

TSSV has no formal mechanism for emitting a module with SV parameters, and none is planned: it
would need symbolic widths in every builder, and it would break the one-module-per-configuration
naming that PARAM-2 relies on. A design that needs a parameterized SV module, for instance as
IP for a flow outside TSSV, should write that module in SV and import it.

<!-- ts: dont body
a: { direction: 'input', width: 8 }
y: { direction: 'output', width: 8 }
-->
```ts
// Don't: an SV parameter in a module the builders have already sized with numbers.
// Overriding W from SV leaves a and y 8 bits wide.
this.addBody(`
  parameter int unsigned W = 8;
  assign y = a[W-1:0];
`)
```

**PARAM-5 (MUST): Reject parameter values the type can't rule out, in the constructor.**
Check them right after `super()`, before building anything, and throw an `Error` that names
the module, the parameter and the bad value. A bad configuration then fails at generation
time with a clear message, not in lint or simulation.

<!-- ts: do file throws "Ring: depth must be a power of 2, got 6"
emit(new Ring({ depth: 8n }))
new Ring({ depth: 6n })
-->
```ts
import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'

interface Ring_Parameters extends TSSVParameters {
  /** number of entries; a power of 2 */
  depth: bigint
}

// A pointer that steps through `depth` entries
class Ring extends Module {
  declare params: Ring_Parameters
  constructor (params: Ring_Parameters) {
    super({ name: params.name, depth: params.depth })
    const depth = this.params.depth
    if (depth < 2n || (depth & (depth - 1n)) !== 0n) {
      throw Error(`Ring: depth must be a power of 2, got ${depth}`)
    }
    const addrWidth = this.bitWidth(depth - 1n)
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      adv: { direction: 'input' },
      ptr_q: { direction: 'output', width: addrWidth }
    }
    this.addSignal('ptr_nxt', { width: addrWidth })
    // depth is a power of 2, so the pointer wraps by overflowing
    this.addAssign({ in: new Expr(`${addrWidth}'(ptr_q + ${addrWidth}'d1)`), out: 'ptr_nxt' })
    this.addRegister({ d: 'ptr_nxt', clk: 'clk', reset: 'rst_n', en: 'adv', q: 'ptr_q' })
  }
}
```

## 2. Module structure

**MOD-1 (MUST): Give each module its own folder, file and spec.**
A module class `<Module>` lives in `ts/src/modules/<Module>/<Module>.ts`, which exports the
class. The folder's `index.ts` re-exports it (`export * from './<Module>.js'`), so users import
it as `tssv/lib/modules/<Module>`. Its spec is `doc/modules/<Module>/<Module>-spec.md`, and the
class's JSDoc points to it with `@see doc/modules/<Module>/<Module>-spec.md`. `AGENTS.md`
("Adding a New Module") lists the steps.

```text
ts/src/modules/SFIFO/
  SFIFO.ts      export class SFIFO extends Module { ... }, JSDoc with @see
  index.ts      export * from './SFIFO.js'
doc/modules/SFIFO/
  SFIFO-spec.md
```

**MOD-2 (SHOULD): Lay out the constructor in a fixed order.**
A reader then finds each part of every module in the same place:

1. `super()` with the parameters and their defaults (PARAM-2).
2. Parameter checks (PARAM-5), then every derived value: widths, counts, flags.
3. `this.IOs`, including the optional ports the parameters select.
4. Interfaces (`addInterface`).
5. The logic, one group per function. Each group declares its own signals, then builds the
   logic that drives them, under a comment saying what the group does.
6. Submodules, unless a logic group needs one in the middle.

Declare `params` with the module's own type (`declare params: <Module>_Parameters`), so that
`this.params` is typed.

<!-- ts: do file
emit(new EventCounter({ countWidth: 8 }))
emit(new EventCounter({ countWidth: 4, clear: true }))
-->
```ts
import { Module, Expr, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'

/** configuration parameters of the EventCounter module */
export interface EventCounter_Parameters extends TSSVParameters {
  /** bit width of the count; the counter saturates at its maximum */
  countWidth: IntRange<2, 32>
  /** add a synchronous `clr` input (default false) */
  clear?: boolean
}

/**
 * Counts cycles with `evt` high, saturating at the largest count.
 *
 * @see doc/modules/EventCounter/EventCounter-spec.md
 */
export class EventCounter extends Module {
  declare params: EventCounter_Parameters
  constructor (params: EventCounter_Parameters) {
    // 1. parameters, with defaults applied
    super({
      name: params.name,
      countWidth: params.countWidth,
      clear: params.clear ?? false
    })

    // 2. derived values
    const w = this.params.countWidth
    const hasClear = this.params.clear === true

    // 3. IOs
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      evt: { direction: 'input' },
      count: { direction: 'output', width: w },
      saturated: { direction: 'output' }
    }
    if (hasClear) this.IOs.clr = { direction: 'input' }

    // 5. count register: holds at the maximum, clears on clr
    this.addSignal('cnt_q', { width: w })
    this.addSignal('cnt_nxt', { width: w })
    this.addCombAlways({ outputs: ['cnt_nxt'] }, `
      begin : cnt_next
        cnt_nxt = cnt_q;
        if (evt && !saturated) cnt_nxt = ${w}'(cnt_q + ${w}'d1);${hasClear ? `
        if (clr) cnt_nxt = '0;` : ''}
      end
    `)
    this.addRegister({ d: 'cnt_nxt', clk: 'clk', reset: 'rst_n', q: 'cnt_q' })

    // 5. outputs
    this.addAssign({ in: new Expr('cnt_q'), out: 'count' })
    this.addAssign({ in: new Expr(`cnt_q == {${w}{1'b1}}`), out: 'saturated' })
  }
}
```

**MOD-3 (MUST): Mark each clock `isClock` and each reset `isReset` where you declare it.**
`addRegister` and `addSequentialAlways` read those fields to build the sensitivity list and
the reset condition. They refuse a clock or reset signal that isn't marked.

<!-- ts: dont body throws "rst_n is not a reset signal"
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input' }
d: { direction: 'input' }
-->
```ts
// Don't: rst_n isn't marked isReset
this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_n' })
```

<!-- ts: do body emits "always_ff @(posedge clk or negedge rst_n)"
d: { direction: 'input' }
q: { direction: 'output' }
-->
```ts
// Do
this.IOs.clk = { direction: 'input', isClock: 'posedge' }
this.IOs.rst_n = { direction: 'input', isReset: 'lowasync' }
this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_n', q: 'q' })
```

**MOD-4 (SHOULD): Default to an active-low asynchronous reset named `rst_n`.**
Declare it as `rst_n: { direction: 'input', isReset: 'lowasync' }`. This matches the existing
modules. Use a different kind only when the target library or the surrounding design requires
it. The SV guide's reset rules (RST-2 to RST-4) still apply.

<!-- ts: do body emits "if (!rst_n)"
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
vld_in: { direction: 'input' }
vld_out: { direction: 'output' }
-->
```ts
this.addRegister({ d: 'vld_in', clk: 'clk', reset: 'rst_n', q: 'vld_out' })
```

**MOD-5 (SHOULD): Carry a bus as an `Interface`.**
When a group of signals travels together, such as a bus or a handshake, declare it once as an
`Interface` and add it with `addInterface()`. Its role picks the modport. The builders accept
an interface member as `<instance>.<signal>`. Interface classes live in `ts/src/interfaces/`.

Linted on its own, a module with an interface port reports some of the interface's signals as
`UNDRIVEN` or `UNUSEDSIGNAL`, because the other end of the interface isn't there. That is
expected, and the example below allows it. Lint the module inside a parent that connects both
ends.

<!-- ts: do body emits "memory_32_16.outward mem" allow UNDRIVEN allow UNUSEDSIGNAL
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
addr: { direction: 'input', width: 16 }
wdata: { direction: 'input', width: 32 }
wr: { direction: 'input' }
rdata: { direction: 'output', width: 32 }
rdy: { direction: 'output' }
-->
```ts
this.addInterface('mem', new Memory({ DATA_WIDTH: 32, ADDR_WIDTH: 16 }, 'outward'))
this.addAssign({ in: new Expr('addr'), out: 'mem.ADDR' })
this.addAssign({ in: new Expr('wdata'), out: 'mem.DATA_WR' })
this.addAssign({ in: new Expr('wr'), out: 'mem.WE' })
this.addAssign({ in: new Expr('!wr'), out: 'mem.RE' })
this.addAssign({ in: new Expr("{2{1'b1}}"), out: 'mem.WSTRB' })
this.addAssign({ in: new Expr('mem.DATA_RD'), out: 'rdata' })
this.addAssign({ in: new Expr('mem.READY'), out: 'rdy' })
```

**MOD-6 (SHOULD): Bind every submodule port explicitly, except clock and reset.**
`addSubmodule` binds a port you leave out to the parent signal with the same name
(`autoBind`, on by default). If there is no such signal, it throws for an input but leaves an
output unconnected. Bind every data and control port by name, so the connection is visible in
the TypeScript and a renamed signal can't silently disconnect it. Name the instance
`u_<name>`.

<!-- ts: dont file lint PINMISSING
emit(new Top())
-->
```ts
import { Module, Expr } from 'tssv/lib/core/TSSV'

class Stage extends Module {
  constructor () {
    super({ name: 'stage' }, {
      a: { direction: 'input', width: 8 },
      y: { direction: 'output', width: 8 }
    })
    this.addAssign({ in: new Expr('~a'), out: 'y' })
  }
}

// Don't: there is no parent signal named y, so the child's y is left unconnected
class Top extends Module {
  constructor () {
    super({ name: 'top' }, {
      a: { direction: 'input', width: 8 },
      out: { direction: 'output', width: 8 }
    })
    this.addSignal('stage_y', { width: 8 })
    this.addSubmodule('u_stage', new Stage(), { a: 'a' })
    this.addAssign({ in: new Expr('stage_y'), out: 'out' })
  }
}
```

<!-- ts: do file emits ".y(stage_y)"
emit(new Top())
-->
```ts
import { Module, Expr } from 'tssv/lib/core/TSSV'

class Stage extends Module {
  constructor () {
    super({ name: 'stage' }, {
      a: { direction: 'input', width: 8 },
      y: { direction: 'output', width: 8 }
    })
    this.addAssign({ in: new Expr('~a'), out: 'y' })
  }
}

// Do
class Top extends Module {
  constructor () {
    super({ name: 'top' }, {
      a: { direction: 'input', width: 8 },
      out: { direction: 'output', width: 8 }
    })
    this.addSignal('stage_y', { width: 8 })
    this.addSubmodule('u_stage', new Stage(), { a: 'a', y: 'stage_y' })
    this.addAssign({ in: new Expr('stage_y'), out: 'out' })
  }
}
```

## 3. Builder choice

The builders check what they can: every signal they're given exists, a register's clock and
reset are marked, and `addAssign` drives only a `logic` or `wire` signal. They can't check the raw SV strings you pass to
`addCombAlways`, `addSequentialAlways`, `addLatchAlways` and `addBody`. So the less raw SV a
module has, the fewer places the SV guide's rules can be broken.

**BUILD-1 (SHOULD): Use a builder wherever one fits the logic.**
Write raw SV only for what no builder can express.

| Logic | Builder |
|---|---|
| A one-line expression | `addAssign` |
| A selector over N inputs | `addMux` |
| Add, subtract, multiply | `addAdder`, `addSubtractor`, `addMultiplier` |
| Rounding, saturation | `addRound`, `addSaturate` |
| A flip-flop, with optional reset and enable | `addRegister` |
| A constant | `addConstSignal`, `addConstSignals` |
| A child module, or an existing `.sv` file | `addSubmodule`, `addSystemVerilogSubmodule` |
| Next-state or decode logic that needs `if`, `case` or a loop | `addCombAlways` |
| A register no `addRegister` call can express | `addSequentialAlways` |
| An intentional latch | `addLatchAlways` (BUILD-5) |
| Anything else: a `localparam`, a comment, a construct with no builder | `addBody` (BUILD-7) |

**BUILD-2 (SHOULD): Don't use an always block for logic a simpler builder covers.**
A one-line expression belongs in `addAssign`. A selector belongs in `addMux`, arithmetic in
`addAdder`/`addSubtractor`/`addMultiplier`. Reserve `addCombAlways` for logic that needs
procedural code.

<!-- ts: dont body emits "always_comb"
valid_in: { direction: 'input' }
stall: { direction: 'input' }
valid_out: { direction: 'output' }
-->
```ts
// Don't
this.addCombAlways({ outputs: ['valid_out'] }, `
  begin : vld
    valid_out = valid_in & ~stall;
  end
`)
```

<!-- ts: do body emits "assign valid_out = valid_in & ~stall;" lacks "always_comb"
valid_in: { direction: 'input' }
stall: { direction: 'input' }
valid_out: { direction: 'output' }
-->
```ts
// Do
this.addAssign({ in: new Expr('valid_in & ~stall'), out: 'valid_out' })
```

**BUILD-3 (SHOULD): Use `addRegister` for plain flip-flops.**
It checks that `clk` is marked `isClock` and `reset` is marked `isReset` (MOD-3). It emits the
correct sensitivity list and reset condition for the reset kind, and groups registers that
share clock, reset and enable into one block. It names `q` as `<d>_q` when `d` is a simple
signal and no `q` is given (IDENT-1). Use `addSequentialAlways` only when the register needs
logic that `addRegister` can't express. Even then, the SV guide prefers next-state logic in
an `addCombAlways` block feeding an `addRegister` (SEQ-2).

<!-- ts: dont body
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
en: { direction: 'input' }
cnt_nxt: { direction: 'input', width: 8 }
cnt_q: { direction: 'output', width: 8 }
-->
```ts
// Don't: a hand-written flop that addRegister already covers
this.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['cnt_q'] }, `
  begin : cnt_reg
    if (!rst_n) cnt_q <= '0;
    else if (en) cnt_q <= cnt_nxt;
  end
`)
```

<!-- ts: do body emits "else if (en) begin cnt_q <= cnt_nxt;"
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
en: { direction: 'input' }
cnt_nxt: { direction: 'input', width: 8 }
cnt_q: { direction: 'output', width: 8 }
-->
```ts
// Do
this.addRegister({ d: 'cnt_nxt', clk: 'clk', reset: 'rst_n', en: 'en', q: 'cnt_q' })
```

**BUILD-4 (MUST): Let the builder write the `always` header.**
Leave the header out of the body string, and leave out `inputs`:

- `addCombAlways` and `addLatchAlways` emit `always_comb` and `always_latch` when called
  without `inputs`. With `inputs`, they emit a legacy `always @( a or b )` instead, and every
  signal read but not listed is a simulation/synthesis mismatch.
- `addSequentialAlways` builds `always_ff @(...)` from the clock edge and the reset kind of the
  declared `clk` and `reset`, so the sensitivity list always matches the reset (SV guide
  SEQ-5).

If a body does start with its own header, the builder uses it as written. `addSequentialAlways`
then only checks that the header mentions the clock edge and, for an async reset, the reset
edge, and throws a "Sensitivity mismatch" error if either is missing. That check is loose: it
doesn't catch an extra async-reset term on a block whose reset is synchronous.

<!-- ts: dont body emits "always @(req)" lacks "always_comb"
req: { direction: 'input', width: 2 }
grant: { direction: 'output', width: 2 }
-->
```ts
// Don't: emits `always @(req)`; any signal read but not listed is missed in simulation
this.addCombAlways({ inputs: ['req'], outputs: ['grant'] }, `
  begin : arb
    grant = '0;
    if (req[0]) grant = 2'b01;
    else if (req[1]) grant = 2'b10;
  end
`)
```

<!-- ts: dont body throws "Sensitivity mismatch"
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
d: { direction: 'input' }
q: { direction: 'output' }
-->
```ts
// Don't: a hand-written header that leaves out the async reset
this.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['q'] }, `
  always_ff @(posedge clk) begin : q_reg
    if (!rst_n) q <= 1'b0;
    else        q <= d;
  end
`)
```

<!-- ts: do body emits "always_comb begin : arb"
req: { direction: 'input', width: 2 }
grant: { direction: 'output', width: 2 }
-->
```ts
// Do: emits `always_comb`
this.addCombAlways({ outputs: ['grant'] }, `
  begin : arb
    grant = '0;
    if (req[0]) grant = 2'b01;
    else if (req[1]) grant = 2'b10;
  end
`)
```

<!-- ts: do body emits "always_ff @(posedge clk or negedge rst_n) begin : q_reg"
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
d: { direction: 'input' }
q: { direction: 'output' }
-->
```ts
// Do: the builder writes `always_ff @(posedge clk or negedge rst_n)`
this.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['q'] }, `
  begin : q_reg
    if (!rst_n) q <= 1'b0;
    else        q <= d;
  end
`)
```

**BUILD-5 (MUST): Build a latch only by intent, and only with `addLatchAlways`.**
It emits `always_latch`, so the intent is visible to tools and reviewers. A latch inferred
anywhere else is a bug (SV guide COMB-1, COMB-2). Comment every intentional latch with the
reason it's needed.

<!-- ts: do body emits "always_latch begin : q_latch"
en: { direction: 'input' }
d: { direction: 'input', width: 4 }
q: { direction: 'output', width: 4 }
-->
```ts
// Intentional latch: q follows d while en is high and holds while it is low
this.addLatchAlways({ outputs: ['q'] }, `
  begin : q_latch
    if (en) q = d;
  end
`)
```

**BUILD-6 (SHOULD): Do structural generation in TypeScript.**
Write loops over ports, lanes and layers as TypeScript loops that call the builders. Don't
build SV `generate` blocks inside template strings. TypeScript loops are type-checked, their
signal names are checked by the builders, and their output is plain SV that is easy to read
and lint.

<!-- ts: dont body
a: { direction: 'input', width: 4 }
b: { direction: 'input', width: 4 }
y: { direction: 'output', width: 4 }
-->
```ts
// Don't
this.addBody(`
  for (genvar i = 0; i < 4; i++) begin : g_lane
    assign y[i] = a[i] ^ b[i];
  end
`)
```

<!-- ts: do body emits "assign y[3] = a[3] ^ b[3];"
a: { direction: 'input', width: 4 }
b: { direction: 'input', width: 4 }
y: { direction: 'output', width: 4 }
-->
```ts
// Do
const lanes = 4
for (let i = 0; i < lanes; i++) {
  this.addBodyLine(`assign y[${i}] = a[${i}] ^ b[${i}];`)
}
```

**BUILD-7 (MUST): Append raw SV with `addBody()` or `addBodyLine()`, never `this.body +=`.**
`addBody()` strips the template literal's indentation and ends the text with a newline.
`addBodyLine()` appends one line and its newline. Appending to `this.body` directly does
neither, so the next builder's output can end up on the same line, for example inside a `//`
comment. `npm run check:body` lists every `this.body +=` in `ts/src/modules/` and
`ts/src/interfaces/`.

<!-- ts: dont body lint UNDRIVEN
a: { direction: 'input' }
y: { direction: 'output' }
-->
```ts
// Don't: no newline, so the assign lands inside the comment and y is never driven
this.body += '// y follows a'
this.addAssign({ in: new Expr('a'), out: 'y' })
```

<!-- ts: do body emits "assign y = a;"
a: { direction: 'input' }
y: { direction: 'output' }
-->
```ts
// Do
this.addBody('// y follows a')
this.addAssign({ in: new Expr('a'), out: 'y' })
```

## 4. Naming

These rules add to the naming conventions in `AGENTS.md`.

**IDENT-1 (SHOULD): Use the standard signal suffixes:**
- `_q` is a register's output; `addRegister` already uses it.
- `_nxt` is a register's next-state value.
- `_n` or `_b` mark an active-low signal.
  - Prefer `_n` for new code. Some existing modules use `_b` (e.g. `rst_b`).
  Don't rename existing ports just to follow this rule.

<!-- ts: do body emits "logic vld_q;"
clk: { direction: 'input', isClock: 'posedge' }
rst_n: { direction: 'input', isReset: 'lowasync' }
vld: { direction: 'input' }
vld_out: { direction: 'output' }
-->
```ts
// addRegister names the output vld_q
const vldQ = this.addRegister({ d: 'vld', clk: 'clk', reset: 'rst_n' })
this.addAssign({ in: new Expr(vldQ.toString()), out: 'vld_out' })
```

**IDENT-2 (SHOULD): Use each language's own case conventions.**
- TypeScript classes are PascalCase, and a module class has the same name as its folder and
  file (MOD-1). Its parameters interface is `<Module>_Parameters` (PARAM-1).
- TypeScript variables and parameter fields are camelCase (`dataWidth`, `simultPushPop`).
  Parameters of an interface for a standard bus keep the spec's names (`DATA_WIDTH`).
- SV ports, signals and instance names are lower snake_case (`push_data`, `fifo_cnt_q`,
  `u_sram`). Signals of an interface for a standard bus keep the spec's names (`PADDR`).

## 5. Tests

**TEST-1 (MUST): Every module needs a `ts/test/` script** that builds it and writes its SV
under `sv-examples/<Module>/`. The generated SV is the evidence for the SV guide's LINT-1: it
is what gets linted and simulated. Put the script at `ts/test/modules/test_<Module>.ts`.

<!-- ts: do file
-->
```ts
import { mkdirSync, writeFileSync } from 'fs'
import { SFIFO } from 'tssv/lib/modules/SFIFO'

for (const simultPushPop of [true, false]) {
  const fifo = new SFIFO({ dataWidth: 8, depth: 4n, simultPushPop })
  const dir = `sv-examples/SFIFO/${fifo.name}`
  mkdirSync(dir, { recursive: true })
  writeFileSync(`${dir}/${fifo.name}.sv`, fifo.writeSystemVerilog())
}
```

**TEST-2 (SHOULD): Generate every configuration that changes the module's structure, and check
it against the spec.**
Loop over the parameters that add or remove ports or logic, as the example in TEST-1 does
with `simultPushPop`. Where the spec lists the ports of each configuration, compare the
generated module's ports with that list and throw on a mismatch.
`ts/test/modules/test_SFIFO.ts` is the reference.

## Maintaining this document

This guide lives in `doc/rtl-style/tssv-style/` with the checks that verify it; see
[README.md](README.md) there. Every rule needs an entry in `rules.json` saying how it's
verified. Run `npm run check:rtl-style` after any change to a rule or an example.

`doc/rtl-style/tssv-style/tools/check-ts-examples.mjs`, one of those checks, compiles and runs
every `ts` example above. Every `ts` example needs an HTML comment immediately before its code
fence. The comment doesn't show when the doc is rendered:

- The first line is `<!-- ts: <do|dont> <body|file>`, then any expectations.
  - `body`: the example is the inside of a module's constructor. Each following line of the
    comment declares one IO of that module (`clk: { direction: 'input', isClock: 'posedge' }`)
    or is a statement run before the example. The module is emitted after the example runs.
  - `file`: the example is a whole file, imports included. Each following line of the comment is
    a statement run after it, typically `emit(new MyModule({ ... }))`.
- Expectations: `throws "text"` (the example throws an error containing the text),
  `emits "text"` or `lacks "text"` (some or no emitted module contains the text), `lint CODE`
  (an emitted module raises this Verilator warning), `allow CODE` (a `do` example's modules may
  raise this warning, and the rule's text says why), and `tserror TSnnnn` (the example fails
  to type-check with this error, and isn't run).
- Without `throws` or `tserror`, the example must type-check and run. Every module a `do`
  example emits must lint clean under `-Wall` on the pinned Verilator and pass the SV guide's
  generated-SV checks.
- `emit(m)` and `expect(cond, msg)` are available in every example.
- Use another fence language (`text`) for a block that isn't a runnable example.

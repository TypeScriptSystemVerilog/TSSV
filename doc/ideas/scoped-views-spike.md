# Scoped Views Spike

> Status: Proposal (#109). The prototype is on branch
> [`spike/109-scoped-target-views-prototype`](https://github.com/TypeScriptSystemVerilog/TSSV/tree/spike/109-scoped-target-views-prototype)
> (commits `cba0ba4`, `cb39f4d`, `e42e41c` and `992317c`). It is not merged. The implementation
> is a follow-up Task. Scope: the API, the emission rule for each open point in #109, the null
> view, and the alternatives considered.

**Where the examples come from.** Each example is a builder example on the prototype branch:

- Its TypeScript is a region of `ts/doc-examples/core/<api>.ts`.
- Its SV is what `npm run docs:examples` writes to `doc/examples/core/<api>/`. The SV is not
  hand-written.
- `ts/test/test_views.ts` lints each example's top with Verilator `-Wall`: once with no view
  defined, and once for each set of its views.
- The error messages are the prototype's own, at `992317c`. Snippets that aren't in an example
  file, such as calls that throw, were run against the prototype by hand.

Sketches of things that were not built say so where they appear: the alternatives in §8, and
the rejected designs in §4.1 and §4.6.

Every generated file starts with the same guard and include block, and ends with the guard's
`` `endif ``. §3.1 shows them once, and §4.7 shows how views change the include lines. The
other examples show the module only.

## 1. Purpose

A module sometimes needs RTL that only some builds compile. Examples:

- A harness keeps contract checks in simulation and leaves them out of the FPGA image (#232).
- A design uses a vendor primitive in one build and generic RTL in the others.

SystemVerilog selects such RTL with `` `ifdef ``. TSSV has no way to emit it today, except raw
text through `addBody()`:

```typescript
// Today, without views: raw text. TSSV doesn't know about the instance, so LimitCheck.sv
// is neither written nor included, and nothing checks the text in each build
m.addBody(`
  \`ifdef TSSV_SIM
    LimitCheck u_chk (.clk, .rst_b, .value(q), .limit(8'd200), .fail);
  \`else
    assign fail = 1'b0;
  \`endif
`)
```

This spike adds **views**. A view is an SV macro. Every `add*` call made inside a view's scope
is tagged with the view, and emission wraps what the call wrote in `` `ifdef ``. The same
module, with views (§3.2):

```typescript
m.views({
  TSSV_SIM: () => {
    m.addSubmodule('u_chk', check, { value: 'q', limit: 200n, fail: 'fail' })
  },
  default: () => {
    m.addAssign({ in: new Expr("1'b0"), out: 'fail' })
  }
})
```

Constraints from #109:

- No `add*` signature changes.
- A module that uses no views emits byte-identical SV.
- A signal declared inside a view and used outside it is a generation error.
- Each view passes LINT-1 on its own.

It also covers the **null view** from the #109 thread: an opt-in stub of a module, written as a
separate file, that a build can use in place of the module.

## 2. The first consumer: #232 and tssv-noc#318

#232 keeps a harness's contract checks in a simulation-only view. tssv-noc#318 then moves
`ArbiterContractCheck` there. Their needs shaped the design:

| Need | Where this proposal meets it | Example |
|---|---|---|
| A view holds whole check modules, and a synthesizable build never reads their files | §4.7, conditional includes | `ViewIncludesExample` |
| The simulation-only view isn't linted and needn't be synthesizable (tssv-noc#313 review) | §3.4, `defineView(name, { lint: false })` | `DefineViewExample` |
| A check's `fail` bit exists in simulation and is tied to 0 in the synthesizable view | §3.2, `views({ ..., default })` | `ViewsExample` |
| `Harness.check()` knows which checks are simulation-only, for SimTop's report and #202's status | §3.3, `activeViews` | `ActiveViewsExample` |

Appendix A shows `ViewTop`, a module shaped like #232's harness, whole: its TypeScript and all
of its SV.

## 3. API

All of it is on `Module`. No `add*` signature changes.

| Member | What it does | Example |
|---|---|---|
| `inView(views: string[], build: () => void)` | Runs `build`; every `add*` call inside it is in a view scope that any one of `views` selects. Emits `` `ifdef A `` (with several views, `` `ifdef A `` / `` `elsif B ``) | §3.1 |
| `views({ A: () => ..., B: () => ..., default: () => ... })` | One scope per key, one of which is compiled: `` `ifdef A `` / `` `elsif B `` / `` `else ``. `default` is compiled when none of the others is defined. Without `default` there is no `` `else `` | §3.2 |
| `get activeViews(): readonly ViewCondition[]` | The conditions of the current scope, outermost first; `[]` at the top level. A condition is `{ anyOf: [...] }`, or `{ noneOf: [...] }` for a `default` branch | §3.3 |
| `static defineView(name, { lint })` | Declares how a view's RTL is checked. A view never declared is linted | §3.4 |
| `setNullView({ ties })` | Opts the module into a null view | §3.5 |
| `writeSystemVerilogFiles(dir, { nullViewDir })` | Also writes the null view of each opted-in module it reaches | §3.5 |

The members check their arguments:

| Call | Throws |
|---|---|
| `inView(['TSSV-SIM'], ...)` | `view "TSSV-SIM" is not a legal macro name` |
| `inView([], ...)` | `inView: no views` |
| `views({ default: ... })` | `views: no views` |
| `setNullView({ ties: { d: 1n } })`, where `d` is an input | `Heavy: null view: d is not an output port` |

### 3.1 `inView`: RTL that one view selects

A monitor that only a simulation build compiles. `monitor` is a `SaturationMonitor` with ports
`clk` and `value`; `m` has a register `q` at the top level. From `inView.ts#example`:

```typescript
// monitor is a SaturationMonitor, with ports clk and value. Only a build that defines
// TSSV_SIM compiles the instance, and only that build reads SaturationMonitor.sv
m.inView(['TSSV_SIM'], () => {
  m.addSubmodule('u_mon', monitor, { value: 'q' })
})
```

The whole file it writes, `InViewExample.sv`:

```systemverilog
`ifndef DEF__InViewExample__
`define DEF__InViewExample__
`ifdef USE_INCLUDES
`ifdef TSSV_SIM
`include "SaturationMonitor.sv"
`endif
`endif //USE_INCLUDES

module InViewExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q
);


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

`ifdef TSSV_SIM

  SaturationMonitor u_mon (
      .value(q),
      .clk  (clk)
  );

`endif

endmodule

`endif //!DEF__InViewExample__
```

- The instance and its `` `include `` are both under `` `ifdef TSSV_SIM ``. A build without
  `TSSV_SIM` never reads `SaturationMonitor.sv`.
- `clk` is bound by `autoBind`, as at the top level. A view reads any signal of the scopes that
  enclose it: here `q` and `clk`, from the top level.
- The module has no `default`, so nothing replaces the monitor in other builds. A view that
  drives an output needs `views()` with a `default` (§3.2), or the output is undriven there.

`inView` also takes a list of views (§4.3) and nests (§4.2).

### 3.2 `views`: one of several, with a `default`

A check's `fail` output, driven by the check in a simulation build and tied to 0 in every other
build. This is #232's pattern. `check` is a `LimitCheck`, with ports `clk`, `rst_b`, `value`,
`limit` and `fail`. From `views.ts#example`:

```typescript
// check is a LimitCheck, with ports clk, rst_b, value, limit and fail. A simulation build
// drives fail from it; every other build ties fail to 0
m.views({
  TSSV_SIM: () => {
    m.addSubmodule('u_chk', check, { value: 'q', limit: 200n, fail: 'fail' })
  },
  default: () => {
    m.addAssign({ in: new Expr("1'b0"), out: 'fail' })
  }
})
```

The module it emits, `ViewsExample`:

```systemverilog
module ViewsExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q,
    output logic fail
);


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

`ifdef TSSV_SIM
  const logic [7:0] const_w8u200 = 8'd200;

  LimitCheck u_chk (
      .value(q),
      .limit(const_w8u200),
      .fail (fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

`else
  assign fail = 1'b0;

`endif

endmodule
```

- The bigint binding `limit: 200n` declares the constant `const_w8u200`. The view binds it, so
  the constant is declared in the view's branch. §4.6 shows what happens when another scope
  binds 200 too.
- `fail` is driven in both builds, so both lint clean.

**Without `default`.** A simulation build compiles a monitor, and a formal build an assertion.
Other builds compile neither. From `views.ts#no-default`:

```typescript
// A simulation build compiles a monitor, a formal build an assertion, any other build neither
noDefault.views({
  TSSV_SIM: () => {
    noDefault.addSubmodule('u_mon', monitor, { value: 'q' })
  },
  TSSV_FPV: () => {
    noDefault.addBody("assert property (@(posedge clk) q != 8'hff);")
  }
})
```

```systemverilog
module ViewsNoDefaultExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q
);


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

`ifdef TSSV_SIM

  SaturationMonitor u_mon (
      .value(q),
      .clk  (clk)
  );

`elsif TSSV_FPV
  assert property (@(posedge clk) q != 8'hff);

`endif

endmodule
```

**One branch, even when several views are defined.** `views()` emits `` `elsif ``, so a build
that defines both `TSSV_SIM` and `TSSV_FPV` compiles only the first key's branch, the monitor.
Two `inView()` calls are different: each is its own `` `ifdef ``, so such a build compiles both:

```typescript
m.inView(['TSSV_SIM'], () => { /* monitor */ })   // `ifdef TSSV_SIM ... `endif
m.inView(['TSSV_FPV'], () => { /* assertion */ }) // `ifdef TSSV_FPV ... `endif
```

### 3.3 `activeViews`: which views the next call is in

Framework code reads `activeViews` to tag what it records. #232's `Harness.check()` needs this:
SimTop reports which checks are simulation-only, and #202 shows it in the status. From
`activeViews.ts#example`:

```typescript
// A harness's check() records each check it adds, and whether only a simulation build has it
const checks: Array<{ name: string, simOnly: boolean }> = []
function addCheck (name: string, value: string, limit: bigint, fail: string): void {
  const simOnly = m.activeViews.some(c => 'anyOf' in c && c.anyOf.includes('TSSV_SIM'))
  checks.push({ name, simOnly })
  m.addSubmodule(`u_${name}`, check, { value, limit, fail })
}

addCheck('d_limit', 'd', 200n, 'fail')
m.views({
  TSSV_SIM: () => { addCheck('q_limit', 'q', 100n, 'sim_fail') },
  default: () => { m.addAssign({ in: new Expr("1'b0"), out: 'sim_fail' }) }
})
// checks: [{ name: 'd_limit', simOnly: false }, { name: 'q_limit', simOnly: true }]
```

The example throws if `checks` differs from the comment. The SV is the same kind as §3.2:
`u_d_limit` at the top level, `u_q_limit` under `` `ifdef TSSV_SIM ``.

**The values at each level.** From `activeViews.ts#values`, where the nesting is the same as in
§4.2:

```typescript
const seen: Record<string, readonly ViewCondition[]> = {}
seen.top = n.activeViews
n.addSignal('d_q', { width: 8 })
n.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
n.views({
  TSSV_XILINX: () => {
    n.addSignal('x_q', { width: 8 })
    n.addRegister({ d: 'd_q', clk: 'clk', reset: 'rst_b', q: 'x_q' })
    n.views({
      TSSV_ULTRASCALE: () => {
        seen.ultrascale = n.activeViews
        n.addRegister({ d: 'x_q', clk: 'clk', reset: 'rst_b', q: 'q' })
      },
      default: () => {
        seen.otherXilinx = n.activeViews
        n.addAssign({ in: new Expr('x_q'), out: 'q' })
      }
    })
  },
  default: () => {
    seen.generic = n.activeViews
    n.addAssign({ in: new Expr('d_q'), out: 'q' })
  }
})
// seen.top:         []
// seen.ultrascale:  [{ anyOf: ['TSSV_XILINX'] }, { anyOf: ['TSSV_ULTRASCALE'] }]
// seen.otherXilinx: [{ anyOf: ['TSSV_XILINX'] }, { noneOf: ['TSSV_ULTRASCALE'] }]
// seen.generic:     [{ noneOf: ['TSSV_XILINX'] }]
```

A `default` branch's condition is `noneOf` the group's other keys. An `inView(['A', 'B'])`
scope's is `{ anyOf: ['A', 'B'] }`.

### 3.4 `defineView`: a view that isn't linted

`Module.defineView('TSSV_SIM', { lint: false })` marks a view whose RTL isn't checked. For
#232, this follows Adam's review of tssv-noc#313: no `--lint-only` on the simulation-only
parts, and they needn't be synthesizable.

`tracer` is a `CycleTracer`: it prints each value with a cycle count, and its counter has no
reset. From `defineView.ts#example`:

```typescript
// TSSV_SIM's RTL is for simulation only: it isn't checked against the SV guide. Without this
// line, writing the module throws, because tracer, a CycleTracer, breaks RST-5
Module.defineView('TSSV_SIM', { lint: false })
m.inView(['TSSV_SIM'], () => {
  m.addSubmodule('u_trace', tracer, { value: 'q' })
})
```

`CycleTracer.sv`, written without the SV-guide check:

```systemverilog
module CycleTracer (
    input logic clk,
    input logic [7:0] value
);
  logic [31:0] cycle;
  logic [31:0] cycle_next;

  assign cycle_next = cycle + 1;
  always_ff @(posedge clk) $display("%0d: value %0d", cycle, value);

  always_ff @(posedge clk) begin
    cycle <= cycle_next;
  end

endmodule
```

Without the `defineView` line, `writeSystemVerilogFiles()` throws:

```text
CycleTracer: always_ff @( posedge clk ) begin: cycle has no reset (RST-5: give every flop an async reset, or waive it with addResetWaiver)
```

What `lint: false` exempts, and what it doesn't:

- A module reached only through unlinted views is written without its own SV-guide check, as
  `CycleTracer` is. A module also reached from a linted scope is checked.
- The branches that need the view are left out of the parent's per-view SV-guide runs (§4.8).
- The formatter still parses every branch, so a syntax error anywhere fails emission.
- The default build still lints clean: `DefineViewExample` without `TSSV_SIM` doesn't read
  `CycleTracer.sv`.

A view that is never declared is linted. `defineView` is global, like the macro it names.

### 3.5 `setNullView` and `nullViewDir`: a stub of a whole module

A module opts in with `setNullView()`. `writeSystemVerilogFiles(dir, { nullViewDir })` then
writes a stub of it to `nullViewDir`, with the same `DEF__<name>__` guard. `NullViewExample` has
two `NullViewStage` instances below it, and a `ready` output. From `setNullView.ts#example`:

```typescript
// The stub ties ready to 1 and q, which has no tie here, to 0
m.setNullView({ ties: { ready: 1n } })
// writeExample calls m.writeSystemVerilogFiles(dir, { nullViewDir: `${dir}/null` }): the
// stub is null/NullViewExample.sv, beside the generated NullViewExample.sv
writeExample('setNullView', m, { nullViewDir: 'null' })
```

The files it writes:

```text
doc/examples/core/setNullView/
├── NullViewExample.sv        the real module: includes NullViewStage.sv
├── NullViewStage.sv
└── null/
    └── NullViewExample.sv    the stub
```

The stub, `null/NullViewExample.sv`, whole:

```systemverilog
`ifndef DEF__NullViewExample__
`define DEF__NullViewExample__

module NullViewExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q,
    output logic ready
);
  // Null view of NullViewExample: outputs tied off, inputs unused, nothing below it
  logic unused_inputs;
  assign unused_inputs = &{1'b0, clk, rst_b, d, 1'b0};
  assign q = '0;
  assign ready = 1'd1;
endmodule

`endif //!DEF__NullViewExample__
```

§5 says how a build picks the stub up, as measured on Verilator.

## 4. Emission rules

The prototype implements every rule in this section. `ts/test/test_views.ts` checks each one.

### 4.1 Layout: grouped

Each `inView()` or `views()` call is one region of `` `ifdef `` / `` `elsif `` / `` `else `` /
`` `endif ``. All regions come after the top level's RTL, in call order. A branch holds all of
its scope's RTL, in this order:

1. declarations;
2. body text, in call order;
3. `always_ff` blocks;
4. submodule instances;
5. nested regions.

A view's calls can mix the kinds of RTL in any order. From `inView.ts#layout`:

```typescript
// A view's calls, with the kinds of RTL mixed up
layout.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
layout.inView(['TSSV_SIM'], () => {
  layout.addSignal('d_q', { width: 8 })
  layout.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
  layout.addSubmodule('u_mon', monitor, { value: 'd_q' })
  layout.addSignal('d_inv', { width: 8 })
  layout.inView(['TSSV_TRACE'], () => {
    layout.addBody('always_ff @(posedge clk) $display("d_q = %0d", d_q);')
  })
  layout.addAssign({ in: new Expr('~d_q'), out: 'd_inv' })
  layout.addSubmodule('u_mon_inv', monitor, { value: 'd_inv' })
})
```

The `TSSV_SIM` branch puts them in the order above:

```systemverilog
module ViewLayoutExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q
);


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

`ifdef TSSV_SIM
  logic [7:0] d_q;
  logic [7:0] d_inv;
  assign d_inv = ~d_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      d_q <= '0;
    end else begin
      d_q <= d;
    end

  SaturationMonitor u_mon (
      .value(d_q),
      .clk  (clk)
  );

  SaturationMonitor u_mon_inv (
      .value(d_inv),
      .clk  (clk)
  );

`ifdef TSSV_TRACE
  always_ff @(posedge clk) $display("d_q = %0d", d_q);

`endif

`endif

endmodule
```

A module with no views takes the old code path, so its text doesn't change (§6).

**The alternative: one region per view in each section** (sketch, not built). It keeps
today's section order, but splits one view into up to four regions:

```systemverilog
  logic [7:0] q_d;                 // declarations, top level
`ifdef TSSV_SIM
  logic [7:0] d_q;                 // declarations, TSSV_SIM
  logic [7:0] d_inv;
`endif
  ...                              // body, top level
`ifdef TSSV_SIM
  assign d_inv = ~d_q;             // body, TSSV_SIM
`endif
  always_ff ...                    // registers, top level
`ifdef TSSV_SIM
  always_ff ...                    // registers, TSSV_SIM
`endif
`ifdef TSSV_SIM
  SaturationMonitor u_mon (...);   // instances, TSSV_SIM
`endif
```

A reader of #232's harness wants a view's RTL in one place, so the prototype groups it.

### 4.2 Nesting

A call inside another view's scope opens a region inside that branch. The nested RTL needs both
conditions. From `views.ts#nested`:

```typescript
// Every build registers d. A Xilinx build registers it again, and an UltraScale part, one of
// Xilinx's, a third time
nested.addSignal('d_q', { width: 8 })
nested.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
nested.views({
  TSSV_XILINX: () => {
    nested.addSignal('x_q', { width: 8 })
    nested.addRegister({ d: 'd_q', clk: 'clk', reset: 'rst_b', q: 'x_q' })
    nested.views({
      TSSV_ULTRASCALE: () => {
        nested.addRegister({ d: 'x_q', clk: 'clk', reset: 'rst_b', q: 'q' })
      },
      default: () => {
        nested.addAssign({ in: new Expr('x_q'), out: 'q' })
      }
    })
  },
  default: () => {
    nested.addAssign({ in: new Expr('d_q'), out: 'q' })
  }
})
```

The module it emits, `NestedViewsExample`:

```systemverilog
module NestedViewsExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q
);
  logic [7:0] d_q;


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      d_q <= '0;
    end else begin
      d_q <= d;
    end

`ifdef TSSV_XILINX
  logic [7:0] x_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      x_q <= '0;
    end else begin
      x_q <= d_q;
    end

`ifdef TSSV_ULTRASCALE

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= x_q;
    end

`else
  assign q = x_q;

`endif

`else
  assign q = d_q;

`endif

endmodule
```

What each build compiles:

| The build defines | Registers | `q` is |
|---|---|---|
| neither | `d_q` | `d_q` |
| `TSSV_XILINX` | `d_q`, `x_q` | `x_q` |
| `TSSV_XILINX` and `TSSV_ULTRASCALE` | `d_q`, `x_q`, `q` | registered from `x_q` |
| `TSSV_ULTRASCALE` alone | `d_q` | `d_q`: the nested branch needs `TSSV_XILINX` too |

- The nested region sits at the end of its parent's branch (§4.1, item 5).
- The nested branches read `x_q`, which the enclosing `TSSV_XILINX` scope declares. The outer
  `default` branch can't (§4.5).
- `activeViews` in the nested branches lists both conditions, outermost first (§3.3).
- Each of the three sets of views lints clean with `-Wall`.

### 4.3 A list of views

`inView(['TSSV_SIM', 'TSSV_FPV'], ...)` means either one. One `` `ifdef `` tests one macro, so
the branch is repeated. From `inView.ts#list`:

```typescript
// Simulation and formal builds both compile the monitor
list.inView(['TSSV_SIM', 'TSSV_FPV'], () => {
  list.addSubmodule('u_mon', monitor, { value: 'q' })
})
```

```systemverilog
`ifdef TSSV_SIM

  SaturationMonitor u_mon (
      .value(q),
      .clk  (clk)
  );

`elsif TSSV_FPV

  SaturationMonitor u_mon (
      .value(q),
      .clk  (clk)
  );

`endif
```

The `` `include "SaturationMonitor.sv" `` line is repeated the same way. Only one copy is
compiled, so the repetition costs only text. It lints clean with `TSSV_SIM`, with `TSSV_FPV`,
with both, and with neither. Two other ways were tried; neither works today (§8.3, §8.4).

A list has no `default`. `views()` takes one macro per key, and calling the same build function
under two keys fails today, because the names collide (§7.1).

### 4.4 Registers

`registerBlocks` is kept per scope, and `addRegister` writes to the current scope's. So
registers in different views never share an `always_ff`, even with the same clock, reset and
enable. Registers in the same scope still share one. From `inView.ts#registers`:

```typescript
// Two registers in a view, on the same clock and reset as one at the top level
regs.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
regs.inView(['TSSV_SIM'], () => {
  regs.addSignal('d_q', { width: 8 })
  regs.addSignal('d_qq', { width: 8 })
  regs.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
  regs.addRegister({ d: 'd_q', clk: 'clk', reset: 'rst_b', q: 'd_qq' })
  regs.addSubmodule('u_mon', monitor, { value: 'd_qq' })
})
```

Two `always_ff` blocks: one for the top level, one for the view's two registers:

```systemverilog
  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

`ifdef TSSV_SIM
  logic [7:0] d_q;
  logic [7:0] d_qq;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      d_q  <= '0;
      d_qq <= '0;
    end else begin
      d_q  <= d;
      d_qq <= d_q;
    end

  SaturationMonitor u_mon (
      .value(d_qq),
      .clk  (clk)
  );

`endif
```

### 4.5 A signal used outside its view

Signals, local interface bundles and submodule instances keep their flat maps, so every name is
still unique across the module (§7.1). Each one declared in a view is tagged with its scope. A
scope can use what it declares and what the scopes around it declare. It can't use what a scope
inside it or beside it declares.

`findSignal`, which every builder uses to resolve a name, throws for such a use. The message
names both scopes. A module `Leaky` declares `sim_only` in `TSSV_SIM`:

```typescript
l.views({
  TSSV_SIM: () => { l.addSignal('sim_only', {}) },
  TSSV_XILINX: () => { /* the sibling case below */ }
})
```

| Used from | The call | Message |
|---|---|---|
| the top level | `l.addAssign({ in: new Expr('a'), out: 'sim_only' })` | `Leaky: signal sim_only is declared in view TSSV_SIM, so it can't be used outside it (addAssign())` |
| the sibling view `TSSV_XILINX` | the same call, inside `TSSV_XILINX: () => { ... }` | `Leaky: signal sim_only is declared in view TSSV_SIM, so it can't be used in view TSSV_XILINX (addAssign())` |

A nested scope is named innermost first. Here `slow` is declared in the `default` branch of a
nested group and used from the enclosing `TSSV_XILINX` scope:

```typescript
l.views({
  TSSV_XILINX: () => {
    l.views({ TSSV_ULTRASCALE: () => {}, default: () => { l.addSignal('slow', {}) } })
    l.addAssign({ in: new Expr('a'), out: 'slow' })
  }
})
```

```text
Leaky: signal slow is declared in the default branch beside TSSV_ULTRASCALE, within view TSSV_XILINX, so it can't be used in view TSSV_XILINX (addAssign())
```

`addSubmodule` checks an interface bound to a port the same way.

**What isn't checked.** Text the core doesn't parse: an `Expr`, `addBody()` text, an always
block's body. Generation passes here:

```typescript
m.inView(['TSSV_SIM'], () => {
  m.addSignal('sim_only', {})
  m.addAssign({ in: new Expr('a'), out: 'sim_only' })
})
m.addAssign({ in: new Expr('sim_only'), out: 'y' }) // an Expr: not resolved, so no error
```

The default build's lint catches it:

```text
%Error: ExprLeak.sv:9:14: Can't find definition of variable: 'sim_only'
    9 |   assign y = sim_only;
      |              ^~~~~~~~
```

So the per-view lint (§4.8) is what catches a misuse in text.

**What can't be in a view.** A module has the same ports in every view:

| Item | Why | What happens |
|---|---|---|
| a plain port | comes from `IOs`, not from an `add*` call | can't be written in a view |
| an interface port (`addInterface` with a role) | a port | `PortInView: interface port mem can't be declared in a view: ports are the same in every view` |
| a port contract (`addNoCombinationalPathContract`) | about ports | `C: a port contract can't be declared in a view: ports are the same in every view` |

### 4.6 Constants

`addConstSignal` shares a constant by name, and a bigint binding in `addSubmodule` creates one.
So two scopes can ask for the same constant. The rule:

- **The new use's scope encloses the old one's:** the constant moves out to the new scope. It
  is used wherever it's compiled.
- **A scope beside it:** an auto-named constant gets a copy of its own in the new scope,
  `<name>_v2`. A named one throws, as any signal does.

**It moves out.** The view binds 200 first, then the top level does. From
`views.ts#shared-constant`:

```typescript
// A bigint binding declares a constant, const_w8u200. The view binds 200 first, so the
// constant is declared in the view. Then the top level binds 200 too, and the constant
// moves out to the top level, where the view can still see it
shared.views({
  TSSV_SIM: () => {
    shared.addSubmodule('u_sim_chk', check, { value: 'q', limit: 200n, fail: 'sim_fail' })
  },
  default: () => {
    shared.addAssign({ in: new Expr("1'b0"), out: 'sim_fail' })
  }
})
shared.addSubmodule('u_chk', check, { value: 'd', limit: 200n, fail: 'fail' })
```

`const_w8u200` is declared once, at the top level, and both instances use it:

```systemverilog
module SharedConstantExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q,
    output logic fail,
    output logic sim_fail
);
  const logic [7:0] const_w8u200 = 8'd200;


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

  LimitCheck u_chk (
      .value(d),
      .limit(const_w8u200),
      .fail (fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

`ifdef TSSV_SIM

  LimitCheck u_sim_chk (
      .value(q),
      .limit(const_w8u200),
      .fail (sim_fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

`else
  assign sim_fail = 1'b0;

`endif

endmodule
```

Had the top level bound 200 first, the constant would have been declared there, and the view
would have used it without moving anything.

**Each sibling gets a copy.** Two views beside each other bind 50. From
`views.ts#sibling-constant`:

```typescript
// Two views beside each other bind 50. Each gets its own constant: const_w8u50 and
// const_w8u50_v2
sibling.views({
  TSSV_XILINX: () => {
    sibling.addSubmodule('u_x_chk', check, { value: 'd', limit: 50n, fail: 'vendor_fail' })
  },
  TSSV_ALTERA: () => {
    sibling.addSubmodule('u_a_chk', check, { value: 'd', limit: 50n, fail: 'vendor_fail' })
  },
  default: () => {
    sibling.addAssign({ in: new Expr("1'b0"), out: 'vendor_fail' })
  }
})
```

```systemverilog
`ifdef TSSV_XILINX
  const logic [7:0] const_w8u50 = 8'd50;

  LimitCheck u_x_chk (
      .value(d),
      .limit(const_w8u50),
      .fail (vendor_fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

`elsif TSSV_ALTERA
  const logic [7:0] const_w8u50_v2 = 8'd50;

  LimitCheck u_a_chk (
      .value(d),
      .limit(const_w8u50_v2),
      .fail (vendor_fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

`else
  assign vendor_fail = 1'b0;

`endif
```

**Why not one shared copy at the top level.** That is the scope enclosing both views. A build
that defines neither view compiles the constant and nothing that uses it (sketch, not emitted):

```systemverilog
  const logic [7:0] const_w8u50 = 8'd50;   // compiled in every build
`ifdef TSSV_XILINX
  LimitCheck u_x_chk (.limit(const_w8u50), ...);
`elsif TSSV_ALTERA
  LimitCheck u_a_chk (.limit(const_w8u50), ...);
`else
  assign vendor_fail = 1'b0;               // const_w8u50 unused here
`endif
```

`-Wall` fails that build with `UNUSEDSIGNAL`. The prototype tried this first and dropped it.

**A named constant beside its first use throws.** A copy would need a new name, and the caller
chose this one:

```typescript
c.views({
  TSSV_XILINX: () => { c.addConstSignal('LIMIT', 50n); c.addAssign({ in: new Expr('LIMIT'), out: 'y' }) },
  default: () => { c.addConstSignal('LIMIT', 50n); c.addAssign({ in: new Expr('LIMIT'), out: 'y' }) }
})
```

```text
NamedConst: signal LIMIT is declared in view TSSV_XILINX, so it can't be used in the default branch beside TSSV_XILINX (addConstSignal())
```

Declare a named constant used by several views at the top level, before the views.

### 4.7 Includes

A submodule's file is included under the conditions of each scope that instantiates it. A file
used at the top level is included unconditionally. From `views.ts#includes`:

```typescript
// LimitCheck is used at the top level and in TSSV_SIM; SaturationMonitor in TSSV_SIM and in
// TSSV_FPV, and nowhere else
inc.addSubmodule('u_chk', check, { value: 'd', limit: 200n, fail: 'fail' })
inc.inView(['TSSV_SIM'], () => {
  inc.addSignal('q_fail', {})
  inc.addSubmodule('u_q_chk', check, { value: 'q', limit: 200n, fail: 'q_fail' })
  inc.addBody('always_ff @(posedge clk) if (q_fail) $error("q over 200");')
  inc.addSubmodule('u_mon', monitor, { value: 'q' })
})
inc.inView(['TSSV_FPV'], () => {
  inc.addSubmodule('u_fpv_mon', monitor, { value: 'q' })
})
```

The include block of `ViewIncludesExample.sv`:

```systemverilog
`ifndef DEF__ViewIncludesExample__
`define DEF__ViewIncludesExample__
`ifdef USE_INCLUDES
`include "LimitCheck.sv"
`ifdef TSSV_SIM
`include "SaturationMonitor.sv"
`endif
`ifdef TSSV_FPV
`include "SaturationMonitor.sv"
`endif
`endif //USE_INCLUDES
```

- `LimitCheck.sv` is included unconditionally: the top level uses it, so every build needs it.
- `SaturationMonitor.sv` is included under each view that uses it. A build with both views
  reads it twice; the `DEF__` guard makes the second read empty.
- A build with neither view never reads `SaturationMonitor.sv`. The test checks the same thing
  on `ViewTop` with Verilator's preprocessor: `verilator -E +define+USE_INCLUDES ViewTop.sv`
  names no `SimRangeCheck.sv`, and adding `+define+TSSV_SIM` reads it.
- Interface files are still included unconditionally. They are small, and a local bundle in a
  view still has to parse.

Modules are still deduplicated by name, and every module reached is written, including those
reached only through views.

### 4.8 Checks for each view

**The SV-guide check** (`checkModule`) parses the module with `verible-verilog-syntax`. That tool
reads `` `ifdef `` with every macro undefined: it drops each `` `ifdef `` branch and keeps the
`` `else ``. Run once, it would check the default build only. So the prototype runs it:

- once with no macro defined;
- once for each set of macros that selects a linted branch, with `` `define `` lines before the
  module's text.

For `NestedViewsExample` (§4.2) the sets are none, `TSSV_XILINX`, and `TSSV_XILINX` with
`TSSV_ULTRASCALE`. The last run parses:

```systemverilog
`define TSSV_XILINX
`define TSSV_ULTRASCALE
module NestedViewsExample (
    ...
```

Each run sees only that build's instances and reset waivers. An error names its set. A module
whose `TSSV_XILINX` branch has a flop with no reset:

```typescript
this.views({
  TSSV_XILINX: () => { this.addRegister({ d: 'd', clk: 'clk', q: 'q' }) },
  default: () => { this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' }) }
})
```

```text
XilinxNoReset: always_ff @( posedge clk ) begin: q has no reset (RST-5: give every flop an async reset, or waive it with addResetWaiver) (with TSSV_XILINX defined)
```

A `default` branch adds no macro, so it repeats its parent's set. The prototype runs that set
again; the Task can skip repeats.

**Unlinted views** are left out of these runs (§3.4).

**LINT-1 for each view.** `test_views` runs Verilator on each example with each set of its
views, from the repo root:

```bash
verilator --lint-only -Wall doc/rtl-style/sv-style/common_waivers.vlt \
  --top-module NestedViewsExample +define+USE_INCLUDES +define+TSSV_XILINX \
  +incdir+doc/examples/core/views doc/examples/core/views/NestedViewsExample.sv
```

All of them are clean:

| Example | Sets of views linted besides none |
|---|---|
| `InViewExample`, `ViewRegistersExample`, `ViewsExample`, `SharedConstantExample`, `ActiveViewsExample`, `DefineViewExample` | `TSSV_SIM` |
| `ViewListExample`, `ViewsNoDefaultExample`, `ViewIncludesExample` | `TSSV_SIM`; `TSSV_FPV`; both |
| `ViewLayoutExample` | `TSSV_SIM`; `TSSV_SIM` with `TSSV_TRACE` |
| `NestedViewsExample`, `ActiveViewsNestedExample` | `TSSV_XILINX`; `TSSV_XILINX` with `TSSV_ULTRASCALE` |
| `SiblingConstantExample` | `TSSV_XILINX`; `TSSV_ALTERA` |
| `ViewTop` (Appendix A) | `TSSV_SIM`; `TSSV_XILINX`; `TSSV_XILINX` with `TSSV_ULTRASCALE`; `TSSV_ALTERA`; `TSSV_SIM` with `TSSV_XILINX` |

CI's `lint:sv` and `check:generated-sv` still lint with `USE_INCLUDES` only, which is the
default build. The Task closes this gap (§9).

**A port that only views use fails the default build.** The first version of
`NestedViewsExample` had no top-level register: every flop was in a view. A build with neither
view then left `clk` and `rst_b` unused:

```text
%Warning-UNUSEDSIGNAL: NestedViewsExample.sv:5:17: Signal is not used: 'clk'
%Warning-UNUSEDSIGNAL: NestedViewsExample.sv:6:17: Signal is not used: 'rst_b'
```

This is LINT-1 doing its job: the per-view lint finds it, and generation doesn't. The example
now registers `d` at the top level. A module whose default build has no use for a port sinks it
in the `default` branch, as SV-guide code sinks any unused input.

## 5. The null view

This is what the #109 thread agreed: a stub `<name>.sv` in a folder of its own, with the same
`DEF__<name>__` guard as the generated file. It is opt-in, per module. §3.5 shows the API and a
stub.

- **The stub.** It has the module's ports. Each output is assigned its tie, 0 by default. The
  inputs go into one `unused_inputs` net, which Verilator's unused check skips by name. It has
  no includes, so a build reads nothing below it. It lints clean with `-Wall` on its own. The
  SV-guide check runs on it.
- **Without `nullViewDir`**, `writeSystemVerilogFiles()` writes no stubs, so nothing changes.
- **Interface ports** aren't supported yet: writing the null view of such a module throws. A
  tie for an interface port needs its modport's directions; that is Task work.

**How a build picks the stub, measured on Verilator 5.052.** The test's `NullTop` instantiates
`Heavy`, which opts in. `Heavy` instantiates `HeavyLeaf` twice. The generated files are in
`gen/`, the stub in `null/`. Each route, as the test runs it (the test also passes
`common_waivers.vlt` and `--top-module NullTop`):

```bash
# 1. +incdir+ order: the null folder first
verilator --lint-only -Wall +define+USE_INCLUDES +incdir+null +incdir+gen gen/NullTop.sv

# 2. Read first, with USE_INCLUDES: the stub named before the top
verilator --lint-only -Wall +define+USE_INCLUDES +incdir+gen null/Heavy.sv gen/NullTop.sv

# 3. Read first, without USE_INCLUDES: the stub named before every generated file
verilator --lint-only -Wall null/Heavy.sv gen/HeavyLeaf.sv gen/Heavy.sv gen/NullTop.sv

# 4. The reverse of route 1: the generated folder first
verilator --lint-only -Wall +define+USE_INCLUDES +incdir+gen +incdir+null gen/NullTop.sv
```

| Route | Compiles the stub | Reads `HeavyLeaf` | `-Wall` |
|---|---|---|---|
| 1. `+incdir+null` before `+incdir+gen` | yes | no | clean |
| 2. stub read first, with `USE_INCLUDES` | yes | no | clean |
| 3. stub read first, without `USE_INCLUDES` | yes | yes, but nothing instantiates it | clean |
| 4. `+incdir+gen` before `+incdir+null` | no: the real `Heavy` | yes | — |

The test reads which `Heavy` was compiled from `verilator -E`: the stub has
`assign unused_inputs`, the real module has `u_leaf`.

The thread asked whether a tool searches `+incdir+` before the including file's own folder.
Verilator does: `NullTop.sv` sits beside the real `Heavy.sv`, and the null folder still wins.
Route 4 shows that the include path's order is what selects.

**Not checked: Vivado.** It isn't installed on the machine the spike ran on. Its order for
`` `include "<file>" `` needs a check before a build relies on route 1. Routes 2 and 3 don't
depend on search order.

**Null view and `views()`.** The two do related jobs at different levels:

| | A `views()` `default` branch (§3.2) | A null view |
|---|---|---|
| Stubs | one instance, in its parent | every instance of the module |
| Is | RTL in the parent | a separate file |
| Selected by | a macro | how the build reads files |
| The real module's RTL | is the other branch | doesn't change |

## 6. Byte-identical output

On the prototype, the base comparison over all 77 existing test scripts reports no change:

```bash
scripts/gen-sv --base origin/main $(git ls-tree -r --name-only origin/main ts/test \
  | grep '\.ts$' | grep -v -e '\.d\.ts$' -e test_AXI4XBar)
```

```text
Running 77 test script(s) on the base
Running them on this checkout
No change to generated SV (1300 file(s) compared)
```

The 21 existing builder examples under `doc/examples/core/` don't change either. A module with
no views emits through the same code. The prototype makes two changes on that path:

- It factors three loops of `moduleSystemVerilog()` into helpers that the view regions reuse:
  declarations, `always_ff` blocks and instances.
- It routes `body` and `registerBlocks` through the current scope, which is the top level when
  no view is open.

## 7. Limits of the prototype

### 7.1 A name is unique across the module, even in sibling views

Two sibling branches are never compiled together, so SV lets each declare the same name. The
prototype doesn't: names are in the module's flat maps (§4.5). A vendor RAM with one instance
name in every build throws:

```typescript
m.views({
  TSSV_XILINX: () => m.addSubmodule('u_ram', xilinxRam, { d: 'd', q: 'q' }),
  default: () => m.addSubmodule('u_ram', genericRam, { d: 'd', q: 'q' })
})
```

```text
submodule with instance name u_ram already exists
```

A signal is the same: `addSignal('t', {})` in both branches throws `t signal already exists`.

What this costs:

- A testbench that probes `u_ram` needs a different path in each build.
- A list of views can't have a `default` (§4.3). `views({ A: build, B: build, default })` would
  give one, but `build` declares its names twice.

The Task decides whether a name declared in a branch is free in the branches beside it. That
means looking names up through the scope chain, instead of in one map.

### 7.2 A build that names every file

A build without `USE_INCLUDES` names every file. `writeSystemVerilogFiles()` returns every
path, including the files only a view needs. For `ViewIncludesExample` (§4.7), it returns,
leaves first:

```text
LimitCheck.sv
SaturationMonitor.sv     only TSSV_SIM and TSSV_FPV need it
ViewIncludesExample.sv
```

A synthesizable build of #232's harness must use `USE_INCLUDES`, or the Task adds which views
each file needs (§9).

### 7.3 Other limits

- **CI lints the default build only** (§4.8).
- **Which combinations of views to check.** The prototype checks each branch's own set of
  macros. Two independent views defined together, such as `TSSV_SIM` with `TSSV_XILINX`, are
  checked only if someone lints that set. `ViewTop`'s test does; CI doesn't.
- **`synthesizable`.** #232 also needs `check-harness`'s SYN-1 scan to skip the
  simulation-only view. The prototype has only `lint`.
- **Signal metadata changes apply in every view.** A builder that changes an existing signal's
  `type` (such as `wire` to `logic`) or `isSigned` changes it for the whole module. This
  matches SV, where one signal has one declaration.

## 8. Alternatives considered

None of these is built. The snippets are sketches.

### 8.1 A `view` option on each `add*` call

```typescript
m.addSubmodule('u_chk', check, { value: 'q', limit: 200n, fail: 'fail' }, { view: 'TSSV_SIM' })
m.addAssign({ in: new Expr("1'b0"), out: 'fail' }, { view: '!TSSV_SIM' })
```

It changes every signature, which #109 rules out. The calls a builder makes for itself, such as
`createMissing`'s `addSignal` and the constant a bigint binding declares, wouldn't inherit the
option. A scope gives them all the view. And `'!TSSV_SIM'` would be a small condition language,
where `views()` has `default`.

### 8.2 A TC39 method decorator

```typescript
class Harness extends Module {
  @inView(['TSSV_SIM'])
  addChecks (): void {
    this.addSubmodule('u_chk', check, { ... })
  }
}
```

It works with TypeScript 5 without a flag, but it only wraps a method in `inView()`. It is sugar
to add later if it is wanted. Nothing in `ts/src` uses decorators today.

### 8.3 SV-2023 `` `ifdef `` expressions for a list

```systemverilog
`ifdef (TSSV_SIM || TSSV_FPV)
  SaturationMonitor u_mon (...);
`endif
```

Verilator 5.052 accepts it and selects correctly. `verible-verilog-syntax` rejects it. On a
module with this line, it reports:

```text
or.sv:5:8: preprocessing error at token "(" : Expected identifier for macro name, but got "(..."
```

So the SV-guide check can't parse the module, and the formatter fails under TSSV's
`--failsafe_success=false`. Revisit when Verible supports it. Vivado not checked.

### 8.4 A helper macro for a list

```systemverilog
`ifdef TSSV_SIM
`define ViewListExample_SIM_OR_FPV
`elsif TSSV_FPV
`define ViewListExample_SIM_OR_FPV
`endif
`ifdef ViewListExample_SIM_OR_FPV
  SaturationMonitor u_mon (...);
`endif
`undef ViewListExample_SIM_OR_FPV
```

A macro is global to the compilation unit. The helper needs a name unique to the module and the
list, and an `` `undef `` so that it doesn't reach the files read after this one. The include
block needs one too. Repeating the branch (§4.3) needs none of this, and costs only text.

### 8.5 `generate if` on a parameter

```systemverilog
module ViewsExample #(parameter bit SIM = 1'b0) (...);
  if (SIM) begin : g_sim
    LimitCheck u_chk (...);
  end else begin : g_no_sim
    assign fail = 1'b0;
  end
endmodule
```

It is selected at elaboration, after every file is read. A synthesizable build would still read
and parse `LimitCheck.sv`, and #232's checks. The instance path becomes `g_sim.u_chk`. And TSSV
modules declare no SV parameters (`doc/framework/concepts.md` §2).

### 8.6 One region per view in each section

See the sketch in §4.1.

### 8.7 A null view as an `` `ifdef `` region in every module

```systemverilog
module Heavy (...);
`ifdef BB_Heavy
  assign q = '0;
`else
  ... Heavy's RTL ...
`endif
endmodule
```

This is #172's `BB_<name>` macro. Its review dropped it: it puts the macro in every module. The
#109 thread chose a separate file (§5).

### 8.8 A subclass per target, chosen at elaboration

```typescript
const top = process.env.TARGET === 'sim' ? new HarnessSim() : new HarnessSynth()
top.writeSystemVerilogFiles('gen')
```

Each target is then a different generation run, with different module names and files. One
generated tree can't serve several builds.

## 9. Recommended Task

Once this proposal is approved, file a Task to land views. It starts from the prototype branch,
which already has the API, the examples above in the reference's Views group
(`doc/reference/Base.md`), and `test_views`:

1. Land `inView`, `views`, `activeViews`, `defineView`, `setNullView` and `nullViewDir` with the
   rules in §4 and §5. Write a section of `doc/framework/concepts.md` for them.
2. **Lint each view in CI.** Write a `<name>.views.json` beside each module with views, as
   `<name>.contracts.json` is for contracts. It lists the sets of macros to lint. Then make
   `check:generated-sv` and `lint:sv` lint each set with `-Wall`, skipping unlinted views. A
   sketch for `NestedViewsExample`:

   ```json
   {
     "module": "NestedViewsExample",
     "lint": [[], ["TSSV_XILINX"], ["TSSV_XILINX", "TSSV_ULTRASCALE"]]
   }
   ```

3. **Say which files each view needs.** Either the return value of `writeSystemVerilogFiles()`
   marks them (§7.2), or views require `USE_INCLUDES` builds.
4. **Names in sibling views.** Decide whether a name declared in one branch is free in the
   branches beside it (§7.1).
5. **Combinations.** A project declares which views are built together, and those sets are
   checked too.
6. **Null views with interface ports**, tied through their modports.
7. **Vivado.** Check both null-view routes and the conditional includes.
8. Skip repeated sets in the per-view SV-guide runs (§4.8).
9. Leave `synthesizable` and `check-harness` to #232, which builds on this.

## Appendix A: `ViewTop`, whole

`ViewTop` is the test's module shaped like #232's harness. It puts most of the rules together:

- a simulation-only check, tied off in other builds;
- a constant that moves out of a view to the top level;
- a vendor view with a view nested in it;
- a list of two vendors.

Its TypeScript, from `ts/test/test_views.ts`. `CLK`, `RST`, `BYTE_IN` and `BYTE_OUT` are the
test's port shapes, and `views` is where it records `activeViews` to check them (§3.3):

```typescript
// The simulation-only view, as #232 uses it: its RTL isn't linted
Module.defineView('TSSV_SIM', { lint: false })

/** Flags a value above a limit, a cycle later: the kind of check #232 keeps out of synthesis */
class RangeCheck extends Module {
  constructor (params: TSSVParameters & { name: string }) {
    super(params)
    this.IOs = { clk: CLK, rst_b: RST, value: BYTE_IN, limit: BYTE_IN, fail: { direction: 'output' } }
    this.addSignal('over', {})
    this.addAssign({ in: new Expr('value > limit'), out: 'over' })
    this.addRegister({ d: 'over', clk: 'clk', reset: 'rst_b', q: 'fail' })
  }
}

class ViewTop extends Module {
  constructor () {
    super({ name: 'ViewTop' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, x_q: BYTE_OUT, fail: { direction: 'output' }, over: { direction: 'output' } }
    views.top = this.activeViews
    this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
    // A simulation-only check; every other build ties its fail off
    this.views({
      TSSV_SIM: () => {
        this.addSignal('chk_fail', {})
        this.addSubmodule('u_chk', new RangeCheck({ name: 'SimRangeCheck' }),
          { clk: 'clk', rst_b: 'rst_b', value: 'q', limit: 200n, fail: 'chk_fail' }, false)
        this.addAssign({ in: new Expr('chk_fail'), out: 'fail' })
      },
      default: () => {
        this.addAssign({ in: new Expr("1'b0"), out: 'fail' })
      }
    })
    // The constant the check declared (200), used at the top level too: it moves out of the view
    this.addSubmodule('u_over', new RangeCheck({ name: 'RangeCheck' }),
      { clk: 'clk', rst_b: 'rst_b', value: 'd', limit: 200n, fail: 'over' }, false)
    // A vendor view with a view nested in it; its register shares the top level's clock and reset
    this.views({
      TSSV_XILINX: () => {
        this.addSignal('x_d', { width: 8 })
        this.addAssign({ in: new Expr('~d'), out: 'x_d' })
        this.addSignal('x_stage', { width: 8 })
        this.addRegister({ d: 'x_d', clk: 'clk', reset: 'rst_b', q: 'x_stage' })
        this.views({
          TSSV_ULTRASCALE: () => {
            views.nested = this.activeViews
            this.addRegister({ d: 'x_stage', clk: 'clk', reset: 'rst_b', q: 'x_q' })
          },
          default: () => {
            this.addAssign({ in: new Expr('x_stage'), out: 'x_q' })
          }
        })
      },
      default: () => {
        this.addAssign({ in: new Expr('d'), out: 'x_q' })
      }
    })
    // RTL for either vendor
    this.inView(['TSSV_XILINX', 'TSSV_ALTERA'], () => {
      this.addSignal('unused_fpga_fail', {})
      this.addSubmodule('u_fpga_chk', new RangeCheck({ name: 'FpgaRangeCheck' }),
        { clk: 'clk', rst_b: 'rst_b', value: 'd', limit: 100n, fail: 'unused_fpga_fail' }, false)
    })
  }
}
```

How each line of the SV below comes from it:

- `const_w8u200`: `u_chk`'s `limit: 200n` declares it in `TSSV_SIM`. Then `u_over`'s
  `limit: 200n`, at the top level, moves it out (§4.6). Both instances use it.
- `` `ifdef TSSV_SIM `` / `` `else ``: the first `views()` call.
- `` `ifdef TSSV_XILINX ``, with `` `ifdef TSSV_ULTRASCALE `` inside it: the second `views()`
  call and the one nested in it (§4.2).
- `` `ifdef TSSV_XILINX `` / `` `elsif TSSV_ALTERA ``, the same RTL twice: the `inView()` list
  (§4.3).
- Three `always_ff` blocks, one per scope with a register (§4.4).
- The include block: `SimRangeCheck.sv` under `TSSV_SIM`, `RangeCheck.sv` unconditionally,
  `FpgaRangeCheck.sv` under the list (§4.7).

`ViewTop.sv`, whole:

```systemverilog
`ifndef DEF__ViewTop__
`define DEF__ViewTop__
`ifdef USE_INCLUDES
`ifdef TSSV_SIM
`include "SimRangeCheck.sv"
`endif
`include "RangeCheck.sv"
`ifdef TSSV_XILINX
`include "FpgaRangeCheck.sv"
`elsif TSSV_ALTERA
`include "FpgaRangeCheck.sv"
`endif
`endif //USE_INCLUDES

module ViewTop (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q,
    output logic [7:0] x_q,
    output logic fail,
    output logic over
);
  const logic [7:0] const_w8u200 = 8'd200;


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

  RangeCheck u_over (
      .clk  (clk),
      .rst_b(rst_b),
      .value(d),
      .limit(const_w8u200),
      .fail (over)
  );

`ifdef TSSV_SIM
  logic chk_fail;
  assign fail = chk_fail;

  SimRangeCheck u_chk (
      .clk  (clk),
      .rst_b(rst_b),
      .value(q),
      .limit(const_w8u200),
      .fail (chk_fail)
  );

`else
  assign fail = 1'b0;

`endif

`ifdef TSSV_XILINX
  logic [7:0] x_d;
  logic [7:0] x_stage;
  assign x_d = ~d;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      x_stage <= '0;
    end else begin
      x_stage <= x_d;
    end

`ifdef TSSV_ULTRASCALE

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      x_q <= '0;
    end else begin
      x_q <= x_stage;
    end

`else
  assign x_q = x_stage;

`endif

`else
  assign x_q = d;

`endif

`ifdef TSSV_XILINX
  logic unused_fpga_fail;
  const logic [7:0] const_w8u100 = 8'd100;

  FpgaRangeCheck u_fpga_chk (
      .clk  (clk),
      .rst_b(rst_b),
      .value(d),
      .limit(const_w8u100),
      .fail (unused_fpga_fail)
  );

`elsif TSSV_ALTERA
  logic unused_fpga_fail;
  const logic [7:0] const_w8u100 = 8'd100;

  FpgaRangeCheck u_fpga_chk (
      .clk  (clk),
      .rst_b(rst_b),
      .value(d),
      .limit(const_w8u100),
      .fail (unused_fpga_fail)
  );

`endif

endmodule

`endif //!DEF__ViewTop__
```

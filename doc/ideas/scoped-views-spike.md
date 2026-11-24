# Scoped Views Spike

> Status: Proposal (#109). The prototype is on branch
> [`spike/109-scoped-target-views-prototype`](https://github.com/TypeScriptSystemVerilog/TSSV/tree/spike/109-scoped-target-views-prototype)
> (commits `cba0ba4` and `cb39f4d`). It is not merged. The implementation is a follow-up Task.
> Scope: the API, the emission rule for each open point in #109, the null view, and the
> alternatives considered.

## 1. Purpose

A module sometimes needs RTL that only some builds compile. Examples:

- A harness keeps contract checks in simulation and leaves them out of the FPGA image (#232).
- A design uses a vendor primitive in one build and generic RTL in the others.

SystemVerilog selects such RTL with `` `ifdef ``. TSSV has no way to emit it today, except raw
text through `addBody()`. This spike adds **views**. A view is an SV macro. Every `add*` call made
inside a view's scope is tagged with the view, and emission wraps what the call wrote in
`` `ifdef ``.

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

| Need | Where this proposal meets it |
|---|---|
| A view holds whole check modules, and a synthesizable build never reads their files | §4.7, conditional includes |
| The simulation-only view isn't linted and needn't be synthesizable (tssv-noc#313 review) | §4.8, `defineView(name, { lint: false })` |
| A check's `fail` bit exists in simulation and is tied to 0 in the synthesizable view | §3, `views({ ..., default })` |
| `Harness.check()` knows which checks are simulation-only, for SimTop's report and #202's status | §3, `activeViews` |

## 3. API

All of it is on `Module`. No `add*` signature changes.

| Member | What it does |
|---|---|
| `inView(views: string[], build: () => void)` | Runs `build`; every `add*` call inside it is in a view scope that any one of `views` selects. Emits `` `ifdef A `` (with several views, `` `ifdef A `` / `` `elsif B ``) |
| `views({ A: () => ..., B: () => ..., default: () => ... })` | One scope per key, one of which is compiled: `` `ifdef A `` / `` `elsif B `` / `` `else ``. `default` is compiled when none of the others is defined. Without `default` there is no `` `else `` |
| `get activeViews(): readonly ViewCondition[]` | The conditions of the current scope, outermost first; `[]` at the top level. A condition is `{ anyOf: [...] }`, or `{ noneOf: [...] }` for a `default` branch |
| `static defineView(name, { lint })` | Declares how a view's RTL is checked. A view never declared is linted (§4.8) |
| `setNullView({ ties })` | Opts the module into a null view (§5) |
| `writeSystemVerilogFiles(dir, { nullViewDir })` | Also writes the null view of each opted-in module it reaches |

The #232 harness, written with it:

```typescript
Module.defineView('TSSV_SIM', { lint: false })

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
```

The prototype emits this. It is cut from `ViewTop.sv`, which `ts/test/test_views.ts` writes:

```systemverilog
`ifndef DEF__ViewTop__
`define DEF__ViewTop__
`ifdef USE_INCLUDES
`ifdef TSSV_SIM
`include "SimRangeCheck.sv"
`endif
`include "RangeCheck.sv"
...                                      // FpgaRangeCheck.sv, under TSSV_XILINX or TSSV_ALTERA
`endif //USE_INCLUDES

module ViewTop (
    ...
);
  const logic [7:0] const_w8u200 = 8'd200;
  ...                                    // the top level's RTL, as today

`ifdef TSSV_SIM
  logic chk_fail;
  assign fail = chk_fail;

  SimRangeCheck u_chk (
      ...
      .fail (chk_fail)
  );

`else
  assign fail = 1'b0;

`endif

endmodule

`endif //!DEF__ViewTop__
```

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

A module with no views takes the old code path, so its text doesn't change (§6).

The alternative was one region per view in each section: declarations, body, registers,
instances. It keeps the section order, but it splits one view into up to four regions. A
reader of #232's harness wants a view's RTL in one place.

### 4.2 Nesting

A call inside another view's scope opens a region inside that branch. The nested RTL needs both
conditions. `activeViews` lists them, outermost first. ViewTop nests
`views({ TSSV_ULTRASCALE, default })` inside `TSSV_XILINX`.

### 4.3 A list of views

`inView(['TSSV_XILINX', 'TSSV_ALTERA'], ...)` means either one. One `` `ifdef `` tests one
macro, so the branch is repeated:

```systemverilog
`ifdef TSSV_XILINX
  <the branch>
`elsif TSSV_ALTERA
  <the branch, again>
`endif
```

Only one copy is compiled. Repetition costs only text. Two other ways were tried; neither works
today (§8).

### 4.4 Registers

`registerBlocks` is kept per scope, and `addRegister` writes to the current scope's. So
registers in different views never share an `always_ff`, even with the same clock, reset and
enable. ViewTop has three blocks for three scopes. A scope's blocks are emitted inside its
branch.

### 4.5 A signal used outside its view

Signals, local interface bundles and submodule instances keep their flat maps, so every name is
still unique across the module. Each one declared in a view is tagged with its scope. The
check:

- `findSignal`, which every builder uses to resolve a name, throws for a signal or an interface
  member whose scope is neither the current scope nor one that encloses it. A sibling view
  counts as outside. The message names the view:
  `Leaky: signal sim_only is declared in view TSSV_SIM, so it can't be used outside it (addAssign())`.
- `addSubmodule` checks an interface bound to a port the same way.
- Text the core doesn't parse isn't checked: an `Expr`, `addBody()` text, an always block's
  body. The per-view lint (§4.8) catches a misuse there.

These can't be declared in a view, because a module has the same ports in every view:

- an interface port (`addInterface` with a role);
- a port contract;
- a plain port, which comes from `IOs`, not from an `add*` call.

### 4.6 Constants

`addConstSignal` shares a constant by name, and a bigint binding in `addSubmodule` creates one.
So the same constant can be asked for from two scopes. The rule:

- **The new use's scope encloses the old one's:** the constant moves out to the new scope. It
  is used wherever it's compiled. ViewTop's `const_w8u200` moves to the top level this way.
- **A scope beside it:** an auto-named constant gets a copy of its own in the new scope,
  `<name>_v2`. A named one throws, as any signal does.

Moving the constant out to the scope that encloses both uses doesn't work. For two sibling
views, that scope is the top level. There the constant is unused in a build that defines
neither view, and fails `-Wall` with `UNUSEDSIGNAL`. The test's `Siblings` module checks the copy
rule in all three builds.

### 4.7 Includes

A submodule's file is included under the conditions of each scope that instantiates it.
A file used at the top level is included unconditionally:

- A build that leaves `TSSV_SIM` undefined never reads `SimRangeCheck.sv`. The test checks this
  with Verilator's preprocessor output.
- A file reached from two views is included under each one. The `DEF__` guard makes the second
  include harmless.
- Interface files are still included unconditionally. They are small, and a local bundle in a
  view still has to parse.

Modules are still deduplicated by name, and every module reached is written.

### 4.8 Checks for each view

**The SV-guide check** (`checkModule`) parses the module with `verible-verilog-syntax`. That
tool reads `` `ifdef `` with every macro undefined: it drops each `` `ifdef `` branch and keeps
the `` `else ``. Run once, it would check the default build only. So the prototype runs it:

- once with no macro defined;
- once for each set of macros that selects a linted branch, with `` `define `` lines prepended.

Each run sees only that build's instances and reset waivers. An error names its set:
`... (with TSSV_XILINX defined)`.

The formatter parses every branch, so a syntax error anywhere still fails emission, even in an
unlinted view.

**Unlinted views.** `Module.defineView('TSSV_SIM', { lint: false })` marks a view whose RTL
isn't checked. For #232, this follows Adam's review of tssv-noc#313: no `--lint-only` on the
simulation-only parts, and they needn't be synthesizable.

- Branches that need the view are left out of the SV-guide runs.
- A module reached only through such views is written without its own SV-guide check. The test
  shows a module with a flop and no reset, `SloppyCheck`, written that way. Instantiated at the
  top level instead, the same module fails RST-5.

**LINT-1 for each view.** The test lints ViewTop with `-Wall` six ways. All six are clean:

- no view defined;
- `TSSV_SIM`, `TSSV_XILINX` and `TSSV_ALTERA`, each alone;
- `TSSV_XILINX` with the nested `TSSV_ULTRASCALE`;
- `TSSV_SIM` with `TSSV_XILINX`.
 CI's `lint:sv` and
`check:generated-sv` still lint with `USE_INCLUDES` only, which is the default build. The Task
closes this gap (§9).

## 5. The null view

This is what the #109 thread agreed: a stub `<name>.sv` in a folder of its own, with the same
`DEF__<name>__` guard as the generated file. It is opt-in, per module.

- **API.** `setNullView({ ties: { ready: 1n } })` in the module's constructor.
  `writeSystemVerilogFiles(dir, { nullViewDir })` then writes `<nullViewDir>/<name>.sv` for each
  opted-in module it reaches. Without `nullViewDir`, nothing changes.
- **The stub.** It has the module's ports. Each output is assigned its tie, 0 by default. The
  inputs go into one `unused_inputs` net, which Verilator's unused check skips by name. It has
  no includes, so a build reads nothing below it. It lints clean with `-Wall` on its own. The
  SV-guide check runs on it.
- **Interface ports** aren't supported yet: writing the null view of such a module throws. A
  tie for an interface port needs its modport's directions; that is Task work.

**How a build picks the stub, measured on Verilator 5.052.** `Top` instantiates `Heavy`, which
opts in. `Heavy` instantiates `HeavyLeaf` twice.

| Route | Compiles the stub | Reads `HeavyLeaf` | `-Wall` |
|---|---|---|---|
| `+incdir+null +incdir+gen gen/Top.sv`, with `USE_INCLUDES` | yes | no | clean |
| `null/Heavy.sv` named before `gen/Top.sv`, with `USE_INCLUDES` | yes | no | clean |
| `null/Heavy.sv` named before every generated file, without `USE_INCLUDES` | yes | yes, unused | clean |
| `+incdir+gen +incdir+null gen/Top.sv` (the reverse order) | no: the real `Heavy` | yes | — |

The thread asked whether a tool searches `+incdir+` before the including file's own folder.
Verilator does: `Top.sv` sits beside the real `Heavy.sv`, and the null folder still wins. The
reverse order shows that the include path's order is what selects.

**Not checked: Vivado.** It isn't installed on the machine the spike ran on. Its order for
`` `include "<file>" `` needs a check before a build relies on the `+incdir+` route. The
read-first route doesn't depend on search order.

**Null view and `views()`.** The two do related jobs at different levels:

- A `views()` `default` branch that ties off outputs stubs **one instance** in one build. It is
  RTL in the parent, selected by a macro.
- A null view stubs **every instance of a module**. It is a separate file, selected by how the
  build reads files, and the real module's RTL doesn't change.

## 6. Byte-identical output

On the prototype, `scripts/gen-sv --base origin/main` over all 77 existing test scripts reports
`No change to generated SV (1300 file(s) compared)`. A module with no views emits through the
same code. The prototype makes two changes on that path:

- It factors three loops of `moduleSystemVerilog()` into helpers that the view regions reuse:
  declarations, `always_ff` blocks and instances.
- It routes `body` and `registerBlocks` through the current scope, which is the top level when
  no view is open.

## 7. Limits of the prototype

- **A build that names every file** (no `USE_INCLUDES`) reads every module, including those
  reached only through a view. `writeSystemVerilogFiles()` returns every path. It doesn't say
  which files a view needs. A synthesizable build of #232's harness must use `USE_INCLUDES`, or
  the Task adds that information.
- **CI lints the default build only** (§4.8).
- **Which combinations of views to check.** The prototype checks each branch's own set of
  macros. Two independent views defined together, such as `TSSV_SIM` with `TSSV_XILINX`, are
  checked only if someone lints that set.
- **`synthesizable`.** #232 also needs `check-harness`'s SYN-1 scan to skip the
  simulation-only view. The prototype has only `lint`.
- **Signal metadata changes apply in every view.** A builder that changes an existing signal's
  `type` (such as `wire` to `logic`) or `isSigned` changes it for the whole module. This
  matches SV, where one signal has one declaration.

## 8. Alternatives considered

| Alternative | Why not |
|---|---|
| A `view` option on each `add*` call | Changes every signature, which #109 rules out. And the calls a builder makes for itself, such as `createMissing`'s `addSignal`, wouldn't inherit it. A scope does |
| A TC39 method decorator, `@inView(['TSSV_SIM'])`, on a method that makes `add*` calls | Works with TypeScript 5 without a flag, but it only wraps a method in `inView()`. Sugar to add later if it is wanted; nothing in `ts/src` uses decorators today |
| SV-2023 `` `ifdef (A \|\| B) `` for a list of views | Verilator 5.052 accepts it and selects correctly. `verible-verilog-syntax` rejects it ("Expected identifier for macro name"), so the SV-guide check can't parse the module, and the formatter fails under TSSV's `--failsafe_success=false`. Revisit when Verible supports it. Vivado not checked |
| A helper macro for a list: `` `ifdef A `define V1 `endif `` ... `` `ifdef V1 `` | A macro is global to the compilation unit. The helper would leak into every file compiled after it, and need a name unique to the module and an `` `undef `` |
| `generate if` on a parameter | Selected at elaboration, after every file is read. A synthesizable build would still read and parse #232's checks. And TSSV modules declare no SV parameters (`doc/framework/concepts.md` §2) |
| One region per view in each section | §4.1 |
| A null view as an `` `ifdef `` region in every module (#172's `BB_<name>` macro) | Dropped in #172's review: it puts the macro in every module. The #109 thread chose a separate file |
| A subclass per target, chosen at elaboration | Each target is then a different generation run, with different module names and files. One generated tree can't serve several builds |

## 9. Recommended Task

Once this proposal is approved, file a Task to land views. It starts from the prototype
branch:

1. Land `inView`, `views`, `activeViews`, `defineView`, `setNullView` and `nullViewDir` with the
   rules in §4 and §5. Write a section of `doc/framework/concepts.md` for them, and regenerate
   `doc/reference/` (`npm run docs`).
2. **Lint each view in CI.** Write a `<name>.views.json` beside each module with views, as
   `<name>.contracts.json` is for contracts. It lists the macro sets to lint. Then make
   `check:generated-sv` and `lint:sv` lint each set with `-Wall`, skipping unlinted views.
3. **Say which files each view needs.** Either the return value of `writeSystemVerilogFiles()`
   marks them, or views require `USE_INCLUDES` builds.
4. **Combinations.** A project declares which views are built together, and those sets are
   checked too.
5. **Null views with interface ports**, tied through their modports.
6. **Vivado.** Check both null-view routes and the conditional includes.
7. Leave `synthesizable` and `check-harness` to #232, which builds on this.

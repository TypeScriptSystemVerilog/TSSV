# AGENTS.md — TSSV

## Project Overview

TSSV (TypeScript SystemVerilog) is a meta-HDL framework that generates synthesizable SystemVerilog from TypeScript. Designers write TypeScript classes that extend `Module`, then call `writeSystemVerilog()` to emit `.sv` files — similar to Chisel for Scala, but targeting SystemVerilog designers. Out of scope: simulation, formal verification, synthesis, and place-and-route.

## Repo Structure

```
ts/src/core/          Framework base classes: Module, Sig, Expr, Interface, Registers
ts/src/modules/       Pre-built parameterized modules, one folder each (FIR, SRAM, SFIFO, ROM, LZC, AXI4XBar, shift, IpXactComponent, APB_to_Memory)
ts/src/interfaces/    Signal-bundle definitions — AMBA 2–5 (100+ specs), TileLink, Memory
ts/src/tools/         CLI utilities: xml_interface_build (XML→TSSV), cpu_convert
ts/test/              Runnable demo scripts; each writes its output under sv-examples/
out/                  Compiled JS — git-ignored, rebuilt with npx tsc
sv-examples/          Generated SystemVerilog — git-ignored, each test regenerates its own; never hand-edit
docs/                 Auto-generated TypeDoc HTML — never hand-edit
verilatorTB/          Verilator simulation harness with C++ driver and GTKWave script
doc/framework/        How to use the framework: core API reference, simulation
doc/modules/          One folder per module: doc/modules/<Module>/<Module>-spec.md
doc/templates/        Templates for new docs (module spec)
doc/tutorials/        Worked examples (FIR, end to end)
doc/tools/            CLI tool docs
doc/ideas/            Design notes and spike specs, each marked with its status
doc/rtl-style/        Style guides for the emitted SV and for the TypeScript, with their checks
doc/process/          Repo process specs (issue-workflow.md)
ci/image/             CI toolchain image (tssv-ci): Dockerfile, VERSION tag, smoke test
.github/              Issue forms, PR template, commit template, workflows (ci-image.yml)
```

Docs live under `doc/`, never under `ts/`. A module's spec is always at
`doc/modules/<Module>/<Module>-spec.md`, named with the module's exact class name, and the
module class's JSDoc points to it with `@see`. The spec's `Source:` header names the module's
folder, `ts/src/modules/<Module>/`, however many files it holds.

## Key Documents

| Document | Authoritative For |
|---|---|
| `ts/src/core/Base.ts` | All builder APIs: `addSignal`, `addRegister`, `addSubmodule`, `addCombAlways`, etc. |
| `doc/framework/core-api-reference.md` | Quick reference for the builders, with examples. A stopgap: #71 moves it into the core's JSDoc and deletes it |
| `doc/framework/simulation.md` | The `verilatorTB/` flow: TS → SV → Verilator → VCD → GTKWave, Makefile variables, driver macros |
| `doc/modules/<Module>/<Module>-spec.md` | One per module in `ts/src/modules/`: parameters, IOs, behavior, timing, test plan |
| `doc/templates/module-spec-template.md` | The template for a new module's spec |
| `doc/tutorials/fir.md` | FIR walkthrough: every construct in the module and its testbench, then compile, generate and simulate |
| `doc/tools/cpu_convert.md` | `cpu_convert`: extracting SRAMs from third-party RTL into TSSV SRAM libraries |
| `doc/rtl-style/README.md` | Index of the two style guides (emitted SV; TypeScript) and their checks; the SV rules are in `doc/rtl-style/sv-style/sv-coding-style.md` |
| `doc/ideas/body-formatting-spike-spec.md`, `doc/ideas/body-formatting-spike-implementation-plan.md` | Why and how `addBody()` and the Verible formatter were added (implemented) |
| `doc/process/issue-workflow.md` | Issue-driven workflow: Issue Types, templates, branch/commit/PR conventions, AC gating |
| `README.md` | Machine setup (agent-first; pinned Node/Verible/Verilator), quick-start demo, roadmap |
| `CLAUDE.md` | Notes specific to Claude Code as a tool; defers to this file for everything else |

## GitHub Issue-Driven Workflow

All work — human- or agent-initiated — is tracked through a GitHub issue with explicit
Acceptance Criteria (AC), implemented on a branch named after that issue, and merged via a
PR that closes it only once every AC item is verified true. `doc/process/issue-workflow.md`
is the authoritative spec; this section is the operating procedure an agent follows.

**Tooling**: `gh` CLI, authenticated as the human operator's own account with `repo` scope
(`gh auth status` to check). No separate bot credentials.

**Classification**:
- **Type** — native Issue Type, exactly one, org-level: `Idea`, `Epic`, `Task`, `Subtask`,
  `Bug`, `Docs`, `Spike`, `Chore`. Set with `gh issue create --type <Type>` or
  `gh issue edit <n> --type <Type>`. `--template` only seeds the body text — it does *not*
  apply the template's `type:` key, so always pass `--type` explicitly from the CLI.
- **Labels** — none required; Type carries the classification. Stock labels (`duplicate`,
  `wontfix`, `question`, `good first issue`, `help wanted`) are still fine as attribute tags.
- **Relationships** — native sub-issues for hierarchy (`gh issue edit <child> --parent <n>`)
  and native dependencies for real blockers (`gh issue edit <n> --add-blocked-by <m>`).
  Don't record either as prose in the body.

**Lifecycle an agent runs, end to end:**

1. **Create the issue.** When a human prompts new work in chat, turn it into an issue
   before writing any code: `gh issue create --type <Type> --template <type>.yml` (or fill
   the same fields via `--body`). Every issue must have an Acceptance Criteria checklist of
   concrete, checkable items — not "works correctly." If it's a child of an epic or a
   larger task, link it with `gh issue edit <n> --parent <parent>`.
2. **Branch.** `git checkout -b <type>/<issue-number>-<kebab-slug> --no-track origin/main`
   (never work on `main` directly). The `--no-track` matters: without it the branch's
   upstream is `origin/main`, and a push that targets the upstream lands on `main`. Assign
   the issue (`gh issue edit <n> --add-assignee @me`) and backfill the branch into the
   issue body's `Links` field (`doc/process/issue-workflow.md` §5).
3. **Implement**, committing with the template in `.github/COMMIT_TEMPLATE.txt`:
   `<type>(#<issue>): <summary>` where `<type>` is a Conventional-Commits tag (`feat`,
   `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `build`) describing the diff,
   independent of the issue's Issue Type.
4. **Narrate progress as issue comments**, not by rewriting the issue body: what was tried,
   decisions/deviations from the original scope.
5. **Open the PR** with `gh pr create`, following `.github/PULL_REQUEST_TEMPLATE.md`: body
   has `Closes #<issue-number>`, reproduces the Acceptance Criteria checklist from the
   issue, and states the test plan (commands actually run). Backfill the PR into the
   issue's `Links` field.
6. **Verify AC before checking any box.** Run the build/tests/lint the checklist calls for
   (`npx tsc`, `node out/test/test_<Name>.js`, `bash runAllTests.sh`, `npx eslint .`,
   `verilator --lint-only ...`), confirm the actual output, then check boxes in the PR
   description accordingly.
7. **Hand off for merge — do not merge unilaterally.** Merging is the human's call. Report
   the PR as ready and wait. Once merged, confirm the issue auto-closed via `Closes #`.

## Conventions

- **Naming**: module classes PascalCase; signals and parameters camelCase; interface files follow exact AMBA spec naming (e.g. `AXI4-Lite.ts`)
- **Generated files**: `sv-examples/`, `docs/`, and `out/` must never be manually edited
- **New module pattern**: see "Adding a New Module" under Core Architecture below
- **Docs**: every doc lives under `doc/` and is listed in Key Documents above; no `.md` files under `ts/`. A module's spec is `doc/modules/<Module>/<Module>-spec.md`
- **RTL coding style**: the SV a module emits — especially `addCombAlways()`/`addSequentialAlways()`/`addLatchAlways()` bodies — follows `doc/rtl-style/sv-style/sv-coding-style.md`; cite rule IDs (e.g. `COMB-2`) in reviews and lint waivers
- **Code style**: `eslint-config-love` (strict TS). Notable disabled rules: `strict-boolean-expressions`, `prefer-nullish-coalescing`, `naming-convention`. Run `npx eslint .` before committing
- **TypeScript**: strict mode, and `noUncheckedIndexedAccess` is on, so array accesses return `T | undefined`; handle accordingly. Module system `NodeNext` (ESM), target ES2020

## Core Architecture

### Module (`ts/src/core/Base.ts`)
Every TSSV component extends `Module`. A module is constructed with:
- `params` — typed parameter bag; drives parameterization, and the module name is derived from its values unless `name` is set
- `IOs` — port map (`{ name: { direction, width } }`)
- `signals` — internal wire declarations
- `body` — optional raw SV string

Builder methods add logic inside the constructor. Nothing is emitted until `writeSystemVerilog()`:

| Method | Purpose |
|---|---|
| `addSignal()` | Declare internal signals |
| `addRegister()` | Create a DFF with clock/reset/enable bindings |
| `addCombAlways()` / `addSequentialAlways()` / `addLatchAlways()` | Add always blocks |
| `addAssign()` | Continuous assignment |
| `addSubmodule()` / `addSystemVerilogSubmodule()` | Instantiate a child `Module`, or an existing `.sv` file, with port bindings |
| `addMultiplier()`, `addAdder()`, `addMux()`, etc. | Arithmetic/logic primitives |
| `addInterface()` | Add an `Interface` bundle to the module |
| `addBody()` / `addBodyLine()` | Append raw SV to the module body |
| `writeSystemVerilog()` | Render the module and its submodules to SV |

### Interface (`ts/src/core/Base.ts`)
`Interface` wraps a group of signals with modports. An instance's role picks one of its modports (`inward`, `outward`, `monitor` in the bundled interfaces). Interfaces in `ts/src/interfaces/` follow this pattern: each file defines a class with `signals` and `modports`.

### Signals and Expressions
- `Sig` — a named signal reference
- `Expr` — a string expression (combinational), used in assignments and bindings

### Adding a New Module
1. Create `ts/src/modules/<Module>/<Module>.ts` (plus an `index.ts` re-export, like the existing modules) and extend `Module`
2. Define a typed `Parameters` interface
3. Declare IOs as a port map
4. In the constructor, build logic with `add*()` methods
5. Add a test in `ts/test/test_<Module>.ts` that instantiates the class and writes its SV under `sv-examples/<Module>/<instance>/`
6. `npx tsc && node out/test/test_<Module>.js` to generate and inspect the SV output
7. Follow `doc/rtl-style/sv-style/sv-coding-style.md` for every SV string you write, especially `addCombAlways()`/`addSequentialAlways()` bodies, and lint the output with `verilator --lint-only -Wall`
8. Write its spec from `doc/templates/module-spec-template.md` at `doc/modules/<Module>/<Module>-spec.md`, and add `@see doc/modules/<Module>/<Module>-spec.md` to the class's JSDoc

## Current Implementation State

| Area | Status | Notes |
|---|---|---|
| Core framework (`Base.ts`, `Registers.ts`) | Complete | `Module` base class with the full builder API |
| AMBA 2–5 interfaces | Complete | 100+ files across AHB, APB, ATB, AXI, AXI4, ACE, CHI, CXS, LPI, GFB, LTI, P/Q-Channel |
| TileLink + Memory interfaces | Complete | |
| Built-in modules | Complete | FIR, SRAM, SFIFO, ROM, LZC, AXI4XBar, shift, IpXactComponent, APB_to_Memory |
| CLI tools | Complete | `xml_interface_build`, `cpu_convert` |
| Verilator simulation harness | Complete | `verilatorTB/` — full TS→SV→binary→VCD flow |
| Verible integration | Complete | Default formatter for emitted SV (`ts/src/tools/formatters/verible.ts`); SV import header parser (`ts/src/core/SVModuleHeader.ts`) |
| TypeDoc documentation | Complete | Auto-generated; rebuild with `npm run docs` |
| Formal test runner | Not implemented | Tests are standalone scripts run via `node out/test/test_<Name>.js` |

## Common Tasks — Where to Start

- **Adding a new module**: read `ts/src/core/Base.ts` (builder API), `doc/rtl-style/sv-style/sv-coding-style.md` (rules for the emitted SV), then `ts/src/modules/FIR/FIR.ts` with `doc/modules/FIR/FIR-spec.md` as a reference implementation; follow "Adding a New Module" above
- **Adding a new interface**: read `ts/src/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4.ts` for the signal-bundle and modport pattern
- **Using the register helpers**: read `ts/src/core/Registers.ts` and the `RegisterBlock` section of `doc/framework/core-api-reference.md`
- **Running a single test**: `npx tsc && node out/test/test_<Name>.js` — output lands in `sv-examples/`
- **Running all tests**: `bash runAllTests.sh`
- **Prerequisite — Verible**: `verible-verilog-format` and `verible-verilog-syntax` must be on `PATH` (see README.md). Generated SV is Verible-formatted by default and generation fails without it; `addSystemVerilogSubmodule()` parses imported SV headers with `verible-verilog-syntax`
- **Linting generated SV**: `verilator --lint-only sv-examples/<dir>/<file>.sv`
- **Simulating**: `cd verilatorTB && make` then `./rungtkwave.sh <name>.vcd`; details in `doc/framework/simulation.md`
- **Learning the framework end to end**: `doc/tutorials/fir.md`

---

## Documentation

TSSV documentation is generated by **TypeDoc** from JSDoc-style comments in `ts/src/**/*.ts`. The output lands in `docs/typedoc/` — never hand-edit those files. Rebuild with:

```bash
npm run docs
```

### JSDoc comment conventions

Place a `/** ... */` block directly above every exported class, interface, type, and public method. Use these tags:

| Tag | Purpose | Example |
|---|---|---|
| *(plain text)* | Description of the item | `/** Container for a named SV signal */` |
| `@param name desc` | Document a constructor or method parameter | `@param instanceName the name for this instance` |
| `@returns desc` | Document the return value | `@returns the resulting interface` |
| `@wavedrom` | Embed an interactive timing diagram (see below) | |

### Timing diagrams with `@wavedrom`

TSSV includes a custom TypeDoc plugin (`ts/src/tools/typedoc-plugins/typedoc-wavedrom-plugin/`) that renders `@wavedrom` tags as live WaveDrom diagrams in the generated HTML. Write WaveDrom JSON inside a fenced ` ```json ``` ` block immediately after the tag:

```typescript
/**
 * WRITE
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "clk",     "wave": "p........."},
 *     {"name": "data_wr", "wave": "03........", "data": ["D"]},
 *     {"name": "we",      "wave": "01.0......"}
 *   ]
 * }
 * ```
 */
```

Working examples are in `ts/src/core/Registers.ts` (read and write cycles) and `ts/src/modules/FIR.ts`.

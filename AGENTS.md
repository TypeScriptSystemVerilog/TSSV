# AGENTS.md — TSSV

## Project Overview

TSSV (TypeScript SystemVerilog) is a meta-HDL framework that generates synthesizable SystemVerilog from TypeScript. Designers write TypeScript classes that extend `Module`, then call `writeSystemVerilog()` to emit `.sv` files — similar to Chisel for Scala, but targeting SystemVerilog designers. Out of scope: simulation, formal verification, synthesis, and place-and-route.

## Repo Structure

```
ts/src/core/          Framework base classes: Module, Sig, Expr, Interface, Registers
ts/src/modules/       Pre-built parameterized modules (FIR, SRAM, SFIFO, ROM, LZC, AXI4XBar, shift, IpXactComponent)
ts/src/interfaces/    Signal-bundle definitions — AMBA 2–5 (100+ specs), TileLink, Memory
ts/src/tools/         CLI utilities: xml_interface_build (XML→TSSV), cpu_convert
ts/test/              Runnable demo scripts; each produces sv-examples/<name>/ output
out/                  Compiled JS — git-ignored, rebuilt with npx tsc
sv-examples/          Generated SystemVerilog committed as reference output — never hand-edit
docs/                 Auto-generated TypeDoc HTML — never hand-edit
verilatorTB/          Verilator simulation harness with C++ driver and GTKWave script
claude-info/          Setup notes and worked examples for AI-assisted development
doc/process/          Repo process specs (issue-workflow.md)
.github/              Issue forms, PR template, commit template
```

## Key Documents

| Document | Authoritative For |
|---|---|
| `ts/src/core/Base.ts` | All builder APIs: `addSignal`, `addRegister`, `addSubmodule`, `addCombAlways`, etc. |
| `CLAUDE.md` | Commands, source layout, core architecture summary, simulation flow |
| `README.md` | Installation, quick-start, roadmap |
| `doc/process/issue-workflow.md` | Issue-driven workflow: Issue Types, templates, branch/commit/PR conventions, AC gating |

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
- **New module pattern**: extend `Module`, define a typed `Parameters` interface, declare IOs, build logic with `add*()` calls, add a test in `ts/test/` that calls `writeSystemVerilog()`
- **Code style**: `eslint-config-love` (strict TS); run `npx eslint .` before committing
- **Strict mode**: `noUncheckedIndexedAccess` is on — array accesses return `T | undefined`; handle accordingly

## Current Implementation State

| Area | Status | Notes |
|---|---|---|
| Core framework (`Base.ts`, `Registers.ts`) | Complete | ~1,345-line `Module` base; full builder API |
| AMBA 2–5 interfaces | Complete | 100+ files across AHB, APB, ATB, AXI, AXI4, ACE, CHI, CXS, LPI, GFB, LTI, P/Q-Channel |
| TileLink + Memory interfaces | Complete | |
| Built-in modules | Complete | FIR, SRAM, SFIFO, ROM, LZC, AXI4XBar, shift, IpXactComponent |
| CLI tools | Complete | `xml_interface_build`, `cpu_convert` |
| Verilator simulation harness | Complete | `verilatorTB/` — full TS→SV→binary→VCD flow |
| Verible integration | Complete | Default formatter for emitted SV (`ts/src/tools/formatters/verible.ts`); SV import header parser (`ts/src/core/SVModuleHeader.ts`) |
| TypeDoc documentation | Complete | Auto-generated; rebuild with `npm run docs` |
| Formal test runner | Not implemented | Tests are standalone scripts run via `node out/test/test_<Name>.js` |

## Common Tasks — Where to Start

- **Adding a new module**: read `ts/src/core/Base.ts` (builder API), then `ts/src/modules/FIR.ts` as a reference implementation; add a test in `ts/test/`
- **Adding a new interface**: read `ts/src/interfaces/AMBA/AXI4/r0p0_0/AXI4.ts` for the signal-bundle and modport pattern
- **Using the register helpers**: read `ts/src/core/Registers.ts`
- **Running a single test**: `npx tsc && node out/test/test_<Name>.js` — output lands in `sv-examples/`
- **Running all tests**: `bash runAllTests.sh`
- **Prerequisite — Verible**: `verible-verilog-format` and `verible-verilog-syntax` must be on `PATH` (see README.md). Generated SV is Verible-formatted by default and generation fails without it; `addSystemVerilogSubmodule()` parses imported SV headers with `verible-verilog-syntax`
- **Linting generated SV**: `verilator --lint-only sv-examples/<dir>/<file>.sv`
- **Simulating**: `cd verilatorTB && make` then `./rungtkwave.sh <name>.vcd`

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

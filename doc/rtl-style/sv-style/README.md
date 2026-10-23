# SystemVerilog coding style

This folder defines the style for the SystemVerilog that TSSV modules emit, illustrates each
rule and verifies it. The TypeScript side has its own guide in [../tssv-style/](../tssv-style/).
The examples are both illustrations and tests. Every Do example is checked to be lint clean
and, where behavior matters, correct in simulation. Every Don't example is checked to fail the
way the guide says it does.

- **The rules:** [sv-coding-style.md](sv-coding-style.md)
- **Run every check:** `npm run check:rtl-style` from the repo root. It runs this guide's checks
  and the TSSV guide's. It needs the Verilator version pinned in the top-level `README.md`, and
  it refuses any other version.
- **Check everything the test scripts generate:** `npm run check:generated-sv`, after
  `bash runAllTests.sh`. Any finding fails; see [Generated SV](#generated-sv).

## Layout

```
doc/rtl-style/sv-style/
  sv-coding-style.md    the rules, with their short Do/Don't examples inline
  rules.json            how each rule is verified; every rule ID in the guide needs an entry
  common_waivers.vlt    the lint waivers every Verilator lint run passes (the guide's section 8)
  sv/
    seq/                simulation examples for SEQ-2 and SEQ-5, with their testbenches
    width/              width_examples.sv, the examples for every WIDTH rule, and its testbench
  tools/
    lint-style-examples.mjs     lints the guide's inline SV examples as annotated
    check-rules.mjs             rule coverage, simulation examples, doc/file consistency
    check-width-examples.mjs    width examples: lint and exact arithmetic at 5 widths
    check-builder-examples.mjs  builder and module checks for both guides, and the SV they generate
    check-builder-widths.mjs    the expression builders' SV: lint with only the common waivers, exact arithmetic
    sv-scans.mjs                text checks on generated SV (SYN-1, LINT-3)
    check-generated-sv.mjs      -Wall lint and the scans on all of sv-examples/
doc/rtl-style/tools/
  check-rtl-style.mjs   runs every check of both guides
  verilator.mjs         shared helpers: Verilator pin, lint, simulate
ts/test/rtl_style/      the builder and module checks, the builder width cases and the testbench-marker test
                        (TypeScript has to live under ts/)
```

The builder checks write their SV to `sv-examples/rtl_style/`, which git ignores.

`check-builder-widths.mjs` checks the builders in `ts/src/core/Base.ts` that emit expressions:
`addAdder`, `addSubtractor`, `addMultiplier`, `addRound`, `addSaturate`, `addMux`,
`addConstSignal`, `addSubmodule`'s width extension and constant bindings, and `addRegister`'s
reset values. `ts/test/rtl_style/test_builder_widths.ts` builds each one at signed, unsigned and
mismatched widths, including widths over 32 bits, with test vectors from a reference model in
exact integer arithmetic. Each module must lint clean under `-Wall` with only the common waivers
file, `common_waivers.vlt`, and every vector must give the reference result in simulation. It
works in a temporary directory and writes nothing to `sv-examples/`.

## How a rule is verified

Each `rules.json` entry lists one or more checks:

| Check | What proves the rule | Run by |
|---|---|---|
| `lint` | The rule's inline SV examples lint as annotated: Do is clean, Don't raises the warnings it lists | `lint-style-examples.mjs` |
| `sim` | The rule's RTL files lint clean and each testbench prints `PASS` | `check-rules.mjs` |
| `width` | Every example output the rule cites exists in `width_examples.sv`, which lints clean and matches exact arithmetic | `check-rules.mjs`, `check-width-examples.mjs` |
| `builder` | A check in `ts/test/rtl_style/` confirms what the builder emits or rejects. The TSSV guide's rules use this too | `check-builder-examples.mjs` |
| `module` | `writeSystemVerilog()` rejects a module that breaks the rule, in SV a builder wrote or in raw SV (`ts/src/core/ModuleCheck.ts`). A check in `ts/test/rtl_style/` confirms it | `check-builder-examples.mjs` |
| `generated` | The SV the builders generate lints clean (LINT-1) and passes the text checks in `sv-scans.mjs`. So does the SV the test scripts generate | `check-builder-examples.mjs`; `check-generated-sv.mjs` for the test scripts' SV |
| `review` | Design judgment, or no automated check yet; the entry's `reason` says which | `check-rules.mjs` (checks a reason is given) |

Other fields:

- `movedTo` marks a rule that moved to the TSSV guide. Its entry has no `checks`, the guide keeps
  only a *moved* note naming the new ID, and the TSSV guide's checks confirm that ID exists.
- `docVerbatim` maps an example label in the guide (`"Do"`, `"Don't"`, `"Also fine"`) to the
  file that must contain that example verbatim. This keeps a simulated example and the guide
  from drifting apart.

## Adding or changing a rule

1. Write the rule in `sv-coding-style.md` with a stable ID, and annotate its inline SV
   examples (see "Maintaining this document" at the end of the guide).
2. Add its `rules.json` entry. Pick the strongest check that can prove the rule; use `review`
   only with a reason.
3. If lint can't prove the rule, add an example that can:
   - a simulation example under `sv/<section>/`, one module per file, with a testbench that
     prints `PASS` or `FAIL`;
   - a builder check in `ts/test/rtl_style/`, or a module check in `ts/src/core/ModuleCheck.ts`
     with one there;
   - or a scan in `tools/sv-scans.mjs`.
4. Run `npm run check:rtl-style`.

## Generated SV

`npm run check:generated-sv` (`tools/check-generated-sv.mjs`) runs the `generated` checks on
everything the test scripts write under `sv-examples/`: `verilator --lint-only -Wall`
(LINT-1) and the scans in `tools/sv-scans.mjs` (SYN-1, LINT-3). Run it after
`bash runAllTests.sh` and before `npm run check:rtl-style`, as CI does: the TSSV guide's TEST-1
example writes an SFIFO configuration of its own into `sv-examples/`. Nothing cleans
`sv-examples/`, so the check also sees what an older version of a test, or another script,
wrote there. If it reports a file the test scripts don't write, start again from
`rm -rf sv-examples && bash runAllTests.sh`.

The check fails on any finding, and on a Verilator error. It prints each finding with its
file, its rule and, for a lint warning, its line. Fix the code that generates the SV, or the
test script that wrote it. Where a waiver is the right answer, make it narrow and say why
(LINT-3). Until [#59](https://github.com/TypeScriptSystemVerilog/TSSV/issues/59) brought every
file in line, a per-file baseline held the findings that were left; #155 removed it.

**Linting through the top.** Each emission is linted through its top module, with the files it
depends on. A test script writes a Verilator filelist, `<top>.f`, for an emission that can't be
linted alone (`writeLintFilelist`, `ts/test/models/lintFilelist.ts`):

- a testbench emitted apart from its DUT, or one that needs simulation models from another file;
- a module whose ports are interfaces. Alone, its interfaces have no instance, and Verilator
  reports their signals as UNDRIVEN or UNUSEDSIGNAL when they aren't. The test script writes a
  wrapper that instantiates them (`lintWrapper`, `ts/test/models/lintWrapper.ts`), and the
  filelist names the wrapper as the top.

The check lints each filelist, and each `.sv` file that no filelist names on its own:
the grouping `npm run lint:sv` uses. A warning is a finding against the file it points at. One
in a file outside `sv-examples/`, such as a hand-written testbench in `verilatorTB/` that a
filelist names, isn't generated SV and isn't checked.

**Testbenches.** SYN-1's constructs are what testbenches are for, and a generated file often
holds a testbench and the design it instantiates. So a test script marks each testbench module
it generates, and each simulation model, with this comment inside the module:

```systemverilog
// tssv: testbench (simulation only; SYN-1 does not apply)
```

`markTestbench(module)` in `ts/test/models/testbench.ts` adds it to a `Module`. SV written as
text, such as the models in `ts/test/models/MemoryModels.ts`, includes `TESTBENCH_MARKER` from
the same file. SYN-1 skips a marked module and reports every unmarked one, a design in the same
file included. The other checks apply to testbenches as well.
`ts/test/rtl_style/test_testbench_marker.ts` tests both sides.

**What's left out.** `LEFT_OUT` in `tools/check-generated-sv.mjs` lists the paths the check
skips, each with its reason. There are two: `sv-examples/AXI4XBar/`, because Rocket Chip's
generator writes that SV, not TSSV's builders, and `sv-examples/rtl_style_ts/`, which
`npm run check:rtl-style` writes, not the test scripts. Add a path only when the SV guide
doesn't apply to what is written there.

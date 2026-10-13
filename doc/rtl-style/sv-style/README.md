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
  `bash runAllTests.sh`. It holds today's findings in a baseline; see
  [Generated SV: the baseline](#generated-sv-the-baseline).

## Layout

```
doc/rtl-style/sv-style/
  sv-coding-style.md    the rules, with their short Do/Don't examples inline
  rules.json            how each rule is verified; every rule ID in the guide needs an entry
  generated-baseline.json   the findings the test scripts' SV has today, per file
  sv/
    seq/                simulation examples for SEQ-2 and SEQ-5, with their testbenches
    width/              width_examples.sv, the examples for every WIDTH rule, and its testbench
  tools/
    lint-style-examples.mjs     lints the guide's inline SV examples as annotated
    check-rules.mjs             rule coverage, simulation examples, doc/file consistency
    check-width-examples.mjs    width examples: lint and exact arithmetic at 5 widths
    check-builder-examples.mjs  builder checks for both guides, and the SV they generate
    sv-scans.mjs                text checks on generated SV (SYN-1, LINT-3)
    check-generated-sv.mjs      -Wall lint and the scans on all of sv-examples/, against the baseline
doc/rtl-style/tools/
  check-rtl-style.mjs   runs every check of both guides
  verilator.mjs         shared helpers: Verilator pin, lint, simulate
ts/test/rtl_style/      the builder checks and the testbench-marker test (TypeScript has to live under ts/)
```

The builder checks write their SV to `sv-examples/rtl_style/`, which git ignores.

## How a rule is verified

Each `rules.json` entry lists one or more checks:

| Check | What proves the rule | Run by |
|---|---|---|
| `lint` | The rule's inline SV examples lint as annotated: Do is clean, Don't raises the warnings it lists | `lint-style-examples.mjs` |
| `sim` | The rule's RTL files lint clean and each testbench prints `PASS` | `check-rules.mjs` |
| `width` | Every example output the rule cites exists in `width_examples.sv`, which lints clean and matches exact arithmetic | `check-rules.mjs`, `check-width-examples.mjs` |
| `builder` | A check in `ts/test/rtl_style/` confirms what the builder emits or rejects. The TSSV guide's rules use this too | `check-builder-examples.mjs` |
| `generated` | The SV the builders generate lints clean (LINT-1) and passes the text checks in `sv-scans.mjs`. So does the SV the test scripts generate, but for the findings in the baseline | `check-builder-examples.mjs`; `check-generated-sv.mjs` for the test scripts' SV |
| `review` | Design judgment, or no automated check yet; the entry's `reason` says which | `check-rules.mjs` (checks a reason is given) |

Other fields:

- `movedTo` marks a rule that moved to the TSSV guide. Its entry has no `checks`, the guide keeps
  only a *moved* note naming the new ID, and the TSSV guide's checks confirm that ID exists.
- `docVerbatim` maps an example label in the guide (`"Do"`, `"Don't"`, `"Also fine"`) to the
  file that must contain that example verbatim. This keeps a simulated example and the guide
  from drifting apart.
- `known` lists violations that the framework itself currently emits. They're reported as
  `KNOWN` and don't fail the run. Each one names the issue that tracks its fix (currently
  [#59](https://github.com/TypeScriptSystemVerilog/TSSV/issues/59)); remove it from `rules.json` when the fix lands.
  `check-generated-sv.mjs` doesn't read `known`: the same findings are in its baseline, and
  the fix removes them from both.

## Adding or changing a rule

1. Write the rule in `sv-coding-style.md` with a stable ID, and annotate its inline SV
   examples (see "Maintaining this document" at the end of the guide).
2. Add its `rules.json` entry. Pick the strongest check that can prove the rule; use `review`
   only with a reason.
3. If lint can't prove the rule, add an example that can:
   - a simulation example under `sv/<section>/`, one module per file, with a testbench that
     prints `PASS` or `FAIL`;
   - a builder check in `ts/test/rtl_style/`;
   - or a scan in `tools/sv-scans.mjs`.
4. Run `npm run check:rtl-style`.

## Generated SV: the baseline

`npm run check:generated-sv` (`tools/check-generated-sv.mjs`) runs the `generated` checks on
everything the test scripts write under `sv-examples/`: `verilator --lint-only -Wall`
(LINT-1) and the scans in `tools/sv-scans.mjs` (SYN-1, LINT-3). Run it after
`bash runAllTests.sh` and before `npm run check:rtl-style`, as CI does: the TSSV guide's TEST-1
example writes an SFIFO configuration of its own into `sv-examples/`. Nothing cleans
`sv-examples/`, so the check also sees what an older version of a test, or another script,
wrote there. If it reports a file the test scripts don't write, start again from
`rm -rf sv-examples && bash runAllTests.sh`.

Most of that SV doesn't pass yet.
[#59](https://github.com/TypeScriptSystemVerilog/TSSV/issues/59) brings it in line one
subtask at a time, and `generated-baseline.json` holds what's left: for each file, each
finding and how many times it occurs. A finding is its rule and message, with no line number,
so an edit elsewhere in the file doesn't change it:

```json
"sv-examples/LZC/LZC_64/LZC_64.sv": {
  "LINT-1 UNUSEDSIGNAL: Bits of signal are not used: 'val2'[0]": 1,
  "LINT-1 UNUSEDSIGNAL: Signal is not driven, nor used: 'val1'": 1,
  "LINT-3 waiver \"lint_off WIDTH\" covers the whole module": 1,
  "LINT-3 waiver \"lint_off WIDTH\" has no justification comment": 1
}
```

The check fails on:

- a finding the baseline doesn't list for its file, or more of one than it lists. That's a
  regression: fix it rather than add it to the baseline.
- a baseline entry that occurs fewer times than it says, or not at all. The change that fixed
  it has to remove it.
- a Verilator error. The baseline can't hold one.

**Removing entries after a fix.** Regenerate the SV, then rewrite the baseline from what the
check finds:

```bash
rm -rf sv-examples && bash runAllTests.sh
npm run check:generated-sv -- --update-baseline
```

It prints each entry it added or removed. Commit the baseline with the fix. Its diff should
only remove entries or lower their counts; an entry it adds is a new finding. A #59 subtask is
done for a file when the baseline has no entries left for it.

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

**What's left out.** The baseline's `exempt` lists the paths the check skips, each with its
reason. `sv-examples/AXI4XBar/` is the only one: Rocket Chip's generator writes that SV, not
TSSV's builders. The check also skips `sv-examples/rtl_style_ts/`, which
`npm run check:rtl-style` writes, not the test scripts.

# RTL coding style

This folder defines the RTL coding style for TSSV modules, illustrates each rule and verifies it.
The examples are both illustrations and tests. Every Do example is checked to be lint clean
and, where behavior matters, correct in simulation. Every Don't example is checked to fail the
way the guide says it does.

- **The rules:** [rtl-coding-style.md](rtl-coding-style.md)
- **Run every check:** `npm run check:rtl-style` from the repo root. It needs the Verilator
  version pinned in the top-level `README.md`, and it refuses any other version.

## Layout

```
doc/rtl-style/
  rtl-coding-style.md   the rules, with their short Do/Don't examples inline
  rules.json            how each rule is verified; every rule ID in the guide needs an entry
  sv/
    seq/                simulation examples for SEQ-2 and SEQ-5, with their testbenches
    width/              width_examples.sv, the examples for every WIDTH rule, and its testbench
  tools/
    check-rtl-style.mjs         runs all the checks below
    lint-style-examples.mjs     lints the guide's inline SV examples as annotated
    check-rules.mjs             rule coverage, simulation examples, doc/file consistency
    check-width-examples.mjs    width examples: lint and exact arithmetic at 5 widths
    check-builder-examples.mjs  TSSV builder examples and the SV they generate
    sv-scans.mjs                text checks on generated SV (COMB-9, SYN-1, LINT-3)
    verilator.mjs               shared helpers: Verilator pin, lint, simulate
ts/test/rtl_style/      the builder examples (TypeScript has to live under ts/)
```

The builder examples write their SV to `sv-examples/rtl_style/`, which git ignores.

## How a rule is verified

Each `rules.json` entry lists one or more checks:

| Check | What proves the rule | Run by |
|---|---|---|
| `lint` | The rule's inline SV examples lint as annotated: Do is clean, Don't raises the warnings it lists | `lint-style-examples.mjs` |
| `sim` | The rule's RTL files lint clean and each testbench prints `PASS` | `check-rules.mjs` |
| `width` | Every example output the rule cites exists in `width_examples.sv`, which lints clean and matches exact arithmetic | `check-rules.mjs`, `check-width-examples.mjs` |
| `builder` | A check in `ts/test/rtl_style/` confirms what the builder emits or rejects | `check-builder-examples.mjs` |
| `generated` | The SV the builders generate lints clean (LINT-1) and passes the text checks in `sv-scans.mjs` | `check-builder-examples.mjs` |
| `review` | Design judgment, or no automated check yet; the entry's `reason` says which | `check-rules.mjs` (checks a reason is given) |

Other fields:

- `docVerbatim` maps an example label in the guide (`"Do"`, `"Don't"`, `"Also fine"`) to the
  file that must contain that example verbatim. This keeps a simulated example and the guide
  from drifting apart.
- `known` lists violations that the framework itself currently emits. They're reported as
  `KNOWN` and don't fail the run. Each one should be tracked by an issue, and removed from
  `rules.json` when the framework is fixed.

## Adding or changing a rule

1. Write the rule in `rtl-coding-style.md` with a stable ID, and annotate its inline SV
   examples (see "Maintaining this document" at the end of the guide).
2. Add its `rules.json` entry. Pick the strongest check that can prove the rule; use `review`
   only with a reason.
3. If lint can't prove the rule, add an example that can:
   - a simulation example under `sv/<section>/`, one module per file, with a testbench that
     prints `PASS` or `FAIL`;
   - a builder check in `ts/test/rtl_style/`;
   - or a scan in `tools/sv-scans.mjs`.
4. Run `npm run check:rtl-style`.

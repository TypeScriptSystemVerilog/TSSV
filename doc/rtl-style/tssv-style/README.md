# TSSV coding style

This folder defines the style for the TypeScript that generates a TSSV module's SystemVerilog,
illustrates each rule and verifies it. The emitted SV has its own guide in
[../sv-style/](../sv-style/). As in that guide, the examples are both illustrations and tests.
Every TypeScript example in the guide is compiled and run, and the SV it emits is linted. Every
Do example is checked to work and to emit clean SV. Every Don't example is checked to fail the
way the guide says it does.

- **The rules:** [tssv-coding-style.md](tssv-coding-style.md)
- **Run every check:** `npm run check:rtl-style` from the repo root. It runs this guide's checks
  and the SV guide's. It needs the Verilator version pinned in the top-level `README.md`, and it
  refuses any other version.

## Layout

```
doc/rtl-style/tssv-style/
  tssv-coding-style.md      the rules, with their Do/Don't examples inline
  rules.json                how each rule is verified; every rule ID in the guide needs an entry
  tools/
    check-ts-examples.mjs   compiles and runs the guide's ts examples, and lints what they emit
    check-rules.mjs         rule coverage, IDs apart from the SV guide, repo scans
```

`check-ts-examples.mjs` generates one TypeScript file per example under
`sv-examples/rtl_style_ts/`, which git ignores, compiles them all with one `tsc` run, runs each,
and writes the SV they emit under `sv-examples/rtl_style_ts/sv/`. The annotation format is
described at the end of the guide.

## How a rule is verified

Each `rules.json` entry lists one or more checks:

| Check | What proves the rule | Run by |
|---|---|---|
| `example` | The rule has at least one annotated ts example, and every example behaves as annotated: it type-checks or fails with the listed error, runs or throws the listed error, and emits SV that contains, lacks or lints as listed. A Do example's SV must lint clean and pass the SV guide's generated-SV checks | `check-rules.mjs` (an example exists), `check-ts-examples.mjs` (it behaves) |
| `builder` | A check in `ts/test/rtl_style/` confirms what the builder emits or rejects | `../sv-style/tools/check-builder-examples.mjs` |
| `repo` | A scan of the repo's TypeScript (`REPO_SCANS` in `check-rules.mjs`) finds no violation in `ts/src/modules/`, `ts/src/interfaces/` or `ts/test/` | `check-rules.mjs` |
| `review` | Design judgment, or no automated check yet; the entry's `reason` says which | `check-rules.mjs` (checks a reason is given) |

`known` lists repo-scan findings in existing code that don't fail the run yet. They're reported
as `KNOWN`. Each one names the issue that tracks its fix (currently
[#59](https://github.com/TypeScriptSystemVerilog/TSSV/issues/59)); remove it from `rules.json`
when the fix lands.

`check-rules.mjs` also checks the two guides against each other: no rule ID or ID prefix is used
by both, and every rule the SV guide marks `movedTo` exists here.

## Adding or changing a rule

1. Write the rule in `tssv-coding-style.md` with a stable ID. Use one of this guide's prefixes
   (`PARAM`, `MOD`, `BUILD`, `IDENT`, `TEST`), or a new prefix the SV guide doesn't use.
2. Add a ts example with its annotation (see "Maintaining this document" at the end of the
   guide), or say in `rules.json` why the rule can't have one.
3. Add its `rules.json` entry. Pick the strongest check that can prove the rule; use `review`
   only with a reason. If a scan of the repo could prove it, add one to `REPO_SCANS`.
4. Run `npm run check:rtl-style`.

# RTL style guides

TSSV has two style guides. Each one lives in its own folder, together with the examples and
checks that verify it. A TSSV module follows both.

| Folder | Covers | Rule ID prefixes |
|---|---|---|
| [`sv-style/`](sv-style/) | The SystemVerilog a TSSV module emits: [`sv-coding-style.md`](sv-style/sv-coding-style.md) | `COMB`, `SEQ`, `RST`, `LATCH`, `WIDTH`, `NAME`, `SYN`, `LINT` |
| [`tssv-style/`](tssv-style/) | The TypeScript that generates it: parameters and widths, module structure, builder choice, naming, tests: [`tssv-coding-style.md`](tssv-style/tssv-coding-style.md) | `PARAM`, `MOD`, `BUILD`, `IDENT`, `TEST` |

The two guides never share an ID prefix, so a rule ID names one rule in one guide. Some rules
moved from the SV guide to the TSSV guide. Each moved rule keeps a *moved* note in the SV guide
naming its new ID, so the old ID still resolves.

Run every check for both guides with `npm run check:rtl-style` from the repo root. It needs the
Verilator version pinned in the top-level `README.md`, and it refuses any other version.
[`tools/`](tools/) holds the runner and the Verilator helpers both guides share.

Bringing the framework and the existing modules in line with both guides is tracked in
[#59](https://github.com/TypeScriptSystemVerilog/TSSV/issues/59).

# RTL style guides

TSSV has two style guides. Each one lives in its own folder, together with the examples and
checks that verify it.

| Folder | Covers | Status |
|---|---|---|
| [`sv-style/`](sv-style/) | The SystemVerilog a TSSV module emits | [`sv-coding-style.md`](sv-style/sv-coding-style.md) |
| [`tssv-style/`](tssv-style/) | The TypeScript that generates it: parameters, width calculation, module structure, builder choice | Planned, [#58](https://github.com/TypeScriptSystemVerilog/TSSV/issues/58) |

Run every check with `npm run check:rtl-style` from the repo root.

Bringing the framework and the existing modules in line with both guides is tracked in
[#59](https://github.com/TypeScriptSystemVerilog/TSSV/issues/59).

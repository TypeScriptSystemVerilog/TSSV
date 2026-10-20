# Module Specification: `LZC`

> **Source:** `ts/src/modules/LZC/`
> **Status:** Approved

---

## Overview

**Leading zero counter**: counts the zeros above the top set bit of a word of 1 to 256 bits, and flags a word that is all zeros. It works by dichotomy, a binary tree over the word: each level checks whether the upper half of the word is all zeros, sets one bit of the count, and keeps the half that holds the leading one. The module is combinational, with no clock or reset.

---

## Parameters

Defined in `LZC_Parameters extends TSSVParameters`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `LZC_<dataWidth>` | Module name. If omitted, TSSV derives it from `dataWidth`. |
| `dataWidth` | `IntRange<1, 256>` | — | Bit width of `data_in`. The constructor rejects a value that isn't an integer from 1 to 256. |

---

## IO Ports

| Port | Direction | Width | Clock/Reset | Description |
|---|---|---|---|---|
| `data_in` | `input` | `dataWidth` | — | The word to count |
| `zero_num` | `output` | ⌈log<sub>2</sub>(`dataWidth` + 1)⌉ | — | The number of zeros above the top set bit of `data_in`, or `dataWidth` when `data_in` is all zeros |
| `is_zero` | `output` | 1 | — | High when `data_in` is all zeros |

`zero_num` holds every count from 0 to `dataWidth`: 1 bit for a `dataWidth` of 1, 2 bits for 2 or 3, 5 bits for 21, 7 bits for 64 and 9 bits for 256.

---

## Functional Description

### Normal operation

Both outputs follow `data_in` combinationally:

- `zero_num` = `dataWidth − 1 − i`, where `i` is the index of the highest set bit of `data_in`. It is `dataWidth` when no bit is set.
- `is_zero` = 1 exactly when `data_in` is all zeros.

| `dataWidth` | `data_in` | `zero_num` | `is_zero` |
|---|---|---|---|
| 21 | `21'h10_0000` (bit 20 set) | 0 | 0 |
| 21 | `21'h01_0000` (bit 16 set) | 4 | 0 |
| 21 | `21'h00_0001` | 20 | 0 |
| 21 | `21'h00_0000` | 21 | 1 |
| 64 | `64'h0000_0000_8000_0000` | 32 | 0 |
| 1 | `1'b0` | 1 | 1 |

### Reset behavior

None: the module holds no state.

### Edge cases

- `dataWidth` of 1: there is no tree. `zero_num` is 1 when `data_in` is 0, so it equals `is_zero`.
- `dataWidth` that isn't a power of 2: the tree works on `data_in` padded to the next power of 2 (below), and the padding is subtracted from its count.

---

## Internal Architecture

Let *P* be the smallest power of 2 that is at least `dataWidth`, and *L* = log<sub>2</sub> *P*, the number of tree levels.

1. **Padding.** When `dataWidth` isn't a power of 2, `val<P>` is `data_in` with `P − dataWidth` zeros above it. The padding zeros always lead, so the tree's count includes them. When `dataWidth` is a power of 2, the tree reads `data_in` itself.
2. **Tree** (`always_comb` block `lz_tree`). Level *i*, from *L* − 1 down to 0, sets `cnt[i]` when the upper half of the current word is all zeros. It then keeps the half that holds the leading one in `val<2^i>`: the lower half when `cnt[i]` is set, the upper half otherwise. The block has no branches, so it assigns every signal on every evaluation.
3. **Count.** `val1`, the last bit the tree keeps, is the leading one, or 0 when `data_in` is all zeros: each level keeps a half that is non-zero whenever the word is. For a non-zero word, `cnt` is its padded count, so `zero_num` is `cnt` minus the padding. For a word of all zeros, `cnt` is all ones, the same as for a single one in the lowest bit, so `val1` selects `dataWidth` instead.
4. **`is_zero`** compares `data_in` with zero directly, so it doesn't wait for the tree.

### Key signals

| Signal | Width | Description |
|---|---|---|
| `val<P>` | *P* | `data_in`, zero-padded on the left; only when `dataWidth` isn't a power of 2 |
| `cnt` | *L* | Leading zeros of the padded word, one bit per tree level |
| `val<2^i>` | 2<sup>*i*</sup> | The half kept at level *i*: `val<P/2>` down to `val2`, then `val1` |

---

## Dependencies

| Import | Source | Purpose |
|---|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` | Base class, parameter types, expressions |

---

## Test Plan

**Test script:** `ts/test/modules/test_LZC.ts`
**Output:** `sv-examples/LZC/LZC_<dataWidth>/`

The script generates every structural configuration:

| `dataWidth` | Structure |
|---|---|
| 1 | No tree |
| 2 | One level |
| 3, 21, 28 | Padded to 4, 32 and 32 |
| 64, 256 | Powers of 2, no padding; 256 is the largest width |

For each one it checks the ports' names and widths against the IO table above and that the SV has no `always_latch`. It also checks the derived name, and that `dataWidth` 0, 257 and 2.5 throw. It writes `sv-examples/LZC/tb/` for the testbench.

### Simulation

`make -C verilatorTB lzc_sim` runs the test script, lints every configuration with `verilator --lint-only -Wall`, and runs the self-checking `verilatorTB/tb_LZC.sv` once per configuration. The testbench checks `zero_num` and `is_zero` against a reference model that scans `data_in` from its top bit:

- A word of up to 20 bits is checked for every value.
- A wider word is checked for zero and, for every position of its leading one, with the bits below it all zeros, all ones and 16 random fills. Both outputs depend only on that position, so this reaches every output value. 100 000 random words follow.

`-DEXHAUSTIVE_MAX=<n>` raises the width checked for every value, and `-DRANDOM_FILLS=<n>` the number of random fills. CI runs `lzc_sim`.

---

## Implementation Notes

- **Style guides.** The module follows the [TSSV guide](../../rtl-style/tssv-style/tssv-coding-style.md) and the [SV guide](../../rtl-style/sv-style/sv-coding-style.md), with no deviations. Notes on how:
  - **BUILD-2:** the tree is one `addCombAlways` block, not a chain of `addAssign` calls. Each level writes one bit of `cnt` and reads it at once, and `addAssign` can only drive a whole signal, so assigns would need a signal per level and a concatenation to form the count.
  - **COMB-1:** the block has no `if`, `case` or loop. Each signal it drives is assigned once on every evaluation, so it needs no defaults and infers no latch.
  - **WIDTH-2:** `cnt` minus the padding is cast to `zero_num`'s width. The cast drops the subtraction's borrow, which a non-zero word never sets: the padding always leads, so its count is at least the padding.
- **Changed in [#153](https://github.com/TypeScriptSystemVerilog/TSSV/issues/153).** `zero_num` and `is_zero` are unchanged for every input. Before #153:
  - The tree was built with `addLatchAlways`, so it emitted `always_latch`, and `val<P/2>` to `val2` were latches: the all-zeros branch didn't assign them. The outputs were still combinational, since both branches assigned the count and `is_zero`.
  - The all-zeros case was an `if` branch that set the count to *P*, and the padding was subtracted from it in `tmp_zero_num`. `val1` was declared but never driven, `val2[0]` was never read, and for a padded width, neither was the top bit of `tmp_zero_num` (Verilator's `UNUSEDSIGNAL`).
  - Signal names: `tmp_cnt`, one bit wider, is now `cnt`; `tmp_zero_num` is gone; a power-of-2 width no longer copies `data_in` into `val<dataWidth>`.
  - This spec gave `zero_num`'s width as ⌈log<sub>2</sub>(`dataWidth`)⌉. It has always been ⌈log<sub>2</sub>(`dataWidth` + 1)⌉.
  - The constructor printed an error for a `dataWidth` of 0 or less, and carried on. It now throws for any value that isn't an integer from 1 to 256.

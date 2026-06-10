# Module Specification: `LZC`

> **File:** `ts/src/modules/LZC/LZC.ts`
> **Status:** Approved

---

## Overview

**Leading Zero Counter** — counts the number of leading zeros in an input word of arbitrary bit width (1–256). Uses a recursive dichotomy (binary halving) algorithm: at each level it checks whether the upper half is all-zero, sets one counter bit accordingly, and selects either the upper or lower half for the next level. The result is purely combinational (latch-based always block).

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Bit width of the input data word |

The counter output width is automatically derived as `ceil(log2(dataWidth))` bits (plus 1 if `dataWidth` is not a power of 2, to represent the "all-zero" count).

---

## IO Ports

| Port | Direction | Width | Description |
|---|---|---|---|
| `data_in` | input | `dataWidth` | Input word to count leading zeros of |
| `zero_num` | output | `ceil(log2(dataWidth))` | Number of leading zeros (0 when MSB is 1) |
| `is_zero` | output | 1 | Asserted when `data_in` is all zeros |

---

## Functional Description

1. If `dataWidth` is not a power of 2, `data_in` is zero-padded on the MSB side to the next power of 2 (`val_padded`).
2. A recursive halving loop generates intermediate signals `valN`, `val(N/2)`, … down to `val1`, each being either the upper or lower half of the previous level depending on whether the upper half was all-zero.
3. The counter bits `tmp_cnt[i]` are set high when the upper half at level `i` is zero.
4. If `data_in` is entirely zero, `is_zero` is asserted and `zero_num` outputs `dataWidth` (or the padded width).
5. For non-power-of-2 widths, the padding offset is subtracted from the raw count to give the true leading-zero count.

The always block is a `latch always` (sensitivity list covers all inputs), making the output purely combinational with no clock required.

---

## Internal Architecture

- Padding logic (if `dataWidth` is not a power of 2): `assign val_padded = {N'b0, data_in}`.
- Dichotomy tree: `log2(padded_width)` levels of combinational half-selection.
- `tmp_cnt` signal accumulates the counter bits from each level.
- `addLatchAlways` generates the combinational always block.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` |

---

## Test Plan

**Test script:** `ts/test/test_LZC.ts` (if present)

| Test case | `dataWidth` | `data_in` | Expected `zero_num` | Expected `is_zero` |
|---|---|---|---|---|
| Power-of-2 width, MSB set | 8 | `0x80` | 0 | 0 |
| Power-of-2 width, one bit set | 8 | `0x01` | 7 | 0 |
| Non-power-of-2 width | 12 | `0x001` | 11 | 0 |
| All zeros | 8 | `0x00` | 8 | 1 |

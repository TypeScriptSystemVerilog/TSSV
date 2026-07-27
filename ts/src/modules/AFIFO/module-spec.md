# Module Specification: `AFIFO`

> **File:** `ts/src/modules/AFIFO/AFIFO.ts`
> **Status:** Approved

---

## Overview

This module is an asynchronous **First-In First-Out** queue. It supports configurable data width (powers of 2 only), depth, and optional almost-full/almost-empty thresholds. Due to its asynchronous nature, the state of the FIFO presented to the read and write clock domains is conservative. For example, the 'full'/'almost_full' read side outputs assert before the FIFO is actually full. Clocks are positive edge sensitive.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Data word width |
| `log2depth` | `bigint` | — | log2(FIFO depth) |
| `InclAlmostDepth` | `'InclAlmostDepth' \| 'none'` | `'none'` | Enable `almost_full` / `almost_empty` outputs |
| `almost_empty_depth` | `bigint` | `1` | Occupancy below which `almost_empty` is asserted |
| `almost_full_depth` | `bigint` | `depth - 1` | Occupancy above which `almost_full` is asserted |

---

## IO Ports

### Always present

| Port | Direction | Width | Description |
|---|---|---|---|
| `wr_clk` | input | 1 | write domain clock |
| `wr_rst_n` | input | 1 | write domain active-low async reset |
| `wr_en` | input | write domain write enable (level sensitive) |
| `wr_data_in` | input | `dataWidth` | write domain write data |
| `wr_full` | output | 1 | write domain fullness indicator |
| `wr_curr_depth` | output | `log2depth+1` | write domain occupancy indicator |
| `rd_clk` | input | 1 | read domain clock |
| `rd_rst_n` | input | 1 | read domain active-low async reset |
| `rd_en` | input | read domain read enable (level sensitive) |
| `rd_data_out` | input | `dataWidth` | read domain read data (valid one `rd_clk` after `rd_en` is asserted) |
| `rd_empty` | output | 1 | read domain emptiness indicator |
| `rd_curr_depth` | output | `log2depth+1` | read domain occupancy indicator |

### Additional ports when `InclAlmostDepth = 'InclAlmostDepth'`

| Port | Direction | Description |
|---|---|---|
| `wr_almost_full` | output | Asserts when fill ≥ `almost_full_depth` |
| `rd_almost_empty` | output | Asserts when fill ≤ `almost_empty_depth` |

---

## Functional Description

1. `wr_addr` and `rd_addr` are free-running pointers that wrap at `depth`.
2. `fifo_cnt` tracks the number of valid entries; `full` asserts at `depth`, `empty` at 0.
3. On write: `data_in` is written to `SRAM[wr_addr]`; `wr_addr` increments; `fifo_cnt` increments.
4. On read: `SRAM[rd_addr]` is read to `data_out`; `rd_addr` increments; `fifo_cnt` decrements.
5. Simultaneous read and write is supported (net count unchanged).

### Reset behavior

`wr_addr`, `rd_addr`, and `fifo_cnt` all reset to 0. `empty` asserts, `full` deasserts.

### Edge cases

- Writing when `full`: write is silently ignored — caller must check `full`).
- Reading when `empty`: read data is undefined — caller must check `empty`.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` |
| `SRAM` | `tssv/lib/modules/SRAM` |

---

## Test Plan

| Test case | Config | Notes |
|---|---|---|
| Fill to full | `depth=3, 1r_1w` | Write 8 words, verify `full` |
| Drain to empty | `depth=3, 1r_1w` | Read 8 words, verify `empty` |
| Simultaneous R/W | `depth=2, 1r_1w` | Net depth unchanged |
| Almost-full threshold | `InclAlmostDepth, almost_full_depth=6` | `almost_full` at 6 entries |

# Module Specification: `SFIFO`

> **File:** `ts/src/modules/SFIFO/SFIFO.ts`
> **Status:** Approved

---

## Overview

Synchronous **First-In First-Out** queue backed by an `SRAM` submodule. Supports configurable data width and depth, separate or shared read/write enable modes, optional almost-full/almost-empty thresholds, and both `1r_1w` and `1rw` SRAM back-ends. Write and read pointers advance independently; a fill counter tracks occupancy.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Data word width |
| `depth` | `bigint` | — | Maximum number of entries |
| `InclAlmostDepth` | `'InclAlmostDepth' \| 'none'` | `'none'` | Enable `almost_full` / `almost_empty` outputs |
| `almost_empty_depth` | `bigint` | `1` | Fill count at which `almost_empty` asserts |
| `almost_full_depth` | `bigint` | `depth - 1` | Fill count at which `almost_full` asserts |
| `rw_mode` | `'1r_1w' \| '1rw'` | `'1r_1w'` | SRAM port mode. `1rw`: single shared port where `rw=1` means write; `1r_1w`: separate read/write enables |

---

## IO Ports

### Always present

| Port | Direction | Width | Description |
|---|---|---|---|
| `clk` | input | 1 | `posedge` clock |
| `rst_n` | input | 1 | Active-low async reset |
| `data_in` | input | `dataWidth` | Write data |
| `data_out` | output | `dataWidth` | Read data |
| `empty` | output | 1 | Asserted when FIFO contains 0 entries |
| `full` | output | 1 | Asserted when FIFO contains `depth` entries |
| `curr_depth` | output | `ceil(log2(depth))` | Current fill count |

### `rw_mode = '1r_1w'` (default)

| Port | Direction | Description |
|---|---|---|
| `wr_en` | input | Write enable |
| `rd_en` | input | Read enable |

### `rw_mode = '1rw'`

| Port | Direction | Description |
|---|---|---|
| `rw_en` | input | Port enable |
| `rw` | input | `1` = write, `0` = read |

### `InclAlmostDepth = 'InclAlmostDepth'`

| Port | Direction | Description |
|---|---|---|
| `almost_full` | output | Asserts when fill ≥ `almost_full_depth` |
| `almost_empty` | output | Asserts when fill ≤ `almost_empty_depth` |

---

## Functional Description

1. `wr_addr` and `rd_addr` are free-running pointers that wrap at `depth`.
2. `fifo_cnt` tracks the number of valid entries; `full` asserts at `depth`, `empty` at 0.
3. On write: `data_in` is written to `SRAM[wr_addr]`; `wr_addr` increments; `fifo_cnt` increments.
4. On read: `SRAM[rd_addr]` is read to `data_out`; `rd_addr` increments; `fifo_cnt` decrements.
5. Simultaneous read and write is supported (net count unchanged).
6. The underlying SRAM is instantiated using `SRAM` with `1r_1w` or `1rw` port mode matching `rw_mode`.

### Reset behavior

`wr_addr`, `rd_addr`, and `fifo_cnt` all reset to 0. `empty` asserts, `full` deasserts.

### Edge cases

- Writing when `full`: write is silently ignored (no overflow protection by default — caller must check `full`).
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
| Fill to full | `depth=8, 1r_1w` | Write 8 words, verify `full` |
| Drain to empty | `depth=8, 1r_1w` | Read 8 words, verify `empty` |
| Simultaneous R/W | `depth=4, 1r_1w` | Net depth unchanged |
| Almost-full threshold | `InclAlmostDepth, almost_full_depth=6` | `almost_full` at 6 entries |
| 1rw mode | `depth=4, 1rw` | Write then read using `rw` signal |

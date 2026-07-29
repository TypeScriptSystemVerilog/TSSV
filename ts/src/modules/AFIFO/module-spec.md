# Module Specification: `AFIFO`

> **File:** `ts/src/modules/AFIFO/AFIFO.ts`
> **Status:** Draft
> **Depends on new submodules:** `GrayPointer`, `CDCSynchronizer`, `DualClockRAM`

---

## Overview

`AFIFO` is a dual-clock **asynchronous First-In First-Out** queue. Data is enqueued in
the `wr_clk` domain and dequeued in the `rd_clk` domain, with no assumed phase or
frequency relationship between the two clocks.

Correct clock-domain crossing (CDC) is achieved with **Gray-coded pointers**: the write
and read pointers are converted to Gray code before
being synchronized into the opposite domain through a two-flop synchronizer. Gray coding
ensures that as the pointers increment, only one bit at a time changes. This makes
metastable sampling of a multi-bit pointer safe — any bit caught mid-transition resolves
to either the old or the new pointer value, never a corrupt intermediate.

Because each domain only ever sees a *synchronized* (and therefore delayed) copy of the
other domain's pointer, the status flags are **conservative**: `wr_full` may assert while
the FIFO is not yet physically full, and `rd_empty` may assert while data is in flight.
It never reports the FIFO as having *more* space or data than actually exists, so it is
always safe to act on. Clocks are positive-edge sensitive; resets are active-low async.

The implementation of this AFIFO is inspired by [bsg_async_fifo](https://github.com/bespoke-silicon-group/basejump_stl/blob/master/bsg_async/bsg_async_fifo.sv).

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Data word width (bits) |
| `log2depth` | `bigint` | — | log2(FIFO depth); FIFO holds `2**log2depth` words (power-of-2 only) |
| `InclAlmostDepth` | `'InclAlmostDepth' \| 'none'` | `'none'` | Enable `wr_almost_full` / `rd_almost_empty` outputs |
| `almost_empty_depth` | `bigint` | `1` | Occupancy at/below which `rd_almost_empty` asserts |
| `almost_full_depth` | `bigint` | `depth - 1` | Occupancy at/above which `wr_almost_full` asserts |
| `syncStages` | `bigint` | `2` | Number of flops in each CDC synchronizer (≥2) |

> **Depth is a power of two.** The Cummings full/empty scheme used by the FIFO relies on `log2depth+1`-bit
> pointers wrapping cleanly, so `depth = 2**log2depth` exactly. Non-power-of-2 depths are
> not supported.

---

## IO Ports

### Always present

| Port | Direction | Width | Description |
|---|---|---|---|
| `wr_clk` | input | 1 | write domain clock (posedge) |
| `wr_rst_n` | input | 1 | write domain active-low async reset |
| `wr_en` | input | 1 | write enable (level sensitive); write occurs when `wr_en && !wr_full` |
| `wr_data_in` | input | `dataWidth` | write data |
| `wr_full` | output | 1 | write domain full indicator (conservative) |
| `wr_curr_depth` | output | `log2depth+1` | write domain occupancy estimate (conservative — never under-reports fill) |
| `rd_clk` | input | 1 | read domain clock (posedge) |
| `rd_rst_n` | input | 1 | read domain active-low async reset |
| `rd_en` | input | 1 | read enable (level sensitive); read occurs when `rd_en && !rd_empty` |
| `rd_data_out` | output | `dataWidth` | read data (valid one `rd_clk` after an accepted read) |
| `rd_empty` | output | 1 | read domain empty indicator (conservative) |
| `rd_curr_depth` | output | `log2depth+1` | read domain occupancy estimate (conservative — never over-reports fill) |

### Additional ports when `InclAlmostDepth = 'InclAlmostDepth'`

| Port | Direction | Width | Description |
|---|---|---|---|
| `wr_almost_full` | output | 1 | asserts when write-domain occupancy ≥ `almost_full_depth` |
| `rd_almost_empty` | output | 1 | asserts when read-domain occupancy ≤ `almost_empty_depth` |

---

## Architecture

The AFIFO comprises three cooperating modules:

```
                         AFIFO (top)
   ┌──────────────────────────────────────────────────────────────┐
   │  wr domain                              rd domain            │
   │  ┌────────────────┐                      ┌────────────────┐  │
   │  │  GrayPointer   │  wr_gray ──sync──▶   │  GrayPointer   │  │
   │  │  (write ptr)   │  ◀──sync── rd_gray   │  (read ptr)    │  │
   │  └───────┬────────┘                      └───────┬────────┘  │
   │   wr_bin_ptr[log2depth-1:0]        rd_bin_ptr[log2depth-1:0] │
   │          │ (write addr)              (read addr) │           │
   │          ▼                                       ▼           │
   │  ┌────────────────────  DualClockRAM  ─────────────────────┐ │
   │  │  wr_clk: w_addr=wr_addr, w_data=wr_data_in, w_en=inc_wr │ │
   │  │  rd_clk: r_addr=rd_addr, r_data=rd_data_out             │ │
   │  └─────────────────────────────────────────────────────────┘ │
   └──────────────────────────────────────────────────────────────┘
```

> **Why not `SRAM`?** TSSV's `SRAM` (even in `1r_1w` mode) is single-clock — both ports
> share one `clk` in a single `always_ff`, plus same-address read/write collision logic
> that drives `'hx`. An async FIFO needs the write port on `wr_clk` and the read port on
> `rd_clk` with no cross-clock collision handling, so a dedicated dual-clock RAM is used
> instead. (Alternatives considered: adding a dual-clock mode to `SRAM`, or inlining the
> array in `AFIFO`; a standalone reusable module was chosen.)

### CDCSynchronizer

Source: `ts/src/modules/CDCSynchronizer/`

Generic N-bit, `syncStages`-deep flop synchronizer for moving a **Gray-coded** value into
a destination clock domain. Reusable beyond this FIFO.

| Param | Type | Description |
|---|---|---|
| `width` | `bigint` | bus width |
| `stages` | `bigint` (default `2`) | number of destination-domain flops (≥2) |

| Port | Direction | Width | Notes |
|---|---|---|---|
| `clk` | input | 1 | destination clock (posedge) |
| `rst_n` | input | 1 | destination async reset (lowasync) |
| `d` | input | `width` | source-domain value (assumed Gray-coded / single-bit-change) |
| `q` | output | `width` | value registered `stages` deep into the destination domain |

Implementation: a chain of `stages` registers on `clk`/`rst_n` via `addRegister`, `d → q0 → q1 → … → q`.

### GrayPointer

Source: `ts/src/modules/GrayPointer/`

Owns one pointer for one domain and exposes it (Gray-coded) to the other domain.

| Param | Type | Description |
|---|---|---|
| `log2depth` | `bigint` | pointer counts over `[0, 2**(log2depth+1))` — `log2depth+1` bits |
| `syncStages` | `bigint` (default `2`) | forwarded to the far-domain `CDCSynchronizer` |

| Port | Direction | Width | Notes |
|---|---|---|---|
| `clk` | input | 1 | this pointer's domain clock |
| `rst_n` | input | 1 | this pointer's async reset |
| `inc` | input | 1 | advance the binary counter this cycle |
| `far_clk` | input | 1 | opposite domain clock (for the synchronizer) |
| `far_rst_n` | input | 1 | opposite domain reset |
| `bin_ptr` | output | `log2depth+1` | binary pointer in this domain (low `log2depth` bits address SRAM) |
| `gray_ptr` | output | `log2depth+1` | registered Gray pointer in this domain |
| `gray_ptr_far` | output | `log2depth+1` | this Gray pointer synchronized into the far domain |

Internal logic:
- `bin_next = bin_ptr + inc` (binary counter, `log2depth+1` bits, wraps naturally).
- `gray_ptr` register loads `bin_next ^ (bin_next >> 1)` on each `clk` (bin→Gray, registered).
- `bin_ptr` register loads `bin_next`.
- Instantiates `CDCSynchronizer` on `far_clk`/`far_rst_n` with `d = gray_ptr`, `q = gray_ptr_far`.

### DualClockRAM

Source: `ts/src/modules/DualClockRAM/`

Simple dual-port RAM with **independent write and read clocks** — one write port, one read
port, no cross-clock collision handling (the FIFO's Gray pointers guarantee reader and
writer never touch the same location simultaneously). Reusable beyond this FIFO.

| Param | Type | Description |
|---|---|---|
| `dataWidth` | `IntRange<1,256>` | word width |
| `depth` | `bigint` | number of words (power-of-2 for FIFO use) |

| Port | Direction | Width | Notes |
|---|---|---|---|
| `w_clk` | input | 1 | write clock (posedge) |
| `w_en` | input | 1 | write enable |
| `w_addr` | input | `log2(depth)` | write address |
| `w_data` | input | `dataWidth` | write data |
| `r_clk` | input | 1 | read clock (posedge) |
| `r_en` | input | 1 | read enable |
| `r_addr` | input | `log2(depth)` | read address |
| `r_data` | output | `dataWidth` | registered read data (1 `r_clk` latency) |

Implementation: one `logic [dataWidth-1:0] mem [depth]` array, a write `always_ff @(posedge w_clk)`
and a read `always_ff @(posedge r_clk)`. No same-address `'hx` logic.

### `AFIFO` (top)

1. **Write pointer** — `GrayPointer` on `wr_clk`, `inc = wr_en && !wr_full`, far domain = read.
2. **Read pointer** — `GrayPointer` on `rd_clk`, `inc = rd_en && !rd_empty`, far domain = write.
3. **Storage** — `DualClockRAM`:
   - write port: `w_addr = wr_bin_ptr[log2depth-1:0]`, `w_data = wr_data_in`, `w_en = inc_wr`, `w_clk = wr_clk`.
   - read port: `r_addr = rd_bin_ptr[log2depth-1:0]`, `r_data = rd_data_out`, `r_en = inc_rd`, `r_clk = rd_clk`.
4. **Empty (read domain):** `rd_empty = (rd_gray_ptr == wr_gray_ptr_synced_to_rd)`.
5. **Full (write domain):** `wr_full = (wr_gray_ptr == {~rd_gray_synced_to_wr[MSB:MSB-1], rd_gray_synced_to_wr[MSB-2:0]})`
   — i.e. equal to the synchronized read Gray pointer with its top two bits inverted (Cummings test).
6. **Occupancy:** in each domain, convert the local binary pointer and the far pointer
   (Gray→binary via prefix-XOR `bin[i] = ^(gray >> i)`) and take the binary difference,
   masked to `log2depth+1` bits, to drive `wr_curr_depth` / `rd_curr_depth`.
7. **Almost flags** (when enabled): threshold comparisons on the respective occupancy value.

### Gray ↔ binary primitives

- **bin → Gray:** `assign gray = bin ^ (bin >> 1);` (single XOR level).
- **Gray → binary:** prefix XOR, emitted per bit: `assign bin[i] = ^(gray[W-1:i]);`
  (logarithmic-depth XOR tree; used only where a binary value is needed, i.e. occupancy).

---

## Reset behavior

Each domain resets independently through its own async-low reset:

- On `wr_rst_n`: `wr_bin_ptr`, `wr_gray_ptr` → 0.
- On `rd_rst_n`: `rd_bin_ptr`, `rd_gray_ptr` → 0.
- CDC synchronizer flops reset to 0 in their destination domain.
- After both resets: `rd_empty` asserts, `wr_full` deasserts, both occupancy counts = 0.

> **Reset caveat:** the two resets should each be released
> synchronously to their own clock, and both pointers must be reset before either domain
> begins operating. Releasing one domain's reset while the other is still held is safe (the
> running domain simply sees the far pointer as 0) but no traffic should be issued until
> both are released.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` |
| `GrayPointer` | `tssv/lib/modules/GrayPointer` |
| `CDCSynchronizer` | `tssv/lib/modules/CDCSynchronizer` |
| `DualClockRAM` | `tssv/lib/modules/DualClockRAM` |

---

## Test Plan

Tests instantiate each module and write emitted SV to `sv-examples/`; where a testbench is
useful, drive independent `wr_clk`/`rd_clk` at different frequencies.

| Test case | Config | Notes |
|---|---|---|
| Gray monotonicity | `GrayPointer, log2depth=3` | Each `inc` changes exactly one Gray bit |
| Sync latency | `CDCSynchronizer, width=4, stages=2` | Output lags input by `stages` dest-clock edges |
| Dual-clock RAM | `DualClockRAM, dataWidth=8, depth=8` | Write on `w_clk`, read back on independent `r_clk` |
| Fill to full | `AFIFO, log2depth=2` | Enqueue until `wr_full`; verify count = depth |
| Drain to empty | `AFIFO, log2depth=2` | Dequeue until `rd_empty`; verify count = 0 |
| Async R/W, fast writer | `AFIFO, log2depth=3`, `wr_clk` 3× `rd_clk` | `wr_full` throttles; no data loss/duplication |
| Async R/W, fast reader | `AFIFO, log2depth=3`, `rd_clk` 3× `wr_clk` | `rd_empty` throttles; no under-run |
| Almost thresholds | `InclAlmostDepth, almost_full_depth=6, almost_empty_depth=2` | flags assert at thresholds |

---

## Deviations from `bsg_async_fifo`

- **Pointer scheme:** uses the Cummings `log2depth+1`-bit dual-pointer full/empty test
  rather than BaseJump's `lg_size_p`-bit pre-increment (`w_ptr_p1`) scheme. This yields
  exact per-domain occupancy for the `*_curr_depth` outputs at the cost of requiring
  power-of-2 depth.
- **Reset:** active-low **async** (`lowasync`), matching TSSV/`SFIFO` convention, rather
  than BaseJump's default synchronous reset.
- **Storage:** uses a new `DualClockRAM` (independent `w_clk`/`r_clk`) in place of
  `bsg_mem_1r1w`. TSSV's existing `SRAM` is single-clock and cannot serve as async storage.
- **Data gating:** BaseJump's optional `and_data_with_valid_p` output gate is not ported
  (out of scope; can be added later if needed).

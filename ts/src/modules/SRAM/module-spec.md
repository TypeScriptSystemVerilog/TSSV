# Module Specification: `SRAM`

> **File:** `ts/src/modules/SRAM/SRAM.ts`
> **Status:** Approved

---

## Overview

Synchronous **Static RAM** with configurable port topology (`1rw`, `1r_1w`, `2rw`), optional write-enable masking (bit-level or byte-level), and configurable read behavior on simultaneous read/write. Intended as a behavioral model that maps to physical SRAM macros; `macroConfig` passes technology-specific parameters through to downstream tools.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Word width in bits |
| `depth` | `bigint` | — | Number of words |
| `ports` | `'1rw' \| '1r_1w' \| '2rw'` | — | Port configuration |
| `writeEnableMask` | `'none' \| 'bit' \| 'byte'` | `'none'` | Granularity of write mask. `'byte'` requires `dataWidth` divisible by 8 |
| `readBehavior` | `'undefOnWrite' \| 'readBeforeWrite'` | `'undefOnWrite'` | Output on simultaneous read+write to the same address |
| `macroConfig` | `string` | `''` | Free-form technology macro selector (high-speed, density, mux, etc.) |

---

## IO Ports

### `1rw` — single read/write port

| Port | Direction | Width | Description |
|---|---|---|---|
| `clk` | input | 1 | `posedge` clock |
| `a_re` | input | 1 | Read enable |
| `a_we` | input | 1 | Write enable |
| `a_addr` | input | `ceil(log2(depth))` | Address |
| `a_data_in` | input | `dataWidth` | Write data |
| `a_data_out` | output | `dataWidth` | Read data (1-cycle latency) |
| `a_wmask` | input | `dataWidth` or `dataWidth/8` | Write mask (bit or byte granularity; omitted when `writeEnableMask='none'`) |

### `1r_1w` — separate read and write ports

Same as `1rw` for port `a_` (write), plus port `b_re` / `b_addr` / `b_data_out` for the read port.

### `2rw` — two independent read/write ports

Port `a_` and port `b_` each have `re`, `we`, `addr`, `data_in`, `data_out` (and optionally `wmask`).

---

## Functional Description

- Write: on `posedge clk`, if `a_we` (and mask bits where applicable), write `a_data_in` to `mem[a_addr]`.
- Read: on `posedge clk`, if `a_re`, output `mem[a_addr]` to `a_data_out` the following cycle.
- **`undefOnWrite`** (default): if `a_re` and `a_we` are both asserted to the same address in the same cycle, `a_data_out` is undefined (`'hx`) until the next read. This maximizes SRAM macro compatibility.
- **`readBeforeWrite`**: on simultaneous read/write, the pre-write value is returned. Limits macro choices but simplifies surrounding logic.
- Write masks gate individual bits (`'bit'`) or bytes (`'byte'`) of the write data.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `IntRange` | `tssv/lib/core/TSSV` |

---

## Test Plan

| Test case | `ports` | `writeEnableMask` | Notes |
|---|---|---|---|
| Single-port write then read | `1rw` | `none` | Basic round-trip |
| Byte-masked write | `1rw` | `byte` | Only selected bytes updated |
| Simultaneous R/W undef | `1rw` | `none` | `a_data_out` goes `'hx` |
| Dual-port independent access | `1r_1w` | `none` | Read and write different addresses same cycle |
| Two read/write ports | `2rw` | `bit` | Both ports active simultaneously |

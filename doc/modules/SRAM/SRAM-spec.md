# Module Specification: `SRAM`

> **Source:** `ts/src/modules/SRAM/`
> **Status:** Approved

---

## Overview

Synchronous **Static RAM** with configurable port topology (`1rw`, `1r_1w`, `2rw`), optional write-enable masking (bit-level or byte-level), and configurable read behavior on simultaneous read/write. Intended as a behavioral model that maps to physical SRAM macros; `macroConfig` passes technology-specific parameters through to downstream tools.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Module name |
| `dataWidth` | `bigint` (≥ 1) | — | Word width in bits |
| `depth` | `bigint` (≥ 2) | — | Number of words |
| `ports` | `'1rw' \| '1r_1w' \| '2rw'` | — | Port configuration |
| `writeEnableMask` | `'none' \| 'bit' \| 'byte'` | `'none'` | Granularity of write mask. `'byte'` requires `dataWidth` divisible by 8 |
| `readBehavior` | `'undefOnWrite' \| 'readBeforeWrite'` | `'undefOnWrite'` | Read data when a word is read and written in the same cycle |
| `macroConfig` | `string` | `'default'` | Free-form technology macro selector (high-speed, density, mux, etc.). It doesn't change the behavioral model |

The constructor throws on a `dataWidth` below 1, a `depth` below 2 (one word would need a 0-bit address), and a byte mask on a `dataWidth` that isn't a multiple of 8.

---

## IO Ports

Each SRAM port reads, writes, or both, and its signals share a prefix:

| `ports` | Port `a_` | Port `b_` |
|---|---|---|
| `1rw` | reads and writes | — |
| `1r_1w` | reads | writes |
| `2rw` | reads and writes | reads and writes |

Every configuration has `clk` (input, 1 bit), the `posedge` clock of every port.

A port `<p>_` that reads has:

| Port | Direction | Width | Description |
|---|---|---|---|
| `<p>_re` | input | 1 | Read enable |
| `<p>_addr` | input | `ceil(log2(depth))` | Address |
| `<p>_data_out` | output | `dataWidth` | Read data (1-cycle latency) |

A port `<p>_` that writes has:

| Port | Direction | Width | Description |
|---|---|---|---|
| `<p>_we` | input | 1 | Write enable |
| `<p>_addr` | input | `ceil(log2(depth))` | Address. A port that reads and writes has one address for both |
| `<p>_data_in` | input | `dataWidth` | Write data |
| `<p>_wmask` | input | `dataWidth` (`'bit'`) or `dataWidth/8` (`'byte'`) | Write mask, one bit per lane. Absent when `writeEnableMask = 'none'` |

---

## Functional Description

- **Write:** on a rising `clk` edge with `<p>_we` high, `<p>_data_in` is written to word `<p>_addr`. A write mask splits the word into lanes, 1 bit wide for `'bit'` and 8 bits for `'byte'`, and only the lanes whose `<p>_wmask` bit is set are written. Lane *i* is bits `[i*w +: w]`.
- **Read:** on a rising `clk` edge with `<p>_re` high, word `<p>_addr` is loaded into `<p>_data_out`. While `<p>_re` is low, `<p>_data_out` holds.
- **Read/write conflict:** a read *conflicts* with a write when, in the same cycle, a port reads an address that a port writes. That is:
  - `1rw`: a read with `a_we` high.
  - `1r_1w`: a read with `b_we` high and `b_addr == a_addr`.
  - `2rw`: a read on port `<p>_` with its own `<p>_we` high, or with the other port's write enable high and the two addresses equal.

  Only the write enable and the addresses decide a conflict, not the write mask. A read conflicts even when the write's mask leaves every bit of the word unchanged.
- **`readBehavior`** sets what a conflicting read returns. A read that doesn't conflict always returns the stored word.
  - `'readBeforeWrite'`: the word as it was before that cycle's writes.
  - `'undefOnWrite'` (default): an undefined value. `<p>_data_out` stays undefined until the port's next read that doesn't conflict. In simulation it is X. In synthesis the read doesn't load, so `<p>_data_out` keeps its previous value. Promising no value leaves the most choice of SRAM macro.
- **`2rw` write collision:** when both ports write the same lane of the same word in one cycle, neither write happens. In simulation that lane becomes X. Lanes that only one port writes are written as usual.
- An address at or above `depth` (possible when `depth` isn't a power of 2) is outside the array. Don't use one.

---

## Internal Architecture

All of the module's logic is in `ts/src/modules/SRAM/SRAM.ts`. It has no submodules.

- **Storage:** one array, `mem`, of `depth` words. It has no reset.
- **`mem_write`:** one `always_ff` writes `mem` from every write port. With more than one lane, a `for` loop over the lanes writes each lane its mask selects. With `2rw`, a lane both ports write at one address is skipped, and set to X outside synthesis.
- **`<p>_read`:** one `always_ff` per reading port loads `mem[<p>_addr]` into `<p>_data_out` while `<p>_re` is high. With `undefOnWrite`, it loads only while `<p>_rw_conflict` is low, and sets `<p>_data_out` to X outside synthesis while it's high.

The X assignments are inside `` `ifndef SYNTHESIS ``, so synthesis sees only the loads and writes.

### Key signals

| Signal | Width | Present | Description |
|---|---|---|---|
| `mem` | `dataWidth` × `depth` | always | The storage |
| `addr_a_equal_b` | 1 | `2rw`; `1r_1w` with `undefOnWrite` | `a_addr == b_addr` |
| `<p>_rw_conflict` | 1 | `undefOnWrite`, per reading port | A write enable is high, on either port, for the address port `<p>_` reads ([Read/write conflict](#functional-description)) |

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `Expr` | `tssv/lib/core/TSSV` |

---

## Test Plan

**Test script:** `ts/test/modules/test_SRAM.ts` generates every combination of `ports`, `writeEnableMask` and `readBehavior`, checks each one's ports against the [IO tables](#io-ports), and generates the testbench configurations below. It also generates a 1026-bit `1rw` and `1r_1w` SRAM, and checks that the constructor rejects each bad parameter value in [Parameters](#parameters).
**Testbench:** `verilatorTB/tb_SRAM.sv`, built once per configuration.
**Output:** `sv-examples/SRAM/<module>/` and `sv-examples/SRAM/tb/`

Each configuration is named `<ports>_<mask>_<undef|rbw>`, for every `ports` and `readBehavior`, with `depth = 4` and one of four masks:

| `<mask>` | `writeEnableMask` | `dataWidth` | Lanes |
|---|---|---|---|
| `none` | `'none'` | 8 | 1 (no mask) |
| `bit` | `'bit'` | 8 | 8 |
| `byte` | `'byte'` | 32 | 4 |
| `byte1` | `'byte'` | 8 | 1 (a 1-bit `<p>_wmask`) |

Every cycle, the testbench drives random reads and writes on each port over the 4 words, so the ports often meet on one address. A reference model of the storage gives the expected read data, following [Functional Description](#functional-description). The model tracks which bits are defined, and a check compares only those bits: Verilator is two-state, so it can't show the X the RTL assigns in simulation.

| Test case | Configurations | Notes |
|---|---|---|
| Masked writes | `bit`, `byte`, `byte1` | Random masks, including all lanes and none. The run fails if no write selects some lanes but not all (`bit`, `byte`) |
| Read before write | `readBeforeWrite` | A read of a word written in the same cycle returns the old word. The run fails if none happens |
| Read/write conflict | `undefOnWrite` | Such a read is undefined until the port's next read. The run fails if none happens |
| Write collision | `2rw` | Both ports writing one lane of one word leave the lane undefined. The run fails if none happens |
| Hold | all | While `<p>_re` is low, `<p>_data_out` keeps its value |
| Random | all | 4000 cycles |

### Simulation

```bash
make -C verilatorTB sram_sim    # generates the SV, lints each variant with -Wall, then builds and runs each configuration
# waveform per configuration: verilatorTB/obj_dir/sram_<config>/tb_SRAM_<config>.fst
```

`make sfifo_sim` also exercises the `1rw` and `1r_1w` configurations without a mask, inside `SFIFO`.

---

## Implementation Notes

- **Style-guide deviations.** The module follows the [TSSV guide](../../rtl-style/tssv-style/tssv-coding-style.md) and the [SV guide](../../rtl-style/sv-style/sv-coding-style.md), except for these SHOULD rules:
  - **SEQ-2** (SV guide): `mem_write` and `<p>_read` compute their enables and addresses inside the `always_ff`, which is the form synthesis tools map to a RAM. An `always_comb` computing the next state would make the array read combinational.
  - **BUILD-6** (TSSV guide): the lanes of a write mask are an SV `for` loop inside `mem_write`, the byte-enable RAM template that synthesis tools recognize, rather than one `if` per lane from a TypeScript loop. A `'bit'` mask on a wide word would otherwise emit one `if` per bit.
  - **MOD-5** (TSSV guide): each port is a set of plain signals, not an `Interface`. They mirror an SRAM macro's pins, which the ASIC macro that replaces this model must match, and `SFIFO` and `cpu_convert` bind them by name.
- **One block writes `mem`.** IEEE 1800 doesn't allow two `always_ff` blocks to write one variable, and the SV guide's COMB-5 asks for one driver per signal. So `2rw` writes both ports from `mem_write`, unlike the Verilog-2001 true-dual-port templates that use one `always` per port. Whether an FPGA tool infers a true-dual-port block RAM from this form hasn't been checked.
- **Changed in #150.** Before #150, a masked SRAM with more than one lane returned wrong read data: each lane was zero-extended into the whole of `<p>_data_out`, and the last lane read won. Against that code, `tb_SRAM.sv` fails every configuration with more than one lane. With `undefOnWrite`, a conflicting read also returned the lanes the write didn't select, from the wrong word on port `b` of a `2rw` SRAM with a 1-lane mask. It now treats the whole word as undefined, as this spec says.

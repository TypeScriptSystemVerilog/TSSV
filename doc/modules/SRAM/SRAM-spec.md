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
| `readBehavior` | `'undefOnWrite' \| 'readBeforeWrite'` | `'undefOnWrite'` | Read data when the same word is read and written in the same cycle |
| `minMacroBits` | `bigint` (≥ 32) | `1024` | The fewest bits (`depth * dataWidth`) an SRAM needs to be implemented as a macro in an ASIC flow. A smaller one is meant to be flip-flops. It doesn't change the emitted SV yet (see [Synthesis mapping](#synthesis-mapping)) |
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
  - `1rw`: `a_re && a_we`.
  - `1r_1w`: `a_re && b_we && (b_addr == a_addr)`.
  - `2rw`: port a: `a_re && (a_we || (b_we && (b_addr == a_addr)))`, port b: `b_re && (b_we || (a_we && (a_addr == b_addr)))`

  Only the write enable and the addresses decide a conflict, not the write mask. A read conflicts even when the write's mask leaves every bit of the word unchanged.
  - **`readBehavior`** sets what a conflicting read returns. A read that doesn't conflict always returns the stored word.
    - `'readBeforeWrite'`: the word as it was before that cycle's writes. **WARNING:** because most macros do not behave this way, it is only implementable via flip-flops. As a result, the value of the `minMacroBits` parameter must be set accordingly (i.e. `depth * dataWidth < minMacroBits`) or elaboration will fail.
    - `'undefOnWrite'` (default): an undefined value. In simulation it is X and `<p>_data_out` stays undefined until the port's next read that doesn't conflict. In synthesis, the write occurs, but not the read and  `<p>_data_out` keeps its previous value.
- **`2rw` write collision:** when both ports write the same word in one cycle, the word becomes an X. In synthesis neither write occurs. NOTE: it is a collision when both ports write the same word, whatever the masks.
- An address at or above `depth` (possible when `depth` isn't a power of 2) is outside the array. Don't use one.


---

## Timing

There is one diagram per `ports` value, plus one for the `2rw` write collision. Each has `depth = 4`, `dataWidth = 8` and no write mask. The numbers along the top are cycles. The inputs in a cycle are sampled on the rising edge that ends it, so read data appears in the next cycle.

A diagram draws its inputs once, and the read data under each behavior on its own lane, named `<p>_data_out (<behavior>)`:

- `(undefOnWrite, simulation)`: a conflicting read assigns X, drawn as an `XX` brick, which stays until the port's next read that doesn't conflict.
- `(undefOnWrite, synthesis)`: a conflicting read doesn't load, so the read data keeps its previous value.
- `(readBeforeWrite)`: a conflicting read returns the word as it was before the write, in simulation and synthesis alike.

Hatched read data is unknown: before the first read. `make sram_sim` replays every diagram cycle for cycle: its simulation lanes against `<ports>_none_<undef|rbw>`, and its synthesis lanes against `<ports>_none_<undef|rbw>_synth`, which is built with `SYNTHESIS` defined (see [Test Plan](#test-plan)). The diagrams show conflicts and a collision on purpose, so the replays turn off the assertions those break.

### `1rw`

Cycles 1 and 2 write `A` to word 1 and `B` to word 2. Cycle 3 reads word 1: `A` appears in cycle 4, and holds in cycle 5 because `a_re` is low in cycle 4. Cycle 5 reads word 1 while writing `C` to it, which is a conflict. In simulation, `undefOnWrite` read data is X until the next read, in cycle 7. In synthesis it stays `A`. `readBeforeWrite` returns `A` again, the word before the write. Cycles 7 and 8 read `C` and `B`.

<!-- wavedrom SRAM-timing-1rw.svg
{
  "signal": [
    {"name": "clk",       "wave": "p........."},
    {"name": "a_we",      "wave": "01.0.10..."},
    {"name": "a_re",      "wave": "0..10101.0"},
    {"name": "a_addr",    "wave": "x===x=x==x", "data": ["1", "2", "1", "1", "1", "2"]},
    {"name": "a_data_in", "wave": "x34x.5x...", "data": ["A", "B", "C"]},
    {},
    {"name": "a_data_out (undefOnWrite, simulation)", "wave": "x...3.=.54", "data": ["A", "XX", "C", "B"]},
    {"name": "a_data_out (undefOnWrite, synthesis)",  "wave": "x...3...54", "data": ["A", "C", "B"]},
    {"name": "a_data_out (readBeforeWrite)",          "wave": "x...3.3.54", "data": ["A", "A", "C", "B"]}
  ],
  "head": {"text": "SRAM 1rw: write, read, hold, and a read of the word being written", "tick": 0}
}
-->
![SRAM timing: 1rw](SRAM-timing-1rw.svg)

### `1r_1w`

Port `b` writes and port `a` reads. Cycle 1 writes `A` to word 1. Cycle 2 writes `B` to word 2 while reading word 1. The words differ, so there is no conflict, and `A` appears in cycle 3. Cycle 3 writes `C` to word 1 while reading it, which is a conflict. In cycle 4, `undefOnWrite` read data is X in simulation and stays `A` in synthesis, and `readBeforeWrite` returns `A`. Cycle 4 reads `C`. Cycle 5 writes `D` to word 3 while reading `B` from word 2, and `B` holds once `a_re` is low.

<!-- wavedrom SRAM-timing-1r_1w.svg
{
  "signal": [
    {"name": "clk",       "wave": "p......."},
    {"name": "b_we",      "wave": "01..010."},
    {"name": "b_addr",    "wave": "x===x=x.", "data": ["1", "2", "1", "3"]},
    {"name": "b_data_in", "wave": "x345x6x.", "data": ["A", "B", "C", "D"]},
    {},
    {"name": "a_re",      "wave": "0.1...0."},
    {"name": "a_addr",    "wave": "x.====x.", "data": ["1", "1", "1", "2"]},
    {},
    {"name": "a_data_out (undefOnWrite, simulation)", "wave": "x..3=54.", "data": ["A", "XX", "C", "B"]},
    {"name": "a_data_out (undefOnWrite, synthesis)",  "wave": "x..3.54.", "data": ["A", "C", "B"]},
    {"name": "a_data_out (readBeforeWrite)",          "wave": "x..3354.", "data": ["A", "A", "C", "B"]}
  ],
  "head": {"text": "SRAM 1r_1w: reads of other words and of the word being written", "tick": 0}
}
-->
![SRAM timing: 1r_1w](SRAM-timing-1r_1w.svg)

### `2rw`

- Cycle 1: port `a` writes `A` to word 0, and port `b` writes `B` to word 1.
- Cycle 2: each port reads the word the other wrote. `B` appears on `a_data_out` and `A` on `b_data_out` in cycle 3.
- Cycle 3: port `a` writes `C` to word 1 while port `b` reads it. That is a conflict on port `b` only, since port `a` doesn't read. In cycle 4, `b_data_out` is X in simulation and stays `A` in synthesis under `undefOnWrite`. Under `readBeforeWrite` it is `B`, the word before the write.
- Cycle 4: port `a` reads word 0 while writing `F` to it, a conflict on port `a`. In cycle 5, `a_data_out` is X in simulation and stays `B` in synthesis under `undefOnWrite`, and is `A` under `readBeforeWrite`. Port `b` reads word 1, which nothing writes, so it gets `C`.
- Cycle 5: port `a` reads `F` from word 0.

<!-- wavedrom SRAM-timing-2rw.svg
{
  "signal": [
    {"name": "clk",       "wave": "p......."},
    {"name": "a_we",      "wave": "0101.0.."},
    {"name": "a_re",      "wave": "0.101.0."},
    {"name": "a_addr",    "wave": "x=====x.", "data": ["0", "1", "1", "0", "0"]},
    {"name": "a_data_in", "wave": "x3x58x..", "data": ["A", "C", "F"]},
    {},
    {"name": "b_we",      "wave": "010....."},
    {"name": "b_re",      "wave": "0.1..0.."},
    {"name": "b_addr",    "wave": "x====x..", "data": ["1", "0", "1", "1"]},
    {"name": "b_data_in", "wave": "x4x.....", "data": ["B"]},
    {},
    {"name": "a_data_out (undefOnWrite, simulation)", "wave": "x..4.=8.", "data": ["B", "XX", "F"]},
    {"name": "a_data_out (undefOnWrite, synthesis)",  "wave": "x..4..8.", "data": ["B", "F"]},
    {"name": "a_data_out (readBeforeWrite)",          "wave": "x..4.38.", "data": ["B", "A", "F"]},
    {},
    {"name": "b_data_out (undefOnWrite, simulation)", "wave": "x..3=5..", "data": ["A", "XX", "C"]},
    {"name": "b_data_out (undefOnWrite, synthesis)",  "wave": "x..3.5..", "data": ["A", "C"]},
    {"name": "b_data_out (readBeforeWrite)",          "wave": "x..345..", "data": ["A", "B", "C"]}
  ],
  "head": {"text": "SRAM 2rw: cross reads, and a conflict on each port", "tick": 0}
}
-->
![SRAM timing: 2rw](SRAM-timing-2rw.svg)

### `2rw` write collision

A collision behaves the same under either `readBehavior`, so this diagram's read data lanes name only the simulation and synthesis behaviors. Cycle 1 writes `A` to word 2, and cycle 2 reads it back. In cycle 3 both ports write word 2, `D` and `E`: a collision. Cycle 4 reads word 2. In simulation, the collision made it X. In synthesis neither write happened, so it is still `A`. Cycle 5 writes `F` to word 2 from port `a` alone, and cycle 6 reads it.

<!-- wavedrom SRAM-timing-2rw-collision.svg
{
  "signal": [
    {"name": "clk",       "wave": "p......."},
    {"name": "a_we",      "wave": "0101010."},
    {"name": "a_addr",    "wave": "x=x=x=x.", "data": ["2", "2", "2"]},
    {"name": "a_data_in", "wave": "x3x6x8x.", "data": ["A", "D", "F"]},
    {},
    {"name": "b_we",      "wave": "0..10..."},
    {"name": "b_re",      "wave": "0.101010"},
    {"name": "b_addr",    "wave": "x.===x=x", "data": ["2", "2", "2", "2"]},
    {"name": "b_data_in", "wave": "x..7x...", "data": ["E"]},
    {},
    {"name": "b_data_out (simulation)", "wave": "x..3.=.8", "data": ["A", "XX", "F"]},
    {"name": "b_data_out (synthesis)",  "wave": "x..3.3.8", "data": ["A", "A", "F"]}
  ],
  "head": {"text": "SRAM 2rw: a write collision, in simulation and synthesis", "tick": 0}
}
-->
![SRAM timing: 2rw write collision](SRAM-timing-2rw-collision.svg)

---

## Internal Architecture

All of the module's logic is in `ts/src/modules/SRAM/SRAM.ts`. It has no submodules.

- **Storage:** one array, `mem`, of `depth` words. It has no reset, and no attribute (see [Synthesis mapping](#synthesis-mapping)).
- **Writes:** with `1rw` and `1r_1w`, one `always_ff`, `mem_write`, writes `mem` from the write port. With `2rw`, each port has its own plain `always @(posedge clk)` block, `a_write` and `b_write`, because Vivado infers a true-dual-port RAM only when each process writes one port (see Implementation Notes). With more than one lane, a `for` loop over the lanes writes each lane its mask selects. With `2rw`, `w_collision` blocks every lane write of both ports, and `a_write` sets the word to X outside synthesis.
- **`<p>_read`:** one `always_ff` per reading port loads `mem[<p>_addr]` into `<p>_data_out` while `<p>_re` is high. With `undefOnWrite`, it loads only while `<p>_rw_conflict` is low, and sets `<p>_data_out` to X outside synthesis while it's high.
- Any X assignments, and the assertions, are inside `` `ifndef SYNTHESIS ``, so synthesis sees only the loads and writes.
- **Assertions:** on by default. Each is a concurrent `assert property` on `posedge clk`, with no action block, because the SV guide's SYN-1 bans system tasks in RTL. A simulator reports a failure with the assertion's label.
  - read/write conflict: If a read/write conflict occurs, the assertion will fail. Protected by `` `ifndef NOASSERT_SRAM_RW_CONFLICT ``. Only with `undefOnWrite`, since a `readBeforeWrite` read may conflict. One per reading port, labelled `<p>_no_rw_conflict`: `!(<p>_re && <p>_rw_conflict)`.
  - write collision: If a write collision occurs, the assertion will fail. Protected by `` `ifndef NOASSERT_SRAM_W_COLLISION ``. `2rw` only, labelled `no_w_collision`: `!w_collision`.

### Synthesis mapping

`minMacroBits` decides how an ASIC flow implements `mem`. It doesn't constrain Vivado, so `mem` has no `ram_style` attribute, and Vivado builds it however it chooses.

| `depth * dataWidth` | ASIC flow | Vivado |
|---|---|---|
| below `minMacroBits` | Flip-flops, not a macro | Its own choice |
| `minMacroBits` or more | Replaced by a macro | Its own choice, block RAM or LUTRAM |

The emitted SV doesn't yet mark which SRAMs an ASIC flow should leave as flip-flops. A custom attribute on `mem` will do that, added with the ASIC macro generator. A `readBeforeWrite` SRAM is always below `minMacroBits`, so an ASIC flow always builds it from flip-flops.

### Key signals

| Signal | Width | Present | Description |
|---|---|---|---|
| `mem` | `dataWidth` × `depth` | always | The storage |
| `addr_a_equal_b` | 1 | `2rw`; `1r_1w` with `undefOnWrite` | `a_addr == b_addr` |
| `<p>_rw_conflict` | 1 | `undefOnWrite`, per reading port | A write enable is high, on either port, for the address port `<p>_` reads ([Read/write conflict](#functional-description)) |
| `w_collision` | 1 | `2rw` | `a_we & b_we & addr_a_equal_b`: both ports write one word, whatever their masks |

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

The six unmasked configurations are also built with `SYNTHESIS` defined, as `<ports>_none_<undef|rbw>_synth`. Without its X assignments, the RTL then behaves as synthesis builds it.

Every cycle, the testbench drives random reads and writes on each port over the 4 words, so the ports often meet on one address. A reference model of the storage gives the expected read data, following [Functional Description](#functional-description). The model tracks which bits are defined, and a check compares only those bits: Verilator is two-state, so it can't show the X the RTL assigns in simulation. In a `_synth` configuration, the model checks the synthesis behavior instead: a conflicting `undefOnWrite` read keeps the previous read data, and a collision leaves the word as it was.

| Test case | Configurations | Notes |
|---|---|---|
| Masked writes | `bit`, `byte`, `byte1` | Random masks, including all lanes and none. The run fails if no write selects some lanes but not all (`bit`, `byte`) |
| Read before write | `readBeforeWrite` | A read of a word written in the same cycle returns the old word. The run fails if none happens |
| Read/write conflict | `undefOnWrite` | Such a read is undefined until the port's next read; with `SYNTHESIS` defined, the read data holds. The run fails if none happens |
| Write collision | `2rw` | Both ports writing the same word make it undefined, whatever their masks; with `SYNTHESIS` defined, it keeps its value. The run fails if none happens |
| Hold | all | While `<p>_re` is low, `<p>_data_out` keeps its value |
| Timing diagrams | `<ports>_none_<undef\|rbw>`, and the same with `_synth` | Each diagram in [Timing](#timing) replays cycle for cycle against the read data lanes for the configuration's `readBehavior`, in simulation or synthesis, before the random phase. `XX` bricks aren't checked, since Verilator is two-state. `test_SRAM.ts` builds the vectors from the diagrams' WaveDrom JSON, so a diagram change is tested without editing the testbench, and it fails if a `ports` value, `readBehavior`, or simulation or synthesis has no diagram |
| Random | all | 4000 cycles |
| Assertions | all | The random and diagram runs keep the assertions on, except those their traffic breaks on purpose: `NOASSERT_SRAM_RW_CONFLICT` for `undefOnWrite`, `NOASSERT_SRAM_W_COLLISION` for `2rw`. Then five more runs each break one assertion, with every write mask bit low, and pass only if the run stops on that assertion: `a_no_rw_conflict` for `1rw`, for `1r_1w`, and for port `b` writing in `2rw`; `b_no_rw_conflict` for port `b`'s own write in `2rw`; and `no_w_collision` in a `readBeforeWrite` `2rw` (`assert_checks.txt`) |
| `minMacroBits` | — | `test_SRAM.ts` checks that `mem` has no `ram_style` attribute at 32 bits or 1024 bits with the default `minMacroBits` (1024), and that the module name includes `minMacroBits`. It also checks the constructor rejects `minMacroBits` 31 and a `readBeforeWrite` SRAM of 1024 bits, and accepts one of 32 bits with `minMacroBits` 33 |

### Simulation

```bash
make -C verilatorTB sram_sim    # generates the SV, lints each variant with -Wall, then builds and runs each configuration
# waveform per configuration: verilatorTB/obj_dir/sram_<config>/tb_SRAM_<config>.fst
```

`make sfifo_sim` also exercises the `1rw` and `1r_1w` configurations without a mask, inside `SFIFO`, with every assertion on.

---

## Implementation Notes

- **Style-guide deviations.** The module follows the [TSSV guide](../../rtl-style/tssv-style/tssv-coding-style.md) and the [SV guide](../../rtl-style/sv-style/sv-coding-style.md), except for these rules. `2rw`'s write blocks break two MUST rules, each with a comment in the code that explains why:
  - **COMB-5** (SV guide, MUST), `2rw` only: `a_write` and `b_write` both write `mem`. A comment in the emitted SV waives it there (see the next note).
  - **BUILD-4** (TSSV guide, MUST), `2rw` only: `a_write` and `b_write` are emitted with `addBody`, so their headers aren't written by a builder. `addSequentialAlways` only writes `always_ff`, which two processes can't use to write one variable.

  And these SHOULD rules:
  - **SEQ-2** (SV guide): the write blocks and `<p>_read` compute their enables and addresses inside the block, which is the form synthesis tools map to a RAM. An `always_comb` computing the next state would make the array read combinational.
  - **BUILD-6** (TSSV guide): the lanes of a write mask are an SV `for` loop inside each write block, the byte-enable RAM template that synthesis tools recognize, rather than one `if` per lane from a TypeScript loop. A `'bit'` mask on a wide word would otherwise emit one `if` per bit.
  - **BUILD-1** (TSSV guide), `2rw` only: the write blocks use `addBody` rather than a builder, as above.
  - **MOD-5** (TSSV guide): each port is a set of plain signals, not an `Interface`. They mirror an SRAM macro's pins, which the ASIC macro that replaces this model must match, and `SFIFO` and `cpu_convert` bind them by name.
- **One write port per process (`2rw`).** At first, one `always_ff` wrote both ports, because IEEE 1800 doesn't allow two `always_ff` blocks to write one variable. Vivado then built every `2rw` configuration from flip-flops: "RAM has multiple writes via different ports in same process. If RAM inferencing intended, write to one port per process." (#150's Vivado run 1). So `2rw` now follows UG901's true-dual-port templates (`rams_tdp_rf_rf.v`, `bytewrite_tdp_ram_*.v`): one plain `always` per write port, both writing `mem`. Plain `always` is legal SystemVerilog for that, where two `always_ff` would be rejected by simulators that enforce IEEE 1800 9.2.2.4. The reads stay in their own `always_ff` blocks. `1rw` and `1r_1w` already infer RAM in that form.
- **Changed in #150.** Before #150, a masked SRAM with more than one lane returned wrong read data: each lane was zero-extended into the whole of `<p>_data_out`, and the last lane read won. Against that code, `tb_SRAM.sv` fails every configuration with more than one lane. With `undefOnWrite`, a conflicting read also returned the lanes the write didn't select, from the wrong word on port `b` of a `2rw` SRAM with a 1-lane mask. It now treats the whole word as undefined, as this spec says. A `2rw` write collision was per lane; it is now the whole word, whatever the masks. The `minMacroBits` parameter and the assertions are new, and `minMacroBits` adds `_<minMacroBits>` to every derived module name.

# Module Specification: `SFIFO`

> **Source:** `ts/src/modules/SFIFO/`
> **Status:** Draft

---

## Overview

Synchronous **First-In First-Out** queue backed by an `SRAM` submodule. Supports configurable data width and depth, and optional almost-full/almost-empty thresholds. It can be configured to support simultaneous push and pop with the added expense of a dual port SRAM.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Data word width |
| `depth` | `bigint` | — | Maximum number of entries |
| `simultPushPop` | `boolean` | `true` | `true`: push and pop may occur in the same cycle; storage is a dual-port (`1r_1w`) `SRAM` and the enables are `wr_en`/`rd_en`. `false`: push and pop are mutually exclusive; storage is a single-port (`1rw`) `SRAM` and the enables are `rw_en`/`rw` |
| `inclAlmostFull` | `boolean` | `false` | Enables `almost_full_depth` input and `almost_full` output |
| `inclAlmostEmpty` | `boolean` | `false` | Enables `almost_empty_depth` input and `almost_empty` output |


---

## IO Ports

### Always present

| Port | Direction | Width | Description |
|---|---|---|---|
| `clk` | input | 1 | `posedge` clock |
| `rst_n` | input | 1 | Active-low async reset |
| `data_in` | input | `dataWidth` | Push data |
| `data_out` | output | `dataWidth` | Head of the queue (valid whenever `empty` is deasserted) |
| `empty` | output | 1 | Asserted when FIFO contains 0 entries |
| `full` | output | 1 | Asserted when FIFO contains `depth` entries |
| `curr_depth` | output | `ceil(log2(depth+1))` | Current fill count (0 to `depth`) |

### `simultPushPop = true`
| Port | Direction | Width | Description |
|---|---|---|----|
| `wr_en` | input | 1 | Push enable — writes `data_in` on the next `clk` edge |
| `rd_en` | input | 1 | Pop enable — discards the head entry on the next `clk` edge |

### `simultPushPop = false`
| Port | Direction | Width | Description |
|---|---|---|----|
| `rw_en` | input | 1 | Operation enable — a push or pop occurs on the next `clk` edge, selected by `rw` |
| `rw` | input | 1 | Operation select, qualified by `rw_en`: `1` = push, `0` = pop |


### `inclAlmostFull = true`
| Port | Direction | Width | Description |
|---|---|---|----|
| `almost_full_depth` | input | `ceil(log2(depth+1))` | Fill count at which `almost_full` asserts |
| `almost_full` | output | 1 | Asserts when fill ≥ `almost_full_depth` |

### `inclAlmostEmpty = true`
| Port | Direction | Width | Description |
|---|---|---|----|
| `almost_empty_depth` | input | `ceil(log2(depth+1))` | Fill count at or below which `almost_empty` asserts |
| `almost_empty` | output | 1 | Asserts when fill ≤ `almost_empty_depth` |

---

## Functional Description

The FIFO is **show-ahead** (first-word fall-through): `data_out` always presents the entry at the head of the queue whenever `empty` is deasserted. No read is needed to observe the head — a *pop* discards the current head and advances to the next entry.

Push and pop requests come from different ports depending on `simultPushPop`:

| `simultPushPop` | Push request | Pop request | SRAM |
|---|---|---|---|
| `true` | `wr_en` | `rd_en` | `1r_1w` (dual-port) |
| `false` | `rw_en && rw` | `rw_en && !rw` | `1rw` (single-port) |

1. `wr_addr` and `rd_addr` are free-running pointers that wrap at `depth`. `rd_addr` always points at the head entry.
2. `fifo_cnt` tracks the number of valid entries; `full` asserts at `depth`, `empty` at 0; `curr_depth` reflects `fifo_cnt`. All status outputs change only on the rising edge of `clk`.
3. **Push:** on a rising edge with a push request and `!full`, `data_in` is written to `SRAM[wr_addr]`; `wr_addr` increments; `fifo_cnt` increments.
4. **Pop:** on a rising edge with a pop request and `!empty`, the head entry is discarded; `rd_addr` increments; `fifo_cnt` decrements. In the following cycle `data_out` presents the next entry, or becomes undefined if the FIFO is now empty.
5. **Write-to-head latency:** a word pushed into an empty FIFO appears on `data_out` in the cycle immediately after the push edge — the same cycle that `empty` deasserts. `data_out` and `empty` always update together, so `!empty` is a sufficient qualifier for `data_out`.
6. **Simultaneous push and pop** (`simultPushPop = true` only): the net count is unchanged. If the popped entry was the only entry, the pushed word becomes the new head in the following cycle.
   - When `empty`: the pop is ignored and the push proceeds (`data_in` becomes the head).
   - When `full`: the push is ignored and the pop proceeds.
7. With `simultPushPop = false`, at most one operation occurs per cycle, so push and pop can never collide. Each SRAM access (a push write or a pop prefetch read) uses the single port.
8. `data_out` is undefined while `empty` is asserted. Consumers must qualify `data_out` with `!empty`.

> **Implementation note:** `SRAM` has a registered (1-cycle) read, so show-ahead requires a prefetch. On a pop, the SRAM must be read at the *next* head address so the new head is ready in the following cycle; a push into an empty FIFO, or into a FIFO whose only entry is being popped, must bypass the SRAM directly to `data_out`. `data_out` must hold its value across cycles with no pop — including single-port push cycles, where the SRAM port is busy writing.

### Almost-full / almost-empty

`almost_full` and `almost_empty` are optional early-warning flags with run-time programmable thresholds. They let a producer or consumer react before the FIFO actually fills or drains. They are enabled independently by `inclAlmostFull` and `inclAlmostEmpty`, and behave the same for either `simultPushPop` setting.

| Flag | Asserted when |
|---|---|
| `almost_full` | `fifo_cnt >= almost_full_depth` |
| `almost_empty` | `fifo_cnt <= almost_empty_depth` |

1. Both flags are a combinational compare of the registered `fifo_cnt` against the threshold input, so they change on the same `clk` edge as `curr_depth`, `empty` and `full`. No extra latency is added.
2. The threshold inputs are intended to be static configuration (tied off, or driven from a register). If a threshold changes, the flag follows combinationally in the same cycle.
3. **Using `almost_full` for back-pressure:** if a producer takes *N* cycles to stop pushing after it sees a flag, set `almost_full_depth = depth - N`. Then the pushes still in flight fit in the remaining space and none are dropped.
4. **Using `almost_empty` for bursts:** a consumer that needs a burst of *M* entries can wait for `!almost_empty` with `almost_empty_depth = M - 1`. This guarantees at least *M* entries are available.
5. **Threshold boundary values:**

   | Setting | Result |
   |---|---|
   | `almost_full_depth = depth` | `almost_full` is identical to `full` |
   | `almost_full_depth = 0` | `almost_full` is always asserted |
   | `almost_full_depth > depth` | `almost_full` never asserts |
   | `almost_empty_depth = 0` | `almost_empty` is identical to `empty` |
   | `almost_empty_depth >= depth` | `almost_empty` is always asserted |

### Reset behavior

`wr_addr`, `rd_addr`, and `fifo_cnt` all reset to 0. `empty` asserts, `full` deasserts. `data_out` is undefined until the first push. With a count of 0, `almost_empty` asserts and `almost_full` deasserts, unless `almost_full_depth = 0`.

### Edge cases

- Pushing when `full`: the push is silently ignored (no overflow protection — caller must check `full`).
- Popping when `empty`: the pop is ignored (no pointer or count change). `data_out` remains undefined.

---

## Timing

### Dual-port: empty → full → empty

`depth = 4`, `simultPushPop = true`. Four pushes fill the FIFO, a fifth push (`E`) is dropped because `full` is asserted, then four pops drain it. Note that `A` is visible on `data_out` as soon as `empty` deasserts, without any `rd_en`, and each pop advances `data_out` to the next entry on the following cycle.

```wavedrom
{
  "signal": [
    {"name": "clk",        "wave": "p............"},
    {"name": "rst_n",      "wave": "01..........."},
    {},
    {"name": "wr_en",      "wave": "0.1....0....."},
    {"name": "data_in",    "wave": "x.34567x.....", "data": ["A", "B", "C", "D", "E"], "node": "..a.........."},
    {"name": "rd_en",      "wave": "0......1...0.", "node": ".......c....."},
    {},
    {"name": "data_out",   "wave": "x..3....456x.", "data": ["A", "B", "C", "D"], "node": "...b....d...."},
    {"name": "empty",      "wave": "1..0.......1."},
    {"name": "full",       "wave": "0.....1.0...."},
    {"name": "curr_depth", "wave": "=..====.====.", "data": ["0", "1", "2", "3", "4", "3", "2", "1", "0"]}
  ],
  "edge": ["a~>b fall-through", "c~>d pop"],
  "head": {"text": "SFIFO show-ahead: empty → full → empty"}
}
```

### Single-port: interleaved push and pop

`depth = 4`, `simultPushPop = false`. `rw_en` qualifies every operation and `rw` selects push (`1`) or pop (`0`). `data_out` holds the head across push cycles and advances on the cycle after each pop.

```wavedrom
{
  "signal": [
    {"name": "clk",        "wave": "p........."},
    {"name": "rst_n",      "wave": "01........"},
    {},
    {"name": "rw_en",      "wave": "0.1.....0."},
    {"name": "rw",         "wave": "x.1.010.x."},
    {"name": "data_in",    "wave": "x.34x5x...", "data": ["A", "B", "C"]},
    {},
    {"name": "data_out",   "wave": "x..3.4.5x.", "data": ["A", "B", "C"]},
    {"name": "empty",      "wave": "1..0....1."},
    {"name": "curr_depth", "wave": "=..======.", "data": ["0", "1", "2", "1", "2", "1", "0"]}
  ],
  "head": {"text": "SFIFO single-port: push A, push B, pop, push C, pop, pop"}
}
```

### Almost-full / almost-empty thresholds

`depth = 4`, `inclAlmostFull = true`, `inclAlmostEmpty = true`, `almost_full_depth = 3`, `almost_empty_depth = 1`. Four pushes then four pops. `almost_empty` is asserted while the count is ≤ 1 and `almost_full` while it is ≥ 3. Both flags change on the same edge as `curr_depth`. `almost_full` asserts one entry before `full`, and `almost_empty` stays asserted one entry past `empty`.

```wavedrom
{
  "signal": [
    {"name": "clk",                "wave": "p..........."},
    {"name": "rst_n",              "wave": "01.........."},
    {},
    {"name": "wr_en",              "wave": "0.1...0....."},
    {"name": "rd_en",              "wave": "0.....1...0."},
    {"name": "almost_full_depth",  "wave": "=...........", "data": ["3"]},
    {"name": "almost_empty_depth", "wave": "=...........", "data": ["1"]},
    {},
    {"name": "curr_depth",         "wave": "=..========.", "data": ["0", "1", "2", "3", "4", "3", "2", "1", "0"]},
    {"name": "empty",              "wave": "1..0......1."},
    {"name": "almost_empty",       "wave": "1...0....1.."},
    {"name": "almost_full",        "wave": "0....1..0..."},
    {"name": "full",               "wave": "0.....10...."}
  ],
  "head": {"text": "SFIFO thresholds: almost_full_depth = 3, almost_empty_depth = 1"}
}
```

_In both configurations — write-to-head latency: **1 clock cycle**; pop-to-next-head latency: **1 clock cycle**._

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
| Show-ahead | `depth=8, simultPushPop=true` | Write 1 word, verify it is on `data_out` the cycle `empty` deasserts, with no `rd_en` |
| Fill to full | `depth=8, simultPushPop=true` | Write 8 words, verify `full` |
| Drain to empty | `depth=8, simultPushPop=true` | Read 8 words, verify `empty` |
| Simultaneous R/W | `depth=4, simultPushPop=true` | Net depth unchanged |
| Single-port interleave | `depth=4, simultPushPop=false` | Push/pop via `rw_en`/`rw`; verify `data_out` holds across push cycles and advances after each pop |
| Almost-full threshold | `depth=8, inclAlmostFull=true, almost_full_depth=6` | `almost_full` asserts on the edge the count reaches 6 and deasserts when it drops to 5 |
| Almost-empty threshold | `depth=8, inclAlmostEmpty=true, almost_empty_depth=2` | `almost_empty` asserted at reset, deasserts when the count reaches 3, reasserts when it drops to 2 |
| Threshold boundaries | `depth=4`, both flags enabled | `almost_full_depth=depth` tracks `full`; `almost_empty_depth=0` tracks `empty` |

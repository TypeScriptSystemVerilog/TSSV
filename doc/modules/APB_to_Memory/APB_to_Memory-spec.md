# Module Specification: `APB_to_Memory`

> **Source:** `ts/src/modules/APB_to_Memory/`
> **Status:** Approved

---

## Overview

A thin combinational adapter that converts an APB4 slave interface into a Memory master interface. It is intended to be instantiated as a submodule inside a `RegisterBlock` when `busInterface` is set to `'APB'`, allowing register blocks to be accessed over an APB4 bus. There is no pipelining or buffering — all signal assignments are combinational `assign` statements, giving zero additional latency. The module has no state of its own.

---

## Parameters

Defined in `APB_to_Memory_Parameters extends TSSVParameters`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `'APB_to_Memory'` | Instance name |
| `DATA_WIDTH` | `32 \| 64 \| 128 \| 256 \| 512 \| 1024` | `32` | Data bus width in bits; must match the attached RegisterBlock's `wordSize` |
| `ADDR_WIDTH` | `IntRange<16, 64>` | `32` | Address bus width in bits |

---

## IO Ports

| Port | Direction | Width | Clock/Reset | Description |
|---|---|---|---|---|
| `clk` | `input` | 1 | `isClock: 'posedge'` | System clock (unused internally; present for interface consistency) |
| `rst_b` | `input` | 1 | `isReset: 'lowasync'` | Active-low async reset (unused internally; present for interface consistency) |

### Interfaces

| Interface | Role | Description |
|---|---|---|
| `apb` | APB4 inward (slave) | APB4 bus port — driven by the APB master |
| `mem` | Memory outward (master) | Memory bus port — drives the attached RegisterBlock |

---

## Functional Description

All logic is purely combinational. There are no registers, no state, and no clock-dependent behavior.

### Signal mapping

| APB4 signal | Direction | Memory signal | Direction | Notes |
|---|---|---|---|---|
| `apb.PADDR` | in → | `mem.ADDR` | → out | Address passes straight through |
| `apb.PWDATA` | in → | `mem.DATA_WR` | → out | Write data passes straight through |
| `apb.PSTRB` | in → | `mem.WSTRB` | → out | Byte strobes pass straight through |
| `mem.DATA_RD` | ← in | `apb.PRDATA` | ← out | Read data passes straight back |
| — | — | `mem.WE` | → out | `PSELx & PENABLE & PWRITE` |
| — | — | `mem.RE` | → out | `PSELx & PENABLE & ~PWRITE` |
| — | — | `apb.PREADY` | ← out | `PSELx & PENABLE` — always ready |
| — | — | `apb.PSLVERR` | ← out | Tied to `0` — no error conditions |

### Normal operation

1. APB master asserts `PSELx` to select this slave.
2. On the following cycle, APB master asserts `PENABLE` to start the access phase.
3. At the same time, `PWRITE` determines direction:
   - Write: `mem.WE` asserts, `mem.DATA_WR` and `mem.ADDR` carry the data and address.
   - Read: `mem.RE` asserts, `mem.ADDR` carries the address.
4. `PREADY` is asserted combinationally as soon as `PSELx & PENABLE` — no wait states.
5. For reads, `mem.DATA_RD` is passed straight to `apb.PRDATA` in the same cycle.
6. `PSLVERR` is permanently tied low — error signalling is not supported.

### Reset behavior

No state to reset. All outputs are combinational functions of the current APB inputs.

### Edge cases

- **Wait states:** Not supported. `PREADY` asserts as soon as the access phase begins. If the downstream register block cannot respond in the same cycle, behaviour is undefined.
- **`PSLVERR`:** Always 0. The module assumes the attached RegisterBlock never generates errors.
- **Simultaneous RE/WE:** Cannot occur by APB4 protocol — `PWRITE` is mutually exclusive.

---

## Timing

All paths are combinational with zero cycles of latency.

```wavedrom
{
  "signal": [
    {"name": "clk",         "wave": "p......."},
    {"name": "apb.PSELx",   "wave": "0.1.1..."},
    {"name": "apb.PENABLE", "wave": "0..1.1.."},
    {"name": "apb.PWRITE",  "wave": "0..1.0.."},
    {"name": "apb.PREADY",  "wave": "0..1.1.."},
    {"name": "mem.WE",      "wave": "0..1.0.."},
    {"name": "mem.RE",      "wave": "0....1.."}
  ]
}
```

---

## Internal Architecture

No sub-blocks. The entire module is eight `addAssign` calls generating eight `assign` statements in the output SV:

- **Address/data passthrough** — `PADDR → ADDR`, `PWDATA → DATA_WR`, `PSTRB → WSTRB`
- **Read data return** — `DATA_RD → PRDATA`
- **WE/RE decode** — APB handshake decoded to Memory `WE` and `RE`
- **PREADY** — combinationally asserted from `PSELx & PENABLE`
- **PSLVERR** — tied to `1'b0`

---

## Dependencies

| Import | Source | Purpose |
|---|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` | Base class and types |
| `APB4` | `tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4` | APB4 slave interface |
| `Memory` | `tssv/lib/interfaces/Memory` | Memory master interface |

---

## Test Plan

**Test script:** `ts/test/test_APB_Registers.ts`
**Output:** `sv-examples/Core/Registers/`

This module is not tested in isolation — it is verified indirectly through the `RegisterBlock` APB test, which instantiates a `RegisterBlock` with `busInterface: 'APB'` and exercises read/write transactions over the APB4 bus.

| Test case | Inputs | Expected output | Notes |
|---|---|---|---|
| APB write | `PSELx=1, PENABLE=1, PWRITE=1, PADDR=X, PWDATA=D` | `mem.WE=1, mem.ADDR=X, mem.DATA_WR=D` | Combinational — same cycle |
| APB read | `PSELx=1, PENABLE=1, PWRITE=0, PADDR=X` | `mem.RE=1, mem.ADDR=X, apb.PRDATA=mem.DATA_RD` | Combinational — same cycle |
| PREADY | `PSELx=1, PENABLE=1` | `apb.PREADY=1` | Always asserts — no wait states |
| PSLVERR | Any | `apb.PSLVERR=0` | Permanently tied low |

```bash
npx tsc && node out/test/test_APB_Registers.js
```

---

## Implementation Notes

- `clk` and `rst_b` are declared as flat ports for interface consistency with the rest of the framework but are not connected to any internal logic.
- The module is intentionally minimal — protocol complexity (burst handling, error conditions, wait states) is assumed to be handled at a higher level or is out of scope for a simple register block adapter.
- Future extension: a pipelined variant could be added to support downstream register blocks that require multiple cycles to respond, by adding a wait-state counter and holding `PREADY` low until the Memory `READY` signal asserts.

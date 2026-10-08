# Module Specification: `<ModuleName>`

> **File:** `ts/src/modules/<ModuleName>/<ModuleName>.ts`
> **Status:** Draft / Review / Approved

---

## Overview

_One paragraph describing what the module does, what problem it solves, and where it fits in a larger design. Include the key trade-offs or design constraints (e.g. latency vs. area, signed vs. unsigned, pipelined vs. combinational)._

---

## Parameters

Defined in `<ModuleName>_Parameters extends TSSV.TSSVParameters`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto-generated | Instance name. If omitted, TSSV derives the name from the parameter values. |
| `param1` | `IntRange<1, N>` | — | _Description. State valid range and what happens at the boundaries._ |
| `param2` | `bigint[]` | — | _Description._ |
| `param3?` | `number` | `8` | _Optional parameter with default._ |

---

## IO Ports

Defined in `<ModuleName>_Ports extends TSSV.IOSignals`.

| Port | Direction | Width | Clock/Reset | Description |
|---|---|---|---|---|
| `clk` | `input` | 1 | `isClock: 'posedge'` | System clock |
| `rst_b` | `input` | 1 | `isReset: 'lowasync'` | Active-low asynchronous reset |
| `en` | `input` | 1 | — | Clock enable |
| `data_in` | `input` | `inWidth` | — | _Signed/unsigned input description_ |
| `data_out` | `output` | `outWidth` | — | _Signed/unsigned output description_ |

---

## Register Map

_If the module uses a `RegisterBlock` for runtime-configurable state, describe it here and reference the YAML source file. If there are no registers, delete this section._

**YAML source:** `ts/src/modules/<ModuleName>/<name>_regs.yaml`
**Generate stub:** `./scripts/gen_regblock.sh ts/src/modules/<ModuleName>/<name>_regs.yaml`

| Register | Address | Type | Width | Reset | Description |
|---|---|---|---|---|---|
| `REG_0` | `0x000` | `RW` | 32 | `0x00000000` | _Description_ |
| `STATUS` | `0x004` | `RO` | 32 | — | _Description_ |

_For registers with bitfields, add a sub-table:_

**`REG_0` fields:**

| Field | Bits | Reset | Description |
|---|---|---|---|
| `ENABLE` | `[0:0]` | `0` | _Description_ |
| `MODE` | `[3:1]` | `0` | _Description_ |

---

## Functional Description

_Describe the module's behavior in enough detail to implement it. Use numbered steps or sub-sections for pipelined or multi-phase operations. Include any equations, state machines, or invariants that must hold._

### Normal operation

1. _Step one._
2. _Step two._

### Reset behavior

_What state is the module in immediately after reset is deasserted?_

### Edge cases

- _What happens when `en` is held low for multiple cycles?_
- _What is the output if the input is at the maximum representable value?_

---

## Timing

_Add a `@wavedrom` block here (it will render in TypeDoc). Copy the template below and fill in the signal names and wave patterns. Delete this section if no timing diagram is needed._

```
@wavedrom
{
  "signal": [
    {"name": "clk",      "wave": "p........."},
    {"name": "rst_b",    "wave": "0.1......."},
    {"name": "en",       "wave": "0...1....."},
    {"name": "data_in",  "wave": "x...345...", "data": ["A", "B", "C"]},
    {"name": "data_out", "wave": "x.....345.", "data": ["fA", "fB", "fC"]}
  ]
}
```

_Latency from `data_in` to `data_out`: **N clock cycles**._

---

## Internal Architecture

_Describe the sub-blocks and how data flows between them. A simple list is fine for small modules; use a diagram description for complex ones._

- **Tap delay line** — _description_
- **Multiplier array** — _description_
- **Accumulator** — _description_
- **RegisterBlock (`coeff_block`)** — _description (if applicable)_

### Key signals

| Signal | Width | Description |
|---|---|---|
| `signal_a` | `N` | _Internal signal description_ |
| `signal_b` | `M` | _Internal signal description_ |

---

## Dependencies

| Import | Source | Purpose |
|---|---|---|
| `TSSV.Module` | `tssv/lib/core/TSSV` | Base class |
| `RegisterBlock` | `tssv/lib/core/Registers` | Register file (if used) |
| `Memory` | `tssv/lib/interfaces/Memory` | Bus interface (if used) |
| `SubModule` | `tssv/lib/modules/SubModule` | _Any instantiated sub-modules_ |

---

## Test Plan

**Test script:** `ts/test/test_<ModuleName>.ts`
**Output:** `sv-examples/test_<ModuleName>_output/`

| Test case | Inputs | Expected output | Notes |
|---|---|---|---|
| Basic operation | _params_ | _expected SV behavior_ | |
| Reset | Assert `rst_b = 0` | All state cleared | |
| Edge case: max input | _description_ | _expected_ | |
| Register write (if applicable) | Write `REG_0 = 0x1` | Output changes on next cycle | |

### Simulation

```bash
npx tsc && node out/test/test_<ModuleName>.js
cd verilatorTB
make VERILOG_FILE=../sv-examples/test_<ModuleName>_output/tb_<ModuleName>.sv \
     TOP_MODULE=Vtb_<ModuleName>
./rungtkwave.sh Vtb_<ModuleName>.vcd
```

---

## Implementation Notes

_Any non-obvious decisions, known limitations, or future work._

- _Why was X chosen over Y?_
- _Known limitation: does not support Z._
- _Future: could be extended to support W._

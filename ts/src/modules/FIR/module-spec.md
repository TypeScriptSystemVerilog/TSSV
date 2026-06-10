# Module Specification: `FIR`

> **File:** `ts/src/modules/FIR/FIR.ts`
> **Status:** Approved

---

## Overview

Implements a parameterized **Finite Impulse Response (FIR) digital filter**. Each input sample is delayed through a tap chain; each tap is multiplied by a corresponding coefficient, then all products are summed, rounded, and saturated to the output width. The number of taps equals `coefficients.length`. Coefficients are backed by a `RegisterBlock` so a host can update them at runtime over a Memory bus; the `coefficients` parameter provides the reset (power-on) values.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `coefficients` | `bigint[]` | — | Tap coefficients. Length determines tap count. Values become register reset values. |
| `inWidth` | `IntRange<1,32>` | `8` | Input sample bit width (signed) |
| `outWidth` | `IntRange<1,32>` | `9` | Output sample bit width (signed) |
| `rShift` | `IntRange<0,32>` | `2` | Right-shift applied after accumulation to scale the result |

---

## IO Ports

| Port | Direction | Width | Notes |
|---|---|---|---|
| `clk` | input | 1 | `posedge` clock |
| `rst_b` | input | 1 | Active-low async reset |
| `en` | input | 1 | Clock enable — all flip-flops hold when low |
| `data_in` | input | `inWidth` | Signed input sample |
| `data_out` | output | `outWidth` | Signed filtered output, 2 cycles after input |

The `regs` Memory bus interface (promoted from the `coeff_block` submodule) also appears as a module-level interface for host register access.

---

## Register Map

**YAML source:** `ts/src/modules/FIR/fir_coeffs.yaml`
**Generate stub:** `./scripts/gen_regblock.sh ts/src/modules/FIR/fir_coeffs.yaml`

One `COEFF_N` register per tap, addresses `0x000`, `0x004`, `0x008`, …

| Register | Address | Type | Width | Reset | Description |
|---|---|---|---|---|---|
| `COEFF_0` | `0x000` | RW | 32 | From `coefficients[0]` | Tap 0 coefficient |
| `COEFF_1` | `0x004` | RW | 32 | From `coefficients[1]` | Tap 1 coefficient |
| `COEFF_N` | `0x000 + N*4` | RW | 32 | From `coefficients[N]` | Tap N coefficient |

---

## Functional Description

1. `data_in` feeds into a shift-register delay chain of `N` flip-flops (`tap_0` … `tap_N-1`), all clocked on `posedge clk` with async reset and gated by `en`.
2. Each `tap_i` is multiplied by `coeff_i` (from the register block output signal). Products are sign-extended to `sumWidth = inWidth + bitWidth(coeffSum)` bits.
3. All products are summed and registered into `sum` on the same `en`-gated clock.
4. `sum` is right-shifted by `rShift` with convergent rounding into `rounded`.
5. `rounded` is clamped to `[-2^(outWidth-1), 2^(outWidth-1)-1]` into `saturated`, then registered to `data_out`.

**Latency:** 2 clock cycles from `data_in` to `data_out` (tap-register + output-register).

### Reset behavior

All tap, sum, and output registers clear to 0 on `rst_b` assertion. Coefficient registers reset to the design-time `coefficients` parameter values.

---

## Timing

```
@wavedrom
{
  "signal": [
    {"name": "     clk", "wave": "p........."},
    {"name": "      en", "wave": "01.0.1.01."},
    {"name": " data_in", "wave": "x34..56.78", "data": ["i0","i1","i2","i3","i4","i5"]},
    {"name": "data_out", "wave": "x.34..56.7", "data": ["o0","o1","o2","o3","o4","o5"]}
  ]
}
```

---

## Internal Architecture

- **`coeff_block` (`myFIR_coeffRegs`)** — `RegisterBlock` submodule; one RW register per tap. Memory bus promoted to FIR ports.
- **Tap delay line** — N `addRegister` calls chaining `data_in → tap_0 → tap_1 → … → tap_N-1`.
- **Multiplier array** — N combinational `addMultiplier` calls: `tap_i * coeff_i`.
- **Accumulator** — single `addRegister` summing all sign-extended products into `sum`.
- **Round/saturate** — combinational `addRound` then `addSaturate`, final `addRegister` to `data_out`.

---

## Dependencies

| Import | Source |
|---|---|
| `TSSV` (default) | `tssv/lib/core/TSSV` |
| `RegisterBlock`, `RegisterBlockDef` | `tssv/lib/core/Registers` |
| `Memory` | `tssv/lib/interfaces/Memory` |

---

## Test Plan

**Test script:** `ts/test/test_FIR.ts`
**Output:** `sv-examples/test_FIR_output/`

| Test case | Instance | Coefficients | Notes |
|---|---|---|---|
| Basic 4-tap | `myFIR` | `[1,2,3,4]` | Sanity check |
| Signed coefficients | auto-named | `[2,-2,4,-4,8]` | Verifies negative reset literals |
| 13-tap low-pass | `myFIR3` | `[-1,0,5,-6,-10,38,77,38,-10,-6,5,0,-1]` | Full simulation target |

```bash
npx tsc && node out/test/test_FIR.js
cd verilatorTB && make clean && make
./rungtkwave.sh Vtb_lpFIR.vcd
```

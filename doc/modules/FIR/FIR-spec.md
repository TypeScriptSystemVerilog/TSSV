# Module Specification: `FIR`

> **File:** `ts/src/modules/FIR/FIR.ts`
> **Status:** Approved

---

## Overview

Implements a parameterized **Finite Impulse Response (FIR) digital filter**. Input samples arrive on an AXI4-Stream slave interface; each is delayed through a tap chain, multiplied by a runtime-configurable coefficient from a `RegisterBlock`, and the products are summed, rounded, and saturated before being driven on an AXI4-Stream master interface. The number of taps is set by the `numTaps` parameter and can be any positive integer — the coefficient register block scales to match.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `numTaps` | `number` | — | Number of filter taps and coefficient registers (required) |
| `coefficients` | `bigint[]` | `0n` per tap | Optional reset values per tap; also used for accumulator width sizing |
| `coefficientsWidth` | `IntRange<2,32>` | `32` | Coefficient register bit width; coefficients must fit within this signed width |
| `inWidth` | `IntRange<1,32>` | `8` | Input sample bit width (signed) |
| `outWidth` | `IntRange<1,32>` | `9` | Output sample bit width (signed) |
| `rShift` | `IntRange<0,32>` | `2` | Right-shift applied after accumulation |

---

## IO Ports

| Port | Direction | Width | Notes |
|---|---|---|---|
| `clk` | input | 1 | `posedge` clock |
| `rst_b` | input | 1 | Active-low async reset |

### Interfaces

| Interface | Role | Description |
|---|---|---|
| `s_axis` | AXI4-Stream inward (slave) | Input samples — `TDATA[inWidth-1:0]`, signed |
| `m_axis` | AXI4-Stream outward (master) | Filtered output — `TDATA` sign-extended to 32 bits |
| `regs` | Memory bus (promoted from `coeff_block`) | Host register access for runtime coefficient updates |

**Backpressure:** `s_axis.TREADY` deasserts when `m_axis.TREADY` is low and the output stage holds valid data, stalling the entire pipeline. Latency is 2 clock cycles.

---

## Register Map

**YAML source:** `ts/src/modules/FIR/fir_coeffs.yaml`
**Regenerate:** `./scripts/gen_regblock.sh ts/src/modules/FIR/fir_coeffs.yaml`

The YAML uses `repeatedRegister` to define a template; the generated factory function `createFirCoeffsDef(numTaps, coefficientsWidth, resetValues?)` produces the actual `RegisterBlockDef` at construction time.

| Register | Address | Type | Width | Reset | Description |
|---|---|---|---|---|---|
| `COEFF_0` | `0x000` | RW (signed) | `coefficientsWidth` | `coefficients[0]` or `0n` | Tap 0 coefficient |
| `COEFF_1` | `0x004` | RW (signed) | `coefficientsWidth` | `coefficients[1]` or `0n` | Tap 1 coefficient |
| `COEFF_N` | `0x000 + N×4` | RW (signed) | `coefficientsWidth` | `coefficients[N]` or `0n` | Tap N coefficient |

Total registers = `numTaps`.

---

## Functional Description

1. Input sample from `s_axis.TDATA[inWidth-1:0]` is written to the internal `data_in` signal.
2. `data_in` feeds into a shift-register delay chain of `numTaps` flip-flops (`tap_0` … `tap_N-1`), all gated by the internal `en` signal (derived from the AXI handshake).
3. Each `tap_i` is multiplied by `coeff_i` (output of the corresponding `coefficientsWidth`-bit coefficient register). Products are sign-extended to `sumWidth = inWidth + bitWidth(coeffSum)` bits.
4. All products are summed and registered into `sum`.
5. `sum` is right-shifted by `rShift` with convergent rounding into `rounded`.
6. `rounded` is clamped to `[-2^(outWidth-1), 2^(outWidth-1)-1]` into `saturated`, then registered to `data_out`.
7. `data_out` is sign-extended and driven on `m_axis.TDATA`; `m_axis.TVALID` is driven by `valid_pipe_1`.

### Reset behavior

All tap, sum, and output registers clear to 0. Coefficient registers reset to the values in the `coefficients` parameter (or `0n` if not provided). `coefficientsWidth` must be between 2 and 32 bits, and each reset coefficient must fit within that signed width.

---

## Timing

```
@wavedrom
{
  "signal": [
    {"name": "          clk", "wave": "p........."},
    {"name": "s_axis.TVALID", "wave": "01.0.1.01."},
    {"name": "s_axis.TREADY", "wave": "1........."},
    {"name": " s_axis.TDATA", "wave": "x34..56.78", "data": ["i0","i1","i2","i3","i4","i5"]},
    {"name": "m_axis.TVALID", "wave": "0..1..0.1."},
    {"name": " m_axis.TDATA", "wave": "x...34..56", "data": ["o0","o1","o2","o3"]}
  ]
}
```

---

## Internal Architecture

- **`coeff_block` (`*_coeffRegs`)** — `RegisterBlock` submodule; `numTaps` RW registers built from `createFirCoeffsDef(numTaps, coefficientsWidth, resetValues)`. Memory bus promoted to FIR's `regs` interface.
- **AXI adapter** — combinational assigns bridging `s_axis`/`m_axis` to the internal data path and `en` signal; `valid_pipe_0`/`valid_pipe_1` shift registers track pipeline validity.
- **Tap delay line** — `numTaps` `addRegister` calls chaining `data_in → tap_0 → … → tap_N-1`, all gated by `en`.
- **Multiplier array** — `numTaps` combinational `addMultiplier` calls: `tap_i * coeff_i`.
- **Accumulator** — single `addRegister` summing all sign-extended products into `sum`.
- **Round/saturate** — combinational `addRound` then `addSaturate`, final `addRegister` to `data_out`.

---

## Dependencies

| Import | Source |
|---|---|
| `TSSV` (default) | `tssv/lib/core/TSSV` |
| `RegisterBlock`, `RegisterBlockDef` | `tssv/lib/core/Registers` |
| `Memory` | `tssv/lib/interfaces/Memory` |
| `AXI4Stream` | `tssv/lib/interfaces/AMBA/AMBA4/AXI4Stream/r0p0_1/AXI4Stream` |
| `createFirCoeffsDef` | `./regs-fir_coeffs.js` (generated from `fir_coeffs.yaml`) |

---

## Test Plan

**Test script:** `ts/test/test_FIR.ts`
**Output:** `sv-examples/FIR/myFIR3/`

| Test case | `numTaps` | `coefficients` | Notes |
|---|---|---|---|
| 13-tap low-pass | 13 | `[-1,0,5,-6,-10,38,77,38,-10,-6,5,0,-1]` | Full simulation target |
| Minimal (no coefficients) | 2 | omitted | Verifies default `0n` reset values |
| Narrow coefficients | 3 | `[-2,1,3]` | Verifies `coefficientsWidth: 4` shrinks coefficient register width |

```bash
npx tsc && node out/test/test_FIR.js
cd verilatorTB && make clean && make
./rungtkwave.sh Vtb_lpFIR.vcd
# In GTKWave: look for s_axis.TDATA (chirp input) and m_axis.TDATA (filtered output)
```

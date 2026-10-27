# Module Specification: `shift`

> **Source:** `ts/src/modules/shift/`
> **Status:** Approved

---

## Overview

Combinational **shift by a fixed amount**, `shift_val`, set when the module is generated. A left shift keeps every bit: `data_out` is `shift_val` bits wider than `data_in`. A right shift keeps `data_in`'s width and drops its low `shift_val` bits. It fills the top bits with zeros for an unsigned value, or with copies of the sign bit for a signed one (an arithmetic shift). The module is one `assign`, with no clock or reset.

---

## Parameters

Defined in `shift_Parameters extends TSSVParameters`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `shift_<dataWidth>_<isSigned>_<shift_direct>_<shift_val>` | Module name. If omitted, TSSV derives it from the other parameters, defaults included. |
| `dataWidth` | `IntRange<1, 256>` | — | Bit width of `data_in` |
| `shift_val` | `IntRange<1, 256>` | — | The number of places to shift. A right shift needs it below `dataWidth`. |
| `shift_direct?` | `'left' \| 'right'` | `'right'` | Shift direction |
| `isSigned?` | `'signed' \| 'unsigned'` | `'unsigned'` | Whether `data_in` holds a two's-complement value. Only a right shift depends on it, but it is part of the derived name for either direction. |

The constructor rejects a `dataWidth` or `shift_val` that isn't an integer from 1 to 256, a `shift_direct` or `isSigned` outside its type, and a right shift with `shift_val` of `dataWidth` or more, which would leave `data_out` constant, or only the sign bit.

---

## IO Ports

| Port | Direction | Width | Clock/Reset | Description |
|---|---|---|---|---|
| `data_in` | `input` | `dataWidth` | — | Input data |
| `data_out` | `output` | `dataWidth + shift_val` (left) or `dataWidth` (right) | — | Shifted result |

---

## Functional Description

### Normal operation

`data_out` follows `data_in` combinationally. With *S* = `shift_val`:

- **Left:** `data_in` moves up *S* places, over *S* zeros. Nothing is dropped.
- **Right, unsigned:** `data_in` moves down *S* places. Its low *S* bits are dropped, and the top *S* bits of `data_out` are zeros.
- **Right, signed:** as unsigned, but the top *S* bits of `data_out` are copies of `data_in`'s top bit, so a two's-complement value keeps its sign. The result is `data_in / 2^S`, rounded towards −∞.

The SV for each, with *S* = 5:

```systemverilog
assign data_out = {data_in, {5{1'b0}}};                 // left
assign data_out = data_in >> 3'd5;                      // right, unsigned
assign data_out = $unsigned($signed(data_in) >>> 3'd5); // right, signed
```

| Configuration | `data_in` | `data_out` |
|---|---|---|
| 16 bits, left 5 | `16'h0003` | `21'h00060` |
| 16 bits, right 5, unsigned | `16'hF000` | `16'h0780` |
| 16 bits, right 5, signed | `16'hF000` (−4096) | `16'hFF80` (−128) |
| 8 bits, right 7, signed | `8'h80` (−128) | `8'hFF` (−1) |

### Reset behavior

None: the module holds no state.

### Edge cases

- A left shift takes any `shift_val` from 1 to 256, so `data_out` can be up to 512 bits.
- A right shift takes `shift_val` up to `dataWidth − 1`, which leaves one bit of `data_in` in `data_out`.

---

## Dependencies

| Import | Source | Purpose |
|---|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` | Base class, parameter types, expressions |

---

## Test Plan

**Test script:** `ts/test/modules/test_shift.ts`
**Output:** `sv-examples/shift/<name>/`

The script generates every structural configuration:

| Configuration | Why |
|---|---|
| 16 bits, right 5 (defaults), unsigned and signed | A right shift of each kind |
| 5 bits, right 3 | A narrow word |
| 16 bits, left 5 | A left shift |
| 1 bit, left 1 | The narrowest word |
| 8 bits, right 7, signed | The largest right shift: one bit of `data_in` is left |
| 256 bits, left 256; 256 bits, right 255, signed | The largest word and shifts, a 512-bit `data_out` |

For each one it checks the ports' names and widths against the IO table above. It also checks the defaults and the derived name, and that 7 invalid parameter sets throw. It writes `sv-examples/shift/tb/` for the testbench.

### Simulation

`make -C verilatorTB shift_sim` runs the test script, lints every configuration with `verilator --lint-only -Wall`, and runs the self-checking `verilatorTB/tb_shift.sv` once per configuration. The testbench checks `data_out` against a reference model that builds it one bit at a time from `data_in`. A word of up to 16 bits is checked for every value. A wider word is checked for all zeros, all ones, a walking one and a walking zero, then 100 000 random words. CI runs `shift_sim`.

---

## Implementation Notes

- **Style-guide deviations.** The module follows the [TSSV guide](../../rtl-style/tssv-style/tssv-coding-style.md) and the [SV guide](../../rtl-style/sv-style/sv-coding-style.md), except:
  - **IDENT-2** (TSSV guide, SHOULD): the class is `shift`, not PascalCase, and the parameters `shift_direct` and `shift_val` aren't camelCase. Renaming the class would rename its folder, its import path (`tssv/lib/modules/shift`) and every module name it generates, and renaming the parameters would break callers' code. Neither would change the logic a configuration generates.
- **Notes on the guides.**
  - **WIDTH-5:** a right shift is `>>` for an unsigned value and `>>>` for a signed one. A left shift concatenates the zeros, which keeps every bit (the guide's `u_shl_cat`).
  - **WIDTH-4 / WIDTH-9:** a signed right shift shifts `$signed(data_in)`. WIDTH-4 rules out `$signed(x)` to convert an unsigned value. Here `data_in`'s bits already hold a two's-complement value, so `$signed` reinterprets them, the explicit change of signedness WIDTH-9 asks for. `$unsigned` changes the result back for the unsigned port.
- **Changed in [#153](https://github.com/TypeScriptSystemVerilog/TSSV/issues/153).** `data_out` is unchanged for every input. Before #153:
  - A right shift was a concatenation, such as `{{5{data_in[15]}}, data_in[15:5]}`. It gave the same bits, but it never read `data_in`'s low `shift_val` bits, which Verilator reported (`UNUSEDSIGNAL`).
  - A right shift with `shift_val` of `dataWidth` or more emitted an ascending, out-of-range slice such as `data_in[4:5]`, which fails lint. The constructor printed an error for a `dataWidth` of 0 or less, and carried on. It now throws for every value listed under Parameters.

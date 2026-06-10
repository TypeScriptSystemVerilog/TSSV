# Module Specification: `shift`

> **File:** `ts/src/modules/shift/shift.ts`
> **Status:** Approved

---

## Overview

Purely **combinational barrel shifter** for a fixed shift amount. Supports left or right shifts by a compile-time constant `shift_val`. Left shift zero-extends the output and widens it by `shift_val` bits. Right shift preserves `dataWidth`, filling vacated MSBs with either zeros (unsigned) or the sign bit (arithmetic shift for signed inputs). There is no clock or reset — this is a single `assign` statement.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Input bit width |
| `shift_val` | `IntRange<1,256>` | — | Number of positions to shift (compile-time constant) |
| `shift_direct` | `'left' \| 'right'` | `'right'` | Shift direction |
| `isSigned` | `'signed' \| 'unsigned'` | `'unsigned'` | For right shifts: fills with sign bit if `'signed'`, zeros if `'unsigned'` |

---

## IO Ports

| Port | Direction | Width | Description |
|---|---|---|---|
| `data_in` | input | `dataWidth` | Input data |
| `data_out` | output | `dataWidth + shift_val` (left) or `dataWidth` (right) | Shifted result |

---

## Functional Description

**Left shift:** `data_out = {data_in, {shift_val{1'b0}}}` — appends `shift_val` zero bits at the LSB. Output width is `dataWidth + shift_val`.

**Right shift (unsigned):** `data_out = {{shift_val{1'b0}}, data_in[dataWidth-1:shift_val]}` — fills MSBs with zeros, truncates LSBs.

**Right shift (signed / arithmetic):** `data_out = {{shift_val{data_in[dataWidth-1]}}, data_in[dataWidth-1:shift_val]}` — fills MSBs with the sign bit, preserving two's-complement value.

Output width for right shifts is always `dataWidth` (the discarded low bits are dropped).

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` |

---

## Test Plan

| Test case | `shift_direct` | `isSigned` | `data_in` | Expected `data_out` |
|---|---|---|---|---|
| Left by 2 | `left` | — | `0b0011` (4-bit) | `0b001100` (6-bit) |
| Right unsigned by 2 | `right` | `unsigned` | `0b1100` | `0b0011` |
| Right signed by 2 | `right` | `signed` | `0b1100` (= -4) | `0b1111` (= -1) |
| Left by 1, max value | `left` | — | `0xFF` (8-bit) | `0x1FE` (9-bit) |

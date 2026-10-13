# Module Specification: `ROM`

> **Source:** `ts/src/modules/ROM/`
> **Status:** Approved

---

## Overview

Synchronous **Read-Only Memory** with flexible initialization. Accepts initial contents as a file path, a plain number array, or a `Uint8Array`. Supports binary, hexadecimal, and signed/unsigned decimal literals in init files. Optionally outputs an RCF (Radix Complement Format) file and can split large ROMs across two smaller sub-ROMs (`split2two` mode). Depth is inferred from the number of initialization entries.

---

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Instance name |
| `dataWidth` | `IntRange<1,256>` | — | Bit width of each ROM word |
| `endianness` | `'big' \| 'little'` | `'big'` | Byte order for multi-byte entries when initializing from a `Uint8Array` or 8-bit binary file |
| `split_setting` | `'interal' \| 'split2two'` | `'interal'` | `split2two` splits depth across two instantiated sub-ROMs at a power-of-2 boundary |

**Constructor extra args:**

| Argument | Type | Description |
|---|---|---|
| `MemInitFile` | `string \| number[] \| Uint8Array` | Init data source: file path, decimal array, or raw byte array |
| `rcf_path` | `string` (optional) | Directory to write an `.rcf` output file |

---

## IO Ports

| Port | Direction | Width | Description |
|---|---|---|---|
| `clk` | input | 1 | `posedge` clock |
| `rd_en` | input | 1 | Read enable — `data_out` advances on the next clock when high |
| `addr` | input | `ceil(log2(depth))` | Read address |
| `data_out` | output | `dataWidth` | Registered read data (1-cycle latency) |

---

## Functional Description

1. Initialization data is parsed from the `MemInitFile` argument at TypeScript elaboration time: binary (`'b`), hex (`'h`, `0x`), and decimal (`'d` or bare number) literals are all supported. Underscores and spaces in files are stripped.
2. Depth is inferred from the entry count (accounting for endian byte grouping when applicable). With byte grouping, depth is `ceil(bytes / (dataWidth / 8))`: if the bytes don't fill the last word, the missing bytes are zero. They are the high bytes of that word with `endianness: 'little'` and the low bytes with `'big'`.
3. The generated SV body is a `case(addr)` statement inside `always_ff @(posedge clk)`, so read data is registered with 1-cycle latency.
4. In `split2two` mode, two sub-`ROM` instances are instantiated; a mux selects output based on the MSB of the address.
5. If `rcf_path` is provided, an `.rcf` file (one binary word per line) is written at elaboration time.

### Edge cases

- Non-power-of-2 depths: address width is sized to `ceil(log2(depth))`.
- A partly filled last word (byte grouping only) is zero-padded; e.g. 17 bytes into 32-bit words give 5 words, the last `32'h00000020` (little) or `32'h20000000` (big) for a final byte of `0x20`.
- Out-of-range addresses default to `'hx` (undefined).
- Signed decimal negatives are converted to two's-complement before output.

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` |
| `fs` | Node.js standard library |

---

## Test Plan

| Test case | Init source | `dataWidth` | Notes |
|---|---|---|---|
| Hex file | `.rom` file with `'h` entries | 8 | Basic read |
| Decimal array | `[0, 1, 255, -128]` | 8 | Signed negative values |
| Uint8Array big-endian | `Uint8Array([0xDE, 0xAD])` | 16 | Endian grouping |
| Uint8Array, partial last word | 17 bytes, `'little'` and `'big'` | 32 | Last word zero-padded; no `undefined` in the emitted SV |
| Split mode | Large array | 16 | Two sub-ROMs instantiated |
| RCF output | Any | 8 | Check `.rcf` file written |

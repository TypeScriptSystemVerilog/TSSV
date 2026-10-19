# Module Specification: `ROM`

> **Source:** `ts/src/modules/ROM/`
> **Status:** Approved

---

## Overview

Synchronous **Read-Only Memory** with flexible initialization. Accepts initial contents as a file path, an array of the same entries a file holds, a plain number array, or a `Uint8Array`. Supports binary, hexadecimal, and decimal literals, and packs bytes into wider words in either byte order. Optionally outputs an RCF file, one binary word per line, and can split the ROM across two smaller sub-ROMs (`split2two` mode). Depth is inferred from the number of words the contents make.

---

## Parameters

Defined in `ROM_Parameters extends TSSVParameters`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Module name. If omitted, TSSV derives it from `dataWidth`, `endianness` and `split_setting`, which leave out the contents. Name each ROM whose contents differ from another's with the same parameters ([Implementation Notes](#implementation-notes)) |
| `dataWidth` | `IntRange<1,256>` | — | Bit width of each ROM word |
| `endianness` | `'big' \| 'little'` | `'big'` | Byte order of a word packed from bytes ([Contents](#contents)). No effect when the contents aren't packed |
| `split_setting` | `'interal' \| 'split2two'` | `'interal'` | `split2two` builds the ROM from two sub-ROM instances, split at the top address bit ([split2two](#split2two)) |

**Constructor extra args:**

| Argument | Type | Description |
|---|---|---|
| `MemInitFile` | `ROM_InitData`: `string \| string[] \| number[] \| Uint8Array` | The contents: the path of a file with one entry per line, an array of entries in the same syntax, an array of decimal numbers, or bytes |
| `rcf_path` | `string` (optional) | Directory to write an `.rcf` output file to |

---

## IO Ports

| Port | Direction | Width | Description |
|---|---|---|---|
| `clk` | input | 1 | `posedge` clock |
| `rd_en` | input | 1 | Read enable: `data_out` loads the addressed word on the next clock edge while high, and holds while low |
| `addr` | input | `max(1, ceil(log2(depth)))` | Read address |
| `data_out` | output | `dataWidth` | Registered read data (1-cycle latency) |

---

## Functional Description

### Contents

The contents are parsed at TypeScript elaboration time.

1. **Entries.** A file holds one entry per line. In a file or a string array, `_` and whitespace are removed from each entry and blank entries are skipped, so a file's final newline adds nothing. Each entry is one of:
   - binary: `'b0101`, with an optional size such as `8'b0101`;
   - hexadecimal: `'hBEEF`, `32'hBEEF` or `0xBEEF`;
   - decimal: `'d255`, `16'd255` or `255`.

   A leading `-` negates the value. The size is ignored, and base letters and hex digits can be either case. An entry of a number array is an integer, and an entry of a `Uint8Array` is a byte.
2. **Fit.** Each entry must be a value of `n` bits, signed or unsigned: from -2<sup>n-1</sup> to 2<sup>n</sup>-1. `n` is `dataWidth`, or 8 when the entries are bytes packed into words. A negative entry is stored in two's complement.
3. **Packing.** When `dataWidth` is a multiple of 8 above 8, bytes are packed into words, `dataWidth / 8` to a word. A `Uint8Array` is always packed, and a file or string array is packed when its first entry is 8-digit binary, such as `8'b0000_0001`. A number array is never packed. With `endianness: 'big'` the first byte of each word is its top byte, with `'little'` its bottom byte. If the bytes don't fill the last word, the missing bytes are zero: they are the high bytes of that word with `'little'` and the low bytes with `'big'`. Contents that aren't packed give one word per entry.
4. **Depth** is the number of words.

### Reads

5. The words form a `case (addr)` table in an `always_ff @(posedge clk)` block named `rom_read`. On a clock edge with `rd_en` high, `data_out` loads word `addr`. While `rd_en` is low, `data_out` holds.
6. A read past the last word, `addr >= depth`, which a depth that isn't a power of 2 allows, loads `'x`.

### split2two

7. A `split2two` ROM needs at least 3 words. With an `A`-bit address, the lower sub-ROM, `<name>_lower` (instance `u_lower`), holds the first 2<sup>A-1</sup> words, the ones with `addr[A-1]` low. The upper sub-ROM, `<name>_upper` (instance `u_upper`), holds the rest, from 1 to 2<sup>A-1</sup> words. Each sub-ROM is an ordinary ROM built from its words, so its address is as wide as its own depth needs.
8. A read enables only the sub-ROM that holds `addr`. A read past the last word enables neither. Two registers, `sel_l_q` and `sel_u_q`, record which sub-ROM each read enabled, and load only while `rd_en` is high. They pick `data_out` from that sub-ROM's output, or `'x` after a read that enabled neither. So `data_out` behaves as in a single ROM: 1-cycle latency, held while `rd_en` is low, `'x` after a read past the last word.

### RCF output

9. If `rcf_path` is given, `<rcf_path>/<name>.rcf` is written at elaboration time: one word per line, in binary with `dataWidth` digits, and no newline after the last. A `split2two` ROM's sub-ROMs write their own, `<name>_lower.rcf` and `<name>_upper.rcf`.

### Reset behavior

`ROM` has no reset port, and none of its registers is reset. This is a design decision under the SV guide's RST-3:

- `data_out` is a datapath register, undefined until the first read, as an `SRAM`'s read data is. A consumer reads it only after issuing a read, so a reset would add a port and reset fan-out for nothing.
- In `split2two`, `sel_l_q` and `sel_u_q` only steer `data_out`. They load on every read, on the same clock edge as the sub-ROM's output, so before the first read they choose between two outputs that are undefined anyway. They are not state that has to be known before the first read.

### Rejected contents

Right after building its parameters, the constructor throws an error that starts with `ROM <name>:` (TSSV guide PARAM-5) for:

- a `MemInitFile` path it can't read;
- contents with no entries, or only blank ones;
- an entry that isn't one of the forms in [Contents](#contents), or a number array entry that isn't an integer;
- an entry that doesn't fit its width;
- `split_setting: 'split2two'` with fewer than 3 words.

### Edge cases

- One word: `addr` is still 1 bit wide, and address 1 reads `'x`.
- Non-power-of-2 depths: the address width is `ceil(log2(depth))`, and addresses past the last word read `'x`.
- Words wider than 53 bits: entries are parsed as `bigint`, so every bit is exact, up to 256-bit words.
- A partly filled last word (packed bytes only) is zero-padded; e.g. 17 bytes into 32-bit words give 5 words, the last `32'h00000020` (little) or `32'h20000000` (big) for a final byte of `0x20`.

---

## Internal Architecture

One `ROM` is one `always_ff` case table. A `split2two` ROM has two sub-ROM instances and this logic:

| Signal | Width | Description |
|---|---|---|
| `rd_en_l`, `rd_en_u` | 1 | `rd_en` for the lower and upper sub-ROM: `rd_en` and the top address bit, and for the upper one, `addr` below the depth when the depth isn't a power of 2 |
| `addr_l`, `addr_u` | lower and upper sub-ROM's address width | The low bits of `addr` |
| `data_out_l`, `data_out_u` | `dataWidth` | The sub-ROMs' read data |
| `sel_l_q`, `sel_u_q` | 1 | `rd_en_l` and `rd_en_u`, registered while `rd_en` is high; select `data_out` |

---

## Dependencies

| Import | Source |
|---|---|
| `Module`, `TSSVParameters`, `IntRange`, `Expr` | `tssv/lib/core/TSSV` |
| `fs` | Node.js standard library |

---

## Test Plan

**Test script:** `ts/test/modules/test_ROM.ts`
**Output:** `sv-examples/ROM/<name>/`, one module per file; a `split2two` ROM also gets a lint filelist, `<name>.f`

The script checks every configuration's ports against [IO Ports](#io-ports), that each expected word is in a case table, and that the SV has no `undefined` (#127). It exits nonzero on any failure.

| Test case | Init source | `dataWidth` | Notes |
|---|---|---|---|
| Hex file | `ts/test/test_rom_init_file.txt`: binary, hex and decimal entries | 32 | Writes and checks an RCF |
| Packed binary file | 8-digit binary entries, `'little'` and `'big'` | 32 | Packing in each byte order |
| Decimal array | `[-5, -255, 0, 255, 32767, -32767]` | 16 | Signed negative values |
| Uint8Array, partial last word | 17 bytes, `'little'` and `'big'` | 32 | Last word zero-padded |
| Not packed | 17 bytes; the packed binary file | 31; 25 | One word per byte |
| Fit limits | `[-5, -256, 0, 255, 511]` | 9 | -256 signed and 511 unsigned both fit |
| Split mode | The hex file | 32 | 8 + 2 words, addresses 10 to 15 unused |
| Split, packed bytes | 20 bytes, `'little'` | 32 | 4 + 1 words |
| Split, smallest depth | `[1, -2, 127]` | 8 | 2 + 1 words |
| Split, power-of-2 depth | 8 hex strings | 40 | 4 + 4 words, no address past the last word |
| Split, packed binary strings | 70 bytes, `'big'`, with an RCF | 64 | 8 + 1 words, last word partly filled; RCF holds words |
| One word | `[0x5A]` | 8 | 1-bit `addr` |
| 1-bit words | `[1, 0, -1, 0]` | 1 | |
| Wide words | entries above 2<sup>53</sup> | 256 | Exact `bigint` parsing |
| Rejected contents | See [Rejected contents](#rejected-contents) | — | Each throws its error |

### Simulation

`make -C verilatorTB rom_sim` runs the test script, lints every configuration above with `-Wall`, and runs the self-checking `verilatorTB/tb_ROM.sv` once per configuration. The testbench reads random addresses on random cycles and checks `data_out` against the words the test script expects. It checks the 1-cycle latency and that `data_out` holds while `rd_en` is low. After a read past the last word it checks nothing until the next read, since Verilator is two-state and can't show the `'x`. A configuration also fails if some word is never read, if no held word is checked, or if a depth that isn't a power of 2 never gets a read past its last word. CI runs it.

---

## Implementation Notes

- **Style-guide deviations.** The module follows the [TSSV guide](../../rtl-style/tssv-style/tssv-coding-style.md) and the [SV guide](../../rtl-style/sv-style/sv-coding-style.md), except:
  - **PARAM-2** (TSSV guide, MUST): the contents change the SV, but they're a constructor argument, not a parameter, so they aren't in the derived module name. Two ROMs with the same parameters and different contents get the same name, and emission keeps only the first one's definition. A comment at the `super()` call says so. [#123](https://github.com/TypeScriptSystemVerilog/TSSV/issues/123) makes the contents a parameter. Until then, set `name` on such ROMs.
  - **SEQ-2** (SV guide, SHOULD): the case table is inside the `always_ff`. This is the synchronous-ROM form synthesis tools document for a block ROM. An `always_comb` decode feeding a register describes the same logic as a combinational ROM ahead of a flop.
  - **IDENT-2** (TSSV guide, SHOULD): `split_setting`, `MemInitFile` and `rcf_path` aren't camelCase, and `'interal'` is misspelled. Renaming them would break callers and change derived module names, which #123 reworks anyway.
  - **MOD-5** (TSSV guide, SHOULD): the ports are plain signals, not an `Interface`. They mirror a ROM macro's pins, as `SRAM`'s do.
- **Changed in #151.** Before #151:
  - A `split2two` ROM's `data_out` went to `'x` on the cycle after each read, instead of holding. Against that SV, `tb_ROM.sv` fails every check of a held word.
  - `split2two` threw on packed bytes, because it split the bytes rather than the words. With any `dataWidth` but 32 its SV failed lint, and with 2 words it emitted `addr[-1:0]`. It now works from 3 words up and rejects fewer.
  - Bad contents printed `Error:` and generated anyway, or crashed with a `TypeError` (no entries, a missing file). They now throw. The range check accepted only the signed range, and wrongly flagged -2<sup>n-1</sup>. Now any `n`-bit value, signed or unsigned, fits.
  - Entries were parsed with JavaScript numbers, so bits past the 53rd of a decimal or binary entry were wrong. A `-` before a hex or binary entry was ignored, and a file's final newline added a zero word.
  - The RCF of a packed ROM held one byte per line, and every RCF line was rounded up to a multiple of 4 bits. Lines are now words of `dataWidth` bits.
  - The sub-ROM instances were named `u_<name>_lower` and `u_<name>_upper`, and the select registers `rd_en_l_d1` and `rd_en_u_d1`.

# Pattern files

> **Status:** pattern memories for the testbench framework (tssv-noc#207, TSSV#197), and the
> files of record-stream injectors and checkers (TSSV#198).
> **Code:** `ts/src/tb/patternRecord.ts` (record layouts), `ts/src/tb/patternFile.ts` (the writer),
> `ts/src/tb/PatternMemory.ts` (the memory), `ts/src/tb/recordStream.ts` (record-stream layouts)
> **Examples:** `ts/test/tb/test_patternFile.ts`, `ts/test/tb/test_PatternMemory.ts`, and the
> example testbenches' `patterns/` folders, written by `ts/test/tb/test_tbExamples.ts`

A test's content lives in pattern files, not in its RTL. A generator, in any language, writes
them offline. A `PatternMemory` in the harness holds them, one record per word. The memory reads
its file with `$readmemh` or `$readmemb` at configuration, or a host writes the file's words
through the memory's load port. This page defines the format, so that a generator that isn't
written in TypeScript can produce the same files. In TypeScript, `patternFile.ts` writes them
([below](#writing-them-from-typescript)).

The memory and how a testbench uses it are in [testbench.md](testbench.md).

---

## Records and their layout

A **record** is one value per field: a flit of a stream (`head`, `tail`, `data`), or a row of a
cycle table (one value per lane). Its **layout** says which bits of a memory word hold each field.

- **The fields come from the interface**: its signals, in the order the interface declares them,
  each at its width. A record leaves out the signals the memory doesn't hold, such as `valid` and
  `ready` (`recordFields(intf, names)`).
- **The first field is in the most significant bits.** Each field has a slot. The slots are packed
  from the top of the word down, in field order, with no gaps.
- **In a `$readmemh` layout, each slot is padded to whole hex digits.** A slot is the field's width
  rounded up to a multiple of 4. The field sits in the slot's low bits, and the bits above it are
  0. So each field is its own hex digits, and an underscore in a file always falls between two
  fields.
- **In a `$readmemb` layout, each slot is the field's exact width.**

The memory uses the same layout as its file. Its word is the whole padded record, and it has one
output per field, read from the field's slot.

For example, the record `head` (1 bit), `tail` (1 bit), `data` (32 bits) has these layouts:

| Field | `$readmemh` slot (40-bit word) | `$readmemb` slot (34-bit word) |
|---|---|---|
| `head` | bits 39:36: the field in bit 36, 0 in 39:37 | bit 33 |
| `tail` | bits 35:32: the field in bit 32, 0 in 35:33 | bit 32 |
| `data` | bits 31:0 | bits 31:0 |

---

## The file

A pattern file is a text file that both `$readmemh` (or `$readmemb`) and a person can read. Its
lines, in order:

1. **A header comment of four lines**:
   ```text
   // <block>, testcase <testcase>: <what the file is for>
   // $readmemh, one <record> per line: <field> _ <field> _ ...
   //   <field>, <field>: <w> bit(s) each[, <d> hex digit(s) each]; <field>: <w> bits; ...
   // <n> <record>s in <m> <object>s
   ```
   - Line 1 says which block, testcase and port the file is for: `stimulus for s_in`,
     `expected values of pop_data`.
   - Line 2 gives the radix (`$readmemh` or `$readmemb`), what one record is, and the fields in
     order. They are named as the lines split them, with each 16-bit group of a wide field
     (below) named by its bits: `data[31:16] _ data[15:0]`.
   - Line 3 gives each field's width. Neighbouring fields of one width share an entry. In a
     `$readmemh` file, a field whose width isn't a whole number of hex digits also gets its digit
     count.
   - Line 4 gives the record and object counts.
2. **The objects.** An object is a packet, a transaction or a phase: whatever groups records for a
   person reading the file. Each object starts with a comment, followed by its records:
   ```text
   // <object> <i>: <label>, <k> <record>s
   ```
   Objects are numbered from 0. The label is optional and says what the object is, such as
   `source 0`.
3. **One record per line**, as the hex (or binary) digits of its word, with `_` between fields:
   - In a `$readmemh` file, a field is written as the digits of its slot, in lowercase. A field
     wider than 16 bits is written in groups of 4 digits, counted from its least significant end,
     with `_` between the groups. A 32-bit field is two groups, `0000_0a01`, named `data[31:16]`
     and `data[15:0]` in line 2. An 18-bit field is a 1-digit group and a 4-digit group,
     `addr[17:16]` and `addr[15:0]`.
   - In a `$readmemb` file, a field is written as exactly its width in bits.

`$readmem` ignores the comments and the underscores. Records load from address 0 up, one per line,
and a file has no `@` address lines. The comments are for people: a generator in another language
should give the same information, but `$readmem` doesn't check their wording.

### The example

The lead's example from tssv-noc#207, as `writePatternFile()` writes it
(`ts/test/tb/test_patternFile.ts` checks it byte for byte):

```text
// FlitStreamPipe, testcase burst_mix: stimulus for s_in
// $readmemh, one flit per line: head _ tail _ data[31:16] _ data[15:0]
//   head, tail: 1 bit each, one hex digit each; data: 32 bits
// 4 flits in 2 packets
// packet 0: source 0, 3 flits
1_0_0000_0a01
0_0_0000_0a02
0_1_0000_0a03
// packet 1: source 1, 1 flit
1_1_0000_0b01
```

The same records in `$readmemb` start `1_0_00000000000000000000101000000001`.

---

## Cycle tables

A `VectorPlayer` or a `VectorChecker` reads a table from a pattern memory, one record per row
([testbench.md](testbench.md#cycle-tables-and-their-timing)).

- **A player's file** has one field per lane, named after the lane's port
  (`VectorPlayer.layout()`). A lane with no value in a row is written as 0
  (`VectorPlayer.records()`).
- **A checker's file** has one field per lane, then a field `care`, with one bit per lane and the
  first lane's bit most significant (`VectorChecker.layout()`). A lane whose care bit is 0 isn't
  checked in that row. A don't-care in the table is written as care 0 and value 0
  (`VectorChecker.records()`).

The SFIFO example's expected values, from the spec's dual-port diagram, start like this. `care` is
7 in the first rows, because `pop_data` is x in the diagram until the first push:

```text
// SFIFO, testcase dual_port: expected values from SFIFO-timing-dual-port.svg
// $readmemh, one cycle per line: pop_data _ empty _ full _ curr_depth _ care
//   pop_data: 8 bits; empty, full: 1 bit each, one hex digit each; curr_depth: 3 bits, one hex digit; care: 4 bits
// 13 cycles in 1 diagram
// diagram 0: SFIFO-timing-dual-port.svg, 13 cycles
00_1_0_0_7
00_1_0_0_7
00_1_0_0_7
41_0_0_1_f
```

---

## Record streams

A `RecordInjector` or `RecordChecker` ([testbench.md](testbench.md#record-streams)) holds a
stream's records, one per line, in the order they are sent or expected. Three things change a
record's fields from the stream's:

- **LFSR payloads.** The payload fields are replaced by one field `seed`, as wide as the Lfsr
  (32 or 64 bits), where the first of them was. A non-zero seed restarts the payload sequence at
  that seed, and 0 continues it, so a file seeded once per packet reads like this:
  ```text
  // StreamSlice, testcase seeded_phases: stimulus for s_in, a seed per packet
  // $readmemh, one record per line: last _ seed[63:48] _ seed[47:32] _ seed[31:16] _ seed[15:0]
  //   last: 1 bit, one hex digit; seed: 64 bits
  // 48 records in 22 packets
  // packet 0: 1 record
  1_3c1e_ba8b_4dcc_c148
  // packet 1: 1 record
  1_533e_00f7_f3c6_06d4
  // packet 2: 2 records
  0_eefa_317f_ac7a_b8fd
  1_0000_0000_0000_0000
  ```
- **A perSource checker** has one file per source, and each leaves out the source field: every
  record in it is from that source.
- **A tied checker's records** end with `after_peer` and `after_count`: the record may arrive only
  once that peer has delivered that many records.

`injectorLayout(fields, { lfsr })` and `checkerLayout(fields, { lfsr, sourceField, tie })` give
the layouts. A cycleExact checker reads a cycle table's two files: its `ready` column, and
`valid` and the whole record, its fields as one value, with a `care` bit each
(`RecordChecker.cycleLayouts()`, `RecordChecker.cycleRecords()`).

Their manifests name the memories by the injector's and checker's instances: `h.inj_<port>.pattern`;
`h.chk_<port>.pattern`, or `h.chk_<port>.pattern_<k>` for source k; and in cycleExact mode
`h.chk_<port>.play.pattern` and `h.chk_<port>.chk.pattern`.

---

## The manifest

Each testcase has a JSON manifest that lists its pattern files and the memory each one loads into:

```json
{
  "testcase": "dual_port",
  "files": [
    { "file": "stimulus.hex", "memory": "h.play.pattern", "radix": "h", "records": 13 },
    { "file": "expected.hex", "memory": "h.chk.pattern", "radix": "h", "records": 13 }
  ]
}
```

| Key | Holds |
|---|---|
| `testcase` | The testcase's name, as the files' headers give it |
| `files[].file` | A pattern file's path, relative to the manifest |
| `files[].memory` | The `PatternMemory` it loads into: its instance path from the testbench's top. Under a `SimTop`, that starts with `h.`, the harness |
| `files[].radix` | `h` for `$readmemh`, `b` for `$readmemb` |
| `files[].records` | The records in the file |

A host that loads a reloaded memory reads the manifest to know which file goes to which memory. It
writes record i of the file at `load_addr` = i.

---

## Loading

- **Preloaded:** the memory's `file` parameter is the path in its `$readmemh` line. A relative path
  is relative to the directory the simulator or synthesis tool runs in. The examples write their
  files to `patterns/` beside the testbench's SV, and `verilatorTB/Makefile` runs each testbench
  from its own folder. New content needs only the new files in simulation, because `$readmem`
  reads them at run time. On an FPGA it needs a new bitstream.
- **Reloaded:** the memory has no file. A host writes each record's word, as one line of the file
  holds it, to `load_data` at `load_addr`, with `load_en` high for one rising edge per word.
  `tb_PatternMemory_reloaded` (`ts/test/tb/test_PatternMemory.ts`) does this in simulation.

---

## Writing them from TypeScript

```ts
import { recordFields, recordLayout } from 'tssv/lib/tb/patternRecord'
import { writeManifest, writePatternFile } from 'tssv/lib/tb/patternFile'

const layout = recordLayout(recordFields(flitStream, ['head', 'tail', 'data']))   // 'h' by default
const records = writePatternFile('patterns/burst_mix_s_in.hex', layout, {
  dut: 'FlitStreamPipe',
  testcase: 'burst_mix',
  purpose: 'stimulus for s_in',
  recordNoun: 'flit',
  objectNoun: 'packet',
  objects: [
    { label: 'source 0', records: [{ head: 1n, tail: 0n, data: 0x0a01n }, /* ... */] },
    { label: 'source 1', records: [{ head: 1n, tail: 1n, data: 0x0b01n }] }
  ]
})
writeManifest('patterns/burst_mix.json', {
  testcase: 'burst_mix',
  files: [{ file: 'burst_mix_s_in.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records }]
})
```

`writePatternFile()` refuses a value wider than its field, a record without a value for a field, and
a value for a field the layout doesn't have. `formatPatternFile()` returns the same text without
writing it.

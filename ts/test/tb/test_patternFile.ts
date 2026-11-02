/**
 * Tests (node:test) of record layouts (ts/src/tb/patternRecord.ts) and the pattern file writer
 * (ts/src/tb/patternFile.ts), against the format in doc/framework/pattern-files.md:
 *
 *   - the lead's example from tssv-noc#207, rebuilt from an interface, is byte for byte the text in
 *     the issue (TSSV#197);
 *   - the layout pads each $readmemh field to whole hex digits, and every line reads back as the
 *     record it was written from;
 *   - a $readmemb file writes each field at its exact width;
 *   - a field wider than 16 bits is split into 4-digit groups, named without pad bits;
 *   - a value that doesn't fit, a missing or unknown field, and an unknown signal are refused;
 *   - the manifest is JSON that reads back as written, and writePatternFile returns the record count.
 */
import { Interface } from 'tssv/lib/core/TSSV'
import { recordFields, recordLayout, unpackRecord, type PatternRecord, type RecordLayout } from 'tssv/lib/tb/patternRecord'
import { formatPatternFile, writeManifest, writePatternFile, type Manifest, type PatternFileContent } from 'tssv/lib/tb/patternFile'
import { readFileSync, rmSync } from 'fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const OUT = 'sv-examples/tb/patternFile'
rmSync(OUT, { recursive: true, force: true })

// The lead's example, as TSSV#197 quotes it from tssv-noc#207
const LEAD_EXAMPLE = `// FlitStreamPipe, testcase burst_mix: stimulus for s_in
// $readmemh, one flit per line: head _ tail _ data[31:16] _ data[15:0]
//   head, tail: 1 bit each, one hex digit each; data: 32 bits
// 4 flits in 2 packets
// packet 0: source 0, 3 flits
1_0_0000_0a01
0_0_0000_0a02
0_1_0000_0a03
// packet 1: source 1, 1 flit
1_1_0000_0b01
`

// A FlitStream-like interface: the record carries head, tail and data, not the handshake
const flitStream = new Interface('flit_stream', {}, undefined, {
  head: { width: 1 },
  tail: { width: 1 },
  data: { width: 32 },
  valid: { width: 1 },
  ready: { width: 1 }
})
const fields = recordFields(flitStream, ['head', 'tail', 'data'])
const flit = (head: bigint, tail: bigint, data: bigint): PatternRecord => ({ head, tail, data })
const burstMix = (): PatternFileContent => ({
  dut: 'FlitStreamPipe',
  testcase: 'burst_mix',
  purpose: 'stimulus for s_in',
  recordNoun: 'flit',
  objectNoun: 'packet',
  objects: [
    { label: 'source 0', records: [flit(1n, 0n, 0x0a01n), flit(0n, 0n, 0x0a02n), flit(0n, 1n, 0x0a03n)] },
    { label: 'source 1', records: [flit(1n, 1n, 0x0b01n)] }
  ]
})
const records = burstMix().objects.flatMap(o => o.records)

/** The records in a pattern file's text: each line that isn't a comment, read in the file's radix */
function readBack (layout: RecordLayout, text: string): PatternRecord[] {
  return text.split('\n').filter(l => l !== '' && !l.startsWith('//'))
    .map(l => unpackRecord(layout, BigInt(`0${layout.radix === 'h' ? 'x' : 'b'}${l.replace(/_/g, '')}`))) // every '_' removed
}
const hex = recordLayout(fields)
const hexText = formatPatternFile(hex, burstMix())
void test('the lead\'s example is written byte for byte', () => {
  assert.equal(hexText, LEAD_EXAMPLE)
})

void test('a $readmemh layout pads head and tail to one digit each: 40-bit words', () => {
  assert.deepEqual(hex.fields.map(f => `${f.name}@${f.lo}+${f.slotWidth}`), ['head@36+4', 'tail@32+4', 'data@0+32'])
  assert.equal(hex.wordWidth, 40)
})
void test('every $readmemh line reads back as its record', () => {
  assert.deepEqual(readBack(hex, hexText), records)
})

const bin = recordLayout(fields, 'b')
const binText = formatPatternFile(bin, burstMix())
const binLines = binText.split('\n')
void test('a $readmemb layout packs exact widths: 34-bit words', () => {
  assert.equal(bin.wordWidth, 34)
})
void test('a $readmemb header names whole fields and states no digits', () => {
  assert.equal(binLines[1], '// $readmemb, one flit per line: head _ tail _ data')
  assert.equal(binLines[2], '//   head, tail: 1 bit each; data: 32 bits')
})
void test('a $readmemb line writes each field at its exact width', () => {
  assert.equal(binLines[5], '1_0_00000000000000000000101000000001')
})
void test('every $readmemb line reads back as its record', () => {
  assert.deepEqual(readBack(bin, binText), records)
})

const wide = recordLayout([{ name: 'addr', width: 18 }, { name: 'len', width: 3 }])
const wideText = formatPatternFile(wide, {
  dut: 'Dma',
  testcase: 'one_burst',
  purpose: 'stimulus for cmd',
  recordNoun: 'command',
  objectNoun: 'burst',
  objects: [{ records: [{ addr: 0x2abcdn, len: 5n }] }]
}).split('\n')
void test('an 18-bit field is two groups, named for its bits, not its pad bits', () => {
  assert.equal(wideText[1], '// $readmemh, one command per line: addr[17:16] _ addr[15:0] _ len')
})
void test('the width line gives the digits of each padded field', () => {
  assert.equal(wideText[2], '//   addr: 18 bits, five hex digits; len: 3 bits, one hex digit')
})
void test('an object without a label still counts its records, and the line splits the groups', () => {
  assert.equal(wideText[4], '// burst 0: 1 command')
  assert.equal(wideText[5], '2_abcd_5')
})

void test('a value wider than its field is refused', () => {
  assert.throws(() => formatPatternFile(hex, { ...burstMix(), objects: [{ records: [flit(2n, 0n, 0n)] }] }),
    { message: 'packRecord: 2 doesn\'t fit the 1-bit field head' })
})
void test('a record without a field is refused', () => {
  assert.throws(() => formatPatternFile(hex, { ...burstMix(), objects: [{ records: [{ head: 1n, tail: 0n }] }] }),
    { message: 'packRecord: the record has no value for field data' })
})
void test('a record with a value for no field is refused', () => {
  assert.throws(() => formatPatternFile(hex, { ...burstMix(), objects: [{ records: [{ ...flit(1n, 0n, 0n), valid: 1n }] }] }),
    { message: 'packRecord: the record has a value for valid, which is not a field' })
})
void test('a name the interface doesn\'t have is refused', () => {
  assert.throws(() => recordFields(flitStream, ['head', 'last']), { message: 'recordFields: interface flit_stream has no signal last' })
})

void test('writePatternFile writes the text and returns the record count; the manifest reads back as written', () => {
  const n = writePatternFile(`${OUT}/burst_mix_s_in.hex`, hex, burstMix())
  assert.equal(n, 4)
  assert.equal(readFileSync(`${OUT}/burst_mix_s_in.hex`, 'utf8'), LEAD_EXAMPLE)
  const manifest: Manifest = {
    testcase: 'burst_mix',
    files: [{ file: 'burst_mix_s_in.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records: n }]
  }
  writeManifest(`${OUT}/burst_mix.json`, manifest)
  assert.deepEqual(JSON.parse(readFileSync(`${OUT}/burst_mix.json`, 'utf8')), manifest)
})

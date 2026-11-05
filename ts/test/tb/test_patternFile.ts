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
 *   - the manifest is JSON that reads back as written, and writePatternFile returns the record count;
 *   - readManifest reads a manifest back, and refuses one that breaks the format: a missing or
 *     unknown key, a testcase that isn't snake_case, no files, a path outside the manifest's
 *     folder, a memory with two files, a bad radix or record count (TSSV#200);
 *   - readPatternWords reads a file's records as $readmem does, and refuses an @ line, a block
 *     comment, two words on a line, and a digit the radix doesn't have.
 */
import { Interface } from 'tssv/lib/core/TSSV'
import { recordFields, recordLayout, unpackRecord, type PatternRecord, type RecordLayout } from 'tssv/lib/tb/patternRecord'
import { formatPatternFile, parseManifest, readManifest, readPatternWords, writeManifest, writePatternFile, type Manifest, type PatternFileContent } from 'tssv/lib/tb/patternFile'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
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

void test('readManifest reads back what writeManifest wrote', () => {
  const manifest: Manifest = {
    testcase: 'burst_mix',
    files: [
      { file: 'burst_mix_s_in.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records: 4 },
      { file: 'sub/expected.bin', memory: 'h.chk_m_out.pattern', radix: 'b', records: 0 }
    ]
  }
  writeManifest(`${OUT}/read/burst_mix.json`, manifest)
  assert.deepEqual(readManifest(`${OUT}/read/burst_mix.json`), manifest)
})

void test('readManifest names the file in a JSON syntax error', () => {
  mkdirSync(OUT, { recursive: true })
  writeFileSync(`${OUT}/broken.json`, '{ "testcase": ')
  assert.throws(() => readManifest(`${OUT}/broken.json`), (e: Error) => e.message.startsWith(`${OUT}/broken.json: `))
})

// A manifest's one file, to break one key of at a time
const goodFile = { file: 'stimulus.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records: 4 }
const refusals: Array<[string, unknown, string]> = [
  ['a manifest that isn\'t an object', [goodFile], 'm.json: a manifest is a JSON object'],
  ['a missing key', { testcase: 'burst_mix' }, 'm.json: has no files'],
  ['an unknown key', { testcase: 'burst_mix', files: [goodFile], mode: 'reloaded' }, 'm.json: has mode, which isn\'t one of testcase, files'],
  ['a testcase that isn\'t snake_case', { testcase: 'BurstMix', files: [goodFile] }, 'm.json: testcase "BurstMix" isn\'t a lower snake_case name'],
  ['no files', { testcase: 'burst_mix', files: [] }, 'm.json: files must be an array of at least one file'],
  ['a file entry that isn\'t an object', { testcase: 'burst_mix', files: ['stimulus.hex'] }, 'm.json: files[0] isn\'t an object'],
  ['an unknown key in a file', { testcase: 'burst_mix', files: [{ ...goodFile, depth: 8 }] }, 'm.json: files[0]: has depth, which isn\'t one of file, memory, radix, records'],
  ['a path above the manifest', { testcase: 'burst_mix', files: [{ ...goodFile, file: '../stimulus.hex' }] }, 'm.json: files[0]: file "../stimulus.hex" must be a path inside the manifest\'s folder, relative to it'],
  ['an absolute path', { testcase: 'burst_mix', files: [{ ...goodFile, file: '/tmp/stimulus.hex' }] }, 'm.json: files[0]: file "/tmp/stimulus.hex" must be a path inside the manifest\'s folder, relative to it'],
  ['an empty memory', { testcase: 'burst_mix', files: [{ ...goodFile, memory: '' }] }, 'm.json: files[0]: memory must be a memory\'s instance path, got ""'],
  ['a memory with two files', { testcase: 'burst_mix', files: [goodFile, { ...goodFile, file: 'more.hex' }] }, 'm.json: files[1]: memory h.inj_s_in.pattern has two files'],
  ['a radix other than h or b', { testcase: 'burst_mix', files: [{ ...goodFile, radix: 'd' }] }, 'm.json: files[0]: radix must be \'h\' or \'b\', got "d"'],
  ['a negative record count', { testcase: 'burst_mix', files: [{ ...goodFile, records: -1 }] }, 'm.json: files[0]: records must be an integer, at least 0, got -1'],
  ['a fractional record count', { testcase: 'burst_mix', files: [{ ...goodFile, records: 1.5 }] }, 'm.json: files[0]: records must be an integer, at least 0, got 1.5'],
  ['a record count as a string', { testcase: 'burst_mix', files: [{ ...goodFile, records: '3' }] }, 'm.json: files[0]: records must be an integer, at least 0, got "3"']
]
for (const [what, json, message] of refusals) {
  void test(`parseManifest refuses ${what}`, () => {
    assert.throws(() => parseManifest(json, 'm.json'), { message })
  })
}

void test('readPatternWords reads the lead\'s example as its 4 records, without comments or underscores', () => {
  mkdirSync(OUT, { recursive: true })
  writeFileSync(`${OUT}/lead.hex`, LEAD_EXAMPLE)
  assert.deepEqual(readPatternWords(`${OUT}/lead.hex`, 'h'), ['1000000a01', '0000000a02', '0100000a03', '1100000b01'])
})

// A pattern file's text, to break the format of one line at a time
const words: Array<[string, string, 'h' | 'b', string]> = [
  ['an @ address line', '// header\n@10\n1_0\n', 'h', 'words.txt:2: has an @ address line; records load from address 0 up, one per line'],
  ['a block comment', '1_0 /* first */\n', 'h', 'words.txt:1: has a block comment; a pattern file uses // comments'],
  ['two words on one line', '1_0 0_1\n', 'h', 'words.txt:1: has two words on one line'],
  ['an x digit', '1_x\n', 'h', 'words.txt:1: 1_x isn\'t a word of $readmemh digits'],
  ['a g in a hex file', '1_g\n', 'h', 'words.txt:1: 1_g isn\'t a word of $readmemh digits'],
  ['a 2 in a binary file', '0_1\n1_2\n', 'b', 'words.txt:2: 1_2 isn\'t a word of $readmemb digits']
]
for (const [what, text, radix, message] of words) {
  void test(`readPatternWords refuses ${what}`, () => {
    mkdirSync(OUT, { recursive: true })
    writeFileSync(`${OUT}/words.txt`, text)
    assert.throws(() => readPatternWords(`${OUT}/words.txt`, radix), { message: `${OUT}/${message}` })
  })
}

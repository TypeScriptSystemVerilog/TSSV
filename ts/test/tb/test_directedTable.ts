/**
 * Checks of directedTable() and tableObjects() (doc/framework/testbench.md, "Directed tables"),
 * which turn a directed table written as rows into a player's and a checker's pattern files:
 *
 *   - a driven lane holds its last value until a row changes it, from its initial value;
 *   - a checked lane is checked only in the rows that name it, and is a don't-care elsewhere;
 *   - each case becomes one pattern-file object, labelled with the case's label;
 *   - writeDirectedTestcase() writes both pattern files and a manifest that loads them;
 *   - lanes, values and cases that don't fit are refused, naming the case and the row.
 */
import { directedTable, tableObjects, writeDirectedTestcase, type DirectedCase } from 'tssv/lib/tb/directedTable'
import { formatPatternFile, readManifest, readPatternWords } from 'tssv/lib/tb/patternFile'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'
import { VectorPlayer } from 'tssv/lib/tb/VectorPlayer'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const LANES = {
  driven: [{ port: 'sel', width: 2 }, { port: 'in_data', width: 8 }],
  checked: [{ port: 'out_valid', width: 1 }, { port: 'out_data', width: 8 }]
}
const CASES: DirectedCase[] = [
  { label: 'T1 idle', rows: [{ drive: { in_data: 0xaa }, expect: { out_valid: 0 } }] },
  {
    label: 'T2 forward input 0',
    rows: [
      { drive: { sel: 1 }, expect: { out_valid: 1, out_data: 0xaan } },
      {},
      { drive: { in_data: 0x55 }, expect: { out_data: 0x55 } }
    ]
  }
]

void test('a driven lane holds its last value until a row changes it, from 0', () => {
  const t = directedTable(LANES, CASES)
  assert.equal(t.rows, 4)
  assert.deepEqual(t.driven, [
    { port: 'sel', width: 2, values: [0n, 1n, 1n, 1n] },
    { port: 'in_data', width: 8, values: [0xaan, 0xaan, 0xaan, 0x55n] }
  ])
})

void test('initial sets a driven lane\'s value before the first row', () => {
  const t = directedTable(LANES, CASES, { initial: { sel: 3 } })
  assert.deepEqual(t.driven[0]?.values, [3n, 1n, 1n, 1n])
})

void test('a checked lane is checked only in the rows that name it', () => {
  const t = directedTable(LANES, CASES)
  assert.deepEqual(t.checked, [
    { port: 'out_valid', width: 1, values: [0n, 1n, undefined, undefined] },
    { port: 'out_data', width: 8, values: [undefined, 0xaan, undefined, 0x55n] }
  ])
})

void test('each case is one object: its label and its rows', () => {
  assert.deepEqual(directedTable(LANES, CASES).objects, [{ label: 'T1 idle', rows: 1 }, { label: 'T2 forward input 0', rows: 3 }])
})

void test('the two pattern files have a commented object per case, in the cases\' order', () => {
  const t = directedTable(LANES, CASES)
  const file = (layout: ReturnType<typeof VectorPlayer.layout>, records: ReturnType<typeof VectorPlayer.records>): string =>
    formatPatternFile(layout, { dut: 'Mux', testcase: 'directed', purpose: 'test', recordNoun: 'row', objectNoun: 'case', objects: tableObjects(records, t.objects) })
  const stimulus = file(VectorPlayer.layout(t.driven), VectorPlayer.records(t.driven, t.rows))
  assert.deepEqual(stimulus.split('\n').slice(4), [
    '// case 0: T1 idle, 1 row',
    '0_aa',
    '// case 1: T2 forward input 0, 3 rows',
    '1_aa',
    '1_aa',
    '1_55',
    ''
  ])
  // A don't-care is written as 0 with its care bit 0: care is out_valid then out_data
  const expected = file(VectorChecker.layout(t.checked), VectorChecker.records(t.checked, t.rows))
  assert.deepEqual(expected.split('\n').slice(4), [
    '// case 0: T1 idle, 1 row',
    '0_00_2',
    '// case 1: T2 forward input 0, 3 rows',
    '1_aa_3',
    '0_00_0',
    '0_55_1',
    ''
  ])
})

void test('writeDirectedTestcase writes both pattern files and a manifest that loads them into the player and the checker', () => {
  const dir = mkdtempSync(join(tmpdir(), 'directedTable-'))
  try {
    const manifest = writeDirectedTestcase({ dut: 'Mux', testcase: 'directed', dir, lanes: LANES, cases: CASES })
    assert.equal(manifest, `${dir}/directed.json`)
    assert.deepEqual(readManifest(manifest), {
      testcase: 'directed',
      files: [
        { file: 'stimulus.hex', memory: 'h.play.pattern', radix: 'h', records: 4 },
        { file: 'expected.hex', memory: 'h.chk.pattern', radix: 'h', records: 4 }
      ]
    })
    assert.deepEqual(readPatternWords(`${dir}/stimulus.hex`, 'h'), ['0aa', '1aa', '1aa', '155'])
    assert.deepEqual(readPatternWords(`${dir}/expected.hex`, 'h'), ['0002', '1aa3', '0000', '0551'])
    assert.match(readFileSync(`${dir}/expected.hex`, 'utf8'), /^\/\/ Mux, testcase directed: /) // starts with the header's first line, `// Mux, testcase directed: `
    writeDirectedTestcase({ dut: 'Mux', testcase: 'other', dir, lanes: LANES, cases: CASES, player: 'h.p.pattern', checker: 'h.c.pattern' })
    assert.deepEqual(readManifest(`${dir}/other.json`).files.map(f => f.memory), ['h.p.pattern', 'h.c.pattern'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

void test('tableObjects refuses objects whose rows don\'t add up to the records', () => {
  const t = directedTable(LANES, CASES)
  assert.throws(() => tableObjects(VectorPlayer.records(t.driven, t.rows).slice(1), t.objects),
    { message: 'tableObjects: the objects hold 4 rows, but there are 3 records' })
})

const one = (rows: DirectedCase['rows']): DirectedCase[] => [{ label: 'bad', rows }]
const REFUSED: Array<[string, () => unknown, string]> = [
  ['a driven lane listed twice', () => directedTable({ driven: [...LANES.driven, { port: 'sel', width: 1 }], checked: [] }, CASES),
    'directedTable: driven lane sel is listed twice'],
  ['no cases', () => directedTable(LANES, []), 'directedTable: no cases, so the table has no rows'],
  ['a case with no rows', () => directedTable(LANES, one([])), 'directedTable: case "bad" has no rows'],
  ['an empty label', () => directedTable(LANES, [{ label: 'ok', rows: [{}] }, { label: '', rows: [{}] }]), 'directedTable: case 1 has an empty label'],
  ['a drive of a lane that isn\'t driven', () => directedTable(LANES, one([{}, { drive: { out_valid: 1 } }])),
    'directedTable: case "bad" row 1: drive names out_valid, which isn\'t a driven lane'],
  ['an expect of a lane that isn\'t checked', () => directedTable(LANES, one([{ expect: { sel: 1 } }])),
    'directedTable: case "bad" row 0: expect names sel, which isn\'t a checked lane'],
  ['a driven value too wide for its lane', () => directedTable(LANES, one([{ drive: { sel: 4 } }])),
    'directedTable: case "bad" row 0, sel: 4 doesn\'t fit in 2 bits'],
  ['an expected value too wide for its lane', () => directedTable(LANES, one([{ expect: { out_valid: 2n } }])),
    'directedTable: case "bad" row 0, out_valid: 2 doesn\'t fit in 1 bit'],
  ['a negative value', () => directedTable(LANES, one([{ drive: { in_data: -1 } }])),
    'directedTable: case "bad" row 0, in_data: -1 is negative'],
  ['a value that isn\'t an integer', () => directedTable(LANES, one([{ expect: { out_data: 1.5 } }])),
    'directedTable: case "bad" row 0, out_data: 1.5 isn\'t an integer'],
  ['an initial value of a lane that isn\'t driven', () => directedTable(LANES, CASES, { initial: { out_data: 0 } }),
    'directedTable: initial names out_data, which isn\'t a driven lane'],
  ['an initial value too wide', () => directedTable(LANES, CASES, { initial: { sel: 7 } }),
    'directedTable: initial sel: 7 doesn\'t fit in 2 bits']
]
for (const [what, f, message] of REFUSED) {
  void test(`${what} is refused`, () => { assert.throws(f, { message }) })
}

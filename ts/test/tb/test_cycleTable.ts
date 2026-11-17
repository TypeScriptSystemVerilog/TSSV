/**
 * Checks of tier 1's cycle tables, VectorPlayer and VectorChecker (doc/framework/testbench.md,
 * "Cycle tables and their timing"), that need no simulation. tb_LFSR (tb_examples_sim) and the
 * generated SFIFOWave and SliceCycle testbenches, in both modes (tb_regression_sim), simulate them.
 *
 * The checks read only the TSSV object model, never the generated SV (doc/framework/testbench.md,
 * "What TS-side tests may check"):
 *
 *   - preloaded, each lists its memory, `pattern`, a table's, with its file and its rows as the
 *     record count, as deep as `depth` (by default the table's), for a harness to register
 *     (TSSV#223); a player without lanes lists none;
 *   - a memory deeper than the table leaves the ports as they are: `fetch` is the table's row;
 *   - reloaded, each lists its memory without a file or a count, and adds the load port and
 *     `records`, the row count it reads at run time; `row`, `fetch` and `records` are sized for
 *     as many rows as the memory holds (TSSV#225);
 *   - bad parameters are refused: a depth below the table's, rows or a file in reloaded mode, no
 *     depth in reloaded mode, a reloaded player without lanes, a firstRow outside the table, and a
 *     lane named after one of the component's own signals.
 */
import { type Module } from 'tssv/lib/core/TSSV'
import { VectorPlayer, tableDepth, tableSize, type VectorPlayer_Parameters } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker, type VectorChecker_Parameters } from 'tssv/lib/tb/VectorChecker'
import { test } from 'node:test'
import assert from 'node:assert/strict'

/** A module's ports, as `<direction> <name>[<width>]` in declaration order */
function ports (m: Module): string[] {
  const IOs = (m as unknown as { IOs: Record<string, { direction: string, width?: number }> }).IOs
  return Object.entries(IOs).map(([name, io]) => `${io.direction} ${name}[${io.width ?? 1}]`)
}

const LANES = [{ port: 'a', width: 1 }, { port: 'b', width: 8 }]
const player = (extra: Partial<VectorPlayer_Parameters> = {}): VectorPlayer =>
  new VectorPlayer({ name: 'play', rows: 13, lanes: LANES, file: 's.hex', ...extra })
const checker = (extra: Partial<VectorChecker_Parameters> = {}): VectorChecker =>
  new VectorChecker({ name: 'chk', rows: 13, lanes: LANES, file: 'e.hex', ...extra })

void test('a player lists its memory, pattern: a table\'s, preloaded with its file, its rows as records, as deep as the table', () => {
  assert.equal(tableDepth(13), 13)
  assert.deepEqual(player().memories, [{ path: 'pattern', depth: 13, layout: VectorPlayer.layout(LANES), mode: 'preloaded', file: 's.hex', records: 13, table: true }])
  assert.deepEqual(player({ depth: 40, memory: 'preloaded' }).memories.map(m => [m.depth, m.records]), [[40, 13]])
})

void test('a player without lanes lists no memory', () => {
  assert.deepEqual(player({ lanes: [], file: undefined }).memories, [])
})

void test('a checker lists its memory, pattern: its layout has care bits, and its rows are the records', () => {
  assert.deepEqual(checker({ depth: 16 }).memories, [{ path: 'pattern', depth: 16, layout: VectorChecker.layout(LANES), mode: 'preloaded', file: 'e.hex', records: 13, table: true }])
})

void test('a memory deeper than the table leaves every port as it is: fetch addresses the table\'s rows', () => {
  assert.deepEqual(ports(player({ depth: 40 })), ports(player()))
  assert.deepEqual(ports(checker({ depth: 40 })), ports(checker()))
  assert.ok(ports(player()).includes('output fetch[4]'))
})

// Reloaded: no rows and no file, which a testcase loads at run time, and a depth, which sizes the table
const RELOADED = { memory: 'reloaded', rows: undefined, file: undefined, depth: 16 } as const

void test('a reloaded player and checker list their memories as a table\'s, reloaded, with no file or count', () => {
  assert.deepEqual(player(RELOADED).memories,
    [{ path: 'pattern', depth: 16, layout: VectorPlayer.layout(LANES), mode: 'reloaded', file: undefined, records: undefined, table: true }])
  assert.deepEqual(checker(RELOADED).memories,
    [{ path: 'pattern', depth: 16, layout: VectorChecker.layout(LANES), mode: 'reloaded', file: undefined, records: undefined, table: true }])
})

void test('a reloaded table adds the load port and records, and sizes row and fetch for as many rows as it holds', () => {
  assert.deepEqual(tableSize('t', 13, undefined), { depth: 13, size: 13 })
  assert.deepEqual(tableSize('t', undefined, 16, 'reloaded'), { depth: 16, size: 16 })
  // a's slot is 4 bits and b's 8 in a player's word; a checker's word adds 2 care bits in a slot of 4
  assert.deepEqual(ports(player(RELOADED)), [
    'input clk[1]', 'input rst_b[1]', 'input load_en[1]', 'input load_addr[4]', 'input load_data[12]', 'input records[5]',
    'output row[5]', 'output fetch[4]', 'output run[1]', 'output done[1]', 'output a[1]', 'output b[8]'
  ])
  assert.deepEqual(ports(checker(RELOADED)), [
    'input clk[1]', 'input rst_b[1]', 'input load_en[1]', 'input load_addr[4]', 'input load_data[16]', 'input records[5]',
    'input row[5]', 'input fetch[4]', 'input run[1]', 'input a[1]', 'output fail_a[1]', 'input b[8]', 'output fail_b[1]'
  ])
  // A depth that isn't a power of 2: records counts to 13 in 4 bits, and fetch addresses 13 rows
  assert.ok(ports(player({ ...RELOADED, depth: 13 })).includes('input records[4]'))
  assert.ok(ports(player({ ...RELOADED, depth: 13 })).includes('output fetch[4]'))
})

const REFUSED: Array<[string, () => unknown, string]> = [
  ['a player\'s depth below its rows', () => player({ depth: 12 }), 'play: depth must be an integer of at least 13, the table\'s 13 rows, got 12'],
  ['a checker\'s depth that isn\'t an integer', () => checker({ depth: 14.5 }), 'chk: depth must be an integer of at least 13, the table\'s 13 rows, got 14.5'],
  ['a reloaded player given rows', () => player({ ...RELOADED, rows: 13 }), 'play: a reloaded table reads its row count on records, not from rows'],
  ['a reloaded checker without a depth', () => checker({ ...RELOADED, depth: undefined }), 'chk: a reloaded table needs depth, an integer of at least 2, got undefined'],
  ['a reloaded player given a file', () => player({ ...RELOADED, file: 's.hex' }), 'play: a reloaded table loads through its load port, not from s.hex'],
  ['a reloaded checker given a file', () => checker({ ...RELOADED, file: 'e.hex' }), 'chk: a reloaded table loads through its load port, not from e.hex'],
  ['a reloaded player without lanes', () => player({ ...RELOADED, lanes: [] }), 'play: a reloaded player needs lanes: without them it has no memory to load its row count with'],
  ['a preloaded checker without a file', () => checker({ file: undefined }), 'chk: a preloaded checker needs a pattern file'],
  ['a firstRow past the table', () => checker({ firstRow: 13 }), 'chk: firstRow must be an integer, 0 to 12, a row of the table, got 13'],
  ['a player lane named table_addr', () => player({ lanes: [{ port: 'table_addr', width: 4 }] }), 'play: lane table_addr has the name of another port or signal'],
  ['a player lane named records, in either mode', () => player({ lanes: [{ port: 'records', width: 4 }] }), 'play: lane records has the name of another port or signal'],
  ['a checker lane named checking', () => checker({ lanes: [{ port: 'checking', width: 1 }] }), 'chk: lane checking has the name of another port or signal'],
  ['a checker lane named load_en, in either mode', () => checker({ lanes: [{ port: 'load_en', width: 1 }] }), 'chk: lane load_en has the name of another port or signal']
]
for (const [what, f, message] of REFUSED) {
  void test(`${what} is refused`, () => { assert.throws(f, { message }) })
}

/**
 * Checks of tier 1's cycle tables, VectorPlayer and VectorChecker (doc/framework/testbench.md,
 * "Cycle tables and their timing"), that need no simulation. tb_LFSR (tb_examples_sim) and the
 * generated SFIFOWave and SliceCycle testbenches (tb_regression_sim) simulate them.
 *
 * The checks read only the TSSV object model, never the generated SV (doc/framework/testbench.md,
 * "What TS-side tests may check"):
 *
 *   - each lists its memory, `pattern`, preloaded with its file and its rows as the record count,
 *     as deep as `depth` (by default the table's), for a harness to register (TSSV#223); a player
 *     without lanes lists none;
 *   - a memory deeper than the table leaves the ports as they are: `fetch` is the table's row;
 *   - bad parameters are refused: a depth below the table's, reloaded mode, and a lane named
 *     after one of the component's own signals.
 */
import { type Module } from 'tssv/lib/core/TSSV'
import { VectorPlayer, tableDepth, type VectorPlayer_Parameters } from 'tssv/lib/tb/VectorPlayer'
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

void test('a player lists its memory, pattern: preloaded with its file, its rows as records, as deep as the table', () => {
  assert.equal(tableDepth(13), 13)
  assert.deepEqual(player().memories, [{ path: 'pattern', depth: 13, layout: VectorPlayer.layout(LANES), mode: 'preloaded', file: 's.hex', records: 13 }])
  assert.deepEqual(player({ depth: 40, memory: 'preloaded' }).memories.map(m => [m.depth, m.records]), [[40, 13]])
})

void test('a player without lanes lists no memory', () => {
  assert.deepEqual(player({ lanes: [], file: undefined }).memories, [])
})

void test('a checker lists its memory, pattern: its layout has care bits, and its rows are the records', () => {
  assert.deepEqual(checker({ depth: 16 }).memories, [{ path: 'pattern', depth: 16, layout: VectorChecker.layout(LANES), mode: 'preloaded', file: 'e.hex', records: 13 }])
})

void test('a memory deeper than the table leaves every port as it is: fetch addresses the table\'s rows', () => {
  assert.deepEqual(ports(player({ depth: 40 })), ports(player()))
  assert.deepEqual(ports(checker({ depth: 40 })), ports(checker()))
  assert.ok(ports(player()).includes('output fetch[4]'))
})

const REFUSED: Array<[string, () => unknown, string]> = [
  ['a player\'s depth below its rows', () => player({ depth: 12 }), 'play: depth must be an integer of at least 13, the table\'s 13 rows, got 12'],
  ['a checker\'s depth that isn\'t an integer', () => checker({ depth: 14.5 }), 'chk: depth must be an integer of at least 13, the table\'s 13 rows, got 14.5'],
  ['a reloaded player, before its rows are read', () => player({ memory: 'reloaded', rows: Number.NaN }), 'play: a cycle table is preloaded only, so it can\'t be built in reloaded mode'],
  ['a reloaded checker', () => checker({ memory: 'reloaded' }), 'chk: a cycle table is preloaded only, so it can\'t be built in reloaded mode'],
  ['a player lane named table_addr', () => player({ lanes: [{ port: 'table_addr', width: 4 }] }), 'play: lane table_addr has the name of another port or signal'],
  ['a checker lane named checking', () => checker({ lanes: [{ port: 'checking', width: 1 }] }), 'chk: lane checking has the name of another port or signal']
]
for (const [what, f, message] of REFUSED) {
  void test(`${what} is refused`, () => { assert.throws(f, { message }) })
}

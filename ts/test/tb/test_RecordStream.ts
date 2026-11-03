/**
 * Checks of the record-stream components of tier 1 (doc/framework/testbench.md, "Record streams")
 * that need no simulation: RecordInjector, RecordChecker, the helpers in recordStream.ts,
 * Throttle and TrafficPhases. The tb_RecordStream_* testbenches in test_tbExamples.ts simulate
 * them.
 *
 * The checks read only the TSSV object model, never the generated SV (doc/framework/testbench.md,
 * "What TS-side tests may check"):
 *
 *   - each component has the ports its options select, and no others;
 *   - the record layouts put a seed in place of the LFSR payload fields, leave out a perSource
 *     checker's source field, and add a tied checker's after fields;
 *   - the payload model restarts at a seed and continues on 0;
 *   - derived values, such as TrafficPhases' countWidth and drawSeed's seeds, are as documented;
 *   - bad parameters are refused.
 */
import { type Module } from 'tssv/lib/core/TSSV'
import { RecordInjector, type RecordInjector_Parameters } from 'tssv/lib/tb/RecordInjector'
import { RecordChecker, type RecordChecker_Parameters } from 'tssv/lib/tb/RecordChecker'
import { checkerFields, lfsrPayloads, mixSeed, storedFields } from 'tssv/lib/tb/recordStream'
import { xorshift } from 'tssv/lib/tb/xorshift'
import { Throttle, drawSeed, READY_SALT, VALID_SALT } from 'tssv/lib/tb/Throttle'
import { TrafficPhases, STANDARD_PHASES } from 'tssv/lib/tb/TrafficPhases'
import { test } from 'node:test'
import assert from 'node:assert/strict'

/** A module's ports, as `<direction> <name>[<width>]` in declaration order */
function ports (m: Module): string[] {
  const IOs = (m as unknown as { IOs: Record<string, { direction: string, width?: number }> }).IOs
  return Object.entries(IOs).map(([name, io]) => `${io.direction} ${name}[${io.width ?? 1}]`)
}

const FIELDS = [{ name: 'src', width: 2 }, { name: 'last', width: 1 }, { name: 'data', width: 32 }]
const LFSR = { fields: ['data'], width: 32 as const, seed: 7n }

// ---- Layouts and the payload model

void test('with lfsr, a record stores a seed as wide as the Lfsr where its first payload field was', () => {
  assert.deepEqual(storedFields(FIELDS, LFSR), [{ name: 'src', width: 2 }, { name: 'last', width: 1 }, { name: 'seed', width: 32 }])
  assert.deepEqual(storedFields(FIELDS, { fields: ['src', 'data'], seed: 1n }), [{ name: 'seed', width: 64 }, { name: 'last', width: 1 }])
})

void test('a perSource checker\'s records leave out the source field, and a tied one\'s add after_peer and after_count', () => {
  assert.deepEqual(checkerFields(FIELDS, { sourceField: 'src', tie: { peers: 3, countWidth: 6 } }), [
    { name: 'last', width: 1 }, { name: 'data', width: 32 }, { name: 'after_peer', width: 2 }, { name: 'after_count', width: 6 }
  ])
})

void test('the payload model restarts at each non-zero seed and continues on 0', () => {
  const [a0, a1, a2] = xorshift(32, 0xabcn, 32, 3)
  const [r0, r1] = xorshift(32, LFSR.seed, 32, 2)
  // 0 first continues from the reset seed; 0xabc restarts; 0 continues from there
  assert.deepEqual(lfsrPayloads(LFSR, 32, [0n, 0n, 0xabcn, 0n, 0n]), [r0, r1, a0, a1, a2])
  assert.deepEqual(lfsrPayloads(LFSR, 8, [0xabcn]), [0xbcn])
})

void test('mixSeed gives dense, non-zero seeds of the width asked for', () => {
  for (let n = 0n; n < 64n; n++) {
    const s = mixSeed(n, 32)
    assert.ok(s > 0n && s < 1n << 32n)
  }
  assert.notEqual(mixSeed(1n), mixSeed(2n))
})

// ---- RecordInjector

const injector = (extra: Partial<RecordInjector_Parameters> = {}): RecordInjector =>
  new RecordInjector({ name: 'inj', fields: FIELDS, depth: 8, memory: 'preloaded', file: 'f.hex', records: 5, ...extra })

void test('an injector has ready in, and valid, one output per field and done out', () => {
  assert.deepEqual(ports(injector()), ['input clk[1]', 'input rst_b[1]', 'input ready[1]', 'output valid[1]', 'output src[2]', 'output last[1]', 'output data[32]', 'output done[1]'])
})

void test('throttle adds valid_rate, limitWidth adds limit, and reloaded mode adds the load port and records', () => {
  assert.deepEqual(ports(injector({ memory: 'reloaded', file: undefined, records: undefined, throttle: { seed: 1n }, limitWidth: 3, lfsr: LFSR })), [
    'input clk[1]', 'input rst_b[1]', 'input ready[1]', 'input valid_rate[9]', 'input limit[3]',
    'input load_en[1]', 'input load_addr[3]', 'input load_data[40]', 'input records[4]',
    'output valid[1]', 'output src[2]', 'output last[1]', 'output data[32]', 'output done[1]'
  ])
})

// ---- RecordChecker

const checker = (extra: Partial<RecordChecker_Parameters> = {}): RecordChecker =>
  new RecordChecker({ name: 'chk', mode: 'inOrder', fields: FIELDS, depth: 8, memory: 'preloaded', file: 'e.hex', records: 5, ...extra } as RecordChecker_Parameters)

void test('an inOrder checker has valid and one input per field in, and ready, fail and drained out', () => {
  assert.deepEqual(ports(checker()), ['input clk[1]', 'input rst_b[1]', 'input valid[1]', 'input src[2]', 'input last[1]', 'input data[32]', 'output ready[1]', 'output fail[1]', 'output drained[1]'])
})

void test('a tied perSource checker, reloaded, adds ready_rate, limit, the load port with load_src, records per source, peer_count, fail_after and count', () => {
  assert.deepEqual(ports(checker({
    mode: 'perSource', sourceField: 'src', sources: 3, memory: 'reloaded', file: undefined, records: undefined, throttle: { seed: 1n }, limitWidth: 4, tie: { peers: 2, countWidth: 6 }
  } as Partial<RecordChecker_Parameters>)), [
    'input clk[1]', 'input rst_b[1]', 'input valid[1]', 'input src[2]', 'input last[1]', 'input data[32]', 'input ready_rate[9]', 'input limit[4]',
    'input load_en[1]', 'input load_src[2]', 'input load_addr[3]', 'input load_data[48]', 'input records[12]', 'input peer_count[12]',
    'output ready[1]', 'output fail[1]', 'output fail_after[1]', 'output drained[1]', 'output count[5]'
  ])
})

void test('a cycleExact checker has ready, a fail per lane and done out', () => {
  assert.deepEqual(ports(new RecordChecker({ name: 'cyc', mode: 'cycleExact', fields: FIELDS, rows: 9, readyFile: 'r.hex', file: 'e.hex' })), [
    'input clk[1]', 'input rst_b[1]', 'input valid[1]', 'input src[2]', 'input last[1]', 'input data[32]', 'output ready[1]', 'output fail_valid[1]', 'output fail_record[1]', 'output done[1]'
  ])
})

void test('cycleRecords makes a row that expects no record a don\'t-care, and packs the fields in order', () => {
  const { ready, expected } = RecordChecker.cycleRecords([{ name: 'last', width: 1 }, { name: 'data', width: 8 }],
    [{ ready: false }, { ready: true, record: { last: 1n, data: 0xa5n } }])
  assert.deepEqual(ready, [{ ready: 0n }, { ready: 1n }])
  assert.deepEqual(expected, [{ valid: 0n, record: 0n, care: 2n }, { valid: 1n, record: 0x1a5n, care: 3n }])
})

// ---- Throttle

void test('a Throttle has clk, rst_b and a 9-bit rate in, and pass out', () => {
  assert.deepEqual(ports(new Throttle({ seed: 1n })), ['input clk[1]', 'input rst_b[1]', 'input rate[9]', 'output pass[1]'])
})

void test('drawSeed gives an odd 32-bit seed, different for an injector and a checker of one stream', () => {
  for (const seed of [0n, 1n, 2n, 0xffffffffffffffffn]) {
    for (const salt of [VALID_SALT, READY_SALT]) {
      const s = drawSeed(seed, salt)
      assert.ok(s > 0n && s < 1n << 32n && (s & 1n) === 1n, `drawSeed(${seed}, ${salt}) = ${s}`)
    }
  }
  assert.notEqual(drawSeed(7n, VALID_SALT), drawSeed(7n, READY_SALT))
})

// ---- TrafficPhases

void test('TrafficPhases has its ports, and a limit wide enough for every record', () => {
  const p = new TrafficPhases({ recordsPerPhase: 20, timeout: 400 })
  assert.equal(p.countWidth, 7) // 6 phases of 20 records: 120 needs 7 bits
  assert.deepEqual(ports(p), [
    'input clk[1]', 'input rst_b[1]', 'input drained[1]',
    'output valid_rate[9]', 'output ready_rate[9]', 'output limit[7]', 'output full_rate[1]', 'output done[1]', 'output stuck[1]'
  ])
})

void test('a table with no full-rate phase has no full_rate', () => {
  assert.ok(!ports(new TrafficPhases({ phases: [{ name: 'r', validRate: 9, readyRate: 9 }], recordsPerPhase: 2, timeout: 9 })).includes('output full_rate[1]'))
})

void test('STANDARD_PHASES starts and ends at full rate', () => {
  assert.equal(STANDARD_PHASES[0]?.fullRate, true)
  assert.equal(STANDARD_PHASES[STANDARD_PHASES.length - 1]?.fullRate, true)
})

const REFUSED: Array<[string, () => unknown, RegExp]> = [
  ['LFSR fields wider than the Lfsr', () => injector({ lfsr: { fields: ['data', 'src'], width: 32, seed: 1n } }), /inj: the lfsr fields are 34 bits, more than a 32-bit Lfsr gives/],
  ['an LFSR field the record lacks', () => injector({ lfsr: { fields: ['payload'], seed: 1n } }), /inj: lfsr names payload, which is not a field of the record/],
  ['a field named seed, with lfsr', () => injector({ fields: [{ name: 'seed', width: 4 }, ...FIELDS], lfsr: LFSR }), /no field may have that name/],
  ['an injector field named like a port', () => injector({ fields: [{ name: 'ready', width: 1 }] }), /inj: field ready has the name of one of the injector's own signals/],
  ['a preloaded injector with more records than depth', () => injector({ records: 9 }), /inj: a preloaded injector needs records, 1 to depth 8, got 9/],
  ['a reloaded injector with records', () => injector({ memory: 'reloaded', file: undefined }), /reads its record count on records, not from a parameter/],
  ['a limit wider than a record count', () => injector({ limitWidth: 5 }), /inj: limitWidth must be 1 to 4/],
  ['a perSource sourceField the record lacks', () => checker({ mode: 'perSource', sourceField: 'id', sources: 2, files: ['a', 'b'], records: [1, 1] } as Partial<RecordChecker_Parameters>), /chk: sourceField id is not a field of the record/],
  ['more sources than the source field names', () => checker({ mode: 'perSource', sourceField: 'src', sources: 5, files: [], records: [] } as Partial<RecordChecker_Parameters>), /chk: a 2-bit src can't name 5 sources/],
  ['a file count that isn\'t one per source', () => checker({ mode: 'perSource', sourceField: 'src', sources: 2, files: ['a'], records: [1] } as Partial<RecordChecker_Parameters>), /needs a file and a record count per source/],
  ['the source field as an LFSR field', () => checker({ mode: 'perSource', sourceField: 'data', sources: 2, files: ['a', 'b'], records: [1, 1], lfsr: LFSR } as Partial<RecordChecker_Parameters>), /the source field data can't be an LFSR payload field/],
  ['a tie count too narrow for the checker\'s count', () => checker({ tie: { peers: 2, countWidth: 3 } }), /chk: tie.countWidth must hold this checker's count, 4 bits, got 3/],
  ['a tied checker field named after_count', () => checker({ fields: [{ name: 'after_count', width: 4 }], tie: { peers: 2, countWidth: 4 } }), /can't have a field named after_count/],
  ['a Throttle seed of 0', () => new Throttle({ seed: 0n }), /Throttle: seed must be a non-zero 32-bit value, got 0/],
  ['a Throttle seed wider than 32 bits', () => new Throttle({ seed: 1n << 32n }), /Throttle: seed must be a non-zero 32-bit value/],
  ['a rate over 256', () => new TrafficPhases({ phases: [{ name: 'p', validRate: 257, readyRate: 1 }], recordsPerPhase: 1, timeout: 9 }), /phase p has rate 257; a rate is 0 to 256/],
  ['no phases', () => new TrafficPhases({ phases: [], recordsPerPhase: 1, timeout: 9 }), /TrafficPhases: phases is empty/],
  ['0 records per phase', () => new TrafficPhases({ recordsPerPhase: 0, timeout: 9 }), /recordsPerPhase must be a positive integer, got 0/],
  ['a timeout of 0', () => new TrafficPhases({ recordsPerPhase: 1, timeout: 0 }), /timeout must be a positive integer, got 0/]
]
for (const [what, f, message] of REFUSED) {
  void test(`${what} is refused`, () => { assert.throws(f, { message }) })
}

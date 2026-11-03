/**
 * Checks of the record-stream components of tier 1 (doc/framework/testbench.md, "Record streams")
 * that need no simulation: Throttle and TrafficPhases. The example testbenches in
 * test_tbExamples.ts simulate them.
 *
 * The checks read only the TSSV object model, never the generated SV (doc/framework/testbench.md,
 * "What TS-side tests may check"):
 *
 *   - each component has the ports its options select, and no others;
 *   - derived values, such as TrafficPhases' countWidth and drawSeed's seeds, are as documented;
 *   - bad parameters are refused.
 */
import { type Module } from 'tssv/lib/core/TSSV'
import { Throttle, drawSeed, READY_SALT, VALID_SALT } from 'tssv/lib/tb/Throttle'
import { TrafficPhases, STANDARD_PHASES } from 'tssv/lib/tb/TrafficPhases'
import { test } from 'node:test'
import assert from 'node:assert/strict'

/** A module's ports, as `<direction> <name>[<width>]` in declaration order */
function ports (m: Module): string[] {
  const IOs = (m as unknown as { IOs: Record<string, { direction: string, width?: number }> }).IOs
  return Object.entries(IOs).map(([name, io]) => `${io.direction} ${name}[${io.width ?? 1}]`)
}

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

void test('STANDARD_PHASES starts and ends at full rate', () => {
  assert.equal(STANDARD_PHASES[0]?.fullRate, true)
  assert.equal(STANDARD_PHASES[STANDARD_PHASES.length - 1]?.fullRate, true)
})

const REFUSED: Array<[string, () => unknown, RegExp]> = [
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

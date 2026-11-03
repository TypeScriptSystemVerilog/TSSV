/**
 * Checks of Lfsr (ts/src/tb/Lfsr.ts) and its TypeScript model (ts/src/tb/xorshift.ts) that need no
 * simulation. tb_Lfsr (test_tbExamples.ts) checks the RTL against the model, cycle by cycle.
 *
 * The checks read only the TSSV object model, never the generated SV (doc/framework/testbench.md,
 * "What TS-side tests may check"):
 *
 *   - the model gives the values in Marsaglia's paper, so it doesn't merely agree with the RTL;
 *   - a loadable Lfsr adds load and seed_in, a whole state wide, and is a module of its own;
 *   - an Lfsr that leaves loadable out, and one that passes false, are the same module, with the
 *     name an Lfsr had before the option existed;
 *   - bad parameters are refused.
 */
import { type Module } from 'tssv/lib/core/TSSV'
import { Lfsr } from 'tssv/lib/tb/Lfsr'
import { xorshift } from 'tssv/lib/tb/xorshift'
import { test } from 'node:test'
import assert from 'node:assert/strict'

/** A module's ports, as `<direction> <name>[<width>]` in declaration order */
function ports (m: Module): string[] {
  const IOs = (m as unknown as { IOs: Record<string, { direction: string, width?: number }> }).IOs
  return Object.entries(IOs).map(([name, io]) => `${io.direction} ${name}[${io.width ?? 1}]`)
}

// Marsaglia, "Xorshift RNGs" (2003), §3 and §4: xor32 from y = 2463534242 and xor64 from
// x = 88172645463325252. The paper's functions return the state after one step, the model's
// second value.
void test('the model gives the first value of the paper\'s xor32 and xor64', () => {
  assert.equal(xorshift(32, 2463534242n, 32, 2)[1], 723471715n)
  assert.equal(xorshift(64, 88172645463325252n, 64, 2)[1], 8748534153485358512n)
})

void test('the model cuts each value to its low outWidth bits', () => {
  const full = xorshift(32, 0xdeadbeefn, 32, 4)
  assert.deepEqual(xorshift(32, 0xdeadbeefn, 8, 4), full.map(v => v & 0xffn))
})

void test('an Lfsr has clk, rst_b, step and value', () => {
  assert.deepEqual(ports(new Lfsr({ width: 32, seed: 1n, outWidth: 8 })),
    ['input clk[1]', 'input rst_b[1]', 'input step[1]', 'output value[8]'])
})

void test('a loadable Lfsr adds load and seed_in, a whole state wide', () => {
  assert.deepEqual(ports(new Lfsr({ width: 64, seed: 1n, outWidth: 16, loadable: true })),
    ['input clk[1]', 'input rst_b[1]', 'input step[1]', 'input load[1]', 'input seed_in[64]', 'output value[16]'])
})

void test('loadable false and loadable left out make the same module, and loadable true another', () => {
  const plain = new Lfsr({ width: 64, seed: 0x0123456789abcdefn, outWidth: 64 })
  assert.equal(plain.name, 'Lfsr_64_81985529216486895_64')
  assert.equal(new Lfsr({ width: 64, seed: 0x0123456789abcdefn, outWidth: 64, loadable: false }).name, plain.name)
  assert.notEqual(new Lfsr({ width: 64, seed: 0x0123456789abcdefn, outWidth: 64, loadable: true }).name, plain.name)
})

const REFUSED: Array<[string, () => unknown, RegExp]> = [
  ['a seed of 0', () => new Lfsr({ width: 32, seed: 0n }), /seed must be a non-zero 32-bit value, got 0/],
  ['a seed wider than the state', () => new Lfsr({ width: 32, seed: 1n << 32n }), /seed must be a non-zero 32-bit value/],
  ['an outWidth wider than the state', () => new Lfsr({ width: 32, seed: 1n, outWidth: 33 }), /outWidth must be 1 to 32, got 33/]
]
for (const [what, f, message] of REFUSED) {
  void test(`${what} is refused`, () => { assert.throws(f, { message }) })
}

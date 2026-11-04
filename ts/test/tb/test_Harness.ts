/**
 * Checks of a harness's clock domains (doc/framework/testbench.md, "Clock domains") that need no
 * simulation. tb_AFIFOStream_two_domains in test_tbExamples.ts simulates a harness with two.
 *
 * The checks read only the TSSV object model, never the generated SV (doc/framework/testbench.md,
 * "What TS-side tests may check"):
 *
 *   - a harness without domains has `clk` and `rst_b`, and one with domains a pair per domain;
 *   - the report domain is the one named, or the only one;
 *   - bad domain declarations are refused.
 */
import { type Module } from 'tssv/lib/core/TSSV'
import { Harness, type Harness_Parameters } from 'tssv/lib/tb/Harness'
import { test } from 'node:test'
import assert from 'node:assert/strict'

/** A module's ports, as `<direction> <name>` in declaration order */
function ports (m: Module): string[] {
  const IOs = (m as unknown as { IOs: Record<string, { direction: string }> }).IOs
  return Object.entries(IOs).map(([name, io]) => `${io.direction} ${name}`)
}

void test('a harness without domains has clk and rst_b, and no report domain', () => {
  const h = new Harness({ name: 'one' })
  assert.deepEqual(ports(h), ['input clk', 'input rst_b', 'output done', 'output fail'])
  assert.deepEqual(h.domains, [])
  assert.equal(h.reportDomain, undefined)
})

void test('a harness with domains has clk_<d> and rst_b_<d> for each, in the order declared', () => {
  const h = new Harness({ name: 'two', domains: [{ name: 'wr', period: 10, releaseAfter: 'rd' }, { name: 'rd', period: 14, phase: 3 }], reportDomain: 'rd' })
  assert.deepEqual(ports(h), ['input clk_wr', 'input rst_b_wr', 'input clk_rd', 'input rst_b_rd', 'output done', 'output fail'])
  assert.equal(h.reportDomain, 'rd')
})

void test('a harness with one domain reports in it without naming it', () => {
  assert.equal(new Harness({ name: 'solo', domains: [{ name: 'core', period: 8 }] }).reportDomain, 'core')
})

void test('bad domain declarations are refused', () => {
  const refused: Array<[Harness_Parameters, RegExp]> = [
    [{ name: 'h', reportDomain: 'a' }, /reportDomain is a, but the harness has no domains/],
    [{ name: 'h', domains: [{ name: 'Wr', period: 10 }] }, /domain name 'Wr' isn't lower snake_case/],
    [{ name: 'h', domains: [{ name: 'a', period: 10 }, { name: 'a', period: 12 }], reportDomain: 'a' }, /two domains are named a/],
    [{ name: 'h', domains: [{ name: 'a', period: 7 }] }, /domain a's period must be an even integer, at least 2, got 7/],
    [{ name: 'h', domains: [{ name: 'a', period: 0 }] }, /domain a's period must be an even integer, at least 2, got 0/],
    [{ name: 'h', domains: [{ name: 'a', period: 10, phase: -1 }] }, /domain a's phase must be an integer, at least 0, got -1/],
    [{ name: 'h', domains: [{ name: 'a', period: 10, releaseAfter: 'b' }] }, /domain a is released after b, which isn't a domain/],
    [{ name: 'h', domains: [{ name: 'a', period: 10, releaseAfter: 'a' }] }, /domain a's releaseAfter leads back to itself/],
    [{ name: 'h', domains: [{ name: 'a', period: 10, releaseAfter: 'b' }, { name: 'b', period: 10, releaseAfter: 'a' }], reportDomain: 'a' }, /domain a's releaseAfter leads back to itself/],
    [{ name: 'h', domains: [{ name: 'a', period: 10 }, { name: 'b', period: 10 }] }, /a harness with 2 domains needs a reportDomain/],
    [{ name: 'h', domains: [{ name: 'a', period: 10 }, { name: 'b', period: 10 }], reportDomain: 'c' }, /reportDomain c isn't a domain/]
  ]
  for (const [params, message] of refused) assert.throws(() => new Harness(params), message)
})

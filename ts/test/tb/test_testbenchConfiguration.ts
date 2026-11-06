/**
 * Tests (node:test) of the DUT configuration file (ts/src/tb/testbenchConfiguration.ts), against
 * its schema in doc/framework/testbench.md (TSSV#200):
 *
 *   - writeConfiguration writes the keys in the schema's order, and readConfiguration reads back
 *     what it wrote, with and without resetCycles;
 *   - a parameter wider than 53 bits travels as a "0x…" string;
 *   - each refusal: a missing or unknown key, a name that isn't snake_case or doesn't match the
 *     file, parameters that aren't an object or hold a number that isn't a safe integer, a depth
 *     below 2, a maxCycles or resetCycles below 1.
 */
import { parseConfiguration, readConfiguration, writeConfiguration, type TestbenchConfiguration } from 'tssv/lib/tb/testbenchConfiguration'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const OUT = 'sv-examples/tb/testbenchConfiguration'
rmSync(OUT, { recursive: true, force: true })

const stages2: TestbenchConfiguration = {
  configuration: 'stages2',
  parameters: { stages: 2 },
  depths: { 'h.inj_s_in.pattern': 48, 'h.chk_m_out.pattern': 48 },
  maxCycles: 2000
}

void test('writeConfiguration writes the schema\'s keys in order; readConfiguration reads them back', () => {
  // Keys given out of order are written in the schema's order
  const { maxCycles, depths, parameters, configuration } = stages2
  writeConfiguration(`${OUT}/stages2.json`, { maxCycles, depths, parameters, configuration })
  assert.equal(readFileSync(`${OUT}/stages2.json`, 'utf8'), `{
  "configuration": "stages2",
  "parameters": {
    "stages": 2
  },
  "depths": {
    "h.inj_s_in.pattern": 48,
    "h.chk_m_out.pattern": 48
  },
  "maxCycles": 2000
}
`)
  assert.deepEqual(readConfiguration(`${OUT}/stages2.json`), stages2)
})

void test('resetCycles is optional, and reads back when given', () => {
  const config = { ...stages2, configuration: 'long_reset', resetCycles: 10 }
  writeConfiguration(`${OUT}/long_reset.json`, config)
  assert.deepEqual(readConfiguration(`${OUT}/long_reset.json`), config)
})

void test('a parameter wider than 53 bits is a "0x…" string, and parameters may nest', () => {
  const config = { ...stages2, configuration: 'seeded', parameters: { seed: '0x2545F4914F6CDD1D', lanes: [1, 2], mode: { skid: true, name: null } } }
  writeConfiguration(`${OUT}/seeded.json`, config)
  assert.deepEqual(readConfiguration(`${OUT}/seeded.json`), config)
})

void test('a file not named after its configuration is refused, reading and writing', () => {
  assert.throws(() => { writeConfiguration(`${OUT}/other.json`, stages2) }, { message: `${OUT}/other.json: holds configuration stages2, so it must be named stages2.json` })
  mkdirSync(OUT, { recursive: true })
  writeFileSync(`${OUT}/renamed.json`, readFileSync(`${OUT}/stages2.json`))
  assert.throws(() => readConfiguration(`${OUT}/renamed.json`), { message: `${OUT}/renamed.json: holds configuration stages2, so it must be named stages2.json` })
})

void test('readConfiguration names the file in a JSON syntax error', () => {
  mkdirSync(OUT, { recursive: true })
  writeFileSync(`${OUT}/broken.json`, '{ "configuration": ')
  assert.throws(() => readConfiguration(`${OUT}/broken.json`), (e: Error) => e.message.startsWith(`${OUT}/broken.json: `))
})

const refusals: Array<[string, unknown, string]> = [
  ['a configuration that isn\'t an object', [stages2], 'c.json: a configuration is a JSON object'],
  ['a missing key', { configuration: 'stages2', parameters: {}, depths: {} }, 'c.json: has no maxCycles'],
  ['an unknown key', { ...stages2, dut: 'StreamSlice' }, 'c.json: has dut, which isn\'t one of configuration, parameters, depths, maxCycles, resetCycles'],
  ['a name that isn\'t snake_case', { ...stages2, configuration: 'Stages2' }, 'c.json: configuration "Stages2" isn\'t a lower snake_case name'],
  ['parameters that aren\'t an object', { ...stages2, parameters: [2] }, 'c.json: parameters must be an object'],
  ['a fractional parameter', { ...stages2, parameters: { stages: 2.5 } }, 'c.json: parameters.stages: 2.5 isn\'t a safe integer; write a wider value as a "0x…" string'],
  ['an unsafe integer parameter, even nested', { ...stages2, parameters: { seeds: [1, 2 ** 60] } }, `c.json: parameters.seeds[1]: ${2 ** 60} isn't a safe integer; write a wider value as a "0x…" string`],
  ['depths that aren\'t an object', { ...stages2, depths: [48] }, 'c.json: depths must be an object of memory paths and depths'],
  ['an empty memory path', { ...stages2, depths: { '': 48 } }, 'c.json: depths has an empty memory path'],
  ['a depth below 2', { ...stages2, depths: { 'h.inj_s_in.pattern': 1 } }, 'c.json: depths.h.inj_s_in.pattern must be an integer, at least 2, got 1'],
  ['a depth as a string', { ...stages2, depths: { 'h.inj_s_in.pattern': '48' } }, 'c.json: depths.h.inj_s_in.pattern must be an integer, at least 2, got "48"'],
  ['a maxCycles of 0', { ...stages2, maxCycles: 0 }, 'c.json: maxCycles must be an integer, at least 1, got 0'],
  ['a fractional maxCycles', { ...stages2, maxCycles: 99.5 }, 'c.json: maxCycles must be an integer, at least 1, got 99.5'],
  ['a resetCycles of 0', { ...stages2, resetCycles: 0 }, 'c.json: resetCycles must be an integer, at least 1, got 0']
]
for (const [what, json, message] of refusals) {
  void test(`parseConfiguration refuses ${what}`, () => {
    assert.throws(() => parseConfiguration(json, 'c.json'), { message })
  })
}

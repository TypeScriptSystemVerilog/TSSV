/**
 * Checks of a harness's clock domains (doc/framework/testbench.md, "Clock domains") and of its
 * pattern memories and load port (TSSV#200) that need no simulation. tb_AFIFOStream_two_domains
 * in test_tbExamples.ts simulates a harness with two domains; the LoadBus testbench
 * (test_loadBusTB.ts) simulates loading.
 *
 * The checks read only the TSSV object model, never the generated SV (doc/framework/testbench.md,
 * "What TS-side tests may check"):
 *
 *   - a harness without domains has `clk` and `rst_b`, and one with domains a pair per domain;
 *   - the report domain is the one named, or the only one;
 *   - bad domain declarations are refused;
 *   - registered memories get paths from the harness, load_sel values in order, and packed
 *     record counts; a preloaded harness's ports don't change;
 *   - a reloaded harness gets a load port as wide as its deepest and widest memories need, and a
 *     load net per component port;
 *   - each memory loads in its component's domain;
 *   - bad registrations are refused.
 */
import TSSV, { type Module } from 'tssv/lib/core/TSSV'
import { Harness, type Harness_Parameters } from 'tssv/lib/tb/Harness'
import { type ComponentMemory, type PatternMemoryMode } from 'tssv/lib/tb/PatternMemory'
import { RecordInjector } from 'tssv/lib/tb/RecordInjector'
import { RecordChecker } from 'tssv/lib/tb/RecordChecker'
import { recordLayout } from 'tssv/lib/tb/patternRecord'
import { VectorPlayer } from 'tssv/lib/tb/VectorPlayer'
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

// ---- Pattern memories and the load port

type Component = Module & { readonly memories: readonly ComponentMemory[] }

/** A component to register: its instance, its domain, and how it is added to the harness */
interface Part {
  instance: string
  component: Component
  domain?: string
  /** What its clk is bound to. Default: its domain's clock */
  clk?: string
  /** Registered, but never added as a submodule */
  notAdded?: boolean
}

/** A harness that registers each part and adds it as a submodule, with one check */
class PartsHarness extends Harness {
  constructor (params: Harness_Parameters & { parts: Part[], late?: Part }) {
    super(params)
    for (const p of params.parts) {
      const bindings = this.registerMemories(p.instance, p.component, { domain: p.domain })
      const domain = p.domain ?? params.domains?.[0]?.name
      const clk = p.clk ?? (domain === undefined ? 'clk' : `clk_${domain}`)
      if (p.notAdded !== true) this.addSubmodule(p.instance, p.component, { clk, ...bindings }, false)
    }
    this.check('order', 'records arrive in order')
    this.finish()
    if (params.late !== undefined) this.registerMemories(params.late.instance, params.late.component)
  }
}

const SLICE = [{ name: 'last', width: 1 }, { name: 'data', width: 40 }]
const SOURCED = [{ name: 'src', width: 2 }, { name: 'last', width: 1 }, { name: 'data', width: 32 }]
const inj = (memory: PatternMemoryMode, name = 'h_inj'): RecordInjector =>
  new RecordInjector({ name, fields: SLICE, depth: 8, memory, ...(memory === 'preloaded' ? { file: 'patterns/stimulus.hex', records: 5 } : {}) })
const chk = (memory: PatternMemoryMode): RecordChecker =>
  new RecordChecker({ name: 'h_chk', mode: 'perSource', fields: SOURCED, sourceField: 'src', sources: 3, depth: 20, memory, ...(memory === 'preloaded' ? { files: ['e0.hex', 'e1.hex', 'e2.hex'], records: [4, 0, 20] } : {}) })

/** A net's width in the harness */
const width = (h: Harness, net: string): number | undefined =>
  (h as unknown as { signals: Record<string, { width?: number } | undefined> }).signals[net]?.width

void test('preloaded memories are recorded with their paths, selects and packed counts, and the ports don\'t change', () => {
  const h = new PartsHarness({ name: 'pre', parts: [{ instance: 'inj_s', component: inj('preloaded') }, { instance: 'chk_m', component: chk('preloaded') }] })
  assert.deepEqual(ports(h), ['input clk', 'input rst_b', 'output done', 'output fail'])
  assert.equal(h.mode, 'preloaded')
  assert.equal(h.loadPort, undefined)
  assert.deepEqual(h.memories.map(m => [m.path, m.instance, m.select, m.recordsLo, m.recordsWidth, m.file, m.records]), [
    ['inj_s.pattern', 'inj_s', 0, 0, 4, 'patterns/stimulus.hex', 5],
    ['chk_m.pattern_0', 'chk_m', 1, 4, 5, 'e0.hex', 4],
    ['chk_m.pattern_1', 'chk_m', 2, 9, 5, 'e1.hex', 0],
    ['chk_m.pattern_2', 'chk_m', 3, 14, 5, 'e2.hex', 20]
  ])
})

void test('a harness without registered memories has no mode and no load port', () => {
  const h = new PartsHarness({ name: 'none', parts: [] })
  assert.equal(h.mode, undefined)
  assert.equal(h.loadPort, undefined)
  assert.deepEqual(h.memories, [])
})

void test('reloaded memories add a load port as wide as the deepest and widest memories need, before done and fail', () => {
  const h = new PartsHarness({ name: 're', parts: [{ instance: 'inj_s', component: inj('reloaded') }, { instance: 'chk_m', component: chk('reloaded') }] })
  assert.equal(h.mode, 'reloaded')
  assert.deepEqual(ports(h), ['input clk', 'input rst_b', 'input load_en', 'input load_sel', 'input load_addr', 'input load_data', 'input records', 'output done', 'output fail'])
  // 4 memories: a 2-bit select. Depth 20 needs 5 address bits; the injector's word is 4 + 40 bits;
  // the counts are 4 bits for depth 8, and 5 for each of the three of depth 20
  assert.deepEqual(h.loadPort, { selWidth: 2, addrWidth: 5, dataWidth: 44, recordsWidth: 19 })
  assert.deepEqual(h.memories.map(m => [m.path, m.select, m.recordsLo, m.recordsWidth, m.file, m.records]), [
    ['inj_s.pattern', 0, 0, 4, undefined, undefined],
    ['chk_m.pattern_0', 1, 4, 5, undefined, undefined],
    ['chk_m.pattern_1', 2, 9, 5, undefined, undefined],
    ['chk_m.pattern_2', 3, 14, 5, undefined, undefined]
  ])
})

void test('each reloaded component gets a load net per load port, at the port\'s width', () => {
  const h = new PartsHarness({ name: 're', parts: [{ instance: 'inj_s', component: inj('reloaded') }, { instance: 'chk_m', component: chk('reloaded') }] })
  const nets = ['load_en_inj_s', 'load_addr_inj_s', 'load_data_inj_s', 'records_inj_s', 'load_en_chk_m', 'load_src_chk_m', 'load_addr_chk_m', 'load_data_chk_m', 'records_chk_m']
  assert.deepEqual(nets.map(n => width(h, n)), [1, 3, 44, 4, 1, 2, 5, 36, 15])
  assert.equal(width(h, 'load_src_inj_s'), undefined)
})

void test('one reloaded memory has a 1-bit select', () => {
  assert.deepEqual(new PartsHarness({ name: 'one', parts: [{ instance: 'inj_s', component: inj('reloaded') }] }).loadPort, { selWidth: 1, addrWidth: 3, dataWidth: 44, recordsWidth: 4 })
})

void test('each memory loads in its component\'s domain; with one domain, that one', () => {
  const two = new PartsHarness({
    name: 'two',
    domains: [{ name: 'wr', period: 10 }, { name: 'rd', period: 14 }],
    reportDomain: 'rd',
    parts: [{ instance: 'inj_s', component: inj('reloaded'), domain: 'wr' }, { instance: 'chk_m', component: chk('reloaded'), domain: 'rd' }]
  })
  assert.deepEqual(two.memories.map(m => m.domain), ['wr', 'rd', 'rd', 'rd'])
  const solo = new PartsHarness({ name: 'solo', domains: [{ name: 'core', period: 8 }], parts: [{ instance: 'inj_s', component: inj('reloaded') }] })
  assert.deepEqual(solo.memories.map(m => m.domain), ['core'])
  const none = new PartsHarness({ name: 'none', parts: [{ instance: 'inj_s', component: inj('reloaded') }] })
  assert.deepEqual(none.memories.map(m => m.domain), [undefined])
})

/** A component that says it holds a reloaded memory, but has no load port */
class Portless extends TSSV.Module {
  readonly memories: ComponentMemory[] = [{ path: 'pattern', depth: 4, layout: recordLayout([{ name: 'data', width: 8 }]), mode: 'reloaded' }]
  constructor () {
    super({ name: 'portless' })
    this.IOs = { clk: { direction: 'input', isClock: 'posedge' } }
  }
}

void test('bad registrations are refused', () => {
  const two = { domains: [{ name: 'wr', period: 10 }, { name: 'rd', period: 14 }], reportDomain: 'rd' }
  const refused: Array<[string, () => Harness, string]> = [
    ['a mix of modes', () => new PartsHarness({ name: 'h', parts: [{ instance: 'inj_s', component: inj('preloaded') }, { instance: 'chk_m', component: chk('reloaded') }] }),
      'h: chk_m: its memory pattern_0 is reloaded, but the harness\'s memories are preloaded; every memory of a harness has one mode'],
    ['an instance registered twice', () => new PartsHarness({ name: 'h', parts: [{ instance: 'inj_s', component: inj('reloaded'), notAdded: true }, { instance: 'inj_s', component: inj('reloaded', 'h_inj2') }] }),
      'h: inj_s: is registered twice'],
    ['a registration after finish()', () => new PartsHarness({ name: 'h', parts: [], late: { instance: 'inj_s', component: inj('reloaded') } }),
      'h: inj_s: registerMemories() comes before finish()'],
    ['a component with no memories', () => new PartsHarness({ name: 'h', parts: [{ instance: 'play', component: new VectorPlayer({ name: 'h_play', rows: 4, lanes: [] }) }] }),
      'h: play: has no pattern memories to register'],
    ['a component that is never added', () => new PartsHarness({ name: 'h', parts: [{ instance: 'inj_s', component: inj('reloaded'), notAdded: true }] }),
      'h: inj_s is registered, but isn\'t a submodule of the harness under that name'],
    ['a component clocked by another clock', () => new PartsHarness({ name: 'h', ...two, parts: [{ instance: 'inj_s', component: inj('reloaded'), domain: 'wr', clk: 'clk_rd' }] }),
      'h: inj_s loads in clk_wr, but its clk is bound to clk_rd'],
    ['a domain in a harness without domains', () => new PartsHarness({ name: 'h', parts: [{ instance: 'inj_s', component: inj('reloaded'), domain: 'wr', clk: 'clk' }] }),
      'h: inj_s: has domain wr, but the harness has no domains'],
    ['no domain with two domains', () => new PartsHarness({ name: 'h', ...two, parts: [{ instance: 'inj_s', component: inj('reloaded'), clk: 'clk_wr' }] }),
      'h: inj_s: a harness with 2 domains needs the domain its memories load in'],
    ['a domain the harness doesn\'t have', () => new PartsHarness({ name: 'h', ...two, parts: [{ instance: 'inj_s', component: inj('reloaded'), domain: 'io' }] }),
      'h: inj_s: domain io isn\'t one of the harness\'s domains'],
    ['a reloaded component without its load port', () => new PartsHarness({ name: 'h', parts: [{ instance: 'p', component: new Portless() }] }),
      'h: p: a reloaded component needs input load_en of 1 bits, got none']
  ]
  for (const [what, build, message] of refused) assert.throws(build, { message }, what)
})

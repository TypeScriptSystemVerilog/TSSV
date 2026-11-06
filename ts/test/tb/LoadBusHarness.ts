// The load port's framework test (TSSV#200; doc/framework/testbench.md, "Configurations, testcases
// and the generator"): a reloaded harness whose memories differ in depth and width, sit in two
// clock domains, and include a perSource checker's, so that SimTop's loader and the harness's load
// port decode are simulated where SliceOrder doesn't reach. test_loadBusTB.ts writes its
// configuration and testcases and runs the testbench generator.
import { Expr } from 'tssv/lib/core/TSSV'
import { Harness } from 'tssv/lib/tb/Harness'
import { RecordInjector } from 'tssv/lib/tb/RecordInjector'
import { RecordChecker } from 'tssv/lib/tb/RecordChecker'
import { type PatternObject } from 'tssv/lib/tb/patternFile'
import { type PatternRecord, type RecordField } from 'tssv/lib/tb/patternRecord'
import { mixSeed } from 'tssv/lib/tb/recordStream'
import { type JsonValue } from 'tssv/lib/tb/testbenchConfiguration'
import { type HarnessBuild } from 'tssv/lib/tb/testbenchGenerator'
import { AFIFO } from 'tssv/lib/modules/AFIFO'
import { CDCSynchronizer } from 'tssv/lib/modules/CDCSynchronizer'

/** A LoadBus record: the source it belongs to, 0 to 2, and 12 bits of data */
export const LOAD_BUS_FIELDS: RecordField[] = [{ name: 'src', width: 2 }, { name: 'data', width: 12 }]
/** The checker's sources */
export const LOAD_BUS_SOURCES = 3

/** Checks a LoadBus configuration's parameters, for the testbench generator: it has none. */
export function loadBusParameters (raw: Record<string, JsonValue>, where: string): Record<string, never> {
  const key = Object.keys(raw)[0]
  if (key !== undefined) throw Error(`${where}: parameters has ${key}; a LoadBus configuration has none`)
  return {}
}

/**
 * LoadBusHarness — an AFIFO of depth 4 between two clock domains, as in AFIFOStreamHarness, with
 * records from 3 sources. `inj_wr`, a RecordInjector on `clk_wr`, sends them in one stream, and
 * `chk_rd`, a perSource RecordChecker on `clk_rd`, checks each source's records in order. Check:
 * `order`.
 *
 * Its pattern memories are what the load port test needs: the injector's 16-bit words (the source
 * and the data) in `wr`, and the checker's three memories of 12-bit words (the data alone) in
 * `rd`, at their configured depths, 16 and 8 in the generator's example. So the load port's
 * address and data are as wide as the injector needs, the checker's memories have load_sel 1 to 3
 * and take load_src = load_sel - 1, and each domain loads its own memories on its own clock.
 *
 *        clk_wr                                                      clk_rd
 *   inj_wr ──{src, data}──▶ dut (AFIFO) ──{src, data}──▶ chk_rd (perSource, 3 sources) ──▶ fail_order
 *      │ done                                                  │ drained
 *      └──▶ inj_done_q ──▶ sync_inj_done (CDCSynchronizer) ──▶ AND ──▶ done
 */
export class LoadBusHarness extends Harness {
  constructor (build: HarnessBuild<Record<string, never>>) {
    super({
      name: build.name,
      domains: [{ name: 'wr', period: 10, releaseAfter: 'rd' }, { name: 'rd', period: 14, phase: 3 }],
      reportDomain: 'rd'
    })
    const inj = build.memory('h.inj_wr.pattern')
    const chk = Array.from({ length: LOAD_BUS_SOURCES }, (_, k) => build.memory(`h.chk_rd.pattern_${k}`))
    const chkDepth = chk[0]?.depth ?? 0
    if (chk.some(m => m.depth !== chkDepth)) throw Error(`${build.name}: the checker's memories share one depth, got ${chk.map(m => m.depth).join(', ')}`)
    const depthWidth = this.bitWidth(4)
    for (const s of ['wr', 'rd']) {
      this.addSignal(`${s}_valid`, { width: 1 })
      this.addSignal(`${s}_ready`, { width: 1 })
      this.addSignal(`${s}_src`, { width: 2 })
      this.addSignal(`${s}_data`, { width: 12 })
      this.addSignal(`${s}_word`, { width: 14 })
      this.addSignal(`${s}_depth`, { width: depthWidth })
    }
    this.addSignal('full', { width: 1 })
    this.addSignal('empty', { width: 1 })
    this.addSignal('inj_done', { width: 1 })
    this.addSignal('inj_done_rd', { width: 1 })
    this.addSignal('drained', { width: 1 })

    // The write domain: the injector, offering at 160/256, and the AFIFO's push side
    const injector = new RecordInjector({ name: `${build.name}_inj`, fields: LOAD_BUS_FIELDS, memory: build.mode, ...inj, throttle: { seed: 0x1357n } })
    this.addSubmodule('inj_wr', injector, {
      clk: 'clk_wr', rst_b: 'rst_b_wr', ready: 'wr_ready', valid: 'wr_valid', src: 'wr_src', data: 'wr_data', done: 'inj_done', valid_rate: 160n, ...this.registerMemories('inj_wr', injector, { domain: 'wr' })
    }, false)
    this.addAssign({ in: new Expr('{wr_src, wr_data}'), out: 'wr_word' })
    this.addAssign({ in: new Expr('!full'), out: 'wr_ready' })
    this.addSubmodule('dut', new AFIFO({ name: `${build.name}_afifo`, dataWidth: 14n, depth: 4n }), {
      wr_clk: 'clk_wr',
      wr_rst_n: 'rst_b_wr',
      push_en: 'wr_valid',
      push_data: 'wr_word',
      full: 'full',
      wr_curr_depth: 'wr_depth',
      rd_clk: 'clk_rd',
      rd_rst_n: 'rst_b_rd',
      pop_en: 'rd_ready',
      pop_data: 'rd_word',
      empty: 'empty',
      rd_curr_depth: 'rd_depth'
    }, false)

    // The read domain: the AFIFO's pop side, and the checker, ready at 112/256
    this.addAssign({ in: new Expr('!empty'), out: 'rd_valid' })
    this.addAssign({ in: new Expr('rd_word[13:12]'), out: 'rd_src' })
    this.addAssign({ in: new Expr('rd_word[11:0]'), out: 'rd_data' })
    const order = this.check('order', 'each source\'s records arrive once, in order, unchanged', RecordChecker.firstError('chk_rd', 'perSource'))
    const preloaded = build.mode === 'preloaded' ? { files: chk.map(m => m.file ?? ''), records: chk.map(m => m.records ?? 0) } : {}
    const checker = new RecordChecker({
      name: `${build.name}_chk`,
      mode: 'perSource',
      fields: LOAD_BUS_FIELDS,
      sourceField: 'src',
      sources: LOAD_BUS_SOURCES,
      depth: chkDepth,
      memory: build.mode,
      ...preloaded,
      throttle: { seed: 0x2468n }
    })
    this.addSubmodule('chk_rd', checker, {
      clk: 'clk_rd',
      rst_b: 'rst_b_rd',
      valid: 'rd_valid',
      src: 'rd_src',
      data: 'rd_data',
      ready: 'rd_ready',
      ready_rate: 112n,
      fail: order,
      drained: 'drained',
      ...this.registerMemories('chk_rd', checker, { domain: 'rd' })
    }, false)

    // The end: every record sent, as rd sees it, and every record received
    const injDone = this.addRegister({ d: 'inj_done', clk: 'clk_wr', reset: 'rst_b_wr' })
    this.addSubmodule('sync_inj_done', new CDCSynchronizer({ name: `${build.name}_sync`, width: 1n }), {
      clk: 'clk_rd',
      rst_n: 'rst_b_rd',
      d: injDone.toString(),
      q: 'inj_done_rd'
    }, false)
    this.addAssign({ in: new Expr('inj_done_rd && drained'), out: 'done' })

    // The fill counts are status this harness doesn't check. Each is read into a net that nothing
    // uses, under a waiver for that net only (SV guide LINT-3), and each stays in its own domain
    this.addBody(`
      // The fill counts are status this harness doesn't check
      /* verilator lint_off UNUSEDSIGNAL */
      logic unused_wr_depth;
      logic unused_rd_depth;
      /* verilator lint_on UNUSEDSIGNAL */
      assign unused_wr_depth = ^wr_depth;
      assign unused_rd_depth = ^rd_depth;
    `)
    this.finish()
  }
}

/**
 * A LoadBus testcase: `records` records shared out among `sources` (a list of source numbers) in
 * turn, so no source gets more than its share, then shuffled pseudo-randomly from `salt`, with
 * pseudo-random data. Returns the injector's stream, one object, and per checker source its
 * records without the source field, one object each (none for a source without records).
 */
export function loadBusTestcase (records: number, sources: number[], salt: number): { stream: PatternObject[], expected: PatternObject[][] } {
  const order = Array.from({ length: records }, (_, i) => sources[i % sources.length] ?? 0)
  // Fisher-Yates, from the end, each swap picked from salt
  for (let i = order.length - 1; i > 0; i--) {
    const j = Number(mixSeed(BigInt(salt * 1000 + i)) % BigInt(i + 1))
    const swap = order[i] ?? 0
    order[i] = order[j] ?? 0
    order[j] = swap
  }
  const all: PatternRecord[] = order.map((src, i) => ({ src: BigInt(src), data: mixSeed(BigInt(salt * 1000 + 500 + i), 32) & 0xfffn }))
  const expected = Array.from({ length: LOAD_BUS_SOURCES }, (_, k) => {
    const own = all.filter(r => r.src === BigInt(k)).map(({ src: _src, ...rest }) => rest)
    return own.length === 0 ? [] : [{ label: `source ${k}`, records: own }]
  })
  return { stream: [{ label: 'sources interleaved', records: all }], expected }
}

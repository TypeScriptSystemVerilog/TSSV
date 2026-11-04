// The two-domain example (doc/framework/testbench.md, "Clock domains"): an AFIFO between a
// RecordInjector in its write domain and a RecordChecker in its read domain, and the generator
// that writes its testcase. test_tbExamples.ts writes the pattern files and the testbench.
import { Expr } from 'tssv/lib/core/TSSV'
import { Harness } from 'tssv/lib/tb/Harness'
import { RecordInjector } from 'tssv/lib/tb/RecordInjector'
import { RecordChecker } from 'tssv/lib/tb/RecordChecker'
import { type PatternObject } from 'tssv/lib/tb/patternFile'
import { type RecordField } from 'tssv/lib/tb/patternRecord'
import { mixSeed } from 'tssv/lib/tb/recordStream'
import { AFIFO } from 'tssv/lib/modules/AFIFO'
import { CDCSynchronizer } from 'tssv/lib/modules/CDCSynchronizer'
import { packets } from './RecordStreamHarness.js'

/** The AFIFO example's record: a packet's `last` record, and 16 bits of data */
export const AFIFO_FIELDS: RecordField[] = [{ name: 'last', width: 1 }, { name: 'data', width: 16 }]

export interface AFIFOStreamHarness_Parameters {
  name: string
  records: number
  /** The injector's and the checker's pattern files, as the SV names them. */
  stimulus: string
  expected: string
}

/**
 * AFIFOStreamHarness — an AFIFO of depth 4 across two clock domains. `inj_wr`, a RecordInjector
 * on `clk_wr` (period 10), pushes records into it, and `chk_rd`, an inOrder RecordChecker on
 * `clk_rd` (period 14, phase 3), pops them. Each end runs at its own random rate, and the write
 * clock is the faster, so the FIFO both fills and runs empty. The AFIFO must carry every record
 * once, in order, unchanged. Check: `order`.
 *
 * `wr` is released after `rd`, because the AFIFO must see no push until both its resets are
 * released (AFIFO-spec.md, "Reset behavior"). `rd` is the report domain. The injector's `done` is
 * in `wr`, so it is registered there and crosses into `rd` through a CDCSynchronizer (SV guide
 * SYN-3) before it joins `done`.
 *
 *        clk_wr                                                     clk_rd
 *   inj_wr ──{last, data}──▶ dut (AFIFO) ──{last, data}──▶ chk_rd ──▶ fail_order
 *      │ done                                                  │ drained
 *      └──▶ inj_done_q ──▶ sync_inj_done (CDCSynchronizer) ──▶ AND ──▶ done
 */
export class AFIFOStreamHarness extends Harness {
  constructor (params: AFIFOStreamHarness_Parameters) {
    super({
      name: params.name,
      domains: [{ name: 'wr', period: 10, releaseAfter: 'rd' }, { name: 'rd', period: 14, phase: 3 }],
      reportDomain: 'rd'
    })
    const n = params.records
    // A fill count runs from 0 to the depth, 4
    const depthWidth = this.bitWidth(4)
    for (const s of ['wr', 'rd']) {
      this.addSignal(`${s}_valid`, { width: 1 })
      this.addSignal(`${s}_ready`, { width: 1 })
      this.addSignal(`${s}_last`, { width: 1 })
      this.addSignal(`${s}_data`, { width: 16 })
      this.addSignal(`${s}_word`, { width: 17 })
      this.addSignal(`${s}_depth`, { width: depthWidth })
    }
    this.addSignal('full', { width: 1 })
    this.addSignal('empty', { width: 1 })
    this.addSignal('inj_done', { width: 1 })
    this.addSignal('inj_done_rd', { width: 1 })
    this.addSignal('drained', { width: 1 })

    // The write domain: the injector, offering at 160/256, and the AFIFO's push side
    this.addSubmodule('inj_wr', new RecordInjector({
      name: `${params.name}_inj`, fields: AFIFO_FIELDS, depth: n, memory: 'preloaded', file: params.stimulus, records: n, throttle: { seed: 0x1357n }
    }), { clk: 'clk_wr', rst_b: 'rst_b_wr', ready: 'wr_ready', valid: 'wr_valid', last: 'wr_last', data: 'wr_data', done: 'inj_done', valid_rate: 160n }, false)
    this.addAssign({ in: new Expr('{wr_last, wr_data}'), out: 'wr_word' })
    this.addAssign({ in: new Expr('!full'), out: 'wr_ready' })
    this.addSubmodule('dut', new AFIFO({ name: `${params.name}_afifo`, dataWidth: 17n, depth: 4n }), {
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
    this.addAssign({ in: new Expr('rd_word[16]'), out: 'rd_last' })
    this.addAssign({ in: new Expr('rd_word[15:0]'), out: 'rd_data' })
    const order = this.check('order', 'the AFIFO carries every record once, in order, unchanged', RecordChecker.firstError('chk_rd'))
    this.addSubmodule('chk_rd', new RecordChecker({
      name: `${params.name}_chk`, mode: 'inOrder', fields: AFIFO_FIELDS, depth: n, memory: 'preloaded', file: params.expected, records: n, throttle: { seed: 0x2468n }
    }), {
      clk: 'clk_rd',
      rst_b: 'rst_b_rd',
      valid: 'rd_valid',
      last: 'rd_last',
      data: 'rd_data',
      ready: 'rd_ready',
      ready_rate: 112n,
      fail: order,
      drained: 'drained'
    }, false)

    // The end: every record sent, as rd sees it, and every record received
    const injDone = this.addRegister({ d: 'inj_done', clk: 'clk_wr', reset: 'rst_b_wr' })
    this.addSubmodule('sync_inj_done', new CDCSynchronizer({ name: `${params.name}_sync`, width: 1n }), {
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

/** The AFIFO example's records, in packets of 1 to 4, with pseudo-random data */
export const afifoTestcase = (records: number): PatternObject[] =>
  packets(records, 20, (p, i, last) => ({ last: last ? 1n : 0n, data: mixSeed(BigInt(p * 16 + i), 32) & 0xffffn }))

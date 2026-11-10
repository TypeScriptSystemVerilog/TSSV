// The record-stream examples (doc/framework/testbench.md, "Record streams"): harnesses that drive
// a small DUT (streamDuts.ts) with RecordInjectors and check it with RecordCheckers, in each of
// the checker's modes, and the generators that write their testcases. test_tbExamples.ts writes
// the pattern files and the testbenches, except SliceOrder's, which test_SliceOrderTB.ts builds
// with the testbench generator (TSSV#200).
//
//   - SliceOrderHarness: an injector, a StreamSlice and an inOrder checker. The records carry
//     seeds for LFSR payloads, and TrafficPhases throttles both ends. Built by the testbench
//     generator, in either mode, from a configuration (the slice's stages) and a testcase.
//   - SliceCycleHarness: an injector, a StreamSlice and a cycleExact checker, whose table stalls
//     the slice's output.
//   - MergeSourcesHarness: two injectors, a StreamMerge and a perSource checker.
//   - SplitTiedHarness: an injector, a StreamSplit and two inOrder checkers, tied so that the
//     input order is checked across the outputs.
import { Expr } from 'tssv/lib/core/TSSV'
import { Harness } from 'tssv/lib/tb/Harness'
import { type HarnessBuild } from 'tssv/lib/tb/testbenchGenerator'
import { type JsonValue } from 'tssv/lib/tb/testbenchConfiguration'
import { RecordInjector } from 'tssv/lib/tb/RecordInjector'
import { RecordChecker, type CycleRow } from 'tssv/lib/tb/RecordChecker'
import { STANDARD_PHASES, TrafficPhases } from 'tssv/lib/tb/TrafficPhases'
import { type PatternObject } from 'tssv/lib/tb/patternFile'
import { type PatternRecord, type RecordField } from 'tssv/lib/tb/patternRecord'
import { lfsrPayloads, mixSeed, type RecordLfsr } from 'tssv/lib/tb/recordStream'
import { StreamMerge, StreamSlice, StreamSplit } from './streamDuts.js'

// ---- Generators

/** A pseudo-random integer 0 to n - 1 from `k`, the same in every run */
const pick = (k: number, n: number): number => Number(mixSeed(BigInt(k)) % BigInt(n))

/**
 * `records` records split into packets of 1 to 4, each record made by `make(packet, i, last)` for
 * the i-th record of its packet, and each packet labelled `label`. `salt` varies the lengths
 * between streams.
 */
export function packets (records: number, salt: number, make: (packet: number, i: number, last: boolean) => PatternRecord, label?: string): PatternObject[] {
  const objects: PatternObject[] = []
  for (let sent = 0, p = 0; sent < records; p++) {
    const len = Math.min(1 + pick(salt * 1000 + p, 4), records - sent)
    objects.push({ label, records: Array.from({ length: len }, (_, i) => make(p, i, i === len - 1)) })
    sent += len
  }
  return objects
}

/**
 * Packets whose payloads come from seeds for `lfsr`: the first record of a packet has its seed,
 * the rest 0
 */
export const seededPackets = (records: number, salt: number, lfsr: RecordLfsr, fields: (last: boolean) => PatternRecord, label?: string): PatternObject[] =>
  packets(records, salt, (p, i, last) => ({ ...fields(last), seed: i === 0 ? mixSeed(BigInt(salt * 1000 + p), lfsr.width) : 0n }), label)

/** Every record of `objects`, in order */
export const recordsOf = (objects: PatternObject[]): PatternRecord[] => objects.flatMap(o => o.records)

// ---- SliceOrderHarness

/** A slice example's record: a packet's `last` record, and 32 bits of data */
export const SLICE_FIELDS: RecordField[] = [{ name: 'last', width: 1 }, { name: 'data', width: 32 }]

/** The slice examples' LFSR payloads: an LFSR fills `data` from each record's seed */
export const SLICE_LFSR: RecordLfsr = { fields: ['data'], seed: 0x5eed5eed5eed5eedn }

/** A SliceOrder configuration's parameters: the slice's register stages. */
export interface SliceOrderParameters {
  stages: number
}

/** Checks a SliceOrder configuration's parameters, for the testbench generator. */
export function sliceOrderParameters (raw: Record<string, JsonValue>, where: string): SliceOrderParameters {
  for (const key of Object.keys(raw)) {
    if (key !== 'stages') throw Error(`${where}: parameters has ${key}; a SliceOrder configuration has only stages`)
  }
  const stages = raw.stages
  if (typeof stages !== 'number' || !Number.isInteger(stages) || stages < 1) throw Error(`${where}: parameters.stages must be an integer, at least 1, got ${JSON.stringify(stages)}`)
  return { stages }
}

/**
 * SliceOrderHarness — a StreamSlice of `stages` register stages, driven by a RecordInjector,
 * `inj_s_in`, and checked by an inOrder RecordChecker, `chk_m_out`: the slice must carry every
 * record once, in order, unchanged. Checks: `order` and `progress`.
 *
 * TB spec: doc/framework/examples/StreamSlice-tb-spec.md. The testbench generator builds it from a
 * configuration (`stages`, and the two memories' depth, a multiple of 6) and a testcase (the
 * stimulus and expected files), in either mode. The records carry seeds, from which the injector's
 * and the checker's LFSRs make the data (SLICE_LFSR), and TrafficPhases runs the 6 standard phases
 * without full_rate, depth / 6 records each, at both ends. A testcase of fewer records than the
 * depth sends what it has; the last phases are short or empty.
 *
 *   inj_s_in ──{last, data}──▶ dut (StreamSlice) ──▶ chk_m_out
 *       ▲ valid_rate, limit              ready_rate, limit ▲ │ drained
 *       └────────────── phases (TrafficPhases) ────────────┘─┘
 */
export class SliceOrderHarness extends Harness {
  constructor (build: HarnessBuild<SliceOrderParameters>) {
    super({ name: build.name })
    const inj = build.memory('h.inj_s_in.pattern')
    const chk = build.memory('h.chk_m_out.pattern')
    const n = inj.depth
    if (n % 6 !== 0 || chk.depth !== n) throw Error(`${build.name}: both memories need one depth, a multiple of 6 for the phases, got ${n} and ${chk.depth}`)
    // The standard phases' rates. This harness has no check that holds only at full rate, so no
    // phase raises full_rate. A phase may take 25 cycles a record, far more than its rates need,
    // and far less than SimTop's limit, so a stuck phase fails progress, not the timeout
    const phases = new TrafficPhases({ name: `${build.name}_phases`, phases: STANDARD_PHASES.map(({ fullRate: _, ...p }) => p), recordsPerPhase: n / 6, timeout: 25 * (n / 6) })
    const throttle = { seed: 0xC0FFEEn }
    const limitWidth = phases.countWidth

    for (const s of ['s_in', 'm_out']) {
      this.addSignal(`${s}_valid`, { width: 1 })
      this.addSignal(`${s}_ready`, { width: 1 })
      this.addSignal(`${s}_last`, { width: 1 })
      this.addSignal(`${s}_data`, { width: 32 })
      this.addSignal(`${s}_word`, { width: 33 })
    }
    this.addSignal('inj_done', { width: 1 })
    this.addSignal('drained', { width: 1 })
    for (const [sig, width] of [['valid_rate', 9], ['ready_rate', 9], ['limit', phases.countWidth], ['phases_done', 1]] as const) {
      this.addSignal(sig, { width })
    }

    // The injector, the slice, and the checker
    const injector = new RecordInjector({
      name: `${build.name}_inj`, fields: SLICE_FIELDS, memory: build.mode, ...inj, lfsr: SLICE_LFSR, throttle, limitWidth
    })
    this.addSubmodule('inj_s_in', injector, {
      clk: 'clk', rst_b: 'rst_b', ready: 's_in_ready', valid: 's_in_valid', last: 's_in_last', data: 's_in_data', done: 'inj_done', valid_rate: 'valid_rate', limit: 'limit', ...this.registerMemories('inj_s_in', injector)
    }, false)
    this.addAssign({ in: new Expr('{s_in_last, s_in_data}'), out: 's_in_word' })
    this.addSubmodule('dut', new StreamSlice({ name: `${build.name}_slice`, width: 33, stages: build.config.parameters.stages }), {
      clk: 'clk',
      rst_b: 'rst_b',
      in_valid: 's_in_valid',
      in_data: 's_in_word',
      in_ready: 's_in_ready',
      out_valid: 'm_out_valid',
      out_data: 'm_out_word',
      out_ready: 'm_out_ready'
    }, false)
    this.addAssign({ in: new Expr('m_out_word[32]'), out: 'm_out_last' })
    this.addAssign({ in: new Expr('m_out_word[31:0]'), out: 'm_out_data' })
    const order = this.check('order', 'the slice carries every record once, in order, unchanged', RecordChecker.firstError('chk_m_out'))
    const checker = new RecordChecker({
      name: `${build.name}_chk`, mode: 'inOrder', fields: SLICE_FIELDS, memory: build.mode, ...chk, lfsr: SLICE_LFSR, throttle, limitWidth
    })
    this.addSubmodule('chk_m_out', checker, {
      clk: 'clk',
      rst_b: 'rst_b',
      valid: 'm_out_valid',
      last: 'm_out_last',
      data: 'm_out_data',
      ready: 'm_out_ready',
      fail: order,
      drained: 'drained',
      ready_rate: 'ready_rate',
      limit: 'limit',
      ...this.registerMemories('chk_m_out', checker)
    }, false)

    // The end: every record sent and received, and every phase drained
    const progress = this.check('progress', 'every phase drains within its timeout', TrafficPhases.stuckDetail('phases'))
    this.addSubmodule('phases', phases, {
      clk: 'clk',
      rst_b: 'rst_b',
      drained: 'drained',
      valid_rate: 'valid_rate',
      ready_rate: 'ready_rate',
      limit: 'limit',
      done: 'phases_done',
      stuck: progress
    }, false)
    this.addAssign({ in: new Expr('inj_done && phases_done'), out: 'done' })
    this.finish()
  }
}

/**
 * A slice testcase, `seeded_packets`: the same packets for the injector and the checker, since
 * the slice changes nothing. Each packet's first record carries its seed, and the rest 0.
 */
export function sliceOrderTestcase (records: number): PatternObject[] {
  return seededPackets(records, 1, SLICE_LFSR, last => ({ last: last ? 1n : 0n }))
}

/**
 * A slice testcase, `continued`: packets of other lengths, where only the first record of every
 * third packet, from packet 1, carries a seed. Every other record carries 0, so its data continues
 * the LFSR's sequence: record 0 continues from the LFSR's reset seed, and a packet without a seed
 * continues from the one before it.
 */
export function sliceContinuedTestcase (records: number): PatternObject[] {
  return packets(records, 2, (p, i, last) => ({ last: last ? 1n : 0n, seed: i === 0 && p % 3 === 1 ? mixSeed(BigInt(2000 + p), SLICE_LFSR.width) : 0n }))
}

// ---- SliceCycleHarness

export interface SliceCycleHarness_Parameters {
  name: string
  records: number
  /** Rows in the checker's table. */
  rows: number
  stimulus: string
  /** The checker's `ready` column and expected values, as the SV names them. */
  ready: string
  expected: string
}

/**
 * SliceCycleHarness — a StreamSlice of 2 stages, driven by an injector with LFSR payloads and
 * checked by a cycleExact checker. The table stalls the output now and then, and says, cycle by
 * cycle, what the slice must show: each record two cycles after it was offered, held while the
 * output stalls, then on at full rate. Checks: `valid` and `record`.
 */
export class SliceCycleHarness extends Harness {
  constructor (params: SliceCycleHarness_Parameters) {
    super({ name: params.name })
    for (const s of ['s_in', 'm_out']) {
      this.addSignal(`${s}_valid`, { width: 1 })
      this.addSignal(`${s}_ready`, { width: 1 })
      this.addSignal(`${s}_last`, { width: 1 })
      this.addSignal(`${s}_data`, { width: 32 })
      this.addSignal(`${s}_word`, { width: 33 })
    }
    this.addSignal('inj_done', { width: 1 })
    this.addSignal('table_done', { width: 1 })
    this.addSubmodule('inj_s_in', new RecordInjector({
      name: `${params.name}_inj`, fields: SLICE_FIELDS, depth: params.records, memory: 'preloaded', file: params.stimulus, records: params.records, lfsr: SLICE_LFSR
    }), { clk: 'clk', rst_b: 'rst_b', ready: 's_in_ready', valid: 's_in_valid', last: 's_in_last', data: 's_in_data', done: 'inj_done' }, false)
    this.addAssign({ in: new Expr('{s_in_last, s_in_data}'), out: 's_in_word' })
    this.addSubmodule('dut', new StreamSlice({ name: `${params.name}_slice`, width: 33 }), {
      clk: 'clk',
      rst_b: 'rst_b',
      in_valid: 's_in_valid',
      in_data: 's_in_word',
      in_ready: 's_in_ready',
      out_valid: 'm_out_valid',
      out_data: 'm_out_word',
      out_ready: 'm_out_ready'
    }, false)
    this.addAssign({ in: new Expr('m_out_word[32]'), out: 'm_out_last' })
    this.addAssign({ in: new Expr('m_out_word[31:0]'), out: 'm_out_data' })
    const valid = this.check('valid', 'm_out_valid follows the table', RecordChecker.firstCycleError('chk_m_out', 'valid'))
    const record = this.check('record', 'the record on m_out follows the table', RecordChecker.firstCycleError('chk_m_out', 'record'))
    this.addSubmodule('chk_m_out', new RecordChecker({
      name: `${params.name}_chk`, mode: 'cycleExact', fields: SLICE_FIELDS, rows: params.rows, readyFile: params.ready, file: params.expected
    }), {
      clk: 'clk',
      rst_b: 'rst_b',
      valid: 'm_out_valid',
      last: 'm_out_last',
      data: 'm_out_data',
      ready: 'm_out_ready',
      fail_valid: valid,
      fail_record: record,
      done: 'table_done'
    }, false)

    // The end: the table has run out, and every record has been sent
    this.addAssign({ in: new Expr('inj_done && table_done'), out: 'done' })
    this.finish()
  }
}

/** The rows in which the cycleExact example's checker isn't ready: stalls of 3, 1 and 2 cycles */
export const SLICE_STALLS = new Set([5, 6, 7, 12, 20, 21])

/**
 * A SliceCycleHarness's table, from the slice's timing: the injector offers record 0 in row 0 and
 * one record a cycle after, the slice shows each from row 2 on, and a record leaves in each row
 * whose `ready` is high. Its data is the LFSR payload of its seed (`lfsrPayloads()`).
 */
export function sliceCycleTable (stimulus: PatternRecord[], rows: number): CycleRow[] {
  const data = lfsrPayloads(SLICE_LFSR, 32, stimulus.map(r => r.seed ?? 0n))
  const table: CycleRow[] = []
  let next = 0
  for (let r = 0; r < rows; r++) {
    const ready = !SLICE_STALLS.has(r)
    if (r < 2 || next >= stimulus.length) {
      table.push({ ready })
      continue
    }
    table.push({ ready, record: { last: stimulus[next]?.last ?? 0n, data: data[next] ?? 0n } })
    if (ready) next++
  }
  return table
}

// ---- MergeSourcesHarness

/** A merge example's record: its source, a packet's `last` record, and 16 bits of data */
export const MERGE_FIELDS: RecordField[] = [{ name: 'src', width: 1 }, { name: 'last', width: 1 }, { name: 'data', width: 16 }]

/** The merge example's LFSR payloads: a 32-bit LFSR fills `data` */
export const MERGE_LFSR: RecordLfsr = { fields: ['data'], width: 32, seed: 0x600dcafen }

export interface MergeSourcesHarness_Parameters {
  name: string
  /** Records each source sends. */
  records: number
  /** Per source, its injector's pattern file and the checker's expected file, as the SV names them. */
  stimulus: [string, string]
  expected: [string, string]
}

/**
 * MergeSourcesHarness — a StreamMerge of two sources, `inj_a` (src 0) and `inj_b` (src 1), each
 * offering at its own random rate, checked by a perSource RecordChecker, `chk_m_out`, throttled
 * at random. The merge interleaves the sources as their rates fall, and must keep each source's
 * records in their order. Check: `order`.
 */
export class MergeSourcesHarness extends Harness {
  constructor (params: MergeSourcesHarness_Parameters) {
    super({ name: params.name })
    const n = params.records
    for (const s of ['a', 'b', 'm_out']) {
      this.addSignal(`${s}_valid`, { width: 1 })
      this.addSignal(`${s}_ready`, { width: 1 })
      this.addSignal(`${s}_src`, { width: 1 })
      this.addSignal(`${s}_last`, { width: 1 })
      this.addSignal(`${s}_data`, { width: 16 })
      this.addSignal(`${s}_word`, { width: 18 })
    }
    this.addSignal('a_done', { width: 1 })
    this.addSignal('b_done', { width: 1 })
    this.addSignal('drained', { width: 1 })

    const sources: Array<['a' | 'b', bigint, bigint]> = [['a', 0x1234n, 160n], ['b', 0x5678n, 96n]]
    sources.forEach(([s, seed, rate], k) => {
      this.addSubmodule(`inj_${s}`, new RecordInjector({
        name: `${params.name}_inj_${s}`, fields: MERGE_FIELDS, depth: n, memory: 'preloaded', file: params.stimulus[k], records: n, lfsr: MERGE_LFSR, throttle: { seed }
      }), {
        clk: 'clk',
        rst_b: 'rst_b',
        ready: `${s}_ready`,
        valid: `${s}_valid`,
        src: `${s}_src`,
        last: `${s}_last`,
        data: `${s}_data`,
        done: `${s}_done`,
        valid_rate: rate
      }, false)
      this.addAssign({ in: new Expr(`{${s}_src, ${s}_last, ${s}_data}`), out: `${s}_word` })
    })
    this.addSubmodule('dut', new StreamMerge({ name: `${params.name}_merge`, width: 18 }), {
      clk: 'clk',
      rst_b: 'rst_b',
      a_valid: 'a_valid',
      a_data: 'a_word',
      a_ready: 'a_ready',
      b_valid: 'b_valid',
      b_data: 'b_word',
      b_ready: 'b_ready',
      out_valid: 'm_out_valid',
      out_data: 'm_out_word',
      out_ready: 'm_out_ready'
    }, false)
    this.addAssign({ in: new Expr('m_out_word[17]'), out: 'm_out_src' })
    this.addAssign({ in: new Expr('m_out_word[16]'), out: 'm_out_last' })
    this.addAssign({ in: new Expr('m_out_word[15:0]'), out: 'm_out_data' })
    this.addAssign({ in: new Expr('a_done && b_done && drained'), out: 'done' })

    const order = this.check('order', 'each source\'s records arrive once, in order, unchanged', RecordChecker.firstError('chk_m_out', 'perSource'))
    this.addSubmodule('chk_m_out', new RecordChecker({
      name: `${params.name}_chk`,
      mode: 'perSource',
      fields: MERGE_FIELDS,
      sourceField: 'src',
      sources: 2,
      depth: n,
      memory: 'preloaded',
      files: params.expected,
      records: [n, n],
      lfsr: MERGE_LFSR,
      throttle: { seed: 0x9abcn }
    }), {
      clk: 'clk',
      rst_b: 'rst_b',
      valid: 'm_out_valid',
      src: 'm_out_src',
      last: 'm_out_last',
      data: 'm_out_data',
      ready: 'm_out_ready',
      ready_rate: 192n,
      fail: order,
      drained: 'drained'
    }, false)
    this.finish()
  }
}

/** Source k's packets in the merge example: its injector's records, src included */
export const mergeTestcase = (records: number, k: number): PatternObject[] =>
  seededPackets(records, 10 + k, MERGE_LFSR, last => ({ src: BigInt(k), last: last ? 1n : 0n }), `source ${k}`)

/** What the checker expects of source k: its records without `src`, which its file leaves out */
export const withoutSource = (objects: PatternObject[]): PatternObject[] =>
  objects.map(o => ({ ...o, records: o.records.map(({ src: _src, ...rest }) => rest) }))

// ---- SplitTiedHarness

/** A split example's record: the output it goes to, and 16 bits of data */
export const SPLIT_FIELDS: RecordField[] = [{ name: 'dst', width: 1 }, { name: 'data', width: 16 }]

export interface SplitTiedHarness_Parameters {
  name: string
  records: number
  stimulus: string
  /** The checkers' expected files, for out_a (dst 0) and out_b (dst 1), as the SV names them. */
  expected: [string, string]
  /** Records each checker expects. */
  expectedRecords: [number, number]
}

/**
 * SplitTiedHarness — a StreamSplit, driven by an injector, `inj_s_in`, and checked on each output
 * by an inOrder RecordChecker, `chk_out_a` and `chk_out_b`, each ready at its own random rate. The
 * checkers are tied: each expected record names the records the other output must have delivered
 * before it, as the split keeps its input order across its outputs. Checks: `order_a`, `order_b`,
 * `after_a`, `after_b`.
 *
 *                                out_a ┌───────────┐
 *                           ┌─────────▶│ chk_out_a │──┐ count
 *   inj_s_in ──▶ dut (split)┤          └─────▲─────┘  │
 *                           │ out_b ┌────────┴──┐     ▼
 *                           └──────▶│ chk_out_b │──▶ peer_count = {count_b, count_a} ──▶ both
 *                                   └───────────┘
 */
export class SplitTiedHarness extends Harness {
  constructor (params: SplitTiedHarness_Parameters) {
    super({ name: params.name })
    const n = params.records
    const countWidth = this.bitWidth(n)
    for (const s of ['s_in', 'out_a', 'out_b']) {
      this.addSignal(`${s}_valid`, { width: 1 })
      this.addSignal(`${s}_ready`, { width: 1 })
      this.addSignal(`${s}_dst`, { width: 1 })
      this.addSignal(`${s}_data`, { width: 16 })
      this.addSignal(`${s}_word`, { width: 17 })
    }
    this.addSignal('inj_done', { width: 1 })
    for (const s of ['a', 'b']) {
      this.addSignal(`drained_${s}`, { width: 1 })
      this.addSignal(`count_${s}`, { width: countWidth })
    }
    this.addSubmodule('inj_s_in', new RecordInjector({
      name: `${params.name}_inj`, fields: SPLIT_FIELDS, depth: n, memory: 'preloaded', file: params.stimulus, records: n
    }), { clk: 'clk', rst_b: 'rst_b', ready: 's_in_ready', valid: 's_in_valid', dst: 's_in_dst', data: 's_in_data', done: 'inj_done' }, false)
    this.addAssign({ in: new Expr('{s_in_dst, s_in_data}'), out: 's_in_word' })
    this.addSubmodule('dut', new StreamSplit({ name: `${params.name}_split`, width: 17, selBit: 16 }), {
      in_valid: 's_in_valid',
      in_data: 's_in_word',
      in_ready: 's_in_ready',
      a_valid: 'out_a_valid',
      a_data: 'out_a_word',
      a_ready: 'out_a_ready',
      b_valid: 'out_b_valid',
      b_data: 'out_b_word',
      b_ready: 'out_b_ready'
    }, false)

    // The tie: both checkers see both counts, out_a's as peer 0
    const tie = { peers: 2, countWidth }
    RecordChecker.peerCounts(this, 'peer_count', [{ count: 'count_a', width: countWidth }, { count: 'count_b', width: countWidth }], countWidth)
    const outputs: Array<['a' | 'b', bigint, bigint]> = [['a', 0xaaaan, 128n], ['b', 0xbbbbn, 200n]]
    outputs.forEach(([s, seed, rate], k) => {
      this.addAssign({ in: new Expr(`out_${s}_word[16]`), out: `out_${s}_dst` })
      this.addAssign({ in: new Expr(`out_${s}_word[15:0]`), out: `out_${s}_data` })
      const order = this.check(`order_${s}`, `out_${s} carries its records once, in order, unchanged`, RecordChecker.firstError(`chk_out_${s}`))
      const after = this.check(`after_${s}`, `each record on out_${s} comes after the records on the other output sent before it`, RecordChecker.firstAfterError(`chk_out_${s}`))
      this.addSubmodule(`chk_out_${s}`, new RecordChecker({
        name: `${params.name}_chk_${s}`,
        mode: 'inOrder',
        fields: SPLIT_FIELDS,
        depth: n,
        memory: 'preloaded',
        file: params.expected[k],
        records: params.expectedRecords[k],
        throttle: { seed },
        tie
      }), {
        clk: 'clk',
        rst_b: 'rst_b',
        valid: `out_${s}_valid`,
        dst: `out_${s}_dst`,
        data: `out_${s}_data`,
        ready: `out_${s}_ready`,
        ready_rate: rate,
        peer_count: 'peer_count',
        fail: order,
        fail_after: after,
        drained: `drained_${s}`,
        count: `count_${s}`
      }, false)
    })
    this.addAssign({ in: new Expr('inj_done && drained_a && drained_b'), out: 'done' })
    this.finish()
  }
}

/** The split example's records: each goes to a pseudo-random output, with pseudo-random data */
export const splitTestcase = (records: number): PatternRecord[] =>
  Array.from({ length: records }, (_, i) => ({ dst: BigInt(pick(5000 + i, 2)), data: mixSeed(BigInt(6000 + i), 32) & 0xffffn }))

/**
 * What the checker of output `dst` expects: its records in input order, each tied to the other
 * output (peer 1 - dst) by the number of earlier records that went there.
 */
export function splitExpected (stimulus: PatternRecord[], dst: number): PatternRecord[] {
  let other = 0
  const expected: PatternRecord[] = []
  for (const r of stimulus) {
    if (r.dst === BigInt(dst)) expected.push({ ...r, after_peer: BigInt(1 - dst), after_count: BigInt(other) })
    else other++
  }
  return expected
}

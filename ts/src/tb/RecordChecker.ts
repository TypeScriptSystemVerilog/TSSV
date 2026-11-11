import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { type CheckDetail } from './Harness.js'
import { LFSR } from '../modules/LFSR/LFSR.js'
import { PatternMemory, type ComponentMemory, type PatternMemoryMode } from './PatternMemory.js'
import { type PatternRecord, type Radix, type RecordField, type RecordLayout } from './patternRecord.js'
import {
  AFTER_COUNT, AFTER_PEER, checkerLayout, payloadLfsr, payloadSlices, peerWidth, SEED_FIELD,
  type PayloadSlice, type RecordLfsr, type RecordTie
} from './recordStream.js'
import { drawSeed, RATE_WIDTH, READY_SALT, Throttle } from './Throttle.js'
import { VectorChecker } from './VectorChecker.js'
import { VectorPlayer, fetchWidth, type TableLane } from './VectorPlayer.js'

/**
 * What a RecordChecker requires of the records that arrive:
 *
 *   - `inOrder`: every expected record arrives once, in order, unchanged;
 *   - `perSource`: the same within each source, a field of the record naming the source; the
 *     order across sources isn't checked (tssv-noc NP_VIP_REQ_036);
 *   - `cycleExact`: in each cycle, the checker is ready as the ready file says, and `valid` and the
 *     fields have the expected file's values for that cycle: the cycle table (VectorPlayer,
 *     VectorChecker).
 */
export type RecordCheckMode = 'inOrder' | 'perSource' | 'cycleExact'

interface RecordChecker_Base extends TSSV.TSSVParameters {
  name: string
  /** The fields of a record, in order: one input port each. */
  fields: RecordField[]
  /** The pattern files' radix. Default `'h'`. */
  radix?: Radix
}

interface RecordChecker_Common extends RecordChecker_Base {
  /** Records each expected memory holds. At least 2. */
  depth: number
  /** How the memories get their records: from files (preloaded), or through a load port (reloaded). */
  memory: PatternMemoryMode
  /** LFSR payloads: the checker regenerates these fields from each expected record's seed. */
  lfsr?: RecordLfsr
  /** Ready at random, with a chance of `ready_rate` in 256 per cycle. Without it, always ready. */
  throttle?: { seed: bigint }
  /** Adds `limit`, of this width: `drained` once `limit` records have arrived. */
  limitWidth?: number
  /** Ties the checker to others, to check the order across outputs (RecordTie). */
  tie?: RecordTie
}

export interface InOrderChecker_Parameters extends RecordChecker_Common {
  mode: 'inOrder'
  /** Preloaded only: the pattern file of expected records, as the SV names it (`checkerLayout()`). */
  file?: string
  /** Preloaded only: the records the file holds, 0 to `depth`. Reloaded mode reads `records`. */
  records?: number
}

export interface PerSourceChecker_Parameters extends RecordChecker_Common {
  mode: 'perSource'
  /** The field that names a record's source, 0 to `sources` - 1. */
  sourceField: string
  sources: number
  /** Preloaded only: per source, the pattern file of its expected records, without the source field. */
  files?: string[]
  /** Preloaded only: per source, the records its file holds, 0 to `depth`. */
  records?: number[]
}

export interface CycleExactChecker_Parameters extends RecordChecker_Base {
  mode: 'cycleExact'
  /** Rows in each file: one per cycle, from the cycle after the priming cycle (VectorPlayer). */
  rows: number
  /** The ready file: `ready` in each cycle, as the SV names it (`cycleLayouts().ready`, `cycleRecords()`). */
  readyFile: string
  /** The expected file: `valid` and the record in each cycle, as the SV names it (`cycleLayouts().expected`). */
  file: string
}

export type RecordChecker_Parameters = InOrderChecker_Parameters | PerSourceChecker_Parameters | CycleExactChecker_Parameters

/** One cycle of a cycleExact checker: whether it is ready, and the record it expects, if any. */
export interface CycleRow {
  ready: boolean
  /** The record expected in this cycle, with `valid` high. Without one, `valid` must be low. */
  record?: PatternRecord
}

/** The module's own ports besides the fields, which a field can't be named */
const PORTS = ['clk', 'rst_b', 'valid', 'ready', 'ready_rate', 'limit', 'load_en', 'load_addr', 'load_data', 'load_src', 'records',
  'peer_count', 'fail', 'fail_after', 'drained', 'count']

/** The module's own signals besides its ports, which a field can't be named either */
const INTERNAL = ['delivered', 'got', 'miss', 'early', 'expected', 'allow', 'sel', 'idx', 'idx_nxt', 'exhausted', 'adv', 'rd_addr',
  'want', 'ok', 'payload', 'load', 'had', 'after_ok']

/** `values` selected by one-hot `sels`, as an AND-OR of `width`-bit values */
function andOr (sels: string[], values: string[], width: number): string {
  if (values.length === 1) return values[0] ?? ''
  if (width === 1) return sels.map((s, i) => `(${s} && ${values[i]})`).join(' || ')
  return sels.map((s, i) => `({${width}{${s}}} & ${values[i]})`).join(' | ')
}

/** `value`'s bits `[lo + width - 1 : lo]`, as an SV select of a `total`-bit signal */
function bitsOf (value: string, total: number, lo: number, width: number): string {
  if (width === total) return value
  return width === 1 ? `${value}[${lo}]` : `${value}[${lo + width - 1}:${lo}]`
}

/**
 * RecordChecker — checks a valid/ready stream of records against expected records held in pattern
 * memories (doc/framework/testbench.md, "Record streams"), as a scoreboard. Mode `inOrder` has one
 * memory, `pattern`, and requires every record in it to arrive once, in order, unchanged. Mode
 * `perSource` has one memory per source, `pattern_<k>`, and requires that of each source's
 * records, the source being the value of `sourceField`.
 *
 * Ports: `clk`, `rst_b`, `valid` and one input per field in; `ready`, `fail` and `drained` out.
 * Options add:
 *
 *   - `throttle`: `ready_rate` in. `ready` is high with a chance of `ready_rate` in 256 each
 *     cycle, from a flop. Without it, `ready` is always high.
 *   - `limitWidth`: `limit` in, as TrafficPhases sets it.
 *   - `tie`: `peer_count` in; `fail_after` and `count`, the records delivered so far, from a flop,
 *     out (RecordTie).
 *   - reloaded mode: `load_en`, `load_addr`, `load_data` (PatternMemory) and `records`, the
 *     records loaded, in. With several sources, `load_src` picks the memory, and `records` holds
 *     one count per source, source 0's in the low bits. Load while `rst_b` is low.
 *
 * A record is delivered in a cycle with `valid` and `ready` high. Each delivered record is
 * compared with the next expected record of its source, and with LFSR payloads its payload
 * fields with the values the checker regenerates. `fail` rises at the first record that differs,
 * comes from an unknown source, or arrives after its source's last expected record, and stays
 * high. A record that never arrives keeps `drained` low, so the testbench times out.
 * `drained` rises once the records delivered reach the expected records, or `limit` if that is
 * fewer.
 *
 * The first failure is held in `err_index` (the record's number within its source; the source's
 * record count for a record after its last), `err_source` (perSource), `err_got` and `err_want`
 * (the record's fields but the source, in order, as one value). With `tie`, `fail_after` rises at
 * the first record that arrives before its peer's count, and `err_after_*` hold it. SimTop prints
 * them by hierarchical reference (`firstError()`, `firstAfterError()`).
 *
 * Mode `cycleExact` is the cycle table on a stream, from two files with a row per cycle: a
 * VectorPlayer, `play`, drives `ready` from the ready file, and a VectorChecker, `chk`, checks
 * `valid` and the record, the fields in order as one value, against the expected file, with the
 * record a don't-care where the expected file has `valid` low (`cycleRecords()`). Its ports are `clk`, `rst_b`, `valid` and the fields in; `ready`,
 * `fail_valid`, `fail_record` and `done` out, a fail per lane as VectorChecker has
 * (`firstCycleError()`). Row 0 is the cycle after the priming cycle (doc/framework/testbench.md,
 * "Cycle tables and their timing").
 */
export class RecordChecker extends TSSV.Module {
  declare params: RecordChecker_Parameters
  /**
   * Its pattern memories, for a harness to register (Harness.registerMemories()): `pattern`, or
   * `pattern_<k>` per source in perSource mode. A cycleExact checker's tables (VectorPlayer,
   * VectorChecker) are preloaded only and aren't listed.
   */
  readonly memories: ComponentMemory[] = []
  constructor (params: RecordChecker_Parameters) {
    super({ ...params, radix: params.radix ?? 'h' })
    if (params.mode === 'cycleExact') this.buildCycleTable(params)
    else this.buildQueues(params)
  }

  /** inOrder and perSource: one memory per source, read as records arrive */
  private buildQueues (params: InOrderChecker_Parameters | PerSourceChecker_Parameters): void {
    const { name, fields, depth, memory, lfsr, tie } = params
    const perSource = params.mode === 'perSource'
    const sourceField = perSource ? params.sourceField : undefined
    const queues = perSource ? params.sources : 1
    const files = perSource ? params.files : params.file === undefined ? undefined : [params.file]
    const records = perSource ? params.records : params.records === undefined ? undefined : [params.records]

    // Parameter checks
    if (!Number.isInteger(depth) || depth < 2) throw Error(`${name}: depth must be an integer of at least 2, got ${depth}`)
    if (!Number.isInteger(queues) || queues < 1) throw Error(`${name}: sources must be a positive integer, got ${queues}`)
    const source = fields.find(f => f.name === sourceField)
    if (perSource && source === undefined) throw Error(`${name}: sourceField ${sourceField} is not a field of the record`)
    if (source !== undefined && queues > 2 ** source.width) throw Error(`${name}: a ${source.width}-bit ${source.name} can't name ${queues} sources`)
    if (memory === 'preloaded') {
      if (files?.length !== queues || records?.length !== queues) throw Error(`${name}: a preloaded checker needs a file and a record count per source`)
      for (const r of records) {
        if (!Number.isInteger(r) || r < 0 || r > depth) throw Error(`${name}: a record count must be 0 to depth ${depth}, got ${r}`)
      }
    } else if (files !== undefined || records !== undefined) {
      throw Error(`${name}: a reloaded checker loads through its load port and reads its record counts on records`)
    }
    const slices: PayloadSlice[] = lfsr === undefined ? [] : payloadSlices(name, fields, lfsr)
    if (lfsr?.fields.includes(sourceField ?? '') === true) throw Error(`${name}: the source field ${sourceField} can't be an LFSR payload field`)
    const cw = this.bitWidth(depth) // a count of one memory's records
    const total = queues * depth
    const countWidth = this.bitWidth(total)
    const limitWidth = params.limitWidth
    if (limitWidth !== undefined && (!Number.isInteger(limitWidth) || limitWidth < 1 || limitWidth > countWidth)) {
      throw Error(`${name}: limitWidth must be 1 to ${countWidth}, the width of count, got ${limitWidth}`)
    }
    if (tie !== undefined) {
      if (!Number.isInteger(tie.peers) || tie.peers < 1) throw Error(`${name}: tie.peers must be a positive integer, got ${tie.peers}`)
      if (!Number.isInteger(tie.countWidth) || tie.countWidth < countWidth) throw Error(`${name}: tie.countWidth must hold this checker's count, ${countWidth} bits, got ${tie.countWidth}`)
    }
    for (const f of fields) {
      if (PORTS.includes(f.name) || INTERNAL.includes(f.name)) throw Error(`${name}: field ${f.name} has the name of one of the checker's own signals`)
      if (tie !== undefined && (f.name === AFTER_PEER || f.name === AFTER_COUNT)) throw Error(`${name}: a tied checker's record can't have a field named ${f.name}`)
    }
    const layout = checkerLayout(fields, { lfsr, sourceField, tie, radix: params.radix })
    const addrWidth = this.bitWidth(depth - 1)
    const sourceWidth = this.bitWidth(Math.max(queues - 1, 1))
    const pw = tie === undefined ? 0 : peerWidth(tie.peers)
    const tw = tie?.countWidth ?? 0

    // The record without its source field, as got and want compare it
    const compared = fields.filter(f => f.name !== sourceField)
    const rw = compared.reduce((sum, f) => sum + f.width, 0)
    const q = (k: number): string => queues === 1 ? '' : `_${k}`

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      valid: { direction: 'input' }
    }
    for (const f of fields) this.IOs[f.name] = { direction: 'input', width: f.width }
    if (params.throttle !== undefined) this.IOs.ready_rate = { direction: 'input', width: RATE_WIDTH }
    if (limitWidth !== undefined) this.IOs.limit = { direction: 'input', width: limitWidth }
    if (memory === 'reloaded') {
      this.IOs.load_en = { direction: 'input' }
      if (queues > 1) this.IOs.load_src = { direction: 'input', width: sourceWidth }
      this.IOs.load_addr = { direction: 'input', width: addrWidth }
      this.IOs.load_data = { direction: 'input', width: layout.wordWidth }
      this.IOs.records = { direction: 'input', width: queues * cw }
    }
    if (tie !== undefined) this.IOs.peer_count = { direction: 'input', width: tie.peers * tw }
    this.IOs.ready = { direction: 'output' }
    this.IOs.fail = { direction: 'output' }
    if (tie !== undefined) this.IOs.fail_after = { direction: 'output' }
    this.IOs.drained = { direction: 'output' }
    if (tie !== undefined) this.IOs.count = { direction: 'output', width: countWidth }
    else this.addSignal('count', { width: countWidth })

    // Ready, at random with the throttle, and the records delivered
    if (params.throttle === undefined) {
      this.addAssign({ in: new Expr("1'b1"), out: 'ready' })
    } else {
      this.addSignal('allow', { width: 1 })
      this.addSubmodule('throttle', new Throttle({ name: `${name}_throttle`, seed: drawSeed(params.throttle.seed, READY_SALT) }),
        { clk: 'clk', rst_b: 'rst_b', rate: 'ready_rate', allow: 'allow' }, false)
      this.addRegister({ d: 'allow', clk: 'clk', reset: 'rst_b', q: 'ready' })
    }
    this.addSignal('delivered', { width: 1 })
    this.addAssign({ in: new Expr('valid && ready'), out: 'delivered' })
    this.addSignal('got', { width: rw })
    this.addAssign({ in: new Expr(compared.length === 1 ? compared[0]?.name ?? '' : `{${compared.map(f => f.name).join(', ')}}`), out: 'got' })

    // The source's queue: sel_<k> is high for a record from source k
    const sels: string[] = []
    for (let k = 0; k < queues; k++) {
      const sel = `sel${q(k)}`
      sels.push(sel)
      this.addSignal(sel, { width: 1 })
      this.addAssign({ in: new Expr(source === undefined ? "1'b1" : `${source.name} == ${source.width}'d${k}`), out: sel })
    }

    // Per queue: the next expected record, from its memory, and whether the record matches it
    const count = (k: number): string => memory === 'preloaded' ? `${cw}'d${records?.[k] ?? 0}` : bitsOf('records', queues * cw, k * cw, cw)
    for (let k = 0; k < queues; k++) {
      const s = q(k)
      // idx: records of this queue delivered. adv: one more, this cycle. A record after the last
      // expected one leaves idx where it is
      this.addSignal(`idx${s}`, { width: cw })
      this.addSignal(`exhausted${s}`, { width: 1 })
      this.addSignal(`adv${s}`, { width: 1 })
      this.addAssign({ in: new Expr(`idx${s} == ${count(k)}`), out: `exhausted${s}` })
      this.addAssign({ in: new Expr(`delivered && sel${s} && !exhausted${s}`), out: `adv${s}` })

      // The memory reads the record after idx as soon as idx moves on
      this.addSignal(`idx_nxt${s}`, { width: cw })
      this.addAssign({ in: new Expr(`idx${s} + adv${s}`), out: `idx_nxt${s}` })
      this.addSignal(`rd_addr${s}`, { width: addrWidth })
      const addr = addrWidth === cw ? `idx_nxt${s}` : `${addrWidth}'(idx_nxt${s})`
      this.addAssign({ in: new Expr(`idx_nxt${s} < ${cw}'d${depth} ? ${addr} : ${addrWidth}'d${depth - 1}`), out: `rd_addr${s}` })
      const memBindings: Record<string, string> = { clk: 'clk', rd_addr: `rd_addr${s}` }
      if (memory === 'reloaded') {
        memBindings.load_en = queues === 1 ? 'load_en' : `load_en${s}`
        memBindings.load_addr = 'load_addr'
        memBindings.load_data = 'load_data'
        if (queues > 1) {
          this.addSignal(`load_en${s}`, { width: 1 })
          this.addAssign({ in: new Expr(`load_en && load_src == ${sourceWidth}'d${k}`), out: `load_en${s}` })
        }
      }
      for (const f of layout.fields) {
        this.addSignal(`want${s}_${f.name}`, { width: f.width })
        memBindings[f.name] = `want${s}_${f.name}`
      }
      this.addRegister({ d: `idx_nxt${s}`, clk: 'clk', reset: 'rst_b', q: `idx${s}` })
      this.addSubmodule(`pattern${s}`, new PatternMemory({
        name: `${name}_mem${s}`, layout, depth, mode: memory, file: files?.[k]
      }), memBindings, false)
      this.memories.push({ path: `pattern${s}`, depth, layout, mode: memory, file: files?.[k], records: records?.[k] })

      // LFSR payloads: the seed restarts the LFSR, 0 continues it, and it steps with each record
      if (lfsr !== undefined) {
        const bits = slices.reduce((sum, sl) => sum + sl.width, 0)
        const lw = lfsr.width ?? 64
        this.addSignal(`payload${s}`, { width: bits })
        this.addSignal(`load${s}`, { width: 1 })
        this.addAssign({ in: new Expr(`want${s}_${SEED_FIELD} != ${lw}'d0`), out: `load${s}` })
        this.addSubmodule(`lfsr${s}`, new LFSR({ name: `${name}_lfsr`, ...payloadLfsr(lfsr, bits) }),
          { clk: 'clk', rst_n: 'rst_b', step: `adv${s}`, load: `load${s}`, seed_in: `want${s}_${SEED_FIELD}`, value: `payload${s}` }, false)
      }

      // The whole expected record, in the order of got, and whether the record matches it
      const bits = slices.reduce((sum, sl) => sum + sl.width, 0)
      const parts = compared.map(f => {
        const sl = slices.find(x => x.name === f.name)
        return sl === undefined ? `want${s}_${f.name}` : bitsOf(`payload${s}`, bits, sl.lo, sl.width)
      })
      this.addSignal(`want${s}`, { width: rw })
      this.addAssign({ in: new Expr(parts.length === 1 ? parts[0] ?? '' : `{${parts.join(', ')}}`), out: `want${s}` })
      this.addSignal(`ok${s}`, { width: 1 })
      this.addAssign({ in: new Expr(`!exhausted${s} && got == want${s}`), out: `ok${s}` })

      // A tied checker's record may arrive only once its peer has delivered after_count records
      if (tie !== undefined) {
        this.addSignal(`had${s}`, { width: tw })
        const peers = Array.from({ length: tie.peers }, (_, p) => p)
        this.addAssign({
          in: new Expr(tie.peers === 1
            ? bitsOf('peer_count', tw, 0, tw)
            : andOr(peers.map(p => `(want${s}_${AFTER_PEER} == ${pw}'d${p})`), peers.map(p => bitsOf('peer_count', tie.peers * tw, p * tw, tw)), tw)),
          out: `had${s}`
        })
        this.addSignal(`after_ok${s}`, { width: 1 })
        this.addAssign({ in: new Expr(`exhausted${s} || had${s} >= want${s}_${AFTER_COUNT}`), out: `after_ok${s}` })
      }
    }

    // The delivered record's queue, selected
    const known = queues === 1 ? "1'b1" : sels.join(' || ')
    const each = (base: string): string[] => sels.map((_, k) => `${base}${q(k)}`)
    this.addSignal('miss', { width: 1 })
    this.addAssign({ in: new Expr(`delivered && !(${andOr(sels, each('ok'), 1)})`), out: 'miss' })

    // The first failure, held
    this.addRegister({ d: new Expr('fail | miss'), clk: 'clk', reset: 'rst_b', q: 'fail' })
    const first = new Expr('miss && !fail')
    this.addSignal('err_index', { width: cw })
    this.addSignal('err_got', { width: rw })
    this.addSignal('err_want', { width: rw })
    this.addRegister({ d: new Expr(andOr(sels, each('idx'), cw)), clk: 'clk', reset: 'rst_b', en: first, q: 'err_index' })
    this.addRegister({ d: 'got', clk: 'clk', reset: 'rst_b', en: first, q: 'err_got' })
    this.addRegister({ d: new Expr(andOr(sels, each('want'), rw)), clk: 'clk', reset: 'rst_b', en: first, q: 'err_want' })
    if (source !== undefined) {
      this.addSignal('err_source', { width: source.width })
      this.addRegister({ d: source.name, clk: 'clk', reset: 'rst_b', en: first, q: 'err_source' })
    }

    // The first record that arrives too early for its peer, held
    if (tie !== undefined) {
      this.addSignal('early', { width: 1 })
      this.addAssign({ in: new Expr(`delivered && (${known}) && !(${andOr(sels, each('after_ok'), 1)})`), out: 'early' })
      this.addRegister({ d: new Expr('fail_after | early'), clk: 'clk', reset: 'rst_b', q: 'fail_after' })
      const firstEarly = new Expr('early && !fail_after')
      const held: Array<[string, string, number]> = [
        ['err_after_index', andOr(sels, each('idx'), cw), cw],
        ['err_after_peer', andOr(sels, each(`want`).map(w => `${w}_${AFTER_PEER}`), pw), pw],
        ['err_after_count', andOr(sels, each(`want`).map(w => `${w}_${AFTER_COUNT}`), tw), tw],
        ['err_after_had', andOr(sels, each('had'), tw), tw]
      ]
      if (source !== undefined) held.push(['err_after_source', source.name, source.width])
      for (const [reg, d, width] of held) {
        this.addSignal(reg, { width })
        this.addRegister({ d: new Expr(d), clk: 'clk', reset: 'rst_b', en: firstEarly, q: reg })
      }
    }

    // count, and drained once it reaches the expected records or the limit
    this.addRegister({ d: new Expr(`${countWidth}'(count + delivered)`), clk: 'clk', reset: 'rst_b', q: 'count' })
    const expected = memory === 'preloaded'
      ? `${countWidth}'d${(records ?? []).reduce((a, b) => a + b, 0)}`
      : Array.from({ length: queues }, (_, k) => countWidth === cw ? count(k) : `${countWidth}'(${count(k)})`).join(' + ')
    this.addSignal('expected', { width: countWidth })
    this.addAssign({ in: new Expr(expected), out: 'expected' })
    if (limitWidth === undefined) {
      this.addAssign({ in: new Expr('count == expected'), out: 'drained' })
    } else {
      const limit = limitWidth === countWidth ? 'limit' : `${countWidth}'(limit)`
      this.addAssign({ in: new Expr(`count == (${limit} < expected ? ${limit} : expected)`), out: 'drained' })
    }
  }

  /** cycleExact: a VectorPlayer drives `ready` from the ready file, and a VectorChecker checks the rest */
  private buildCycleTable (params: CycleExactChecker_Parameters): void {
    const { name, fields, rows } = params
    if (!Number.isInteger(rows) || rows < 1) throw Error(`${name}: rows must be a positive integer, got ${rows}`)
    for (const f of fields) {
      if (['clk', 'rst_b', 'valid', 'ready', 'record', 'fail_valid', 'fail_record', 'done', 'row', 'fetch', 'run'].includes(f.name)) {
        throw Error(`${name}: field ${f.name} has the name of one of the checker's own signals`)
      }
    }
    const rw = fields.reduce((sum, f) => sum + f.width, 0)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      valid: { direction: 'input' }
    }
    for (const f of fields) this.IOs[f.name] = { direction: 'input', width: f.width }
    this.IOs.ready = { direction: 'output' }
    this.IOs.fail_valid = { direction: 'output' }
    this.IOs.fail_record = { direction: 'output' }
    this.IOs.done = { direction: 'output' }

    // The row for this cycle, and ready from the ready file
    this.addSignal('row', { width: this.bitWidth(rows) })
    this.addSignal('fetch', { width: fetchWidth(rows) })
    this.addSignal('run', { width: 1 })
    this.addSubmodule('play', new VectorPlayer({
      name: `${name}_play`, rows, lanes: [{ port: 'ready', width: 1 }], file: params.readyFile, radix: params.radix
    }), { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', done: 'done', ready: 'ready' }, false)

    // valid and the whole record, checked against the expected file
    this.addSignal('record', { width: rw })
    this.addAssign({ in: new Expr(fields.length === 1 ? fields[0]?.name ?? '' : `{${fields.map(f => f.name).join(', ')}}`), out: 'record' })
    this.addSubmodule('chk', new VectorChecker({
      name: `${name}_chk`, rows, lanes: [{ port: 'valid', width: 1 }, { port: 'record', width: rw }], file: params.file, radix: params.radix
    }), { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', valid: 'valid', record: 'record', fail_valid: 'fail_valid', fail_record: 'fail_record' }, false)
  }

  /** The layouts of a cycleExact checker's two files: the ready file and the expected file. */
  static cycleLayouts (fields: RecordField[], radix: Radix = 'h'): { ready: RecordLayout, expected: RecordLayout } {
    const rw = fields.reduce((sum, f) => sum + f.width, 0)
    return {
      ready: VectorPlayer.layout([{ port: 'ready', width: 1 }], radix),
      expected: VectorChecker.layout([{ port: 'valid', width: 1 }, { port: 'record', width: rw }], radix)
    }
  }

  /**
   * A cycleExact checker's two files, from one CycleRow per cycle: the ready file, and the
   * expected file, with `valid` and the record, the record a don't-care in a row that expects
   * none.
   */
  static cycleRecords (fields: RecordField[], table: CycleRow[]): { ready: PatternRecord[], expected: PatternRecord[] } {
    const pack = (r: PatternRecord): bigint => fields.reduce((word, f) => {
      const v = r[f.name]
      if (v === undefined || v < 0n || v >= 1n << BigInt(f.width)) throw Error(`RecordChecker.cycleRecords: field ${f.name} is ${v}, not a ${f.width}-bit value`)
      return (word << BigInt(f.width)) | v
    }, 0n)
    const rw = fields.reduce((sum, f) => sum + f.width, 0)
    const ready: TableLane = { port: 'ready', width: 1, values: table.map(t => t.ready ? 1n : 0n) }
    const valid: TableLane = { port: 'valid', width: 1, values: table.map(t => t.record === undefined ? 0n : 1n) }
    const record: TableLane = { port: 'record', width: rw, values: table.map(t => t.record === undefined ? undefined : pack(t.record)) }
    return { ready: VectorPlayer.records([ready], table.length), expected: VectorChecker.records([valid, record], table.length) }
  }

  /** What SimTop prints when a cycleExact checker at `path` fails on `lane`, `valid` or `record`. */
  static firstCycleError (path: string, lane: 'valid' | 'record'): CheckDetail {
    return VectorChecker.firstError(`${path}.chk`, lane, 'cycle')
  }

  /**
   * What SimTop prints when a checker at `path` inside the harness (`chk_out`) fails: the first
   * record that differs, with its number within its source, and its source in perSource mode.
   */
  static firstError (path: string, mode: 'inOrder' | 'perSource' = 'inOrder'): CheckDetail {
    const at = mode === 'perSource' ? 'source %0d, record %0d' : 'record %0d'
    const where = mode === 'perSource' ? [`${path}.err_source`, `${path}.err_index`] : [`${path}.err_index`]
    return { format: `${at}: got %h, expected %h`, args: [...where, `${path}.err_got`, `${path}.err_want`] }
  }

  /** What SimTop prints when a tied checker at `path` fails `fail_after`: the first early record. */
  static firstAfterError (path: string, mode: 'inOrder' | 'perSource' = 'inOrder'): CheckDetail {
    const at = mode === 'perSource' ? 'source %0d, record %0d' : 'record %0d'
    const where = mode === 'perSource' ? [`${path}.err_after_source`, `${path}.err_after_index`] : [`${path}.err_after_index`]
    return {
      format: `${at}: arrived before peer %0d had delivered %0d records; it had %0d`,
      args: [...where, `${path}.err_after_peer`, `${path}.err_after_count`, `${path}.err_after_had`]
    }
  }

  /**
   * Ties checkers: adds `net` to `m`, a harness, carrying each checker's `count` at
   * `countWidth`, peer 0's in the low bits, for every tied checker's `peer_count`.
   * @param counts each peer's count net and its width, in peer order
   */
  static peerCounts (m: TSSV.Module, net: string, counts: Array<{ count: string, width: number }>, countWidth: number): string {
    m.addSignal(net, { width: counts.length * countWidth })
    const parts = [...counts].reverse().map(c => c.width === countWidth ? c.count : `${countWidth}'(${c.count})`)
    m.addAssign({ in: new Expr(parts.length === 1 ? parts[0] ?? '' : `{${parts.join(', ')}}`), out: net })
    return net
  }
}

export default RecordChecker

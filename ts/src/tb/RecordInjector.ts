import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { Lfsr } from './Lfsr.js'
import { PatternMemory, type PatternMemoryMode } from './PatternMemory.js'
import { type Radix, type RecordField } from './patternRecord.js'
import { injectorLayout, payloadSlices, SEED_FIELD, type RecordLfsr } from './recordStream.js'
import { drawSeed, RATE_WIDTH, Throttle, VALID_SALT } from './Throttle.js'

export interface RecordInjector_Parameters extends TSSV.TSSVParameters {
  name: string
  /** The fields of a record, in order: one output port each. */
  fields: RecordField[]
  /** Records the memory holds. At least 2. */
  depth: number
  /** How the memory gets its records: from `file` (preloaded), or through a load port (reloaded). */
  memory: PatternMemoryMode
  /** Preloaded only: the pattern file, as the SV names it (`injectorLayout()`). */
  file?: string
  /** The pattern file's radix. Default `'h'`. */
  radix?: Radix
  /** Preloaded only: the records the file holds, 1 to `depth`. Reloaded mode reads `records`. */
  records?: number
  /** LFSR payloads: the fields an Lfsr fills in from the seed each record stores. */
  lfsr?: RecordLfsr
  /** Offers each record at random, with a chance of `valid_rate` in 256 per cycle. */
  throttle?: { seed: bigint }
  /** Adds `limit`, of this width: the injector sends no more than `limit` records. */
  limitWidth?: number
}

/** The module's own signals besides its ports, which a field can't be named */
const INTERNAL = ['idx', 'idx_nxt', 'bound', 'more', 'pass', 'offering', 'accepted', 'rd_addr', 'payload', 'load']

/**
 * RecordInjector — drives a valid/ready stream of records from a pattern memory
 * (doc/framework/testbench.md, "Record streams"). Record i is the memory's word i, and the
 * injector offers the records in order, each until it is accepted, until it has sent them all.
 *
 * Ports: `clk`, `rst_b`, `ready` in; `valid`, one output per field, and `done` out. Options add:
 *
 *   - `throttle`: `valid_rate` in. In a cycle where it isn't holding a record, it offers the next
 *     one with a chance of `valid_rate` in 256 (Throttle). Without it, it offers whenever it can.
 *   - `limitWidth`: `limit` in. It sends no more than `limit` records, as TrafficPhases sets it.
 *   - reloaded mode: `load_en`, `load_addr`, `load_data` (PatternMemory) and `records` in, the
 *     number of records loaded. Load while `rst_b` is low.
 *
 * `valid` comes from a flop, and so do the stored fields (the memory's read registers). An LFSR
 * payload field comes from the Lfsr: from the record's seed through a mux, or from the Lfsr's
 * state. `ready` reaches only flops, so a DUT may compute it from `valid`. `done` rises when every
 * record has been accepted.
 *
 * The memory reads the next record as soon as the current one is accepted, so a record is at the
 * fields when `valid` rises, and the stream can carry a record every cycle. Through reset the
 * memory reads record 0, which is at the fields when reset is released.
 */
export class RecordInjector extends TSSV.Module {
  declare params: RecordInjector_Parameters
  constructor (params: RecordInjector_Parameters) {
    super({
      name: params.name,
      fields: params.fields,
      depth: params.depth,
      memory: params.memory,
      file: params.file,
      radix: params.radix ?? 'h',
      records: params.records,
      lfsr: params.lfsr,
      throttle: params.throttle,
      limitWidth: params.limitWidth
    })
    const { name, fields, depth, memory, lfsr } = params
    if (!Number.isInteger(depth) || depth < 2) throw Error(`${name}: depth must be an integer of at least 2, got ${depth}`)
    const records = params.records
    if (memory === 'preloaded' && (records === undefined || !Number.isInteger(records) || records < 1 || records > depth)) {
      throw Error(`${name}: a preloaded injector needs records, 1 to depth ${depth}, got ${records}`)
    }
    if (memory === 'reloaded' && records !== undefined) throw Error(`${name}: a reloaded injector reads its record count on records, not from a parameter`)
    const slices = lfsr === undefined ? [] : payloadSlices(name, fields, lfsr)
    const cw = this.bitWidth(depth)
    const limitWidth = params.limitWidth
    if (limitWidth !== undefined && (!Number.isInteger(limitWidth) || limitWidth < 1 || limitWidth > cw)) {
      throw Error(`${name}: limitWidth must be 1 to ${cw}, the width of a record count, got ${limitWidth}`)
    }
    const layout = injectorLayout(fields, { lfsr, radix: params.radix })
    const addrWidth = this.bitWidth(depth - 1)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      ready: { direction: 'input' }
    }
    if (params.throttle !== undefined) this.IOs.valid_rate = { direction: 'input', width: RATE_WIDTH }
    if (limitWidth !== undefined) this.IOs.limit = { direction: 'input', width: limitWidth }
    if (memory === 'reloaded') {
      this.IOs.load_en = { direction: 'input' }
      this.IOs.load_addr = { direction: 'input', width: addrWidth }
      this.IOs.load_data = { direction: 'input', width: layout.wordWidth }
      this.IOs.records = { direction: 'input', width: cw }
    }
    this.IOs.valid = { direction: 'output' }
    for (const f of fields) {
      if (f.name in this.IOs || f.name === 'done' || INTERNAL.includes(f.name)) throw Error(`${name}: field ${f.name} has the name of one of the injector's own signals`)
      this.IOs[f.name] = { direction: 'output', width: f.width }
    }
    this.IOs.done = { direction: 'output' }

    // The record on offer, idx, and the one the memory reads for the next cycle, idx_nxt
    this.addSignal('idx', { width: cw })
    this.addSignal('idx_nxt', { width: cw })
    this.addSignal('accepted', { width: 1 })
    this.addSignal('offering', { width: 1 })
    this.addAssign({ in: new Expr('offering && ready'), out: 'accepted' })
    this.addAssign({ in: new Expr('idx + accepted'), out: 'idx_nxt' })
    this.addRegister({ d: 'idx_nxt', clk: 'clk', reset: 'rst_b', q: 'idx' })

    // Whether a record is left to send: below the record count, and below the limit
    const count = memory === 'preloaded' ? `${cw}'d${records}` : 'records'
    this.addSignal('bound', { width: cw })
    this.addSignal('more', { width: 1 })
    if (limitWidth === undefined) {
      this.addAssign({ in: new Expr(count), out: 'bound' })
    } else {
      const limit = limitWidth === cw ? 'limit' : `${cw}'(limit)`
      this.addAssign({ in: new Expr(`${limit} < ${count} ? ${limit} : ${count}`), out: 'bound' })
    }
    this.addAssign({ in: new Expr('idx_nxt < bound'), out: 'more' })
    this.addAssign({ in: new Expr(`idx == ${count}`), out: 'done' })

    // Offering: a record is held until it is accepted, and the next one is offered when the
    // throttle passes
    this.addSignal('pass', { width: 1 })
    if (params.throttle === undefined) {
      this.addAssign({ in: new Expr("1'b1"), out: 'pass' })
    } else {
      this.addSubmodule('throttle', new Throttle({ name: `${name}_throttle`, seed: drawSeed(params.throttle.seed, VALID_SALT) }),
        { clk: 'clk', rst_b: 'rst_b', rate: 'valid_rate', pass: 'pass' }, false)
    }
    this.addRegister({ d: new Expr('(offering && !ready) || (more && pass)'), clk: 'clk', reset: 'rst_b', q: 'offering' })
    this.addAssign({ in: new Expr('offering'), out: 'valid' })

    // The records, from the memory. The address stays in range once every record is sent
    this.addSignal('rd_addr', { width: addrWidth })
    const lastAddr = `${addrWidth}'d${depth - 1}`
    const addr = addrWidth === cw ? 'idx_nxt' : `${addrWidth}'(idx_nxt)`
    this.addAssign({ in: new Expr(`idx_nxt < ${cw}'d${depth} ? ${addr} : ${lastAddr}`), out: 'rd_addr' })
    const memBindings: Record<string, string> = { clk: 'clk', rd_addr: 'rd_addr' }
    if (memory === 'reloaded') Object.assign(memBindings, { load_en: 'load_en', load_addr: 'load_addr', load_data: 'load_data' })
    for (const f of layout.fields) memBindings[f.name] = f.name
    if (lfsr !== undefined) this.addSignal(SEED_FIELD, { width: lfsr.width ?? 64 })
    this.addSubmodule('pattern', new PatternMemory({ name: `${name}_mem`, layout, depth, mode: memory, file: params.file }), memBindings, false)

    // LFSR payloads: the seed restarts the Lfsr, 0 continues it, and it steps when a record leaves
    if (lfsr !== undefined) {
      const bits = slices.reduce((sum, s) => sum + s.width, 0)
      this.addSignal('payload', { width: bits })
      this.addSignal('load', { width: 1 })
      this.addAssign({ in: new Expr(`${SEED_FIELD} != ${lfsr.width ?? 64}'d0`), out: 'load' })
      this.addSubmodule('lfsr', new Lfsr({ name: `${name}_lfsr`, width: lfsr.width, seed: lfsr.seed, outWidth: bits, loadable: true }),
        { clk: 'clk', rst_b: 'rst_b', step: 'accepted', load: 'load', seed_in: SEED_FIELD, value: 'payload' }, false)
      for (const s of slices) {
        const bitsOf = bits === s.width ? '' : s.width === 1 ? `[${s.lo}]` : `[${s.lo + s.width - 1}:${s.lo}]`
        this.addAssign({ in: new Expr(`payload${bitsOf}`), out: s.name })
      }
    }
  }
}

export default RecordInjector

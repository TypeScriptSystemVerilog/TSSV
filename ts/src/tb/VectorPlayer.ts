import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { PatternMemory, type ComponentMemory, type PatternMemoryMode } from './PatternMemory.js'
import { recordLayout, type PatternRecord, type Radix, type RecordLayout } from './patternRecord.js'

/** One lane a VectorPlayer drives: the output port that drives it, and its width. */
export interface DriveLane {
  port: string
  width: number
}

/** A lane with its value in each row, for writing a table's pattern file. */
export interface TableLane {
  port: string
  width: number
  /** The value in each row. `undefined` is written as 0, for a player, or as a don't-care. */
  values: Array<bigint | undefined>
}

export interface VectorPlayer_Parameters {
  name: string
  /** Preloaded only: rows in the table. A reloaded player reads its row count on `records`. */
  rows?: number
  lanes: DriveLane[]
  /**
   * Preloaded only: the pattern file the table's memory loads, one record per row with a field
   * per lane (`VectorPlayer.layout()`, `VectorPlayer.records()`). A player without lanes has none.
   */
  file?: string
  /** The pattern file's radix. Default `'h'`. */
  radix?: Radix
  /**
   * Records the table's memory holds. Preloaded: at least `tableDepth(rows)`, which is the
   * default. Reloaded: required, the most rows a testcase may load. A generated testbench takes it
   * from its configuration, so that one build can hold tables of different lengths.
   */
  depth?: number
  /**
   * How the table's memory gets its rows, which a harness passes as `build.mode`: from `file`
   * (preloaded), or through a load port, with the row count on `records` (reloaded). Default
   * `'preloaded'`.
   */
  memory?: PatternMemoryMode
}

/**
 * A player's own signals besides its ports, and its reloaded mode's ports, which a lane can't be
 * named in either mode, so that a harness builds in both or neither
 */
const RESERVED = ['table_addr', 'load_en', 'load_addr', 'load_data', 'records']

/** The smallest memory for a table of `rows` rows: at least 2 records, the smallest a PatternMemory holds. */
export const tableDepth = (rows: number): number => Math.max(rows, 2)

/** The width of a table's `fetch`, the row its memories read: for the nets a harness declares. */
export const fetchWidth = (rows: number): number => Math.ceil(Math.log2(tableDepth(rows)))

/** A cycle table's memory depth, and the rows its `row` and `fetch` are sized for (tableSize()). */
export interface TableSize {
  depth: number
  /**
   * The table's rows, or the most it may have: `row` is bitWidth(size) bits, and `fetch`
   * fetchWidth(size). A harness sizes the nets between a player and its checkers the same way.
   */
  size: number
}

/**
 * The depth and size of a table's memory, from a VectorPlayer's or VectorChecker's `rows`,
 * `depth` and `memory` options, checked. `what` names the component.
 *
 *   - Preloaded: the size is `rows`, and the depth is `depth`, at least `tableDepth(rows)`, which
 *     is the default.
 *   - Reloaded: the rows are read at run time, on `records`, so `rows` is refused. `depth` is
 *     required, and is the size: the table may have as many rows as its memory holds.
 */
export function tableSize (what: string, rows: number | undefined, depth: number | undefined, memory: PatternMemoryMode = 'preloaded'): TableSize {
  if (memory === 'reloaded') {
    if (rows !== undefined) throw Error(`${what}: a reloaded table reads its row count on records, not from rows`)
    if (depth === undefined || !Number.isInteger(depth) || depth < 2) throw Error(`${what}: a reloaded table needs depth, an integer of at least 2, got ${depth}`)
    return { depth, size: depth }
  }
  if (rows === undefined || !Number.isInteger(rows) || rows < 1) throw Error(`${what}: rows must be a positive integer, got ${rows}`)
  const d = depth ?? tableDepth(rows)
  if (!Number.isInteger(d) || d < tableDepth(rows)) throw Error(`${what}: depth must be an integer of at least ${tableDepth(rows)}, the table's ${rows} rows, got ${d}`)
  return { depth: d, size: rows }
}

/**
 * VectorPlayer — drives a table one row per clock cycle, from a pattern memory loaded with the
 * table's pattern file (doc/framework/testbench.md). During the cycle in which `row` = r and `run`
 * is high, every lane carries its row-r value.
 *
 * Ports: `clk`, `rst_b` in; `row`, `fetch`, `run`, `done` and one output per lane out. In
 * reloaded mode also `load_en`, `load_addr`, `load_data` (PatternMemory) and `records`, the
 * table's row count, in. Load while `rst_b` is low.
 *
 *   - `run` is low from reset until the first rising edge after reset is released: the priming
 *     cycle. The memory's read is synchronous, so its first record can only be at its output one
 *     edge after the address moves, and through reset the address is row 0's.
 *   - `row` is 0 from reset. It counts up by one at each rising edge with `run` high and stops at
 *     the row count, `rows` or `records`, where `done` goes high and every lane holds its last
 *     value. Row 0 lasts two cycles: the priming cycle and the next.
 *   - `fetch` is the row the table's memories read this cycle, one ahead of `row`: 0 until `run`,
 *     then `row + 1` up to the last row. A VectorChecker on the same table reads its memory at
 *     `fetch` too, so its expected values line up with the lanes.
 *
 * Each lane comes straight from the memory's read register, a flop, so a lane may drive a reset
 * (SV guide RST-4).
 *
 * The table's memory is listed in `memories`, so a harness registers it and the testbench
 * generator can build the testbench (doc/framework/testbench.md). A reloaded table is sized for
 * as many rows as its memory holds (tableSize()), and a reloaded player needs lanes, since
 * without them it has no memory to load its row count with.
 */
export class VectorPlayer extends TSSV.Module {
  /**
   * Its pattern memory, for a harness to register (Harness.registerMemories()): `pattern`, with
   * the table's rows. A player without lanes has none.
   */
  readonly memories: ComponentMemory[] = []

  constructor (params: VectorPlayer_Parameters) {
    super({ name: params.name })
    const { name, rows, lanes, file } = params
    const mode = params.memory ?? 'preloaded'
    const { depth, size } = tableSize(name, rows, params.depth, mode)
    if (mode === 'reloaded') {
      if (lanes.length === 0) throw Error(`${name}: a reloaded player needs lanes: without them it has no memory to load its row count with`)
      if (file !== undefined) throw Error(`${name}: a reloaded table loads through its load port, not from ${file}`)
    } else if (lanes.length > 0 && file === undefined) {
      throw Error(`${name}: a player with lanes needs a pattern file`)
    }
    const rowWidth = this.bitWidth(size)
    const addrWidth = fetchWidth(size)
    const layout = lanes.length > 0 ? VectorPlayer.layout(lanes, params.radix) : undefined

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }
    if (mode === 'reloaded') {
      this.IOs.load_en = { direction: 'input' }
      this.IOs.load_addr = { direction: 'input', width: this.bitWidth(depth - 1) }
      this.IOs.load_data = { direction: 'input', width: layout?.wordWidth ?? 1 }
      this.IOs.records = { direction: 'input', width: rowWidth }
    }
    Object.assign(this.IOs, {
      row: { direction: 'output', width: rowWidth },
      fetch: { direction: 'output', width: addrWidth },
      run: { direction: 'output' },
      done: { direction: 'output' }
    })
    for (const lane of lanes) {
      if (lane.port in this.IOs || RESERVED.includes(lane.port)) throw Error(`${name}: lane ${lane.port} has the name of another port or signal`)
      this.IOs[lane.port] = { direction: 'output', width: lane.width }
    }

    // The row counter: run rises at the first edge after reset, then row counts to the row count
    const count = mode === 'preloaded' ? `${rowWidth}'d${rows}` : 'records'
    this.addRegister({ d: new Expr("1'b1"), clk: 'clk', reset: 'rst_b', q: 'run' })
    this.addAssign({ in: new Expr(`row == ${count}`), out: 'done' })
    this.addRegister({ d: new Expr(`row + ${rowWidth}'d1`), clk: 'clk', reset: 'rst_b', en: new Expr('run && !done'), q: 'row' })

    // The row the memories read, one ahead of row, held at the last row. Reloaded, the testbench
    // generator refuses a table of no rows, so records - 1 doesn't wrap
    const [lastRow, last] = mode === 'preloaded'
      ? [`${rowWidth}'d${size - 1}`, `${addrWidth}'d${size - 1}`]
      : [`records - ${rowWidth}'d1`, `${addrWidth}'(records - ${rowWidth}'d1)`]
    this.addAssign({
      in: new Expr(mode === 'preloaded' && size === 1 ? `${addrWidth}'d0` : `!run ? ${addrWidth}'d0 : row < ${lastRow} ? ${addrWidth}'(row + ${rowWidth}'d1) : ${last}`),
      out: 'fetch'
    })

    // The lanes, from the table's memory
    if (layout !== undefined) {
      const memory = new PatternMemory({ name: `PatternMemory_${name}`, layout, depth, mode, file })
      const bindings: Record<string, string> = { clk: 'clk', rd_addr: tableAddress(this, depth, size) }
      if (mode === 'reloaded') Object.assign(bindings, { load_en: 'load_en', load_addr: 'load_addr', load_data: 'load_data' })
      for (const lane of lanes) bindings[lane.port] = lane.port
      this.addSubmodule('pattern', memory, bindings, false)
      this.memories.push({ path: 'pattern', depth, layout, mode, file, records: rows, table: true })
    }
  }

  /** The record layout of a player's pattern file: one field per lane, named after its port. */
  static layout (lanes: DriveLane[], radix: Radix = 'h'): RecordLayout {
    return recordLayout(lanes.map(l => ({ name: l.port, width: l.width })), radix)
  }

  /** A player's pattern file: row r holds each lane's row-r value, with 0 for `undefined`. */
  static records (lanes: TableLane[], rows: number): PatternRecord[] {
    for (const l of lanes) {
      if (l.values.length !== rows) throw Error(`VectorPlayer.records: lane ${l.port} has ${l.values.length} rows, not ${rows}`)
    }
    return Array.from({ length: rows }, (_, r) => Object.fromEntries(lanes.map(l => [l.port, l.values[r] ?? 0n])))
  }
}

/**
 * The net that addresses a table's memory, of `depth` records, in `module`: `fetch` itself, or
 * `table_addr`, `fetch` widened with zeros, when the memory is deeper than the table needs.
 */
export function tableAddress (module: TSSV.Module, depth: number, rows: number): string {
  const fw = fetchWidth(rows)
  const aw = module.bitWidth(depth - 1)
  if (aw === fw) return 'fetch'
  module.addSignal('table_addr', { width: aw })
  module.addAssign({ in: new Expr(`{${aw - fw}'d0, fetch}`), out: 'table_addr' })
  return 'table_addr'
}

export default VectorPlayer

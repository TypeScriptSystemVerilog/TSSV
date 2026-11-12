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
  /** Rows in the table. */
  rows: number
  lanes: DriveLane[]
  /**
   * The pattern file the table's memory loads, one record per row with a field per lane
   * (`VectorPlayer.layout()`, `VectorPlayer.records()`). A player without lanes has none.
   */
  file?: string
  /** The pattern file's radix. Default `'h'`. */
  radix?: Radix
  /**
   * Records the table's memory holds: at least `tableDepth(rows)`, which is the default. A
   * generated testbench takes it from its configuration, so that one build can hold tables of
   * different lengths.
   */
  depth?: number
  /**
   * The table's run mode, which a harness passes as `build.mode`. A cycle table is preloaded only,
   * so `'reloaded'` is refused. Default `'preloaded'`.
   */
  memory?: PatternMemoryMode
}

/** The smallest memory for a table of `rows` rows: at least 2 records, the smallest a PatternMemory holds. */
export const tableDepth = (rows: number): number => Math.max(rows, 2)

/** The width of a table's `fetch`, the row its memories read: for the nets a harness declares. */
export const fetchWidth = (rows: number): number => Math.ceil(Math.log2(tableDepth(rows)))

/**
 * The depth of a table's memory, from a VectorPlayer's or VectorChecker's `depth` and `memory`
 * options, checked: `depth`, at least `tableDepth(rows)`, which is the default. Throws in
 * reloaded mode, since a cycle table is preloaded only. `what` names the component.
 */
export function tableMemoryDepth (what: string, rows: number, depth?: number, memory?: PatternMemoryMode): number {
  if (memory !== undefined && memory !== 'preloaded') throw Error(`${what}: a cycle table is preloaded only, so it can't be built in ${memory} mode`)
  const d = depth ?? tableDepth(rows)
  if (!Number.isInteger(d) || d < tableDepth(rows)) throw Error(`${what}: depth must be an integer of at least ${tableDepth(rows)}, the table's ${rows} rows, got ${d}`)
  return d
}

/**
 * VectorPlayer — drives a table one row per clock cycle, from a pattern memory loaded with the
 * table's pattern file (doc/framework/testbench.md). During the cycle in which `row` = r and `run`
 * is high, every lane carries its row-r value.
 *
 * Ports: `clk`, `rst_b` in; `row`, `fetch`, `run`, `done` and one output per lane out.
 *
 *   - `run` is low from reset until the first rising edge after reset is released: the priming
 *     cycle. The memory's read is synchronous, so its first record can only be at its output one
 *     edge after the address moves, and through reset the address is row 0's.
 *   - `row` is 0 from reset. It counts up by one at each rising edge with `run` high and stops at
 *     `rows`, where `done` goes high and every lane holds its last value. Row 0 lasts two cycles:
 *     the priming cycle and the next.
 *   - `fetch` is the row the table's memories read this cycle, one ahead of `row`: 0 until `run`,
 *     then `row + 1` up to the last row. A VectorChecker on the same table reads its memory at
 *     `fetch` too, so its expected values line up with the lanes.
 *
 * Each lane comes straight from the memory's read register, a flop, so a lane may drive a reset
 * (SV guide RST-4).
 *
 * The table's memory is listed in `memories`, so a harness registers it and the testbench
 * generator can build the testbench (doc/framework/testbench.md). It is preloaded only.
 */
export class VectorPlayer extends TSSV.Module {
  /**
   * Its pattern memory, for a harness to register (Harness.registerMemories()): `pattern`,
   * preloaded with the table's rows. A player without lanes has none.
   */
  readonly memories: ComponentMemory[] = []

  constructor (params: VectorPlayer_Parameters) {
    super({ name: params.name })
    const rows = params.rows
    // In reloaded mode the rows aren't known, so the mode is checked first
    if (params.memory !== undefined) tableMemoryDepth(params.name, 2, undefined, params.memory)
    if (!Number.isInteger(rows) || rows < 1) throw Error(`${params.name}: rows must be a positive integer, got ${rows}`)
    if (params.lanes.length > 0 && params.file === undefined) throw Error(`${params.name}: a player with lanes needs a pattern file`)
    const depth = tableMemoryDepth(params.name, rows, params.depth, params.memory)
    const rowWidth = this.bitWidth(rows)
    const addrWidth = fetchWidth(rows)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      row: { direction: 'output', width: rowWidth },
      fetch: { direction: 'output', width: addrWidth },
      run: { direction: 'output' },
      done: { direction: 'output' }
    }
    for (const lane of params.lanes) {
      if (lane.port in this.IOs || lane.port === 'table_addr') throw Error(`${params.name}: lane ${lane.port} has the name of another port or signal`)
      this.IOs[lane.port] = { direction: 'output', width: lane.width }
    }

    // The row counter: run rises at the first edge after reset, then row counts to rows
    this.addRegister({ d: new Expr("1'b1"), clk: 'clk', reset: 'rst_b', q: 'run' })
    this.addAssign({ in: new Expr(`row == ${rowWidth}'d${rows}`), out: 'done' })
    this.addRegister({ d: new Expr(`row + ${rowWidth}'d1`), clk: 'clk', reset: 'rst_b', en: new Expr('run && !done'), q: 'row' })

    // The row the memories read, one ahead of row, held at the last row
    const last = `${addrWidth}'d${rows - 1}`
    this.addAssign({
      in: new Expr(rows === 1 ? `${addrWidth}'d0` : `!run ? ${addrWidth}'d0 : row < ${rowWidth}'d${rows - 1} ? ${addrWidth}'(row + ${rowWidth}'d1) : ${last}`),
      out: 'fetch'
    })

    // The lanes, from the table's memory
    if (params.lanes.length > 0) {
      const layout = VectorPlayer.layout(params.lanes, params.radix)
      const memory = new PatternMemory({ name: `${params.name}_mem`, layout, depth, mode: 'preloaded', file: params.file })
      const bindings: Record<string, string> = { clk: 'clk', rd_addr: tableAddress(this, depth, rows) }
      for (const lane of params.lanes) bindings[lane.port] = lane.port
      this.addSubmodule('pattern', memory, bindings, false)
      this.memories.push({ path: 'pattern', depth, layout, mode: 'preloaded', file: params.file, records: rows })
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

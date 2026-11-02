import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { PatternMemory } from './PatternMemory.js'
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
}

/** The table's memory: at least 2 records, the smallest a PatternMemory holds. */
export const tableDepth = (rows: number): number => Math.max(rows, 2)

/** The width of a table's `fetch`, an address of its memory: for the nets a harness declares. */
export const fetchWidth = (rows: number): number => Math.ceil(Math.log2(tableDepth(rows)))

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
 */
export class VectorPlayer extends TSSV.Module {
  constructor (params: VectorPlayer_Parameters) {
    super({ name: params.name })
    const rows = params.rows
    if (!Number.isInteger(rows) || rows < 1) throw Error(`${params.name}: rows must be a positive integer, got ${rows}`)
    if (params.lanes.length > 0 && params.file === undefined) throw Error(`${params.name}: a player with lanes needs a pattern file`)
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
      if (lane.port in this.IOs) throw Error(`${params.name}: lane ${lane.port} has the name of another port`)
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
      const memory = new PatternMemory({
        name: `${params.name}_mem`,
        layout: VectorPlayer.layout(params.lanes, params.radix),
        depth: tableDepth(rows),
        mode: 'preloaded',
        file: params.file
      })
      const bindings: Record<string, string> = { clk: 'clk', rd_addr: 'fetch' }
      for (const lane of params.lanes) bindings[lane.port] = lane.port
      this.addSubmodule('pattern', memory, bindings, false)
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

export default VectorPlayer

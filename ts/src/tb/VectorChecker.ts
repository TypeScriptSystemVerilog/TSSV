import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { PatternMemory, type ComponentMemory, type PatternMemoryMode } from './PatternMemory.js'
import { recordLayout, type PatternRecord, type Radix, type RecordLayout } from './patternRecord.js'
import { fetchWidth, tableAddress, tableSize, type TableLane } from './VectorPlayer.js'
import { type CheckDetail } from './Harness.js'

/** One lane a VectorChecker compares: the input port it is read on, and its width. */
export interface CheckLane {
  port: string
  width: number
}

export interface VectorChecker_Parameters {
  name: string
  /**
   * Preloaded only: rows in the table, as in the VectorPlayer whose `row`, `fetch` and `run` drive
   * this checker. A reloaded checker reads its row count on `records`.
   */
  rows?: number
  lanes: CheckLane[]
  /**
   * Preloaded only: the pattern file of expected values the checker's memory loads: one record
   * per row, with a field per lane and a `care` field (`VectorChecker.layout()`,
   * `VectorChecker.records()`).
   */
  file?: string
  /** The pattern file's radix. Default `'h'`. */
  radix?: Radix
  /** Rows before this one are not checked, and error rows are counted from it. Default 0. */
  firstRow?: number
  /**
   * Records the table's memory holds. Preloaded: at least `tableDepth(rows)`, which is the
   * default. Reloaded: required, and the player's, so that `row` and `fetch` have its widths. A
   * generated testbench takes it from its configuration (VectorPlayer's `depth`).
   */
  depth?: number
  /**
   * How the table's memory gets its rows, which a harness passes as `build.mode`: from `file`
   * (preloaded), or through a load port, with the row count on `records` (reloaded). Default
   * `'preloaded'`.
   */
  memory?: PatternMemoryMode
}

/** The checker's own signals besides its ports and its lanes' signals, which a lane can't be named */
const INTERNAL = ['care', 'checking', 'table_addr']
/** Its reloaded mode's ports, which a lane can't be named in either mode, so that a harness builds in both or neither */
const LOAD_PORTS = ['load_en', 'load_addr', 'load_data', 'records']

/**
 * VectorChecker — checks lanes against a table of expected values, one row per clock cycle,
 * with the `row`, `fetch` and `run` of the VectorPlayer that drives the same table. The expected
 * values come from a pattern memory loaded with the table's pattern file, read at `fetch`. At the
 * rising edge that ends a cycle in which `run` is high and `row` = r, each lane must equal its
 * row-r value. Rows before `firstRow`, rows from the row count on, and entries whose care bit is
 * 0 are not checked.
 *
 * Ports: `clk`, `rst_b`, `row`, `fetch`, `run` and one input per lane in; per lane, `fail_<port>`
 * out, which rises at the lane's first mismatch and stays high. In reloaded mode also `load_en`,
 * `load_addr`, `load_data` (PatternMemory) and `records`, the table's row count, in. Load while
 * `rst_b` is low.
 *
 * Per lane, `err_row_<port>`, `err_got_<port>` and `err_want_<port>` hold that first mismatch:
 * its row, counted from `firstRow`, the lane's value and the table's. They are not ports: SimTop
 * prints them by hierarchical reference (`firstError()`).
 *
 * The table's memory is listed in `memories`, so a harness registers it and the testbench
 * generator can build the testbench (doc/framework/testbench.md). The checker reads its own row
 * count, so the generator requires a testcase to give it the player's (ComponentMemory.table).
 */
export class VectorChecker extends TSSV.Module {
  /** Its pattern memory, for a harness to register (Harness.registerMemories()): `pattern`, with the expected rows. */
  readonly memories: ComponentMemory[] = []

  constructor (params: VectorChecker_Parameters) {
    super({ name: params.name })
    const { name, rows, lanes, file } = params
    const mode = params.memory ?? 'preloaded'
    const firstRow = params.firstRow ?? 0
    const { depth, size } = tableSize(name, rows, params.depth, mode)
    if (lanes.length === 0) throw Error(`${name}: a checker needs at least one lane`)
    if (mode === 'reloaded' && file !== undefined) throw Error(`${name}: a reloaded table loads through its load port, not from ${file}`)
    if (mode === 'preloaded' && file === undefined) throw Error(`${name}: a preloaded checker needs a pattern file`)
    const rowWidth = this.bitWidth(size)
    if (!Number.isInteger(firstRow) || firstRow < 0 || firstRow >= size) throw Error(`${name}: firstRow must be an integer, 0 to ${size - 1}, a row of the table, got ${firstRow}`)
    const layout = VectorChecker.layout(lanes, params.radix)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }
    if (mode === 'reloaded') {
      this.IOs.load_en = { direction: 'input' }
      this.IOs.load_addr = { direction: 'input', width: this.bitWidth(depth - 1) }
      this.IOs.load_data = { direction: 'input', width: layout.wordWidth }
      this.IOs.records = { direction: 'input', width: rowWidth }
    }
    Object.assign(this.IOs, {
      row: { direction: 'input', width: rowWidth },
      fetch: { direction: 'input', width: fetchWidth(size) },
      run: { direction: 'input' }
    })
    for (const lane of lanes) {
      if (lane.port in this.IOs || INTERNAL.includes(lane.port) || LOAD_PORTS.includes(lane.port)) throw Error(`${name}: lane ${lane.port} has the name of another port or signal`)
      this.IOs[lane.port] = { direction: 'input', width: lane.width }
      this.IOs[`fail_${lane.port}`] = { direction: 'output' }
    }

    // This row's expected values and care bits, from the table's memory
    const memBindings: Record<string, string> = { clk: 'clk', rd_addr: tableAddress(this, depth, size), care: 'care' }
    if (mode === 'reloaded') Object.assign(memBindings, { load_en: 'load_en', load_addr: 'load_addr', load_data: 'load_data' })
    for (const lane of lanes) {
      this.addSignal(`expect_${lane.port}`, { width: lane.width })
      memBindings[lane.port] = `expect_${lane.port}`
    }
    this.addSignal('care', { width: lanes.length })
    this.addSubmodule('pattern', new PatternMemory({ name: `PatternMemory_${name}`, layout, depth, mode, file }), memBindings, false)
    this.memories.push({ path: 'pattern', depth, layout, mode, file, records: rows, table: true })

    // Whether this cycle is checked: the table is running, on a row from firstRow up to the last
    this.addSignal('checking', { width: 1 })
    const count = mode === 'preloaded' ? `${rowWidth}'d${rows}` : 'records'
    const inTable = `row < ${count}${firstRow > 0 ? ` && row >= ${rowWidth}'d${firstRow}` : ''}`
    this.addAssign({ in: new Expr(`run && ${inTable}`), out: 'checking' })

    lanes.forEach((lane, i) => {
      const p = lane.port
      // The lane's care bit: the first lane's is the most significant
      const care = lanes.length === 1 ? 'care' : `care[${lanes.length - 1 - i}]`
      this.addSignal(`miss_${p}`, { width: 1 })
      this.addAssign({ in: new Expr(`checking && ${care} && (${p} != expect_${p})`), out: `miss_${p}` })

      this.addRegister({ d: new Expr(`fail_${p} | miss_${p}`), clk: 'clk', reset: 'rst_b', q: `fail_${p}` })
      this.addSignal(`err_row_${p}`, { width: rowWidth })
      this.addSignal(`err_got_${p}`, { width: lane.width })
      this.addSignal(`err_want_${p}`, { width: lane.width })
      const first = new Expr(`miss_${p} && !fail_${p}`)
      this.addRegister({ d: new Expr(`row - ${rowWidth}'d${firstRow}`), clk: 'clk', reset: 'rst_b', en: first, q: `err_row_${p}` })
      this.addRegister({ d: p, clk: 'clk', reset: 'rst_b', en: first, q: `err_got_${p}` })
      this.addRegister({ d: `expect_${p}`, clk: 'clk', reset: 'rst_b', en: first, q: `err_want_${p}` })
    })
  }

  /**
   * The record layout of a checker's pattern file: one field per lane, named after its port,
   * then `care`, one bit per lane with the first lane's in the most significant bit.
   */
  static layout (lanes: CheckLane[], radix: Radix = 'h'): RecordLayout {
    return recordLayout([...lanes.map(l => ({ name: l.port, width: l.width })), { name: 'care', width: lanes.length }], radix)
  }

  /**
   * A checker's pattern file: row r holds each lane's expected row-r value and its care bit. An
   * `undefined` value is a don't-care: its care bit is 0, and its value is written as 0.
   */
  static records (lanes: TableLane[], rows: number): PatternRecord[] {
    for (const l of lanes) {
      if (l.values.length !== rows) throw Error(`VectorChecker.records: lane ${l.port} has ${l.values.length} rows, not ${rows}`)
    }
    return Array.from({ length: rows }, (_, r) => {
      const record: PatternRecord = Object.fromEntries(lanes.map(l => [l.port, l.values[r] ?? 0n]))
      record.care = lanes.reduce((bits, l) => (bits << 1n) | (l.values[r] === undefined ? 0n : 1n), 0n)
      return record
    })
  }

  /**
   * What SimTop prints when lane `port` fails, for a checker at `path` inside the harness
   * (`wave.chk`). `cycleName` names the row count, as the table's reader knows it.
   */
  static firstError (path: string, port: string, cycleName = 'row'): CheckDetail {
    return {
      format: `first differs in ${cycleName} %0d: %h, expected %h`,
      args: [`${path}.err_row_${port}`, `${path}.err_got_${port}`, `${path}.err_want_${port}`]
    }
  }
}

export default VectorChecker

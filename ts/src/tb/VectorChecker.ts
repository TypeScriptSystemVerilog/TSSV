import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { addRowTable } from './VectorPlayer.js'
import { type CheckDetail } from './Harness.js'

/** One lane a VectorChecker compares. */
export interface CheckLane {
  /** The input port the lane is read on. */
  port: string
  width: number
  /** The value expected in each row. `undefined` is a don't-care. */
  values: Array<bigint | undefined>
}

export interface VectorChecker_Parameters {
  name: string
  /** Rows in the table, as in the VectorPlayer whose `row` drives this checker. */
  rows: number
  lanes: CheckLane[]
  /** Rows before this one are not checked, and error rows are counted from it. Default 0. */
  firstRow?: number
}

/**
 * VectorChecker — checks lanes against a table, one row per clock cycle, with the `row` of the
 * VectorPlayer that drives the same table. At the rising edge that ends the cycle in which
 * `row` = r, each lane must equal its row-r value. Rows before `firstRow`, rows from `rows` on,
 * and don't-care entries are not checked.
 *
 * Ports: `clk`, `rst_b`, `row` and one input per lane in; per lane, `fail_<port>` out, which
 * rises at the lane's first mismatch and stays high.
 *
 * Per lane, `err_row_<port>`, `err_got_<port>` and `err_want_<port>` hold that first mismatch:
 * its row, counted from `firstRow`, the lane's value and the table's. They are not ports: SimTop
 * prints them by hierarchical reference (`firstError()`).
 */
export class VectorChecker extends TSSV.Module {
  constructor (params: VectorChecker_Parameters) {
    super({ name: params.name })
    const rows = params.rows
    const firstRow = params.firstRow ?? 0
    const rowWidth = this.bitWidth(rows)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      row: { direction: 'input', width: rowWidth }
    }

    for (const lane of params.lanes) {
      if (lane.values.length !== rows) throw Error(`${params.name}: lane ${lane.port} has ${lane.values.length} rows, not ${rows}`)
      if (lane.port in this.IOs) throw Error(`${params.name}: lane ${lane.port} has the name of another port`)
      const p = lane.port
      this.IOs[p] = { direction: 'input', width: lane.width }
      this.IOs[`fail_${p}`] = { direction: 'output' }

      // This row's expected value, whether it is checked, and whether the lane differs from it
      this.addSignal(`expect_${p}`, { width: lane.width })
      this.addSignal(`care_${p}`, { width: 1 })
      this.addSignal(`miss_${p}`, { width: 1 })
      addRowTable(this, `expect_${p}`, 'row', lane.width, lane.values.map(v => v ?? 0n), 0n)
      addRowTable(this, `care_${p}`, 'row', 1, lane.values.map((v, r) => r >= firstRow && v !== undefined ? 1n : 0n), 0n)
      this.addAssign({ in: new Expr(`care_${p} && (${p} != expect_${p})`), out: `miss_${p}` })

      this.addRegister({ d: new Expr(`fail_${p} | miss_${p}`), clk: 'clk', reset: 'rst_b', q: `fail_${p}` })
      this.addSignal(`err_row_${p}`, { width: rowWidth })
      this.addSignal(`err_got_${p}`, { width: lane.width })
      this.addSignal(`err_want_${p}`, { width: lane.width })
      const first = new Expr(`miss_${p} && !fail_${p}`)
      this.addRegister({ d: new Expr(`row - ${rowWidth}'d${firstRow}`), clk: 'clk', reset: 'rst_b', en: first, q: `err_row_${p}` })
      this.addRegister({ d: p, clk: 'clk', reset: 'rst_b', en: first, q: `err_got_${p}` })
      this.addRegister({ d: `expect_${p}`, clk: 'clk', reset: 'rst_b', en: first, q: `err_want_${p}` })
    }
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

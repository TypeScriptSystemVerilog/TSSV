import TSSV, { Expr } from 'tssv/lib/core/TSSV'

/** One lane a VectorPlayer drives. */
export interface DriveLane {
  /** The output port that drives the lane. */
  port: string
  width: number
  /** The value in each row. `undefined` drives 0. */
  values: Array<bigint | undefined>
  /** Drive the lane from a flop, as a reset must be (SV guide RST-4), rather than from logic. */
  registered?: boolean
}

export interface VectorPlayer_Parameters {
  name: string
  /** Rows in the table. Every lane has this many values. */
  rows: number
  lanes: DriveLane[]
}

/** `v` as a sized SV literal of `width` bits. */
export const literal = (width: number, v: bigint): string => `${width}'h${v.toString(16)}`

/**
 * Drives `out` with `values[row]` in a case table on `sel`, a counter that runs from 0 to
 * `values.length`, and with `after` once it gets there. A lane with only one value is an assign.
 * The table has one entry more than `values`, so `sel` is exactly as wide as the case needs.
 */
export function addRowTable (m: TSSV.Module, out: string, sel: string, width: number, values: bigint[], after: bigint): void {
  if (values.every(v => v === after)) {
    m.addAssign({ in: new Expr(literal(width, after)), out })
    return
  }
  m.addMux({ in: [...values, after].map(v => new Expr(literal(width, v))), sel, out, default: new Expr(literal(width, after)) })
}

/**
 * VectorPlayer — drives a table one row per clock cycle. During the cycle in which `row` = r,
 * every lane carries its row-r value. `row` is 0 from reset, counts up by one each rising edge
 * and stops at `rows`, where `done` goes high and each lane holds its last value.
 *
 * Ports: `clk`, `rst_b` in; `row`, `done` and one output per lane out.
 *
 * A lane is driven one of three ways:
 *
 *   - a lane with the same value in every row is a constant;
 *   - a `registered` lane is a flop, loaded from a case table one row ahead, that holds its
 *     row-0 value through reset;
 *   - any other lane is a case table on `row`.
 */
export class VectorPlayer extends TSSV.Module {
  constructor (params: VectorPlayer_Parameters) {
    super({ name: params.name })
    const rows = params.rows
    const rowWidth = this.bitWidth(rows)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      row: { direction: 'output', width: rowWidth },
      done: { direction: 'output' }
    }
    this.addAssign({ in: new Expr(`row == ${rowWidth}'d${rows}`), out: 'done' })
    this.addRegister({ d: new Expr(`row + ${rowWidth}'d1`), clk: 'clk', reset: 'rst_b', en: '!done', q: 'row' })

    for (const lane of params.lanes) {
      if (lane.values.length !== rows) throw Error(`${params.name}: lane ${lane.port} has ${lane.values.length} rows, not ${rows}`)
      if (lane.port in this.IOs) throw Error(`${params.name}: lane ${lane.port} has the name of another port`)
      const values = lane.values.map(v => v ?? 0n)
      const last = values[rows - 1] ?? 0n
      this.IOs[lane.port] = { direction: 'output', width: lane.width }
      if (lane.registered !== true || values.every(v => v === last)) {
        addRowTable(this, lane.port, 'row', lane.width, values, last)
      } else {
        const next = `${lane.port}_next`
        this.addSignal(next, { width: lane.width })
        addRowTable(this, next, 'row', lane.width, [...values.slice(1), last], last)
        this.addRegister({ d: next, clk: 'clk', reset: 'rst_b', resetVal: values[0], q: lane.port })
      }
    }
  }
}

export default VectorPlayer

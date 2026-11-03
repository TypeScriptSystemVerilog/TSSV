import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { RATE_WIDTH } from './Throttle.js'

/** One phase of traffic. A rate is a chance in 256 per cycle: 0 is never, 256 is every cycle. */
export interface TrafficPhase {
  name: string
  /** Chance that an injector not already holding a record offers one. */
  validRate: number
  /** Chance that a checker is ready. */
  readyRate: number
  /** Raises `full_rate` during the phase, for the checks that only hold at full rate. */
  fullRate?: boolean
}

/**
 * The phases most stream testbenches run. The random phases leave the DUT in arbitrary states,
 * and the last phase checks full rate again from there.
 */
export const STANDARD_PHASES: TrafficPhase[] = [
  { name: 'F1 full rate', validRate: 256, readyRate: 256, fullRate: true },
  { name: 'R1 random valid and ready', validRate: 128, readyRate: 128 },
  { name: 'R2 heavy backpressure', validRate: 256, readyRate: 64 },
  { name: 'R3 occasional stalls', validRate: 256, readyRate: 224 },
  { name: 'R4 sparse traffic', validRate: 64, readyRate: 192 },
  { name: 'F2 full rate again', validRate: 256, readyRate: 256, fullRate: true }
]

export interface TrafficPhases_Parameters extends TSSV.TSSVParameters {
  /** Default STANDARD_PHASES. */
  phases?: TrafficPhase[]
  /** Records each phase sends. */
  recordsPerPhase: number
  /** Cycles a phase may run before `stuck` rises. */
  timeout: number
  /** Cycles after the last phase drains before `done` rises. Default 16. */
  quietCycles?: number
}

/**
 * TrafficPhases — runs a table of traffic phases for the injectors and checkers of a harness
 * (doc/framework/testbench.md, "Record streams"). Phase p sends records until
 * `limit` = (p+1) · recordsPerPhase have been sent, at its valid and ready rates, and moves on
 * once `drained` says every one of them has arrived.
 *
 * After the last phase it waits `quietCycles` with every checker ready and no injector offering,
 * so that any record the DUT still delivers is taken and checked, and raises `done`.
 *
 * Ports: `clk`, `rst_b`, `drained` in; `valid_rate`, `ready_rate`, `limit`, `full_rate`, `done`
 * and `stuck` out. `stuck` rises, and stays high, if a phase runs for `timeout` cycles.
 */
export class TrafficPhases extends TSSV.Module {
  /** Width of `limit`: the `limitWidth` of the injectors and checkers it drives. */
  readonly countWidth: number

  constructor (params: TrafficPhases_Parameters) {
    const phases = params.phases ?? STANDARD_PHASES
    const n = params.recordsPerPhase
    const quietCycles = params.quietCycles ?? 16
    if (phases.length === 0) throw Error('TrafficPhases: phases is empty')
    for (const p of phases) {
      for (const r of [p.validRate, p.readyRate]) {
        if (!Number.isInteger(r) || r < 0 || r > 256) throw Error(`TrafficPhases: phase ${p.name} has rate ${r}; a rate is 0 to 256`)
      }
    }
    if (!Number.isInteger(n) || n < 1) throw Error(`TrafficPhases: recordsPerPhase must be a positive integer, got ${n}`)
    if (!Number.isInteger(params.timeout) || params.timeout < 1) throw Error(`TrafficPhases: timeout must be a positive integer, got ${params.timeout}`)
    if (!Number.isInteger(quietCycles) || quietCycles < 1) throw Error(`TrafficPhases: quietCycles must be a positive integer, got ${quietCycles}`)
    super({ name: params.name, phases, recordsPerPhase: n, timeout: params.timeout, quietCycles })

    const last = phases.length // phase = last is the quiet time at the end
    const phaseWidth = this.bitWidth(last)
    const timerWidth = this.bitWidth(Math.max(params.timeout, quietCycles))
    this.countWidth = this.bitWidth(last * n)

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      drained: { direction: 'input' },
      valid_rate: { direction: 'output', width: RATE_WIDTH },
      ready_rate: { direction: 'output', width: RATE_WIDTH },
      limit: { direction: 'output', width: this.countWidth },
      full_rate: { direction: 'output' },
      done: { direction: 'output' },
      stuck: { direction: 'output' }
    }

    // The phase, and the cycles spent in it. The timer wraps only after stuck has risen
    this.addSignal('phase', { width: phaseWidth })
    this.addSignal('timer', { width: timerWidth })
    this.addSignal('advance', { width: 1 })
    this.addSignal('ending', { width: 1 })
    this.addAssign({ in: new Expr(`phase == ${phaseWidth}'d${last}`), out: 'ending' })
    this.addAssign({ in: new Expr('drained && !ending'), out: 'advance' })
    this.addRegister({ d: new Expr(`phase + ${phaseWidth}'d1`), clk: 'clk', reset: 'rst_b', en: 'advance', q: 'phase' })
    this.addRegister({ d: new Expr(`advance ? ${timerWidth}'d0 : ${timerWidth}'(timer + ${timerWidth}'d1)`), clk: 'clk', reset: 'rst_b', en: '!done', q: 'timer' })

    // What each phase asks of the injectors and checkers. In the quiet time checkers are ready,
    // and no injector offers a record
    this.addPhaseTable('valid_rate', RATE_WIDTH, phases.map(p => BigInt(p.validRate)), 0n)
    this.addPhaseTable('ready_rate', RATE_WIDTH, phases.map(p => BigInt(p.readyRate)), 256n)
    this.addPhaseTable('limit', this.countWidth, phases.map((_, i) => BigInt((i + 1) * n)), BigInt(last * n))
    this.addPhaseTable('full_rate', 1, phases.map(p => p.fullRate === true ? 1n : 0n), 0n)

    // The end, or a phase that never drains
    this.addAssign({ in: new Expr(`ending && timer == ${timerWidth}'d${quietCycles}`), out: 'done' })
    this.addRegister({ d: new Expr(`stuck | (!ending && timer == ${timerWidth}'d${params.timeout})`), clk: 'clk', reset: 'rst_b', q: 'stuck' })
  }

  /**
   * Drives `out` with `values[phase]`, and with `quiet` in the quiet time and beyond. An output
   * with one value throughout is a constant.
   */
  private addPhaseTable (out: string, width: number, values: bigint[], quiet: bigint): void {
    const literal = (v: bigint): Expr => new Expr(`${width}'d${v}`)
    if (values.every(v => v === quiet)) {
      this.addAssign({ in: literal(quiet), out })
      return
    }
    this.addMux({ in: [...values, quiet].map(literal), sel: 'phase', out, default: literal(quiet) })
  }
}

export default TrafficPhases

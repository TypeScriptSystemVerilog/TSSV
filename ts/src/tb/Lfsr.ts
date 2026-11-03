import TSSV, { Expr } from 'tssv/lib/core/TSSV'

export interface Lfsr_Parameters extends TSSV.TSSVParameters {
  /** State width: 32 or 64 bits. Default 64. */
  width?: 32 | 64
  /** The state after reset. Not 0, which xorshift never leaves. */
  seed: bigint
  /** Bits of the state on `value`, from bit 0. Default `width`. */
  outWidth?: number
  /**
   * Adds `load` and `seed_in`, to restart the sequence at a seed chosen at run time, such as one
   * a pattern memory holds. Default false.
   */
  loadable?: boolean
}

/** Marsaglia's xorshift shift triples (left, right, left), each giving a full-period sequence. */
const SHIFTS = { 32: [13, 17, 5], 64: [13, 7, 17] } as const

/**
 * Lfsr — a xorshift pseudo-random sequence (Marsaglia, "Xorshift RNGs", 2003). `state` moves to
 * the next value at each rising edge with `step` high, and visits every non-zero value before it
 * repeats. Two Lfsrs with the same seed step through the same values, which is how a source and a
 * checker agree on what was sent without a channel between them.
 *
 * Ports: `clk`, `rst_b`, `step` in; `value`, the low `outWidth` bits of the state, out. The rest
 * of the state still feeds the next value, so a reader that needs 8 random bits takes 8.
 *
 * A loadable Lfsr also has `load` and `seed_in` in. While `load` is high, the sequence restarts at
 * `seed_in`: `value` shows `seed_in`'s low bits in that same cycle, and a step moves the state to
 * the value after `seed_in`. A `seed_in` of 0 would hold the state at 0, so whoever drives `load`
 * leaves it low for a seed of 0. An injector does this to restart its payloads at each seed a
 * record carries.
 */
export class Lfsr extends TSSV.Module {
  constructor (params: Lfsr_Parameters) {
    const w = params.width ?? 64
    const outWidth = params.outWidth ?? w
    const loadable = params.loadable ?? false
    if (params.seed <= 0n || params.seed >= 1n << BigInt(w)) {
      throw Error(`Lfsr: seed must be a non-zero ${w}-bit value, got ${params.seed}`)
    }
    if (!Number.isInteger(outWidth) || outWidth < 1 || outWidth > w) {
      throw Error(`Lfsr: outWidth must be 1 to ${w}, got ${outWidth}`)
    }
    // loadable joins the name only when true, so an Lfsr that leaves it out and one that passes
    // false are the same module, with the name it had before the option existed (PARAM-2)
    super({ name: params.name, width: w, seed: params.seed, outWidth, ...(loadable ? { loadable } : {}) })

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      step: { direction: 'input' }
    }
    if (loadable) {
      this.IOs.load = { direction: 'input' }
      this.IOs.seed_in = { direction: 'input', width: w }
    }
    this.IOs.value = { direction: 'output', width: outWidth }

    // The value the sequence is at this cycle: the state, or the seed being loaded
    const [a, b, c] = SHIFTS[w]
    this.addSignal('state', { width: w })
    let cur = 'state'
    if (loadable) {
      cur = 'cur'
      this.addSignal('cur', { width: w })
      this.addAssign({ in: new Expr('load ? seed_in : state'), out: 'cur' })
    }

    // The step to the value after it
    this.addSignal('mix_a', { width: w })
    this.addSignal('mix_b', { width: w })
    this.addSignal('next', { width: w })
    this.addAssign({ in: new Expr(`${cur} ^ (${cur} << ${a})`), out: 'mix_a' })
    this.addAssign({ in: new Expr(`mix_a ^ (mix_a >> ${b})`), out: 'mix_b' })
    this.addAssign({ in: new Expr(`mix_b ^ (mix_b << ${c})`), out: 'next' })
    this.addRegister({ d: 'next', clk: 'clk', reset: 'rst_b', resetVal: params.seed, en: 'step', q: 'state' })
    this.addAssign({ in: new Expr(outWidth === w ? cur : `${cur}[${outWidth - 1}:0]`), out: 'value' })
  }
}

export default Lfsr

/*
* A linear-feedback shift register of any width, in Fibonacci form: at each step the state shifts up
* `advance` stages, and each new bit 0 is the XOR of the stages the feedback polynomial taps
*/
import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { gcd, isPrimitive, maximalPeriod, resolvePolynomial, type Polynomial } from './polynomial.js'

/**
 * configuration parameters of the LFSR module
 */
export interface LFSR_Parameters extends TSSVParameters {
  /** The state's width in bits, 2 or more. A polynomial can be checked for maximal length up to 168 */
  width: bigint
  /**
   * The feedback polynomial, of degree `width`, as a string (`'x^16 + x^14 + x^13 + x^11 + 1'`) or
   * as its exponents (`[16, 14, 13, 11, 0]`). The term x^k taps stage k, counted from the input,
   * which is state bit k − 1 (doc/modules/LFSR/LFSR-spec.md, "The polynomial"). Default
   * `MAXIMAL_LENGTH[width]`, the library's polynomial for the width.
   */
  polynomial?: Polynomial
  /** The state after reset: a `width`-bit value other than 0, which an LFSR never leaves */
  seed: bigint
  /** How many shifts the state makes per step, 1 or more. Each step still takes one clock. Default 1 */
  advance?: bigint
  /** Bits of the state on `value`, from bit 0: 1 to `width`. Default `width` */
  outWidth?: bigint
  /** Adds `load` and `seed_in`, to restart the sequence at a seed chosen at run time. Default false */
  loadable?: boolean
  /**
   * Builds the LFSR even when its period isn't known to be 2^width − 1: a polynomial that isn't
   * maximal-length, an advance that shares a factor with 2^width − 1, or a width above 168, where
   * the polynomial can't be checked. It doesn't change the SV, so it isn't in the module's name.
   * Default false
   */
  allowShortPeriod?: boolean
}

/**
 * LFSR — a linear-feedback shift register: a pseudo-random sequence that visits every non-zero
 * `width`-bit state before it repeats, when its polynomial is maximal-length. `state_q` moves on at
 * each rising edge with `step` high, by `advance` shifts. Two LFSRs with the same parameters and seed
 * step through the same values, and `LFSRModel` (model.ts) predicts them.
 *
 * Ports: `clk`, `rst_n`, `step` in; `value`, the low `outWidth` bits of the state, out. With
 * `advance` at least `outWidth`, each value is a fresh window of the sequence.
 *
 * A loadable LFSR also has `load` and `seed_in` in. While `load` is high, the sequence restarts at
 * `seed_in`: `value` shows `seed_in`'s low bits in that same cycle, and a step moves the state on from
 * `seed_in`. A `seed_in` of 0 would hold the state at 0, so whoever drives `load` leaves it low for a
 * seed of 0.
 *
 * @see doc/modules/LFSR/LFSR-spec.md
 */
export class LFSR extends Module {
  declare params: LFSR_Parameters
  constructor (params: LFSR_Parameters) {
    // The polynomial in canonical form, worked out first, so that every way of writing it gives the
    // same module and name (PARAM-2). It also checks the width and the polynomial's form.
    const poly = resolvePolynomial('LFSR', params.width, params.polynomial)
    super({
      name: params.name,
      width: params.width,
      polynomial: poly.text,
      seed: params.seed,
      advance: params.advance ?? 1n,
      outWidth: params.outWidth ?? params.width,
      loadable: params.loadable ?? false
    })

    // parameter checks (PARAM-5)
    const w = Number(params.width)
    const seed = params.seed
    const advance = params.advance ?? 1n
    const outWidth = params.outWidth ?? params.width
    const loadable = params.loadable ?? false
    if (typeof seed !== 'bigint' || seed <= 0n || seed >= 1n << params.width) {
      throw Error(`LFSR: seed must be a non-zero ${w}-bit value (0 is the lock-up state, which an LFSR never leaves), got ${String(seed)}`)
    }
    if (typeof outWidth !== 'bigint' || outWidth < 1n || outWidth > params.width) {
      throw Error(`LFSR: outWidth must be 1 to ${w}, got ${String(outWidth)}`)
    }
    if (typeof advance !== 'bigint' || advance < 1n) {
      throw Error(`LFSR: advance must be 1 or more, got ${String(advance)}`)
    }
    if (params.allowShortPeriod !== true) {
      const states = (1n << params.width) - 1n
      const unless = 'or pass allowShortPeriod: true to build it anyway'
      const primitive = isPrimitive(poly)
      if (primitive === undefined) {
        throw Error(`LFSR: polynomial ${poly.text} can't be checked for maximal length, since the factor table covers widths 2 to 168; ${unless}`)
      }
      if (!primitive) {
        throw Error(`LFSR: polynomial ${poly.text} isn't maximal-length (it isn't primitive), so its sequence repeats before visiting all ${states} non-zero states. ` +
          `Use MAXIMAL_LENGTH[${w}], ${unless}`)
      }
      const g = gcd(advance, states)
      if (g !== 1n) {
        throw Error(`LFSR: an advance of ${advance} shares the factor ${g} with 2^${w} − 1 = ${states}, so the sequence repeats after ${maximalPeriod(w, advance)} steps instead of ${states}. ` +
          `Pick an advance with no factor in common with ${states} (any power of 2 has none), ${unless}`)
      }
    }

    // derived values: which bits of the current state make up each bit of the next one. Bit i of
    // the state is bit i of the current state to begin with; each shift moves every bit up a stage
    // and puts the XOR of the tapped stages in bit 0.
    const n = Number(advance)
    let masks = Array.from({ length: w }, (_, i) => 1n << BigInt(i))
    for (let s = 0; s < n; s++) {
      const fb = poly.taps.reduce((x, k) => x ^ (masks[k - 1] ?? 0n), 0n)
      masks = [fb, ...masks.slice(0, w - 1)]
    }

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_n: { direction: 'input', isReset: 'lowasync' },
      step: { direction: 'input' }
    }
    if (loadable) {
      this.IOs.load = { direction: 'input' }
      this.IOs.seed_in = { direction: 'input', width: w }
    }
    this.IOs.value = { direction: 'output', width: Number(outWidth) }

    // The state the sequence is at this cycle: the register, or the seed being loaded
    this.addSignal('state_q', { width: w })
    let cur = 'state_q'
    if (loadable) {
      cur = 'cur'
      this.addSignal('cur', { width: w })
      this.addAssign({ in: new Expr('load ? seed_in : state_q'), out: 'cur' })
    }

    // The state `advance` shifts on: the bits that only move, as one slice, then each new bit, as
    // the XOR of the bits of cur that make it up
    const bit = (i: number): string => `${cur}[${i}]`
    const xorOf = (mask: bigint): string => {
      const bits: string[] = []
      for (let i = w - 1; i >= 0; i--) if (((mask >> BigInt(i)) & 1n) !== 0n) bits.push(bit(i))
      return bits.join(' ^ ')
    }
    const fresh = Math.min(n, w)
    const parts: string[] = []
    if (n < w) parts.push(w - 1 - n === 0 ? bit(0) : `${cur}[${w - 1 - n}:0]`)
    for (let i = fresh - 1; i >= 0; i--) parts.push(xorOf(masks[i] ?? 0n))
    this.addSignal('state_nxt', { width: w })
    this.addAssign({ in: new Expr(`{${parts.join(', ')}}`), out: 'state_nxt' })
    this.addRegister({ d: 'state_nxt', clk: 'clk', reset: 'rst_n', resetVal: seed, en: 'step', q: 'state_q' })

    // The value: the low outWidth bits of the current state
    const ow = Number(outWidth)
    this.addAssign({ in: new Expr(ow === w ? cur : ow === 1 ? bit(0) : `${cur}[${ow - 1}:0]`), out: 'value' })
  }
}

export default LFSR

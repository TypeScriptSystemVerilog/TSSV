import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { LFSR } from '../modules/LFSR/LFSR.js'

/** A rate is a chance in 256 per cycle, 0 (never) to 256 (every cycle), so 9 bits. */
export const RATE_WIDTH = 9

/** The salt of an injector's throttle, which decides when it offers a record (`drawSeed()`). */
export const VALID_SALT = 0x9E3779B1n

/** The salt of a checker's throttle, which decides when it is ready (`drawSeed()`). */
export const READY_SALT = 0x85EBCA6Bn

/**
 * The seed of a Throttle, from a stream's seed and a salt: the two multiplied, cut to 32 bits, and
 * made odd, so never 0. The odd 32-bit salt spreads a small seed over the whole state, and an
 * injector and a checker given one stream seed draw apart, since their salts differ (VALID_SALT,
 * READY_SALT).
 */
export function drawSeed (seed: bigint, salt: bigint): bigint {
  return ((seed * salt) & 0xFFFFFFFFn) | 1n
}

export interface Throttle_Parameters extends TSSV.TSSVParameters {
  /** The draws' seed: a non-zero 32-bit value, such as `drawSeed(seed, VALID_SALT)`. */
  seed: bigint
}

/**
 * Throttle — allows a cycle with a chance of `rate` in 256 (doc/framework/testbench.md, "Record
 * streams"). An injector uses one to decide when to offer a record, and a checker to decide when
 * to be ready.
 *
 * Ports: `clk`, `rst_b`, `rate` in; `allow` out.
 *
 * Each cycle draws 8 bits from a 32-bit LFSR that steps every cycle, 8 shifts at a time, and
 * `allow` is `{1'b0, draw} < rate`: rate 0 never allows, and rate 256 always does. Each draw is the
 * next 8 bits of the LFSR's sequence, so two in a row share no bits, and over its period every pair
 * of draws comes up equally often (the all-zero pair once less). So each cycle is allowed as an
 * independent coin with p = rate / 256. `allow` comes from the LFSR's state and `rate` through a
 * compare, so it follows `rate` within the cycle.
 */
export class Throttle extends TSSV.Module {
  constructor (params: Throttle_Parameters) {
    if (params.seed <= 0n || params.seed >= 1n << 32n) {
      throw Error(`Throttle: seed must be a non-zero 32-bit value, got ${params.seed}`)
    }
    super({ name: params.name, seed: params.seed })

    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      rate: { direction: 'input', width: RATE_WIDTH },
      allow: { direction: 'output' }
    }

    // A random byte each cycle, and whether it falls under the rate. A named Throttle names its
    // LFSR after itself; an unnamed one leaves the LFSR its name from its parameters
    this.addSignal('draw', { width: 8 })
    const lfsrName = params.name === undefined ? undefined : `LFSR_${params.name}`
    this.addSubmodule('rate_lfsr', new LFSR({ name: lfsrName, width: 32n, seed: params.seed, outWidth: 8n, advance: 8n }),
      { clk: 'clk', rst_n: 'rst_b', step: 1n, value: 'draw' }, false)
    this.addAssign({ in: new Expr(`{1'b0, draw} < rate`), out: 'allow' })
  }
}

export default Throttle

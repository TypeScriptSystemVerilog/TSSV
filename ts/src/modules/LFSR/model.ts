// A TypeScript model of the sequence an LFSR produces (doc/modules/LFSR/LFSR-spec.md): what its
// state moves to at each step, and what `value` shows. A generator uses it to predict an LFSR's
// values, such as the payloads an injector fills in from a seed, and a test checks the LFSR's RTL
// against it.
//
// The model shifts a concrete state one place at a time, `advance` times per step. The RTL works out
// the same `advance` shifts once, symbolically, as one XOR network per bit (LFSR.ts). A test of the
// RTL against the model then checks that construction.
import { resolvePolynomial, type Polynomial } from './polynomial.js'

/** The parameters that decide an LFSR's sequence: LFSR_Parameters' `width`, `polynomial`, `advance` and `outWidth` */
export interface LFSRModel_Parameters {
  width: bigint
  polynomial?: Polynomial
  advance?: bigint
  outWidth?: bigint
}

/** The sequence of an LFSR with the given parameters, with LFSR's defaults */
export class LFSRModel {
  /** The state's width */
  readonly width: number
  /** The tapped stages, highest first: the polynomial's exponents from 1 up */
  readonly taps: readonly number[]
  /** Shifts per step */
  readonly advance: number
  /** Bits of the state on `value` */
  readonly outWidth: number
  /** The polynomial in canonical form */
  readonly polynomial: string

  constructor (params: LFSRModel_Parameters) {
    const p = resolvePolynomial('LFSRModel', params.width, params.polynomial)
    this.width = Number(params.width)
    this.taps = p.taps
    this.polynomial = p.text
    this.advance = Number(params.advance ?? 1n)
    this.outWidth = Number(params.outWidth ?? params.width)
  }

  /** The state after one shift: every bit moves up a stage, and bit 0 takes the XOR of the tapped stages */
  shift (state: bigint): bigint {
    let fb = 0n
    for (const k of this.taps) fb ^= (state >> BigInt(k - 1)) & 1n
    return ((state << 1n) & ((1n << BigInt(this.width)) - 1n)) | fb
  }

  /** The state after one step: `advance` shifts */
  next (state: bigint): bigint {
    for (let i = 0; i < this.advance; i++) state = this.shift(state)
    return state
  }

  /** What `value` shows while the LFSR is at `state`: its low `outWidth` bits */
  value (state: bigint): bigint {
    return state & ((1n << BigInt(this.outWidth)) - 1n)
  }

  /** The first `n` values from `seed`, step by step: what an LFSR reset to `seed` shows on `value` */
  values (seed: bigint, n: number): bigint[] {
    const out: bigint[] = []
    let state = seed
    for (let i = 0; i < n; i++) {
      out.push(this.value(state))
      state = this.next(state)
    }
    return out
  }
}

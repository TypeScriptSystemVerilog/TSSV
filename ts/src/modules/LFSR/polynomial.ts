// The feedback polynomial of an LFSR (doc/modules/LFSR/LFSR-spec.md, "The polynomial"): its two
// written forms, the canonical form both become, and the exact test of whether it is maximal-length.
import { MAXIMAL_LENGTH } from './polynomials.js'
import { MERSENNE_FACTORS } from './mersenneFactors.js'

/**
 * An LFSR's feedback polynomial, in either of two forms that mean the same thing:
 *
 * - a string, as sources print it: `'x^16 + x^14 + x^13 + x^11 + 1'`. Each term is `x^k`, `x` (for
 *   x^1) or `1` (for x^0); the terms are joined by `+`, in any order, with any spacing;
 * - the exponents of its terms, the width and 0 included: `[16, 14, 13, 11, 0]`.
 *
 * The term x^k, for k from 1 to the width, taps stage k, counted from the input: state bit k − 1.
 * The `1` is the input itself. Its highest term is x^width, and it always has the `1`.
 */
export type Polynomial = string | readonly number[]

/** A polynomial in canonical form */
export interface NormalizedPolynomial {
  /** The canonical text: the terms highest first, as `x^k`, `x` and `1`, joined by ` + ` */
  text: string
  /** The tapped stages, highest first: every exponent from 1 up, so the first is the width */
  taps: number[]
  /** The polynomial as bits: bit k is the coefficient of x^k */
  bits: bigint
}

/** One term as text: `x^k`, `x` or `1` */
function termText (k: number): string {
  return k === 0 ? '1' : k === 1 ? 'x' : `x^${k}`
}

/** The canonical text of the polynomial with these exponents: highest first, joined by ` + ` */
export function formatPolynomial (exponents: readonly number[]): string {
  return [...exponents].sort((a, b) => b - a).map(termText).join(' + ')
}

// One term of a written polynomial: x^k (spaces allowed around the ^), capturing k; or a bare x,
// capturing it; or 1, capturing it
const TERM = /^(?:x\s*\^\s*(\d+)|(x)|(1))$/

/**
 * `polynomial` in canonical form, checked to be a polynomial for an LFSR of `width` bits: terms
 * that are all x^k, x or 1, none twice, the highest x^width, and the `1`. `what` starts each
 * error message.
 */
export function normalizePolynomial (what: string, width: number, polynomial: Polynomial): NormalizedPolynomial {
  const isText = typeof polynomial === 'string'
  // The type rules the rest out; this catches callers from JavaScript (PARAM-5)
  if (!isText && !Array.isArray(polynomial as unknown)) {
    throw Error(`${what}: polynomial must be a string such as 'x^4 + x^3 + 1' or a list of exponents such as [4, 3, 0], got ${String(polynomial)}`)
  }
  const shown = isText ? `'${polynomial}'` : `[${polynomial.join(', ')}]`
  const exponents: number[] = isText
    ? polynomial.split('+').map(t => {
      const term = t.trim()
      const m = TERM.exec(term)
      if (m === null) throw Error(`${what}: polynomial ${shown} has a term "${term}" that isn't x^k, x or 1`)
      return m[1] !== undefined ? Number(m[1]) : m[2] !== undefined ? 1 : 0
    })
    : polynomial.map(k => {
      if (!Number.isInteger(k) || k < 0) throw Error(`${what}: polynomial ${shown} has an exponent ${k} that isn't an integer 0 or more`)
      return k
    })
  if (exponents.length === 0) throw Error(`${what}: polynomial ${shown} has no terms`)
  const seen = new Set<number>()
  for (const k of exponents) {
    if (seen.has(k)) throw Error(`${what}: polynomial ${shown} has the term ${termText(k)} twice`)
    seen.add(k)
  }
  const degree = Math.max(...exponents)
  if (degree !== width) {
    throw Error(`${what}: polynomial ${shown} has degree ${degree}, but the width is ${width}: its highest term must be x^${width}`)
  }
  const descending = [...exponents].sort((a, b) => b - a)
  if (!seen.has(0)) {
    const fix = isText
      ? `add the 1: '${formatPolynomial([...descending, 0])}'`
      : `a tap list, such as XAPP052's, leaves the 0 out: write [${[...descending, 0].join(', ')}]`
    throw Error(`${what}: polynomial ${shown} has no 1 (x^0) term; ${fix}`)
  }
  return {
    text: formatPolynomial(descending),
    taps: descending.filter(k => k > 0),
    bits: descending.reduce((b, k) => b | (1n << BigInt(k)), 0n)
  }
}

/**
 * The polynomial for an LFSR of `width` bits: `polynomial` in canonical form, or without one, the
 * library's for the width (`MAXIMAL_LENGTH`). Checks that `width` is an integer of 2 or more.
 */
export function resolvePolynomial (what: string, width: bigint, polynomial?: Polynomial): NormalizedPolynomial {
  // The type says bigint; this also catches a number passed from JavaScript (PARAM-5)
  if (typeof width !== 'bigint' || width < 2n) throw Error(`${what}: width must be a bigint of 2 or more, got ${String(width)}`)
  const n = Number(width)
  if (polynomial === undefined) {
    const p = MAXIMAL_LENGTH[n]
    if (p === undefined) throw Error(`${what}: MAXIMAL_LENGTH has no polynomial for width ${n} (it covers 2 to 168), so give one`)
    return normalizePolynomial(what, n, p)
  }
  return normalizePolynomial(what, n, polynomial)
}

/** a · b mod p over GF(2), for a and b of degree below n, where p has degree n */
function mulMod (a: bigint, b: bigint, p: bigint, n: number): bigint {
  const top = 1n << BigInt(n)
  let r = 0n
  while (b !== 0n) {
    if ((b & 1n) !== 0n) r ^= a
    b >>= 1n
    a <<= 1n
    if ((a & top) !== 0n) a ^= p
  }
  return r
}

/** x^e mod p over GF(2), where p has degree n ≥ 2 */
function xPowMod (e: bigint, p: bigint, n: number): bigint {
  let r = 1n
  let base = 2n // x, already of degree below n
  while (e !== 0n) {
    if ((e & 1n) !== 0n) r = mulMod(r, base, p, n)
    base = mulMod(base, base, p, n)
    e >>= 1n
  }
  return r
}

/**
 * Whether `p` is primitive, so that an LFSR with it visits all 2^n − 1 non-zero states before it
 * repeats, n being its degree. Exact: x^(2^n − 1) is 1 modulo p, and x^((2^n − 1) / q) isn't, for
 * each prime q that divides 2^n − 1 (from MERSENNE_FACTORS). `undefined` for a degree that table
 * doesn't cover (above 168), where the test can't be made.
 */
export function isPrimitive (p: NormalizedPolynomial): boolean | undefined {
  const n = p.taps[0] ?? 0
  const factors = MERSENNE_FACTORS[n]
  if (factors === undefined) return undefined
  const order = (1n << BigInt(n)) - 1n
  if (xPowMod(order, p.bits, n) !== 1n) return false
  return [...new Set(factors)].every(q => xPowMod(order / q, p.bits, n) !== 1n)
}

/** The greatest common divisor of two non-negative bigints */
export function gcd (a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b]
  return a
}

/**
 * The period, in steps, of an LFSR of `width` bits with a primitive polynomial that shifts
 * `advance` times per step: (2^width − 1) / gcd(advance, 2^width − 1). An advance that shares a
 * factor with 2^width − 1 visits only every gcd-th state of the sequence, so it repeats sooner.
 */
export function maximalPeriod (width: number, advance: bigint): bigint {
  const states = (1n << BigInt(width)) - 1n
  return states / gcd(advance, states)
}

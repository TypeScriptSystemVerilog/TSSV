/**
 * Checks of LFSR (ts/src/modules/LFSR/), its polynomials and its TypeScript model that need no
 * simulation, and the SV of every structural configuration, under sv-examples/LFSR/. tb_LFSR
 * (ts/test/tb/test_tbExamples.ts) checks the RTL against the model, cycle by cycle.
 *
 *   - the two forms of a polynomial mean the same thing and make the same module, and each kind of
 *     malformed polynomial is refused with a message that says what is wrong;
 *   - the table of prime factors of 2^n − 1 is right: each list multiplies to 2^n − 1, and every
 *     factor is prime. The maximal-length check relies on it;
 *   - the maximal-length check agrees with a brute-force period for every polynomial of degree 2 to
 *     10, and passes every polynomial in the library;
 *   - the model gives the sequences the spec shows, and the sequences of the other notations the
 *     spec converts from, each run here as its source writes it (doc/modules/LFSR/LFSR-spec.md,
 *     "Converting from other notations");
 *   - each configuration's ports are the spec's, and bad parameters are refused.
 */
import { type Module } from 'tssv/lib/core/TSSV'
import {
  LFSR, LFSRModel, MAXIMAL_LENGTH, PRBS7, PRBS9, PRBS11, PRBS15, PRBS20, PRBS23, PRBS31,
  MERSENNE_FACTORS, isPrimitive, maximalPeriod, normalizePolynomial, type LFSR_Parameters
} from 'tssv/lib/modules/LFSR'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const OUT = 'sv-examples/LFSR'

/** A module's ports, as `<direction> <name>[<width>]` in declaration order */
function ports (m: Module): string[] {
  const IOs = (m as unknown as { IOs: Record<string, { direction: string, width?: number }> }).IOs
  return Object.entries(IOs).map(([name, io]) => `${io.direction} ${name}[${io.width ?? 1}]`)
}

/** The tapped stages of a polynomial, highest first */
const taps = (width: number, p: string | number[]): number[] => normalizePolynomial('test', width, p).taps

/**
 * The period of an LFSR of up to 30 bits from state 1, by stepping it: a brute force, in plain
 * numbers, that shares no code with the model or the maximal-length check
 */
function bruteForcePeriod (width: number, tapped: number[]): number {
  const mask = 2 ** width - 1
  let s = 1
  let n = 0
  do {
    let fb = 0
    for (const k of tapped) fb ^= (s >>> (k - 1)) & 1
    s = ((s << 1) & mask) | fb
    n++
  } while (s !== 1 && n <= mask)
  return n
}

// ---------------------------------------------------------------- the two forms of a polynomial

void test('a string and an exponent list give the same polynomial and the same module', () => {
  const text = normalizePolynomial('test', 16, 'x^16 + x^14 + x^13 + x^11 + 1')
  assert.deepEqual(normalizePolynomial('test', 16, [16, 14, 13, 11, 0]), text)
  assert.equal(text.text, 'x^16 + x^14 + x^13 + x^11 + 1')
  assert.deepEqual(text.taps, [16, 14, 13, 11])
  assert.equal(text.bits, 0x16801n)
  const a = new LFSR({ width: 16n, polynomial: 'x^16 + x^14 + x^13 + x^11 + 1', seed: 1n })
  const b = new LFSR({ width: 16n, polynomial: [0, 11, 13, 14, 16], seed: 1n })
  const c = new LFSR({ width: 16n, polynomial: '1+x^11+x ^ 13+x^14+x^16', seed: 1n })
  assert.equal(a.name, b.name)
  assert.equal(a.name, c.name)
})

void test('x is x^1, and the terms may come in any order', () => {
  assert.equal(normalizePolynomial('test', 2, 'x^2 + x + 1').text, 'x^2 + x + 1')
  assert.equal(normalizePolynomial('test', 2, '1 + x^1 + x^2').text, 'x^2 + x + 1')
  assert.deepEqual(normalizePolynomial('test', 2, [2, 1, 0]).taps, [2, 1])
})

void test('leaving the polynomial out is the same module as passing the library\'s', () => {
  assert.equal(new LFSR({ width: 24n, seed: 5n }).name, new LFSR({ width: 24n, polynomial: MAXIMAL_LENGTH[24], seed: 5n }).name)
})

const MALFORMED: Array<[string, string | number[], RegExp]> = [
  ['a coefficient', 'x^4 + 2x^3 + 1', /polynomial 'x\^4 \+ 2x\^3 \+ 1' has a term "2x\^3" that isn't x\^k, x or 1/],
  ['another variable', 'y^4 + y^3 + 1', /has a term "y\^4" that isn't x\^k, x or 1/],
  ['an empty term', 'x^4 + + 1', /has a term "" that isn't x\^k, x or 1/],
  ['a term twice', 'x^4 + x^3 + x^3 + 1', /polynomial 'x\^4 \+ x\^3 \+ x\^3 \+ 1' has the term x\^3 twice/],
  ['a degree other than the width', 'x^5 + x^3 + 1', /has degree 5, but the width is 4: its highest term must be x\^4/],
  ['no 1, written as a string', 'x^4 + x^3', /polynomial 'x\^4 \+ x\^3' has no 1 \(x\^0\) term; add the 1: 'x\^4 \+ x\^3 \+ 1'/],
  ['no 0, as in a tap list', [4, 3], /polynomial \[4, 3\] has no 1 \(x\^0\) term; a tap list, such as XAPP052's, leaves the 0 out: write \[4, 3, 0\]/],
  ['a negative exponent', [4, -3, 0], /has an exponent -3 that isn't an integer 0 or more/],
  ['no terms', [], /polynomial \[\] has no terms/]
]
for (const [what, p, message] of MALFORMED) {
  void test(`a polynomial with ${what} is refused`, () => { assert.throws(() => new LFSR({ width: 4n, polynomial: p, seed: 1n }), { message }) })
}

// ---------------------------------------------------------------- the factor table

/** b^e mod m */
function modPow (b: bigint, e: bigint, m: bigint): bigint {
  let r = 1n
  b %= m
  while (e > 0n) {
    if ((e & 1n) !== 0n) r = (r * b) % m
    b = (b * b) % m
    e >>= 1n
  }
  return r
}

/**
 * Whether n is prime, by Miller–Rabin with the first 20 primes as bases. Exact below 3.3·10^24, and
 * for larger n, wrong with a chance far below 4^−20.
 */
function isProbablePrime (n: bigint): boolean {
  const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n]
  if (n < 2n) return false
  for (const p of bases) if (n % p === 0n) return n === p
  let d = n - 1n
  let r = 0
  while ((d & 1n) === 0n) { d >>= 1n; r++ }
  return bases.every(a => {
    let x = modPow(a, d, n)
    if (x === 1n || x === n - 1n) return true
    for (let i = 1; i < r; i++) {
      x = (x * x) % n
      if (x === n - 1n) return true
    }
    return false
  })
}

void test('the factor table lists every prime factor of 2^n − 1, for n = 2 to 168', () => {
  for (let n = 2; n <= 168; n++) {
    const factors = MERSENNE_FACTORS[n]
    assert.ok(factors !== undefined, `no factors for n = ${n}`)
    assert.equal(factors.reduce((p, q) => p * q, 1n), (1n << BigInt(n)) - 1n, `the factors for n = ${n} don't multiply to 2^${n} − 1`)
    for (const q of factors) assert.ok(isProbablePrime(q), `${q}, a factor for n = ${n}, isn't prime`)
  }
  assert.equal(MERSENNE_FACTORS[169], undefined)
})

// ---------------------------------------------------------------- the maximal-length check

void test('the maximal-length check agrees with the period, for every polynomial of degree 2 to 10', () => {
  for (let n = 2; n <= 10; n++) {
    // Every polynomial with x^n and 1: each choice of the terms between
    for (let middle = 0; middle < 2 ** (n - 1); middle++) {
      const exponents = [n, 0]
      for (let k = 1; k < n; k++) if (((middle >> (k - 1)) & 1) !== 0) exponents.push(k)
      const p = normalizePolynomial('test', n, exponents)
      assert.equal(isPrimitive(p), bruteForcePeriod(n, p.taps) === 2 ** n - 1, p.text)
    }
  }
})

void test('every polynomial in the library is maximal-length', () => {
  for (let n = 2; n <= 168; n++) {
    const p = MAXIMAL_LENGTH[n]
    assert.ok(p !== undefined, `MAXIMAL_LENGTH has no polynomial for width ${n}`)
    assert.equal(isPrimitive(normalizePolynomial('test', n, p)), true, p)
    if (n <= 20) assert.equal(bruteForcePeriod(n, taps(n, p)), 2 ** n - 1, p)
  }
  assert.equal(MAXIMAL_LENGTH[169], undefined)
  for (const [width, p] of [[7, PRBS7], [9, PRBS9], [11, PRBS11], [15, PRBS15], [20, PRBS20], [23, PRBS23], [31, PRBS31]] as const) {
    assert.equal(isPrimitive(normalizePolynomial('test', width, p)), true, p)
    if (width <= 20) assert.equal(bruteForcePeriod(width, taps(width, p)), 2 ** width - 1, p)
  }
})

void test('XAPP052\'s taps for width 102, which the library replaces, aren\'t maximal-length', () => {
  assert.equal(isPrimitive(normalizePolynomial('test', 102, [102, 101, 36, 35, 0])), false)
  assert.equal(MAXIMAL_LENGTH[102], 'x^102 + x^101 + x^26 + x^25 + 1')
})

void test('a width above the factor table can\'t be checked', () => {
  assert.equal(isPrimitive(normalizePolynomial('test', 169, [169, 34, 0])), undefined)
})

// ---------------------------------------------------------------- the model

void test('x^4 + x^3 + 1 from 0001 visits all 15 non-zero states, as the spec\'s table shows', () => {
  const states = new LFSRModel({ width: 4n, polynomial: 'x^4 + x^3 + 1' }).values(0b0001n, 16)
  assert.deepEqual(states.map(s => s.toString(2).padStart(4, '0')), [
    '0001', '0010', '0100', '1001', '0011', '0110', '1101', '1010',
    '0101', '1011', '0111', '1111', '1110', '1100', '1000', '0001'
  ])
})

void test('x^4 + x^2 + 1 from 0001 repeats after 6 states, as the spec shows', () => {
  const states = new LFSRModel({ width: 4n, polynomial: 'x^4 + x^2 + 1' }).values(0b0001n, 7)
  assert.deepEqual(states.map(s => s.toString(2).padStart(4, '0')), ['0001', '0010', '0101', '1010', '0100', '1000', '0001'])
})

void test('a maximal-length LFSR returns to its seed after exactly 2^n − 1 steps', () => {
  const m = new LFSRModel({ width: 16n })
  let s = m.next(0xace1n)
  let steps = 1
  while (s !== 0xace1n) { s = m.next(s); steps++ }
  assert.equal(steps, 65535)
})

void test('an advance of N steps as N single shifts', () => {
  const one = new LFSRModel({ width: 33n, polynomial: [33, 20, 0] })
  const many = new LFSRModel({ width: 33n, polynomial: [33, 20, 0], advance: 40n })
  let a = 0x1_2345_6789n
  let b = a
  for (let i = 0; i < 20; i++) {
    for (let k = 0; k < 40; k++) a = one.next(a)
    b = many.next(b)
    assert.equal(b, a)
  }
})

void test('an advance that shares a factor with 2^n − 1 shortens the period', () => {
  // 2^4 − 1 = 15 = 3 · 5: an advance of 3 repeats after 5 steps, one of 5 after 3, one of 2 after 15
  for (const [advance, period] of [[3n, 5], [5n, 3], [2n, 15]] as const) {
    const m = new LFSRModel({ width: 4n, advance })
    let s = m.next(1n)
    let steps = 1
    while (s !== 1n) { s = m.next(s); steps++ }
    assert.equal(steps, period)
    assert.equal(maximalPeriod(4, advance), BigInt(period))
  }
})

void test('value is the state\'s low outWidth bits', () => {
  const full = new LFSRModel({ width: 32n }).values(0xdeadbeefn, 8)
  assert.deepEqual(new LFSRModel({ width: 32n, outWidth: 8n }).values(0xdeadbeefn, 8), full.map(v => v & 0xffn))
})

// ---------------------------------------------------------------- the other notations, as their sources write them

void test('a hand-written SV LFSR: {l[14:0], l[15] ^ l[13] ^ l[12] ^ l[10]} is x^16 + x^14 + x^13 + x^11 + 1', () => {
  // tssv-noc's fpga/xmr/04_shapes/tb/tb_xmr_shapes.sv, run as written: bit index + 1 is the stage
  const sv16 = (l: bigint): bigint => ((l << 1n) & 0xffffn) | (((l >> 15n) ^ (l >> 13n) ^ (l >> 12n) ^ (l >> 10n)) & 1n)
  // tssv-noc's fpga/xmr/02_scale/gen_harness.py: {lfsr[62:0], lfsr[63] ^ lfsr[62] ^ lfsr[60] ^ lfsr[59]}
  const sv64 = (l: bigint): bigint => ((l << 1n) & ((1n << 64n) - 1n)) | (((l >> 63n) ^ (l >> 62n) ^ (l >> 60n) ^ (l >> 59n)) & 1n)
  for (const [width, written, p, seed] of [[16n, sv16, 'x^16 + x^14 + x^13 + x^11 + 1', 0xace1n], [64n, sv64, 'x^64 + x^63 + x^61 + x^60 + 1', 0x0123456789abcdefn]] as const) {
    const m = new LFSRModel({ width, polynomial: p })
    let s: bigint = seed
    for (let i = 0; i < 300; i++) {
      assert.equal(m.next(s), written(s))
      s = written(s)
    }
  }
  assert.equal(MAXIMAL_LENGTH[64], 'x^64 + x^63 + x^61 + x^60 + 1')
})

void test('Wikipedia\'s Fibonacci LFSR: the same polynomial, with the state bit-reversed', () => {
  // The Fibonacci example in Wikipedia's "Linear-feedback shift register", in TS: taps 16 14 13 11,
  // "feedback polynomial: x^16 + x^14 + x^13 + x^11 + 1", shifting right
  //   bit = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5)) & 1u;
  //   lfsr = (lfsr >> 1) | (bit << 15);
  const wiki = (lfsr: number): number => {
    const bit = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5)) & 1
    return (lfsr >> 1) | (bit << 15)
  }
  const reverse = (x: number): number => parseInt(x.toString(2).padStart(16, '0').split('').reverse().join(''), 2)
  const m = new LFSRModel({ width: 16n, polynomial: 'x^16 + x^14 + x^13 + x^11 + 1' })
  assert.equal(reverse(0xace1), 0x8735)
  let theirs = 0xace1
  let ours = 0x8735n
  let period = 0
  do {
    assert.equal(BigInt(reverse(theirs)), ours)
    theirs = wiki(theirs)
    ours = m.next(ours)
    period++
  } while (theirs !== 0xace1)
  assert.equal(period, 65535)
})

void test('a Galois LFSR with the toggle mask 0xB400 makes the same sequence of bits as x^16 + x^14 + x^13 + x^11 + 1', () => {
  // The Galois example in Wikipedia's "Linear-feedback shift register", in TS. Koopman's tables
  // give masks for the same right-shift form. Mask bit i is the term x^(i + 1), and the 1 is implied.
  //   unsigned lsb = lfsr & 1u; lfsr >>= 1; if (lsb) lfsr ^= 0xB400u;
  let lfsr = 0xace1
  const out: number[] = []
  for (let i = 0; i < 2000; i++) {
    const lsb = lfsr & 1
    out.push(lsb)
    lfsr >>= 1
    if (lsb !== 0) lfsr ^= 0xb400
  }
  // Its output bits follow the recurrence the polynomial defines, bit t = XOR of bits t − k for each
  // tap k, as the bits an LFSR shifts in do: the same sequence, at another phase. The states differ.
  const tapped = taps(16, 'x^16 + x^14 + x^13 + x^11 + 1')
  for (let t = 16; t < out.length; t++) assert.equal(out[t], tapped.reduce((x, k) => x ^ (out[t - k] ?? 0), 0))
  const mask = [...Array(16).keys()].filter(i => ((0xb400 >> i) & 1) !== 0).map(i => i + 1)
  assert.deepEqual(mask.reverse(), tapped)
})

void test('the reciprocal convention: the bits satisfy the characteristic polynomial x^16 + x^5 + x^3 + x^2 + 1', () => {
  // The bits an LFSR shifts in, in order: s[t + 16] = s[t + 5] + s[t + 3] + s[t + 2] + s[t], whose
  // characteristic polynomial is the reciprocal of LFSR's x^16 + x^14 + x^13 + x^11 + 1
  const m = new LFSRModel({ width: 16n, polynomial: 'x^16 + x^14 + x^13 + x^11 + 1' })
  const s: bigint[] = []
  let state = 0xace1n
  for (let i = 0; i < 1000; i++) { state = m.shift(state); s.push(state & 1n) }
  for (let t = 0; t + 16 < s.length; t++) assert.equal(s[t + 16], (s[t + 5] ?? 0n) ^ (s[t + 3] ?? 0n) ^ (s[t + 2] ?? 0n) ^ (s[t] ?? 0n))
  assert.equal(isPrimitive(normalizePolynomial('test', 16, 'x^16 + x^5 + x^3 + x^2 + 1')), true)
})

void test('an XNOR LFSR, as XAPP052 draws it, is the complement of LFSR from the complemented seed', () => {
  // XAPP052: stages Q1 to Qn, shifting from Q1 towards Qn, and D1 the XNOR of the tapped stages.
  // Q_k is LFSR's state bit k − 1.
  for (let n = 3; n <= 20; n++) {
    const p = MAXIMAL_LENGTH[n] ?? ''
    const tapped = taps(n, p)
    const all = (1n << BigInt(n)) - 1n
    const xnor = (q: bigint): bigint => ((q << 1n) & all) | (1n ^ tapped.reduce((x, k) => x ^ ((q >> BigInt(k - 1)) & 1n), 0n))
    const m = new LFSRModel({ width: BigInt(n) })
    let q = 0n // XAPP052's flops wake up at 0, a legal state with XNOR
    let s = all
    for (let i = 0; i < 200; i++) {
      assert.equal(q, s ^ all, `${p}, step ${i}`)
      q = xnor(q)
      s = m.next(s)
    }
  }
})

void test('CRC-16-CCITT\'s polynomial isn\'t maximal-length, so an LFSR refuses it', () => {
  assert.throws(() => new LFSR({ width: 16n, polynomial: 'x^16 + x^12 + x^5 + 1', seed: 1n }),
    { message: /polynomial x\^16 \+ x\^12 \+ x\^5 \+ 1 isn't maximal-length \(it isn't primitive\)/ })
})

// ---------------------------------------------------------------- the SV of each configuration

/** The spec's IO table for a configuration, in declaration order */
function specPorts (width: number, outWidth: number, loadable: boolean): string[] {
  return ['input clk[1]', 'input rst_n[1]', 'input step[1]', ...(loadable ? ['input load[1]', `input seed_in[${width}]`] : []), `output value[${outWidth}]`]
}

// Every structural configuration: the advance decides how many bits only move and how many are
// new (1, a few, all of them, more shifts than bits); loadable adds a port and the cur mux;
// outWidth a slice of the state. Widths from 2 up to the library's largest. Each advance here shares
// no factor with 2^width − 1.
const CONFIGS: LFSR_Parameters[] = [
  { width: 2n, seed: 1n },
  { width: 2n, seed: 3n, advance: 2n, loadable: true },
  { width: 7n, polynomial: PRBS7, seed: 1n },
  { width: 7n, polynomial: [7, 6, 0], seed: 0x55n, advance: 7n, outWidth: 1n },
  { width: 16n, seed: 0xace1n },
  { width: 16n, seed: 0xace1n, advance: 8n, outWidth: 8n },
  { width: 16n, polynomial: 'x^16 + x^14 + x^13 + x^11 + 1', seed: 0xace1n, advance: 16n, loadable: true },
  { width: 33n, polynomial: [33, 20, 0], seed: 0x1_2345_6789n, advance: 40n },
  { width: 64n, seed: 0x0123456789abcdefn, advance: 64n, outWidth: 32n, loadable: true },
  { width: 168n, seed: 1n << 167n, advance: 8n },
  { width: 168n, seed: 12345n, advance: 256n, outWidth: 100n }
]

for (const config of CONFIGS) {
  const lfsr = new LFSR(config)
  void test(`${lfsr.name} has the spec's ports, and writes its SV`, () => {
    const width = Number(config.width)
    assert.deepEqual(ports(lfsr), specPorts(width, Number(config.outWidth ?? config.width), config.loadable === true))
    lfsr.writeSystemVerilogFiles(`${OUT}/${lfsr.name}`)
  })
}

void test('loadable, outWidth and advance are each part of the module\'s name', () => {
  const base: LFSR_Parameters = { width: 16n, seed: 1n }
  const names = [base, { ...base, loadable: true }, { ...base, outWidth: 8n }, { ...base, advance: 8n }].map(p => new LFSR(p).name)
  assert.equal(new Set(names).size, names.length)
  assert.equal(new LFSR({ ...base, loadable: false, outWidth: 16n, advance: 1n }).name, new LFSR(base).name)
})

void test('allowShortPeriod builds an LFSR the checks would refuse, and doesn\'t change the module', () => {
  const p: LFSR_Parameters = { width: 4n, polynomial: 'x^4 + x^2 + 1', seed: 1n, advance: 3n }
  const a = new LFSR({ ...p, allowShortPeriod: true })
  assert.equal(a.name, new LFSR({ width: 4n, polynomial: [4, 2, 0], seed: 1n, advance: 3n, allowShortPeriod: true }).name)
  assert.doesNotThrow(() => new LFSR({ width: 200n, polynomial: [200, 163, 0], seed: 1n, allowShortPeriod: true }))
})

const REFUSED: Array<[string, () => unknown, RegExp]> = [
  ['a width of 1', () => new LFSR({ width: 1n, polynomial: 'x + 1', seed: 1n }), /width must be a bigint of 2 or more, got 1/],
  ['a width above the library, with no polynomial', () => new LFSR({ width: 169n, seed: 1n }), /MAXIMAL_LENGTH has no polynomial for width 169 \(it covers 2 to 168\), so give one/],
  ['a polynomial of another degree', () => new LFSR({ width: 16n, polynomial: PRBS15, seed: 1n }), /polynomial 'x\^15 \+ x\^14 \+ 1' has degree 15, but the width is 16/],
  ['a polynomial that isn\'t maximal-length', () => new LFSR({ width: 4n, polynomial: 'x^4 + x^2 + 1', seed: 1n }),
    /polynomial x\^4 \+ x\^2 \+ 1 isn't maximal-length \(it isn't primitive\), so its sequence repeats before visiting all 15 non-zero states. Use MAXIMAL_LENGTH\[4\], or pass allowShortPeriod: true/],
  ['an advance that shortens the period', () => new LFSR({ width: 16n, seed: 1n, advance: 3n }),
    /an advance of 3 shares the factor 3 with 2\^16 − 1 = 65535, so the sequence repeats after 21845 steps instead of 65535/],
  ['a width the factor table doesn\'t cover', () => new LFSR({ width: 200n, polynomial: [200, 163, 0], seed: 1n }),
    /polynomial x\^200 \+ x\^163 \+ 1 can't be checked for maximal length, since the factor table covers widths 2 to 168/],
  ['a seed of 0, the lock-up state', () => new LFSR({ width: 16n, seed: 0n }), /seed must be a non-zero 16-bit value \(0 is the lock-up state, which an LFSR never leaves\), got 0/],
  ['a seed wider than the state', () => new LFSR({ width: 16n, seed: 1n << 16n }), /seed must be a non-zero 16-bit value/],
  ['an outWidth wider than the state', () => new LFSR({ width: 16n, seed: 1n, outWidth: 17n }), /outWidth must be 1 to 16, got 17/],
  ['an outWidth of 0', () => new LFSR({ width: 16n, seed: 1n, outWidth: 0n }), /outWidth must be 1 to 16, got 0/],
  ['an advance of 0', () => new LFSR({ width: 16n, seed: 1n, advance: 0n }), /advance must be 1 or more, got 0/]
]
for (const [what, f, message] of REFUSED) {
  void test(`${what} is refused`, () => { assert.throws(f, { message }) })
}

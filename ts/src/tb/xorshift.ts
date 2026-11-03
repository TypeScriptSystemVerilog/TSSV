// A TypeScript model of the sequence an Lfsr produces: Marsaglia's xorshift ("Xorshift RNGs", 2003)
// on 32 or 64 bits. A generator uses it to predict an Lfsr's values, such as the payloads an
// injector fills in from a seed, and a test checks the Lfsr's RTL against it.
//
// The shift triples are written out here again, not shared with Lfsr.ts: a test of the RTL
// against this model then catches a wrong triple on either side.

/** The value xorshift on `width` bits moves to from `x`: what an Lfsr's state does at a step. */
export function xorshiftNext (width: 32 | 64, x: bigint): bigint {
  const [a, b, c] = width === 32 ? [13n, 17n, 5n] : [13n, 7n, 17n]
  const mask = (1n << BigInt(width)) - 1n
  x ^= (x << a) & mask
  x ^= x >> b
  return x ^ ((x << c) & mask)
}

/**
 * The first `n` values of xorshift on `width` bits from `seed`, each cut to its low `outWidth`
 * bits: what an Lfsr reset to `seed` shows on `value`, step by step.
 */
export function xorshift (width: 32 | 64, seed: bigint, outWidth: number, n: number): bigint[] {
  const out: bigint[] = []
  let x = seed
  for (let i = 0; i < n; i++) {
    out.push(x & ((1n << BigInt(outWidth)) - 1n))
    x = xorshiftNext(width, x)
  }
  return out
}

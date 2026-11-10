// What an injector and a checker of a record stream share (doc/framework/testbench.md, "Record
// streams"): the fields of the record they hold in memory, LFSR payloads, and the TypeScript
// model of the payloads, for generators.
import { recordLayout, type Radix, type RecordField, type RecordLayout } from './patternRecord.js'
import { LFSRModel } from '../modules/LFSR/model.js'
import { type Polynomial } from '../modules/LFSR/polynomial.js'
import { type LFSR_Parameters } from '../modules/LFSR/LFSR.js'

/**
 * LFSR payloads: instead of storing some fields, a record stores a seed, and an LFSR fills those
 * fields in. A non-zero seed restarts the LFSR at that seed; a seed of 0 continues from the
 * previous record. An injector and its checker are given the same RecordLfsr.
 */
export interface RecordLfsr {
  /** The fields the LFSR fills, at most `width` bits together. The first takes the high bits. */
  fields: string[]
  /** The LFSR's width, 2 to 168 bits. Default 64. */
  width?: number
  /** The LFSR's feedback polynomial (LFSR's `polynomial`). Default the library's for the width, `MAXIMAL_LENGTH[width]` */
  polynomial?: Polynomial
  /** The LFSR's state after reset, which a stream whose first record has seed 0 starts from. */
  seed: bigint
}

/**
 * The parameters of the LFSR that fills `bits` bits of payload per record, for an injector, a
 * checker and the model alike: loadable, `bits` wide on `value`, and stepping `bits` rounded up to a
 * power of 2 per record. So two records' payloads share no bits, and since 2^width − 1 is odd, the
 * advance shares no factor with it and the sequence keeps its full period.
 */
export function payloadLfsr (lfsr: RecordLfsr, bits: number): LFSR_Parameters {
  let advance = 1n
  while (advance < BigInt(bits)) advance <<= 1n
  return { width: BigInt(lfsr.width ?? 64), polynomial: lfsr.polynomial, seed: lfsr.seed, advance, outWidth: BigInt(bits), loadable: true }
}

/** The field a record stores in place of its LFSR payload fields. */
export const SEED_FIELD = 'seed'

/** An LFSR payload field: its name, width, and lowest bit within the LFSR's value. */
export interface PayloadSlice extends RecordField {
  lo: number
}

/**
 * The LFSR payload fields of `fields`, in record order, each with its bits of the LFSR's value:
 * the first field in the high bits. Checks that `lfsr` names fields of the record, at most its
 * width together, and that the record has no field named `seed`.
 */
export function payloadSlices (what: string, fields: RecordField[], lfsr: RecordLfsr): PayloadSlice[] {
  const width = lfsr.width ?? 64
  if (lfsr.fields.length === 0) throw Error(`${what}: lfsr.fields is empty`)
  for (const n of lfsr.fields) {
    if (!fields.some(f => f.name === n)) throw Error(`${what}: lfsr names ${n}, which is not a field of the record`)
  }
  if (fields.some(f => f.name === SEED_FIELD)) throw Error(`${what}: with lfsr, the record stores its seed in a field named ${SEED_FIELD}, so no field may have that name`)
  const filled = fields.filter(f => lfsr.fields.includes(f.name))
  const total = filled.reduce((sum, f) => sum + f.width, 0)
  if (total > width) throw Error(`${what}: the lfsr fields are ${total} bits, more than a ${width}-bit LFSR gives`)
  if (lfsr.seed <= 0n || lfsr.seed >= 1n << BigInt(width)) throw Error(`${what}: lfsr.seed must be a non-zero ${width}-bit value, got ${lfsr.seed}`)
  let lo = total
  return filled.map(f => { lo -= f.width; return { name: f.name, width: f.width, lo } })
}

/**
 * The fields a record holds in memory: `fields` as they are, or with `lfsr`, its payload fields
 * replaced by one `seed` field, as wide as the LFSR, where the first of them was.
 */
export function storedFields (fields: RecordField[], lfsr?: RecordLfsr): RecordField[] {
  if (lfsr === undefined) return fields
  const stored: RecordField[] = []
  for (const f of fields) {
    if (!lfsr.fields.includes(f.name)) stored.push(f)
    else if (!stored.some(s => s.name === SEED_FIELD)) stored.push({ name: SEED_FIELD, width: lfsr.width ?? 64 })
  }
  return stored
}

/** The memory layout of an injector's records, for its pattern file: `storedFields()`. */
export function injectorLayout (fields: RecordField[], options: { lfsr?: RecordLfsr, radix?: Radix } = {}): RecordLayout {
  return recordLayout(storedFields(fields, options.lfsr), options.radix)
}

/**
 * The LFSR payloads a stream of records carries, as the injector fills them in and the checker
 * regenerates them: for each record's seed, the low `bits` of the LFSR's value (`payloadLfsr()`). A
 * non-zero seed restarts the sequence at that seed, and 0 continues it, from `lfsr.seed` at the start.
 */
export function lfsrPayloads (lfsr: RecordLfsr, bits: number, seeds: bigint[]): bigint[] {
  const model = new LFSRModel(payloadLfsr(lfsr, bits))
  let state = lfsr.seed
  return seeds.map(seed => {
    const cur = seed === 0n ? state : seed
    state = model.next(cur)
    return model.value(cur)
  })
}

/**
 * A dense, non-zero seed of `width` bits from `n`, such as a packet number: splitmix64's outputs
 * from `n`, low 64 bits first, cut to `width` bits. A small seed such as 1 would make sparse, alike
 * payloads, since an LFSR shifts a state with few bits set into others with few bits set.
 */
export function mixSeed (n: bigint, width = 64): bigint {
  const m64 = (1n << 64n) - 1n
  let z = 0n
  let state = n
  for (let lo = 0; lo < width; lo += 64) {
    state = (state + 0x9E3779B97F4A7C15n) & m64
    let x = state
    x = ((x ^ (x >> 30n)) * 0xBF58476D1CE4E5B9n) & m64
    x = ((x ^ (x >> 27n)) * 0x94D049BB133111EBn) & m64
    z |= (x ^ (x >> 31n)) << BigInt(lo)
  }
  z &= (1n << BigInt(width)) - 1n
  return z === 0n ? 1n : z
}

/**
 * Checkers on several outputs, tied so that the order across them is checked. Each expected
 * record names a peer, one of the tied checkers, and a count: it may arrive only after that peer
 * has delivered that many records, in earlier cycles. A count of 0 asks nothing.
 */
export interface RecordTie {
  /** The tied checkers, numbered from 0 in the order of their counts on `peer_count`. */
  peers: number
  /** The width of each peer's count on `peer_count`, and of `after_count`. */
  countWidth: number
}

/** The fields of a tied checker's expected record that name its peer and count. */
export const AFTER_PEER = 'after_peer'
export const AFTER_COUNT = 'after_count'

/** The width of `after_peer` for `peers` tied checkers: at least 1. */
export const peerWidth = (peers: number): number => Math.max(1, Math.ceil(Math.log2(peers)))

/** What shapes a checker's expected records, besides the record's fields. */
export interface CheckerRecordOptions {
  lfsr?: RecordLfsr
  /** The field that names a record's source: a perSource checker's files leave it out. */
  sourceField?: string
  tie?: RecordTie
  radix?: Radix
}

/**
 * The fields a checker's expected record holds in memory: the record's fields less the source
 * field, with LFSR payload fields replaced by `seed` (`storedFields()`), then `after_peer` and
 * `after_count` when it is tied.
 */
export function checkerFields (fields: RecordField[], options: CheckerRecordOptions = {}): RecordField[] {
  const kept = fields.filter(f => f.name !== options.sourceField)
  const stored = storedFields(kept, options.lfsr)
  if (options.tie === undefined) return stored
  return [...stored, { name: AFTER_PEER, width: peerWidth(options.tie.peers) }, { name: AFTER_COUNT, width: options.tie.countWidth }]
}

/** The memory layout of a checker's expected records, for its pattern files: `checkerFields()`. */
export function checkerLayout (fields: RecordField[], options: CheckerRecordOptions = {}): RecordLayout {
  return recordLayout(checkerFields(fields, options), options.radix)
}

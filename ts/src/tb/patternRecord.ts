// The record layout of a pattern memory (doc/framework/pattern-files.md): which fields one memory
// word holds, in which bits. A record is one value per field, such as one flit of a FlitStream
// (head, tail, data) or one row of a cycle table (a value per lane).
//
// The same layout serves the memory (PatternMemory slices its word into one output per field)
// and the pattern file the memory loads (patternFile.ts writes one word per line). In a $readmemh
// layout every field's slot is padded to whole hex digits, so each field is written as its own
// digits and every underscore in the file falls between two fields. In a $readmemb layout every
// slot is the field's exact width.
import { type Interface } from 'tssv/lib/core/TSSV'

/** One field of a record: its name, and its width in bits. */
export interface RecordField {
  name: string
  width: number
}

/** How a pattern file writes a word: `'h'` for `$readmemh`, `'b'` for `$readmemb`. */
export type Radix = 'h' | 'b'

/** A field and its slot in the memory word. */
export interface FieldSlot extends RecordField {
  /** The slot's lowest bit in the word. */
  lo: number
  /** The slot's width: the field's width, padded to whole hex digits in an `'h'` layout. */
  slotWidth: number
}

/** The fields of a record, and where each one sits in a memory word. */
export interface RecordLayout {
  radix: Radix
  /** The fields in order. The first one is in the word's most significant slot. */
  fields: FieldSlot[]
  /** Bits in one word: the sum of the slots. */
  wordWidth: number
}

/** A record: one value per field, by field name. */
export type PatternRecord = Record<string, bigint>

// An SV identifier, as a field becomes a port of the memory: a letter or '_', then letters,
// digits and '_'
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/

/**
 * The fields of a record carried by `intf`: its signals in the order the interface declares them,
 * each with its width (1 when it has none). `names` keeps only those signals, in the interface's
 * order, to leave out the ones a record doesn't carry, such as `valid` and `ready`.
 */
export function recordFields (intf: Interface, names?: string[]): RecordField[] {
  const signals = Object.entries(intf.signals).flatMap(([name, s]) => s === undefined ? [] : [{ name, width: s.width ?? 1 }])
  if (names === undefined) return signals
  for (const n of names) {
    if (!signals.some(s => s.name === n)) throw Error(`recordFields: interface ${intf.name} has no signal ${n}`)
  }
  return signals.filter(s => names.includes(s.name))
}

/**
 * The layout of `fields` in a memory word for `radix`. Slots are packed from the most significant
 * bit down, in field order. An `'h'` slot is the field's width rounded up to a multiple of 4, with
 * the field in its low bits and 0 above; a `'b'` slot is the field's exact width.
 */
export function recordLayout (fields: RecordField[], radix: Radix = 'h'): RecordLayout {
  if (fields.length === 0) throw Error('recordLayout: a record needs at least one field')
  const names = new Set<string>()
  for (const f of fields) {
    if (!IDENTIFIER.test(f.name)) throw Error(`recordLayout: field name ${f.name} is not an SV identifier`)
    if (names.has(f.name)) throw Error(`recordLayout: field ${f.name} appears twice`)
    if (!Number.isInteger(f.width) || f.width < 1) throw Error(`recordLayout: field ${f.name} has width ${f.width}, not a positive integer`)
    names.add(f.name)
  }
  // From the last field, in the low bits, up to the first
  let lo = 0
  const slots: FieldSlot[] = []
  for (const f of [...fields].reverse()) {
    const slotWidth = radix === 'h' ? 4 * Math.ceil(f.width / 4) : f.width
    slots.unshift({ name: f.name, width: f.width, lo, slotWidth })
    lo += slotWidth
  }
  return { radix, fields: slots, wordWidth: lo }
}

/** `record` as a memory word of `layout`. Every field needs a value that fits its width. */
export function packRecord (layout: RecordLayout, record: PatternRecord): bigint {
  for (const name of Object.keys(record)) {
    if (!layout.fields.some(f => f.name === name)) throw Error(`packRecord: the record has a value for ${name}, which is not a field`)
  }
  let word = 0n
  for (const f of layout.fields) {
    const v = record[f.name]
    if (v === undefined) throw Error(`packRecord: the record has no value for field ${f.name}`)
    if (v < 0n || v >= 1n << BigInt(f.width)) throw Error(`packRecord: ${v} doesn't fit the ${f.width}-bit field ${f.name}`)
    word |= v << BigInt(f.lo)
  }
  return word
}

/** The record a memory word of `layout` holds. Pad bits are ignored. */
export function unpackRecord (layout: RecordLayout, word: bigint): PatternRecord {
  const record: PatternRecord = {}
  for (const f of layout.fields) record[f.name] = (word >> BigInt(f.lo)) & ((1n << BigInt(f.width)) - 1n)
  return record
}

// Writes pattern files and testcase manifests (doc/framework/pattern-files.md), so that a test
// content generator in TypeScript needs no formatting code of its own. A generator in another
// language follows the documented format instead.
//
// A pattern file is a $readmemh or $readmemb file that a person can read: a header comment, then
// the records one per line, with a comment before each object (a packet, a transaction, a phase)
// that introduces its records. The underscores in each line fall between fields. In a $readmemh
// file a field wider than 16 bits is also split into groups of 4 hex digits, each named in the
// header (`data[31:16] _ data[15:0]`).
import { mkdirSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { type FieldSlot, type PatternRecord, type Radix, type RecordLayout, packRecord } from './patternRecord.js'

/** One object of a pattern file, such as a packet: a label and its records. */
export interface PatternObject {
  /** What the object is: `source 0` in `// packet 0: source 0, 3 flits`. */
  label?: string
  records: PatternRecord[]
}

/** What a pattern file holds, and the words its comments use. */
export interface PatternFileContent {
  /** The block under test: `FlitStreamPipe`. */
  dut: string
  testcase: string
  /** What the file is for: `stimulus for s_in`, `expected values of m_out`. */
  purpose: string
  /** One record, in the singular: `flit`, `row`. The plural adds an s. */
  recordNoun: string
  /** One object, in the singular: `packet`, `phase`. The plural adds an s. */
  objectNoun: string
  objects: PatternObject[]
}

/** One file of a testcase's manifest. */
export interface ManifestFile {
  /** The pattern file's path, relative to the manifest. */
  file: string
  /** The memory the file loads into: its instance path from the testbench's top, `h.play.pattern`. */
  memory: string
  radix: Radix
  /** Records in the file. */
  records: number
}

/** A testcase's manifest: its pattern files, and the memory each one loads into. */
export interface Manifest {
  testcase: string
  files: ManifestFile[]
}

/** One group of a field's digits in a line: its name in the header, and its bits in the field. */
interface Group {
  label: string
  lo: number
  bits: number
}

/** `n` and `noun`, plural unless n is 1: `3 flits`. */
const count = (n: number, noun: string): string => `${n} ${noun}${n === 1 ? '' : 's'}`

/** Digit counts in the header's width line, as words up to nine: `one hex digit`. */
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const digits = (n: number): string => `${WORDS[n] ?? n} hex digit${n === 1 ? '' : 's'}`

/**
 * The groups field `f` is written in, most significant first. A `'b'` field is one group of its
 * exact width. An `'h'` field is its slot's digits, split into groups of 4 digits from the least
 * significant end when it is wider than 16 bits. A group's label names the field bits it holds,
 * without the slot's pad bits.
 */
function groups (f: FieldSlot, radix: Radix): Group[] {
  if (radix === 'b') return [{ label: f.name, lo: 0, bits: f.width }]
  if (f.width <= 16) return [{ label: f.name, lo: 0, bits: f.slotWidth }]
  const out: Group[] = []
  for (let lo = 0; lo < f.slotWidth; lo += 16) {
    const bits = Math.min(16, f.slotWidth - lo)
    out.unshift({ label: `${f.name}[${Math.min(lo + bits, f.width) - 1}:${lo}]`, lo, bits })
  }
  return out
}

/**
 * The header's width line: the fields in order, neighbours of one width together, each with its
 * width and, in an `'h'` file, its digits when the width isn't a whole number of them:
 * `head, tail: 1 bit each, one hex digit each; data: 32 bits`.
 */
function widthLine (layout: RecordLayout): string {
  const runs: FieldSlot[][] = []
  for (const f of layout.fields) {
    const last = runs[runs.length - 1]
    if (last !== undefined && last[0].width === f.width) last.push(f)
    else runs.push([f])
  }
  return runs.map(run => {
    const { width, slotWidth } = run[0]
    const each = run.length > 1 ? ' each' : ''
    const padded = layout.radix === 'h' && width % 4 !== 0 ? `, ${digits(slotWidth / 4)}${each}` : ''
    return `${run.map(f => f.name).join(', ')}: ${count(width, 'bit')}${each}${padded}`
  }).join('; ')
}

/** One record as a line of the file: each group's digits, with an underscore between groups. */
function recordLine (layout: RecordLayout, record: PatternRecord): string {
  const word = packRecord(layout, record)
  return layout.fields.flatMap(f => groups(f, layout.radix).map(g => {
    const v = (word >> BigInt(f.lo + g.lo)) & ((1n << BigInt(g.bits)) - 1n)
    return layout.radix === 'h' ? v.toString(16).padStart(g.bits / 4, '0') : v.toString(2).padStart(g.bits, '0')
  })).join('_')
}

/** The text of a pattern file holding `content` in `layout`. */
export function formatPatternFile (layout: RecordLayout, content: PatternFileContent): string {
  const { recordNoun, objectNoun, objects } = content
  const labels = layout.fields.flatMap(f => groups(f, layout.radix).map(g => g.label))
  const records = objects.reduce((n, o) => n + o.records.length, 0)
  const lines = [
    `// ${content.dut}, testcase ${content.testcase}: ${content.purpose}`,
    `// $readmem${layout.radix}, one ${recordNoun} per line: ${labels.join(' _ ')}`,
    `//   ${widthLine(layout)}`,
    `// ${count(records, recordNoun)} in ${count(objects.length, objectNoun)}`
  ]
  objects.forEach((o, i) => {
    const label = o.label === undefined ? '' : `${o.label}, `
    lines.push(`// ${objectNoun} ${i}: ${label}${count(o.records.length, recordNoun)}`)
    lines.push(...o.records.map(r => recordLine(layout, r)))
  })
  return `${lines.join('\n')}\n`
}

/** Writes `content` to the pattern file `path`, making its folder if needed. Returns the record count. */
export function writePatternFile (path: string, layout: RecordLayout, content: PatternFileContent): number {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, formatPatternFile(layout, content))
  return content.objects.reduce((n, o) => n + o.records.length, 0)
}

/** Writes a testcase's manifest to `path` as JSON, making its folder if needed. */
export function writeManifest (path: string, manifest: Manifest): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`)
}

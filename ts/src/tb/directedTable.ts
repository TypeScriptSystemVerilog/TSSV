// A directed cycle table written as rows (doc/framework/testbench.md, "Directed tables"). A
// directed test is a list of short cases, each a few rows. A row drives some of the player's lanes
// and expects some of the checker's. directedTable() turns the rows into the table by column, as
// VectorPlayer.records() and VectorChecker.records() take it, and tableObjects() slices their
// records back into a pattern-file object per case, so each case's comment in the file is its label.
// writeDirectedTestcase() does both, and writes a testcase's two pattern files and its manifest.
import { writeManifest, writePatternFile, type PatternFileContent, type PatternObject } from './patternFile.js'
import { type PatternRecord, type Radix } from './patternRecord.js'
import { VectorPlayer, type DriveLane, type TableLane } from './VectorPlayer.js'
import { VectorChecker, type CheckLane } from './VectorChecker.js'

/** A lane's value: a bigint, or a number that is a safe integer. Never negative. */
export type LaneValue = bigint | number

/** One row of a directed table: one cycle. */
export interface DirectedRow {
  /** The driven lanes this row changes. A driven lane holds its value until a row changes it. */
  drive?: Record<string, LaneValue>
  /** The checked lanes this row expects. A checked lane this row doesn't name isn't checked in it. */
  expect?: Record<string, LaneValue>
}

/** One case of a directed table: its rows, and the label of its pattern-file object. */
export interface DirectedCase {
  label: string
  rows: DirectedRow[]
}

/** Where each case's rows are in the table: its label and its row count, in order. */
export interface TableObject {
  label: string
  rows: number
}

/** A directed table by column, for `VectorPlayer.records()` and `VectorChecker.records()`. */
export interface DirectedTable {
  rows: number
  driven: TableLane[]
  checked: TableLane[]
  objects: TableObject[]
}

export interface DirectedTableOptions {
  /** Each driven lane's value before the first row. A lane not named starts at 0. */
  initial?: Record<string, LaneValue>
}

// A lane value as a bigint, refused unless it is a non-negative integer that fits `width` bits
function laneValue (v: LaneValue, width: number, where: string): bigint {
  if (typeof v === 'number' && !Number.isSafeInteger(v)) throw Error(`${where}: ${v} isn't an integer`)
  const b = BigInt(v)
  if (b < 0n) throw Error(`${where}: ${b} is negative`)
  if (b >> BigInt(width) !== 0n) throw Error(`${where}: ${b} doesn't fit in ${width} bit${width === 1 ? '' : 's'}`)
  return b
}

// The lanes by port, refused if a port is listed twice
function lanesByPort (lanes: Array<{ port: string, width: number }>, kind: string): Map<string, number> {
  const byPort = new Map<string, number>()
  for (const { port, width } of lanes) {
    if (byPort.has(port)) throw Error(`directedTable: ${kind} lane ${port} is listed twice`)
    byPort.set(port, width)
  }
  return byPort
}

/**
 * The table of `cases`, on `lanes`, by column. A driven lane holds its last value until a row
 * changes it, starting from `options.initial` (0 for a lane it doesn't name). A checked lane is
 * checked only in the rows that name it, and is `undefined`, a don't-care, in every other row.
 * A row may name nothing: a cycle in which nothing changes and nothing is checked.
 *
 * Throws, naming the case and the row, for a lane that isn't one of `lanes`' driven (in `drive`)
 * or checked (in `expect`) lanes, and for a value that is negative, not an integer, or too wide
 * for its lane. Throws also for no cases, a case with no rows, and an empty label.
 */
export function directedTable (lanes: { driven: DriveLane[], checked: CheckLane[] }, cases: DirectedCase[], options: DirectedTableOptions = {}): DirectedTable {
  const drivenWidth = lanesByPort(lanes.driven, 'driven')
  const checkedWidth = lanesByPort(lanes.checked, 'checked')
  if (cases.length === 0) throw Error('directedTable: no cases, so the table has no rows')

  // Each driven lane's current value, from the initial values
  const current = new Map(lanes.driven.map(l => [l.port, 0n]))
  for (const [port, v] of Object.entries(options.initial ?? {})) {
    const width = drivenWidth.get(port)
    if (width === undefined) throw Error(`directedTable: initial names ${port}, which isn't a driven lane`)
    current.set(port, laneValue(v, width, `directedTable: initial ${port}`))
  }

  const driven = new Map(lanes.driven.map(l => [l.port, [] as Array<bigint | undefined>]))
  const checked = new Map(lanes.checked.map(l => [l.port, [] as Array<bigint | undefined>]))
  const objects: TableObject[] = []
  for (const [c, { label, rows }] of cases.entries()) {
    if (label === '') throw Error(`directedTable: case ${c} has an empty label`)
    if (rows.length === 0) throw Error(`directedTable: case "${label}" has no rows`)
    for (const [r, row] of rows.entries()) {
      const where = `directedTable: case "${label}" row ${r}`
      for (const [port, v] of Object.entries(row.drive ?? {})) {
        const width = drivenWidth.get(port)
        if (width === undefined) throw Error(`${where}: drive names ${port}, which isn't a driven lane`)
        current.set(port, laneValue(v, width, `${where}, ${port}`))
      }
      const expect = row.expect ?? {}
      for (const port of Object.keys(expect)) {
        if (!checkedWidth.has(port)) throw Error(`${where}: expect names ${port}, which isn't a checked lane`)
      }
      for (const [port, values] of driven) values.push(current.get(port))
      for (const [port, values] of checked) {
        const v = expect[port]
        values.push(v === undefined ? undefined : laneValue(v, checkedWidth.get(port) ?? 0, `${where}, ${port}`))
      }
    }
    objects.push({ label, rows: rows.length })
  }

  const column = (lane: { port: string, width: number }, values: Map<string, Array<bigint | undefined>>): TableLane =>
    ({ port: lane.port, width: lane.width, values: values.get(lane.port) ?? [] })
  return {
    rows: objects.reduce((n, o) => n + o.rows, 0),
    driven: lanes.driven.map(l => column(l, driven)),
    checked: lanes.checked.map(l => column(l, checked)),
    objects
  }
}

/**
 * A player's or a checker's records (`VectorPlayer.records()`, `VectorChecker.records()`) as
 * `writePatternFile`'s objects, one per case, each labelled with its case's label. Throws unless
 * the objects' rows add up to the records.
 */
export function tableObjects (records: PatternRecord[], objects: TableObject[]): PatternObject[] {
  const rows = objects.reduce((n, o) => n + o.rows, 0)
  if (rows !== records.length) throw Error(`tableObjects: the objects hold ${rows} rows, but there are ${records.length} records`)
  let start = 0
  return objects.map(({ label, rows }) => {
    const object = { label, records: records.slice(start, start + rows) }
    start += rows
    return object
  })
}

/** A testcase written as a directed table, for `writeDirectedTestcase()`. */
export interface DirectedTestcase {
  /** The block under test, for the pattern files' header: `FlitStreamDemux`. */
  dut: string
  testcase: string
  /** The folder the testcase is written to: its two pattern files and its manifest, `<testcase>.json`. */
  dir: string
  lanes: { driven: DriveLane[], checked: CheckLane[] }
  cases: DirectedCase[]
  options?: DirectedTableOptions
  /** The player's memory, from the testbench's top. Default `h.play.pattern`. */
  player?: string
  /** The checker's memory, from the testbench's top. Default `h.chk.pattern`. */
  checker?: string
  /** The pattern files' radix. Default `'h'`. */
  radix?: Radix
}

/**
 * Writes testcase `t` to `t.dir`: `stimulus.hex`, the player's table, `expected.hex`, the
 * checker's, each with a commented object per case, and the manifest `<testcase>.json`, which
 * loads them into `t.player` and `t.checker`. Returns the manifest's path, for the testbench
 * generator. Throws as `directedTable()` does.
 */
export function writeDirectedTestcase (t: DirectedTestcase): string {
  const table = directedTable(t.lanes, t.cases, t.options)
  const radix = t.radix ?? 'h'
  const content = (purpose: string, records: PatternRecord[]): PatternFileContent => ({
    dut: t.dut, testcase: t.testcase, purpose, recordNoun: 'cycle', objectNoun: 'case', objects: tableObjects(records, table.objects)
  })
  const stimulus = writePatternFile(`${t.dir}/stimulus.hex`, VectorPlayer.layout(t.lanes.driven, radix),
    content('the driven lanes, a case at a time', VectorPlayer.records(table.driven, table.rows)))
  const expected = writePatternFile(`${t.dir}/expected.hex`, VectorChecker.layout(t.lanes.checked, radix),
    content('the expected values of the checked lanes, a case at a time; a care bit of 0 is a don\'t-care', VectorChecker.records(table.checked, table.rows)))
  const manifest = `${t.dir}/${t.testcase}.json`
  writeManifest(manifest, {
    testcase: t.testcase,
    files: [
      { file: 'stimulus.hex', memory: t.player ?? 'h.play.pattern', radix, records: stimulus },
      { file: 'expected.hex', memory: t.checker ?? 'h.chk.pattern', radix, records: expected }
    ]
  })
  return manifest
}

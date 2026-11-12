import { SFIFO } from 'tssv/lib/modules/SFIFO'
import { Harness } from 'tssv/lib/tb/Harness'
import { type JsonValue } from 'tssv/lib/tb/testbenchConfiguration'
import { type HarnessBuild } from 'tssv/lib/tb/testbenchGenerator'
import { VectorPlayer, fetchWidth, type DriveLane, type TableLane } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker, type CheckLane } from 'tssv/lib/tb/VectorChecker'
import { diagramLanes } from 'tssv/lib/tb/wavedromVectors'

export const SFIFO_SPEC = '$TSSV_ROOT/doc/modules/SFIFO/SFIFO-spec.md'

/** The SFIFO's inputs (dual-port, no almost flags) but `clk`. Every other lane is an output */
const INPUTS = ['rst_n', 'push_en', 'pop_en', 'push_data']
const OUTPUTS = ['pop_data', 'empty', 'full', 'curr_depth']

/**
 * An SFIFOWave configuration's parameters: the SFIFO's width and depth. It is always the dual-port
 * SFIFO without almost flags that the spec's diagrams are drawn for.
 */
export interface SFIFOWaveParameters {
  dataWidth: number
  depth: number
}

/** Checks an SFIFOWave configuration's parameters, for the testbench generator. */
export function sfifoWaveParameters (raw: Record<string, JsonValue>, where: string): SFIFOWaveParameters {
  for (const key of Object.keys(raw)) {
    if (key !== 'dataWidth' && key !== 'depth') throw Error(`${where}: parameters has ${key}; an SFIFOWave configuration has only dataWidth and depth`)
  }
  const [dataWidth, depth] = [raw.dataWidth, raw.depth]
  for (const [key, value] of [['dataWidth', dataWidth], ['depth', depth]] as const) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) throw Error(`${where}: parameters.${key} must be an integer, at least 1, got ${JSON.stringify(value)}`)
  }
  return { dataWidth: dataWidth as number, depth: depth as number }
}

/** The SFIFO's lanes for `config`: the inputs, which a VectorPlayer drives, and the outputs, which a VectorChecker checks */
export function sfifoLanes (config: SFIFOWaveParameters): { driven: DriveLane[], checked: CheckLane[] } {
  const width = (port: string): number => port.endsWith('_data') ? config.dataWidth : port === 'curr_depth' ? Math.ceil(Math.log2(config.depth + 1)) : 1
  return { driven: INPUTS.map(port => ({ port, width: width(port) })), checked: OUTPUTS.map(port => ({ port, width: width(port) })) }
}

/** One timing diagram of the SFIFO spec, as a table: its cycles, and each lane's value in each */
export interface SFIFOWaveTable {
  cycles: number
  /** The input lanes, which a VectorPlayer drives */
  driven: TableLane[]
  /** The output lanes, which a VectorChecker checks */
  checked: TableLane[]
}

/**
 * Diagram `svg` of the SFIFO spec as a table, for an SFIFO with parameters `config`: a testcase's
 * content. The diagram must have a lane for every port but `clk` of a dual-port SFIFO without
 * almost flags, the one the diagrams are drawn for. A lane marked x in a cycle has the value
 * `undefined` there.
 */
export function sfifoWaveTable (svg: string, config: SFIFOWaveParameters): SFIFOWaveTable {
  const { cycles, lanes } = diagramLanes(SFIFO_SPEC, svg)
  const diagram = new Map(lanes.map(l => [l.name, l.values.map(v => v === undefined ? undefined : BigInt(v))]))
  const { driven, checked } = sfifoLanes(config)
  for (const name of diagram.keys()) {
    if (![...INPUTS, ...OUTPUTS].includes(name)) throw Error(`${svg} has a lane ${name}, which isn't an SFIFO port`)
  }
  const lane = ({ port, width }: DriveLane): TableLane => {
    const values = diagram.get(port)
    if (values === undefined) throw Error(`${svg} has no lane for SFIFO port ${port}`)
    return { port, width, values }
  }
  return { cycles, driven: driven.map(lane), checked: checked.map(lane) }
}

/**
 * SFIFOWaveHarness — replays a timing diagram from the SFIFO spec against a dual-port SFIFO,
 * cycle by cycle: an example of a block testbench built on tier 1 alone, and of a cycle table that
 * the testbench generator builds (doc/framework/testbench.md).
 *
 * The configuration gives the SFIFO's width and depth, and so the lanes: one for every SFIFO port
 * but `clk`. The testcase is a diagram, written as two pattern files by `sfifoWaveTable()`: a
 * VectorPlayer, `play`, drives the input lanes from `h.play.pattern`, and a VectorChecker, `chk`,
 * checks each output lane against `h.chk.pattern`, as a check of its own. The table has as many
 * rows as the testcase's files have records. A lane marked x in a cycle is driven 0, or not
 * checked in it. A diagram starts with `rst_n` low, so the SFIFO is in reset through the
 * harness's reset, the player's priming cycle and the diagram's cycle 0, which is the player's
 * row 0. `rst_n` comes from the player's memory read register, a flop (SV guide RST-4).
 *
 *   play ──rst_n, push_en, pop_en, push_data──▶ dut (SFIFO) ──pop_data, empty, full, curr_depth──▶ chk
 *     └──────────────────────── row, fetch, run ─────────────────────────────────────────────────┘
 *
 * A cycle table is preloaded only, so the generator builds it in preloaded mode.
 */
export class SFIFOWaveHarness extends Harness {
  constructor (build: HarnessBuild<SFIFOWaveParameters>) {
    super({ name: build.name })
    const config = build.config.parameters
    const { driven, checked } = sfifoLanes(config)
    const stimulus = build.memory('h.play.pattern')
    const expected = build.memory('h.chk.pattern')
    if (stimulus.records !== expected.records) throw Error(`${build.name}: the stimulus has ${stimulus.records} rows, but the expected values ${expected.records}`)
    // A reloaded build has no records or files; the player refuses that mode before it reads them
    const rows = stimulus.records ?? 0

    // One net per SFIFO port, named after it, between the DUT and the player or checker
    const dutBindings: Record<string, string> = { clk: 'clk' }
    const playerBindings: Record<string, string> = { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', done: 'done' }
    const checkerBindings: Record<string, string> = { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run' }
    for (const { port, width } of [...driven, ...checked]) {
      this.addSignal(port, { width })
      dutBindings[port] = port
    }
    for (const { port } of driven) playerBindings[port] = port
    for (const { port } of checked) {
      checkerBindings[port] = port
      checkerBindings[`fail_${port}`] = this.check(port, `${port} follows the testcase's diagram`, VectorChecker.firstError('chk', port, 'cycle'))
    }

    this.addSignal('row', { width: this.bitWidth(rows) })
    this.addSignal('fetch', { width: fetchWidth(rows) })
    this.addSignal('run', { width: 1 })
    const play = new VectorPlayer({ name: `${build.name}_play`, rows, lanes: driven, memory: build.mode, depth: stimulus.depth, file: stimulus.file })
    this.addSubmodule('play', play, { ...playerBindings, ...this.registerMemories('play', play) }, false)
    const chk = new VectorChecker({ name: `${build.name}_chk`, rows, lanes: checked, memory: build.mode, depth: expected.depth, file: expected.file ?? '' })
    this.addSubmodule('chk', chk, { ...checkerBindings, ...this.registerMemories('chk', chk) }, false)
    this.addSubmodule('dut', new SFIFO({ dataWidth: BigInt(config.dataWidth), depth: BigInt(config.depth) }), dutBindings, false)
    this.finish()
  }
}

export default SFIFOWaveHarness

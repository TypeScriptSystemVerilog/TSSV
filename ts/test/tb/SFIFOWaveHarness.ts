import { SFIFO, type SFIFO_Parameters } from 'tssv/lib/modules/SFIFO'
import { Harness } from 'tssv/lib/tb/Harness'
import { VectorPlayer, fetchWidth, type TableLane } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'
import { diagramLanes } from 'tssv/lib/tb/wavedromVectors'

export const SFIFO_SPEC = '$TSSV_ROOT/doc/modules/SFIFO/SFIFO-spec.md'

/** The SFIFO's inputs (dual-port, no almost flags) but `clk`. Every other lane is an output */
const INPUTS = ['rst_n', 'push_en', 'pop_en', 'push_data']
const OUTPUTS = ['pop_data', 'empty', 'full', 'curr_depth']

/** One timing diagram of the SFIFO spec, as a table: its cycles, and each lane's value in each */
export interface SFIFOWaveTable {
  cycles: number
  /** The input lanes, which a VectorPlayer drives */
  driven: TableLane[]
  /** The output lanes, which a VectorChecker checks */
  checked: TableLane[]
}

/**
 * Diagram `svg` of the SFIFO spec as a table, for an SFIFO with parameters `config`. The diagram
 * must have a lane for every port but `clk` of a dual-port SFIFO without almost flags, the one
 * the diagrams are drawn for. A lane marked x in a cycle has the value `undefined` there.
 */
export function sfifoWaveTable (svg: string, config: SFIFO_Parameters): SFIFOWaveTable {
  if (config.simultPushPop === false || config.inclAlmostFull === true || config.inclAlmostEmpty === true) {
    throw Error(`${svg}: the SFIFO diagrams are drawn for a dual-port SFIFO without almost flags`)
  }
  const { cycles, lanes } = diagramLanes(SFIFO_SPEC, svg)
  const diagram = new Map(lanes.map(l => [l.name, l.values.map(v => v === undefined ? undefined : BigInt(v))]))
  const ports = [...INPUTS, ...OUTPUTS]
  for (const name of diagram.keys()) {
    if (!ports.includes(name)) throw Error(`${svg} has a lane ${name}, which isn't an SFIFO port`)
  }
  const lane = (port: string): TableLane => {
    const values = diagram.get(port)
    if (values === undefined) throw Error(`${svg} has no lane for SFIFO port ${port}`)
    const width = port.endsWith('_data') ? Number(config.dataWidth) : port === 'curr_depth' ? Math.ceil(Math.log2(Number(config.depth) + 1)) : 1
    return { port, width, values }
  }
  return { cycles, driven: INPUTS.map(lane), checked: OUTPUTS.map(lane) }
}

export interface SFIFOWaveHarness_Parameters {
  name: string
  /** The diagram to replay: its SVG file name in the SFIFO spec. */
  svg: string
  /**
   * The SFIFO's parameters. They must give a dual-port SFIFO without almost flags, the one the
   * diagrams are drawn for.
   */
  config: SFIFO_Parameters
  /** The player's pattern file, as the SV names it: the diagram's input lanes (`VectorPlayer.records()`). */
  stimulus: string
  /** The checker's pattern file, as the SV names it: the diagram's output lanes (`VectorChecker.records()`). */
  expected: string
}

/**
 * SFIFOWaveHarness — replays one timing diagram from the SFIFO spec against a dual-port SFIFO,
 * cycle by cycle: an example of a block testbench built on tier 1 alone
 * (doc/framework/testbench.md).
 *
 * The diagram has a lane for every SFIFO port but `clk`. A VectorPlayer drives the input lanes,
 * and a VectorChecker checks each output lane, as a check of its own. Their tables are pattern
 * files that the test writes from the diagram (`sfifoWaveTable()`), so the harness holds only the
 * diagram's shape: its lanes and its cycle count. A lane marked x in a cycle is driven 0, or not
 * checked in it. The diagram starts with `rst_n` low, so the SFIFO is in reset through the
 * harness's reset, the player's priming cycle and the diagram's cycle 0, which is the player's
 * row 0. `rst_n` comes from the player's memory read register, a flop (SV guide RST-4).
 */
export class SFIFOWaveHarness extends Harness {
  constructor (params: SFIFOWaveHarness_Parameters) {
    super({ name: params.name })
    const { config } = params
    const { cycles, driven, checked } = sfifoWaveTable(params.svg, config)

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
      checkerBindings[`fail_${port}`] = this.check(port, `${port} follows ${params.svg}`, VectorChecker.firstError('chk', port, 'cycle'))
    }

    this.addSignal('row', { width: this.bitWidth(cycles) })
    this.addSignal('fetch', { width: fetchWidth(cycles) })
    this.addSignal('run', { width: 1 })
    this.addSubmodule('play', new VectorPlayer({ name: `${params.name}_play`, rows: cycles, lanes: driven, file: params.stimulus }), playerBindings, false)
    this.addSubmodule('chk', new VectorChecker({ name: `${params.name}_chk`, rows: cycles, lanes: checked, file: params.expected }), checkerBindings, false)
    this.addSubmodule('dut', new SFIFO(config), dutBindings, false)
    this.finish()
  }
}

export default SFIFOWaveHarness

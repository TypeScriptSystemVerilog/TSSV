import { SFIFO, type SFIFO_Parameters } from 'tssv/lib/modules/SFIFO'
import { Harness } from 'tssv/lib/tb/Harness'
import { VectorPlayer, type DriveLane } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker, type CheckLane } from 'tssv/lib/tb/VectorChecker'
import { diagramLanes } from 'tssv/lib/tb/wavedromVectors'

export const SFIFO_SPEC = '$TSSV_ROOT/doc/modules/SFIFO/SFIFO-spec.md'

/**
 * The diagram to replay, and the SFIFO's size, as SFIFO takes it. Its other parameters keep their
 * defaults, the dual-port SFIFO without almost flags that the diagrams are drawn for.
 */
export interface SFIFOWaveHarness_Parameters extends Pick<SFIFO_Parameters, 'dataWidth' | 'depth'> {
  name: string
  /** The diagram to replay: its SVG file name in the SFIFO spec. */
  svg: string
}

/** The SFIFO's inputs (dual-port, no almost flags) but `clk`. Every other lane is an output */
const INPUTS = ['rst_n', 'push_en', 'pop_en', 'push_data']
const OUTPUTS = ['pop_data', 'empty', 'full', 'curr_depth']

/**
 * SFIFOWaveHarness — replays one timing diagram from the SFIFO spec against a dual-port SFIFO,
 * cycle by cycle: an example of a block testbench built on tier 1 alone
 * (doc/framework/testbench.md).
 *
 * The diagram has a lane for every SFIFO port but `clk`. A VectorPlayer drives the input lanes,
 * `rst_n` from a flop (SV guide RST-4), and a VectorChecker checks each output lane, as a check
 * of its own. A lane marked x in a cycle is driven 0, or not checked in it. The diagram starts
 * with `rst_n` low, so the SFIFO is in reset through the harness's reset and the diagram's
 * cycle 0, which is the VectorPlayer's row 0.
 */
export class SFIFOWaveHarness extends Harness {
  constructor (params: SFIFOWaveHarness_Parameters) {
    super({ name: params.name })
    const { cycles, lanes } = diagramLanes(SFIFO_SPEC, params.svg)
    const diagram = new Map(lanes.map(l => [l.name, l.values.map(v => v === undefined ? undefined : BigInt(v))]))
    const ports = [...INPUTS, ...OUTPUTS]
    for (const name of diagram.keys()) {
      if (!ports.includes(name)) throw Error(`${params.name}: ${params.svg} has a lane ${name}, which isn't an SFIFO port`)
    }
    const width = (port: string): number =>
      port.endsWith('_data') ? Number(params.dataWidth) : port === 'curr_depth' ? this.bitWidth(params.depth) : 1

    // One net per SFIFO port, named after it, between the DUT and the player or checker
    const driven: DriveLane[] = []
    const checked: CheckLane[] = []
    const dutBindings: Record<string, string> = { clk: 'clk' }
    const playerBindings: Record<string, string> = { clk: 'clk', rst_b: 'rst_b', row: 'row', done: 'done' }
    const checkerBindings: Record<string, string> = { clk: 'clk', rst_b: 'rst_b', row: 'row' }
    for (const port of ports) {
      const values = diagram.get(port)
      if (values === undefined) throw Error(`${params.name}: ${params.svg} has no lane for SFIFO port ${port}`)
      this.addSignal(port, { width: width(port) })
      dutBindings[port] = port
      if (INPUTS.includes(port)) {
        driven.push({ port, width: width(port), values, registered: port === 'rst_n' })
        playerBindings[port] = port
      } else {
        checked.push({ port, width: width(port), values })
        checkerBindings[port] = port
        checkerBindings[`fail_${port}`] = this.check(port, `${port} follows ${params.svg}`, VectorChecker.firstError('chk', port, 'cycle'))
      }
    }

    this.addSignal('row', { width: this.bitWidth(cycles) })
    this.addSubmodule('play', new VectorPlayer({ name: `${params.name}_play`, rows: cycles, lanes: driven }), playerBindings, false)
    this.addSubmodule('chk', new VectorChecker({ name: `${params.name}_chk`, rows: cycles, lanes: checked }), checkerBindings, false)
    this.addSubmodule('dut', new SFIFO({ dataWidth: params.dataWidth, depth: params.depth }), dutBindings, false)
    this.finish()
  }
}

export default SFIFOWaveHarness

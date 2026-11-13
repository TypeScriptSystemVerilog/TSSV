import { Harness } from 'tssv/lib/tb/Harness'
import { LFSR, LFSRModel, PRBS7_POLY, type LFSR_Parameters } from 'tssv/lib/modules/LFSR'
import { VectorPlayer, fetchWidth, type TableLane } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'

/** Cycles each LFSR is checked for: more than PRBS7's period of 127, so its case sees it repeat */
export const ROWS = 160

/** One LFSR under test: `tag` names its instance, check, nets and pattern file, and `config` is its parameters */
export interface LFSRCase { tag: string, config: LFSR_Parameters }

/**
 * The cases: polynomials from the library and given in each form, advances of 1, less than the
 * width, more than it and equal to it, outputs narrower than the state, and a loadable LFSR
 */
export const CASES: LFSRCase[] = [
  { tag: 'prbs7', config: { width: 7n, polynomial: PRBS7_POLY, seed: 1n } },
  { tag: 'w16_a8', config: { width: 16n, seed: 0xace1n, advance: 8n, outWidth: 8n } },
  { tag: 'w33_a40', config: { width: 33n, polynomial: [33, 20, 0], seed: 0x1_2345_6789n, advance: 40n } },
  { tag: 'w64_a64', config: { width: 64n, seed: 0x0123456789abcdefn, advance: 64n } },
  { tag: 'load32', config: { width: 32n, polynomial: 'x^32 + x^22 + x^2 + x + 1', seed: 0x9e3779b9n, advance: 32n, loadable: true } }
]

/**
 * What the player drives on a loadable case's `load` and `seed_in`: in each listed row, `load` is
 * high with that seed, and in every other row it is low. Rows 30 and 31 load two seeds back to
 * back, and rows 50 and 51 load one seed twice, so its value shows twice before the sequence moves.
 */
export const LOADS = new Map<number, bigint>([
  [10, 0x0badcafen],
  [30, 0x12345678n],
  [31, 0x9abcdef1n],
  [50, 0x0f0f0f0fn],
  [51, 0x0f0f0f0fn]
])

/** The player's lanes: `load` and `seed_in`, for every loadable case */
export function loadLanes (): TableLane[] {
  const rows = Array.from({ length: ROWS }, (_, r) => LOADS.get(r))
  return [
    { port: 'load', width: 1, values: rows.map(s => s === undefined ? 0n : 1n) },
    { port: 'seed_in', width: 32, values: rows.map(s => s ?? 0n) }
  ]
}

/** What a case's check says it checks */
export function caseDescription ({ config }: LFSRCase): string {
  const m = new LFSRModel(config)
  const what = `an LFSR with ${m.polynomial}, ${m.advance} shift${m.advance === 1 ? '' : 's'} a step, from seed 0x${config.seed.toString(16)}`
  return config.loadable === true ? `${what}, restarting at each loaded seed, gives the model's values` : `${what}, gives the model's low ${m.outWidth} bits`
}

/**
 * A case's checked lane: the LFSR's `value`, with the model's value in each row. A loadable case
 * restarts the model at each seed in LOADS.
 */
export function caseLane (c: LFSRCase): TableLane {
  const m = new LFSRModel(c.config)
  const values: bigint[] = []
  let state = c.config.seed
  for (let r = 0; r < ROWS; r++) {
    if (c.config.loadable === true) state = LOADS.get(r) ?? state
    values.push(m.value(state))
    state = m.next(state)
  }
  return { port: 'value', width: m.outWidth, values }
}

export interface LFSRHarness_Parameters {
  name: string
  /**
   * The folder of the pattern files, as the SV names it: `stimulus.hex`, the player's `load` and
   * `seed_in` (`loadLanes()`, `VectorPlayer.records()`), and `expect_<tag>.hex` per case, the
   * model's values (`caseLane()`, `VectorChecker.records()`).
   */
  patterns: string
}

/**
 * LFSRHarness — checks the LFSR module (doc/modules/LFSR/LFSR-spec.md) against its model,
 * LFSRModel. Each case's LFSR steps at every rising edge on which the VectorPlayer's `run` is high,
 * so its value in row r is the model's r-th. A VectorChecker compares it with the model, row by
 * row, for ROWS rows, from a pattern file the test writes. A VectorPlayer counts the rows, raises
 * `done`, and drives a loadable case's `load` and `seed_in` from LOADS.
 */
export class LFSRHarness extends Harness {
  constructor (params: LFSRHarness_Parameters) {
    super({ name: params.name })
    this.addSignal('row', { width: this.bitWidth(ROWS) })
    this.addSignal('fetch', { width: fetchWidth(ROWS) })
    this.addSignal('run', { width: 1 })
    this.addSignal('load', { width: 1 })
    this.addSignal('seed_in', { width: 32 })
    this.addSubmodule('play', new VectorPlayer({
      name: `VectorPlayer_${params.name}`,
      rows: ROWS,
      lanes: loadLanes(),
      file: `${params.patterns}/stimulus.hex`
    }), { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', done: 'done', load: 'load', seed_in: 'seed_in' }, false)

    for (const c of CASES) {
      const { tag, config } = c
      const outWidth = new LFSRModel(config).outWidth
      const valueNet = `value_${tag}`
      this.addSignal(valueNet, { width: outWidth })
      const loads: Record<string, string> = config.loadable === true ? { load: 'load', seed_in: 'seed_in' } : {}
      this.addSubmodule(`lfsr_${tag}`, new LFSR(config),
        { clk: 'clk', rst_n: 'rst_b', step: 'run', value: valueNet, ...loads }, false)
      const failNet = this.check(tag, caseDescription(c), VectorChecker.firstError(`chk_${tag}`, 'value', 'cycle'))
      this.addSubmodule(`chk_${tag}`, new VectorChecker({
        name: `VectorChecker_${params.name}_${tag}`,
        rows: ROWS,
        lanes: [{ port: 'value', width: outWidth }],
        file: `${params.patterns}/expect_${tag}.hex`
      }), { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', value: valueNet, fail_value: failNet }, false)
    }
    this.finish()
  }
}

export default LFSRHarness

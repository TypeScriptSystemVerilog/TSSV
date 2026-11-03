import { Harness } from 'tssv/lib/tb/Harness'
import { Lfsr, type Lfsr_Parameters } from 'tssv/lib/tb/Lfsr'
import { xorshiftNext } from 'tssv/lib/tb/xorshift'
import { VectorPlayer, fetchWidth, type TableLane } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'

/** Cycles each Lfsr is checked for */
export const ROWS = 64

/** One Lfsr under test: `tag` names its instance, check, nets and pattern file, and `config` is its parameters */
export interface LfsrCase { tag: string, config: Lfsr_Parameters }

export const CASES: LfsrCase[] = [
  { tag: 'x64', config: { width: 64, seed: 0x0123456789abcdefn, outWidth: 64 } },
  { tag: 'x32_8', config: { width: 32, seed: 0xdeadbeefn, outWidth: 8 } },
  { tag: 'load32', config: { width: 32, seed: 0x9e3779b9n, outWidth: 32, loadable: true } }
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

/** A case's Lfsr width and outWidth, with Lfsr's defaults */
export function caseWidths ({ config }: LfsrCase): { width: 32 | 64, outWidth: number } {
  const width = config.width ?? 64
  return { width, outWidth: config.outWidth ?? width }
}

/**
 * A case's checked lane: the Lfsr's `value`, with the xorshift model's value in each row. A
 * loadable case restarts the model at each seed in LOADS.
 */
export function caseLane (c: LfsrCase): TableLane {
  const { width, outWidth } = caseWidths(c)
  const values: bigint[] = []
  let x = c.config.seed
  for (let r = 0; r < ROWS; r++) {
    if (c.config.loadable === true) x = LOADS.get(r) ?? x
    values.push(x & ((1n << BigInt(outWidth)) - 1n))
    x = xorshiftNext(width, x)
  }
  return { port: 'value', width: outWidth, values }
}

export interface LfsrHarness_Parameters {
  name: string
  /**
   * The folder of the pattern files, as the SV names it: `stimulus.hex`, the player's `load` and
   * `seed_in` (`loadLanes()`, `VectorPlayer.records()`), and `expect_<tag>.hex` per case, the
   * model's values (`caseLane()`, `VectorChecker.records()`).
   */
  patterns: string
}

/**
 * LfsrHarness — checks tier 1's Lfsr (doc/framework/testbench.md) against a model of the
 * sequence it is meant to produce. Each case's Lfsr steps at every rising edge on which the
 * VectorPlayer's `run` is high, so its value in row r is the model's r-th. A VectorChecker
 * compares it with the model, row by row, for ROWS rows, from a pattern file the test writes. A
 * VectorPlayer counts the rows, raises `done`, and drives a loadable case's `load` and `seed_in`
 * from LOADS.
 */
export class LfsrHarness extends Harness {
  constructor (params: LfsrHarness_Parameters) {
    super({ name: params.name })
    this.addSignal('row', { width: this.bitWidth(ROWS) })
    this.addSignal('fetch', { width: fetchWidth(ROWS) })
    this.addSignal('run', { width: 1 })
    this.addSignal('load', { width: 1 })
    this.addSignal('seed_in', { width: 32 })
    this.addSubmodule('play', new VectorPlayer({
      name: `${params.name}_play`,
      rows: ROWS,
      lanes: loadLanes(),
      file: `${params.patterns}/stimulus.hex`
    }), { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', done: 'done', load: 'load', seed_in: 'seed_in' }, false)

    for (const c of CASES) {
      const { tag, config } = c
      const { width, outWidth } = caseWidths(c)
      const valueNet = `value_${tag}`
      this.addSignal(valueNet, { width: outWidth })
      const loads: Record<string, string> = config.loadable === true ? { load: 'load', seed_in: 'seed_in' } : {}
      this.addSubmodule(`lfsr_${tag}`, new Lfsr(config),
        { clk: 'clk', rst_b: 'rst_b', step: 'run', value: valueNet, ...loads }, false)
      const what = config.loadable === true
        ? `a loadable ${width}-bit Lfsr from seed 0x${config.seed.toString(16)} restarts at each loaded seed`
        : `a ${width}-bit Lfsr from seed 0x${config.seed.toString(16)} gives xorshift${width}'s low ${outWidth} bits`
      const failNet = this.check(tag, what, VectorChecker.firstError(`chk_${tag}`, 'value', 'cycle'))
      this.addSubmodule(`chk_${tag}`, new VectorChecker({
        name: `${params.name}_chk_${tag}`,
        rows: ROWS,
        lanes: [{ port: 'value', width: outWidth }],
        file: `${params.patterns}/expect_${tag}.hex`
      }), { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', value: valueNet, fail_value: failNet }, false)
    }
    this.finish()
  }
}

export default LfsrHarness

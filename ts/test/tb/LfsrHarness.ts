import { Harness } from 'tssv/lib/tb/Harness'
import { Lfsr, type Lfsr_Parameters } from 'tssv/lib/tb/Lfsr'
import { VectorPlayer, fetchWidth, type TableLane } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'

/** Cycles each Lfsr is checked for */
export const ROWS = 64

/** One Lfsr under test: `tag` names its instance, check, nets and pattern file, and `config` is its parameters */
export interface LfsrCase { tag: string, config: Lfsr_Parameters }

export const CASES: LfsrCase[] = [
  { tag: 'x64', config: { width: 64, seed: 0x0123456789abcdefn, outWidth: 64 } },
  { tag: 'x32_8', config: { width: 32, seed: 0xdeadbeefn, outWidth: 8 } }
]

/** A case's Lfsr width and outWidth, with Lfsr's defaults */
export function caseWidths ({ config }: LfsrCase): { width: 32 | 64, outWidth: number } {
  const width = config.width ?? 64
  return { width, outWidth: config.outWidth ?? width }
}

/**
 * The first `n` values of Marsaglia's xorshift on `width` bits from `seed` ("Xorshift RNGs", 2003,
 * the triples (13, 17, 5) for 32 bits and (13, 7, 17) for 64), each cut to its low `outWidth` bits:
 * what an Lfsr stepping every cycle shows on `value`.
 */
export function xorshift (width: 32 | 64, seed: bigint, outWidth: number, n: number): bigint[] {
  const [a, b, c] = width === 32 ? [13n, 17n, 5n] : [13n, 7n, 17n]
  const mask = (1n << BigInt(width)) - 1n
  const out: bigint[] = []
  let x = seed
  for (let i = 0; i < n; i++) {
    out.push(x & ((1n << BigInt(outWidth)) - 1n))
    x ^= (x << a) & mask
    x ^= x >> b
    x ^= (x << c) & mask
  }
  return out
}

/** A case's checked lane: the Lfsr's `value`, with the model's value in each row */
export function caseLane (c: LfsrCase): TableLane {
  const { width, outWidth } = caseWidths(c)
  return { port: 'value', width: outWidth, values: xorshift(width, c.config.seed, outWidth, ROWS) }
}

export interface LfsrHarness_Parameters {
  name: string
  /**
   * The folder of the checkers' pattern files, as the SV names it: `expect_<tag>.hex` per case,
   * the model's values (`caseLane()`, `VectorChecker.records()`).
   */
  patterns: string
}

/**
 * LfsrHarness — checks tier 1's Lfsr (doc/framework/testbench.md) against a model of the
 * sequence it is meant to produce. Each case's Lfsr steps at every rising edge on which the
 * VectorPlayer's `run` is high, so its value in row r is the model's r-th. A VectorChecker
 * compares it with the model, row by row, for ROWS rows, from a pattern file the test writes. A
 * VectorPlayer with no lanes counts the rows and raises `done`.
 */
export class LfsrHarness extends Harness {
  constructor (params: LfsrHarness_Parameters) {
    super({ name: params.name })
    this.addSignal('row', { width: this.bitWidth(ROWS) })
    this.addSignal('fetch', { width: fetchWidth(ROWS) })
    this.addSignal('run', { width: 1 })
    this.addSubmodule('play', new VectorPlayer({ name: `${params.name}_play`, rows: ROWS, lanes: [] }),
      { clk: 'clk', rst_b: 'rst_b', row: 'row', fetch: 'fetch', run: 'run', done: 'done' }, false)

    for (const c of CASES) {
      const { tag, config } = c
      const { width, outWidth } = caseWidths(c)
      const valueNet = `value_${tag}`
      this.addSignal(valueNet, { width: outWidth })
      this.addSubmodule(`lfsr_${tag}`, new Lfsr(config),
        { clk: 'clk', rst_b: 'rst_b', step: 'run', value: valueNet }, false)
      const failNet = this.check(tag,
        `a ${width}-bit Lfsr from seed 0x${config.seed.toString(16)} gives xorshift${width}'s low ${outWidth} bits`,
        VectorChecker.firstError(`chk_${tag}`, 'value', 'cycle'))
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

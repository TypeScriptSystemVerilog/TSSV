import TSSV from 'tssv/lib/core/TSSV'
import { RegisterBlock } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { AXI4Stream } from 'tssv/lib/interfaces/AMBA/AMBA4/AXI4Stream/r0p0_1/AXI4Stream'
import { createFirCoeffsDef } from './regs-fir_coeffs.js'

type coeffType = bigint[]
type inOutWidthType = TSSV.IntRange<1, 32>
type coeffWidthType = TSSV.IntRange<2, 32>
type rShiftType = TSSV.IntRange<0, 32>
type accWidthType = TSSV.IntRange<1, 128>

/** width of `TDATA` on both streams */
const STREAM_WIDTH = 32
/** address width of the `regs` bus; its data width is the coefficient block's word size */
const REGS_ADDR_WIDTH = 32

/**
 * configuration parameters of the FIR module
 */
export interface FIR_Parameters extends TSSV.TSSVParameters {
  /**
   * number of filter taps, and of coefficient registers; a positive integer
   */
  numTaps: number
  /**
   * reset value of each coefficient register, tap 0 first. Taps past the end of the list reset
   * to 0n. Each value must fit in `coefficientsWidth` bits, signed
   */
  coefficients?: coeffType
  /**
   * bit width of the signed coefficient registers (default 32)
   */
  coefficientsWidth?: coeffWidthType
  /**
   * bit width of the signed input samples, the low bits of `s_axis.TDATA` (default 8)
   */
  inWidth?: inOutWidthType
  /**
   * bit width of the signed output samples (default 9). The rounded sum saturates to this width,
   * and `m_axis.TDATA` carries it sign-extended to 32 bits
   */
  outWidth?: inOutWidthType
  /**
   * right shift from the accumulator to the output, rounding half up (default 2). 0 passes the
   * accumulator through unrounded
   */
  rShift?: rShiftType
  /**
   * bit width of the signed accumulator. The default, `inWidth + coefficientsWidth +
   * floor(log2(numTaps))`, holds the sum for any coefficients. A narrower accumulator wraps when
   * a sum doesn't fit, so choose one only when every set of coefficients written at runtime keeps
   * the sums in range. It must be more than `rShift`, and at most the default
   */
  accumulatorWidth?: accWidthType
}

type FIR_ParamsNorm = Omit<FIR_Parameters, 'coefficients' | 'coefficientsWidth' | 'inWidth' | 'outWidth' | 'rShift' | 'accumulatorWidth'> & {
  numTaps: number
  coefficients: coeffType
  coefficientsWidth: coeffWidthType
  inWidth: inOutWidthType
  outWidth: inOutWidthType
  rShift: rShiftType
  accumulatorWidth: accWidthType
}

/**
 * The narrowest signed width that holds a sum of `numTaps` products of an `inWidth`-bit and a
 * `coefficientsWidth`-bit signed value. The largest sum in magnitude is `numTaps` products of the
 * two most negative values, `numTaps * 2^(inWidth + coefficientsWidth - 2)`.
 */
function fullAccumulatorWidth (numTaps: number, inWidth: number, coefficientsWidth: number): number {
  return inWidth + coefficientsWidth + numTaps.toString(2).length - 1
}

/**
 * The parameters with every default applied, in a fixed order, so that the derived module name
 * doesn't depend on which parameters the caller passed or in what order (PARAM-2).
 */
function normalizeFIRParams (p: FIR_Parameters): FIR_ParamsNorm {
  // numTaps sizes the defaults below, so it's checked before them (PARAM-5)
  if (!Number.isInteger(p.numTaps) || p.numTaps < 1) {
    throw Error(`FIR: numTaps must be a positive integer, got ${p.numTaps}`)
  }
  const coefficients = p.coefficients ?? []
  const coefficientsWidth = p.coefficientsWidth ?? 32
  const inWidth = p.inWidth ?? 8
  return {
    name: p.name,
    numTaps: p.numTaps,
    // taps past the end reset to 0n, so a short list names the same module as its padded form
    coefficients: [...coefficients, ...Array<bigint>(Math.max(0, p.numTaps - coefficients.length)).fill(0n)],
    coefficientsWidth,
    inWidth,
    outWidth: p.outWidth ?? 9,
    rShift: p.rShift ?? 2,
    accumulatorWidth: p.accumulatorWidth ?? fullAccumulatorWidth(p.numTaps, inWidth, coefficientsWidth) as accWidthType
  }
}

/**
 * FIR Interface
 *
 * Input samples arrive on the `s_axis` AXI4-Stream slave interface (TDATA[inWidth-1:0], signed).
 * Filtered output samples are produced on the `m_axis` AXI4-Stream master interface (TDATA sign-extended to 32 bits).
 * Coefficient registers are written and read over the `regs` Memory bus.
 *
 * Backpressure is fully supported: `s_axis.TREADY` deasserts when `m_axis.TREADY` is low and
 * the output stage holds valid data, stalling the entire pipeline.
 *
 * Latency: a sample transferred on `s_axis` in cycle c comes out on `m_axis` in cycle c + 3,
 * unless `m_axis` stalls. `doc/modules/FIR/FIR-spec.md` has this diagram too, and
 * `ts/test/test_FIR.ts` checks that the two match.
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "clk",           "wave": "p..............."},
 *     {"name": "s_axis.TVALID", "wave": "01.0.1.01...0..."},
 *     {"name": "s_axis.TREADY", "wave": "1........0.1...."},
 *     {"name": "s_axis.TDATA",  "wave": "x34x.56x78..x...", "data": ["i0", "i1", "i2", "i3", "i4", "i5"]},
 *     {"name": "m_axis.TVALID", "wave": "0...1.0.1...01.0"},
 *     {"name": "m_axis.TREADY", "wave": "1........0.1...."},
 *     {"name": "m_axis.TDATA",  "wave": "x...34x.56..x78x", "data": ["o0", "o1", "o2", "o3", "o4", "o5"]}
 *   ]
 * }
 * ```
 */
export interface FIR_Ports extends TSSV.IOSignals {
  clk: { direction: 'input', isClock: 'posedge' }
  rst_b: { direction: 'input', isReset: 'lowasync' }
}

/**
 * A FIR filter on AXI4-Stream, with its coefficients in registers on a `Memory` bus.
 *
 * @see doc/modules/FIR/FIR-spec.md
 */
export class FIR extends TSSV.Module<FIR_ParamsNorm, FIR_Ports> {
  declare params: FIR_ParamsNorm
  declare IOs: FIR_Ports
  constructor (paramsIn: FIR_Parameters) {
    // 1. parameters, with defaults applied
    super(normalizeFIRParams(paramsIn))
    const { numTaps, coefficients, coefficientsWidth, inWidth, outWidth, rShift, accumulatorWidth } = this.params

    // 2. parameter checks (PARAM-5), then derived values. The types rule out most bad values;
    // these catch the rest, and callers from JavaScript
    const checkRange = (param: string, value: number, lo: number, hi: number): void => {
      if (!Number.isInteger(value) || value < lo || value > hi) {
        throw Error(`FIR ${this.name}: ${param} must be an integer from ${lo} to ${hi}, got ${value}`)
      }
    }
    checkRange('coefficientsWidth', coefficientsWidth, 2, 32)
    checkRange('inWidth', inWidth, 1, 32)
    checkRange('outWidth', outWidth, 1, 32)
    checkRange('rShift', rShift, 0, 32)
    const fullWidth = fullAccumulatorWidth(numTaps, inWidth, coefficientsWidth)
    checkRange('accumulatorWidth', accumulatorWidth, rShift + 1, fullWidth)
    if (coefficients.length > numTaps) {
      throw Error(`FIR ${this.name}: coefficients has ${coefficients.length} values for ${numTaps} taps`)
    }
    coefficients.forEach((c, i) => {
      if (this.bitWidth(c, true) > coefficientsWidth) {
        throw Error(`FIR ${this.name}: coefficients[${i}] = ${c} doesn't fit in ${coefficientsWidth} bits, signed`)
      }
    })
    const { def: coeffDef } = createFirCoeffsDef(numTaps, coefficientsWidth, coefficients)
    const regsWidth = coeffDef.wordSize
    const strbWidth = STREAM_WIDTH / 8

    // 3. IOs
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }

    // 4. interfaces
    this.addInterface('s_axis', new AXI4Stream({ DATA_WIDTH: STREAM_WIDTH }, 'inward'))
    this.addInterface('m_axis', new AXI4Stream({ DATA_WIDTH: STREAM_WIDTH }, 'outward'))
    this.addInterface('regs', new Memory({ DATA_WIDTH: regsWidth, ADDR_WIDTH: REGS_ADDR_WIDTH }, 'inward'))

    // 5. handshake: the pipeline advances when the output can drain or holds no data, and the
    // tap line shifts only on a transfer. One valid bit per stage: the tap line holds a new
    // sample, sum_q holds its sum, data_out_q holds its output
    this.addSignal('en', {})
    this.addSignal('s_xfer', {})
    this.addSignal('valid_tap_q', {})
    this.addSignal('valid_sum_q', {})
    this.addSignal('valid_out_q', {})
    this.addAssign({ in: new TSSV.Expr('m_axis.TREADY || !valid_out_q'), out: 'en' })
    this.addAssign({ in: new TSSV.Expr('en'), out: 's_axis.TREADY' })
    this.addAssign({ in: new TSSV.Expr('s_axis.TVALID && en'), out: 's_xfer' })
    this.addRegister({ d: 's_xfer', clk: 'clk', reset: 'rst_b', en: 'en', q: 'valid_tap_q' })
    this.addRegister({ d: 'valid_tap_q', clk: 'clk', reset: 'rst_b', en: 'en', q: 'valid_sum_q' })
    this.addRegister({ d: 'valid_sum_q', clk: 'clk', reset: 'rst_b', en: 'en', q: 'valid_out_q' })

    // 5. tap line: the last numTaps samples, newest in tap_0_q. TDATA's low bits are already a
    // two's-complement sample, so $signed reinterprets them rather than converting (WIDTH-9)
    this.addSignal('data_in', { width: inWidth, isSigned: true })
    this.addAssign({ in: new TSSV.Expr(`$signed(s_axis.TDATA[${inWidth - 1}:0])`), out: 'data_in' })
    const taps: string[] = []
    for (let i = 0; i < numTaps; i++) {
      const tap = `tap_${i}_q`
      this.addSignal(tap, { width: inWidth, isSigned: true })
      this.addRegister({ d: taps[i - 1] ?? 'data_in', clk: 'clk', reset: 'rst_b', en: 's_xfer', q: tap })
      taps.push(tap)
    }

    // 5. coefficient registers, one per tap, written and read over regs
    const coeffs: string[] = []
    const coeffBindings: Record<string, string> = { clk: 'clk', rst_b: 'rst_b', regs: 'regs' }
    for (let i = 0; i < numTaps; i++) {
      coeffs.push(`coeff_${i}`)
      this.addSignal(`coeff_${i}`, { width: coefficientsWidth, isSigned: true })
      coeffBindings[`COEFF_${i}`] = `coeff_${i}`
    }
    const coeffRegBlock = new RegisterBlock<Record<string, bigint>>(
      { name: `${this.name}_coeffRegs`, busAddressWidth: REGS_ADDR_WIDTH },
      coeffDef,
      new Memory()
    )
    this.addSubmodule('u_coeff_regs', coeffRegBlock, coeffBindings)
    // A coefficient register is coefficientsWidth bits, so it reads only that many DATA_WR bits
    // and the WSTRB lanes that hold them
    const usedLanes = Math.ceil(coefficientsWidth / 8)
    const unusedRegs: string[] = []
    if (coefficientsWidth < regsWidth) unusedRegs.push(`regs.DATA_WR[${regsWidth - 1}:${coefficientsWidth}]`)
    if (usedLanes < regsWidth / 8) unusedRegs.push(`regs.WSTRB[${regsWidth / 8 - 1}:${usedLanes}]`)
    if (unusedRegs.length > 0) {
      this.ignoreInputs('regs_unused_bits', `coefficient registers are ${coefficientsWidth} bits wide, so they don't read these bits of the ${regsWidth}-bit bus`, unusedRegs)
    }

    // 5. products and their sum. A narrower accumulator than the full width wraps (WIDTH-2)
    const products: string[] = []
    for (let i = 0; i < numTaps; i++) {
      const prod = `prod_${i}`
      this.addSignal(prod, { width: inWidth + coefficientsWidth, isSigned: true })
      this.addMultiplier({ a: taps[i] ?? '', b: coeffs[i] ?? '', result: prod })
      products.push(prod)
    }
    const sum = products.join(' + ')
    this.addSignal('sum_nxt', { width: accumulatorWidth, isSigned: true })
    this.addSignal('sum_q', { width: accumulatorWidth, isSigned: true })
    this.addAssign({ in: new TSSV.Expr(accumulatorWidth < fullWidth ? `${accumulatorWidth}'(${sum})` : sum), out: 'sum_nxt' })
    // datapath register, read only while valid_sum_q is high: no reset (RST-3)
    this.addRegister({ d: 'sum_nxt', clk: 'clk', en: 'en', q: 'sum_q' })

    // 5. round, saturate and register the output. One extra bit holds rounding's carry
    let rounded = 'sum_q'
    if (rShift > 0) {
      rounded = 'rounded'
      this.addSignal(rounded, { width: accumulatorWidth - rShift + 1, isSigned: true })
      this.addRound({ in: 'sum_q', out: rounded, rShift })
    }
    this.addSignal('saturated', { width: outWidth, isSigned: true })
    this.addSaturate({ in: rounded, out: 'saturated' })
    this.addSignal('data_out_q', { width: outWidth, isSigned: true })
    // datapath register, read only while valid_out_q is high: no reset (RST-3)
    this.addRegister({ d: 'saturated', clk: 'clk', en: 'en', q: 'data_out_q' })

    // 5. output stream: every beat is a whole packet with every byte valid
    this.addAssign({ in: new TSSV.Expr('valid_out_q'), out: 'm_axis.TVALID' })
    this.addAssign({ in: new TSSV.Expr(`$unsigned(${STREAM_WIDTH}'(data_out_q))`), out: 'm_axis.TDATA' })
    this.addAssign({ in: new TSSV.Expr("1'b1"), out: 'm_axis.TLAST' })
    this.addAssign({ in: new TSSV.Expr(`{${strbWidth}{1'b1}}`), out: 'm_axis.TSTRB' })
    this.addAssign({ in: new TSSV.Expr(`{${strbWidth}{1'b1}}`), out: 'm_axis.TKEEP' })
    this.addAssign({ in: new TSSV.Expr("'0"), out: 'm_axis.TID' })
    this.addAssign({ in: new TSSV.Expr("'0"), out: 'm_axis.TDEST' })
    this.addAssign({ in: new TSSV.Expr("1'b0"), out: 'm_axis.TWAKEUP' })
    this.ignoreInputs('axis_unused_clk', 'FIR runs on clk and rst_b and has no clock enable, so it ignores ACLK, ARESETn and ACLKEN on both streams',
      ['s', 'm'].flatMap(p => ['ACLK', 'ACLKEN', 'ARESETn'].map(s => `${p}_axis.${s}`)))
  }

  /**
   * Reads `inputs` into a signal that nothing uses, under a waiver for that signal only (LINT-3),
   * so lint doesn't report inputs the design ignores on purpose. `reason` says why they're ignored.
   */
  private ignoreInputs (name: string, reason: string, inputs: string[]): void {
    this.addBody(`
      // ${reason}
      /* verilator lint_off UNUSEDSIGNAL */
      logic ${name};
      /* verilator lint_on UNUSEDSIGNAL */
      assign ${name} = ^{${inputs.join(', ')}};
    `)
  }
}

export default FIR

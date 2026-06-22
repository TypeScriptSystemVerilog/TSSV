import TSSV from 'tssv/lib/core/TSSV'
import { RegisterBlock } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { AXI4Stream } from 'tssv/lib/interfaces/AMBA/AMBA4/AXI4Stream/r0p0_1/AXI4Stream'
import { createFirCoeffsDef } from './regs-fir_coeffs.js'

type coeffType = bigint[]
type inOutWidthType = TSSV.IntRange<1, 32>
type rShiftType = TSSV.IntRange<0,32>
/**
 * configuration parameters of the FIR module
 */
export interface FIR_Parameters extends TSSV.TSSVParameters {
  /**
     * number of filter taps (= number of coefficient registers)
     */
  numTaps: number
  /**
     * optional reset values for each coefficient register (index 0 = tap 0)
     * defaults to 0n for all taps if omitted; used to size the accumulator
     */
  coefficients?: coeffType
  /**
     * bit width of the FIR input data
     */
  inWidth?: inOutWidthType
  /**
     * bit width of the FIR output data
     * @remarks result will be saturated or ign extended as needed
     */
  outWidth?: inOutWidthType
  /**
     * right to apply to the FIR result to scale down the output
     */
  rShift?: rShiftType
}

type FIR_ParamsNorm = Omit<FIR_Parameters, 'coefficients'|'inWidth'|'outWidth'|'rShift'> & {
  numTaps: number
  coefficients: coeffType
  inWidth: inOutWidthType
  outWidth: inOutWidthType
  rShift: rShiftType
}

/*
  This function allows parameters to take on default values
    if they are not specified.
*/
function normalizeFIRParams(p: FIR_Parameters): FIR_ParamsNorm {
  return {
    ...p,
    coefficients: (p.coefficients ?? Array(p.numTaps).fill(0n)) as coeffType,
    inWidth: (p.inWidth ?? 8) as inOutWidthType,
    outWidth: (p.outWidth ?? 9) as inOutWidthType,
    rShift: (p.rShift ?? 2) as rShiftType,
  }
}

/**
 * FIR Interface
 *
 * Input samples arrive on the `s_axis` AXI4-Stream slave interface (TDATA[inWidth-1:0], signed).
 * Filtered output samples are produced on the `m_axis` AXI4-Stream master interface (TDATA sign-extended to 32 bits).
 * Coefficient registers are accessible via the `regs` Memory bus (promoted from the `coeff_block` submodule).
 *
 * Backpressure is fully supported: `s_axis.TREADY` deasserts when `m_axis.TREADY` is low and
 * the output stage holds valid data, stalling the entire pipeline.
 *
 * Latency: 2 clock cycles from `s_axis` transfer to `m_axis.TVALID`.
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "          clk", "wave": "p........."},
 *     {"name": "s_axis.TVALID", "wave": "01.0.1.01."},
 *     {"name": "s_axis.TREADY", "wave": "1........."},
 *     {"name": " s_axis.TDATA", "wave": "x34..56.78", "data": ["i0","i1","i2","i3","i4","i5"]},
 *     {"name": "m_axis.TVALID", "wave": "0..1..0.1."},
 *     {"name": " m_axis.TDATA", "wave": "x...34..56", "data": ["o0","o1","o2","o3"]}
 *   ]
 * }
 * ```
 */
export interface FIR_Ports extends TSSV.IOSignals {
  clk: { direction: 'input', isClock: 'posedge' }
  rst_b: { direction: 'input', isReset: 'lowasync' }
}

export class FIR extends TSSV.Module<FIR_ParamsNorm, FIR_Ports> {
  declare params: FIR_ParamsNorm
  declare IOs: FIR_Ports
  constructor (paramsIn: FIR_Parameters) {
    const params = normalizeFIRParams(paramsIn)
    super(params)

    // flat clock/reset ports (used internally by addRegister)
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' }
    }

    // AXI4-Stream interfaces: slave input, master output
    this.addInterface('s_axis', new AXI4Stream({ DATA_WIDTH: 32 }, 'inward'))
    this.addInterface('m_axis', new AXI4Stream({ DATA_WIDTH: 32 }, 'outward'))

    // internal data path signals (bridge AXI stream ↔ FIR pipeline)
    this.addSignal('data_in', { width: params.inWidth, isSigned: true })
    this.addSignal('data_out', { width: params.outWidth, isSigned: true })
    this.addSignal('en', {})
    this.addSignal('valid_pipe_0', {})
    this.addSignal('valid_pipe_1', {})

    // AXI-to-FIR adapter assigns
    // pipeline advances when output can drain or has no valid data yet
    this.body += `   assign en = m_axis.TREADY || !valid_pipe_1;\n`
    // must use this.body directly — addAssign validates out via findSignal, which only
    // searches IOs and signals; interface sub-signals like s_axis.TREADY are not found there
    this.body += `   assign s_axis.TREADY = en;\n`
    // extract signed sample from LSBs of TDATA
    this.body += `   assign data_in = $signed(s_axis.TDATA[${params.inWidth - 1}:0]);\n`

    // 2-stage valid shift register — tracks which pipeline stages hold real data
    this.addRegister({ d: new TSSV.Expr('s_axis.TVALID'), clk: 'clk', reset: 'rst_b', en: 'en', q: 'valid_pipe_0' })
    this.addRegister({ d: 'valid_pipe_0', clk: 'clk', reset: 'rst_b', en: 'en', q: 'valid_pipe_1' })

    // build coefficient register block from factory (fir_coeffs.yaml → regs-fir_coeffs.ts)
    const numTaps = this.params.numTaps
    const { def: coeffDef } = createFirCoeffsDef(numTaps, this.params.coefficients)

    // pre-declare signals that will receive each coefficient from the register block
    const coeffSigs: TSSV.Sig[] = []
    for (let i = 0; i < numTaps; i++) {
      coeffSigs.push(this.addSignal(`coeff_${i}`, { width: 32, isSigned: true }))
    }

    const coeffRegBlock = new RegisterBlock<Record<string, bigint>>(
      { name: `${this.params.name ?? 'fir'}_coeffRegs`, busAddressWidth: 32 },
      coeffDef,
      new Memory()
    )

    // bind clk/rst_b; wire COEFF_N outputs to coeff_N signals;
    // Memory bus ports left unbound — they are promoted to FIR ports
    const coeffBindings: Record<string, string | TSSV.Sig> = { clk: 'clk', rst_b: 'rst_b' }
    for (let i = 0; i < numTaps; i++) {
      coeffBindings['COEFF_' + i] = coeffSigs[i] ?? new TSSV.Sig('0')
    }
    this.addSubmodule('coeff_block', coeffRegBlock, coeffBindings, true, true)

    let nextTapIn: TSSV.Sig = new TSSV.Sig('data_in')
    const products: TSSV.Sig[] = []
    let coeffSum = 0
    for (let i = 0; i < numTaps; i++) {
      // construct tap delay line
      const thisTap = this.addSignal(`tap_${i}`, { width: this.params.inWidth, isSigned: true })
      this.addRegister({ d: nextTapIn, clk: 'clk', reset: 'rst_b', en: 'en', q: thisTap })

      // multipliers now driven by runtime-configurable coefficient registers
      products.push(this.addMultiplier({ a: thisTap, b: coeffSigs[i] ?? new TSSV.Sig('0') }))
      coeffSum += Math.abs(Number(this.params.coefficients?.[i] ?? 0n))

      nextTapIn = thisTap
    }

    // construct final vector sum
    const sumWidth = (this.params.inWidth || 0) + this.bitWidth(coeffSum)
    const productsExt = products.map((p) => `${sumWidth}'(${p.toString()})`)
    this.addSignal('sum', { width: sumWidth, isSigned: true })
    this.addRegister({
      d: new TSSV.Expr(`${productsExt.join(' + ')}`),
      clk: 'clk',
      reset: 'rst_b',
      en: 'en',
      q: 'sum'
    })

    // round and saturate to final output
    this.addSignal('rounded', { width: sumWidth - (this.params.rShift || 0) + 1, isSigned: true })
    this.addRound({ in: 'sum', out: 'rounded', rShift: this.params.rShift || 1 })
    this.addSignal('saturated', { width: this.params.outWidth, isSigned: true })
    this.addSaturate({ in: 'rounded', out: 'saturated' })
    this.addRegister({
      d: 'saturated',
      clk: 'clk',
      reset: 'rst_b',
      en: 'en',
      q: 'data_out'
    })

    // FIR-to-AXI adapter assigns — all outputs are m_axis interface sub-signals,
    // so addAssign cannot be used (findSignal only resolves IOs and declared signals)
    this.body += `   assign m_axis.TVALID = valid_pipe_1;\n`
    // sign-extend data_out to fill the 32-bit TDATA field
    this.body += `   assign m_axis.TDATA  = {{${32 - params.outWidth}{data_out[${params.outWidth - 1}]}}, data_out};\n`
    // each sample is its own packet; all byte lanes carry valid data
    this.body += `   assign m_axis.TLAST   = 1'b1;\n`
    this.body += `   assign m_axis.TSTRB   = 4'hF;\n`
    this.body += `   assign m_axis.TKEEP   = 4'hF;\n`
    this.body += `   assign m_axis.TID     = '0;\n`
    this.body += `   assign m_axis.TDEST   = '0;\n`
    this.body += `   assign m_axis.TWAKEUP = 1'b0;\n`
  }
}

export default FIR

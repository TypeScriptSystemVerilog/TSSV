import TSSV from 'tssv/lib/core/TSSV'
import { RegisterBlock, type RegisterBlockDef } from 'tssv/lib/core/Registers'
import { Memory } from 'tssv/lib/interfaces/Memory'

type inWidthType = TSSV.IntRange<1, 32>
/**
 * configuration parameters of the FIR module
 */
export interface FIR_Parameters extends TSSV.TSSVParameters {
  /**
     * Array containing the coefficients of the FIR filter
     */
  coefficients: bigint[]
  /**
     * bit width of the FIR input data
     */
  inWidth?: inWidthType
  /**
     * bit width of the FIR output data
     * @remarks result will be saturated or ign extended as needed
     */
  outWidth?: TSSV.IntRange<1, 32>
  /**
     * right to apply to the FIR result to scale down the output
     */
  rShift?: TSSV.IntRange<0, 32>
}

/**
 * FIR Interface
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "     clk", "wave": "p........."},
 *     {"name": "      en", "wave": "01.0.1.01."},
 *     {"name": " data_in", "wave": "x34..56.78", "data": ["i0", "i1", "i2", "i3", "i4", "i5"]},
 *     {"name": "data_out", "wave": "x.34..56.7", "data": ["o0", "o1", "o2", "o3", "o4", "o5"]}
 *   ]
 * }
 * ```
 */
export interface FIR_Ports extends TSSV.IOSignals {
  clk: { direction: 'input', isClock: 'posedge' }
  rst_b: { direction: 'input', isReset: 'lowasync' }
  en: { direction: 'input' }
  data_in: { direction: 'input', width: inWidthType, isSigned: true }
  data_out: { direction: 'output', width: number, isSigned: true }
}

export class FIR extends TSSV.Module {
  declare params: FIR_Parameters
  declare IOs: FIR_Ports
  constructor (params: FIR_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      coefficients: params.coefficients,
      inWidth: params.inWidth || 8,
      outWidth: params.outWidth || 9,
      rShift: params.rShift || 2
    })

    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      en: { direction: 'input' },
      data_in: { direction: 'input', width: this.params.inWidth || 8, isSigned: true },
      data_out: { direction: 'output', width: this.params.outWidth || 9, isSigned: true }
    }

    // construct logic
    const numTaps = this.params.coefficients.length

    // pre-declare signals that will receive each coefficient from the register block
    const coeffSigs: TSSV.Sig[] = []
    for (let i = 0; i < numTaps; i++) {
      coeffSigs.push(this.addSignal(`coeff_${i}`, { width: 32, isSigned: true }))
    }

    // build coefficient register block dynamically — one RW register per tap,
    // reset values taken from the coefficients parameter
    const coeffAddrMap: Record<string, bigint> = {}
    const coeffRegisters: RegisterBlockDef<Record<string, bigint>>['registers'] = {}
    for (let i = 0; i < numTaps; i++) {
      coeffAddrMap[`COEFF_${i}`] = BigInt(i * 4)
      coeffRegisters[`COEFF_${i}`] = {
        type: 'RW',
        reset: this.params.coefficients[i] ?? 0n,
        isSigned: true,
        width: 32,
        description: `FIR tap ${i} coefficient`
      }
    }

    const coeffRegBlock = new RegisterBlock<Record<string, bigint>>(
      { name: `${this.params.name ?? 'fir'}_coeffRegs`, busAddressWidth: 32 },
      { wordSize: 32, addrMap: coeffAddrMap, registers: coeffRegisters },
      new Memory()
    )

    // bind clk/rst_b; wire COEFF_N outputs to coeff_N signals;
    // Memory bus ports left unbound — they are promoted to FIR ports
    const coeffBindings: Record<string, string | TSSV.Sig> = { clk: 'clk', rst_b: 'rst_b' }
    for (let i = 0; i < numTaps; i++) {
      coeffBindings[`COEFF_${i}`] = coeffSigs[i] ?? new TSSV.Sig('0')
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
      coeffSum += Math.abs(Number(this.params.coefficients[i] ?? 0n))

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
  }
}

export default FIR

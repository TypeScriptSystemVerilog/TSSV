import TSSV from 'tssv/lib/core/TSSV'

type coeffType = bigint[]
type inOutWidthType = TSSV.IntRange<1, 32>
type rShiftType = TSSV.IntRange<0,32>
/**
 * configuration parameters of the FIR module
 */
export interface FIR_Parameters extends TSSV.TSSVParameters {
  /**
     * Array containing the coefficients of the FIR filter
     */
  coefficients: coeffType
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

type FIR_ParamsNorm = Omit<FIR_Parameters, 'inWidth'|'outWidth'|'rShift'> & {
  coefficients: coeffType //force this to be required
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
    inWidth: (p.inWidth ?? 8) as inOutWidthType,
    outWidth: (p.outWidth ?? 9) as inOutWidthType,
    rShift: (p.rShift ?? 2) as rShiftType,
  }
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
  data_in: { direction: 'input', width: inOutWidthType, isSigned: true }
  data_out: { direction: 'output', width: number, isSigned: true }
}

export class FIR extends TSSV.Module<FIR_ParamsNorm, FIR_Ports> {
  declare params: FIR_ParamsNorm
  declare IOs: FIR_Ports
  constructor (paramsIn: FIR_Parameters) {

    const params = normalizeFIRParams(paramsIn)
    super(params)

    // define IO signals
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      en: { direction: 'input' },
      data_in: { direction: 'input', width: params.inWidth, isSigned: true },
      data_out: { direction: 'output', width: params.outWidth, isSigned: true }
    }

    // construct logic
    let nextTapIn: TSSV.Sig = new TSSV.Sig('data_in')
    const products: TSSV.Sig[] = []
    let coeffSum = 0
    for (let i = 0; i < params.coefficients.length; i++) {
      // construct tap delay line
      const thisTap = this.addSignal(`tap_${i}`, { width: params.inWidth, isSigned: true })
      this.addRegister({ d: nextTapIn, clk: 'clk', reset: 'rst_b', en: 'en', q: thisTap })

      // construct tap multipliers
      products.push(this.addMultiplier({ a: thisTap, b: params.coefficients[i] }))
      coeffSum += Math.abs(Number(params.coefficients[i]))

      nextTapIn = thisTap
    }

    // construct final vector sum
    const sumWidth = (params.inWidth) + this.bitWidth(coeffSum)
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
    this.addSignal('rounded', { width: sumWidth - params.rShift + 1, isSigned: true })
    this.addRound({ in: 'sum', out: 'rounded', rShift: params.rShift || 1 })
    this.addSignal('saturated', { width: params.outWidth, isSigned: true })
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

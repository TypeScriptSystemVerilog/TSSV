/*
* Module for generating left or right shift of input data
* To the left, fill the low bit with 0, and expand the output data bit width accordingly
* To the right, if it is a signed number, fill the sign bit with the high bit, and if it is an unsigned number, fill the high bit with 0. Truncate the low bit and keep the bit width unchanged
*/
import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'

/**
 * configuration parameters of the shift module
 */
export interface shift_Parameters extends TSSVParameters {
  /**
     * bit width of shift data
     */
  dataWidth: IntRange<1, 256>
  /**
     * Select shift direction, left or right
     */
  shift_direct?: 'left' | 'right'
  /**
     * Shift length; less than dataWidth for a right shift
     */
  shift_val: IntRange<1, 256>
  /**
     * Indicate whether the input data is a signed number
     */
  isSigned?: 'signed' | 'unsigned'
}

/**
 * Shifts `data_in` left or right by a fixed amount, combinationally.
 *
 * @see doc/modules/shift/shift-spec.md
 */
export class shift extends Module {
  declare params: shift_Parameters
  constructor (params: shift_Parameters) {
    super({
      name: params.name,
      dataWidth: params.dataWidth,
      shift_direct: params.shift_direct ?? 'right',
      shift_val: params.shift_val,
      isSigned: params.isSigned ?? 'unsigned'
    })

    // parameter checks (PARAM-5). The types rule out most bad values; these catch the rest, and
    // callers from JavaScript
    const { dataWidth, shift_direct: direction, shift_val: amount, isSigned } = this.params
    for (const [param, value] of [['dataWidth', dataWidth], ['shift_val', amount]] as const) {
      if (!Number.isInteger(value) || value < 1 || value > 256) {
        throw Error(`shift: ${param} must be an integer from 1 to 256, got ${value}`)
      }
    }
    if (direction !== 'left' && direction !== 'right') {
      throw Error(`shift: shift_direct must be 'left' or 'right', got ${String(direction)}`)
    }
    if (isSigned !== 'signed' && isSigned !== 'unsigned') {
      throw Error(`shift: isSigned must be 'signed' or 'unsigned', got ${String(isSigned)}`)
    }
    // a right shift by dataWidth or more would leave data_out constant, or only the sign bit
    if (direction === 'right' && amount >= dataWidth) {
      throw Error(`shift: shift_val must be less than dataWidth for a right shift, got ${amount} with dataWidth ${dataWidth}`)
    }

    // derived values: a left shift widens data_out to keep every bit
    const outputWidth = direction === 'left' ? dataWidth + amount : dataWidth
    const amountLiteral = `${this.bitWidth(amount)}'d${amount}`

    this.IOs = {
      data_in: { direction: 'input', width: dataWidth },
      data_out: { direction: 'output', width: outputWidth }
    }

    // the shift (WIDTH-5): concatenated zeros for a lossless left shift, >> for an unsigned right
    // shift, and >>> on data_in reinterpreted as signed for a signed one (WIDTH-9)
    if (direction === 'left') {
      this.addAssign({ in: new Expr(`{data_in, {${amount}{1'b0}}}`), out: 'data_out' })
    } else if (isSigned === 'signed') {
      this.addAssign({ in: new Expr(`$unsigned($signed(data_in) >>> ${amountLiteral})`), out: 'data_out' })
    } else {
      this.addAssign({ in: new Expr(`data_in >> ${amountLiteral}`), out: 'data_out' })
    }
  }
}

export default shift

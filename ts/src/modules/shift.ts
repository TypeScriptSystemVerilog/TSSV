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
     * Shift length
     */
  shift_val: IntRange<1, 256>
  /**
     * Indicate whether the input data is a signed number
     */
  isSigned?: 'signed' | 'unsigned'
}

export class shift extends Module {
  declare params: shift_Parameters
  constructor (params: shift_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth,
      shift_direct: params.shift_direct || 'right',
      shift_val: params.shift_val,
      isSigned: params.isSigned || 'unsigned'
    })

    // calculate output width
    let output_width = this.params.dataWidth
    if (this.params.shift_direct === 'left') {
      output_width = this.params.dataWidth + this.params.shift_val
    }

    // ============================================IO define start===========================================
    // define IO signals
    this.IOs = {
      data_in: { direction: 'input', width: this.params.dataWidth },
      data_out: { direction: 'output', width: output_width }
    }

    // width and depth check
    if (this.params.dataWidth <= 0) console.log('Error: dataWidth should be greater than 0')

    if (this.params.shift_direct === 'left') {
      this.addAssign({ in: new Expr(`{data_in,{${this.params.shift_val}{1'b0}}}`), out: 'data_out' })
    } else {
      if (this.params.isSigned === 'signed') {
        this.addAssign({ in: new Expr(`{{${this.params.shift_val}{data_in[${this.params.dataWidth - 1}]}},data_in[${this.params.dataWidth - 1}:${this.params.shift_val}]}`), out: 'data_out' })
      } else {
        this.addAssign({ in: new Expr(`{{${this.params.shift_val}{1'b0}},data_in[${this.params.dataWidth - 1}:${this.params.shift_val}]}`), out: 'data_out' })
      }
    }
  }
}

/*
* Using dichotomy to calculate the number of leading zeros for data with arbitrary bit width
*
*/
import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'

/**
 * configuration parameters of the LZC module
 */
export interface LZC_Parameters extends TSSVParameters {
  /**
     * bit width of LZC data
     */
  dataWidth: IntRange<1, 256>
}

export class LZC extends Module {
  declare params: LZC_Parameters
  constructor (params: LZC_Parameters) {
    super({
      // define the default parameter values
      name: params.name,
      dataWidth: params.dataWidth
    })

    // calculate counter width based on dataWidth
    let cnt_width = this.bitWidth(this.params.dataWidth)

    // ============================================IO define start===========================================
    // define IO signals
    this.IOs = {
      data_in: { direction: 'input', width: this.params.dataWidth },
      zero_num: { direction: 'output', width: cnt_width },
      is_zero: { direction: 'output' }
    }

    // width and depth check
    if (this.params.dataWidth <= 0) console.log('Error: dataWidth should be greater than 0')

    // ===========================================IO define end==============================================
    let padding_num = 0
    let tmp_val_width = this.params.dataWidth
    if (Math.log2(this.params.dataWidth) % 1 !== 0) { // If it is not a power of 2, perform padding processing
      while (Math.log2(tmp_val_width) % 1 !== 0) {
        tmp_val_width++
        padding_num++
      }
      this.addSignal(`val${tmp_val_width}`, { width: tmp_val_width })
      this.addAssign({ in: new Expr(`{${padding_num}'d0,data_in}`), out: `val${tmp_val_width}` })
      cnt_width++
    } else {
      this.addSignal(`val${tmp_val_width}`, { width: tmp_val_width })
      this.addAssign({ in: new Expr('data_in'), out: `val${tmp_val_width}` })
    }

    this.addSignal('tmp_cnt', { width: cnt_width })

    let cnt_body = ''
    for (let i = cnt_width - 2; i >= 0; i--) {
      if (i >= 0) {
        tmp_val_width = tmp_val_width / 2
        const tmp_cnt_logic = `tmp_cnt[${i}] = (val${tmp_val_width * 2}[${tmp_val_width * 2 - 1}:${tmp_val_width}] == ${tmp_val_width}'d0);`
        this.addSignal(`val${tmp_val_width}`, { width: tmp_val_width })
        const tmp_val_logic = `val${tmp_val_width} = tmp_cnt[${i}] ? val${tmp_val_width * 2}[${tmp_val_width - 1}:0] : val${tmp_val_width * 2}[${tmp_val_width * 2 - 1}:${tmp_val_width}];`
        if (i > 0) {
          cnt_body += `        ${tmp_cnt_logic}\n        ${tmp_val_logic}\n`
        } else {
          cnt_body += `        ${tmp_cnt_logic}`
        }
      }
    }

    const LatchAlwaysBody =
`   begin
      if(data_in[${this.params.dataWidth - 1}:0] == ${this.params.dataWidth}'d0) begin
        is_zero = 1'b1;
        tmp_cnt = ${cnt_width}'d${this.params.dataWidth + padding_num};
      end else begin
        is_zero = 1'b0;
        tmp_cnt[${cnt_width - 1}] = 1'b0;
${cnt_body}
      end
    end
`
    this.addLatchAlways({ outputs: ['tmp_cnt', 'is_zero'] }, LatchAlwaysBody)
    if (Math.log2(this.params.dataWidth) % 1 !== 0) {
      this.addSignal('tmp_zero_num', { width: cnt_width })
      this.addAssign({ in: new Expr(`tmp_cnt - ${cnt_width}'d${padding_num}`), out: 'tmp_zero_num' })
      this.addAssign({ in: new Expr(`tmp_zero_num[${cnt_width - 2}:0]`), out: 'zero_num' })
    } else {
      this.addAssign({ in: new Expr('tmp_cnt'), out: 'zero_num' })
    }
  }
}

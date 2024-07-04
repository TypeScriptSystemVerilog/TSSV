/*
* Module for generating left or right shift of input data
* To the left, fill the low bit with 0, and expand the output data bit width accordingly
* To the right, if it is a signed number, fill the sign bit with the high bit, and if it is an unsigned number, fill the high bit with 0. Truncate the low bit and keep the bit width unchanged
*/
import { Module, Expr } from 'tssv/lib/core/TSSV';
export class shift extends Module {
    constructor(params) {
        super({
            // define the default parameter values
            name: params.name,
            dataWidth: params.dataWidth,
            shift_direct: params.shift_direct || 'right',
            shift_val: params.shift_val,
            isSigned: params.isSigned || 'unsigned'
        });
        // calculate output width
        let output_width = this.params.dataWidth;
        if (this.params.shift_direct === 'left') {
            output_width = this.params.dataWidth + this.params.shift_val;
        }
        // ============================================IO define start===========================================
        // define IO signals
        this.IOs = {
            data_in: { direction: 'input', width: this.params.dataWidth },
            data_out: { direction: 'output', width: output_width }
        };
        // width and depth check
        if (this.params.dataWidth <= 0)
            console.log('Error: dataWidth should be greater than 0');
        if (this.params.shift_direct === 'left') {
            this.addAssign({ in: new Expr(`{data_in,{${this.params.shift_val}{1'b0}}}`), out: 'data_out' });
        }
        else {
            if (this.params.isSigned === 'signed') {
                this.addAssign({ in: new Expr(`{{${this.params.shift_val}{data_in[${this.params.dataWidth - 1}]}},data_in[${this.params.dataWidth - 1}:${this.params.shift_val}]}`), out: 'data_out' });
            }
            else {
                this.addAssign({ in: new Expr(`{{${this.params.shift_val}{1'b0}},data_in[${this.params.dataWidth - 1}:${this.params.shift_val}]}`), out: 'data_out' });
            }
        }
    }
}
export default shift;

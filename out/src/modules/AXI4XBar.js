import TSSV from 'tssv/lib/core/TSSV';
import { inspect } from 'util';
export class AXI4XBar extends TSSV.Module {
    constructor(params) {
        super(params);
        this.IOs = {
            clk: { direction: 'input', isClock: 'posedge' }
        };
        console.log(inspect(params, { depth: null, colors: true }));
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TL_UL = void 0;
const TSSV_1 = require("./TSSV");
class TL_UL extends TSSV_1.Interface {
    constructor(params = {}, role = undefined) {
        super('TL_UL', {
            SZW: params.SZW || 3,
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DBW: params.DBW || 8,
            DW: params.DW || 32
        }, role);
        this.signals =
            {
                a_valid: { width: 1 },
                a_ready: { width: 1 },
                a_opcode: { width: 3 },
                a_address: { width: this.params.AW },
                a_data: { width: this.params.DW },
                a_source: { width: this.params.AIW },
                a_size: { width: this.params.SZW },
                a_mask: { width: this.params.DBW },
                d_valid: { width: 1 },
                d_ready: { width: 1 },
                d_opcode: { width: 3 },
                d_error: { width: 1 },
                d_size: { width: this.params.SZW },
                d_data: { width: this.params.DW },
                d_source: { width: this.params.AIW },
                d_sink: { width: this.params.DIW }
            };
        this.modports = {
            producer: {
                a_valid: 'output',
                a_ready: 'input',
                a_opcode: 'output',
                a_address: 'output',
                a_data: 'output',
                a_source: 'output',
                a_size: 'output',
                a_mask: 'output',
                d_valid: 'input',
                d_ready: 'output',
                d_opcode: 'input',
                d_error: 'input',
                d_size: 'input',
                d_data: 'input',
                d_source: 'input',
                d_sink: 'input'
            },
            responder: {
                a_valid: 'input',
                a_ready: 'output',
                a_opcode: 'input',
                a_address: 'input',
                a_data: 'input',
                a_source: 'input',
                a_size: 'input',
                a_mask: 'input',
                d_valid: 'output',
                d_ready: 'input',
                d_opcode: 'output',
                d_error: 'output',
                d_size: 'output',
                d_data: 'output',
                d_source: 'output',
                d_sink: 'output'
            }
        };
    }
}
exports.TL_UL = TL_UL;

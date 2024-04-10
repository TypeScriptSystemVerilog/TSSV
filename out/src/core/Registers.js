import { Module } from 'tssv/lib/core/TSSV';
import { TL_UL } from 'tssv/lib/interfaces/TL_UL';
export class RegAddr {
    constructor(start) {
        this.addr = start || 0n;
    }
    next() {
        const nextAddr = this.addr;
        this.addr += 4n;
        return nextAddr;
    }
}
export class RegisterBlock extends Module {
    constructor(params, regDefs) {
        super({
            // define the default parameter values
            name: params.name,
            busInterface: params.busInterface || 'TL_UL',
            endianess: params.endianess || 'little'
        });
        this.regDefs = regDefs;
        // define IO signals
        this.IOs = {
            clk: { direction: 'input', isClock: 'posedge' },
            rst_b: { direction: 'input', isReset: 'lowasync' }
        };
        this.addInterface('regs', new TL_UL({
            DW: regDefs.wordSize || 32,
            AIW: params.busIDWidth,
            AW: params.busAddressWidth,
            DIW: params.busIDWidth
        }, 'responder'));
    }
}

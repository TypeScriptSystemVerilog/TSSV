import { Module } from 'tssv/lib/core/TSSV';
import { TL_UL } from 'tssv/lib/interfaces/TileLink';
export class RegAddr {
    constructor(start, wordSize) {
        this.addr = start || 0n;
        this.stride = BigInt((wordSize || 32) / 8);
    }
    next() {
        const nextAddr = this.addr;
        this.addr += this.stride;
        return nextAddr;
    }
}
/**
 * This module implements a block of memory mapped control & status
 * registers according to the definitions in the addrMap T, and the
 * register defintions in regDefs
 */
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
        }, 'inward'));
        for (const reg in this.regDefs.addrMap) {
            const regName = reg;
            const registers = this.regDefs.registers;
            let thisReg = {
                type: 'RW',
                width: regDefs.wordSize
            };
            if (registers[regName] !== undefined) {
                thisReg = registers[regName] || thisReg;
            }
            if (thisReg.type === 'RW' ||
                thisReg.type === 'RO' ||
                thisReg.type === 'WO') {
                if (thisReg.fields === undefined) {
                    this.IOs[regName.toString()] =
                        {
                            direction: 'output',
                            width: thisReg.width || regDefs.wordSize,
                            isSigned: thisReg.isSigned
                        };
                }
                else {
                    for (const fieldName in thisReg.fields) {
                        const thisField = thisReg.fields[fieldName];
                        const width = thisField.bitRange[0] - thisField.bitRange[1] + 1;
                        this.IOs[fieldName.toString()] =
                            {
                                direction: 'output',
                                width,
                                isSigned: thisField.isSigned
                            };
                    }
                }
            }
            else if (thisReg.type === 'ROM') {
                if (thisReg.fields !== undefined)
                    throw Error('fields not supported for type ROM');
                this.IOs[`${regName.toString()}_rdata`] =
                    {
                        direction: 'input',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                this.IOs[`${regName.toString()}_re`] =
                    {
                        direction: 'output',
                        width: 1
                    };
            }
            else {
                if (thisReg.fields !== undefined)
                    throw Error('fields not supported for type ROM');
                this.IOs[`${regName.toString()}_rdata`] =
                    {
                        direction: 'input',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                this.IOs[`${regName.toString()}_re`] =
                    {
                        direction: 'output',
                        width: 1
                    };
                this.IOs[`${regName.toString()}_wdata`] =
                    {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                this.IOs[`${regName.toString()}_we`] =
                    {
                        direction: 'output',
                        width: 1
                    };
                this.IOs[`${regName.toString()}_wstrb`] =
                    {
                        direction: 'output',
                        width: Math.ceil((thisReg.width || regDefs.wordSize) / 8)
                    };
            }
        }
    }
}

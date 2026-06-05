// import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import { Module, Expr } from 'tssv/lib/core/TSSV';
export class SRAM_WRAPPER extends Module {
    constructor(params) {
        super({
            name: params.name,
            dataWidth: params.dataWidth,
            depth: params.depth,
            ports: params.ports,
            split_direction: params.split_direction,
            writeEnableMask: params.writeEnableMask || 'none',
            macroConfig: params.macroConfig || 'default',
            subSrams: params.subSrams || []
        });
        this.subSrams = this.params.subSrams || [];
        switch (this.params.ports) {
            case 'RD2_HS': {
                    this.IOs = {
                        CK: { direction: 'input', isClock: 'posedge' },
                        REN: { direction: 'input' },
                        WEN: { direction: 'input' },
                        DI: { direction: 'input', width: this.params.dataWidth },
                        RA: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                        WA: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                        DOUT: { direction: 'output', width: this.params.dataWidth },
                        MCSRD: { direction: 'input', width: 2 },
                        MCSWR: { direction: 'input', width: 2 },
                        RET: { direction: 'input', width: 1 },
                        ADME: { direction: 'input', width: 3 }
                    };
                    if (this.params.writeEnableMask === 'bit') {
                        this.IOs.BWEN = { direction: 'input', width: this.params.dataWidth };
                    }
                break;
            }
            case 'RF2_HS': {
                this.IOs = {
                    CK: { direction: 'input', isClock: 'posedge' },
                    WCK: { direction: 'input', isClock: 'posedge' },
                    REN: { direction: 'input' },
                    WEN: { direction: 'input' },
                    DI: { direction: 'input', width: this.params.dataWidth },
                    RA: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                    WA: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                    DOUT: { direction: 'output', width: this.params.dataWidth },
                    MCSRD: { direction: 'input', width: 2 },
                    MCSWR: { direction: 'input', width: 2 },
                    RET: { direction: 'input', width: 1 },
                    ADME: { direction: 'input', width: 3 }
                };
                if (this.params.writeEnableMask === 'bit') {
                    this.IOs.BWEN = { direction: 'input', width: this.params.dataWidth };
                }
                break;
            }
        }
        if (this.params.split_direction === 'depth') {
            this.splitDepth();
        }
        else if (this.params.split_direction === 'width') {
                this.instantiateSubSrams();
        }
    }
    splitDepth() {
        const DOut_Tmp_list = [];
        this.subSrams.forEach(sram => {
            if (sram.type === 'SRAM') {
                const DOut_sub = this.addSignal(`DOUT_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' });
                const DOut_tmp = this.addSignal(`DOUT_TMP_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' });
                const REN_sub = this.addSignal(`REN_${sram.instName.toUpperCase()}`, { width: 1, type: 'wire' });
                const REN_D0_sub = this.addSignal(`REN_${sram.instName.toUpperCase()}_D0`, { width: 1, type: 'reg' });
                const WEN_sub = this.addSignal(`WEN_${sram.instName.toUpperCase()}`, { width: 1, type: 'wire' });
                const RA_sub = this.addSignal(`RA_${sram.instName.toUpperCase()}`, { width: this.bitWidth(sram.depth - 1n), type: 'wire' });
                const WA_sub = this.addSignal(`WA_${sram.instName.toUpperCase()}`, { width: this.bitWidth(sram.depth - 1n), type: 'wire' });
                const decWidth = this.extractNumberFromPattern(sram.en_ptn);
                const raWidth = this.bitWidth(this.params.depth - 1n);
                if (decWidth != null && decWidth > 1) {
                    this.addAssign({ in: new Expr(`( RA[${raWidth - 1}:${raWidth - decWidth}] != ${sram.en_ptn}) | REN`), out: REN_sub });
                    this.addAssign({ in: new Expr(`( WA[${raWidth - 1}:${raWidth - decWidth}] != ${sram.en_ptn}) | WEN`), out: WEN_sub });
                }
                else if (decWidth != null && decWidth === 1) {
                    this.addAssign({ in: new Expr(`( RA[${raWidth - 1}] != ${sram.en_ptn}) | REN`), out: REN_sub });
                    this.addAssign({ in: new Expr(`( WA[${raWidth - 1}] != ${sram.en_ptn}) | WEN`), out: WEN_sub });
                }
                else {
                    throw new Error(`Invalid enable pattern for SRAM ${sram.instName}: ${sram.en_ptn}`);
                }
                this.addAssign({ in: new Expr(`RA & ${sram.adr_mask}`), out: RA_sub });
                this.addAssign({ in: new Expr(`${DOut_sub.toString()} & {${sram.width}{${REN_D0_sub.toString()}}}`), out: DOut_tmp });
                this.addRegister({
                    d: new Expr(`~${REN_sub.toString()}`),
                    clk: 'CK',
                    q: REN_D0_sub
                });
                DOut_Tmp_list.push(DOut_tmp.toString());
                this.addSubmodule(sram.instName, new Module({
                    name: sram.module
                }, {
                    CK: { direction: 'input', isClock: 'posedge' },
                    REN: { direction: 'input' },
                    WEN: { direction: 'input' },
                    DI: { direction: 'input', width: sram.width },
                    RA: { direction: 'input', width: this.bitWidth(sram.depth - 1n) },
                    WA: { direction: 'input', width: this.bitWidth(sram.depth - 1n) },
                    DOUT: { direction: 'output', width: sram.width },
                    MCSRD: { direction: 'input', width: 2 },
                    MCSWR: { direction: 'input', width: 2 },
                    RET: { direction: 'input', width: 1 },
                    ADME: { direction: 'input', width: 3 }
                }), { REN: REN_sub, WEN: WEN_sub, RA: RA_sub, WA: WA_sub, DOUT: DOut_sub }, true, true, true);
            }
        });
        this.addAssign({ in: new Expr(`{${DOut_Tmp_list.join(' | ')}}`), out: 'DOUT' });
    }
    extractNumberFromPattern(pattern) {
        const match = pattern.match(/^(\d+)'/);
        return match ? parseInt(match[1], 10) : null;
    }
    instantiateSubSrams() {
        const DOut_list = [];
        this.subSrams.forEach(sram => {
            if (sram.type === 'SRAM') {
            const DOut_sub = this.addSignal(`DOUT_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' });
            const DI_sub = this.addSignal(`DI_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' });
            if (sram.bitBig >= (sram.width - 1)) {
                this.addAssign({ in: new Expr(`DI[${sram.bitBig}:${sram.bitBig - (sram.width - 1)}]`), out: DI_sub });
                DOut_list.push(DOut_sub.toString());
            }
            else {
                this.addAssign({ in: new Expr(`{DI[${sram.bitBig}:0], ${sram.width - 1 - sram.bitBig}'d0}`), out: DI_sub });
                DOut_list.push(`${DOut_sub.toString()}[${sram.width - 1}:${sram.width - 1 - sram.bitBig}]`);
            }
                this.addSubmodule(sram.instName, new Module({
                    name: sram.module
                }, {
                    CK: { direction: 'input', isClock: 'posedge' },
                    REN: { direction: 'input' },
                    WEN: { direction: 'input' },
                    DI: { direction: 'input', width: sram.width },
                    RA: { direction: 'input', width: this.bitWidth(sram.depth - 1n) },
                    WA: { direction: 'input', width: this.bitWidth(sram.depth - 1n) },
                    DOUT: { direction: 'output', width: sram.width },
                    MCSRD: { direction: 'input', width: 2 },
                    MCSWR: { direction: 'input', width: 2 },
                    RET: { direction: 'input', width: 1 },
                    ADME: { direction: 'input', width: 3 }
                }), { DI: DI_sub, DOUT: DOut_sub }, true, true, true);
            }
            else if (sram.type === 'REG') {
                this.body +=
                    `
reg  [${sram.width - 1}:0]      DI_REG_0 [${sram.depth - 1n}:0];
reg  [${sram.width - 1}:0]      DOUT_REG_0;
always @(posedge CK) begin
    if (~WEN) begin
        DI_REG_0[WA] <= DI[${sram.width - 1}:0];
    end
end

always @(posedge CK) begin
    if (~REN) begin
        DOUT_REG_0 <= DI_REG_0[RA];
    end
end
`;
                DOut_list.push('DOUT_REG_0');
            }
        });
        this.addAssign({ in: new Expr(`{${DOut_list.join(', ')}}`), out: 'DOUT' });
    }
}
export default SRAM_WRAPPER;

import { Module } from 'tssv/lib/core/TSSV';
export class SRAM extends Module {
    constructor(params) {
        super({
            // define the default parameter values
            dataWidth: params.dataWidth,
            depth: params.depth,
            ports: params.ports,
            writeEnableMask: params.writeEnableMask || 'none',
            readBehavior: params.readBehavior || 'undefOnWrite',
            macroConfig: params.macroConfig || 'default'
        });
        // define IO signals
        switch (this.params.ports) {
            case '1rw':
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: this.params.dataWidth },
                    a_data_out: { direction: 'output', width: this.params.dataWidth }
                };
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                break;
            case '2rw':
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: this.params.dataWidth },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    b_re: { direction: 'input' },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: this.params.dataWidth },
                    b_data_out: { direction: 'output', width: this.params.dataWidth }
                };
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth };
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                break;
            case '1r_1w':
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: this.params.dataWidth }
                };
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                break;
        }
        this.body += "FIXME!!!!!!!";
    }
}

import { Module } from 'tssv/lib/core/TSSV';
/**
 * Static Random Access Memory (SRAM) module
 * supports FPGA inference with generated behavioral model SRAM library
 * ASIC macro library can be swapped in for ASIC synthesis/implemenation
 */
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
        // add tmp register 'mem'
        this.addSignal("mem", { width: this.params.dataWidth, isArray: this.params.depth });
        // add variables for the "mask" operation
        let mask_cnt = 0;
        let mask_w = 0;
        if (this.params.writeEnableMask == 'bit') {
            mask_cnt = this.params.dataWidth;
            mask_w = 1;
        }
        else if (this.params.writeEnableMask == 'byte') {
            mask_cnt = this.params.dataWidth / 8;
            mask_w = 8;
        }
        // define IO signals
        switch (this.params.ports) {
            case '1rw': {
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: this.params.dataWidth },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    a_addr: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) }
                };
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                let body_1rw = '';
                if (this.params.writeEnableMask == 'none') {
                    body_1rw =
                        `
    always_ff @(posedge clk) begin 
        if(a_we) begin
          mem[a_addr] <= a_data_in;
          end
        else if(a_re) begin
          a_data_out <= mem[a_addr];
          end
    end          
    `;
                }
                else if (mask_cnt == 1) {
                    body_1rw =
                        `
    always_ff @(posedge clk) begin
        if(a_we & a_wmask) begin
            mem[a_addr] <= a_data_in;
        end else if(a_re) begin
            a_data_out <= mem[a_addr];
        end
    end
    `;
                }
                else {
                    body_1rw =
                        `
    always_ff @(posedge clk) begin
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*${mask_w} +: ${mask_w}] <= a_data_in[i*${mask_w} +: ${mask_w}];
            end else if(a_re) begin
                a_data_out <= mem[a_addr];
            end
        end
    end
    `;
                }
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_1rw);
                break;
            }
            case '2rw': {
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: this.params.dataWidth },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    a_addr: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                    b_re: { direction: 'input' },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: this.params.dataWidth },
                    b_data_out: { direction: 'output', width: this.params.dataWidth },
                    b_addr: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) }
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
                let body_2rw_a = '';
                let body_2rw_b = '';
                if (this.params.writeEnableMask == 'none') {
                    body_2rw_a =
                        `
    always_ff @ (posedge clk) begin
        if(a_we) begin
          mem[a_addr] <= a_data_in;
        end 
        else if(a_re) begin
          a_data_out <= mem[a_addr];
        end
    end
    `;
                    body_2rw_b =
                        `
    always_ff @ (posedge clk) begin
        if(b_we) begin
          mem[b_addr] <= b_data_in;
        end 
        else if(b_re) begin
          b_data_out <= mem[b_addr];
        end
    end
    `;
                }
                else if (mask_cnt == 1) {
                    body_2rw_a =
                        `
    always_ff @(posedge clk) begin
        if(a_we & a_wmask) begin
            mem[a_addr] <= a_data_in;
        end else if(a_re) begin
            a_data_out <= mem[a_addr];
        end
    end
    `;
                    body_2rw_b =
                        `
    always_ff @(posedge clk) begin
        if(b_we & b_wmask) begin
            mem[b_addr] <= b_data_in;
        end else if(b_re) begin
            b_data_out <= mem[b_addr];
        end
    end
    `;
                }
                else {
                    body_2rw_a =
                        `
    always_ff @(posedge clk) begin
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*${mask_w} +: ${mask_w}] <= a_data_in[i*${mask_w} +: ${mask_w}];
            end else if(a_re) begin
                a_data_out <= mem[a_addr];
            end
        end
    end
    `;
                    body_2rw_b =
                        `
    always_ff @(posedge clk) begin
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(b_we & b_wmask[i]) begin
                mem[b_addr][i*${mask_w} +: ${mask_w}] <= b_data_in[i*${mask_w} +: ${mask_w}];
            end else if(b_re) begin
                b_data_out <= mem[b_addr];
            end
        end
    end
    `;
                }
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_2rw_a);
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'b_data_out'] }, body_2rw_b);
                break;
            }
            case '1r_1w': {
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    a_addr: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: this.params.dataWidth },
                    b_addr: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) }
                };
                if (this.params.writeEnableMask == 'bit') {
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask == 'byte') {
                    if ((this.params.dataWidth % 8) != 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                let body_1r_1w_w = '';
                if (this.params.writeEnableMask == 'none') {
                    body_1r_1w_w =
                        `
    always_ff @ (posedge clk) begin
        if(b_we) begin
          mem[b_addr] <= b_data_in;
        end 
    end
    `;
                }
                else if (mask_cnt == 1) {
                    body_1r_1w_w =
                        `
    always_ff @(posedge clk) begin
        if(b_we & b_wmask) begin
            mem[b_addr] <= b_data_in;
        end 
    end
    `;
                }
                else {
                    body_1r_1w_w =
                        `
    always_ff @(posedge clk) begin
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(b_we & b_wmask[i]) begin
                mem[b_addr][i*${mask_w} +: ${mask_w}] <= b_data_in[i*${mask_w} +: ${mask_w}];
            end 
        end
    end
    `;
                }
                const body_1r_1w_r = `
    always_ff @ (posedge clk) begin
        if(a_re) begin
          a_data_out <= mem[a_addr];
        end
    end
                `;
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem'] }, body_1r_1w_w);
                this.addSequentialAlways({ clk: 'clk', outputs: ['a_data_out'] }, body_1r_1w_r);
                break;
            }
        }
    }
}

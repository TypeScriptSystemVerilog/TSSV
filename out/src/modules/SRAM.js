import { Module, Expr } from 'tssv/lib/core/TSSV';
/**
 * Static Random Access Memory (SRAM) module
 * supports FPGA inference with generated behavioral model SRAM library
 * ASIC macro library can be swapped in for ASIC synthesis/implemenation
 */
export class SRAM extends Module {
    constructor(params) {
        super({
            // define the default parameter values
            name: params.name,
            dataWidth: params.dataWidth,
            depth: params.depth,
            ports: params.ports,
            writeEnableMask: params.writeEnableMask || 'none',
            readBehavior: params.readBehavior || 'undefOnWrite',
            macroConfig: params.macroConfig || 'default'
        });
        // add tmp register 'mem'
        this.addSignal('mem', { width: this.params.dataWidth, isArray: this.params.depth });
        // add variables for the "mask" operation
        let mask_cnt = 0;
        let mask_w = 0;
        if (this.params.writeEnableMask === 'bit') {
            mask_cnt = this.params.dataWidth;
            mask_w = 1;
        }
        else if (this.params.writeEnableMask === 'byte') {
            mask_cnt = this.params.dataWidth / 8;
            mask_w = 8;
        }
        // define IO signals
        switch (this.params.ports) {
            //= ================================== 1rw ===========================================
            case '1rw': {
                this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: this.params.dataWidth },
                    a_data_out: { direction: 'output', width: this.params.dataWidth },
                    a_addr: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) }
                };
                if (this.params.writeEnableMask === 'bit') {
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask === 'byte') {
                    if ((this.params.dataWidth % 8) !== 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                // Define read_enable and data_out in different modes than undefOnWrite and readBeforeWrite
                let read_enable = 'a_re';
                let rw_conflict_out_MaskNone = ''; // for Mask: none mode
                let rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                let rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                if (this.params.readBehavior === 'undefOnWrite') {
                    read_enable = 'a_re & ~a_we';
                    rw_conflict_out_MaskNone =
                        `\`ifndef SYNTHESIS
        else if(a_re & a_we ) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end 
        \`endif`;
                    rw_conflict_out_MaskWidthEqual1 =
                        `else if(a_re & a_we & ~a_wmask) begin
            a_data_out <= mem[a_addr];
        end
        \`ifndef SYNTHESIS
        else if(a_re & a_we & a_wmask) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end
        \`endif`;
                    rw_conflict_out_MaskWidthGreater1 =
                        `else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*${mask_w} +: ${mask_w}] <= mem[a_addr][i*${mask_w} +: ${mask_w}];
            end
            \`ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*${mask_w} +: ${mask_w}] <= 'hx;
            end 
            \`endif`;
                }
                // define always block
                let body_1rw = '';
                if (this.params.writeEnableMask === 'none') {
                    body_1rw =
                        `
    always_ff @(posedge clk) begin 
        if(a_we) begin
            mem[a_addr] <= a_data_in;
        end
        if(${read_enable}) begin
            a_data_out <= mem[a_addr];
        end
        ${rw_conflict_out_MaskNone}
    end          
    `;
                }
                else if (mask_cnt === 1) {
                    body_1rw =
                        `
    always_ff @(posedge clk) begin
        if(a_we & a_wmask) begin
            mem[a_addr] <= a_data_in;
        end 
        if(${read_enable}) begin
            a_data_out <= mem[a_addr];
        end 
        ${rw_conflict_out_MaskWidthEqual1}
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
            end
        end
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(${read_enable} & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*${mask_w} +: ${mask_w}];
            end
            ${rw_conflict_out_MaskWidthGreater1}
        end
    end
    `;
                }
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_1rw);
                break;
            }
            //= ================================== 2rw ===========================================
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
                if (this.params.writeEnableMask === 'bit') {
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth };
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask === 'byte') {
                    if ((this.params.dataWidth % 8) !== 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.a_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                // Define read_enable and data_out in different modes than undefOnWrite and readBeforeWrite
                let a_read_enable = 'a_re';
                let b_read_enable = 'b_re';
                let a_rw_conflict_out_MaskNone = ''; // for Mask: none mode
                let a_rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                let a_rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                let b_rw_conflict_out_MaskNone = ''; // for Mask: none mode
                let b_rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                let b_rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                if (this.params.readBehavior === 'undefOnWrite') {
                    a_read_enable = 'a_re & ~a_rw_conflict';
                    b_read_enable = 'b_re & ~b_rw_conflict';
                    a_rw_conflict_out_MaskNone =
                        `\`ifndef SYNTHESIS
        else if(a_re & a_rw_conflict) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end
        \`endif`;
                    a_rw_conflict_out_MaskWidthEqual1 =
                        `else if(a_re & a_rw_conflict & ~((a_we & a_wmask) | (b_write_at_same_addr & b_wmask))) begin
            a_data_out <= mem[a_addr];
        end
        \`ifndef SYNTHESIS
        else if(a_re & a_rw_conflict & ((a_we & a_wmask) | (b_write_at_same_addr & b_wmask))) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end
        \`endif`;
                    a_rw_conflict_out_MaskWidthGreater1 =
                        `else if(a_re & a_rw_conflict & ~((a_we & a_wmask[i]) | (b_write_at_same_addr & b_wmask[i]))) begin
                a_data_out[i*${mask_w} +: ${mask_w}] <= mem[a_addr][i*${mask_w} +: ${mask_w}];
            end
            \`ifndef SYNTHESIS
            else if(a_re & a_rw_conflict & ((a_we & a_wmask[i]) | (b_write_at_same_addr & b_wmask[i]))) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*${mask_w} +: ${mask_w}] <= 'hx;
            end
            \`endif`;
                    b_rw_conflict_out_MaskNone =
                        `\`ifndef SYNTHESIS
        else if(b_re & b_rw_conflict) begin //output is X after reading and writing the same address at the same time
            b_data_out <= 'hx;
        end
        \`endif`;
                    b_rw_conflict_out_MaskWidthEqual1 =
                        `else if(b_re & b_rw_conflict & ~((b_we & b_wmask) | (a_write_at_same_addr & a_wmask))) begin
            b_data_out <= mem[a_addr];
        end
        \`ifndef SYNTHESIS
        else if(b_re & b_rw_conflict & ((b_we & b_wmask) | (a_write_at_same_addr & a_wmask))) begin //output is X after reading and writing the same address at the same time
            b_data_out <= 'hx;
        end
        \`endif`;
                    b_rw_conflict_out_MaskWidthGreater1 =
                        `else if(b_re & b_rw_conflict & ~((b_we & b_wmask[i]) | (a_write_at_same_addr & a_wmask[i]))) begin
                b_data_out[i*${mask_w} +: ${mask_w}] <= mem[a_addr][i*${mask_w} +: ${mask_w}];
            end
            \`ifndef SYNTHESIS
            else if(b_re & b_rw_conflict & ((b_we & b_wmask[i]) | (a_write_at_same_addr & a_wmask[i]))) begin //output is X after reading and writing the same address at the same time
                b_data_out[i*${mask_w} +: ${mask_w}] <= 'hx;
            end
            \`endif`;
                }
                // define always block
                let body_2rw_a = '';
                let body_2rw_b = '';
                if (this.params.writeEnableMask === 'none') {
                    body_2rw_a =
                        `
    always_ff @ (posedge clk) begin
        if(a_we & ~b_write_at_same_addr) begin
          mem[a_addr] <= a_data_in;
        end
        \`ifndef SYNTHESIS
        else if(a_we & b_write_at_same_addr) begin //output is X after reading and writing the same address at the same time
            mem[a_addr] <= 'hx;
        end
        \`endif
        if(${a_read_enable}) begin
          a_data_out <= mem[a_addr];
        end
        ${a_rw_conflict_out_MaskNone}
    end
    `;
                    body_2rw_b =
                        `
    always_ff @ (posedge clk) begin
        if(b_we & ~a_write_at_same_addr) begin
          mem[b_addr] <= b_data_in;
        end
        \`ifndef SYNTHESIS
        else if(b_we & a_write_at_same_addr) begin //output is X after reading and writing the same address at the same time
            mem[b_addr] <= 'hx;
        end
        \`endif
        if(${b_read_enable}) begin
          b_data_out <= mem[b_addr];
        end
        ${b_rw_conflict_out_MaskNone}
    end
    `;
                }
                else if (mask_cnt === 1) {
                    body_2rw_a =
                        `
    always_ff @(posedge clk) begin
        if(a_we & a_wmask & ~(b_write_at_same_addr & b_wmask)) begin
            mem[a_addr] <= a_data_in;
        end
        \`ifndef SYNTHESIS
        else if(a_we & a_wmask & (b_write_at_same_addr & b_wmask)) begin //output is X after reading and writing the same address at the same time
            mem[a_addr] <= 'hx;
        end
        \`endif
        if(${a_read_enable}) begin
            a_data_out <= mem[a_addr];
        end
        ${a_rw_conflict_out_MaskWidthEqual1}
    end
    `;
                    body_2rw_b =
                        `
    always_ff @(posedge clk) begin
        if(b_we & b_wmask & ~(a_write_at_same_addr & a_wmask)) begin
            mem[b_addr] <= b_data_in;
        end
        \`ifndef SYNTHESIS
        else if(b_we & b_wmask & (a_write_at_same_addr & a_wmask)) begin //output is X after reading and writing the same address at the same time
            mem[b_addr] <= 'hx;
        end
        \`endif
        if(${b_read_enable}) begin
            b_data_out <= mem[b_addr];
        end
        ${b_rw_conflict_out_MaskWidthEqual1}
    end
    `;
                }
                else {
                    body_2rw_a =
                        `
    always_ff @(posedge clk) begin
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(a_we & a_wmask[i] & ~(b_write_at_same_addr & b_wmask[i])) begin
                mem[a_addr][i*${mask_w} +: ${mask_w}] <= a_data_in[i*${mask_w} +: ${mask_w}];
            end
            \`ifndef SYNTHESIS
            else if(a_we & a_wmask[i] & (b_write_at_same_addr & b_wmask[i])) begin //output is X after reading and writing the same address at the same time
                mem[a_addr][i*${mask_w} +: ${mask_w}] <= 'hx;
            end
            \`endif
        end
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(${a_read_enable}) begin
                a_data_out <= mem[a_addr][i*${mask_w} +: ${mask_w}];
            end
            ${a_rw_conflict_out_MaskWidthGreater1}
        end
        
    end
    `;
                    body_2rw_b =
                        `
    always_ff @(posedge clk) begin
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(b_we & b_wmask[i] & ~(a_write_at_same_addr & a_wmask[i])) begin
                mem[b_addr][i*${mask_w} +: ${mask_w}] <= b_data_in[i*${mask_w} +: ${mask_w}];
            end 
            \`ifndef SYNTHESIS
            else if(b_we & b_wmask[i] & (a_write_at_same_addr & a_wmask[i])) begin //output is X after reading and writing the same address at the same time
                mem[b_addr][i*${mask_w} +: ${mask_w}] <= 'hx;
            end
            \`endif
        end
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(${b_read_enable}) begin
                b_data_out <= mem[b_addr][i*${mask_w} +: ${mask_w}];
            end
            ${b_rw_conflict_out_MaskWidthGreater1}
        end
    end
    `;
                }
                this.addSignal('addr_a_equal_b', { description: '//1 means a_addr === b_addr' });
                this.addSignal('b_write_at_same_addr', { description: '//1 means port b write the same address as port a' });
                this.addSignal('a_write_at_same_addr', { description: '//1 means port a write the same address as port b' });
                this.addAssign({ in: new Expr('~(|(a_addr ^ b_addr))'), out: 'addr_a_equal_b' });
                this.addAssign({ in: new Expr('b_we & addr_a_equal_b'), out: 'b_write_at_same_addr' });
                this.addAssign({ in: new Expr('a_we & addr_a_equal_b'), out: 'a_write_at_same_addr' });
                if (this.params.readBehavior === 'undefOnWrite') {
                    this.addSignal('a_rw_conflict', { description: '//1 means that either a or b is writing to the same address, while port a is reading, used to determine read/write conflicts at port a' });
                    this.addSignal('b_rw_conflict', { description: '//1 means that either a or b is writing to the same address, while port b is reading, used to determine read/write conflicts at port b' });
                    this.addAssign({ in: new Expr('a_we | b_write_at_same_addr'), out: 'a_rw_conflict' });
                    this.addAssign({ in: new Expr('b_we | a_write_at_same_addr'), out: 'b_rw_conflict' });
                }
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_2rw_a);
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'b_data_out'] }, body_2rw_b);
                break;
            }
            //= ================================== 1r1w ===========================================
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
                if (this.params.writeEnableMask === 'bit') {
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth };
                }
                else if (this.params.writeEnableMask === 'byte') {
                    if ((this.params.dataWidth % 8) !== 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    this.IOs.b_wmask = { direction: 'input', width: this.params.dataWidth / 8 };
                }
                // Define read_enable and data_out in different modes than undefOnWrite and readBeforeWrite
                let read_enable = 'a_re';
                let rw_conflict_out_MaskNone = ''; // for Mask: none mode
                let rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                let rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                if (this.params.readBehavior === 'undefOnWrite') {
                    read_enable = 'a_re & ~b_write_at_same_addr';
                    rw_conflict_out_MaskNone =
                        `\`ifndef SYNTHESIS
        else if(a_re & b_write_at_same_addr) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end
        \`endif`;
                    rw_conflict_out_MaskWidthEqual1 =
                        `else if (a_re & b_write_at_same_addr & ~b_wmask) begin
            a_data_out <= mem[a_addr];
        end
        \`ifndef SYNTHESIS
        else if(a_re & b_write_at_same_addr & b_wmask) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end
        \`endif`;
                    rw_conflict_out_MaskWidthGreater1 =
                        `else if (a_re & b_write_at_same_addr & ~b_wmask[i]) begin
                a_data_out[i*${mask_w} +: ${mask_w}] <= mem[a_addr][i*${mask_w} +: ${mask_w}];
            end
            \`ifndef SYNTHESIS
            else if(a_re & b_write_at_same_addr & b_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*${mask_w} +: ${mask_w}] <= 'hx;
            end
            \`endif`;
                }
                // define always block
                let body_1r_1w = '';
                if (this.params.writeEnableMask === 'none') {
                    body_1r_1w =
                        `
    always_ff @ (posedge clk) begin
        if(b_we) begin
            mem[b_addr] <= b_data_in;
        end
        if(${read_enable}) begin
            a_data_out <= mem[a_addr];
        end
        ${rw_conflict_out_MaskNone}
    end
    `;
                }
                else if (mask_cnt === 1) {
                    body_1r_1w =
                        `
    always_ff @(posedge clk) begin
        if(b_we & b_wmask) begin
            mem[b_addr] <= b_data_in;
        end 
        if(${read_enable}) begin
            a_data_out <= mem[a_addr];
        end
        ${rw_conflict_out_MaskWidthEqual1}
    end
    `;
                }
                else {
                    body_1r_1w =
                        `
    always_ff @(posedge clk) begin
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(b_we & b_wmask[i]) begin
                mem[b_addr][i*${mask_w} +: ${mask_w}] <= b_data_in[i*${mask_w} +: ${mask_w}];
            end
        end
        for(integer i=0; i<${mask_cnt}; i=i+1) begin
            if(${read_enable}) begin
                a_data_out <= mem[a_addr][i*${mask_w} +: ${mask_w}];
            end
            ${rw_conflict_out_MaskWidthGreater1}
        end
    end
    `;
                }
                if (this.params.readBehavior === 'undefOnWrite') {
                    this.addSignal('addr_a_equal_b', { description: '//1 means a_addr === b_addr' });
                    this.addSignal('b_write_at_same_addr', { description: '//1 means port b write the same address as port a' });
                    this.addAssign({ in: new Expr('~(|(a_addr ^ b_addr))'), out: 'addr_a_equal_b' });
                    this.addAssign({ in: new Expr('b_we & addr_a_equal_b'), out: 'b_write_at_same_addr' });
                }
                this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_1r_1w);
                break;
            }
        }
    }
}
export default SRAM;

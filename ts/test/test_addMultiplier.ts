import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_addMultiplier_output')
} catch (e) {}

// test 1

const tbBody =
`
    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
    count <= 'd0;
    end
    else
    begin
    count <= count + 1'b1;

    case(count)
    'd0: begin
        a <= 8'b00000001;
        b <= 4'b0001;
        assert(prod_axb == 12'd1) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 4'b0010;
        assert(prod_axb == 12'd4) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 4'd5;
        assert(prod_axb == 12'd500) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 4'd11;
        assert(prod_axb == 12'd979) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b11111111;
        b <= 4'b1111;
        assert(prod_axb == 12'd3825) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 4'b0000;
    end
    endcase
    end
`

const mult_tb = new Module(
  { name: 'mult_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
mult_tb.addSignal('a', { width: 8, isSigned: false })
mult_tb.addSignal('b', { width: 4, isSigned: false })
mult_tb.addMultiplier({ a: 'a', b: 'b' })

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${mult_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addMultiplier_output/mult_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 2 signed numbers

const tbBodyS =
`
    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
    count <= 'd0;
    end
    else
    begin
    count <= count + 1'b1;

    case(count)
    'd0: begin
        a <= 8'd1;
        b <= 8'd1;
        assert(prod_axb == 16'd1) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd1: begin
        a <= 8'd25;
        b <= -8'd1;
        assert(prod_axb == -16'd25) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd2: begin
        a <= -8'd100;
        b <= 8'd20;
        assert(prod_axb == -16'd2000) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
        a <= -8'd73;
        b <= -8'd59;
        assert(prod_axb == 16'd4307) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd4: begin 
        a <= -8'd128;
        b <= 8'd127;
        assert(prod_axb == -16'd16256) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 4'b0000;
    end
    endcase
    end
`

const multS_tb = new Module(
  { name: 'multS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyS
)
multS_tb.addSignal('a', { width: 8, isSigned: true })
multS_tb.addSignal('b', { width: 8, isSigned: true })
multS_tb.addMultiplier({ a: 'a', b: 'b' })

try {
  const TB =
`
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${multS_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addMultiplier_output/multS_tb.sv', TB)
} catch (err) {
  console.error(err)
}

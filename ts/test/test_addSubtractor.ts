import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_addSubtractor_output')
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
      assert(diff_axb == 9'd0) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= 8'b00000010;
      b <= 4'b0001;
      assert(diff_axb == 9'd1) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd100;
      b <= 4'd5;
      assert(diff_axb == 9'd95) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd11;
      b <= 4'd9;
      assert(diff_axb == -9'd78) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'b0;
      b <= 4'd15;
      assert(diff_axb == -9'd15) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
      b <= 4'b0000;
  end
  endcase
  end
`

const sub_tb = new Module(
  { name: 'sub_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
sub_tb.addSignal('a', { width: 8, isSigned: false })
sub_tb.addSignal('b', { width: 4, isSigned: false })
sub_tb.addSubtractor({ a: 'a', b: 'b' })

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${sub_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubtractor_output/sub_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 2 with signed numbers

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
      a <= 4'b0001;
      b <= 8'b0001;
      assert(diff_axb == 9'd0) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= 4'd6;
      b <= -8'd20;
      assert(diff_axb == 9'd26) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd2: begin
      a <= 4'd4;
      b <= 8'd45;
      assert(diff_axb == -9'd57) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd3: begin
      a <= -4'd8;
      b <= -8'd128;
      assert(diff_axb == -9'd120) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd4: begin 
      a <= 4'd5;
      b <= 8'd15;
      assert(diff_axb == -9'd10) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  default: begin
      a <= 4'd0;
      b <= 8'd0;
  end
  endcase
  end
`

const subS_tb = new Module(
  { name: 'subS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyS
)
subS_tb.addSignal('a', { width: 4, isSigned: true })
subS_tb.addSignal('b', { width: 8, isSigned: true })
subS_tb.addSubtractor({ a: 'a', b: 'b' })

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${subS_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubtractor_output/subS_tb.sv', TB)
} catch (err) {
  console.error(err)
}

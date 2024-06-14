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
      assert(diff_axb == 9'd0) else $display("Assertion failed: diff_axb should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= 8'b00000010;
      b <= 4'b0001;
      assert(diff_axb == 9'd1) else $display("Assertion failed: diff_axb should be 1 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd100;
      b <= 4'd5;
      assert(diff_axb == 9'd95) else $display("Assertion failed: diff_axb should be 95 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd11;
      b <= 4'd9;
      assert(diff_axb == 9'd2) else $display("Assertion failed: diff_axb should be 2 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'b0;
      b <= 4'd15;
      assert(diff_axb == -9'd15) else $display("Assertion failed: diff_axb should be -15 at time %0t", $time);
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
      assert(diff_axb == 9'd0) else $display("Assertion failed: diff_axb should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= 4'd6;
      b <= -8'd20;
      assert(diff_axb == 9'd26) else $display("Assertion failed: diff_axb should be 26 at time %0t", $time);
  end
  'd2: begin
      a <= 4'd4;
      b <= 8'd45;
      assert(diff_axb == -9'd41) else $display("Assertion failed: diff_axb should be -41 at time %0t", $time);
  end
  'd3: begin
      a <= -4'd8;
      b <= -8'd128;
      assert(diff_axb == 9'd120) else $display("Assertion failed: diff_axb should be 120 at time %0t", $time);
  end
  'd4: begin 
      a <= 4'd5;
      b <= 8'd15;
      assert(diff_axb == -9'd10) else $display("Assertion failed: diff_axb should be -10 at time %0t", $time);
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

// test 3 unsigned signed

const tbBodyUS =
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
      a <= 8'b0001;
      b <= 8'b0001;
      assert(diff_axb == 9'd0) else $display("Assertion failed: diff_axb should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= 8'd6;
      b <= -8'd20;
      assert(diff_axb == 9'd26) else $display("Assertion failed: diff_axb should be 26 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd4;
      b <= 8'd45;
      assert(diff_axb == -9'd41) else $display("Assertion failed: diff_axb should be -41 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd8;
      b <= -8'd128;
      assert(diff_axb == 9'd136) else $display("Assertion failed: diff_axb should be 136 at time %0t", $time);
  end
  'd4: begin 
      a <= -8'd5;
      b <= 8'd15;
      assert(diff_axb == -9'd20) else $display("Assertion failed: diff_axb should be -20 at time %0t", $time);
  end
  default: begin
      a <= 4'd0;
      b <= 8'd0;
  end
  endcase
  end
`

const subUS_tb = new Module(
  { name: 'subUS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyUS
)
subUS_tb.addSignal('a', { width: 8, isSigned: false })
subUS_tb.addSignal('b', { width: 8, isSigned: true })
subUS_tb.addSubtractor({ a: 'a', b: 'b' })

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${subUS_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubtractor_output/subUS_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 4 signed unsigned

const tbBodySU =
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
      a <= -8'b0001;
      b <= 8'b0001;
      assert(diff_axb == -9'd2) else $display("Assertion failed: diff_axb should be -2 at time %0t", $time);
  end
  'd1: begin
      a <= -8'd6;
      b <= 8'd20;
      assert(diff_axb == -9'd26) else $display("Assertion failed: diff_axb should be -26 at time %0t", $time);
  end
  'd2: begin
      a <= -8'd4;
      b <= 8'd45;
      assert(diff_axb == -9'd49) else $display("Assertion failed: diff_axb should be -49 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd8;
      b <= 8'd128;
      assert(diff_axb == -9'd120) else $display("Assertion failed: diff_axb should be -120 at time %0t", $time);
  end
  'd4: begin 
      a <= -8'd5;
      b <= 8'd15;
      assert(diff_axb == -9'd20) else $display("Assertion failed: diff_axb should be -20 at time %0t", $time);
  end
  default: begin
      a <= 4'd0;
      b <= 8'd0;
  end
  endcase
  end
`

const subSU_tb = new Module(
  { name: 'subSU_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodySU
)
subSU_tb.addSignal('a', { width: 8, isSigned: true })
subSU_tb.addSignal('b', { width: 8, isSigned: false })
subSU_tb.addSubtractor({ a: 'a', b: 'b' })

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${subSU_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSubtractor_output/subSU_tb.sv', TB)
} catch (err) {
  console.error(err)
}

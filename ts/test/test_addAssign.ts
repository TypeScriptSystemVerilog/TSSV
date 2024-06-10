import { Module, Expr } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_addAssign_output')
} catch (e) {}

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
    in <= 8'b00111111;
    assert(val == 6'b111111) else $display("Assertion failed: val should be 63 at time %0t", $time);
end
'd1: begin
    in <= 8'b11000000;
    assert(val == 6'b000000) else $display("Assertion failed: val should be 0 at time %0t", $time);
end
'd2: begin
    in <= 8'd50;
    assert(val == 6'd50) else $display("Assertion failed: val should be 50 at time %0t", $time);
end
'd3: begin
    in <= 8'd255;
    assert(val == 6'd63) else $display("Assertion failed: val should be 63 at time %0t", $time);
end
'd4: begin 
    in <= 8'b10000001;
    assert(val == 6'b000001) else $display("Assertion failed: val should be 1 at time %0t", $time);
end
default: begin
    in <= 8'b0;
end
endcase
end
`

const assign_tb = new Module(
  { name: 'assign_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
assign_tb.addSignal('in', { width: 8 })
assign_tb.addSignal('val', { width: 6 })
assign_tb.addAssign({ in: new Expr('in'), out: 'val' })

try {
  const TB =
`
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${assign_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addAssign_output/assign_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 2

const tbBodyAdd =
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
    a <= 4'd1;
    b <= 4'd1;
    assert(val == 5'd2) else $display("Assertion failed: val should be 2 at time %0t", $time);
end
'd1: begin
    a <= 4'd7;
    b <= 4'd6;
    assert(val == 5'd13) else $display("Assertion failed: val should be 13 at time %0t", $time);
end
'd2: begin
    a <= 4'd10;
    b <= 4'd11;
    assert(val == 5'd21) else $display("Assertion failed: val should be 21 at time %0t", $time);
end
'd3: begin
    a <= 4'd14;
    b <= 4'd9;
    assert(val == 5'd23) else $display("Assertion failed: val should be 23 at time %0t", $time);
end
'd4: begin 
    a <= 4'd15;
    b <= 4'd15;
    assert(val == 5'd30) else $display("Assertion failed: val should be 30 at time %0t", $time);
end
default: begin
    a <= 4'd0;
    b <= 4'd0;
end
endcase
end
`

const assignAdd_tb = new Module(
  { name: 'assignAdd_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyAdd
)
assignAdd_tb.addSignal('a', { width: 4 })
assignAdd_tb.addSignal('b', { width: 4 })
assignAdd_tb.addSignal('val', { width: 5 })
assignAdd_tb.addAssign({ in: new Expr('a + b'), out: 'val' })

try {
  const TB =
`
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${assignAdd_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addAssign_output/assignAdd_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 3 complex multi operation

const tbBodyM =
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
    c <= 8'd1;
    d <= 8'd1;
    e <= 8'd1;
    assert(val == 16'd1) else $display("Assertion failed: val should be 1 at time %0t", $time);
end
'd1: begin
    a <= 8'd5;
    b <= 8'd4;
    c <= 8'd3;
    d <= 8'd2;
    e <= 8'd1;
    assert(val == 16'd3) else $display("Assertion failed: val should be 3 at time %0t", $time);
end
'd2: begin
    a <= 8'd10;
    b <= 8'd10;
    c <= 8'd10;
    d <= 8'd10;
    e <= 8'd10;
    assert(val == 16'd10) else $display("Assertion failed: val should be 10 at time %0t", $time);
end
'd3: begin
    a <= 8'd79;
    b <= 8'd89;
    c <= 8'd28;
    d <= 8'd43;
    e <= 8'd14;
    assert(val == 16'd168) else $display("Assertion failed: val should be 168 at time %0t", $time);
end
'd4: begin 
    a <= 8'd255;
    b <= 8'd255;
    c <= 8'd255;
    d <= 8'd255;
    e <= 8'd255;
    assert(val == -16'd255) else $display("Assertion failed: val should be 255 at time %0t", $time);
end
default: begin
    a <= 8'd0;
    b <= 8'd0;
    c <= 8'd0;
    d <= 8'd0;
    e <= 8'd0;
end
endcase
end
`

const assignM_tb = new Module(
  { name: 'assignM_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyM
)
assignM_tb.addSignal('a', { width: 8 })
assignM_tb.addSignal('b', { width: 8 })
assignM_tb.addSignal('c', { width: 8 })
assignM_tb.addSignal('d', { width: 8 })
assignM_tb.addSignal('e', { width: 8 })
assignM_tb.addSignal('val', { width: 16, isSigned: true })
assignM_tb.addAssign({ in: new Expr('a + b - ((c / d) * e)'), out: 'val' })

try {
  const TB =
`
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      ${assignM_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addAssign_output/assignM_tb.sv', TB)
} catch (err) {
  console.error(err)
}

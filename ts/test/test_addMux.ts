import { Module, Expr } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_addMux_output')
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

a <= 4'd3;
b <= 4'd6;
c <= 4'd9;
d <= 4'd12;

case(count)
'd0: begin
    sel <= 2'd0;
    assert(out == 4'd3) else $fatal("Assertion failed: out should be 3 at time %0t", $time);
end
'd1: begin
    sel <= 2'd1;
    assert(out == 4'd6) else $fatal("Assertion failed: out should be 6 at time %0t", $time);
end
'd2: begin
    sel <= 2'd2;
    assert(out == 4'd9) else $fatal("Assertion failed: out should be 9 at time %0t", $time);
end
'd3: begin
    sel <= 2'd3;
    assert(out == 4'd12) else $fatal("Assertion failed: out should be 12 at time %0t", $time);
end
'd4: begin 
    sel <= 2'd1;
    assert(out == 4'd6) else $fatal("Assertion failed: out should be 6 at time %0t", $time);
end
default: sel <= 4'd0;
endcase
end
`
const mux_tb = new Module(
  { name: 'mux_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
mux_tb.addSignal('a', { width: 4, isSigned: false })
mux_tb.addSignal('b', { width: 4, isSigned: false })
mux_tb.addSignal('c', { width: 4, isSigned: false })
mux_tb.addSignal('d', { width: 4, isSigned: false })
const sigs: string[] = ['a', 'b', 'c', 'd']
mux_tb.addSignal('sel', { width: 2, isSigned: false })
mux_tb.addSignal('out', { width: 4, isSigned: false })
mux_tb.addMux({ in: sigs, sel: 'sel', out: 'out' })

try {
  const TB =
`
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  ${mux_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addMux_output/mux_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// 8 to 1 multiplexer signed

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

a <= 16'd40;
b <= 16'd30;
c <= 16'd20;
d <= 16'd10;
e <= 16'd0;
f <= -16'd10;
g <= -16'd20;
h <= -16'd30;

case(count)
'd0: begin
    sel <= 4'd0;
    assert(out == 16'd40) else $fatal("Assertion failed: out should be 40 at time %0t", $time);
end
'd1: begin
    sel <= 4'd1;
    assert(out == 16'd30) else $fatal("Assertion failed: out should be 30 at time %0t", $time);
end
'd2: begin
    sel <= 4'd2;
    assert(out == 16'd20) else $fatal("Assertion failed: out should be 20 at time %0t", $time);
end
'd3: begin
    sel <= 4'd3;
    assert(out == 16'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd4: begin 
    sel <= 4'd4;
    assert(out == 16'd0) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd5: begin 
    sel <= 4'd5;
    assert(out == -16'd10) else $fatal("Assertion failed: out should be -10 at time %0t", $time);
end
'd6: begin 
    sel <= 4'd6;
    assert(out == -16'd20) else $fatal("Assertion failed: out should be -20 at time %0t", $time);
end
'd7: begin 
    sel <= 4'd7;
    assert(out == -16'd30) else $fatal("Assertion failed: out should be -30 at time %0t", $time);
end
default: sel <= 4'd0;
endcase
end
`

const muxS_tb = new Module(
  { name: 'muxS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyS
)
muxS_tb.addSignal('a', { width: 16, isSigned: true })
muxS_tb.addSignal('b', { width: 16, isSigned: true })
muxS_tb.addSignal('c', { width: 16, isSigned: true })
muxS_tb.addSignal('d', { width: 16, isSigned: true })
muxS_tb.addSignal('e', { width: 16, isSigned: true })
muxS_tb.addSignal('f', { width: 16, isSigned: true })
muxS_tb.addSignal('g', { width: 16, isSigned: true })
muxS_tb.addSignal('h', { width: 16, isSigned: true })
const sigsS: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
muxS_tb.addSignal('sel', { width: 4, isSigned: false })
muxS_tb.addSignal('out', { width: 16, isSigned: true })
muxS_tb.addMux({ in: sigsS, sel: 'sel', out: 'out' })

try {
  const TB =
`
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  ${muxS_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addMux_output/muxS_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// multiplexer with expression

const tbBodyE =
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

a <= 5'd5;
b <= 5'd10;
c <= 5'd15;
d <= 5'd0;

case(count)
'd0: begin
    sel <= 2'b00;
    assert(out == 5'd5) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd1: begin
    sel <= 2'b01;
    assert(out == 5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd2: begin
    sel <= 2'b10;
    assert(out == 5'd15) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
end
'd3: begin
    sel <= 2'b11;
    assert(out == 5'd0) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd4: begin 
    sel <= 2'b01;
    assert(out == 5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
default: sel <= 2'd0;
endcase
end
`

const muxE_tb = new Module(
  { name: 'muxE_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyE
)
const a = new Expr('a-5') // - 5
const b = new Expr('b+5') // + 5
const c = new Expr('c-5') // - 5
const d = new Expr('d+5') // + 5
muxE_tb.addSignal('a', { width: 5, isSigned: true })
muxE_tb.addSignal('b', { width: 5, isSigned: true })
muxE_tb.addSignal('c', { width: 5, isSigned: true })
muxE_tb.addSignal('d', { width: 5, isSigned: true })
const expressions: Expr[] = [a, b, c, d]
muxE_tb.addSignal('sel', { width: 2, isSigned: false })
muxE_tb.addSignal('out', { width: 5, isSigned: true })
muxE_tb.addMux({ in: expressions, sel: new Expr('~sel'), out: 'out' })

try {
  const TB =
`
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  ${muxE_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addMux_output/muxE_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// default and non power of 2 case

const tbBodyD =
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

a <= -5'd10;
b <= -5'd5;
c <= 5'd0;
d <= 5'd5;
e <= 5'd10;

case(count)
'd0: begin
    sel <= 3'd0;
    assert(out == -5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd1: begin
    sel <= 3'd1;
    assert(out == -5'd5) else $fatal("Assertion failed: out should be -5 at time %0t", $time);
end
'd2: begin
    sel <= 3'd2;
    assert(out == 5'd0) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd3: begin
    sel <= 3'd3;
    assert(out == 5'd5) else $fatal("Assertion failed: out should be 5 at time %0t", $time);
end
'd4: begin 
    sel <= 3'd4;
    assert(out == 5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd5: begin
    sel <= 3'd5;
    assert(out == 5'd11) else $fatal("Assertion failed: out should be 11 at time %0t", $time);
end
default: sel <= 3'd0;
endcase
end
`

const muxD_tb = new Module(
  { name: 'muxE_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyD
)

muxD_tb.addSignal('a', { width: 5, isSigned: true })
muxD_tb.addSignal('b', { width: 5, isSigned: true })
muxD_tb.addSignal('c', { width: 5, isSigned: true })
muxD_tb.addSignal('d', { width: 5, isSigned: true })
muxD_tb.addSignal('e', { width: 5, isSigned: true })
const sigsD: string[] = ['a', 'b', 'c', 'd', 'e']
muxD_tb.addSignal('sel', { width: 3, isSigned: false })
muxD_tb.addSignal('out', { width: 5, isSigned: true })
muxD_tb.addMux({ in: sigsD, sel: 'sel', out: 'out', default: new Expr('5\'d11') })

try {
  const TB =
`
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  ${muxD_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addMux_output/muxD_tb.sv', TB)
} catch (err) {
  console.error(err)
}

import { Module } from 'tssv/lib/core/TSSV'
import { mkdirSync } from 'fs'
import { markTestbench } from 'tssv/test/models/testbench'

try {
  mkdirSync('sv-examples/Core/addCombAlways', { recursive: true })
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
        b <= 8'b00000001;
        assert(out == 9'd2) else $display("Assertion failed: out should be 2 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 8'b00000010;
        assert(out == 9'd4) else $display("Assertion failed: out should be 4 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 8'd5;
        assert(out == 9'd105) else $display("Assertion failed: out should be 105 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 8'd11;
        assert(out == 9'd100) else $display("Assertion failed: out should be 100 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b11111111;
        b <= 8'b00001111;
        assert(out == 9'd270) else $display("Assertion failed: out should be 270 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 8'b00000000;
    end
    endcase
    end
`

const comb_tb = markTestbench(new Module(
  { name: 'comb_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
))
comb_tb.addSignal('a', { width: 8, isSigned: false })
comb_tb.addSignal('b', { width: 8, isSigned: false })
const inArr: string[] = ['a', 'b']
comb_tb.addSignal('out', { width: 9, isSigned: false })
const outArr: string[] = ['out']

const body =
`
out = a + b;
`

comb_tb.addCombAlways({ inputs: inArr, outputs: outArr }, body)

try {
  comb_tb.writeSystemVerilogFiles('sv-examples/Core/addCombAlways')
} catch (err) {
  console.error(err)
}

// test with no inputs: the builder emits always_comb, with no sensitivity list

const tbBodyN =
`
always @(posedge clk)
  if (rst_b) assert (out == 9'd42) else $fatal(1, "Assertion failed: out should be 42 at time %0t", $time);
`

const combN_tb = markTestbench(new Module(
  { name: 'combN_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyN
))

combN_tb.addSignal('out', { width: 9, isSigned: false })
const outArrN: string[] = ['out']

const bodyN =
`
out = 9'd42;
`

combN_tb.addCombAlways({ outputs: outArrN }, bodyN)

try {
  combN_tb.writeSystemVerilogFiles('sv-examples/Core/addCombAlways')
} catch (err) {
  console.error(err)
}

import { Module } from 'tssv/lib/core/TSSV'
import { mkdirSync } from 'fs'
import { markTestbench } from 'tssv/test/models/testbench'
import { emitSplit } from 'tssv/test/models/emitSplit'

const GENERATOR = 'ts/test/test_import.ts'
const OUT = 'sv-examples/Core/import'

try {
  mkdirSync(OUT, { recursive: true })
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
        a <= 8'b00000001;
        b <= 9'b00000001;
        assert(out == 10'sd2) else $display("Assertion failed: out should be 2 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 9'b00000010;
        assert(out == 10'sd4) else $display("Assertion failed: out should be 4 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 9'd5;
        assert(out == 10'sd105) else $display("Assertion failed: out should be 105 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 9'd11;
        assert(out == 10'sd100) else $display("Assertion failed: out should be 100 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b01111111;
        b <= 9'b00001111;
        assert(out == 10'sd142) else $display("Assertion failed: out should be 142 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 9'b00000000;
    end
    endcase
    end
`

const import_tb = markTestbench(new Module(
  { name: 'import_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
))
import_tb.addSignal('a', { width: 8, isSigned: true })
import_tb.addSignal('b', { width: 9, isSigned: true })
import_tb.addSignal('out', { width: 10, isSigned: true })
import_tb.addSystemVerilogSubmodule(
  'add3',
  '$TSSV_ROOT/ts/test/testImport.sv',
  { aWidth: 8, bWidth: 9, sumWidth: 10 },
  { a: 'a', b: 'b', sum: 'out' },
  true // autobind doesn't change anything here
)

try {
  emitSplit(import_tb, OUT, GENERATOR)
} catch (err) {
  console.error(err)
}

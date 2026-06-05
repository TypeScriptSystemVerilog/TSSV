import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_import_output')
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
        assert(out == 9'd2) else $display("Assertion failed: out should be 2 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 9'b00000010;
        assert(out == 9'd4) else $display("Assertion failed: out should be 4 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 9'd5;
        assert(out == 9'd105) else $display("Assertion failed: out should be 105 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 9'd11;
        assert(out == 9'd100) else $display("Assertion failed: out should be 100 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b01111111;
        b <= 9'b00001111;
        assert(out == 9'd142) else $display("Assertion failed: out should be 270 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 9'b00000000;
    end
    endcase
    end
`

const import_tb = new Module(
  { name: 'import_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
import_tb.addSignal('a', { width: 8 })
import_tb.addSignal('b', { width: 9 })
import_tb.addSignal('out', { width: 10 })
import_tb.addSystemVerilogSubmodule(
  'add3',
  'ts/test/testImport.sv',
  { aWidth: 8, bWidth: 9, sumWidth: 10 },
  { a: 'a', b: 'b', sum: 'out' },
  true // autobind doesn't change anything here
)

try {
  const TB =
`
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  ${import_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_import_output/import_tb.sv', TB)
} catch (err) {
  console.error(err)
}

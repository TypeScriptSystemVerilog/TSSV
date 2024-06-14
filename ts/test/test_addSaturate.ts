import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_addSaturate_output')
} catch (e) {}

// test 1 unsigned

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
        in <= 8'b00000000;
        assert(out == 4'b0000) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 8'b00000001;
        assert(out == 4'b0001) else $fatal("Assertion failed: out should be 1 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00001111;
        assert(out == 4'b1111) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
    end
    'd3: begin
        in <= 8'b00100000;
        assert(out == 4'd15) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'b10000000;
        assert(out == 4'd15) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
`
// shouldnt over values be 15 because its unsigned
const saturate_tb = new Module(
  { name: 'saturate_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
saturate_tb.addSignal('in', { width: 8, isSigned: false })
saturate_tb.addSignal('out', { width: 4, isSigned: false })
saturate_tb.addSaturate({ in: 'in', out: 'out' }) // sat mode defaults to simple

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${saturate_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSaturate_output/saturate_tb.sv', TB)
} catch (err) {
  console.error(err)
}

// test 2 signed

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
        in <= 8'b00000000;
        assert(out == 4'b0000) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 8'b11110001;
        assert(out == -4'd8) else $fatal("Assertion failed: out should be -8 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00010010;
        assert(out == 4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd3: begin
        in <= 8'b00100000;
        assert(out == 4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'b10000000;
        assert(out == 4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
`

const saturateS_tb = new Module(
  { name: 'saturateS_tb' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBodyS
)
saturateS_tb.addSignal('in', { width: 8, isSigned: true })
saturateS_tb.addSignal('out', { width: 4, isSigned: true })
saturateS_tb.addSaturate({ in: 'in', out: 'out' }) // sat mode defaults to simple

try {
  const TB =
`
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    ${saturateS_tb.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_addSaturate_output/saturateS_tb.sv', TB)
} catch (err) {
  console.error(err)
}

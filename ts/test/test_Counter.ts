import { Counter } from 'tssv/lib/modules/Counter'
import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_Counter_output')
} catch (e) {}

// writeSystemVerilog() mutates this.body, so use a separate instance for the standalone file
// to avoid duplicate always_ff blocks when the testbench calls writeSystemVerilog() again.
const counterForSV = new Counter({ name: 'counter4b', width: 4 })
writeFileSync('sv-examples/test_Counter_output/counter4b.sv', counterForSV.writeSystemVerilog())

const myCounter = new Counter({ name: 'counter4b', width: 4 })

// Testbench drives reset internally based on a cycle counter:
//   cycles  0- 2 : reset=1  (initial reset, counter held at 0)
//   cycles  3-19 : reset=0  (counter counts freely, wraps at 0xf->0)
//   cycle  20    : reset=1  (mid-run reset pulse)
//   cycles 21+   : reset=0  (counter resumes from 0)
const tbBody = `
    always @(posedge clk)
      begin
        cycle_count <= cycle_count + 1;
        if (cycle_count < 3)
          reset <= 1'b1;
        else if (cycle_count == 21)
          reset <= 1'b1;
        else
          reset <= 1'b0;
      end
`

const tb = new Module(
  { name: 'tb_counter' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {
    reset: { width: 1 },
    cycle_count: { width: 32 }
  },
  tbBody
)

// autoBind matches clk and reset by name; createMissing adds q so it appears in the trace
tb.addSubmodule('dut', myCounter, {}, true, true)

const TB =
`/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */
${tb.writeSystemVerilog()}
`
writeFileSync('sv-examples/test_Counter_output/tb_counter.sv', TB)
console.log('Generated sv-examples/test_Counter_output/tb_counter.sv')

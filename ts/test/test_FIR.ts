import { FIR } from 'tssv/lib/modules/FIR'
import { Module } from 'tssv/lib/core/TSSV'
import { writeFileSync, mkdirSync } from 'fs'

try {
  mkdirSync('sv-examples/test_FIR_output')
} catch (e) {}

const myFir3 = new FIR(
  {
    name: 'myFIR3',
    inWidth: 8,
    outWidth: 8,
    rShift: 7
  })
try {
  writeFileSync('sv-examples/test_FIR_output/myFIR3.sv', myFir3.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

const tbBody =
`
    // always accept output
    assign m_axis.TREADY = 1'b1;
    // tie AXI clock/reset into the interface bundles
    assign s_axis.ACLK    = clk;
    assign s_axis.ARESETn = rst_b;
    assign m_axis.ACLK    = clk;
    assign m_axis.ARESETn = rst_b;

    always @(posedge clk or negedge rst_b)
      if(!rst_b)
        begin
          s_axis.TVALID <= 1'b0;
          s_axis.TDATA  <= '0;
          count <= 'd0;
          phase <= 'd0;
          step  <= 'd16;
        end
      else
        begin
          s_axis.TVALID <= 1'b1;
          count <= count + 1'b1;
          if((step > 'd1) && (count[7:0] == 7'd127))
            begin
              step <= step>>1;
            end
          phase <= phase + step;
          s_axis.TDATA <= (phase == 5'd16) ? -8'sd127 : ((phase == 5'd0) ? 8'sd127 : 8'sd0);
        end
`
const tb_lpFIR = new Module(
  { name: 'tb_lpFIR' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {
    phase: { width: 5 },
    count: { width: 16 },
    step: { width: 5 }
  },
  tbBody
)
tb_lpFIR.addSubmodule(
  'dut',
  myFir3,
  {},
  true,
  true
)

try {
  const TB =
`
/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */
${tb_lpFIR.writeSystemVerilog()}
`
  writeFileSync('sv-examples/test_FIR_output/tb_lpFIR.sv', TB)
} catch (err) {
  console.error(err)
}

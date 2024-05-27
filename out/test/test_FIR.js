import { FIR } from 'tssv/lib/modules/FIR';
import { Module } from 'tssv/lib/core/TSSV';
import { writeFileSync, mkdirSync } from 'fs';
try {
    mkdirSync('sv-examples/test_FIR_output');
}
catch (e) { }
const myFir = new FIR({ name: 'myFIR', numTaps: 4, coefficients: [1n, 2n, 3n, 4n] });
try {
    writeFileSync('sv-examples/test_FIR_output/myFIR.sv', myFir.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
const myFir2 = new FIR({ numTaps: 5, coefficients: [2n, -2n, 4n, -4n, 8n] });
try {
    writeFileSync(`sv-examples/test_FIR_output/${myFir2.name}.sv`, myFir2.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
const myFir3 = new FIR({
    name: 'myFIR3',
    numTaps: 13,
    inWidth: 8,
    outWidth: 8,
    coefficients: [-1n, 0n, 5n, -6n, -10n, 38n, 77n, 38n, -10n, -6n, 5n, 0n, -1n],
    rShift: 7
});
try {
    writeFileSync('sv-examples/test_FIR_output/myFIR3.sv', myFir3.writeSystemVerilog());
}
catch (err) {
    console.error(err);
}
const tbBody = `
    always @(posedge clk or negedge rst_b)
      if(!rst_b)
        begin
          en <= 1'b1;
          data_in <= 'd0;
          count <= 'd0;
          phase <= 'd0;
          step <= 'd16;
        end
      else
        begin
          en <= 1'b1;
          count <= count + 1'b1;
          if((step > 'd1) && (count[7:0] == 7'd127))
            begin
              step <= step>>1;
            end
          phase <= phase + step;
          data_in <= (phase == 5'd16) ? -8'sd127 : ((phase == 5'd0) ? 8'sd127 :  8'sd0);
          end
`;
const tb_lpFIR = new Module({ name: 'tb_lpFIR' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
}, {
    phase: { width: 5 },
    count: { width: 16 },
    step: { width: 5 }
}, tbBody);
tb_lpFIR.addSubmodule('dut', myFir3, {}, true, true);
try {
    const TB = `
/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */
${tb_lpFIR.writeSystemVerilog()}
`;
    writeFileSync('sv-examples/test_FIR_output/tb_lpFIR.sv', TB);
}
catch (err) {
    console.error(err);
}

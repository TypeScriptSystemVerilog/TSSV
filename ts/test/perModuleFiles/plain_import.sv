// Imported by ts/test/test_perModuleFiles.ts with addSystemVerilogSubmodule(). It has no include
// guard, so writeSystemVerilogFiles() wraps it in one.
module plain_import
  (
   input  logic       clk,
   input  logic [7:0] d,
   output logic [7:0] q
   );
  always_ff @(posedge clk) begin
    q <= d;
  end
endmodule

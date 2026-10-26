// Imported by ts/test/test_perModuleFiles.ts with addSystemVerilogSubmodule().
// writeSystemVerilogFiles() writes it untouched, inside its SVIMPORT__plain_import__ guard.
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

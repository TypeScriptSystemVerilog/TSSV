`ifndef DEF__guarded_import__
`define DEF__guarded_import__
// Imported by ts/test/test_perModuleFiles.ts with addSystemVerilogSubmodule(). It has a guard of
// its own, in the style of a generated file's; writeSystemVerilogFiles() leaves it untouched, and
// adds only the SVIMPORT__guarded_import__ guard around the whole file.

module guarded_import
  (
   input  logic       clk,
   input  logic [7:0] d,
   output logic [7:0] q
   );
  always_ff @(posedge clk) begin
    q <= d;
  end
endmodule

`endif //!DEF__guarded_import__

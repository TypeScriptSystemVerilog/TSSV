`ifndef DEF__guarded_import__
`define DEF__guarded_import__
// Imported by ts/test/test_perModuleFiles.ts with addSystemVerilogSubmodule(). It already has the
// include guard writeSystemVerilogFiles() writes, so it is written unchanged, not guarded twice.

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

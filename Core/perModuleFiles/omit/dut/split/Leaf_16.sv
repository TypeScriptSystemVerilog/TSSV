`ifndef DEF__Leaf_16__
`define DEF__Leaf_16__

module Leaf_16 (
    input logic clk,
    input logic [15:0] d,
    output logic [15:0] q
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // width = 16
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // q: a test of file emission, with no reset
  // ------------------------------------------------------------------


  always_ff @(posedge clk) begin
    q <= d;
  end

endmodule

`endif //!DEF__Leaf_16__

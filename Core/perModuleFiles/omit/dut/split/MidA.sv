`ifndef DEF__MidA__
`define DEF__MidA__
`ifdef USE_INCLUDES
`include "memory_rd_only_32_32.sv"
`include "Leaf_8.sv"
`include "Leaf_16.sv"
`endif //USE_INCLUDES

module MidA (
    input logic clk,
    input logic [7:0] a_d,
    output logic [7:0] a_q,
    input logic [15:0] b_d,
    output logic [15:0] b_q,
    memory_rd_only_32_32.inward mem
);

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem.DATA_RD: a test of file emission, with no reset
  // ------------------------------------------------------------------

  assign mem.READY = 1'b1;

  always_ff @(posedge clk)
    if (mem.RE) begin
      mem.DATA_RD <= mem.ADDR;
    end

  Leaf_8 u_leaf8 (
      .clk(clk),
      .d  (a_d),
      .q  (a_q)
  );

  Leaf_16 u_leaf16 (
      .clk(clk),
      .d  (b_d),
      .q  (b_q)
  );

endmodule

`endif //!DEF__MidA__

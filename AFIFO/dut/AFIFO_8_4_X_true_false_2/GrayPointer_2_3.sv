`ifndef DEF__GrayPointer_2_3__
`define DEF__GrayPointer_2_3__
`ifdef USE_INCLUDES
`include "CDCSynchronizer_2_3.sv"
`endif //USE_INCLUDES

module GrayPointer_2_3 (
    input logic clk,
    input logic rst_n,
    input logic inc,
    output logic [2:0] bin_ptr,
    input logic far_clk,
    input logic far_rst_n,
    output logic [2:0] far_bin_ptr
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // syncStages = 2n
  // width = 3n
  // ------------------------------------------------------------------
  logic [2:0] bin_ptr_nxt;
  logic [2:0] gray_q;
  logic [2:0] gray_far;

  assign bin_ptr_nxt = 3'(bin_ptr + 3'(inc));
  assign far_bin_ptr = {gray_far[2], ^gray_far[2:1], ^gray_far[2:0]};

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      bin_ptr <= '0;
      gray_q  <= '0;
    end else begin
      bin_ptr <= bin_ptr_nxt;
      gray_q  <= bin_ptr_nxt ^ (bin_ptr_nxt >> 1);
    end

  CDCSynchronizer_2_3 u_sync (
      .clk(far_clk),
      .rst_n(far_rst_n),
      .d(gray_q),
      .q(gray_far)
  );

endmodule

`endif //!DEF__GrayPointer_2_3__

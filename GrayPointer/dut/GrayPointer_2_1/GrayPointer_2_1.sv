`ifndef DEF__GrayPointer_2_1__
`define DEF__GrayPointer_2_1__
`ifdef USE_INCLUDES
`include "CDCSynchronizer_2_1.sv"
`endif //USE_INCLUDES

module GrayPointer_2_1 (
    input  logic clk,
    input  logic rst_n,
    input  logic inc,
    output logic bin_ptr,
    input  logic far_clk,
    input  logic far_rst_n,
    output logic far_bin_ptr
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // syncStages = 2n
  // width = 1n
  // ------------------------------------------------------------------
  logic bin_ptr_nxt;
  logic gray_q;
  logic gray_far;

  assign bin_ptr_nxt = 1'(bin_ptr + 1'(inc));
  assign far_bin_ptr = gray_far;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      bin_ptr <= '0;
      gray_q  <= '0;
    end else begin
      bin_ptr <= bin_ptr_nxt;
      gray_q  <= bin_ptr_nxt ^ (bin_ptr_nxt >> 1);
    end

  CDCSynchronizer_2_1 u_sync (
      .clk(far_clk),
      .rst_n(far_rst_n),
      .d(gray_q),
      .q(gray_far)
  );

endmodule

`endif //!DEF__GrayPointer_2_1__

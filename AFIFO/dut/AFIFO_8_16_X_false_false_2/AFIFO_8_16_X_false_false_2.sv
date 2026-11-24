`ifndef DEF__AFIFO_8_16_X_false_false_2__
`define DEF__AFIFO_8_16_X_false_false_2__
`ifdef USE_INCLUDES
`include "GrayPointer_2_5.sv"
`include "TwoClockRegFile_8_16_X.sv"
`endif //USE_INCLUDES

module AFIFO_8_16_X_false_false_2 (
    input logic wr_clk,
    input logic wr_rst_n,
    input logic push_en,
    input logic [7:0] push_data,
    output logic full,
    output logic [4:0] wr_curr_depth,
    input logic rd_clk,
    input logic rd_rst_n,
    input logic pop_en,
    output logic [7:0] pop_data,
    output logic empty,
    output logic [4:0] rd_curr_depth
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 8n
  // depth = 16n
  // inclAlmostEmpty = false
  // inclAlmostFull = false
  // syncStages = 2n
  // ------------------------------------------------------------------
  logic push_fire;
  logic pop_fire;
  logic [4:0] wr_ptr_q;
  logic [4:0] wr_ptr_rsync;
  logic [4:0] rd_ptr_q;
  logic [4:0] rd_ptr_wsync;
  logic [4:0] rd_ptr_nxt;
  logic head_vld_nxt;
  logic head_load;
  logic [3:0] wr_addr;
  logic [3:0] rd_addr;

  assign push_fire = push_en && !full;
  assign wr_curr_depth = 5'(wr_ptr_q - rd_ptr_wsync);
  assign full = wr_ptr_q == {~rd_ptr_wsync[4], rd_ptr_wsync[3:0]};
  assign pop_fire = pop_en && !empty;
  assign rd_ptr_nxt = 5'(rd_ptr_q + 5'(pop_fire));
  assign head_vld_nxt = rd_ptr_nxt != wr_ptr_rsync;
  assign head_load = head_vld_nxt && (pop_fire || empty);
  assign rd_curr_depth = empty ? '0 : 5'(wr_ptr_rsync - rd_ptr_q);
  assign wr_addr = wr_ptr_q[3:0];
  assign rd_addr = rd_ptr_nxt[3:0];

  always_ff @(posedge rd_clk or negedge rd_rst_n)
    if (!rd_rst_n) begin
      empty <= 1'd1;
    end else begin
      empty <= !head_vld_nxt;
    end

  GrayPointer_2_5 u_wr_ptr (
      .clk(wr_clk),
      .rst_n(wr_rst_n),
      .inc(push_fire),
      .bin_ptr(wr_ptr_q),
      .far_clk(rd_clk),
      .far_rst_n(rd_rst_n),
      .far_bin_ptr(wr_ptr_rsync)
  );

  GrayPointer_2_5 u_rd_ptr (
      .clk(rd_clk),
      .rst_n(rd_rst_n),
      .inc(pop_fire),
      .bin_ptr(rd_ptr_q),
      .far_clk(wr_clk),
      .far_rst_n(wr_rst_n),
      .far_bin_ptr(rd_ptr_wsync)
  );

  TwoClockRegFile_8_16_X u_storage (
      .a_clk(wr_clk),
      .a_we(push_fire),
      .a_addr(wr_addr),
      .a_data_in(push_data),
      .b_clk(rd_clk),
      .b_re(head_load),
      .b_addr(rd_addr),
      .b_data_out(pop_data)
  );

endmodule

`endif //!DEF__AFIFO_8_16_X_false_false_2__

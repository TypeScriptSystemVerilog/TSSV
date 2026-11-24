`ifndef DEF__FIR_9_naqyqi9x_4_4_3_12_0_coeffRegs__
`define DEF__FIR_9_naqyqi9x_4_4_3_12_0_coeffRegs__
`ifdef USE_INCLUDES
`include "memory_bidi_32_32.sv"
`endif //USE_INCLUDES

module FIR_9_naqyqi9x_4_4_3_12_0_coeffRegs (
    input logic clk,
    input logic rst_b,
    output logic signed [3:0] COEFF_0,
    output logic signed [3:0] COEFF_1,
    output logic signed [3:0] COEFF_2,
    memory_bidi_32_32.inward regs
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // busAddressWidth = 32
  // busInterface = Memory
  // endianess = little
  // regDefs = 3 registers, hash kl94g20d
  // ------------------------------------------------------------------
  logic COEFF_0_matchExpr;
  logic COEFF_0_rd_hit;
  logic COEFF_0_wr_hit;
  logic COEFF_1_matchExpr;
  logic COEFF_1_rd_hit;
  logic COEFF_1_wr_hit;
  logic COEFF_2_matchExpr;
  logic COEFF_2_rd_hit;
  logic COEFF_2_wr_hit;
  logic [31:0] rd_data_nxt;
  logic [31:0] rd_data_q;

  assign COEFF_0_matchExpr = regs.ADDR == 32'h0;
  assign COEFF_0_rd_hit = COEFF_0_matchExpr && regs.RE;
  assign COEFF_0_wr_hit = COEFF_0_matchExpr && regs.WE;
  assign COEFF_1_matchExpr = regs.ADDR == 32'h4;
  assign COEFF_1_rd_hit = COEFF_1_matchExpr && regs.RE;
  assign COEFF_1_wr_hit = COEFF_1_matchExpr && regs.WE;
  assign COEFF_2_matchExpr = regs.ADDR == 32'h8;
  assign COEFF_2_rd_hit = COEFF_2_matchExpr && regs.RE;
  assign COEFF_2_wr_hit = COEFF_2_matchExpr && regs.WE;
  always_comb begin : read_mux
    rd_data_nxt = '0;
    if (COEFF_0_rd_hit) begin
      rd_data_nxt = {28'b0, COEFF_0};
    end else if (COEFF_1_rd_hit) begin
      rd_data_nxt = {28'b0, COEFF_1};
    end else if (COEFF_2_rd_hit) begin
      rd_data_nxt = {28'b0, COEFF_2};
    end
  end
  assign regs.READY   = 1'b1;
  assign regs.DATA_RD = rd_data_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_0 <= -4'sd2;
    end else if (COEFF_0_wr_hit) begin
      COEFF_0 <= regs.WSTRB[0] ? regs.DATA_WR[3:0] : COEFF_0;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_1 <= 4'sd1;
    end else if (COEFF_1_wr_hit) begin
      COEFF_1 <= regs.WSTRB[0] ? regs.DATA_WR[3:0] : COEFF_1;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_2 <= 4'sd3;
    end else if (COEFF_2_wr_hit) begin
      COEFF_2 <= regs.WSTRB[0] ? regs.DATA_WR[3:0] : COEFF_2;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      rd_data_q <= '0;
    end else if (regs.RE) begin
      rd_data_q <= rd_data_nxt;
    end

endmodule

`endif //!DEF__FIR_9_naqyqi9x_4_4_3_12_0_coeffRegs__

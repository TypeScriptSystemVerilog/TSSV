`ifndef DEF__FIR_42_32qzp3qp_32_8_4_9_2_coeffRegs__
`define DEF__FIR_42_32qzp3qp_32_8_4_9_2_coeffRegs__
`ifdef USE_INCLUDES
`include "memory_bidi_32_32.sv"
`endif //USE_INCLUDES

module FIR_42_32qzp3qp_32_8_4_9_2_coeffRegs (
    input logic clk,
    input logic rst_b,
    output logic signed [31:0] COEFF_0,
    output logic signed [31:0] COEFF_1,
    output logic signed [31:0] COEFF_2,
    output logic signed [31:0] COEFF_3,
    memory_bidi_32_32.inward regs
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // busAddressWidth = 32
  // busInterface = Memory
  // endianess = little
  // regDefs = 4 registers, hash 2as4ui0x
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
  logic COEFF_3_matchExpr;
  logic COEFF_3_rd_hit;
  logic COEFF_3_wr_hit;
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
  assign COEFF_3_matchExpr = regs.ADDR == 32'hc;
  assign COEFF_3_rd_hit = COEFF_3_matchExpr && regs.RE;
  assign COEFF_3_wr_hit = COEFF_3_matchExpr && regs.WE;
  always_comb begin : read_mux
    rd_data_nxt = '0;
    if (COEFF_0_rd_hit) begin
      rd_data_nxt = COEFF_0;
    end else if (COEFF_1_rd_hit) begin
      rd_data_nxt = COEFF_1;
    end else if (COEFF_2_rd_hit) begin
      rd_data_nxt = COEFF_2;
    end else if (COEFF_3_rd_hit) begin
      rd_data_nxt = COEFF_3;
    end
  end
  assign regs.READY   = 1'b1;
  assign regs.DATA_RD = rd_data_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_0 <= '0;
    end else if (COEFF_0_wr_hit) begin
      COEFF_0 <= {
        (regs.WSTRB[3] ? regs.DATA_WR[31:24] : COEFF_0[31:24]),
        (regs.WSTRB[2] ? regs.DATA_WR[23:16] : COEFF_0[23:16]),
        (regs.WSTRB[1] ? regs.DATA_WR[15:8] : COEFF_0[15:8]),
        (regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_0[7:0])
      };
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_1 <= '0;
    end else if (COEFF_1_wr_hit) begin
      COEFF_1 <= {
        (regs.WSTRB[3] ? regs.DATA_WR[31:24] : COEFF_1[31:24]),
        (regs.WSTRB[2] ? regs.DATA_WR[23:16] : COEFF_1[23:16]),
        (regs.WSTRB[1] ? regs.DATA_WR[15:8] : COEFF_1[15:8]),
        (regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_1[7:0])
      };
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_2 <= '0;
    end else if (COEFF_2_wr_hit) begin
      COEFF_2 <= {
        (regs.WSTRB[3] ? regs.DATA_WR[31:24] : COEFF_2[31:24]),
        (regs.WSTRB[2] ? regs.DATA_WR[23:16] : COEFF_2[23:16]),
        (regs.WSTRB[1] ? regs.DATA_WR[15:8] : COEFF_2[15:8]),
        (regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_2[7:0])
      };
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_3 <= '0;
    end else if (COEFF_3_wr_hit) begin
      COEFF_3 <= {
        (regs.WSTRB[3] ? regs.DATA_WR[31:24] : COEFF_3[31:24]),
        (regs.WSTRB[2] ? regs.DATA_WR[23:16] : COEFF_3[23:16]),
        (regs.WSTRB[1] ? regs.DATA_WR[15:8] : COEFF_3[15:8]),
        (regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_3[7:0])
      };
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      rd_data_q <= '0;
    end else if (regs.RE) begin
      rd_data_q <= rd_data_nxt;
    end

endmodule

`endif //!DEF__FIR_42_32qzp3qp_32_8_4_9_2_coeffRegs__

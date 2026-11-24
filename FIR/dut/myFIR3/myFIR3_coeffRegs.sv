`ifndef DEF__myFIR3_coeffRegs__
`define DEF__myFIR3_coeffRegs__
`ifdef USE_INCLUDES
`include "memory_bidi_32_32.sv"
`endif //USE_INCLUDES

module myFIR3_coeffRegs (
    input logic clk,
    input logic rst_b,
    output logic signed [7:0] COEFF_0,
    output logic signed [7:0] COEFF_1,
    output logic signed [7:0] COEFF_2,
    output logic signed [7:0] COEFF_3,
    output logic signed [7:0] COEFF_4,
    output logic signed [7:0] COEFF_5,
    output logic signed [7:0] COEFF_6,
    output logic signed [7:0] COEFF_7,
    output logic signed [7:0] COEFF_8,
    output logic signed [7:0] COEFF_9,
    output logic signed [7:0] COEFF_10,
    output logic signed [7:0] COEFF_11,
    output logic signed [7:0] COEFF_12,
    memory_bidi_32_32.inward regs
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // busAddressWidth = 32
  // busInterface = Memory
  // endianess = little
  // regDefs = 13 registers, hash r383fuwi
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
  logic COEFF_4_matchExpr;
  logic COEFF_4_rd_hit;
  logic COEFF_4_wr_hit;
  logic COEFF_5_matchExpr;
  logic COEFF_5_rd_hit;
  logic COEFF_5_wr_hit;
  logic COEFF_6_matchExpr;
  logic COEFF_6_rd_hit;
  logic COEFF_6_wr_hit;
  logic COEFF_7_matchExpr;
  logic COEFF_7_rd_hit;
  logic COEFF_7_wr_hit;
  logic COEFF_8_matchExpr;
  logic COEFF_8_rd_hit;
  logic COEFF_8_wr_hit;
  logic COEFF_9_matchExpr;
  logic COEFF_9_rd_hit;
  logic COEFF_9_wr_hit;
  logic COEFF_10_matchExpr;
  logic COEFF_10_rd_hit;
  logic COEFF_10_wr_hit;
  logic COEFF_11_matchExpr;
  logic COEFF_11_rd_hit;
  logic COEFF_11_wr_hit;
  logic COEFF_12_matchExpr;
  logic COEFF_12_rd_hit;
  logic COEFF_12_wr_hit;
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
  assign COEFF_4_matchExpr = regs.ADDR == 32'h10;
  assign COEFF_4_rd_hit = COEFF_4_matchExpr && regs.RE;
  assign COEFF_4_wr_hit = COEFF_4_matchExpr && regs.WE;
  assign COEFF_5_matchExpr = regs.ADDR == 32'h14;
  assign COEFF_5_rd_hit = COEFF_5_matchExpr && regs.RE;
  assign COEFF_5_wr_hit = COEFF_5_matchExpr && regs.WE;
  assign COEFF_6_matchExpr = regs.ADDR == 32'h18;
  assign COEFF_6_rd_hit = COEFF_6_matchExpr && regs.RE;
  assign COEFF_6_wr_hit = COEFF_6_matchExpr && regs.WE;
  assign COEFF_7_matchExpr = regs.ADDR == 32'h1c;
  assign COEFF_7_rd_hit = COEFF_7_matchExpr && regs.RE;
  assign COEFF_7_wr_hit = COEFF_7_matchExpr && regs.WE;
  assign COEFF_8_matchExpr = regs.ADDR == 32'h20;
  assign COEFF_8_rd_hit = COEFF_8_matchExpr && regs.RE;
  assign COEFF_8_wr_hit = COEFF_8_matchExpr && regs.WE;
  assign COEFF_9_matchExpr = regs.ADDR == 32'h24;
  assign COEFF_9_rd_hit = COEFF_9_matchExpr && regs.RE;
  assign COEFF_9_wr_hit = COEFF_9_matchExpr && regs.WE;
  assign COEFF_10_matchExpr = regs.ADDR == 32'h28;
  assign COEFF_10_rd_hit = COEFF_10_matchExpr && regs.RE;
  assign COEFF_10_wr_hit = COEFF_10_matchExpr && regs.WE;
  assign COEFF_11_matchExpr = regs.ADDR == 32'h2c;
  assign COEFF_11_rd_hit = COEFF_11_matchExpr && regs.RE;
  assign COEFF_11_wr_hit = COEFF_11_matchExpr && regs.WE;
  assign COEFF_12_matchExpr = regs.ADDR == 32'h30;
  assign COEFF_12_rd_hit = COEFF_12_matchExpr && regs.RE;
  assign COEFF_12_wr_hit = COEFF_12_matchExpr && regs.WE;
  always_comb begin : read_mux
    rd_data_nxt = '0;
    if (COEFF_0_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_0};
    end else if (COEFF_1_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_1};
    end else if (COEFF_2_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_2};
    end else if (COEFF_3_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_3};
    end else if (COEFF_4_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_4};
    end else if (COEFF_5_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_5};
    end else if (COEFF_6_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_6};
    end else if (COEFF_7_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_7};
    end else if (COEFF_8_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_8};
    end else if (COEFF_9_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_9};
    end else if (COEFF_10_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_10};
    end else if (COEFF_11_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_11};
    end else if (COEFF_12_rd_hit) begin
      rd_data_nxt = {24'b0, COEFF_12};
    end
  end
  assign regs.READY   = 1'b1;
  assign regs.DATA_RD = rd_data_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_0 <= -8'sd1;
    end else if (COEFF_0_wr_hit) begin
      COEFF_0 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_0;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_1 <= '0;
    end else if (COEFF_1_wr_hit) begin
      COEFF_1 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_1;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_2 <= 8'sd5;
    end else if (COEFF_2_wr_hit) begin
      COEFF_2 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_2;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_3 <= -8'sd6;
    end else if (COEFF_3_wr_hit) begin
      COEFF_3 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_3;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_4 <= -8'sd10;
    end else if (COEFF_4_wr_hit) begin
      COEFF_4 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_4;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_5 <= 8'sd38;
    end else if (COEFF_5_wr_hit) begin
      COEFF_5 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_5;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_6 <= 8'sd77;
    end else if (COEFF_6_wr_hit) begin
      COEFF_6 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_6;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_7 <= 8'sd38;
    end else if (COEFF_7_wr_hit) begin
      COEFF_7 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_7;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_8 <= -8'sd10;
    end else if (COEFF_8_wr_hit) begin
      COEFF_8 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_8;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_9 <= -8'sd6;
    end else if (COEFF_9_wr_hit) begin
      COEFF_9 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_9;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_10 <= 8'sd5;
    end else if (COEFF_10_wr_hit) begin
      COEFF_10 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_10;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_11 <= '0;
    end else if (COEFF_11_wr_hit) begin
      COEFF_11 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_11;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_12 <= -8'sd1;
    end else if (COEFF_12_wr_hit) begin
      COEFF_12 <= regs.WSTRB[0] ? regs.DATA_WR[7:0] : COEFF_12;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      rd_data_q <= '0;
    end else if (regs.RE) begin
      rd_data_q <= rd_data_nxt;
    end

endmodule

`endif //!DEF__myFIR3_coeffRegs__

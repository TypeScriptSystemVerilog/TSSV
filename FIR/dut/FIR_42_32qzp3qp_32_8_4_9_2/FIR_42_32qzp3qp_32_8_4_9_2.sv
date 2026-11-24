`ifndef DEF__FIR_42_32qzp3qp_32_8_4_9_2__
`define DEF__FIR_42_32qzp3qp_32_8_4_9_2__
`ifdef USE_INCLUDES
`include "AXI4Stream_32_4_0_4.sv"
`include "memory_bidi_32_32.sv"
`include "FIR_42_32qzp3qp_32_8_4_9_2_coeffRegs.sv"
`endif //USE_INCLUDES

module FIR_42_32qzp3qp_32_8_4_9_2 (
    input logic clk,
    input logic rst_b,
    AXI4Stream_32_4_0_4.inward s_axis,
    AXI4Stream_32_4_0_4.outward m_axis,
    memory_bidi_32_32.inward regs
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // accumulatorWidth = 42
  // coefficients = [0n, 0n, 0n, 0n]
  // coefficientsWidth = 32
  // inWidth = 8
  // numTaps = 4
  // outWidth = 9
  // rShift = 2
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // sum_q: RST-3: datapath, read only while valid_sum_q is high
  // data_out_q: RST-3: datapath, read only while valid_out_q is high
  // ------------------------------------------------------------------
  logic en;
  logic s_xfer;
  logic valid_tap_q;
  logic valid_sum_q;
  logic valid_out_q;
  logic signed [7:0] data_in;
  logic signed [7:0] tap_0_q;
  logic signed [7:0] tap_1_q;
  logic signed [7:0] tap_2_q;
  logic signed [7:0] tap_3_q;
  logic signed [31:0] coeff_0;
  logic signed [31:0] coeff_1;
  logic signed [31:0] coeff_2;
  logic signed [31:0] coeff_3;
  logic signed [39:0] prod_0;
  logic signed [39:0] prod_1;
  logic signed [39:0] prod_2;
  logic signed [39:0] prod_3;
  logic signed [41:0] sum_nxt;
  logic signed [41:0] sum_q;
  logic signed [40:0] rounded;
  logic signed [42:0] rounded_biased;
  logic signed [8:0] saturated;
  logic signed [8:0] data_out_q;

  assign en = m_axis.TREADY || !valid_out_q;
  assign s_axis.TREADY = en;
  assign s_xfer = s_axis.TVALID && en;
  assign data_in = $signed(s_axis.TDATA[7:0]);
  assign prod_0 = tap_0_q * coeff_0;
  assign prod_1 = tap_1_q * coeff_1;
  assign prod_2 = tap_2_q * coeff_2;
  assign prod_3 = tap_3_q * coeff_3;
  assign sum_nxt = prod_0 + prod_1 + prod_2 + prod_3;
  assign rounded_biased = 43'(sum_q) + (43'sd2);
  assign rounded = 41'(rounded_biased >>> 2);
  assign saturated = (rounded > 41'sd255) ? 9'sd255 : (rounded < -41'sd256) ? -9'sd256 : 9'(rounded);
  assign m_axis.TVALID = valid_out_q;
  assign m_axis.TDATA = $unsigned(32'(data_out_q));
  assign m_axis.TLAST = 1'b1;
  assign m_axis.TSTRB = {4{1'b1}};
  assign m_axis.TKEEP = {4{1'b1}};
  assign m_axis.TID = '0;
  assign m_axis.TDEST = '0;
  assign m_axis.TWAKEUP = 1'b0;
  // FIR runs on clk and rst_b and has no clock enable, so it ignores ACLK, ARESETn and ACLKEN on both streams
  /* verilator lint_off UNUSEDSIGNAL */
  logic axis_unused_clk;
  /* verilator lint_on UNUSEDSIGNAL */
  assign axis_unused_clk = ^{s_axis.ACLK, s_axis.ACLKEN, s_axis.ARESETn, m_axis.ACLK, m_axis.ACLKEN, m_axis.ARESETn};

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      valid_tap_q <= '0;
      valid_sum_q <= '0;
      valid_out_q <= '0;
    end else if (en) begin
      valid_tap_q <= s_xfer;
      valid_sum_q <= valid_tap_q;
      valid_out_q <= valid_sum_q;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      tap_0_q <= '0;
      tap_1_q <= '0;
      tap_2_q <= '0;
      tap_3_q <= '0;
    end else if (s_xfer) begin
      tap_0_q <= data_in;
      tap_1_q <= tap_0_q;
      tap_2_q <= tap_1_q;
      tap_3_q <= tap_2_q;
    end

  always_ff @(posedge clk)
    if (en) begin
      sum_q <= sum_nxt;
      data_out_q <= saturated;
    end

  FIR_42_32qzp3qp_32_8_4_9_2_coeffRegs u_coeff_regs (
      .clk(clk),
      .rst_b(rst_b),
      .regs(regs),
      .COEFF_0(coeff_0),
      .COEFF_1(coeff_1),
      .COEFF_2(coeff_2),
      .COEFF_3(coeff_3)
  );

endmodule

`endif //!DEF__FIR_42_32qzp3qp_32_8_4_9_2__

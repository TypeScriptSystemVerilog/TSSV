`ifndef DEF__FIR_10_3mcw6l3z_6_6_5_6_3__
`define DEF__FIR_10_3mcw6l3z_6_6_5_6_3__
`ifdef USE_INCLUDES
`include "AXI4Stream_32_4_0_4.sv"
`include "memory_bidi_32_32.sv"
`include "FIR_10_3mcw6l3z_6_6_5_6_3_coeffRegs.sv"
`endif //USE_INCLUDES

module FIR_10_3mcw6l3z_6_6_5_6_3 (
    input logic clk,
    input logic rst_b,
    AXI4Stream_32_4_0_4.inward s_axis,
    AXI4Stream_32_4_0_4.outward m_axis,
    memory_bidi_32_32.inward regs
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // accumulatorWidth = 10
  // coefficients = [3n, -7n, 12n, -7n, 3n]
  // coefficientsWidth = 6
  // inWidth = 6
  // numTaps = 5
  // outWidth = 6
  // rShift = 3
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
  logic signed [5:0] data_in;
  logic signed [5:0] tap_0_q;
  logic signed [5:0] tap_1_q;
  logic signed [5:0] tap_2_q;
  logic signed [5:0] tap_3_q;
  logic signed [5:0] tap_4_q;
  logic signed [5:0] coeff_0;
  logic signed [5:0] coeff_1;
  logic signed [5:0] coeff_2;
  logic signed [5:0] coeff_3;
  logic signed [5:0] coeff_4;
  logic signed [11:0] prod_0;
  logic signed [11:0] prod_1;
  logic signed [11:0] prod_2;
  logic signed [11:0] prod_3;
  logic signed [11:0] prod_4;
  logic signed [9:0] sum_nxt;
  logic signed [9:0] sum_q;
  logic signed [7:0] rounded;
  logic signed [10:0] rounded_biased;
  logic signed [5:0] saturated;
  logic signed [5:0] data_out_q;

  assign en = m_axis.TREADY || !valid_out_q;
  assign s_axis.TREADY = en;
  assign s_xfer = s_axis.TVALID && en;
  assign data_in = $signed(s_axis.TDATA[5:0]);
  // coefficient registers are 6 bits wide, so they don't read these bits of the 32-bit bus
  /* verilator lint_off UNUSEDSIGNAL */
  logic regs_unused_bits;
  /* verilator lint_on UNUSEDSIGNAL */
  assign regs_unused_bits = ^{regs.DATA_WR[31:6], regs.WSTRB[3:1]};
  assign prod_0 = tap_0_q * coeff_0;
  assign prod_1 = tap_1_q * coeff_1;
  assign prod_2 = tap_2_q * coeff_2;
  assign prod_3 = tap_3_q * coeff_3;
  assign prod_4 = tap_4_q * coeff_4;
  assign sum_nxt = 10'(prod_0 + prod_1 + prod_2 + prod_3 + prod_4);
  assign rounded_biased = 11'(sum_q) + (11'sd4);
  assign rounded = 8'(rounded_biased >>> 3);
  assign saturated = (rounded > 8'sd31) ? 6'sd31 : (rounded < -8'sd32) ? -6'sd32 : 6'(rounded);
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
      tap_4_q <= '0;
    end else if (s_xfer) begin
      tap_0_q <= data_in;
      tap_1_q <= tap_0_q;
      tap_2_q <= tap_1_q;
      tap_3_q <= tap_2_q;
      tap_4_q <= tap_3_q;
    end

  always_ff @(posedge clk)
    if (en) begin
      sum_q <= sum_nxt;
      data_out_q <= saturated;
    end

  FIR_10_3mcw6l3z_6_6_5_6_3_coeffRegs u_coeff_regs (
      .clk(clk),
      .rst_b(rst_b),
      .regs(regs),
      .COEFF_0(coeff_0),
      .COEFF_1(coeff_1),
      .COEFF_2(coeff_2),
      .COEFF_3(coeff_3),
      .COEFF_4(coeff_4)
  );

endmodule

`endif //!DEF__FIR_10_3mcw6l3z_6_6_5_6_3__

`ifndef DEF__FIR_64_hdhn9sqz_32_32_1_32_31__
`define DEF__FIR_64_hdhn9sqz_32_32_1_32_31__
`ifdef USE_INCLUDES
`include "AXI4Stream_32_4_0_4.sv"
`include "memory_bidi_32_32.sv"
`include "FIR_64_hdhn9sqz_32_32_1_32_31_coeffRegs.sv"
`endif //USE_INCLUDES

module FIR_64_hdhn9sqz_32_32_1_32_31 (
    input logic clk,
    input logic rst_b,
    AXI4Stream_32_4_0_4.inward s_axis,
    AXI4Stream_32_4_0_4.outward m_axis,
    memory_bidi_32_32.inward regs
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // accumulatorWidth = 64
  // coefficients = [-2147483648n]
  // coefficientsWidth = 32
  // inWidth = 32
  // numTaps = 1
  // outWidth = 32
  // rShift = 31
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
  logic signed [31:0] data_in;
  logic signed [31:0] tap_0_q;
  logic signed [31:0] coeff_0;
  logic signed [63:0] prod_0;
  logic signed [63:0] sum_nxt;
  logic signed [63:0] sum_q;
  logic signed [33:0] rounded;
  logic signed [64:0] rounded_biased;
  logic signed [31:0] saturated;
  logic signed [31:0] data_out_q;

  assign en = m_axis.TREADY || !valid_out_q;
  assign s_axis.TREADY = en;
  assign s_xfer = s_axis.TVALID && en;
  assign data_in = $signed(s_axis.TDATA[31:0]);
  assign prod_0 = tap_0_q * coeff_0;
  assign sum_nxt = prod_0;
  assign rounded_biased = 65'(sum_q) + (65'sd1073741824);
  assign rounded = 34'(rounded_biased >>> 31);
  assign saturated = (rounded > 34'sd2147483647) ? 32'sd2147483647 : (rounded < -34'sd2147483648) ? -32'sd2147483648 : 32'(rounded);
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
    end else if (s_xfer) begin
      tap_0_q <= data_in;
    end

  always_ff @(posedge clk)
    if (en) begin
      sum_q <= sum_nxt;
      data_out_q <= saturated;
    end

  FIR_64_hdhn9sqz_32_32_1_32_31_coeffRegs u_coeff_regs (
      .clk(clk),
      .rst_b(rst_b),
      .regs(regs),
      .COEFF_0(coeff_0)
  );

endmodule

`endif //!DEF__FIR_64_hdhn9sqz_32_32_1_32_31__

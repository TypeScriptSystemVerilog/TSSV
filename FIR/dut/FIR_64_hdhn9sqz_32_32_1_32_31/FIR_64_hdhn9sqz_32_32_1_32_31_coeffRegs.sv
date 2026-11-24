`ifndef DEF__FIR_64_hdhn9sqz_32_32_1_32_31_coeffRegs__
`define DEF__FIR_64_hdhn9sqz_32_32_1_32_31_coeffRegs__
`ifdef USE_INCLUDES
`include "memory_bidi_32_32.sv"
`endif //USE_INCLUDES

module FIR_64_hdhn9sqz_32_32_1_32_31_coeffRegs (
    input logic clk,
    input logic rst_b,
    output logic signed [31:0] COEFF_0,
    memory_bidi_32_32.inward regs
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // busAddressWidth = 32
  // busInterface = Memory
  // endianess = little
  // regDefs = 1 register, hash 09nlfjvm
  // ------------------------------------------------------------------
  logic COEFF_0_matchExpr;
  logic COEFF_0_rd_hit;
  logic COEFF_0_wr_hit;
  logic [31:0] rd_data_nxt;
  logic [31:0] rd_data_q;

  assign COEFF_0_matchExpr = regs.ADDR == 32'h0;
  assign COEFF_0_rd_hit = COEFF_0_matchExpr && regs.RE;
  assign COEFF_0_wr_hit = COEFF_0_matchExpr && regs.WE;
  always_comb begin : read_mux
    rd_data_nxt = '0;
    if (COEFF_0_rd_hit) begin
      rd_data_nxt = COEFF_0;
    end
  end
  assign regs.READY   = 1'b1;
  assign regs.DATA_RD = rd_data_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      COEFF_0 <= -32'sd2147483648;
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
      rd_data_q <= '0;
    end else if (regs.RE) begin
      rd_data_q <= rd_data_nxt;
    end

endmodule

`endif //!DEF__FIR_64_hdhn9sqz_32_32_1_32_31_coeffRegs__

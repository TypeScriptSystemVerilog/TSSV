`ifndef DEF__LFSR_1_false_16_54meqznk_44257_16__
`define DEF__LFSR_1_false_16_54meqznk_44257_16__

module LFSR_1_false_16_54meqznk_44257_16 (
    input logic clk,
    input logic rst_n,
    input logic step,
    output logic [15:0] value
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // advance = 1n
  // loadable = false
  // outWidth = 16n
  // polynomial = x^16 + x^15 + x^13 + x^4 + 1
  // seed = 44257n
  // width = 16n
  // ------------------------------------------------------------------
  logic [15:0] state_q;
  logic [15:0] state_nxt;

  assign state_nxt = {state_q[14:0], state_q[15] ^ state_q[14] ^ state_q[12] ^ state_q[3]};
  assign value = state_q;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      state_q <= 16'd44257;
    end else if (step) begin
      state_q <= state_nxt;
    end

endmodule

`endif //!DEF__LFSR_1_false_16_54meqznk_44257_16__

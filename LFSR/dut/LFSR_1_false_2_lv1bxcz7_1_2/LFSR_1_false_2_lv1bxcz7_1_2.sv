`ifndef DEF__LFSR_1_false_2_lv1bxcz7_1_2__
`define DEF__LFSR_1_false_2_lv1bxcz7_1_2__

module LFSR_1_false_2_lv1bxcz7_1_2 (
    input logic clk,
    input logic rst_n,
    input logic step,
    output logic [1:0] value
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // advance = 1n
  // loadable = false
  // outWidth = 2n
  // polynomial = x^2 + x + 1
  // seed = 1n
  // width = 2n
  // ------------------------------------------------------------------
  logic [1:0] state_q;
  logic [1:0] state_nxt;

  assign state_nxt = {state_q[0], state_q[1] ^ state_q[0]};
  assign value = state_q;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      state_q <= 2'd1;
    end else if (step) begin
      state_q <= state_nxt;
    end

endmodule

`endif //!DEF__LFSR_1_false_2_lv1bxcz7_1_2__

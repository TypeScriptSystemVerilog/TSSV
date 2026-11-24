`ifndef DEF__LFSR_40_false_33_b1a1hg7u_4886718345_33__
`define DEF__LFSR_40_false_33_b1a1hg7u_4886718345_33__

module LFSR_40_false_33_b1a1hg7u_4886718345_33 (
    input logic clk,
    input logic rst_n,
    input logic step,
    output logic [32:0] value
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // advance = 40n
  // loadable = false
  // outWidth = 33n
  // polynomial = x^33 + x^20 + 1
  // seed = 4886718345n
  // width = 33n
  // ------------------------------------------------------------------
  logic [32:0] state_q;
  logic [32:0] state_nxt;

  assign state_nxt = {
    state_q[25] ^ state_q[12],
    state_q[24] ^ state_q[11],
    state_q[23] ^ state_q[10],
    state_q[22] ^ state_q[9],
    state_q[21] ^ state_q[8],
    state_q[20] ^ state_q[7],
    state_q[19] ^ state_q[6],
    state_q[18] ^ state_q[5],
    state_q[17] ^ state_q[4],
    state_q[16] ^ state_q[3],
    state_q[15] ^ state_q[2],
    state_q[14] ^ state_q[1],
    state_q[13] ^ state_q[0],
    state_q[32] ^ state_q[19] ^ state_q[12],
    state_q[31] ^ state_q[18] ^ state_q[11],
    state_q[30] ^ state_q[17] ^ state_q[10],
    state_q[29] ^ state_q[16] ^ state_q[9],
    state_q[28] ^ state_q[15] ^ state_q[8],
    state_q[27] ^ state_q[14] ^ state_q[7],
    state_q[26] ^ state_q[13] ^ state_q[6],
    state_q[25] ^ state_q[12] ^ state_q[5],
    state_q[24] ^ state_q[11] ^ state_q[4],
    state_q[23] ^ state_q[10] ^ state_q[3],
    state_q[22] ^ state_q[9] ^ state_q[2],
    state_q[21] ^ state_q[8] ^ state_q[1],
    state_q[20] ^ state_q[7] ^ state_q[0],
    state_q[32] ^ state_q[6],
    state_q[31] ^ state_q[5],
    state_q[30] ^ state_q[4],
    state_q[29] ^ state_q[3],
    state_q[28] ^ state_q[2],
    state_q[27] ^ state_q[1],
    state_q[26] ^ state_q[0]
  };
  assign value = state_q;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      state_q <= 33'd4886718345;
    end else if (step) begin
      state_q <= state_nxt;
    end

endmodule

`endif //!DEF__LFSR_40_false_33_b1a1hg7u_4886718345_33__

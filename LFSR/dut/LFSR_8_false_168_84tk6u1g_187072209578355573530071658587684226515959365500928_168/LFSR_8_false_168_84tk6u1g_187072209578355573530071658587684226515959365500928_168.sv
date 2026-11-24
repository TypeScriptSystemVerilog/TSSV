`ifndef DEF__LFSR_8_false_168_84tk6u1g_187072209578355573530071658587684226515959365500928_168__
`define DEF__LFSR_8_false_168_84tk6u1g_187072209578355573530071658587684226515959365500928_168__

module LFSR_8_false_168_84tk6u1g_187072209578355573530071658587684226515959365500928_168 (
    input logic clk,
    input logic rst_n,
    input logic step,
    output logic [167:0] value
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // advance = 8n
  // loadable = false
  // outWidth = 168n
  // polynomial = x^168 + x^166 + x^153 + x^151 + 1
  // seed = 187072209578355573530071658587684226515959365500928n
  // width = 168n
  // ------------------------------------------------------------------
  logic [167:0] state_q;
  logic [167:0] state_nxt;

  assign state_nxt = {
    state_q[159:0],
    state_q[167] ^ state_q[165] ^ state_q[152] ^ state_q[150],
    state_q[166] ^ state_q[164] ^ state_q[151] ^ state_q[149],
    state_q[165] ^ state_q[163] ^ state_q[150] ^ state_q[148],
    state_q[164] ^ state_q[162] ^ state_q[149] ^ state_q[147],
    state_q[163] ^ state_q[161] ^ state_q[148] ^ state_q[146],
    state_q[162] ^ state_q[160] ^ state_q[147] ^ state_q[145],
    state_q[161] ^ state_q[159] ^ state_q[146] ^ state_q[144],
    state_q[160] ^ state_q[158] ^ state_q[145] ^ state_q[143]
  };
  assign value = state_q;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      state_q <= 168'd187072209578355573530071658587684226515959365500928;
    end else if (step) begin
      state_q <= state_nxt;
    end

endmodule

`endif //!DEF__LFSR_8_false_168_84tk6u1g_187072209578355573530071658587684226515959365500928_168__

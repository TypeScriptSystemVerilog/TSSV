`ifndef DEF__LFSR_16_true_16_fgfuahzn_44257_16__
`define DEF__LFSR_16_true_16_fgfuahzn_44257_16__

module LFSR_16_true_16_fgfuahzn_44257_16 (
    input logic clk,
    input logic rst_n,
    input logic step,
    input logic load,
    input logic [15:0] seed_in,
    output logic [15:0] value
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // advance = 16n
  // loadable = true
  // outWidth = 16n
  // polynomial = x^16 + x^14 + x^13 + x^11 + 1
  // seed = 44257n
  // width = 16n
  // ------------------------------------------------------------------
  logic [15:0] state_q;
  logic [15:0] cur;
  logic [15:0] state_nxt;

  assign cur = load ? seed_in : state_q;
  assign state_nxt = {
    cur[15] ^ cur[13] ^ cur[12] ^ cur[10],
    cur[14] ^ cur[12] ^ cur[11] ^ cur[9],
    cur[13] ^ cur[11] ^ cur[10] ^ cur[8],
    cur[12] ^ cur[10] ^ cur[9] ^ cur[7],
    cur[11] ^ cur[9] ^ cur[8] ^ cur[6],
    cur[10] ^ cur[8] ^ cur[7] ^ cur[5],
    cur[9] ^ cur[7] ^ cur[6] ^ cur[4],
    cur[8] ^ cur[6] ^ cur[5] ^ cur[3],
    cur[7] ^ cur[5] ^ cur[4] ^ cur[2],
    cur[6] ^ cur[4] ^ cur[3] ^ cur[1],
    cur[5] ^ cur[3] ^ cur[2] ^ cur[0],
    cur[15] ^ cur[13] ^ cur[12] ^ cur[10] ^ cur[4] ^ cur[2] ^ cur[1],
    cur[14] ^ cur[12] ^ cur[11] ^ cur[9] ^ cur[3] ^ cur[1] ^ cur[0],
    cur[15] ^ cur[12] ^ cur[11] ^ cur[8] ^ cur[2] ^ cur[0],
    cur[15] ^ cur[14] ^ cur[13] ^ cur[12] ^ cur[11] ^ cur[7] ^ cur[1],
    cur[14] ^ cur[13] ^ cur[12] ^ cur[11] ^ cur[10] ^ cur[6] ^ cur[0]
  };
  assign value = cur;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      state_q <= 16'd44257;
    end else if (step) begin
      state_q <= state_nxt;
    end

endmodule

`endif //!DEF__LFSR_16_true_16_fgfuahzn_44257_16__

// SEQ-5 Do: the doc's example verbatim. seq5_reset_tb checks it resets asynchronously.

module seq5_do (
  input  logic       clk,
  input  logic       rst_n,
  input  logic [1:0] st_nxt,
  output logic [1:0] st_q
);

localparam logic [1:0] IDLE = 2'd0;

// Do
always_ff @(posedge clk or negedge rst_n) begin : st_reg
  if (!rst_n) st_q <= IDLE;
  else        st_q <= st_nxt;
end

endmodule

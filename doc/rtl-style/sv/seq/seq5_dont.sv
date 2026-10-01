// SEQ-5 Don't: the doc's example verbatim. seq5_reset_tb shows it ignoring an async reset
// until the next clock edge, which lint doesn't catch.

module seq5_dont (
  input  logic       clk,
  input  logic       rst_n,
  input  logic [1:0] st_nxt,
  output logic [1:0] st_q
);

localparam logic [1:0] IDLE = 2'd0;

// Don't: rst_n is lowasync, but it's missing from the sensitivity list,
// so the reset only takes effect on a clock edge
always_ff @(posedge clk) begin : st_reg
  if (!rst_n) st_q <= IDLE;
  else        st_q <= st_nxt;
end

endmodule

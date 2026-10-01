// SEQ-2 default form: the same logic as seq2_inblock, with a separate always_comb.
// seq2_styles_tb checks the two behave identically.

module seq2_split (
  input  logic       clk,
  input  logic       rst_n,
  input  logic       clr,
  input  logic       inc,
  input  logic       dec,
  output logic [7:0] cnt_q,
  output logic       wrap_q
);

logic [7:0] cnt_nxt;
logic       wrap_nxt;

always_comb begin : cnt_next
  cnt_nxt  = cnt_q;
  wrap_nxt = 1'b0;
  if (clr) begin
    cnt_nxt = '0;
  end else if (inc && !dec) begin
    cnt_nxt  = cnt_q + 8'd1;
    wrap_nxt = (cnt_q == 8'hFF);
  end else if (dec && !inc) begin
    cnt_nxt = cnt_q - 8'd1;
  end
end

always_ff @(posedge clk or negedge rst_n) begin : cnt_reg
  if (!rst_n) begin
    cnt_q  <= '0;
    wrap_q <= 1'b0;
  end else begin
    cnt_q  <= cnt_nxt;
    wrap_q <= wrap_nxt;
  end
end

endmodule

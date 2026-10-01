// SEQ-2 "Also fine" form: the doc's example verbatim, next-state logic inside the always_ff.
// seq2_styles_tb checks it against seq2_split, the same logic in the default style.

module seq2_inblock (
  input  logic       clk,
  input  logic       rst_n,
  input  logic       clr,
  input  logic       inc,
  input  logic       dec,
  output logic [7:0] cnt_q,
  output logic       wrap_q
);

// Also fine: next-state logic private to this register group
always_ff @(posedge clk or negedge rst_n) begin : cnt_reg
  if (!rst_n) begin
    cnt_q  <= '0;
    wrap_q <= 1'b0;
  end else begin : cnt_next
    automatic logic [7:0] cnt_nxt  = cnt_q;
    automatic logic       wrap_nxt = 1'b0;
    if (clr) begin
      cnt_nxt = '0;
    end else if (inc && !dec) begin
      cnt_nxt  = cnt_q + 8'd1;
      wrap_nxt = (cnt_q == 8'hFF);
    end else if (dec && !inc) begin
      cnt_nxt = cnt_q - 8'd1;
    end
    cnt_q  <= cnt_nxt;
    wrap_q <= wrap_nxt;
  end
end

endmodule

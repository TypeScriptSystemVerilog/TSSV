// Drives seq2_inblock and seq2_split with the same random inputs, including async resets
// between clock edges, and fails on the first cycle their outputs differ.
module seq2_styles_tb;
  logic clk = 1'b0, rst_n = 1'b0, clr, inc, dec;
  logic [7:0] cnt_a, cnt_b;
  logic       wrap_a, wrap_b;
  int         wraps = 0;

  seq2_inblock u_inblock (.clk, .rst_n, .clr, .inc, .dec, .cnt_q(cnt_a), .wrap_q(wrap_a));
  seq2_split   u_split   (.clk, .rst_n, .clr, .inc, .dec, .cnt_q(cnt_b), .wrap_q(wrap_b));

  always #5 clk = ~clk;

  initial begin
    {clr, inc, dec} = '0;
    #12 rst_n = 1'b1;
    for (int i = 0; i < 20000; i++) begin
      @(negedge clk);
      clr = ($urandom_range(63) == 0);
      inc = $urandom_range(3) != 0;  // mostly counting up, so the counter wraps
      dec = $urandom_range(3) == 0;
      if ($urandom_range(999) == 0) begin  // async reset pulse between edges
        #2 rst_n = 1'b0;
        #1 rst_n = 1'b1;
      end
      #1;
      if (cnt_a !== cnt_b || wrap_a !== wrap_b) begin
        $display("FAIL cycle %0d: inblock cnt=%0d wrap=%0d, split cnt=%0d wrap=%0d", i, cnt_a, wrap_a, cnt_b, wrap_b);
        $fatal(1);
      end
      wraps += int'(wrap_a);
    end
    if (wraps == 0) begin
      $display("FAIL: the counter never wrapped, so wrap_q was never compared");
      $fatal(1);
    end
    $display("PASS: seq2 styles match over 20000 cycles (%0d wraps)", wraps);
    $finish;
  end
endmodule

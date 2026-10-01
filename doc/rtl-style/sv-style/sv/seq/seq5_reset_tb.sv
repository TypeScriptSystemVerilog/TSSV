// Asserts rst_n between clock edges: seq5_do must reset at once, while seq5_dont keeps
// its state until the next rising edge.
module seq5_reset_tb;
  logic       clk = 1'b0, rst_n = 1'b1;
  logic [1:0] st_nxt = 2'd3;
  logic [1:0] q_dont, q_do;

  seq5_dont u_dont (.clk, .rst_n, .st_nxt, .st_q(q_dont));
  seq5_do   u_do   (.clk, .rst_n, .st_nxt, .st_q(q_do));

  always #5 clk = ~clk;

  initial begin
    repeat (2) @(posedge clk);
    #1;
    if (q_do !== 2'd3 || q_dont !== 2'd3) begin
      $display("FAIL: both should hold 3 before reset (do=%0d dont=%0d)", q_do, q_dont);
      $fatal(1);
    end
    @(negedge clk);
    rst_n = 1'b0;  // between rising edges
    #1;
    if (q_do !== 2'd0) begin
      $display("FAIL: Do form didn't reset asynchronously (q=%0d)", q_do);
      $fatal(1);
    end
    if (q_dont !== 2'd3) begin
      $display("FAIL: expected the Don't form to hold its state until the clock edge (q=%0d)", q_dont);
      $fatal(1);
    end
    @(posedge clk);
    #1;
    if (q_dont !== 2'd0) begin
      $display("FAIL: Don't form didn't reset on the clock edge (q=%0d)", q_dont);
      $fatal(1);
    end
    $display("PASS: Do resets asynchronously; Don't waits for the clock edge");
    $finish;
  end
endmodule

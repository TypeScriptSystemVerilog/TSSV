// CI image smoke test: exercises --timing and FST tracing, the two Verilator
// features that need more than `verilator --version` to prove (FST pulls in
// lz4 and zlib at C++ compile time).
module smoke_tb;
  logic clk = 1'b0;
  logic [7:0] count = 8'd0;

  always #5 clk = ~clk;
  always_ff @(posedge clk) count <= count + 8'd1;

  initial begin
    $dumpfile("smoke.fst");
    $dumpvars(0, smoke_tb);
    #100;
    if (count != 8'd10) $fatal(1, "count = %0d, expected 10", count);
    $display("SMOKE PASS: count = %0d", count);
    $finish;
  end
endmodule

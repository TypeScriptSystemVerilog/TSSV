// ---------------------------------------------------------------------------
// tb_CDCSynchronizer — self-checking testbench for the TSSV multi-flop synchronizer
//
// Built once per configuration in sv-examples/CDCSynchronizer/tb/configs.txt with
// -DCFG_<config>. ts/test/modules/test_CDCSynchronizer.ts generates the DUTs and the two
// includes: CDCSynchronizer_tb_configs.svh (DUT name, width, stages) and
// CDCSynchronizer_tb_vectors.svh (one task per timing diagram in the spec).
// Run everything with `make -C verilatorTB cdcsynchronizer_sim`.
//
// d comes from a flop on src_clk, the source clock, which loads a random value on random
// edges. The spec's a_latency assertion checks q on every clk edge: a simulated flop never goes
// metastable, so q is exactly d delayed by `stages` clk edges.
//
// The timing diagram replays first, with clk at half src_clk's frequency and its rising edges
// aligned with src_clk's, as the spec draws it. Then the random test and the reset test run at
// three clock pairs (src_clk/clk): 10/31 ns, 31/10 ns and 10/11 ns. A 0.3 ns phase shift keeps
// the two clocks' edges from ever coinciding.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "CDCSynchronizer_tb_configs.svh"

module tb_CDCSynchronizer;

  localparam int W         = `WIDTH;
  localparam int STAGES    = `STAGES;
  localparam int ABSENT    = -2;   // vector field not in the diagram
  localparam int DONT_CARE = -1;   // vector field shown as 'x'

  // ---- clocks ----
  // Both start high, so src_clk (10 ns) rises at 10, 20, 30 ns and clk (20 ns) at 20, 40 ns.
  logic    src_clk = 1'b1;
  logic    clk     = 1'b1;
  realtime src_half  = 5.0;
  realtime clk_half  = 10.0;
  realtime clk_shift = 0.0;        // added once to clk's next half period

  initial forever begin
    #(src_half);
    src_clk = ~src_clk;
  end
  initial forever begin
    #(clk_half + clk_shift);
    clk_shift = 0.0;
    clk = ~clk;
  end

  // ---- DUT ----
  logic         rst_n = 1'b0;
  logic [W-1:0] d     = '0;
  logic [W-1:0] q;

  `CDC_DUT dut (
    .clk   (clk),
    .rst_n (rst_n),
    .d     (d),
    .q     (q)
  );

  // ---- source: a flop on src_clk that loads a random value on random edges ----
  bit random_d = 1'b0;
  always @(posedge src_clk) begin
    if (random_d && $urandom_range(0, 1) == 1) d <= W'($urandom);
  end

  // ---- assertions (spec: Assertions) ----
  int edges_since_rst = 0;         // clk edges since rst_n rose
  int checked = 0;
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) edges_since_rst <= 0;
    else        edges_since_rst <= edges_since_rst + 1;
  end
  always @(posedge clk) if (rst_n && edges_since_rst >= STAGES) checked++;

  a_latency: assert property (@(posedge clk) disable iff (!rst_n || edges_since_rst < STAGES)
    q == $past(d, STAGES))
    else $error("a_latency: q = 0x%0h, expected d from %0d clk edges ago", q, STAGES);

  int errors = 0;

  function automatic void expect_val(string ctx, logic [W-1:0] got, int exp);
    if (got !== W'(exp)) begin
      errors++;
      $display("[%0t] %s = 0x%0h, expected 0x%0h", $time, ctx, got, exp);
    end
  endfunction

  // ---- timing-diagram replay ----
  typedef struct { int d; } src_vec_t;
  typedef struct { int sync_0, q; } dst_vec_t;

  // Cycle 0 of both clocks starts at an aligned rising edge. d changes at each falling edge of
  // src_clk, and sync_0 and q are checked 1 ns after each falling edge of clk.
  task automatic run_diagram(string name, src_vec_t fv[], dst_vec_t sv[]);
    @(posedge clk);
    fork
      foreach (fv[k]) begin
        @(negedge src_clk);
        if (fv[k].d >= 0) d = W'(fv[k].d);
        else if (fv[k].d == DONT_CARE) d = W'($urandom);
      end
      foreach (sv[j]) begin
        @(negedge clk);
        #1;
        if (sv[j].sync_0 >= 0) expect_val($sformatf("diagram %s clk cycle %0d: sync_0", name, j), dut.sync_0, sv[j].sync_0);
        if (sv[j].q >= 0)      expect_val($sformatf("diagram %s clk cycle %0d: q", name, j), q, sv[j].q);
      end
    join
  endtask

  `include "CDCSynchronizer_tb_vectors.svh"

  // ---- tests ----
  task automatic set_clocks(realtime src_period, realtime clk_period);
    @(posedge clk);
    src_half  = src_period / 2.0;
    clk_half  = clk_period / 2.0;
    clk_shift = 0.3;
    repeat (3) @(posedge clk);
  endtask

  // Reset mid-run: q clears at once, and follows d again after the release
  task automatic test_reset(string ctx);
    repeat (5) @(posedge clk);
    #($urandom_range(1, 4));
    rst_n = 1'b0;
    #0.1;
    expect_val({ctx, ": q just after rst_n falls"}, q, 0);
    repeat (3) @(posedge clk);
    expect_val({ctx, ": q in reset"}, q, 0);
    @(negedge clk);
    rst_n = 1'b1;
  endtask

  task automatic run_pair(realtime src_period, realtime clk_period);
    string ctx = $sformatf("src_clk %0.0f ns, clk %0.0f ns", src_period, clk_period);
    set_clocks(src_period, clk_period);
    random_d = 1'b1;
    repeat (2000) @(posedge clk);
    test_reset(ctx);
    repeat (200) @(posedge clk);
  endtask

  // ---- sequence ----
  initial begin
    $dumpfile({"tb_CDCSynchronizer_", `CFG_NAME, ".fst"});
    $dumpvars(0, tb_CDCSynchronizer);
    repeat (3) @(posedge clk);
    @(negedge clk);
    rst_n = 1'b1;
    repeat (STAGES + 2) @(posedge clk);
    `RUN_DIAGRAMS
    run_pair(10.0, 31.0);
    run_pair(31.0, 10.0);
    run_pair(10.0, 11.0);
    if (errors == 0) begin
      $display("PASS: %s (%s): %0d clk edges checked", `CFG_NAME, `"`CDC_DUT`", checked);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d checks failed", `CFG_NAME, errors);
    end
  end

endmodule

// ---------------------------------------------------------------------------
// tb_GrayPointer — self-checking testbench for the TSSV GrayPointer
//
// Built once per configuration in sv-examples/GrayPointer/tb/configs.txt with -DCFG_<config>,
// together with GrayPointer_checks.sv. ts/test/modules/test_GrayPointer.ts generates the DUTs
// and the two includes: GrayPointer_tb_configs.svh (DUT name, width, syncStages) and
// GrayPointer_tb_vectors.svh (one task per timing diagram in the spec).
// Run everything with `make -C verilatorTB graypointer_sim`, which builds with --coverage-user
// so the covers run.
//
// Own domain: GrayPointer_checks holds the spec's assertions. Far domain: on every far_clk
// edge, far_bin_ptr must equal bin_ptr as sampled syncStages far_clk edges earlier. A simulated
// flop never goes metastable, so that's exact.
//
// The timing diagram replays first, with far_clk at half clk's frequency and its rising edges
// aligned with clk's, as the spec draws it. Then every test runs at three clock pairs
// (clk/far_clk): 10/31 ns, 31/10 ns and 10/11 ns. A 0.3 ns phase shift keeps the two clocks'
// edges from ever coinciding.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "GrayPointer_tb_configs.svh"

module tb_GrayPointer;

  localparam int W         = `WIDTH;
  localparam int SYNC      = `SYNC_STAGES;
  localparam int ABSENT    = -2;   // vector field not in the diagram
  localparam int DONT_CARE = -1;   // vector field shown as 'x'

  // ---- clocks ----
  // Both start high, so clk (10 ns) rises at 10, 20, 30 ns and far_clk (20 ns) at 20, 40 ns.
  logic    clk     = 1'b1;
  logic    far_clk = 1'b1;
  realtime clk_half   = 5.0;
  realtime far_half   = 10.0;
  realtime far_shift  = 0.0;       // added once to far_clk's next half period

  initial forever begin
    #(clk_half);
    clk = ~clk;
  end
  initial forever begin
    #(far_half + far_shift);
    far_shift = 0.0;
    far_clk = ~far_clk;
  end

  // ---- DUT ----
  logic         rst_n     = 1'b0;
  logic         far_rst_n = 1'b0;
  logic         inc       = 1'b0;
  logic [W-1:0] bin_ptr;
  logic [W-1:0] far_bin_ptr;

  `GP_DUT dut (
    .clk         (clk),
    .rst_n       (rst_n),
    .inc         (inc),
    .bin_ptr     (bin_ptr),
    .far_clk     (far_clk),
    .far_rst_n   (far_rst_n),
    .far_bin_ptr (far_bin_ptr)
  );

  // ---- own domain: the spec's assertions ----
  GrayPointer_checks #(.W(W), .INST("dut")) u_checks (
    .clk     (clk),
    .rst_n   (rst_n),
    .inc     (inc),
    .bin_ptr (bin_ptr),
    .gray_q  (dut.gray_q)
  );

  // ---- far domain: far_bin_ptr is bin_ptr from SYNC far_clk edges ago ----
  int           errors = 0;
  int           far_checked = 0;
  logic [W-1:0] hist[$];           // bin_ptr sampled at each far_clk edge since far_rst_n rose
  always @(posedge far_clk or negedge far_rst_n) begin
    if (!far_rst_n) begin
      hist.delete();
    end else begin
      if (hist.size() >= SYNC) begin
        far_checked++;
        if (far_bin_ptr !== hist[hist.size() - SYNC]) begin
          errors++;
          $display("[%0t] far_bin_ptr = %0d, expected %0d (bin_ptr %0d far_clk edges ago)",
                   $time, far_bin_ptr, hist[hist.size() - SYNC], SYNC);
        end
      end
      hist.push_back(bin_ptr);
    end
  end

  // ---- coverage (the spec's covers; needs --coverage-user) ----
  int hits_wrap = 0;
  int hits_far_skip = 0;
  c_wrap: cover property (@(posedge clk) disable iff (!rst_n) inc && bin_ptr == '1) hits_wrap++;
  // a 1-bit pointer can't skip a value (the spec lists this cover for width 2 and up)
  if (W >= 2) begin : g_far_skip
    c_far_skip: cover property (@(posedge far_clk) disable iff (!far_rst_n)
      W'(far_bin_ptr - $past(far_bin_ptr)) > W'(1)) hits_far_skip++;
  end

  function automatic void expect_val(string ctx, logic [W-1:0] got, int exp);
    if (got !== W'(exp)) begin
      errors++;
      $display("[%0t] %s = %0d, expected %0d", $time, ctx, got, exp);
    end
  endfunction

  // ---- timing-diagram replay ----
  typedef struct { int inc, bin_ptr, gray_q; } own_vec_t;
  typedef struct { int sync_0, far_bin_ptr; } far_vec_t;

  // Cycle 0 of both clocks starts at an aligned rising edge. inc changes at each falling edge of
  // clk; each clock's lanes are checked 1 ns after its falling edges.
  task automatic run_diagram(string name, own_vec_t fv[], far_vec_t sv[]);
    @(posedge far_clk);
    fork
      foreach (fv[k]) begin
        @(negedge clk);
        if (fv[k].inc >= 0) inc = 1'(fv[k].inc);
        else inc = 1'(fv[k].inc == DONT_CARE ? $urandom_range(0, 1) : 0);
        #1;
        if (fv[k].bin_ptr >= 0) expect_val($sformatf("diagram %s clk cycle %0d: bin_ptr", name, k), bin_ptr, fv[k].bin_ptr);
        if (fv[k].gray_q >= 0)  expect_val($sformatf("diagram %s clk cycle %0d: gray_q", name, k), dut.gray_q, fv[k].gray_q);
      end
      foreach (sv[j]) begin
        @(negedge far_clk);
        #1;
        if (sv[j].sync_0 >= 0)      expect_val($sformatf("diagram %s far_clk cycle %0d: sync_0", name, j), dut.u_sync.sync_0, sv[j].sync_0);
        if (sv[j].far_bin_ptr >= 0) expect_val($sformatf("diagram %s far_clk cycle %0d: far_bin_ptr", name, j), far_bin_ptr, sv[j].far_bin_ptr);
      end
    join
    inc = 1'b0;
  endtask

  `include "GrayPointer_tb_vectors.svh"

  // ---- tests ----
  task automatic set_clocks(realtime clk_period, realtime far_period);
    @(posedge far_clk);
    clk_half  = clk_period / 2.0;
    far_half  = far_period / 2.0;
    far_shift = 0.3;
    repeat (3) @(posedge far_clk);
  endtask

  // Count and wrap: inc on every edge until the pointer has wrapped at least four times
  task automatic test_count_wrap();
    @(negedge clk);
    inc = 1'b1;
    repeat (4 * (1 << W) + 3) @(negedge clk);
    inc = 1'b0;
    repeat (SYNC + 3) @(posedge far_clk);
  endtask

  // Random: inc on half the clk edges
  task automatic test_random(int cycles);
    repeat (cycles) begin
      @(negedge clk);
      inc = 1'($urandom_range(0, 1));
    end
    @(negedge clk);
    inc = 1'b0;
    repeat (SYNC + 3) @(posedge far_clk);
  endtask

  // Reset: both resets together mid-run, released one after the other; both pointers return to 0
  task automatic test_reset(string ctx);
    @(negedge clk);
    inc = 1'b0;
    #($urandom_range(1, 4));
    rst_n     = 1'b0;
    far_rst_n = 1'b0;
    #0.1;
    expect_val({ctx, ": bin_ptr in reset"}, bin_ptr, 0);
    expect_val({ctx, ": far_bin_ptr in reset"}, far_bin_ptr, 0);
    repeat (3) @(posedge clk);
    @(negedge clk);
    rst_n = 1'b1;
    repeat (2) @(posedge far_clk);
    @(negedge far_clk);
    far_rst_n = 1'b1;
    repeat (SYNC + 2) @(posedge far_clk);
    expect_val({ctx, ": far_bin_ptr after reset"}, far_bin_ptr, 0);
  endtask

  task automatic run_pair(realtime clk_period, realtime far_period);
    string ctx = $sformatf("clk %0.0f ns, far_clk %0.0f ns", clk_period, far_period);
    set_clocks(clk_period, far_period);
    test_count_wrap();
    test_random(2000);
    test_reset(ctx);
    test_random(200);
  endtask

  // ---- sequence ----
  initial begin
    $dumpfile({"tb_GrayPointer_", `CFG_NAME, ".fst"});
    $dumpvars(0, tb_GrayPointer);
    repeat (3) @(posedge far_clk);
    @(negedge clk);
    rst_n = 1'b1;
    @(negedge far_clk);
    far_rst_n = 1'b1;
    repeat (SYNC + 2) @(posedge far_clk);
    `RUN_DIAGRAMS
    run_pair(10.0, 31.0);
    run_pair(31.0, 10.0);
    run_pair(10.0, 11.0);
    if (hits_wrap == 0) begin
      errors++;
      $display("cover c_wrap was never hit");
    end
    if (W >= 2 && hits_far_skip == 0) begin
      errors++;
      $display("cover c_far_skip was never hit");
    end
    if (errors == 0) begin
      $display("PASS: %s (%s): %0d far_clk edges checked; covers c_wrap %0d, c_far_skip %0d",
               `CFG_NAME, `"`GP_DUT`", far_checked, hits_wrap, hits_far_skip);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d checks failed", `CFG_NAME, errors);
    end
  end

endmodule

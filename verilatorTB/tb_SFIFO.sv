// ---------------------------------------------------------------------------
// tb_SFIFO — self-checking testbench for the TSSV show-ahead SFIFO
//
// Built once per configuration in sv-examples/SFIFO/tb/configs.txt with
// -DCFG_<config>. ts/test/modules/test_SFIFO.ts generates the DUTs and the two
// includes: SFIFO_tb_configs.svh (DUT name, depth, port options) and
// SFIFO_tb_vectors.svh (one task per timing diagram in the spec).
// Run everything with `make -C verilatorTB sfifo_sim`.
//
// Every cycle, a queue reference model checks empty, full, curr_depth, the
// almost flags and, while the FIFO is not empty, pop_data. On top of that:
// - the spec's Test Plan rows run as directed tests
// - this configuration's timing diagrams replay cycle for cycle against the
//   values the diagram shows
// - a randomized phase mixes pushes, pops and threshold changes
//
// Timing: inputs change just after each falling edge and outputs are checked
// 1 ns later, so cycle k of a diagram is the cycle starting at rising edge k.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "SFIFO_tb_configs.svh"

module tb_SFIFO;

  localparam int DW        = 8;
  localparam int DEPTH     = `DEPTH;
  localparam int CW        = $clog2(DEPTH + 1);  // curr_depth and threshold width
  localparam int ABSENT    = -2;                 // vector field not in the diagram
  localparam int DONT_CARE = -1;                 // vector field shown as 'x'

  // ---- DUT connections ----
  logic          clk = 1'b0;
  logic          rst_n = 1'b0;
  logic [DW-1:0] push_data = '0;
  logic [DW-1:0] pop_data;
  logic          empty, full;
  logic [CW-1:0] curr_depth;
  logic          push_en = 1'b0, pop_en = 1'b0;    // simultPushPop = true
  logic          en = 1'b0, push1_pop0 = 1'b0;     // simultPushPop = false
  logic [CW-1:0] almost_full_depth = '0, almost_empty_depth = '0;
  logic          almost_full, almost_empty;

  `SFIFO_DUT dut (
    .clk        (clk),
    .rst_n      (rst_n),
    .push_data  (push_data),
    .pop_data   (pop_data),
    .empty      (empty),
    .full       (full),
`ifdef SIMULT
    .push_en    (push_en),
    .pop_en     (pop_en),
`else
    .en         (en),
    .push1_pop0 (push1_pop0),
`endif
`ifdef ALMOST_FULL
    .almost_full_depth (almost_full_depth),
    .almost_full       (almost_full),
`endif
`ifdef ALMOST_EMPTY
    .almost_empty_depth (almost_empty_depth),
    .almost_empty       (almost_empty),
`endif
    .curr_depth (curr_depth)
  );

  always #5 clk = ~clk;

  // ---- reference model ----
  logic [DW-1:0] model[$];
  int            errors = 0;
  int            checks = 0;

`ifdef SIMULT
  wire push_req = push_en;
  wire pop_req  = pop_en;
`else
  wire push_req = en && push1_pop0;
  wire pop_req  = en && !push1_pop0;
`endif

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      model.delete();
    end else begin
      // both decisions use the count before this edge: a full FIFO drops a push even
      // when it pops in the same cycle
      automatic bit push_ok = push_req && (model.size() < DEPTH);
      automatic bit pop_ok  = pop_req && (model.size() > 0);
      if (pop_ok) void'(model.pop_front());
      if (push_ok) model.push_back(push_data);
    end
  end

  function automatic void fail(string ctx, string what, int got, int exp);
    errors++;
    $display("[%0t] %s: %s = %0d (0x%0h), expected %0d (0x%0h)", $time, ctx, what, got, got, exp, exp);
  endfunction

  function automatic void expect_eq(string ctx, string what, int got, int exp);
    checks++;
    if (got != exp) fail(ctx, what, got, exp);
  endfunction

  // compare every output against the model
  function automatic void check_model(string ctx);
    int n = model.size();
    expect_eq(ctx, "empty", int'(empty), int'(n == 0));
    expect_eq(ctx, "full", int'(full), int'(n == DEPTH));
    expect_eq(ctx, "curr_depth", int'(curr_depth), n);
    if (n > 0) expect_eq(ctx, "pop_data", int'(pop_data), int'(model[0]));
`ifdef ALMOST_FULL
    expect_eq(ctx, "almost_full", int'(almost_full), int'(n >= int'(almost_full_depth)));
`endif
`ifdef ALMOST_EMPTY
    expect_eq(ctx, "almost_empty", int'(almost_empty), int'(n <= int'(almost_empty_depth)));
`endif
  endfunction

  // check this cycle's outputs, then advance to the next falling edge
  task automatic tick(string ctx);
    #1 check_model(ctx);
    @(negedge clk);
  endtask

  // ---- stimulus helpers: set this cycle's inputs ----
  function automatic void drive(bit push, bit pop, logic [DW-1:0] data);
`ifdef SIMULT
    push_en = push;
    pop_en  = pop;
`else
    if (push && pop) $fatal(1, "single-port FIFO cannot push and pop in one cycle");
    en         = push || pop;
    push1_pop0 = push ? 1'b1 : (pop ? 1'b0 : 1'($urandom));
`endif
    push_data = push ? data : DW'($urandom);
  endfunction

  task automatic push(string ctx, logic [DW-1:0] data);
    drive(1'b1, 1'b0, data);
    tick(ctx);
  endtask

  task automatic pop(string ctx);
    drive(1'b0, 1'b1, '0);
    tick(ctx);
  endtask

  task automatic idle(string ctx);
    drive(1'b0, 1'b0, '0);
    tick(ctx);
  endtask

  task automatic reset();
    drive(1'b0, 1'b0, '0);
    rst_n = 1'b0;
    tick("reset");
    tick("reset");
    rst_n = 1'b1;
    tick("reset release");
  endtask

  task automatic set_thresholds(int af, int ae);
    almost_full_depth  = CW'(af);
    almost_empty_depth = CW'(ae);
  endtask

  // ---- Test Plan rows ----

  // Show-ahead: a pushed word is on pop_data the cycle empty deasserts, with no pop
  task automatic test_show_ahead();
    reset();
    push("show-ahead", 8'h5A);
    drive(1'b0, 1'b0, '0);
    #1;
    expect_eq("show-ahead", "empty", int'(empty), 0);
    expect_eq("show-ahead", "pop_data", int'(pop_data), 'h5A);
    tick("show-ahead");
  endtask

  // Fill to full (and one dropped push), then drain to empty (and one ignored pop)
  task automatic test_fill_drain();
    reset();
    for (int i = 0; i < DEPTH; i++) push("fill", DW'(8'h10 + i));
    expect_eq("fill", "full", int'(full), 1);
    push("fill: push while full", 8'hEE);
    expect_eq("fill", "curr_depth", int'(curr_depth), DEPTH);
    for (int i = 0; i < DEPTH; i++) pop("drain");
    expect_eq("drain", "empty", int'(empty), 1);
    pop("drain: pop while empty");
    expect_eq("drain", "curr_depth", int'(curr_depth), 0);
  endtask

`ifdef SIMULT
  // Simultaneous push/pop at count 0, 1, mid and full
  task automatic simult_at(int count);
    string ctx = $sformatf("simultaneous push/pop at count %0d", count);
    int exp_count;
    reset();
    for (int i = 0; i < count; i++) push(ctx, DW'(8'h20 + i));
    drive(1'b1, 1'b1, 8'hC3);
    tick(ctx);
    // empty: the pop is ignored; full: the push is ignored; otherwise net zero
    exp_count = (count == 0) ? 1 : (count == DEPTH) ? DEPTH - 1 : count;
    drive(1'b0, 1'b0, '0);
    #1;
    expect_eq(ctx, "curr_depth", int'(curr_depth), exp_count);
    // the pushed word becomes the head unless the push was dropped because the FIFO was full
    if (count <= 1 && count < DEPTH) expect_eq(ctx, "pop_data", int'(pop_data), 'hC3);
    tick(ctx);
  endtask

  task automatic test_simultaneous();
    simult_at(0);
    simult_at(1);
    simult_at(DEPTH / 2);
    simult_at(DEPTH);
    // back-to-back simultaneous push/pop from half full keeps streaming in order
    reset();
    for (int i = 0; i < DEPTH / 2; i++) push("streaming", DW'(8'h30 + i));
    for (int i = 0; i < 4 * DEPTH; i++) begin
      drive(1'b1, 1'b1, DW'(8'h40 + i));
      tick("streaming");
    end
  endtask
`endif

  // Fill then drain, checking flags against the model every cycle
  task automatic fill_drain(string ctx);
    reset();
    for (int i = 0; i <= DEPTH; i++) push(ctx, DW'($urandom));
    for (int i = 0; i <= DEPTH; i++) pop(ctx);
  endtask

`ifdef ALMOST_FULL
  `define HAS_THRESHOLDS
`elsif ALMOST_EMPTY
  `define HAS_THRESHOLDS
`endif

`ifdef HAS_THRESHOLDS
  task automatic test_thresholds();
    // spec Test Plan: almost_full_depth = depth - 2, almost_empty_depth = 2
    set_thresholds(DEPTH - 2, 2);
    fill_drain("thresholds");
    // boundaries: almost_full_depth = depth tracks full; almost_empty_depth = 0 tracks empty
    set_thresholds(DEPTH, 0);
    reset();
    for (int i = 0; i <= DEPTH; i++) begin
      drive(1'b1, 1'b0, DW'($urandom));
      #1 boundary_check();
      tick("boundaries");
    end
    for (int i = 0; i <= DEPTH; i++) begin
      drive(1'b0, 1'b1, '0);
      #1 boundary_check();
      tick("boundaries");
    end
    // every representable threshold, including values above depth
    for (int t = 0; t < (1 << CW); t++) begin
      set_thresholds(t, t);
      fill_drain($sformatf("threshold sweep %0d", t));
    end
  endtask

  function automatic void boundary_check();
`ifdef ALMOST_FULL
    expect_eq("boundaries", "almost_full vs full", int'(almost_full), int'(full));
`endif
`ifdef ALMOST_EMPTY
    expect_eq("boundaries", "almost_empty vs empty", int'(almost_empty), int'(empty));
`endif
  endfunction
`endif

  // Random pushes and pops in fill-biased, drain-biased and balanced phases
  task automatic test_random(int cycles);
    reset();
    for (int i = 0; i < cycles; i++) begin
      int phase = (i / 64) % 3;     // 0: fill-biased, 1: drain-biased, 2: balanced
      bit p, q;
      if (i % 50 == 0) set_thresholds(int'($urandom_range(0, (1 << CW) - 1)), int'($urandom_range(0, (1 << CW) - 1)));
      p = ($urandom_range(0, 99) < (phase == 0 ? 75 : phase == 1 ? 25 : 50));
      q = ($urandom_range(0, 99) < (phase == 1 ? 75 : phase == 0 ? 25 : 50));
`ifndef SIMULT
      if (p && q) begin
        if ($urandom_range(0, 1) == 1) p = 1'b0;
        else q = 1'b0;
      end
`endif
      drive(p, q, DW'($urandom));
      tick("random");
    end
  endtask

  // ---- timing-diagram replay ----
  typedef struct {
    int rst_n, push_en, pop_en, en, push1_pop0, push_data, almost_full_depth, almost_empty_depth;
    int pop_data, empty, full, curr_depth, almost_full, almost_empty;
  } vec_t;

  // input field: ABSENT keeps the default, DONT_CARE drives a random value
  function automatic int in_val(int v, int dflt, int width);
    if (v == ABSENT) return dflt;
    if (v == DONT_CARE) return int'($urandom_range(0, (1 << width) - 1));
    return v;
  endfunction

  function automatic void expect_vec(string ctx, string what, int got, int v);
    if (v >= 0) expect_eq(ctx, what, got, v);
  endfunction

  task automatic run_vectors(string name, vec_t v[]);
    foreach (v[k]) begin
      string ctx = $sformatf("diagram %s cycle %0d", name, k);
      rst_n              = 1'(in_val(v[k].rst_n, 1, 1));
      push_en            = 1'(in_val(v[k].push_en, 0, 1));
      pop_en             = 1'(in_val(v[k].pop_en, 0, 1));
      en                 = 1'(in_val(v[k].en, 0, 1));
      push1_pop0         = 1'(in_val(v[k].push1_pop0, 0, 1));
      push_data          = DW'(in_val(v[k].push_data, int'($urandom_range(0, 255)), DW));
      almost_full_depth  = CW'(in_val(v[k].almost_full_depth, int'(almost_full_depth), CW));
      almost_empty_depth = CW'(in_val(v[k].almost_empty_depth, int'(almost_empty_depth), CW));
      #1;
      expect_vec(ctx, "empty", int'(empty), v[k].empty);
      expect_vec(ctx, "full", int'(full), v[k].full);
      expect_vec(ctx, "curr_depth", int'(curr_depth), v[k].curr_depth);
      if (v[k].pop_data >= 0) expect_eq(ctx, "pop_data", int'(pop_data), v[k].pop_data);
`ifdef ALMOST_FULL
      expect_vec(ctx, "almost_full", int'(almost_full), v[k].almost_full);
`endif
`ifdef ALMOST_EMPTY
      expect_vec(ctx, "almost_empty", int'(almost_empty), v[k].almost_empty);
`endif
      tick(ctx);
    end
  endtask

  `include "SFIFO_tb_vectors.svh"

  // ---- sequence ----
  initial begin
    $dumpfile({"tb_SFIFO_", `CFG_NAME, ".fst"});
    $dumpvars(0, tb_SFIFO);
    @(negedge clk);
    test_show_ahead();
    test_fill_drain();
`ifdef SIMULT
    test_simultaneous();
`endif
`ifdef HAS_THRESHOLDS
    test_thresholds();
`endif
    `RUN_DIAGRAMS
    test_random(3000);
    if (errors == 0) begin
      $display("PASS: %s (%s): %0d checks", `CFG_NAME, `"`SFIFO_DUT`", checks);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d of %0d checks failed", `CFG_NAME, errors, checks);
    end
  end

endmodule

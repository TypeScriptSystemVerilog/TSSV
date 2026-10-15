// ---------------------------------------------------------------------------
// tb_AFIFO — self-checking testbench for the TSSV dual-clock show-ahead FIFO
//
// Built once per configuration in sv-examples/AFIFO/tb/configs.txt with -DCFG_<config>,
// together with GrayPointer_checks.sv. ts/test/modules/test_AFIFO.ts generates the DUTs and
// the two includes: AFIFO_tb_configs.svh (DUT name, width, depth, syncStages, flags) and
// AFIFO_tb_vectors.svh (one task per timing diagram in the spec).
// Run everything with `make -C verilatorTB afifo_sim`, which builds with --coverage-user so the
// covers run.
//
// A queue reference model checks every popped word, and pop_data on every rd_clk cycle while
// the FIFO isn't empty. The spec's assertions (Assertions) check the status in each domain,
// against the true fill count across domains, and the caller rules. GrayPointer_checks runs
// GrayPointer's assertions on both pointers. Each cover must be hit by the end.
//
// The timing diagrams replay first, with rd_clk at half wr_clk's frequency and its rising
// edges aligned with wr_clk's, as the spec draws them. Then every test runs at three clock
// pairs (wr_clk/rd_clk): 10/31 ns (fast writer), 31/10 ns (fast reader) and 10/11 ns
// (near-equal, drifting phase). A 0.3 ns phase shift keeps the two clocks' edges from ever
// coinciding.
//
// Inputs change at falling edges. full and empty are combinational from flops of their own
// clock, so the value seen at a falling edge holds until the next rising edge: the producer
// and consumer know at the falling edge whether their push or pop will be accepted.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "AFIFO_tb_configs.svh"

module tb_AFIFO;

  localparam int DW        = `DATA_WIDTH;
  localparam int DEPTH     = `DEPTH;
  localparam int SYNC      = `SYNC_STAGES;
  localparam int AW        = $clog2(DEPTH);
  localparam int P         = AW + 1;     // pointer and count width
  localparam int ABSENT    = -2;         // vector field not in the diagram
  localparam int DONT_CARE = -1;         // vector field shown as 'x'

  // ---- clocks ----
  // Both start high, so wr_clk (10 ns) rises at 10, 20, 30 ns and rd_clk (20 ns) at 20, 40 ns.
  logic    wr_clk = 1'b1;
  logic    rd_clk = 1'b1;
  realtime wr_half  = 5.0;
  realtime rd_half  = 10.0;
  realtime rd_shift = 0.0;               // added once to rd_clk's next half period

  initial forever begin
    #(wr_half);
    wr_clk = ~wr_clk;
  end
  initial forever begin
    #(rd_half + rd_shift);
    rd_shift = 0.0;
    rd_clk = ~rd_clk;
  end

  // ---- DUT ----
  logic          wr_rst_n = 1'b0;
  logic          rd_rst_n = 1'b0;
  logic          push_en = 1'b0;
  logic [DW-1:0] push_data = '0;
  logic          full;
  logic [P-1:0]  wr_curr_depth;
  logic          pop_en = 1'b0;
  logic [DW-1:0] pop_data;
  logic          empty;
  logic [P-1:0]  rd_curr_depth;
  logic [P-1:0]  almost_full_depth = '0;
  logic [P-1:0]  almost_empty_depth = '0;
  logic          almost_full;
  logic          almost_empty;

  `AFIFO_DUT dut (
    .wr_clk             (wr_clk),
    .wr_rst_n           (wr_rst_n),
    .push_en            (push_en),
    .push_data          (push_data),
    .full               (full),
    .wr_curr_depth      (wr_curr_depth),
    .rd_clk             (rd_clk),
    .rd_rst_n           (rd_rst_n),
    .pop_en             (pop_en),
    .pop_data           (pop_data),
    .empty              (empty),
`ifdef HAS_FLAGS
    .almost_full_depth  (almost_full_depth),
    .almost_full        (almost_full),
    .almost_empty_depth (almost_empty_depth),
    .almost_empty       (almost_empty),
`endif
    .rd_curr_depth      (rd_curr_depth)
  );
`ifndef HAS_FLAGS
  assign almost_full  = 1'b0;
  assign almost_empty = 1'b0;
`endif

  // ---- reference model ----
  logic [DW-1:0] model[$];
  int pushes = 0;
  int pops   = 0;
  int checks = 0;
  int errors = 0;

  always @(posedge wr_clk) begin
    if (wr_rst_n && push_en && !full) begin
      model.push_back(push_data);
      pushes++;
    end
  end

  // Every rd_clk cycle while not empty, pop_data is the oldest word; a pop removes it
  always @(posedge rd_clk) begin
    if (rd_rst_n && !empty) begin
      checks++;
      if (model.size() == 0) begin
        errors++;
        $display("[%0t] empty is low, but the reference model holds no words", $time);
      end else begin
        if (pop_data !== model[0]) begin
          errors++;
          $display("[%0t] pop_data = 0x%0h, expected 0x%0h", $time, pop_data, model[0]);
        end
        if (pop_en) begin
          void'(model.pop_front());
          pops++;
        end
      end
    end
  end

  // ---- assertions (spec: Assertions) ----
  wire [P-1:0] true_cnt = P'(dut.wr_ptr_q - dut.rd_ptr_q);
  wire         both_out = wr_rst_n && rd_rst_n;

  // write domain
  a_wr_cnt_max: assert property (@(posedge wr_clk) disable iff (!wr_rst_n) wr_curr_depth <= P'(DEPTH))
    else $error("a_wr_cnt_max: wr_curr_depth = %0d", wr_curr_depth);
  a_full_cnt: assert property (@(posedge wr_clk) disable iff (!wr_rst_n) full == (wr_curr_depth == P'(DEPTH)))
    else $error("a_full_cnt: full = %0b, wr_curr_depth = %0d", full, wr_curr_depth);
  a_wr_cnt_step: assert property (@(posedge wr_clk) disable iff (!wr_rst_n)
    wr_curr_depth <= $past(wr_curr_depth) + $past(dut.push_fire))
    else $error("a_wr_cnt_step: wr_curr_depth went from %0d to %0d", $past(wr_curr_depth), wr_curr_depth);

  // read domain
  a_rd_cnt_max: assert property (@(posedge rd_clk) disable iff (!rd_rst_n) rd_curr_depth <= P'(DEPTH))
    else $error("a_rd_cnt_max: rd_curr_depth = %0d", rd_curr_depth);
  a_empty_cnt: assert property (@(posedge rd_clk) disable iff (!rd_rst_n) empty == (rd_curr_depth == '0))
    else $error("a_empty_cnt: empty = %0b, rd_curr_depth = %0d", empty, rd_curr_depth);
  a_head_hold: assert property (@(posedge rd_clk) disable iff (!rd_rst_n)
    !empty && !pop_en |=> !empty && $stable(pop_data))
    else $error("a_head_hold: the head changed or disappeared without a pop");
  a_rd_cnt_step: assert property (@(posedge rd_clk) disable iff (!rd_rst_n)
    $past(rd_curr_depth) <= rd_curr_depth + $past(dut.pop_fire))
    else $error("a_rd_cnt_step: rd_curr_depth went from %0d to %0d", $past(rd_curr_depth), rd_curr_depth);

  // across domains (simulation only)
  a_wr_conservative: assert property (@(posedge wr_clk) disable iff (!both_out) true_cnt <= wr_curr_depth)
    else $error("a_wr_conservative: true_cnt %0d > wr_curr_depth %0d", true_cnt, wr_curr_depth);
  a_rd_conservative: assert property (@(posedge rd_clk) disable iff (!both_out) rd_curr_depth <= true_cnt)
    else $error("a_rd_conservative: rd_curr_depth %0d > true_cnt %0d", rd_curr_depth, true_cnt);
  a_true_cnt_max: assert property (@(posedge wr_clk) disable iff (!both_out) true_cnt <= P'(DEPTH))
    else $error("a_true_cnt_max: true_cnt = %0d", true_cnt);
  a_no_overwrite: assert property (@(posedge wr_clk) disable iff (!both_out) dut.push_fire |-> true_cnt < P'(DEPTH))
    else $error("a_no_overwrite: a push with true_cnt = %0d", true_cnt);
  a_rd_latency: assert property (@(posedge rd_clk) disable iff (!both_out)
    empty && true_cnt != '0 |-> ##[1:SYNC+2] !empty)
    else $error("a_rd_latency: a pushed word didn't reach pop_data within %0d rd_clk edges", SYNC + 2);
  a_wr_latency: assert property (@(posedge wr_clk) disable iff (!both_out)
    full && true_cnt < P'(DEPTH) |-> ##[1:SYNC+1] !full)
    else $error("a_wr_latency: a pop didn't free its word within %0d wr_clk edges", SYNC + 1);

  // caller rules
  a_no_push_in_reset: assert property (@(posedge wr_clk) disable iff (!wr_rst_n) !rd_rst_n |-> !push_en)
    else $error("a_no_push_in_reset: a push while rd_rst_n is low");
  a_no_pop_in_reset: assert property (@(posedge rd_clk) disable iff (!rd_rst_n) !wr_rst_n |-> !pop_en)
    else $error("a_no_pop_in_reset: a pop while wr_rst_n is low");

`ifdef HAS_FLAGS
  // Test Plan: each almost flag matches its own domain's count and threshold
  a_almost_full: assert property (@(posedge wr_clk) disable iff (!wr_rst_n)
    almost_full == (wr_curr_depth >= almost_full_depth))
    else $error("a_almost_full: almost_full = %0b, wr_curr_depth %0d, threshold %0d", almost_full, wr_curr_depth, almost_full_depth);
  a_almost_empty: assert property (@(posedge rd_clk) disable iff (!rd_rst_n)
    almost_empty == (rd_curr_depth <= almost_empty_depth))
    else $error("a_almost_empty: almost_empty = %0b, rd_curr_depth %0d, threshold %0d", almost_empty, rd_curr_depth, almost_empty_depth);
`endif

  // GrayPointer's assertions (own domain and both resets), on both pointers
  GrayPointer_checks #(.W(P), .INST("u_wr_ptr")) u_wr_ptr_checks (
    .clk (wr_clk), .rst_n (wr_rst_n), .inc (dut.push_fire), .bin_ptr (dut.wr_ptr_q), .gray_q (dut.u_wr_ptr.gray_q),
    .far_clk (rd_clk), .far_rst_n (rd_rst_n)
  );
  GrayPointer_checks #(.W(P), .INST("u_rd_ptr")) u_rd_ptr_checks (
    .clk (rd_clk), .rst_n (rd_rst_n), .inc (dut.pop_fire), .bin_ptr (dut.rd_ptr_q), .gray_q (dut.u_rd_ptr.gray_q),
    .far_clk (wr_clk), .far_rst_n (wr_rst_n)
  );

  // ---- coverage (spec: Coverage; needs --coverage-user) ----
  int hits_full = 0, hits_rd_sees_full = 0, hits_held_push = 0, hits_back_to_back = 0;
  int hits_empty_gap = 0, hits_ptr_wrap = 0;
  int hits_af_rose = 0, hits_af_fell = 0, hits_ae_rose = 0, hits_ae_fell = 0;

  c_full: cover property (@(posedge wr_clk) disable iff (!wr_rst_n) $rose(full)) hits_full++;
  c_rd_sees_full: cover property (@(posedge rd_clk) disable iff (!rd_rst_n) rd_curr_depth == P'(DEPTH)) hits_rd_sees_full++;
  c_held_push: cover property (@(posedge wr_clk) disable iff (!wr_rst_n)
    push_en && full ##1 push_en && !full) hits_held_push++;
  c_back_to_back: cover property (@(posedge rd_clk) disable iff (!rd_rst_n)
    dut.pop_fire ##1 dut.pop_fire) hits_back_to_back++;
  c_empty_gap: cover property (@(posedge rd_clk) disable iff (!both_out)
    $rose(empty) && true_cnt != '0) hits_empty_gap++;
  c_ptr_wrap: cover property (@(posedge wr_clk) disable iff (!wr_rst_n) $changed(dut.wr_ptr_q[P-1])) hits_ptr_wrap++;
`ifdef HAS_FLAGS
  c_almost_full_rose: cover property (@(posedge wr_clk) disable iff (!wr_rst_n) $rose(almost_full)) hits_af_rose++;
  c_almost_full_fell: cover property (@(posedge wr_clk) disable iff (!wr_rst_n) $fell(almost_full)) hits_af_fell++;
  c_almost_empty_rose: cover property (@(posedge rd_clk) disable iff (!rd_rst_n) $rose(almost_empty)) hits_ae_rose++;
  c_almost_empty_fell: cover property (@(posedge rd_clk) disable iff (!rd_rst_n) $fell(almost_empty)) hits_ae_fell++;
`endif

  task automatic expect_cover(string name, int hits);
    if (hits == 0) begin
      errors++;
      $display("cover %s was never hit", name);
    end
  endtask

  // ---- helpers ----
  function automatic void expect_val(string ctx, logic [DW-1:0] got, int exp);
    checks++;
    if (got !== DW'(exp)) begin
      errors++;
      $display("[%0t] %s = 0x%0h, expected 0x%0h", $time, ctx, got, exp);
    end
  endfunction

  // a random word of any width, built 32 bits at a time
  function automatic logic [DW-1:0] rand_data();
    logic [DW-1:0] d = '0;
    for (int i = 0; i < DW; i += 32) d = (d << 32) | DW'($urandom);
    return d;
  endfunction

  // input field: ABSENT drives 0, DONT_CARE a random value
  function automatic int in_val(int v, int width);
    if (v == ABSENT) return 0;
    if (v == DONT_CARE) return int'($urandom_range(0, (1 << width) - 1));
    return v;
  endfunction

  // ---- producer and consumer threads, active while traffic_on ----
  bit traffic_on = 1'b0;
  bit stop_push  = 1'b0;     // offer no new words; a held word is still pushed
  bit hold_words = 1'b1;     // 1: valid/ready, a word is offered until accepted; 0: dropped if full
  int push_pct   = 0;
  int pop_pct    = 0;
  bit offering   = 1'b0;     // a word is on push_data
  bit will_push  = 1'b0;     // the word on push_data is accepted at the next rising edge

  always @(negedge wr_clk) begin
    if (traffic_on) begin
      if (will_push || (offering && !hold_words)) offering = 1'b0;
      if (!offering && !stop_push && $urandom_range(0, 99) < push_pct) begin
        offering  = 1'b1;
        push_data = rand_data();
      end
      push_en   = offering;
      will_push = offering && !full;
    end
  end

  always @(negedge rd_clk) begin
    if (traffic_on) pop_en = ($urandom_range(0, 99) < pop_pct);
  end

  // thresholds change every 50 cycles of their own clock, while thresh_random
  bit thresh_random = 1'b0;
  int wr_cycles = 0;
  int rd_cycles = 0;
  always @(negedge wr_clk) begin
    wr_cycles++;
    if (thresh_random && wr_cycles % 50 == 0) almost_full_depth = P'($urandom);
  end
  always @(negedge rd_clk) begin
    rd_cycles++;
    if (thresh_random && rd_cycles % 50 == 0) almost_empty_depth = P'($urandom);
  end

  // Settled: nothing in flight, so both sides agree
  task automatic settle();
    repeat (SYNC + 3) @(posedge rd_clk);
    repeat (SYNC + 3) @(posedge wr_clk);
  endtask

  // Stop pushing, pop everything, and wait until the FIFO is empty with both counts at 0
  task automatic drain(string ctx);
    int guard = 0;
    stop_push = 1'b1;
    pop_pct   = 100;
    while (offering || model.size() != 0 || !empty || wr_curr_depth != '0) begin
      @(posedge rd_clk);
      if (++guard > 100 * DEPTH + 1000) begin
        errors++;
        $display("[%0t] %s: the FIFO didn't drain (model %0d words, empty %0b, wr_curr_depth %0d)",
                 $time, ctx, model.size(), empty, wr_curr_depth);
        break;
      end
    end
    @(negedge wr_clk);
    traffic_on = 1'b0;
    push_en    = 1'b0;
    @(negedge rd_clk);
    pop_en     = 1'b0;
    stop_push  = 1'b0;
    settle();
  endtask

  // Run the threads for `cycles` rd_clk cycles, then drain
  task automatic traffic(string ctx, int cycles, int push_p, int pop_p, bit hold);
    push_pct   = push_p;
    pop_pct    = pop_p;
    hold_words = hold;
    stop_push  = 1'b0;
    traffic_on = 1'b1;
    repeat (cycles) @(posedge rd_clk);
    drain(ctx);
  endtask

  // ---- Test Plan rows ----

  // Show-ahead: one word pushed into an empty FIFO is on pop_data when empty falls, within
  // SYNC + 2 rd_clk edges of the push, with no pop
  task automatic test_show_ahead(string ctx);
    logic [DW-1:0] word = rand_data();
    int edges = 0;                           // rd_clk edges since the push edge
    @(negedge wr_clk);
    push_en   = 1'b1;
    push_data = word;
    @(posedge wr_clk);
    fork
      begin
        @(negedge wr_clk);
        push_en = 1'b0;
      end
      forever begin
        @(posedge rd_clk);
        edges++;
        @(negedge rd_clk);
        if (!empty || edges > SYNC + 2) break;
      end
    join
    if (empty || edges > SYNC + 2) begin
      errors++;
      $display("[%0t] %s: the word reached pop_data after %0d rd_clk edges (limit %0d)", $time, ctx, edges, SYNC + 2);
    end
    checks++;
    if (pop_data !== word) begin
      errors++;
      $display("[%0t] %s: pop_data = 0x%0h, expected 0x%0h", $time, ctx, pop_data, word);
    end
    pop_en = 1'b1;
    @(negedge rd_clk);
    pop_en = 1'b0;
    settle();
  endtask

  // Fill to full with the read side idle; one more push is ignored; then the read side sees
  // every word
  task automatic test_fill(string ctx);
    @(negedge wr_clk);
    while (!full) begin
      push_en   = 1'b1;
      push_data = rand_data();
      @(negedge wr_clk);
    end
    push_data = rand_data();                 // held one cycle while full: ignored
    @(negedge wr_clk);
    push_en = 1'b0;
    checks++;
    if (wr_curr_depth != P'(DEPTH) || model.size() != DEPTH) begin
      errors++;
      $display("[%0t] %s: full with wr_curr_depth %0d and %0d words", $time, ctx, wr_curr_depth, model.size());
    end
    repeat (SYNC + 3) @(posedge rd_clk);
    @(negedge rd_clk);
    checks++;
    if (rd_curr_depth != P'(DEPTH)) begin
      errors++;
      $display("[%0t] %s: rd_curr_depth = %0d after the pushes crossed, expected %0d", $time, ctx, rd_curr_depth, DEPTH);
    end
  endtask

  // Drain to empty with the write side idle: depth words in order; one more pop is ignored;
  // then the write side sees every pop
  task automatic test_drain(string ctx);
    int popped = 0;
    @(negedge rd_clk);
    while (!empty) begin
      pop_en = 1'b1;
      popped++;
      @(negedge rd_clk);
    end
    @(negedge rd_clk);                       // pop_en still high while empty: ignored
    pop_en = 1'b0;
    checks++;
    if (popped != DEPTH) begin
      errors++;
      $display("[%0t] %s: popped %0d words, expected %0d", $time, ctx, popped, DEPTH);
    end
    repeat (SYNC + 3) @(posedge wr_clk);
    @(negedge wr_clk);
    checks++;
    if (wr_curr_depth != '0) begin
      errors++;
      $display("[%0t] %s: wr_curr_depth = %0d after the pops crossed", $time, ctx, wr_curr_depth);
    end
    settle();
  endtask

  // Threshold boundaries: almost_full_depth = depth tracks full, almost_empty_depth = 0 tracks empty
  bit check_boundaries = 1'b0;
  always @(posedge wr_clk) begin
    if (check_boundaries && wr_rst_n && almost_full !== full) begin
      errors++;
      $display("[%0t] boundaries: almost_full = %0b, full = %0b", $time, almost_full, full);
    end
  end
  always @(posedge rd_clk) begin
    if (check_boundaries && rd_rst_n && almost_empty !== empty) begin
      errors++;
      $display("[%0t] boundaries: almost_empty = %0b, empty = %0b", $time, almost_empty, empty);
    end
  end

  task automatic test_thresholds(string ctx);
`ifdef HAS_FLAGS
    @(negedge wr_clk) almost_full_depth = P'(DEPTH - 2);
    @(negedge rd_clk) almost_empty_depth = P'(2);
    test_fill({ctx, ": thresholds"});
    test_drain({ctx, ": thresholds"});
    @(negedge wr_clk) almost_full_depth = P'(DEPTH);
    @(negedge rd_clk) almost_empty_depth = '0;
    check_boundaries = 1'b1;
    test_fill({ctx, ": boundaries"});
    test_drain({ctx, ": boundaries"});
    check_boundaries = 1'b0;
`endif
  endtask

  // Throughput: both sides always ready; once the first word arrives, the read side (the
  // slower clock of the near-equal pair) pops on every rd_clk edge
  task automatic test_throughput(string ctx);
    int stalls = 0;
    push_pct   = 100;
    pop_pct    = 100;
    hold_words = 1'b1;
    traffic_on = 1'b1;
    wait (pops > 0);
    repeat (2 * SYNC + 6) @(posedge rd_clk);
    repeat (300) begin
      @(negedge rd_clk);
      if (empty) stalls++;
    end
    checks++;
    if (stalls != 0) begin
      errors++;
      $display("[%0t] %s: the read side stalled on %0d of 300 rd_clk cycles", $time, ctx, stalls);
    end
    drain(ctx);
  endtask

  // Reset: with words in the FIFO, both sides go idle, both resets are asserted together and
  // then released one after the other; the FIFO comes back empty and traffic resumes
  task automatic test_reset(string ctx);
    @(negedge wr_clk);
    repeat (DEPTH / 2) begin
      push_en   = 1'b1;
      push_data = rand_data();
      @(negedge wr_clk);
    end
    push_en = 1'b0;
    repeat (SYNC + 3) @(posedge rd_clk);
    #($urandom_range(1, 4));
    wr_rst_n = 1'b0;
    rd_rst_n = 1'b0;
    model.delete();
    repeat (3) @(posedge wr_clk);
    @(negedge wr_clk);
    wr_rst_n = 1'b1;
    repeat (2) @(posedge rd_clk);
    @(negedge rd_clk);
    rd_rst_n = 1'b1;
    settle();
    checks++;
    if (!empty || full || wr_curr_depth != '0 || rd_curr_depth != '0) begin
      errors++;
      $display("[%0t] %s: after reset empty %0b, full %0b, wr_curr_depth %0d, rd_curr_depth %0d",
               $time, ctx, empty, full, wr_curr_depth, rd_curr_depth);
    end
    traffic({ctx, ": after reset"}, 200, 60, 60, 1'b1);
  endtask

  // Random: fill-biased, drain-biased and balanced phases, with the thresholds changing
  task automatic test_random(string ctx);
    thresh_random = 1'b1;
    push_pct   = 90;
    pop_pct    = 30;
    hold_words = 1'b0;
    stop_push  = 1'b0;
    traffic_on = 1'b1;
    repeat (1000) @(posedge rd_clk);
    push_pct = 30;
    pop_pct  = 90;
    repeat (1000) @(posedge rd_clk);
    push_pct = 60;
    pop_pct  = 60;
    repeat (1000) @(posedge rd_clk);
    drain(ctx);
    thresh_random = 1'b0;
  endtask

  // ---- timing-diagram replay ----
  typedef struct { int push_en, push_data, almost_full_depth, full, wr_curr_depth, almost_full; } wr_vec_t;
  typedef struct { int pop_en, almost_empty_depth, pop_data, empty, rd_curr_depth, almost_empty; } rd_vec_t;

  function automatic void expect_bit(string ctx, logic got, int exp);
    if (exp >= 0) expect_val(ctx, DW'(got), exp);
  endfunction

  // Cycle 0 of both clocks starts at an aligned rising edge. Inputs change at each falling
  // edge, and outputs are checked 1 ns later.
  task automatic run_diagram(string name, wr_vec_t fv[], rd_vec_t sv[]);
    @(posedge rd_clk);
    fork
      foreach (fv[k]) begin
        @(negedge wr_clk);
        push_en           = 1'(in_val(fv[k].push_en, 1));
        push_data         = (fv[k].push_data >= 0) ? DW'(fv[k].push_data) : rand_data();
        almost_full_depth = P'(in_val(fv[k].almost_full_depth, P));
        #1;
        expect_bit($sformatf("diagram %s wr_clk cycle %0d: full", name, k), full, fv[k].full);
        if (fv[k].wr_curr_depth >= 0)
          expect_val($sformatf("diagram %s wr_clk cycle %0d: wr_curr_depth", name, k), DW'(wr_curr_depth), fv[k].wr_curr_depth);
`ifdef HAS_FLAGS
        expect_bit($sformatf("diagram %s wr_clk cycle %0d: almost_full", name, k), almost_full, fv[k].almost_full);
`endif
      end
      foreach (sv[j]) begin
        @(negedge rd_clk);
        pop_en             = 1'(in_val(sv[j].pop_en, 1));
        almost_empty_depth = P'(in_val(sv[j].almost_empty_depth, P));
        #1;
        if (sv[j].pop_data >= 0)
          expect_val($sformatf("diagram %s rd_clk cycle %0d: pop_data", name, j), pop_data, sv[j].pop_data);
        expect_bit($sformatf("diagram %s rd_clk cycle %0d: empty", name, j), empty, sv[j].empty);
        if (sv[j].rd_curr_depth >= 0)
          expect_val($sformatf("diagram %s rd_clk cycle %0d: rd_curr_depth", name, j), DW'(rd_curr_depth), sv[j].rd_curr_depth);
`ifdef HAS_FLAGS
        expect_bit($sformatf("diagram %s rd_clk cycle %0d: almost_empty", name, j), almost_empty, sv[j].almost_empty);
`endif
      end
    join
    push_en = 1'b0;
    pop_en  = 1'b0;
    settle();
  endtask

  `include "AFIFO_tb_vectors.svh"

  // ---- sequence ----
  task automatic set_clocks(realtime wr_period, realtime rd_period);
    @(posedge rd_clk);
    wr_half  = wr_period / 2.0;
    rd_half  = rd_period / 2.0;
    rd_shift = 0.3;
    repeat (3) @(posedge rd_clk);
  endtask

  task automatic run_pair(realtime wr_period, realtime rd_period);
    string ctx = $sformatf("wr_clk %0.0f ns, rd_clk %0.0f ns", wr_period, rd_period);
    set_clocks(wr_period, rd_period);
    test_show_ahead({ctx, ": show-ahead"});
    test_fill({ctx, ": fill to full"});
    test_drain({ctx, ": drain to empty"});
    traffic({ctx, ": free-running"}, 500, 100, 100, 1'b0);
    traffic({ctx, ": valid/ready"}, 1000, 70, 50, 1'b1);
    test_thresholds(ctx);
    if (`THROUGHPUT && wr_period < rd_period && rd_period < 1.5 * wr_period) test_throughput({ctx, ": throughput"});
    test_reset({ctx, ": reset"});
    test_random({ctx, ": random"});
  endtask

  initial begin
    $dumpfile({"tb_AFIFO_", `CFG_NAME, ".fst"});
    $dumpvars(0, tb_AFIFO);
    repeat (3) @(posedge rd_clk);
    @(negedge wr_clk);
    wr_rst_n = 1'b1;
    @(negedge rd_clk);
    rd_rst_n = 1'b1;
    settle();
    `RUN_DIAGRAMS
    run_pair(10.0, 31.0);
    run_pair(31.0, 10.0);
    run_pair(10.0, 11.0);
    expect_cover("c_full", hits_full);
    expect_cover("c_rd_sees_full", hits_rd_sees_full);
    expect_cover("c_held_push", hits_held_push);
    expect_cover("c_back_to_back", hits_back_to_back);
    expect_cover("c_empty_gap", hits_empty_gap);
    expect_cover("c_ptr_wrap", hits_ptr_wrap);
`ifdef HAS_FLAGS
    expect_cover("c_almost_full rose", hits_af_rose);
    expect_cover("c_almost_full fell", hits_af_fell);
    expect_cover("c_almost_empty rose", hits_ae_rose);
    expect_cover("c_almost_empty fell", hits_ae_fell);
`endif
    if (errors == 0) begin
      $display("PASS: %s (%s): %0d words pushed and popped in order, %0d checks; covers: full %0d, rd_sees_full %0d, held_push %0d, back_to_back %0d, empty_gap %0d, ptr_wrap %0d",
               `CFG_NAME, `"`AFIFO_DUT`", pops, checks, hits_full, hits_rd_sees_full, hits_held_push,
               hits_back_to_back, hits_empty_gap, hits_ptr_wrap);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d checks failed", `CFG_NAME, errors);
    end
  end

endmodule

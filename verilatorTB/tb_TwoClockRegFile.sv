// ---------------------------------------------------------------------------
// tb_TwoClockRegFile — self-checking testbench for the TSSV two-clock register file
//
// Built once per configuration in sv-examples/TwoClockRegFile/tb/configs.txt with
// -DCFG_<config>. ts/test/modules/test_TwoClockRegFile.ts generates the DUTs and the
// two includes: TwoClockRegFile_tb_configs.svh (DUT name, width, depth) and
// TwoClockRegFile_tb_vectors.svh (one task per timing diagram in the spec).
// Run everything with `make -C verilatorTB twoclockregfile_sim`.
//
// Port A (a_clk, 10 ns) writes and port B (b_clk) reads, in two concurrent threads.
// A reference model of the storage checks every read, and every idle b_clk cycle checks
// that b_data_out holds the last value read.
//
// The spec's access rules are enforced with an ownership model. Each word belongs to one
// port at a time: port A may write the words it owns, and port B may read the words it
// owns. A port hands a word over at one of its clock edges, and the other port may use it
// from its own third clock edge after that: two edges pass, as through a two-flop
// synchronizer, and the access is sampled at the third.
//
// The timing diagrams replay first, with b_clk at 20 ns and its rising edges aligned with
// a_clk's, as the spec draws them. Then every test runs twice: with b_clk at 13 ns (slower
// than a_clk) and at 7 ns (faster). A 0.3 ns phase shift keeps b_clk's edges from ever
// coinciding with a_clk's, so the ownership model never races.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "TwoClockRegFile_tb_configs.svh"

module tb_TwoClockRegFile;

  localparam int DW        = `DATA_WIDTH;
  localparam int DEPTH     = `DEPTH;
  localparam int AW        = $clog2(DEPTH);
  localparam int ABSENT    = -2;   // vector field not in the diagram
  localparam int DONT_CARE = -1;   // vector field shown as 'x'

  // ---- clocks ----
  // Both start high, so a_clk rises at 10, 20, 30 ns and b_clk (20 ns) at 20, 40 ns.
  logic    a_clk = 1'b1;
  logic    b_clk = 1'b1;
  realtime b_half = 10.0;
  realtime b_shift = 0.0;          // added once to the next b_clk half period

  always #5 a_clk = ~a_clk;
  initial forever begin
    #(b_half + b_shift);
    b_shift = 0.0;
    b_clk = ~b_clk;
  end

  int a_edges = 0;                 // rising edges so far, per clock
  int b_edges = 0;
  always @(posedge a_clk) a_edges++;
  always @(posedge b_clk) b_edges++;

  // ---- DUT ----
  logic          a_we = 1'b0;
  logic [AW-1:0] a_addr = '0;
  logic [DW-1:0] a_data_in = '0;
  logic          b_re = 1'b0;
  logic [AW-1:0] b_addr = '0;
  logic [DW-1:0] b_data_out;

  `TCRF_DUT dut (
    .a_clk      (a_clk),
    .a_we       (a_we),
    .a_addr     (a_addr),
    .a_data_in  (a_data_in),
    .b_clk      (b_clk),
    .b_re       (b_re),
    .b_addr     (b_addr),
    .b_data_out (b_data_out)
  );

  // ---- reference model ----
  logic [DW-1:0] model [DEPTH];
  bit            valid [DEPTH];    // written at least once
  always @(posedge a_clk) begin
    if (a_we && int'(a_addr) < DEPTH) begin
      model[a_addr] = a_data_in;
      valid[a_addr] = 1'b1;
    end
  end

  // ---- ownership (the access rules) ----
  bit owned_by_b [DEPTH];          // 0: port A may write it; 1: port B may read it
  int avail [DEPTH];               // the owner's first edge number at which it may use it

  int          errors = 0;
  int          checks = 0;
  logic [DW-1:0] last_read;        // what b_data_out should hold while b_re is low
  bit          have_last = 1'b0;

  function automatic void expect_data(string ctx, logic [DW-1:0] got, logic [DW-1:0] exp);
    checks++;
    if (got !== exp) begin
      errors++;
      $display("[%0t] %s: b_data_out = 0x%0h, expected 0x%0h", $time, ctx, got, exp);
    end
  endfunction

  // a random word of any width, built 32 bits at a time
  function automatic logic [DW-1:0] rand_data();
    logic [DW-1:0] d = '0;
    for (int i = 0; i < DW; i += 32) d = (d << 32) | DW'($urandom);
    return d;
  endfunction

  typedef int intq_t[$];
  intq_t NONE;                     // always empty: hand nothing over

  function automatic int pick(intq_t q);
    return q[$urandom_range(0, q.size() - 1)];
  endfunction

  function automatic bit has(intq_t q, int w);
    foreach (q[i]) if (q[i] == w) return 1'b1;
    return 1'b0;
  endfunction

  // words port A may write at its next edge, and words port B may read or hand back at its next edge
  function automatic intq_t a_usable();
    intq_t q;
    for (int w = 0; w < DEPTH; w++) if (!owned_by_b[w] && avail[w] <= a_edges + 1) q.push_back(w);
    return q;
  endfunction

  function automatic intq_t b_usable();
    intq_t q;
    for (int w = 0; w < DEPTH; w++) if (owned_by_b[w] && avail[w] <= b_edges + 1) q.push_back(w);
    return q;
  endfunction

  // One a_clk cycle, called at a falling edge: drive the inputs, and at the rising edge hand
  // the words in `give` to port B. addr >= DEPTH (out of range) needs no ownership.
  task automatic a_cycle(bit we, int addr, logic [DW-1:0] data, intq_t give);
    if (we && addr < DEPTH && (owned_by_b[addr] || avail[addr] > a_edges + 1))
      $fatal(1, "testbench bug: port A writes word %0d without owning it", addr);
    foreach (give[i]) if (owned_by_b[give[i]] || avail[give[i]] > a_edges + 1)
      $fatal(1, "testbench bug: port A hands over word %0d without owning it", give[i]);
    a_we      = we;
    a_addr    = we ? AW'(addr) : AW'($urandom);
    a_data_in = we ? data : rand_data();
    @(posedge a_clk);
    foreach (give[i]) begin
      owned_by_b[give[i]] = 1'b1;
      avail[give[i]]      = b_edges + 3;
    end
    @(negedge a_clk);
  endtask

  task automatic a_idle();
    a_cycle(1'b0, 0, '0, NONE);
  endtask

  // One b_clk cycle, called at a falling edge: drive the inputs, check b_data_out after the
  // rising edge, then hand the words in `give` back to port A.
  task automatic b_cycle(string ctx, bit re, int addr, intq_t give);
    logic [DW-1:0] exp = '0;
    if (re) begin
      if (!owned_by_b[addr] || avail[addr] > b_edges + 1 || !valid[addr])
        $fatal(1, "testbench bug: port B reads word %0d without owning it", addr);
      exp = model[addr];
    end
    foreach (give[i]) if (!owned_by_b[give[i]] || avail[give[i]] > b_edges + 1)
      $fatal(1, "testbench bug: port B hands back word %0d without owning it", give[i]);
    b_re   = re;
    b_addr = re ? AW'(addr) : AW'($urandom);
    @(posedge b_clk);
    #1;
    if (re) begin
      expect_data($sformatf("%s: read word %0d", ctx, addr), b_data_out, exp);
      last_read = exp;
      have_last = 1'b1;
    end else if (have_last) begin
      expect_data($sformatf("%s: hold", ctx), b_data_out, last_read);
    end
    // a_edges read 1 ns after the edge can only be later than at the edge: conservative
    foreach (give[i]) begin
      owned_by_b[give[i]] = 1'b0;
      avail[give[i]]      = a_edges + 3;
    end
    @(negedge b_clk);
  endtask

  task automatic b_idle(string ctx);
    b_cycle(ctx, 1'b0, 0, NONE);
  endtask

  // Port B hands every word it owns back to port A, then port A waits until it may use them all
  task automatic return_all(string ctx);
    intq_t q;
    @(negedge b_clk);
    forever begin
      int owned = 0;
      for (int w = 0; w < DEPTH; w++) if (owned_by_b[w]) owned++;
      if (owned == 0) break;
      q = b_usable();
      b_cycle(ctx, 1'b0, 0, q);
    end
    @(negedge a_clk);
    forever begin
      q = a_usable();
      if (q.size() == DEPTH) break;
      a_idle();
    end
  endtask

  // ---- Test Plan rows ----

  // Write then read every word: A writes each word and hands it over at the same edge; B
  // reads each as soon as it may, and hands it back
  task automatic test_write_read_all(string ctx);
    fork
      begin
        intq_t q;
        @(negedge a_clk);
        for (int w = 0; w < DEPTH; w++) begin
          forever begin
            q = a_usable();
            if (has(q, w)) break;
            a_idle();
          end
          a_cycle(1'b1, w, rand_data(), {w});
        end
        a_idle();
      end
      begin
        intq_t q;
        @(negedge b_clk);
        for (int w = 0; w < DEPTH; w++) begin
          forever begin
            q = b_usable();
            if (has(q, w)) break;
            b_idle(ctx);
          end
          b_cycle(ctx, 1'b1, w, {w});
        end
      end
    join
    return_all(ctx);
  endtask

  // Read hold: B reads word 0 and hands it back; A rewrites it while B idles, and b_data_out
  // keeps the value read
  task automatic test_read_hold(string ctx);
    bit a_done = 1'b0;
    fork
      begin
        intq_t q;
        @(negedge a_clk);
        a_cycle(1'b1, 0, rand_data(), {0});
        // wait for B's read and handback, then rewrite the word
        forever begin
          q = a_usable();
          if (has(q, 0)) break;
          a_idle();
        end
        repeat (3) a_cycle(1'b1, 0, rand_data(), NONE);
        a_done = 1'b1;
      end
      begin
        intq_t q;
        @(negedge b_clk);
        forever begin
          q = b_usable();
          if (has(q, 0)) break;
          b_idle(ctx);
        end
        b_cycle(ctx, 1'b1, 0, {0});
        while (!a_done) b_idle(ctx);
        repeat (2) b_idle(ctx);
      end
    join
    return_all(ctx);
  endtask

  // Out-of-range address (depth not a power of two): writes to depth..2**AW-1 leave every
  // word unchanged
  task automatic test_out_of_range(string ctx);
    intq_t all;
    if (DEPTH == (1 << AW)) return;
    for (int w = 0; w < DEPTH; w++) all.push_back(w);
    @(negedge a_clk);
    for (int addr = DEPTH; addr < (1 << AW); addr++) a_cycle(1'b1, addr, rand_data(), NONE);
    a_cycle(1'b0, 0, '0, all);
    @(negedge b_clk);
    for (int w = 0; w < DEPTH; w++) begin
      intq_t q;
      forever begin
        q = b_usable();
        if (has(q, w)) break;
        b_idle(ctx);
      end
      b_cycle($sformatf("%s: after out-of-range writes", ctx), 1'b1, w, {w});
    end
    return_all(ctx);
  endtask

  // Random: concurrent random writes, reads and handovers, until `target` reads and writes
  task automatic test_random(string ctx, int target);
    int ops = 0;
    fork
      begin
        intq_t q;
        @(negedge a_clk);
        while (ops < target) begin
          intq_t give;
          int w = -1;
          q = a_usable();
          if (q.size() > 0 && $urandom_range(0, 99) < 70) begin
            w = pick(q);
            ops++;
          end
          if (q.size() > 0 && $urandom_range(0, 99) < 30) give.push_back(pick(q));
          a_cycle(w >= 0, (w >= 0) ? w : 0, rand_data(), give);
        end
      end
      begin
        intq_t q;
        @(negedge b_clk);
        while (ops < target) begin
          intq_t readable;
          intq_t give;
          int w = -1;
          q = b_usable();
          foreach (q[i]) if (valid[q[i]]) readable.push_back(q[i]);
          if (readable.size() > 0 && $urandom_range(0, 99) < 70) begin
            w = pick(readable);
            ops++;
          end
          if (q.size() > 0 && $urandom_range(0, 99) < 30) give.push_back(pick(q));
          b_cycle(ctx, w >= 0, (w >= 0) ? w : 0, give);
        end
      end
    join
    return_all(ctx);
  endtask

  task automatic run_tests(string phase);
    test_write_read_all({phase, ": write then read every word"});
    test_read_hold({phase, ": read hold"});
    test_out_of_range({phase, ": out-of-range address"});
    test_random({phase, ": random"}, 5000);
  endtask

  // b_clk's half period from its next toggle on, with a 0.3 ns phase shift
  task automatic set_b_half(realtime half);
    @(posedge b_clk);
    b_half  = half;
    b_shift = 0.3;
    repeat (3) @(posedge b_clk);
  endtask

  // ---- timing-diagram replay ----
  typedef struct { int we, addr, data; } a_vec_t;
  typedef struct { int re, addr, data_out; } b_vec_t;

  // input field: ABSENT drives 0, DONT_CARE a random value
  function automatic int in_val(int v, int width);
    if (v == ABSENT) return 0;
    if (v == DONT_CARE) return int'($urandom_range(0, (1 << width) - 1));
    return v;
  endfunction

  // Cycle 0 of both clocks starts at an aligned rising edge. Inputs change at each falling
  // edge, and b_data_out is checked 1 ns later.
  task automatic run_diagram(string name, a_vec_t av[], b_vec_t bv[]);
    @(posedge b_clk);
    fork
      foreach (av[k]) begin
        @(negedge a_clk);
        a_we      = 1'(in_val(av[k].we, 1));
        a_addr    = AW'(in_val(av[k].addr, AW));
        a_data_in = (av[k].data < 0) ? rand_data() : DW'(av[k].data);
      end
      foreach (bv[j]) begin
        @(negedge b_clk);
        b_re   = 1'(in_val(bv[j].re, 1));
        b_addr = AW'(in_val(bv[j].addr, AW));
        #1;
        if (bv[j].data_out >= 0)
          expect_data($sformatf("diagram %s b_clk cycle %0d", name, j), b_data_out, DW'(bv[j].data_out));
      end
    join
    a_we = 1'b0;
    b_re = 1'b0;
    last_read = b_data_out;
    have_last = 1'b1;
  endtask

  `include "TwoClockRegFile_tb_vectors.svh"

  // ---- sequence ----
  initial begin
    $dumpfile({"tb_TwoClockRegFile_", `CFG_NAME, ".fst"});
    $dumpvars(0, tb_TwoClockRegFile);
    `RUN_DIAGRAMS
    set_b_half(6.5);
    run_tests("b_clk 13 ns");
    set_b_half(3.5);
    run_tests("b_clk 7 ns");
    if (errors == 0) begin
      $display("PASS: %s (%s): %0d checks", `CFG_NAME, `"`TCRF_DUT`", checks);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d of %0d checks failed", `CFG_NAME, errors, checks);
    end
  end

endmodule

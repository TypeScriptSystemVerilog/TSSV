// ---------------------------------------------------------------------------
// tb_SRAM — self-checking testbench for the TSSV SRAM
//
// Built once per configuration in sv-examples/SRAM/tb/configs.txt with -DCFG_<config>.
// ts/test/modules/test_SRAM.ts generates the DUTs and two includes: SRAM_tb_configs.svh (DUT
// name, its port connections, sizes, options and diagrams) and SRAM_tb_vectors.svh (one task
// per timing diagram and readBehavior in the spec). Run everything with
// `make -C verilatorTB sram_sim`.
//
// An unmasked configuration first replays its timing diagrams from the spec, cycle for cycle.
// Then every cycle drives random reads and writes on the DUT's ports, over a few words so that
// the ports often meet on one address. A reference model of the storage gives each read's
// expected data, as the spec describes it:
// - a write sets the lanes its mask selects (the whole word without a mask);
// - readBeforeWrite: a read returns the word as it was before this cycle's writes;
// - undefOnWrite: a read of a word written in the same cycle, on either port, is undefined
//   until the port's next read;
// - 2rw: both ports writing one word, whatever their masks, leave it undefined.
// Built with -DSYNTHESIS (the <config>_synth configurations), the RTL has its synthesis
// behavior instead, which the model checks: a conflicting read doesn't load, and a collision
// writes nothing.
// The model tracks which bits are defined, and a check compares only those. Verilator is
// two-state, so it can't show the X the RTL assigns in simulation. While a port's read enable
// is low, its read data must hold.
//
// The SRAM's assertions are on. A configuration whose traffic conflicts or collides on purpose
// is built with the NOASSERT_* defines for those, which configs.txt lists. Built with
// -DCHECK_ASSERT=<n> instead, the testbench breaks one assertion and must stop on it
// (break_assertion below; the checks are in sv-examples/SRAM/tb/assert_checks.txt).
//
// Timing: inputs change at each falling edge and outputs are checked 1 ns after the rising
// edge.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "SRAM_tb_configs.svh"

module tb_SRAM;

  localparam int DW     = `DATA_WIDTH;
  localparam int DEPTH  = `DEPTH;
  localparam int AW     = $clog2(DEPTH);
  localparam int LANES  = `LANES;          // write-mask bits; 1 without a mask
  localparam int LW     = DW / LANES;      // bits per lane
  localparam bit MASK   = `MASK;
  localparam bit UNDEF  = `UNDEF_ON_WRITE;
  // Built with SYNTHESIS defined, the RTL drops its X assignments: a conflicting read doesn't
  // load, and a collision writes nothing, so the model can check both
`ifdef SYNTHESIS
  localparam bit SYNTH  = 1'b1;
`else
  localparam bit SYNTH  = 1'b0;
`endif
  localparam bit RD [2] = '{`RD_A, `RD_B}; // port a is 0, port b is 1
  localparam bit WR [2] = '{`WR_A, `WR_B};
  localparam int CYCLES = 4000;

  logic clk = 1'b0;
  always #5 clk = ~clk;

  // ---- DUT ----
  // Every port signal exists here; SRAM_PORTS connects the ones this configuration has.
  logic             a_re = 1'b0;
  logic             a_we = 1'b0;
  logic [AW-1:0]    a_addr = '0;
  logic [DW-1:0]    a_data_in = '0;
  logic [LANES-1:0] a_wmask = '0;
  logic [DW-1:0]    a_data_out;
  logic             b_re = 1'b0;
  logic             b_we = 1'b0;
  logic [AW-1:0]    b_addr = '0;
  logic [DW-1:0]    b_data_in = '0;
  logic [LANES-1:0] b_wmask = '0;
  logic [DW-1:0]    b_data_out;

  `SRAM_DUT dut (`SRAM_PORTS);

  // ---- reference model ----
  logic [DW-1:0] model [DEPTH];
  bit   [DW-1:0] known [DEPTH];          // model bits that are defined
  logic [DW-1:0] exp_data [2];           // each port's expected read data
  bit   [DW-1:0] exp_known [2];          // which of its bits are defined

  int errors = 0;
  int checks = 0;
  // what the run covered; a configuration fails if one it should cover never happens
  int n_defined = 0;                     // checks that compared at least one bit
  int n_rbw = 0;                         // readBeforeWrite: defined reads of a word written in the same cycle
  int n_conflict = 0;                    // undefOnWrite: reads of a word written in the same cycle
  int n_collide = 0;                     // 2rw: both ports writing one word
  int n_partial = 0;                     // writes whose mask selects some lanes but not all

  // a random value of any width, built 32 bits at a time
  function automatic logic [DW-1:0] rand_word();
    logic [DW-1:0] d = '0;
    for (int i = 0; i < DW; i += 32) d = (d << 32) | DW'($urandom);
    return d;
  endfunction

  function automatic logic [LANES-1:0] rand_mask();
    logic [LANES-1:0] m = '0;
    case ($urandom_range(0, 3))
      0:       m = '0;
      1:       m = '1;
      default: for (int i = 0; i < LANES; i += 32) m = (m << 32) | LANES'($urandom);
    endcase
    return m;
  endfunction

  function automatic logic [LW-1:0] lane_of(logic [DW-1:0] word, int i);
    return word[i*LW +: LW];
  endfunction

  // One cycle, called at a falling edge: pick each port's access, update the model, drive the
  // DUT, and check every read port 1 ns after the rising edge.
  task automatic cycle();
    bit               re [2];
    bit               we [2];
    int               addr [2];
    logic [DW-1:0]    din [2];
    logic [LANES-1:0] wm [2];

    for (int p = 0; p < 2; p++) begin
      re[p]   = RD[p] && ($urandom_range(0, 2) != 0);
      we[p]   = WR[p] && ($urandom_range(0, 1) != 0);
      addr[p] = $urandom_range(0, DEPTH - 1);
      din[p]  = rand_word();
      wm[p]   = MASK ? rand_mask() : '1;
    end
    // 1rw and 1r_1w: the unused port's address is the used one's, so the model can compare
    // addresses the same way for every configuration
    if (!RD[1] && !WR[1]) addr[1] = addr[0];

    // reads see the model before this cycle's writes
    for (int p = 0; p < 2; p++) begin
      if (re[p]) begin
        automatic bit written = 1'b0;
        for (int q = 0; q < 2; q++) if (we[q] && addr[q] == addr[p]) written = 1'b1;
        if (UNDEF && written) begin
          if (!SYNTH) exp_known[p] = '0;   // X until the next read; in synthesis it holds
          n_conflict++;
        end else begin
          exp_data[p]  = model[addr[p]];
          exp_known[p] = known[addr[p]];
          if (written && known[addr[p]] != '0) n_rbw++;
        end
      end
    end

    // then the writes, lane by lane. Both ports writing one word collide, whatever their
    // masks: neither write happens, and in simulation the word is undefined
    for (int p = 0; p < 2; p++) if (we[p] && wm[p] != '0 && wm[p] != '1) n_partial++;
    if (we[0] && we[1] && addr[0] == addr[1]) begin
      if (!SYNTH) known[addr[0]] = '0;   // X; in synthesis the word keeps its value
      n_collide++;
    end else begin
      for (int i = 0; i < LANES; i++) begin
        for (int p = 0; p < 2; p++) begin
          if (we[p] && wm[p][i]) begin
            model[addr[p]][i*LW +: LW] = lane_of(din[p], i);
            known[addr[p]][i*LW +: LW] = '1;
          end
        end
      end
    end

    a_re = re[0]; a_we = we[0]; a_addr = AW'(addr[0]); a_data_in = din[0]; a_wmask = wm[0];
    b_re = re[1]; b_we = we[1]; b_addr = AW'(addr[1]); b_data_in = din[1]; b_wmask = wm[1];
    @(posedge clk);
    #1;
    for (int p = 0; p < 2; p++) begin
      if (RD[p]) begin
        automatic logic [DW-1:0] got = (p == 0) ? a_data_out : b_data_out;
        checks++;
        if (exp_known[p] != '0) n_defined++;
        if (((got ^ exp_data[p]) & exp_known[p]) != '0) begin
          errors++;
          if (errors <= 10)
            $display("[%0t] port %s %s: data_out = 0x%0h, expected 0x%0h on the bits 0x%0h",
                     $time, p == 0 ? "a" : "b", re[p] ? "read" : "hold", got, exp_data[p], exp_known[p]);
        end
      end
    end
    @(negedge clk);
  endtask

  // ---- timing-diagram replay ----
  // test_SRAM.ts builds one task per timing diagram and readBehavior in the spec, with one row
  // per cycle. Each row's inputs are driven at a falling edge and sampled on the next rising
  // edge, and its read data is checked as it stands before that edge.
  localparam int ABSENT    = -2;           // lane not in the diagram: input low, output not checked
  localparam int DONT_CARE = -1;           // 'x' in the diagram: input random, output not checked
  typedef struct {
    int a_re, a_we, a_addr, a_data_in, b_re, b_we, b_addr, b_data_in;
    int a_data_out, b_data_out;
  } vec_t;

  function automatic int in_val(int v, int width);
    if (v == ABSENT) return 0;
    if (v == DONT_CARE) return int'($urandom_range(0, (1 << width) - 1));
    return v;
  endfunction

  function automatic logic [DW-1:0] data_val(int v);
    if (v == DONT_CARE) return rand_word();
    return (v == ABSENT) ? '0 : DW'(v);
  endfunction

  function automatic void expect_row(string ctx, string port, logic [DW-1:0] got, int want);
    if (want < 0) return;
    checks++;
    if (got !== DW'(want)) begin
      errors++;
      $display("%s: %s = 0x%0h, expected 0x%0h", ctx, port, got, want);
    end
  endfunction

  task automatic run_vectors(string name, vec_t v[]);
    foreach (v[k]) begin
      automatic string ctx = $sformatf("diagram %s cycle %0d", name, k);
      a_re = 1'(in_val(v[k].a_re, 1)); a_we = 1'(in_val(v[k].a_we, 1));
      a_addr = AW'(in_val(v[k].a_addr, AW)); a_data_in = data_val(v[k].a_data_in);
      b_re = 1'(in_val(v[k].b_re, 1)); b_we = 1'(in_val(v[k].b_we, 1));
      b_addr = AW'(in_val(v[k].b_addr, AW)); b_data_in = data_val(v[k].b_data_in);
      a_wmask = '1; b_wmask = '1;          // the diagrams have no write mask
      if (RD[0]) expect_row(ctx, "a_data_out", a_data_out, v[k].a_data_out);
      if (RD[1]) expect_row(ctx, "b_data_out", b_data_out, v[k].b_data_out);
      @(posedge clk);
      @(negedge clk);
    end
  endtask

  `include "SRAM_tb_vectors.svh"

  function automatic void expect_covered(string what, int count, bit applies);
    if (applies && count == 0) begin
      errors++;
      $display("not covered: %s", what);
    end
  endfunction

`ifdef CHECK_ASSERT
  // A run that one of the SRAM's assertions must stop: drive one access that breaks it, with
  // every write mask bit low, since masks don't matter to conflicts or collisions. make sram_sim
  // checks that the run stops on the expected assertion.
  //   1: port a reads a word that port b writes, or that port a writes if port b can't
  //   2: port b reads the word it writes (2rw)
  //   3: both ports write one word (2rw)
  task automatic break_assertion(int check);
    a_addr = '0; b_addr = '0; a_wmask = '0; b_wmask = '0;
    case (check)
      1: begin a_re = 1'b1; if (WR[1]) b_we = 1'b1; else a_we = 1'b1; end
      2: begin b_re = 1'b1; b_we = 1'b1; end
      3: begin a_we = 1'b1; b_we = 1'b1; end
      default: $fatal(1, "CHECK_ASSERT=%0d is not a check", check);
    endcase
    @(negedge clk);
    a_re = 1'b0; a_we = 1'b0; b_re = 1'b0; b_we = 1'b0;
    repeat (2) @(negedge clk);
    $fatal(1, "CHECK_ASSERT=%0d: no SRAM assertion stopped the run", check);
  endtask
`endif

  initial begin
    $dumpfile({"tb_SRAM_", `CFG_NAME, ".fst"});
    $dumpvars(0, tb_SRAM);
    for (int p = 0; p < 2; p++) exp_known[p] = '0;
    @(negedge clk);
`ifdef CHECK_ASSERT
    break_assertion(`CHECK_ASSERT);
`endif
    // the diagrams first, from power-up; the random phase's model knows nothing they wrote
    `RUN_DIAGRAMS
    repeat (CYCLES) cycle();

    expect_covered("a read with defined data", n_defined, 1'b1);
    expect_covered("a read of a word written in the same cycle", n_rbw, !UNDEF && (WR[0] || WR[1]));
    expect_covered("a read that conflicts with a write", n_conflict, UNDEF);
    expect_covered("both ports writing one word", n_collide, WR[0] && WR[1]);
    expect_covered("a write with a partial mask", n_partial, MASK && LANES > 1);
    if (errors == 0) begin
      $display("PASS: %s (%s): %0d checks, %0d with defined data; %0d read-before-write, %0d conflicting reads, %0d colliding lanes, %0d partial writes",
               `CFG_NAME, `"`SRAM_DUT`", checks, n_defined, n_rbw, n_conflict, n_collide, n_partial);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d errors in %0d checks", `CFG_NAME, errors, checks);
    end
  end

endmodule

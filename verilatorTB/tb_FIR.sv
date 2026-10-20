// ---------------------------------------------------------------------------
// tb_FIR — self-checking testbench for the TSSV FIR
//
// Built once per configuration in sv-examples/FIR/tb/configs.txt with -DCFG_<config>.
// ts/test/test_FIR.ts generates the DUTs and the two includes: FIR_tb_configs.svh (DUT name,
// widths, reset coefficients) and FIR_tb_vectors.svh (the spec's timing diagram, one row per
// cycle). Run everything with `make -C verilatorTB fir_sim`.
//
// A reference model computes each output from the samples transferred on s_axis and the
// coefficients in effect: the sum of the products, wrapped to the accumulator width, shifted
// right by rShift rounding half up, then saturated to outWidth. Every transfer on m_axis is
// checked against the next output the model expects, and a valid output must hold, unchanged,
// until m_axis takes it. The phases:
// 1. after reset, m_axis has nothing valid and s_axis is ready
// 2. the spec's timing diagram, cycle for cycle (configurations that define DIAGRAM)
// 3. latency: one sample, with m_axis always ready, comes out 3 cycles after its transfer
// 4. random traffic with the reset coefficients: bubbles on s_axis, stalls on m_axis, and
//    samples biased to the extremes so that outputs saturate. TDATA's bits above inWidth are
//    random, and must be ignored
// 5. three rounds of new coefficients written over regs and read back, each followed by random
//    traffic. At least one output must differ from what the reset coefficients give (#83)
//
// Timing: inputs change 1 ns after each rising edge. Checks, and the model's view of each
// transfer on the next rising edge, happen at the falling edge.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "FIR_tb_configs.svh"

module tb_FIR;

  localparam int TAPS    = `NUM_TAPS;
  localparam int IN_W    = `IN_W;
  localparam int OUT_W   = `OUT_W;
  localparam int COEFF_W = `COEFF_W;
  localparam int RSHIFT  = `RSHIFT;
  localparam int ACC_W   = `ACC_W;
  localparam int SAMPLES = 2000;    // per random phase
  localparam int TIMEOUT = 1000;    // cycles to drain the pipeline

  // the model computes at 128 bits, wider than any accumulator
  typedef logic signed [127:0] wide_t;
  localparam longint RESET_COEFFS [TAPS] = `RESET_COEFFS;
  localparam wide_t  IN_MAX  = (wide_t'(1) <<< (IN_W - 1)) - 1;
  localparam wide_t  IN_MIN  = -(wide_t'(1) <<< (IN_W - 1));
  localparam wide_t  OUT_MAX = (wide_t'(1) <<< (OUT_W - 1)) - 1;
  localparam wide_t  OUT_MIN = -(wide_t'(1) <<< (OUT_W - 1));
  localparam wide_t  HALF    = (wide_t'(1) <<< RSHIFT) >>> 1;   // rounding bias; 0 when RSHIFT is 0
  // whether the rounded sum can be wider than the output, so that saturation can happen
  localparam bit     CAN_SATURATE = ACC_W - RSHIFT + 1 > OUT_W;

  logic clk = 1'b0;
  logic rst_b = 1'b0;
  always #5 clk = ~clk;

  `AXIS_IF s_axis ();
  `AXIS_IF m_axis ();
  `REGS_IF regs ();

  `FIR_DUT dut (.clk(clk), .rst_b(rst_b), .s_axis(s_axis), .m_axis(m_axis), .regs(regs));

  // the stream signals FIR ignores: each stream's clock, reset and clock enable, and s_axis's
  // sideband
  assign s_axis.ACLK    = clk;
  assign s_axis.ACLKEN  = 1'b1;
  assign s_axis.ARESETn = rst_b;
  assign s_axis.TSTRB   = '1;
  assign s_axis.TKEEP   = '1;
  assign s_axis.TLAST   = 1'b1;
  assign s_axis.TID     = '0;
  assign s_axis.TDEST   = '0;
  assign s_axis.TWAKEUP = 1'b0;
  assign m_axis.ACLK    = clk;
  assign m_axis.ACLKEN  = 1'b1;
  assign m_axis.ARESETn = rst_b;

  int errors = 0;
  int checks = 0;

  function automatic void check (bit ok, string what);
    checks++;
    if (!ok) begin
      errors++;
      $display("[%0t] %s: %s", $time, `CFG_NAME, what);
    end
  endfunction

  // ---- reference model ----
  wide_t coeff [TAPS];        // the coefficients in effect
  wide_t hist  [TAPS];        // the last TAPS samples transferred, newest first: the tap line
  wide_t expected [$];        // outputs the model expects, oldest first
  int    changed = 0;         // outputs that differ from the reset coefficients' (phase 5)
  int    saturated = 0;       // outputs the model clamped to OUT_MIN or OUT_MAX
  int    outputs = 0;         // outputs checked on m_axis
  bit    phase5 = 1'b0;

  function automatic wide_t filter (wide_t c [TAPS], wide_t h [TAPS], output bit clamped);
    wide_t acc = '0;
    for (int i = 0; i < TAPS; i++) acc += c[i] * h[i];
    acc = wide_t'($signed(acc[ACC_W-1:0]));    // wrap to the accumulator width
    acc = (acc + HALF) >>> RSHIFT;             // round half up
    clamped = 1'b1;
    if (acc > OUT_MAX) return OUT_MAX;
    if (acc < OUT_MIN) return OUT_MIN;
    clamped = 1'b0;
    return acc;
  endfunction

  function automatic wide_t reset_coeff (int i);
    return wide_t'(RESET_COEFFS[i]);
  endfunction

  // ---- the spec's timing diagram ----
  // One row per cycle; FIR_tb_vectors.svh lists the fields.
  `include "FIR_tb_vectors.svh"
  localparam int D_S_TVALID = 0, D_S_TDATA = 1, D_M_TREADY = 2, D_S_TREADY = 3, D_M_TVALID = 4, D_M_TDATA = 5;
  // the value of sample iN: mixed signs and both extremes
  function automatic wide_t diag_sample (int n);
    case (n % 6)
      0:       return IN_MAX;
      1:       return IN_MIN;
      2:       return IN_MAX / 3;
      3:       return IN_MIN / 2 + 1;
      4:       return IN_MAX - 5;
      default: return IN_MIN / 5;
    endcase
  endfunction
  bit    diag_on = 1'b0;
  int    diag_n = 0;            // samples transferred during the diagram
  wide_t diag_out [DIAG_CYCLES];  // the output each of them gives

  // ---- monitor: every transfer on the coming rising edge, and the m_axis hold rule ----
  bit          s_taken = 1'b0;    // the sample on s_axis transfers at the coming edge
  bit          m_hold = 1'b0;     // m_axis was valid and not ready at the last edge
  logic [31:0] m_hold_data;

  always @(negedge clk) begin
    if (rst_b) begin
      if (m_hold) begin
        check(m_axis.TVALID == 1'b1, "m_axis.TVALID dropped before m_axis.TREADY took the output");
        check(m_axis.TDATA == m_hold_data, $sformatf("m_axis.TDATA changed from %h to %h before m_axis.TREADY took it",
                                                      m_hold_data, m_axis.TDATA));
      end
      m_hold      = m_axis.TVALID && !m_axis.TREADY;
      m_hold_data = m_axis.TDATA;

      s_taken = s_axis.TVALID && s_axis.TREADY;
      if (s_taken) begin
        bit    clamped, clamped_reset;
        wide_t out, out_reset;
        wide_t reset_c [TAPS];
        for (int i = TAPS - 1; i > 0; i--) hist[i] = hist[i-1];
        hist[0] = wide_t'($signed(s_axis.TDATA[IN_W-1:0]));
        out = filter(coeff, hist, clamped);
        expected.push_back(out);
        if (clamped) saturated++;
        if (phase5) begin
          for (int i = 0; i < TAPS; i++) reset_c[i] = reset_coeff(i);
          out_reset = filter(reset_c, hist, clamped_reset);
          if (out != out_reset) changed++;
        end
        if (diag_on) begin
          diag_out[diag_n] = out;
          diag_n++;
        end
      end

      if (m_axis.TVALID && m_axis.TREADY) begin
        if (expected.size() == 0) begin
          check(1'b0, $sformatf("m_axis output %h with no sample to give it", m_axis.TDATA));
        end else begin
          automatic wide_t exp_out = expected.pop_front();
          check(m_axis.TDATA == exp_out[31:0], $sformatf("output %0d: m_axis.TDATA is %h, expected %h",
                                                          outputs, m_axis.TDATA, exp_out[31:0]));
        end
        check(m_axis.TLAST && m_axis.TSTRB == '1 && m_axis.TKEEP == '1 && m_axis.TID == '0
              && m_axis.TDEST == '0 && !m_axis.TWAKEUP, "m_axis sideband isn't its constant value");
        outputs++;
      end
    end
  end

  // ---- stimulus ----
  task automatic next_cycle ();
    @(posedge clk);
    #1;
  endtask

  // TDATA for a sample: the sample in the low IN_W bits, random bits above it
  function automatic logic [31:0] tdata (wide_t sample);
    logic [31:0] d = $urandom();
    d[IN_W-1:0] = sample[IN_W-1:0];
    return d;
  endfunction

  // a random sample: half the time one of the extremes, so that sums reach their limits
  function automatic wide_t random_sample ();
    case ($urandom_range(3))
      0:       return IN_MAX;
      1:       return IN_MIN;
      default: return wide_t'($signed(IN_W'({$urandom(), $urandom()})));
    endcase
  endfunction

  // A random coefficient of C_BITS bits: one product of it can just reach the saturation limit,
  // so that a sum of several lands on either side of it
  localparam int C_WANT = OUT_W + RSHIFT - IN_W + 1;
  localparam int C_BITS = C_WANT < 2 ? 2 : C_WANT > COEFF_W ? COEFF_W : C_WANT;
  localparam wide_t COEFF_MIN = -(wide_t'(1) <<< (COEFF_W - 1));
  function automatic wide_t random_coeff ();
    return wide_t'($signed(C_BITS'({$urandom(), $urandom()})));
  endfunction

  task automatic drain ();
    int cycles = 0;
    s_axis.TVALID = 1'b0;
    m_axis.TREADY = 1'b1;
    while ((expected.size() > 0 || m_axis.TVALID) && cycles < TIMEOUT) begin
      next_cycle();
      cycles++;
    end
    check(expected.size() == 0, $sformatf("%0d outputs never came out", expected.size()));
    // one more cycle, so the monitor's view of the last edge is done
    next_cycle();
  endtask

  task automatic replay_diagram ();
    diag_on = 1'b1;
    for (int c = 0; c < DIAG_CYCLES; c++) begin
      next_cycle();
      s_axis.TVALID = DIAG[c][D_S_TVALID] == 1;
      s_axis.TDATA  = DIAG[c][D_S_TDATA] >= 0 ? tdata(diag_sample(DIAG[c][D_S_TDATA])) : $urandom();
      m_axis.TREADY = DIAG[c][D_M_TREADY] == 1;
      @(negedge clk);
      check(s_axis.TREADY == (DIAG[c][D_S_TREADY] == 1), $sformatf("diagram cycle %0d: s_axis.TREADY", c));
      check(m_axis.TVALID == (DIAG[c][D_M_TVALID] == 1), $sformatf("diagram cycle %0d: m_axis.TVALID", c));
      if (DIAG[c][D_M_TDATA] >= 0) begin
        wide_t exp_out = diag_out[DIAG[c][D_M_TDATA]];
        check(DIAG[c][D_M_TDATA] < diag_n && m_axis.TDATA == exp_out[31:0],
              $sformatf("diagram cycle %0d: m_axis.TDATA is %h, expected o%0d", c, m_axis.TDATA, DIAG[c][D_M_TDATA]));
      end
    end
    diag_on = 1'b0;
  endtask

  task automatic test_latency ();
    next_cycle();
    s_axis.TVALID = 1'b1;
    s_axis.TDATA  = tdata(random_sample());
    @(negedge clk);
    check(s_axis.TREADY, "latency: the sample didn't transfer");
    next_cycle();
    s_axis.TVALID = 1'b0;
    for (int c = 1; c <= 3; c++) begin
      @(negedge clk);
      check(m_axis.TVALID == (c == 3), $sformatf("latency: m_axis.TVALID is %0b %0d cycles after the transfer", m_axis.TVALID, c));
      if (c < 3) next_cycle();
    end
    drain();
  endtask

  // valid_pct and ready_pct: how often s_axis offers a sample, and m_axis is ready, per cycle
  task automatic test_random (int valid_pct, int ready_pct);
    int offered = 0;
    while (offered < SAMPLES || s_axis.TVALID) begin
      next_cycle();
      // AXI: a sample stays on s_axis until it transfers
      if (s_taken || !s_axis.TVALID) begin
        s_axis.TVALID = offered < SAMPLES && $urandom_range(99) < valid_pct;
        if (s_axis.TVALID) begin
          s_axis.TDATA = tdata(random_sample());
          offered++;
        end
      end
      m_axis.TREADY = $urandom_range(99) < ready_pct;
    end
    drain();
  endtask

  // a write over regs: one cycle with WE high, captured at the next edge (READY is high)
  task automatic write_coeff (int i, wide_t value);
    logic [31:0] d = $urandom();      // the bits above COEFF_W must be ignored
    d[COEFF_W-1:0] = value[COEFF_W-1:0];
    next_cycle();
    regs.ADDR    = 32'(4 * i);
    regs.DATA_WR = d;
    regs.WSTRB   = '1;
    regs.WE      = 1'b1;
    @(negedge clk);
    check(regs.READY, "regs.READY is low during a write");
    next_cycle();
    regs.WE = 1'b0;
  endtask

  // a read over regs: one cycle with RE high; DATA_RD holds the register in the next cycle,
  // the coefficient in the low COEFF_W bits and 0 above them
  task automatic read_coeff (int i, wide_t value);
    logic [31:0] want = '0;
    want[COEFF_W-1:0] = value[COEFF_W-1:0];
    next_cycle();
    regs.ADDR = 32'(4 * i);
    regs.RE   = 1'b1;
    next_cycle();
    regs.RE = 1'b0;
    @(negedge clk);
    check(regs.DATA_RD == want, $sformatf("COEFF_%0d reads %h, expected %h", i, regs.DATA_RD, want));
  endtask

  // Three rounds of new coefficients, each followed by random traffic. The first sets every
  // coefficient to its most negative value, which with the most negative samples gives the
  // largest sum; the others are random.
  task automatic test_coeff_writes ();
    for (int round = 0; round < 3; round++) begin
      wide_t c [TAPS];
      for (int i = 0; i < TAPS; i++) c[i] = round == 0 ? COEFF_MIN : random_coeff();
      for (int i = 0; i < TAPS; i++) write_coeff(i, c[i]);
      for (int i = 0; i < TAPS; i++) read_coeff(i, c[i]);
      coeff = c;
      phase5 = 1'b1;
      test_random(70, 70);
    end
    check(changed > 0, "no output differs from what the reset coefficients give");
  endtask

  // ---- sequence ----
  initial begin
    $dumpfile({"tb_FIR_", `CFG_NAME, ".fst"});
    $dumpvars(0, tb_FIR);
    s_axis.TVALID = 1'b0;
    s_axis.TDATA  = '0;
    m_axis.TREADY = 1'b1;
    regs.ADDR     = '0;
    regs.DATA_WR  = '0;
    regs.WSTRB    = '0;
    regs.WE       = 1'b0;
    regs.RE       = 1'b0;
    for (int i = 0; i < TAPS; i++) begin
      coeff[i] = reset_coeff(i);
      hist[i]  = '0;
    end
    repeat (3) @(posedge clk);
    #1 rst_b = 1'b1;
    @(negedge clk);
    check(!m_axis.TVALID, "m_axis.TVALID is high after reset");
    check(s_axis.TREADY, "s_axis.TREADY is low after reset");
`ifdef DIAGRAM
    replay_diagram();
    drain();
`endif
    test_latency();
    test_random(70, 70);
    test_random(100, 30);     // mostly stalled
    test_coeff_writes();
    if (CAN_SATURATE) begin
      check(saturated > 0, "no output saturated");
      check(saturated < outputs, "every output saturated");
    end
    if (errors == 0) begin
      $display("PASS: %s (%s): %0d checks, %0d outputs, %0d saturated, %0d changed by the new coefficients",
               `CFG_NAME, `"`FIR_DUT`", checks, outputs, saturated, changed);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d of %0d checks failed", `CFG_NAME, errors, checks);
    end
  end

endmodule

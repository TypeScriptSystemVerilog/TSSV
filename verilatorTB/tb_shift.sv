// ---------------------------------------------------------------------------
// tb_shift — self-checking testbench for the TSSV fixed-amount shifter
//
// Built once per configuration in sv-examples/shift/tb/configs.txt with -DCFG_<config>.
// ts/test/modules/test_shift.ts generates the DUTs and shift_tb_configs.svh (DUT name, width,
// amount, and LEFT and SIGNED when they apply). Run everything with `make -C verilatorTB shift_sim`.
//
// data_out is checked against a reference model that builds it one bit at a time from data_in.
// A word of up to 16 bits is checked for every value. A wider word is checked for all zeros,
// all ones, a walking one and a walking zero, then RANDOM_WORDS random words.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "shift_tb_configs.svh"

module tb_shift;

  localparam int W = `WIDTH;
  localparam int S = `AMOUNT;
`ifdef LEFT
  localparam bit LEFT = 1'b1;
  localparam int OW   = W + S;
`else
  localparam bit LEFT = 1'b0;
  localparam int OW   = W;
`endif
`ifdef SIGNED
  localparam bit SIGNED = 1'b1;
`else
  localparam bit SIGNED = 1'b0;
`endif
  localparam int RANDOM_WORDS = 100000;
  // the number of values an exhaustive check covers, or 0 for a word too wide to check that way
  localparam longint EXHAUSTIVE = (W <= 16) ? longint'(64'd1 << W) : 0;

  logic [W-1:0]  data_in = '0;
  logic [OW-1:0] data_out;

  `SHIFT_DUT dut (
    .data_in  (data_in),
    .data_out (data_out)
  );

  longint checks = 0;
  int     errors = 0;

  // left: data_in moves up S places over S zeros. right: data_in moves down S places, and the
  // top S places take zeros, or data_in's top bit when it's signed
  function automatic logic [OW-1:0] ref_out(logic [W-1:0] x);
    logic [OW-1:0] y;
    for (int i = 0; i < OW; i++) begin
      if (LEFT) y[i] = (i >= S) ? x[i-S] : 1'b0;
      else      y[i] = (i + S < W) ? x[i+S] : (SIGNED && x[W-1]);
    end
    return y;
  endfunction

  task automatic check(logic [W-1:0] x);
    data_in = x;
    #1;
    checks++;
    if (data_out !== ref_out(x)) begin
      errors++;
      if (errors <= 10) $display("data_in = 0x%0h: data_out = 0x%0h, expected 0x%0h", x, data_out, ref_out(x));
    end
  endtask

  function automatic logic [W-1:0] random_word();
    logic [W+31:0] r;
    for (int i = 0; i < W; i += 32) r[i+:32] = $urandom;
    return r[W-1:0];
  endfunction

  initial begin
    if (EXHAUSTIVE > 0) begin
      for (longint v = 0; v < EXHAUSTIVE; v++) check(W'(v));
    end else begin
      check('0);
      check('1);
      for (int p = 0; p < W; p++) begin
        check(W'(1'b1) << p);
        check(~(W'(1'b1) << p));
      end
      for (int r = 0; r < RANDOM_WORDS; r++) check(random_word());
    end

    if (errors == 0) begin
      $display("PASS: %s (%s): %0d checks", `CFG_NAME, `"`SHIFT_DUT`", checks);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d of %0d checks failed", `CFG_NAME, errors, checks);
    end
  end

endmodule

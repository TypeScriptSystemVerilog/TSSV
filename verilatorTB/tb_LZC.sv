// ---------------------------------------------------------------------------
// tb_LZC — self-checking testbench for the TSSV leading zero counter
//
// Built once per configuration in sv-examples/LZC/tb/configs.txt with -DCFG_<config>.
// ts/test/modules/test_LZC.ts generates the DUTs and LZC_tb_configs.svh (DUT name and width).
// Run everything with `make -C verilatorTB lzc_sim`.
//
// zero_num and is_zero are checked against a reference model that scans data_in from its top
// bit. A word of up to EXHAUSTIVE_MAX bits is checked for every value. A wider word is checked
// for zero and, for each position of its leading one, with the bits below it all zeros, all ones
// and RANDOM_FILLS random fills. Every output depends only on that position, so this reaches
// every output value. RANDOM_WORDS random words follow. Override EXHAUSTIVE_MAX (default 20) or
// RANDOM_FILLS (default 16) with -D<name>=<n>.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "LZC_tb_configs.svh"

`ifndef EXHAUSTIVE_MAX
  `define EXHAUSTIVE_MAX 20
`endif
`ifndef RANDOM_FILLS
  `define RANDOM_FILLS 16
`endif

module tb_LZC;

  localparam int W            = `WIDTH;
  localparam int CW           = $clog2(W + 1);  // zero_num holds every count from 0 to W
  localparam int RANDOM_FILLS = `RANDOM_FILLS;
  localparam int RANDOM_WORDS = 100000;
  // the number of values an exhaustive check covers, or 0 for a word too wide to check that way
  localparam longint EXHAUSTIVE = (W <= `EXHAUSTIVE_MAX) ? longint'(64'd1 << W) : 0;

  logic [W-1:0]  data_in = '0;
  logic [CW-1:0] zero_num;
  logic          is_zero;

  `LZC_DUT dut (
    .data_in  (data_in),
    .zero_num (zero_num),
    .is_zero  (is_zero)
  );

  longint checks = 0;
  int     errors = 0;

  // the number of zeros above data_in's top set bit, or W when there is none
  function automatic int ref_count(logic [W-1:0] x);
    for (int i = W - 1; i >= 0; i--) begin
      if (x[i]) return W - 1 - i;
    end
    return W;
  endfunction

  task automatic check(logic [W-1:0] x);
    data_in = x;
    #1;
    checks++;
    if (int'(zero_num) != ref_count(x) || is_zero !== (x == '0)) begin
      errors++;
      if (errors <= 10) begin
        $display("data_in = 0x%0h: zero_num = %0d, is_zero = %b; expected %0d and %b",
                 x, zero_num, is_zero, ref_count(x), x == '0);
      end
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
      for (int p = 0; p < W; p++) begin
        logic [W-1:0] lead;
        logic [W-1:0] below;
        lead  = W'(1'b1) << p;
        below = lead - W'(1'b1);
        check(lead);
        check(lead | below);
        for (int f = 0; f < RANDOM_FILLS; f++) check(lead | (random_word() & below));
      end
      for (int r = 0; r < RANDOM_WORDS; r++) check(random_word());
    end

    if (errors == 0) begin
      $display("PASS: %s (%s): %0d checks", `CFG_NAME, `"`LZC_DUT`", checks);
      $finish;
    end else begin
      $fatal(1, "FAIL: %s: %0d of %0d checks failed", `CFG_NAME, errors, checks);
    end
  end

endmodule

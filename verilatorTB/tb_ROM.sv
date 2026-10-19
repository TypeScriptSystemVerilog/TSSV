// ---------------------------------------------------------------------------
// tb_ROM — self-checking testbench for the TSSV ROM
//
// Built once per configuration in sv-examples/ROM/tb/configs.txt with -DCFG_<config>.
// ts/test/modules/test_ROM.ts generates the DUTs and ROM_tb_configs.svh (DUT name, data width,
// depth and the words the spec's parsing rules give). Run everything with
// `make -C verilatorTB rom_sim`.
//
// Every cycle drives a random address, over every value of addr, so a depth that isn't a power
// of 2 gets reads past its last word, and reads on half the cycles. As the spec describes:
// - a read of word i loads data_out with word i on the next clock edge;
// - while rd_en is low, data_out holds;
// - a read past the last word makes data_out undefined until the next read, so nothing is
//   checked until then. Verilator is two-state, so it can't show the X the RTL assigns.
//
// Timing: inputs change at each falling edge and data_out is checked 1 ns after the rising
// edge.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

`include "ROM_tb_configs.svh"

module tb_ROM;

  localparam int DW     = `DATA_WIDTH;
  localparam int DEPTH  = `DEPTH;
  localparam int AW     = DEPTH > 1 ? $clog2(DEPTH) : 1;
  localparam int CYCLES = 2000;
  localparam logic [DW-1:0] WORDS [DEPTH] = `ROM_WORDS;

  logic clk = 1'b0;
  always #5 clk = ~clk;

  logic          rd_en = 1'b0;
  logic [AW-1:0] addr = '0;
  logic [DW-1:0] data_out;

  `ROM_DUT dut (.clk(clk), .rd_en(rd_en), .addr(addr), .data_out(data_out));

  logic [DW-1:0] exp_data = '0;          // the word the last read loaded
  bit            known = 1'b0;           // false before the first read and after a read past the last word
  bit            read_once [DEPTH];      // words read at least once

  int errors = 0;
  int checks = 0;
  // what the run covered; a configuration fails if one it should cover never happens
  int n_hold = 0;                        // checks of a held word with rd_en low
  int n_past = 0;                        // reads past the last word

  initial begin
    $dumpfile({"tb_ROM_", `"`ROM_DUT`", ".fst"});
    $dumpvars(0, tb_ROM);
    for (int cycle = 0; cycle < CYCLES; cycle++) begin
      @(negedge clk);
      rd_en = 1'($urandom);
      addr  = AW'($urandom);
      @(posedge clk);
      if (rd_en) begin
        if (32'(addr) < DEPTH) begin
          exp_data        = WORDS[addr];
          known           = 1'b1;
          read_once[addr] = 1'b1;
        end else begin
          known = 1'b0;
          n_past++;
        end
      end else if (known) begin
        n_hold++;
      end
      #1;
      if (known) begin
        checks++;
        if (data_out !== exp_data) begin
          errors++;
          if (errors <= 10)
            $display("FAIL: cycle %0d: addr %0d rd_en %0b: data_out %h, expected %h",
                     cycle, addr, rd_en, data_out, exp_data);
        end
      end
    end

    for (int i = 0; i < DEPTH; i++) begin
      if (!read_once[i]) begin
        errors++;
        $display("FAIL: word %0d was never read", i);
      end
    end
    if (n_hold == 0) begin
      errors++;
      $display("FAIL: data_out was never checked holding a word");
    end
    if (DEPTH < 2 ** AW && n_past == 0) begin
      errors++;
      $display("FAIL: no read past the last word");
    end

    if (errors != 0) $fatal(1, "FAIL: %s: %0d errors in %0d checks", `"`ROM_DUT`", errors, checks);
    $display("PASS: %s: %0d checks, %0d of a held word, %0d reads past the last word",
             `"`ROM_DUT`", checks, n_hold, n_past);
    $finish;
  end

endmodule

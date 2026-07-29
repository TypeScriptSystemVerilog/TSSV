// ---------------------------------------------------------------------------
// tb_AFIFO — self-checking dual-clock testbench for the TSSV AFIFO
//
// Drives two independent, asynchronous clocks (write faster than read so the
// FIFO backs up and asserts full), streams an incrementing data pattern in,
// and reads it back out. Because the FIFO preserves order, the reader knows
// the expected value from its own counter — no cross-domain scoreboard queue
// (and therefore no simulation race) is needed.
//
// Targets the generated variant AFIFO_8_2_none_2 (dataWidth=8, log2depth=2,
// depth=4). Easiest path: run  `make -C verilatorTB afifo_sim`, which builds
// with `--binary --timing` (passing this file plus the generated DUT .sv) and
// runs the resulting simulation binary.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

module tb_AFIFO;

  localparam int DW        = 8;
  localparam int NUM_WORDS = 64;   // total words pushed through the FIFO

  // ---- DUT connections ----
  logic          wr_clk, wr_rst_n;
  logic          wr_en;
  logic [DW-1:0] wr_data_in;
  logic          wr_full;
  logic [2:0]    wr_curr_depth;

  logic          rd_clk, rd_rst_n;
  logic          rd_en;
  logic [DW-1:0] rd_data_out;
  logic          rd_empty;
  logic [2:0]    rd_curr_depth;

  // ---- testbench state ----
  int            sent     = 0;   // words accepted into the FIFO
  int            received = 0;   // words checked out of the FIFO
  int            errors   = 0;
  logic [DW-1:0] wdata    = '0;  // next value to write
  logic [DW-1:0] rexp     = '0;  // next value expected on read
  logic          rd_valid_d = 1'b0; // a read was accepted on the previous rd_clk
  logic          rd_go    = 1'b0; // hold reads off initially so the FIFO fills
  logic          saw_full = 1'b0;
  logic          saw_empty = 1'b0;

  // ---- DUT ----
  AFIFO_8_2_none_2 dut (
    .wr_clk        (wr_clk),
    .wr_rst_n      (wr_rst_n),
    .wr_en         (wr_en),
    .wr_data_in    (wr_data_in),
    .wr_full       (wr_full),
    .wr_curr_depth (wr_curr_depth),
    .rd_clk        (rd_clk),
    .rd_rst_n      (rd_rst_n),
    .rd_en         (rd_en),
    .rd_data_out   (rd_data_out),
    .rd_empty      (rd_empty),
    .rd_curr_depth (rd_curr_depth)
  );

  // ---- asynchronous clocks: write 100 MHz, read ~71 MHz ----
  initial wr_clk = 1'b0;
  always #5 wr_clk = ~wr_clk;
  initial rd_clk = 1'b0;
  always #7 rd_clk = ~rd_clk;

  // ---- independent reset release per domain ----
  initial begin
    wr_rst_n = 1'b0;
    rd_rst_n = 1'b0;
    #33 wr_rst_n = 1'b1;
    #21 rd_rst_n = 1'b1;
  end

  // let the writer run alone for a while so the FIFO reaches full, then read
  initial begin
    rd_go = 1'b0;
    #300 rd_go = 1'b1;
  end

  // ---- combinational enables (the FIFO itself gates on full/empty) ----
  assign wr_en      = (sent < NUM_WORDS);
  assign wr_data_in = wdata;
  assign rd_en      = rd_go & rd_rst_n;

  // ---- write side ----
  always @(posedge wr_clk) begin
    if (!wr_rst_n) begin
      sent  <= 0;
      wdata <= '0;
    end else if (wr_en && !wr_full) begin   // matches DUT inc_wr
      wdata <= wdata + 1'b1;
      sent  <= sent + 1;
    end
  end

  // ---- read side (registered read data => 1 rd_clk latency) ----
  always @(posedge rd_clk) begin
    if (!rd_rst_n) begin
      rexp       <= '0;
      received   <= 0;
      rd_valid_d <= 1'b0;
    end else begin
      // check the word from a read that was accepted on the previous edge
      if (rd_valid_d) begin
        if (rd_data_out !== rexp) begin
          errors <= errors + 1;
          $error("[%0t] data mismatch: got 0x%02h expected 0x%02h (word %0d)",
                 $time, rd_data_out, rexp, received);
        end
        rexp     <= rexp + 1'b1;
        received <= received + 1;
      end
      rd_valid_d <= (rd_en && !rd_empty);   // matches DUT inc_rd
    end
  end

  // ---- flag coverage ----
  always @(posedge wr_clk) if (wr_rst_n && wr_full)  saw_full  <= 1'b1;
  always @(posedge rd_clk) if (rd_rst_n && rd_empty) saw_empty <= 1'b1;

  // ---- completion / verdict ----
  always @(posedge rd_clk) begin
    if (rd_rst_n && (received == NUM_WORDS)) begin
      if (errors == 0 && saw_full && saw_empty) begin
        $display("PASS: %0d words verified in order; wr_full and rd_empty both exercised.",
                 NUM_WORDS);
      end else begin
        $display("FAIL: errors=%0d received=%0d saw_full=%0b saw_empty=%0b",
                 errors, received, saw_full, saw_empty);
      end
      $finish;
    end
  end

  // ---- watchdog ----
  initial begin
    #200000;
    $error("TIMEOUT: only received %0d of %0d words (errors=%0d)",
           received, NUM_WORDS, errors);
    $finish;
  end

  // ---- waveform ----
  initial begin
    $dumpfile("tb_AFIFO.fst");
    $dumpvars(0, tb_AFIFO);
  end

endmodule

// ---------------------------------------------------------------------------
// tb_APB_to_Memory — self-checking testbench for APB_to_Memory against the Memory contract (TSSV#116)
//
// ts/test/test_APB_to_Memory.ts generates the DUT, a RegisterBlock with an `apb` port whose
// APB_to_Memory submodule drives the block's internal Memory bus `regs`. Run with
// `make -C verilatorTB apb_to_memory_sim`.
//
// The testbench is an APB master. It runs writes and reads, with and without idle cycles between
// them, and checks that:
// - every transfer completes with no APB wait states, and PSLVERR stays low
// - a write has taken effect by the access phase: the block captured it on the setup phase's edge
// - PRDATA in the access phase matches a reference model
// A monitor on `dut.regs` checks the Memory side of every cycle: WE and RE are never high
// together, a request lasts one cycle, comes only in the APB setup phase and only while READY
// is high, and each transfer makes exactly one request.
//
// The RAM's read data is its last write (MEM_wdata) until TSSV#80, so the model reads that back.
//
// Timing: inputs change on a falling edge and outputs are checked 1 ns after a falling edge.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

module tb_APB_to_Memory;

  logic clk = 1'b0;
  logic rst_b = 1'b0;
  always #5 clk = ~clk;

  int errors = 0;
  int checks = 0;
  int transfers = 0;
  int requests = 0;

  APB4_32_32 apb ();
  assign apb.PCLK    = clk;
  assign apb.PRESETn = rst_b;

  logic        CTRL_field0;
  logic [1:0]  CTRL_field1;
  logic [7:0]  CTRL_field2;
  logic [31:0] SCRATCH, CMD;
  logic [15:0] STAT;
  logic        STAT_hw_update = 1'b0;
  logic [15:0] STAT_hw_update_val = '0;
  logic [31:0] MEM_rdata, MEM_wdata, MEM_wstrb;
  logic        MEM_re, MEM_we, MEM_ready;

  apb_regblock dut (
    .clk, .rst_b,
    .CTRL_field0, .CTRL_field1, .CTRL_field2, .SCRATCH,
    .STAT, .STAT_hw_update, .STAT_hw_update_val,
    .CMD,
    .MEM_rdata, .MEM_re, .MEM_we, .MEM_wdata, .MEM_wstrb, .MEM_ready,
    .apb
  );

  // ---- reference model ----
  localparam logic [31:0] CTRL_MASK = 32'h0000_ff07;  // enable [0], mode [2:1], divisor [15:8]
  logic [31:0] m_ctrl, m_scratch, m_mem;
  logic [15:0] m_stat;

  task automatic check (input string what, input logic [31:0] got, input logic [31:0] exp);
    checks++;
    if (got !== exp) begin
      errors++;
      $display("ERROR %0t: %s: got 0x%0h, expected 0x%0h", $time, what, got, exp);
    end
  endtask

  // ---- Memory-side monitor ----
  logic req_q = 1'b0;
  always @(posedge clk) begin
    if (rst_b) begin
      automatic logic req = dut.regs.WE || dut.regs.RE;
      if (dut.regs.WE && dut.regs.RE) begin
        errors++; $display("ERROR %0t: regs.WE and regs.RE both high", $time);
      end
      if (req && !dut.regs.READY) begin
        errors++; $display("ERROR %0t: request while regs.READY is low", $time);
      end
      if (req && !(apb.PSELx && !apb.PENABLE)) begin
        errors++; $display("ERROR %0t: request outside the APB setup phase", $time);
      end
      if (req && req_q) begin
        errors++; $display("ERROR %0t: request held for more than one cycle", $time);
      end
      if (req) requests++;
      req_q <= req;
    end
  end

  // One APB transfer: setup phase, then access phase until PREADY. The access phase's last
  // cycle ends at the next rising edge, so the next call can start a setup phase back to back.
  task automatic apb_xfer (input logic write, input logic [31:0] addr, input logic [31:0] wdata,
                           output logic [31:0] rdata);
    int waits;
    string where;
    where = $sformatf("%s @0x%0h", write ? "write" : "read", addr);
    @(negedge clk);
    apb.PSELx = 1'b1; apb.PENABLE = 1'b0; apb.PWRITE = write; apb.PADDR = addr;
    apb.PWDATA = write ? wdata : 'x; apb.PSTRB = write ? 4'hf : 4'h0;
    @(negedge clk);
    apb.PENABLE = 1'b1;
    #1;
    waits = 0;
    while (!apb.PREADY) begin
      waits++;
      if (waits > 16) $fatal(1, "%s: PREADY never rose", where);
      @(negedge clk);
      #1;
    end
    check({where, " APB wait states"}, 32'(waits), 32'h0);
    check({where, " PSLVERR"}, 32'(apb.PSLVERR), 32'h0);
    rdata = apb.PRDATA;
    transfers++;
  endtask

  task automatic idle (input int cycles);
    repeat (cycles) begin
      @(negedge clk);
      apb.PSELx = 1'b0; apb.PENABLE = 1'b0; apb.PADDR = 'x; apb.PWDATA = 'x;
    end
  endtask

  task automatic apb_read (input logic [31:0] addr, input logic [31:0] exp);
    logic [31:0] rdata;
    apb_xfer(1'b0, addr, '0, rdata);
    check($sformatf("read @0x%0h PRDATA", addr), rdata, exp);
  endtask

  task automatic apb_write (input logic [31:0] addr, input logic [31:0] data);
    logic [31:0] unused;
    apb_xfer(1'b1, addr, data, unused);
    // Still in the access phase: the block took the write on the setup phase's edge
    unique case (addr)
      32'h0: begin
        m_ctrl = data & CTRL_MASK;
        check("write CTRL fields", 32'({CTRL_field2, CTRL_field1, CTRL_field0}),
              32'({m_ctrl[15:8], m_ctrl[2:1], m_ctrl[0]}));
      end
      32'h4: begin m_scratch = data; check("write SCRATCH", SCRATCH, data); end
      32'h8: begin m_stat = data[15:0]; check("write STAT", 32'(STAT), 32'(data[15:0])); end
      32'hc: check("write CMD", CMD, data);
      32'h20, 32'h24, 32'h28, 32'h2c: begin m_mem = data; check("write MEM_wdata", MEM_wdata, data); end
      default: ;
    endcase
  endtask

  // Every register, the RAM window, a WO register and an unmapped address
  task automatic read_all ();
    apb_read(32'h0, m_ctrl);
    apb_read(32'h4, m_scratch);
    apb_read(32'h8, {16'b0, m_stat});
    apb_read(32'hc, '0);
    apb_read(32'h24, m_mem);
    apb_read(32'h100, '0);
  endtask

  initial begin
    apb.PSELx = 1'b0; apb.PENABLE = 1'b0; apb.PWRITE = 1'b0; apb.PADDR = '0; apb.PWDATA = '0;
    apb.PSTRB = '0; apb.PPROT = '0; apb.PCLKEN = 1'b1;
    m_ctrl = 32'h0000_1000;  // divisor resets to 0x10
    m_scratch = 32'h5a5a_5a5a; m_stat = '0; m_mem = '0;
    repeat (2) @(negedge clk);
    rst_b = 1'b1;
    idle(1);

    // ---- after reset, back to back ----
    read_all();
    idle(2);

    // ---- writes with an idle cycle between them ----
    apb_write(32'h0, 32'hffff_ffff); idle(1);
    apb_write(32'h4, 32'hdead_beef); idle(1);
    apb_write(32'h8, 32'h0000_1234); idle(1);
    apb_write(32'hc, 32'h5555_5555); idle(1);
    apb_write(32'h24, 32'h1111_2222); idle(1);
    read_all();

    // ---- a hardware update to the RWU register ----
    idle(1);
    STAT_hw_update = 1'b1; STAT_hw_update_val = 16'hbeef;
    idle(1);
    STAT_hw_update = 1'b0; m_stat = 16'hbeef;

    // ---- writes and reads back to back, each read right after its write ----
    apb_write(32'h4, 32'h0bad_f00d);
    apb_read(32'h4, 32'h0bad_f00d);
    apb_write(32'h0, 32'h0000_5a04);
    apb_read(32'h0, 32'h0000_5a04);
    apb_write(32'h28, 32'hcafe_0001);
    apb_read(32'h28, 32'hcafe_0001);
    apb_read(32'h8, {16'b0, m_stat});
    idle(2);

    check("one Memory request per APB transfer", 32'(requests), 32'(transfers));

    if (errors == 0) begin
      $display("tb_APB_to_Memory: PASS (%0d checks, %0d transfers)", checks, transfers);
      $finish;
    end else begin
      $fatal(1, "tb_APB_to_Memory: FAIL (%0d errors, %0d checks)", errors, checks);
    end
  end

endmodule

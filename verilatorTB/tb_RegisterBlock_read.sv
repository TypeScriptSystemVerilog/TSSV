// ---------------------------------------------------------------------------
// tb_RegisterBlock_read — self-checking testbench for RegisterBlock's read path (TSSV#79, TSSV#116)
//
// ts/test/test_RegisterBlock_read.ts generates the two DUTs; their register maps are
// described there. Run with `make -C verilatorTB regblock_read_sim`.
//
// A reference model holds every readable register's expected value. After reset and after
// each batch of writes, the testbench sweeps reads over every word address up to 0x1fc, the
// edges of each RAM/ROM window, and addresses that match a register only in their low bits.
// Each read checks that a RAM/ROM window's decode (<R>_RE) is set exactly inside
// [base, base + size * wordSize/8) during the RE pulse. It then checks DATA_RD and READY
// against the model after the clock edge that captures the read, and again one idle cycle later,
// because DATA_RD must hold until the next request (the Memory contract, TSSV#116).
//
// The RAM's read data is its last write (<R>_wdata) and a ROM's is <R>_rdata, which nothing
// drives yet (TSSV#80). So for RAM/ROM the testbench checks that the block routes those signals
// and their <R>_ready after an access to the window, not what they hold.
//
// Timing: inputs change on a falling edge and outputs are checked 1 ns after a falling edge.
// ---------------------------------------------------------------------------
`timescale 1ns / 1ps

module tb_RegisterBlock_read;

  logic clk = 1'b0;
  logic rst_b = 1'b0;
  always #5 clk = ~clk;

  int errors = 0;
  int checks = 0;

  // ---- 32-bit block ----
  memory_32_32 bus32 ();
  logic [31:0] CMD;
  logic        CTRL_field0;
  logic [1:0]  CTRL_field1;
  logic [7:0]  CTRL_field2;
  logic [31:0] SCRATCH;
  logic [11:0] NARROW;
  logic [15:0] STAT;
  logic        STAT_hw_update = 1'b0;
  logic [15:0] STAT_hw_update_val = '0;
  logic [31:0] MEM_rdata, MEM_wdata, MEM_wstrb, TBL_rdata;
  logic        MEM_re, MEM_we, MEM_ready, TBL_re, TBL_ready;
  logic [31:0] HI, FAR;

  regblock_read32 dut32 (
    .clk, .rst_b,
    .CMD, .CTRL_field0, .CTRL_field1, .CTRL_field2, .SCRATCH, .NARROW,
    .STAT, .STAT_hw_update, .STAT_hw_update_val,
    .MEM_rdata, .MEM_re, .MEM_we, .MEM_wdata, .MEM_wstrb, .MEM_ready,
    .TBL_rdata, .TBL_re, .TBL_ready,
    .HI, .FAR,
    .regs (bus32)
  );

  // ---- 64-bit block ----
  memory_64_32 bus64 ();
  logic [63:0] CSR, BUF_rdata, BUF_wdata, HI64;
  logic [63:0] BUF_wstrb;
  logic        BUF_re, BUF_we, BUF_ready;

  regblock_read64 dut64 (
    .clk, .rst_b,
    .CSR, .BUF_rdata, .BUF_re, .BUF_we, .BUF_wdata, .BUF_wstrb, .BUF_ready, .HI (HI64),
    .regs (bus64)
  );

  // ---- reference model (32-bit block) ----
  localparam logic [31:0] CTRL_MASK = 32'h0000_ff07;  // enable [0], mode [2:1], divisor [15:8]
  logic [31:0] m_ctrl, m_scratch, m_hi, m_far, m_mem;
  logic [11:0] m_narrow;
  logic [15:0] m_stat;

  // ---- reference model (64-bit block) ----
  logic [63:0] m_csr, m_buf, m_hi64;

  task automatic check (input string what, input logic [63:0] got, input logic [63:0] exp);
    checks++;
    if (got !== exp) begin
      errors++;
      $display("ERROR %0t: %s: got 0x%0h, expected 0x%0h", $time, what, got, exp);
    end
  endtask

  task automatic write32 (input logic [31:0] addr, input logic [31:0] data);
    @(negedge clk);
    bus32.ADDR = addr; bus32.DATA_WR = data; bus32.WSTRB = '1; bus32.WE = 1'b1;
    @(negedge clk);
    bus32.WE = 1'b0;
  endtask

  task automatic write64 (input logic [31:0] addr, input logic [63:0] data);
    @(negedge clk);
    bus64.ADDR = addr; bus64.DATA_WR = data; bus64.WSTRB = '1; bus64.WE = 1'b1;
    @(negedge clk);
    bus64.WE = 1'b0;
  endtask

  // One read of the 32-bit block at addr, checked against the model
  task automatic read32 (input logic [31:0] addr);
    logic [31:0] exp_data;
    logic        exp_ready, in_mem, in_tbl;
    string       where;
    in_mem = addr >= 32'h20 && addr <= 32'h2f;
    in_tbl = addr >= 32'h40 && addr <= 32'h47;
    exp_data = '0;
    exp_ready = 1'b1;
    unique case (1'b1)
      addr == 32'h4:     exp_data = m_ctrl;
      addr == 32'h8:     exp_data = m_scratch;
      addr == 32'hc:     exp_data = {20'b0, m_narrow};
      addr == 32'h10:    exp_data = {16'b0, m_stat};
      in_mem:            begin exp_data = m_mem; exp_ready = MEM_ready; end
      in_tbl:            begin exp_data = TBL_rdata; exp_ready = TBL_ready; end
      addr == 32'h100:   exp_data = m_hi;
      addr == 32'h12340: exp_data = m_far;
      default: ;  // CMD (WO) and unmapped addresses read 0
    endcase
    @(negedge clk);
    bus32.ADDR = addr; bus32.RE = 1'b1;
    #1;
    where = $sformatf("read32 @0x%0h", addr);
    check({where, " MEM_RE"}, 64'(dut32.MEM_RE), 64'(in_mem));
    check({where, " TBL_RE"}, 64'(dut32.TBL_RE), 64'(in_tbl));
    @(negedge clk);
    bus32.ADDR = 'x; bus32.RE = 1'b0;
    #1;
    check({where, " DATA_RD"}, 64'(bus32.DATA_RD), 64'(exp_data));
    check({where, " READY"}, 64'(bus32.READY), 64'(exp_ready));
    @(negedge clk);
    #1;
    check({where, " DATA_RD held"}, 64'(bus32.DATA_RD), 64'(exp_data));
    check({where, " READY held"}, 64'(bus32.READY), 64'(exp_ready));
  endtask

  task automatic read64 (input logic [31:0] addr);
    logic [63:0] exp_data;
    logic        exp_ready, in_buf;
    string       where;
    in_buf = addr >= 32'h10 && addr <= 32'h1f;
    exp_data = '0;
    exp_ready = 1'b1;
    unique case (1'b1)
      addr == 32'h0:   exp_data = m_csr;
      in_buf:          begin exp_data = m_buf; exp_ready = BUF_ready; end
      addr == 32'h100: exp_data = m_hi64;
      default: ;
    endcase
    @(negedge clk);
    bus64.ADDR = addr; bus64.RE = 1'b1;
    #1;
    where = $sformatf("read64 @0x%0h", addr);
    check({where, " BUF_RE"}, 64'(dut64.BUF_RE), 64'(in_buf));
    @(negedge clk);
    bus64.ADDR = 'x; bus64.RE = 1'b0;
    #1;
    check({where, " DATA_RD"}, bus64.DATA_RD, exp_data);
    check({where, " READY"}, 64'(bus64.READY), 64'(exp_ready));
    @(negedge clk);
    #1;
    check({where, " DATA_RD held"}, bus64.DATA_RD, exp_data);
    check({where, " READY held"}, 64'(bus64.READY), 64'(exp_ready));
  endtask

  // Every word address to 0x1fc, both edges of each window (byte-granular), and addresses that
  // share low bits with a register: an 8-bit decode would alias 0x200 to CMD and 0x104 to CTRL,
  // and a 16-bit one 0x2340 to FAR.
  task automatic sweep32 ();
    for (int a = 0; a < 32'h200; a += 4) read32(32'(a));
    foreach (edges32[i]) read32(edges32[i]);
  endtask
  logic [31:0] edges32[] = '{
    32'h1f, 32'h21, 32'h2e, 32'h2f, 32'h30, 32'h3f, 32'h41, 32'h47, 32'h48, 32'h4b,
    32'h104, 32'h200, 32'h204, 32'h300, 32'h8000_0004, 32'h8000_0100, 32'hffff_fffc,
    32'h2340, 32'h1_2344, 32'h1_233c, 32'h12_2340, 32'h11_2340
  };

  task automatic sweep64 ();
    for (int a = 0; a < 32'h40; a += 4) read64(32'(a));
    foreach (edges64[i]) read64(edges64[i]);
  endtask
  logic [31:0] edges64[] = '{32'hf, 32'h11, 32'h1f, 32'h20, 32'h100, 32'h108, 32'h8000_0000, 32'h8000_0100};

  initial begin
    bus32.ADDR = '0; bus32.DATA_WR = '0; bus32.WSTRB = '0; bus32.RE = 1'b0; bus32.WE = 1'b0;
    bus64.ADDR = '0; bus64.DATA_WR = '0; bus64.WSTRB = '0; bus64.RE = 1'b0; bus64.WE = 1'b0;
    m_ctrl = 32'h0000_1000;  // divisor resets to 0x10
    m_scratch = '0; m_narrow = '0; m_stat = '0; m_mem = '0; m_hi = 32'ha5a5_a5a5; m_far = '0;
    m_csr = '0; m_buf = '0; m_hi64 = '0;
    repeat (2) @(negedge clk);
    rst_b = 1'b1;

    // ---- after reset ----
    sweep32();
    sweep64();

    // ---- a read holds through idle cycles, whatever ADDR does, until the next request ----
    read32(32'h100);
    repeat (3) begin
      @(negedge clk);
      bus32.ADDR = 32'h8;
      #1;
      check("idle after read @0x100 DATA_RD", 64'(bus32.DATA_RD), 64'(m_hi));
      check("idle after read @0x100 READY", 64'(bus32.READY), 64'h1);
    end

    // ---- writes: every register, plus addresses that alias one in its low bits ----
    write32(32'h0, 32'h5555_5555);                    // CMD (WO)
    write32(32'h4, 32'hffff_ffff); m_ctrl = 32'hffff_ffff & CTRL_MASK;
    write32(32'h8, 32'hdead_beef); m_scratch = 32'hdead_beef;
    write32(32'hc, 32'hffff_ffff); m_narrow = 12'hfff;
    write32(32'h20, 32'h1111_1111);
    write32(32'h28, 32'h3333_3333);
    write32(32'h2c, 32'h4444_4444); m_mem = 32'h4444_4444;
    write32(32'h30, 32'h9999_9999);                   // just past MEM's window: no hit
    write32(32'h100, 32'h1234_5678); m_hi = 32'h1234_5678;
    write32(32'h1_2340, 32'hcafe_f00d); m_far = 32'hcafe_f00d;
    write32(32'h8000_0004, 32'h0);                    // aliases CTRL in 8 bits
    write32(32'h2340, 32'h0);                         // aliases FAR in 16 bits
    @(negedge clk);
    STAT_hw_update = 1'b1; STAT_hw_update_val = 16'hbeef;
    @(negedge clk);
    STAT_hw_update = 1'b0; m_stat = 16'hbeef;
    check("CTRL_field0 after 0xffffffff", 64'(CTRL_field0), 64'h1);
    check("CTRL_field1 after 0xffffffff", 64'(CTRL_field1), 64'h3);
    check("CTRL_field2 after 0xffffffff", 64'(CTRL_field2), 64'hff);
    check("MEM_wdata after the window's last write", 64'(MEM_wdata), 64'h4444_4444);
    sweep32();

    // ---- field patterns: each field lands at its own bits ----
    write32(32'h4, 32'h0000_5a04); m_ctrl = 32'h0000_5a04;
    check("CTRL_field0 after 0x5a04", 64'(CTRL_field0), 64'h0);
    check("CTRL_field1 after 0x5a04", 64'(CTRL_field1), 64'h2);
    check("CTRL_field2 after 0x5a04", 64'(CTRL_field2), 64'h5a);
    read32(32'h4);
    write32(32'h4, 32'ha5a5_a5fb); m_ctrl = 32'ha5a5_a5fb & CTRL_MASK;
    check("CTRL_field0 after 0xa5a5a5fb", 64'(CTRL_field0), 64'h1);
    check("CTRL_field1 after 0xa5a5a5fb", 64'(CTRL_field1), 64'h1);
    check("CTRL_field2 after 0xa5a5a5fb", 64'(CTRL_field2), 64'ha5);
    read32(32'h4);

    // ---- 64-bit block: a 2-word RAM spans 16 bytes ----
    write64(32'h0, 64'h0123_4567_89ab_cdef); m_csr = 64'h0123_4567_89ab_cdef;
    write64(32'h18, 64'hfeed_face_dead_beef); m_buf = 64'hfeed_face_dead_beef;
    write64(32'h20, 64'h1);                           // just past BUF's window: no hit
    write64(32'h100, 64'hfedc_ba98_7654_3210); m_hi64 = 64'hfedc_ba98_7654_3210;
    write64(32'h8000_0100, 64'h0);                    // aliases HI in 8 bits
    sweep64();

    if (errors == 0) begin
      $display("tb_RegisterBlock_read: PASS (%0d checks)", checks);
      $finish;
    end else begin
      $fatal(1, "tb_RegisterBlock_read: FAIL (%0d of %0d checks)", errors, checks);
    end
  end

endmodule

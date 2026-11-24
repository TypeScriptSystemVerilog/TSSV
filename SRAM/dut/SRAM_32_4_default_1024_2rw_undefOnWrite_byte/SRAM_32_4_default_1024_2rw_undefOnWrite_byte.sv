`ifndef DEF__SRAM_32_4_default_1024_2rw_undefOnWrite_byte__
`define DEF__SRAM_32_4_default_1024_2rw_undefOnWrite_byte__

module SRAM_32_4_default_1024_2rw_undefOnWrite_byte (
    input logic clk,
    input logic a_re,
    input logic a_we,
    input logic [31:0] a_data_in,
    output logic [31:0] a_data_out,
    input logic [1:0] a_addr,
    input logic [3:0] a_wmask,
    input logic b_re,
    input logic b_we,
    input logic [31:0] b_data_in,
    output logic [31:0] b_data_out,
    input logic [1:0] b_addr,
    input logic [3:0] b_wmask
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 32n
  // depth = 4n
  // macroConfig = default
  // minMacroBits = 1024n
  // ports = 2rw
  // readBehavior = undefOnWrite
  // writeEnableMask = byte
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem: memory
  // a_data_out: memory read data; an SRAM macro's read register has no reset
  // b_data_out: memory read data; an SRAM macro's read register has no reset
  // ------------------------------------------------------------------
  logic [31:0] mem[0:3];
  logic addr_a_equal_b;
  logic w_collision;
  logic a_rw_conflict;
  logic b_rw_conflict;

  assign addr_a_equal_b = a_addr == b_addr;
  assign w_collision = a_we & b_we & addr_a_equal_b;
  assign a_rw_conflict = a_we | (b_we & addr_a_equal_b);
  assign b_rw_conflict = b_we | (a_we & addr_a_equal_b);
  // SV guide COMB-5 waived for mem: a true-dual-port RAM has one write port per process,
  // the form Vivado infers (UG901), and always_ff doesn't allow two processes to write mem
  always @(posedge clk) begin : a_write
    for (int i = 0; i < 4; i++) begin
      if (a_we & a_wmask[i] & ~w_collision) begin
        mem[a_addr][i*8+:8] <= a_data_in[i*8+:8];
      end
    end
`ifndef SYNTHESIS
    // both ports write one word: it becomes X
    if (w_collision) begin
      mem[a_addr] <= 'x;
    end
`endif
  end
  always @(posedge clk) begin : b_write
    for (int i = 0; i < 4; i++) begin
      if (b_we & b_wmask[i] & ~w_collision) begin
        mem[b_addr][i*8+:8] <= b_data_in[i*8+:8];
      end
    end
  end
  always_ff @(posedge clk) begin : a_read
    if (a_re & ~a_rw_conflict) begin
      a_data_out <= mem[a_addr];
    end
`ifndef SYNTHESIS
    if (a_re & a_rw_conflict) begin
      a_data_out <= 'x;
    end
`endif
  end
  always_ff @(posedge clk) begin : b_read
    if (b_re & ~b_rw_conflict) begin
      b_data_out <= mem[b_addr];
    end
`ifndef SYNTHESIS
    if (b_re & b_rw_conflict) begin
      b_data_out <= 'x;
    end
`endif
  end
`ifndef SYNTHESIS
`ifndef NOASSERT_SRAM_RW_CONFLICT
  // undefOnWrite: no read may conflict with a write
  a_no_rw_conflict :
  assert property (@(posedge clk) !(a_re && a_rw_conflict));
  b_no_rw_conflict :
  assert property (@(posedge clk) !(b_re && b_rw_conflict));
`endif
`ifndef NOASSERT_SRAM_W_COLLISION
  // the two ports may not write one word in the same cycle
  no_w_collision :
  assert property (@(posedge clk) !w_collision);
`endif
`endif

endmodule

`endif //!DEF__SRAM_32_4_default_1024_2rw_undefOnWrite_byte__

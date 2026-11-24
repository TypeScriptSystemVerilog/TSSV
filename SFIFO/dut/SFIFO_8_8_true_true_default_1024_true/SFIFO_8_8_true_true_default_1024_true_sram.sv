`ifndef DEF__SFIFO_8_8_true_true_default_1024_true_sram__
`define DEF__SFIFO_8_8_true_true_default_1024_true_sram__

module SFIFO_8_8_true_true_default_1024_true_sram (
    input logic clk,
    input logic a_re,
    output logic [7:0] a_data_out,
    input logic [2:0] a_addr,
    input logic b_we,
    input logic [7:0] b_data_in,
    input logic [2:0] b_addr
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 8n
  // depth = 8n
  // macroConfig = default
  // minMacroBits = 1024n
  // ports = 1r_1w
  // readBehavior = undefOnWrite
  // writeEnableMask = none
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem: memory
  // a_data_out: memory read data; an SRAM macro's read register has no reset
  // ------------------------------------------------------------------
  logic [7:0] mem[0:7];
  logic addr_a_equal_b;
  logic a_rw_conflict;

  assign addr_a_equal_b = a_addr == b_addr;
  assign a_rw_conflict  = b_we & addr_a_equal_b;
  always_ff @(posedge clk) begin : mem_write
    if (b_we) begin
      mem[b_addr] <= b_data_in;
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
`ifndef SYNTHESIS
`ifndef NOASSERT_SRAM_RW_CONFLICT
  // undefOnWrite: no read may conflict with a write
  a_no_rw_conflict :
  assert property (@(posedge clk) !(a_re && a_rw_conflict));
`endif
`endif

endmodule

`endif //!DEF__SFIFO_8_8_true_true_default_1024_true_sram__

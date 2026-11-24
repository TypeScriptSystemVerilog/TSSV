`ifndef DEF__SFIFO_8_5_true_true_default_1024_false_sram__
`define DEF__SFIFO_8_5_true_true_default_1024_false_sram__

module SFIFO_8_5_true_true_default_1024_false_sram (
    input logic clk,
    input logic a_re,
    input logic a_we,
    input logic [7:0] a_data_in,
    output logic [7:0] a_data_out,
    input logic [2:0] a_addr
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 8n
  // depth = 5n
  // macroConfig = default
  // minMacroBits = 1024n
  // ports = 1rw
  // readBehavior = undefOnWrite
  // writeEnableMask = none
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem: memory
  // a_data_out: memory read data; an SRAM macro's read register has no reset
  // ------------------------------------------------------------------
  logic [7:0] mem[0:4];
  logic a_rw_conflict;

  assign a_rw_conflict = a_we;
  always_ff @(posedge clk) begin : mem_write
    if (a_we) begin
      mem[a_addr] <= a_data_in;
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

`endif //!DEF__SFIFO_8_5_true_true_default_1024_false_sram__

`ifndef DEF__SRAM_32_4_default_1024_1r_1w_undefOnWrite_byte__
`define DEF__SRAM_32_4_default_1024_1r_1w_undefOnWrite_byte__

module SRAM_32_4_default_1024_1r_1w_undefOnWrite_byte (
    input logic clk,
    input logic a_re,
    output logic [31:0] a_data_out,
    input logic [1:0] a_addr,
    input logic b_we,
    input logic [31:0] b_data_in,
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
  // ports = 1r_1w
  // readBehavior = undefOnWrite
  // writeEnableMask = byte
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem: memory
  // a_data_out: memory read data; an SRAM macro's read register has no reset
  // ------------------------------------------------------------------
  logic [31:0] mem[0:3];
  logic addr_a_equal_b;
  logic a_rw_conflict;

  assign addr_a_equal_b = a_addr == b_addr;
  assign a_rw_conflict  = b_we & addr_a_equal_b;
  always_ff @(posedge clk) begin : mem_write
    for (int i = 0; i < 4; i++) begin
      if (b_we & b_wmask[i]) begin
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
`ifndef SYNTHESIS
`ifndef NOASSERT_SRAM_RW_CONFLICT
  // undefOnWrite: no read may conflict with a write
  a_no_rw_conflict :
  assert property (@(posedge clk) !(a_re && a_rw_conflict));
`endif
`endif

endmodule

`endif //!DEF__SRAM_32_4_default_1024_1r_1w_undefOnWrite_byte__

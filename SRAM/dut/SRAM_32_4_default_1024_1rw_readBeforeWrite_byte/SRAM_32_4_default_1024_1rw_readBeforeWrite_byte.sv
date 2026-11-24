`ifndef DEF__SRAM_32_4_default_1024_1rw_readBeforeWrite_byte__
`define DEF__SRAM_32_4_default_1024_1rw_readBeforeWrite_byte__

module SRAM_32_4_default_1024_1rw_readBeforeWrite_byte (
    input logic clk,
    input logic a_re,
    input logic a_we,
    input logic [31:0] a_data_in,
    output logic [31:0] a_data_out,
    input logic [1:0] a_addr,
    input logic [3:0] a_wmask
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 32n
  // depth = 4n
  // macroConfig = default
  // minMacroBits = 1024n
  // ports = 1rw
  // readBehavior = readBeforeWrite
  // writeEnableMask = byte
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem: memory
  // a_data_out: memory read data; an SRAM macro's read register has no reset
  // ------------------------------------------------------------------
  logic [31:0] mem[0:3];

  always_ff @(posedge clk) begin : mem_write
    for (int i = 0; i < 4; i++) begin
      if (a_we & a_wmask[i]) begin
        mem[a_addr][i*8+:8] <= a_data_in[i*8+:8];
      end
    end
  end
  always_ff @(posedge clk) begin : a_read
    if (a_re) begin
      a_data_out <= mem[a_addr];
    end
  end

endmodule

`endif //!DEF__SRAM_32_4_default_1024_1rw_readBeforeWrite_byte__

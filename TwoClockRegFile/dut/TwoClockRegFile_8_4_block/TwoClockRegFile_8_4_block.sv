`ifndef DEF__TwoClockRegFile_8_4_block__
`define DEF__TwoClockRegFile_8_4_block__

module TwoClockRegFile_8_4_block (
    input logic a_clk,
    input logic a_we,
    input logic [1:0] a_addr,
    input logic [7:0] a_data_in,
    input logic b_clk,
    input logic b_re,
    input logic [1:0] b_addr,
    output logic [7:0] b_data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 8n
  // depth = 4n
  // fpgaRamStyle = block
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem: memory
  // b_data_out: memory read data; a register file macro's read register has no reset
  // ------------------------------------------------------------------
  (* ram_style = "block" *) logic [7:0] mem[0:3];

  always_ff @(posedge a_clk) begin
    if (a_we) mem[a_addr] <= a_data_in;
  end


  always_ff @(posedge b_clk)
    if (b_re) begin
      b_data_out <= mem[b_addr];
    end

endmodule

`endif //!DEF__TwoClockRegFile_8_4_block__

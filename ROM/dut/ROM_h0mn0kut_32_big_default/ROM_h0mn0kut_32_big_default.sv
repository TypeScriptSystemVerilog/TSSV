`ifndef DEF__ROM_h0mn0kut_32_big_default__
`define DEF__ROM_h0mn0kut_32_big_default__

module ROM_h0mn0kut_32_big_default (
    input logic clk,
    input logic rd_en,
    input logic [1:0] addr,
    output logic [31:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 4 words, hash h0mn0kut, in rom_read
  // dataWidth = 32
  // endianness = big
  // macroConfig = default
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // data_out: ROM read data; a ROM macro's read register has no reset
  // ------------------------------------------------------------------

  always_ff @(posedge clk) begin : rom_read
    if (rd_en) begin
      case (addr)
        2'd0: data_out <= 32'h00010203;
        2'd1: data_out <= 32'h04050607;
        2'd2: data_out <= 32'h08090A0B;
        2'd3: data_out <= 32'h0C0D0E0F;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_h0mn0kut_32_big_default__

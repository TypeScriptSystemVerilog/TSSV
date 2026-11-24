`ifndef DEF__ROM_f3zlaako_32_little_default__
`define DEF__ROM_f3zlaako_32_little_default__

module ROM_f3zlaako_32_little_default (
    input logic clk,
    input logic rd_en,
    input logic [2:0] addr,
    output logic [31:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 5 words, hash f3zlaako, in rom_read
  // dataWidth = 32
  // endianness = little
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
        3'd0: data_out <= 32'h03020100;
        3'd1: data_out <= 32'h07060504;
        3'd2: data_out <= 32'h0B0A0908;
        3'd3: data_out <= 32'h01FF0D0C;
        3'd4: data_out <= 32'h00000020;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_f3zlaako_32_little_default__

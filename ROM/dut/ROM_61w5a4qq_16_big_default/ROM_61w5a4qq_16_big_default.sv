`ifndef DEF__ROM_61w5a4qq_16_big_default__
`define DEF__ROM_61w5a4qq_16_big_default__

module ROM_61w5a4qq_16_big_default (
    input logic clk,
    input logic rd_en,
    input logic [2:0] addr,
    output logic [15:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 6 words, hash 61w5a4qq, in rom_read
  // dataWidth = 16
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
        3'd0: data_out <= 16'hFFFB;
        3'd1: data_out <= 16'hFF01;
        3'd2: data_out <= 16'h0000;
        3'd3: data_out <= 16'h00FF;
        3'd4: data_out <= 16'h7FFF;
        3'd5: data_out <= 16'h8001;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_61w5a4qq_16_big_default__

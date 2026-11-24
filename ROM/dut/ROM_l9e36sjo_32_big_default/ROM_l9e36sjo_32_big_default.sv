`ifndef DEF__ROM_l9e36sjo_32_big_default__
`define DEF__ROM_l9e36sjo_32_big_default__

module ROM_l9e36sjo_32_big_default (
    input logic clk,
    input logic rd_en,
    input logic [3:0] addr,
    output logic [31:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 10 words, hash l9e36sjo, in rom_read
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
        4'd0: data_out <= 32'h0A0B0C0D;
        4'd1: data_out <= 32'h01020304;
        4'd2: data_out <= 32'h0A0A0B0B;
        4'd3: data_out <= 32'h0000FFFF;
        4'd4: data_out <= 32'hFFFF0001;
        4'd5: data_out <= 32'h000000FF;
        4'd6: data_out <= 32'hFFFFFF01;
        4'd7: data_out <= 32'hAAAAAAAA;
        4'd8: data_out <= 32'h00000055;
        4'd9: data_out <= 32'h00559ABC;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_l9e36sjo_32_big_default__

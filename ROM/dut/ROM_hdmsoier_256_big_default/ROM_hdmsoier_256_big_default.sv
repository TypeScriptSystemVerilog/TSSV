`ifndef DEF__ROM_hdmsoier_256_big_default__
`define DEF__ROM_hdmsoier_256_big_default__

module ROM_hdmsoier_256_big_default (
    input logic clk,
    input logic rd_en,
    input logic [1:0] addr,
    output logic [255:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 3 words, hash hdmsoier, in rom_read
  // dataWidth = 256
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
        2'd0: data_out <= 256'hFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        2'd1: data_out <= 256'h0000000000000000000000000000000000000000000000010000000000000001;
        2'd2: data_out <= 256'hFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_hdmsoier_256_big_default__

`ifndef DEF__ROM_15ial7wt_64_big_default__
`define DEF__ROM_15ial7wt_64_big_default__

module ROM_15ial7wt_64_big_default (
    input logic clk,
    input logic rd_en,
    input logic [3:0] addr,
    output logic [63:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 9 words, hash 15ial7wt, in rom_read
  // dataWidth = 64
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
        4'd0: data_out <= 64'h00254A6F94B9DE03;
        4'd1: data_out <= 64'h284D7297BCE1062B;
        4'd2: data_out <= 64'h50759ABFE4092E53;
        4'd3: data_out <= 64'h789DC2E70C31567B;
        4'd4: data_out <= 64'hA0C5EA0F34597EA3;
        4'd5: data_out <= 64'hC8ED12375C81A6CB;
        4'd6: data_out <= 64'hF0153A5F84A9CEF3;
        4'd7: data_out <= 64'h183D6287ACD1F61B;
        4'd8: data_out <= 64'h40658AAFD4F90000;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_15ial7wt_64_big_default__

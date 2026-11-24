`ifndef DEF__ROM_odjo992c_25_big_default__
`define DEF__ROM_odjo992c_25_big_default__

module ROM_odjo992c_25_big_default (
    input logic clk,
    input logic rd_en,
    input logic [3:0] addr,
    output logic [24:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 16 words, hash odjo992c, in rom_read
  // dataWidth = 25
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
        4'd0: data_out <= 25'h0000000;
        4'd1: data_out <= 25'h0000001;
        4'd2: data_out <= 25'h0000002;
        4'd3: data_out <= 25'h0000003;
        4'd4: data_out <= 25'h0000004;
        4'd5: data_out <= 25'h0000005;
        4'd6: data_out <= 25'h0000006;
        4'd7: data_out <= 25'h0000007;
        4'd8: data_out <= 25'h0000008;
        4'd9: data_out <= 25'h0000009;
        4'd10: data_out <= 25'h000000A;
        4'd11: data_out <= 25'h000000B;
        4'd12: data_out <= 25'h000000C;
        4'd13: data_out <= 25'h000000D;
        4'd14: data_out <= 25'h000000E;
        4'd15: data_out <= 25'h000000F;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_odjo992c_25_big_default__

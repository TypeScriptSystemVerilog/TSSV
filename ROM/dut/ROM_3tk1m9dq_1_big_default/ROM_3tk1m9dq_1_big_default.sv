`ifndef DEF__ROM_3tk1m9dq_1_big_default__
`define DEF__ROM_3tk1m9dq_1_big_default__

module ROM_3tk1m9dq_1_big_default (
    input logic clk,
    input logic rd_en,
    input logic [1:0] addr,
    output logic data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // ROMContents = 4 words, hash 3tk1m9dq, in rom_read
  // dataWidth = 1
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
        2'd0: data_out <= 1'h1;
        2'd1: data_out <= 1'h0;
        2'd2: data_out <= 1'h1;
        2'd3: data_out <= 1'h0;
        default: data_out <= 'x;
      endcase
    end
  end


endmodule

`endif //!DEF__ROM_3tk1m9dq_1_big_default__

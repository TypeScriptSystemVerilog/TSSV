`ifndef DEF__ResetWaiverExample__
`define DEF__ResetWaiverExample__

module ResetWaiverExample (
    input logic clk,
    input logic we,
    input logic [1:0] addr,
    input logic [7:0] wdata,
    output logic [7:0] rdata
);

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // mem: memory
  // rdata: memory read data
  // ------------------------------------------------------------------
  logic [7:0] mem[0:3];

  always_ff @(posedge clk) begin : mem_write
    if (we) mem[addr] <= wdata;
  end

  always_ff @(posedge clk) begin
    rdata <= mem[addr];
  end

endmodule

`endif //!DEF__ResetWaiverExample__

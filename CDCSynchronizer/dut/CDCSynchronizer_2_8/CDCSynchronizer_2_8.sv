`ifndef DEF__CDCSynchronizer_2_8__
`define DEF__CDCSynchronizer_2_8__

module CDCSynchronizer_2_8 (
    input logic clk,
    input logic rst_n,
    input logic [7:0] d,
    output logic [7:0] q
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // stages = 2n
  // width = 8n
  // ------------------------------------------------------------------
  (* ASYNC_REG = "TRUE" *)logic [7:0] sync_0;
  (* ASYNC_REG = "TRUE" *)logic [7:0] sync_1;

  assign q = sync_1;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      sync_0 <= '0;
      sync_1 <= '0;
    end else begin
      sync_0 <= d;
      sync_1 <= sync_0;
    end

endmodule

`endif //!DEF__CDCSynchronizer_2_8__

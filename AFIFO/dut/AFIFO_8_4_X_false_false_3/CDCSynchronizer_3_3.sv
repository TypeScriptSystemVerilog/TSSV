`ifndef DEF__CDCSynchronizer_3_3__
`define DEF__CDCSynchronizer_3_3__

module CDCSynchronizer_3_3 (
    input logic clk,
    input logic rst_n,
    input logic [2:0] d,
    output logic [2:0] q
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // stages = 3n
  // width = 3n
  // ------------------------------------------------------------------
  (* ASYNC_REG = "TRUE" *)logic [2:0] sync_0;
  (* ASYNC_REG = "TRUE" *)logic [2:0] sync_1;
  (* ASYNC_REG = "TRUE" *)logic [2:0] sync_2;

  assign q = sync_2;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      sync_0 <= '0;
      sync_1 <= '0;
      sync_2 <= '0;
    end else begin
      sync_0 <= d;
      sync_1 <= sync_0;
      sync_2 <= sync_1;
    end

endmodule

`endif //!DEF__CDCSynchronizer_3_3__

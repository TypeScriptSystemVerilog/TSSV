`ifndef DEF__ContractExample__
`define DEF__ContractExample__

module ContractExample (
    input  logic clk,
    input  logic rst_b,
    input  logic in_valid,
    output logic out_valid
);

  // ------------------------------------------------------------------
  // Port contracts, checked by TSSV's scripts/check-port-contracts.mjs
  // ------------------------------------------------------------------
  // no combinational path from in_valid to out_valid
  // ------------------------------------------------------------------


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      out_valid <= '0;
    end else begin
      out_valid <= in_valid;
    end

endmodule

`endif //!DEF__ContractExample__

`ifndef DEF__LZC_1__
`define DEF__LZC_1__

module LZC_1 (
    input  logic data_in,
    output logic zero_num,
    output logic is_zero
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 1
  // ------------------------------------------------------------------

  assign is_zero  = (data_in == '0);
  assign zero_num = is_zero;

endmodule

`endif //!DEF__LZC_1__

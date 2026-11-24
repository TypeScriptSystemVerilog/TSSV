`ifndef DEF__shift_8_signed_right_7__
`define DEF__shift_8_signed_right_7__

module shift_8_signed_right_7 (
    input  logic [7:0] data_in,
    output logic [7:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 8
  // isSigned = signed
  // shift_direct = right
  // shift_val = 7
  // ------------------------------------------------------------------

  assign data_out = $unsigned($signed(data_in) >>> 3'd7);

endmodule

`endif //!DEF__shift_8_signed_right_7__

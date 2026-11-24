`ifndef DEF__shift_16_unsigned_right_5__
`define DEF__shift_16_unsigned_right_5__

module shift_16_unsigned_right_5 (
    input  logic [15:0] data_in,
    output logic [15:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 16
  // isSigned = unsigned
  // shift_direct = right
  // shift_val = 5
  // ------------------------------------------------------------------

  assign data_out = data_in >> 3'd5;

endmodule

`endif //!DEF__shift_16_unsigned_right_5__

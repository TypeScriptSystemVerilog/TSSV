`ifndef DEF__shift_256_signed_right_255__
`define DEF__shift_256_signed_right_255__

module shift_256_signed_right_255 (
    input  logic [255:0] data_in,
    output logic [255:0] data_out
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 256
  // isSigned = signed
  // shift_direct = right
  // shift_val = 255
  // ------------------------------------------------------------------

  assign data_out = $unsigned($signed(data_in) >>> 8'd255);

endmodule

`endif //!DEF__shift_256_signed_right_255__

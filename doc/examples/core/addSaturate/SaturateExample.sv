`ifndef DEF__SaturateExample__
`define DEF__SaturateExample__

module SaturateExample (
    input  logic signed [11:0] wide,
    output logic signed [ 7:0] narrow
);

  assign narrow = (wide > 12'sd127) ? 8'sd127 : (wide < -12'sd128) ? -8'sd128 : 8'(wide);

endmodule

`endif //!DEF__SaturateExample__

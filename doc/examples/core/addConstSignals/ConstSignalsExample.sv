`ifndef DEF__ConstSignalsExample__
`define DEF__ConstSignalsExample__

module ConstSignalsExample (
    output logic signed [5:0] total
);
  const logic signed [5:0] COEFF_0 = 6'sd3;
  const logic signed [5:0] COEFF_1 = -6'sd5;
  const logic signed [5:0] COEFF_2 = 6'sd12;

  assign total = COEFF_0 + COEFF_1 + COEFF_2;

endmodule

`endif //!DEF__ConstSignalsExample__

`ifndef DEF__RoundExample__
`define DEF__RoundExample__

module RoundExample (
    input  logic signed [15:0] sum,
    output logic signed [ 8:0] rounded
);
  logic signed [16:0] rounded_biased;

  assign rounded_biased = 17'(sum) + (sum[8] ? 17'sd128 : 17'sd127);
  assign rounded = 9'(rounded_biased >>> 8);

endmodule

`endif //!DEF__RoundExample__

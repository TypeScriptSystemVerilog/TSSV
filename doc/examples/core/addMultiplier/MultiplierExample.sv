`ifndef DEF__MultiplierExample__
`define DEF__MultiplierExample__

module MultiplierExample (
    input logic signed [7:0] sample,
    input logic [3:0] gain,
    output logic signed [11:0] scaled
);
  logic signed [11:0] prod_samplexgain;

  assign prod_samplexgain = sample * $signed({1'b0, gain});
  assign scaled = prod_samplexgain;

endmodule

`endif //!DEF__MultiplierExample__

`ifndef DEF__SubtractorExample__
`define DEF__SubtractorExample__

module SubtractorExample (
    input logic signed [7:0] a,
    input logic [7:0] b,
    output logic signed [9:0] y
);
  logic signed [9:0] diff_axb;

  assign diff_axb = a - $signed({1'b0, b});
  assign y = diff_axb;

endmodule

`endif //!DEF__SubtractorExample__

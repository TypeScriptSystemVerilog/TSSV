`ifndef SVIMPORT__sat_add__
`define SVIMPORT__sat_add__
// An existing SystemVerilog module for the example on Module.addSystemVerilogSubmodule():
// an adder that saturates at the top of its range.
module sat_add #(parameter int W = 8) (
  input  logic [W-1:0] a,
  input  logic [W-1:0] b,
  output logic [W-1:0] y
);
  logic [W:0] sum;
  assign sum = a + b;
  assign y = sum[W] ? '1 : sum[W-1:0];
endmodule
`endif //!SVIMPORT__sat_add__

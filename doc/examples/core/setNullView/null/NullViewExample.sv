`ifndef DEF__NullViewExample__
`define DEF__NullViewExample__

module NullViewExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q,
    output logic ready
);
  // Null view of NullViewExample: outputs tied off, inputs unused, nothing below it
  logic unused_inputs;
  assign unused_inputs = &{1'b0, clk, rst_b, d, 1'b0};
  assign q = '0;
  assign ready = 1'd1;
endmodule

`endif //!DEF__NullViewExample__

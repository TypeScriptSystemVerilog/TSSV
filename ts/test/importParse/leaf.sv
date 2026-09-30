// This leaf module takes a byte and returns it.
/* a block comment: module blockcomment ( */
module leaf #(parameter W = 8, parameter N = 4) (
  (* keep *) input  logic signed [N-1:0] s,
  input  logic [W-1:0]   a,
  input  logic           en,
  input  wire            b, c,
  output logic [W-1:0]   y,
  output logic signed [N-1:0] sy
);
  logic my_module ;
  initial $display("module fromstring");
  assign my_module = en;
  assign y = my_module ? a : '0;
  assign sy = (b & c) ? s : '0;
endmodule

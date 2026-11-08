`ifndef DEF__SignalExample__
`define DEF__SignalExample__

module SignalExample (
    input  logic signed [7:0] a,
    output logic signed [7:0] y
);
  logic signed [7:0] neg;

  assign neg = -a;
  assign y   = neg >>> 1;

endmodule

`endif //!DEF__SignalExample__

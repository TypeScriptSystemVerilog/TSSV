`ifndef DEF__LatchAlwaysExample__
`define DEF__LatchAlwaysExample__

module LatchAlwaysExample (
    input logic en,
    input logic [7:0] d,
    output logic [7:0] q
);

  always_latch begin : hold
    if (en) q = d;
  end

endmodule

`endif //!DEF__LatchAlwaysExample__

`ifndef DEF__BodyLineExample__
`define DEF__BodyLineExample__

module BodyLineExample (
    input  logic a,
    output logic y
);

  assign y = ~a;

endmodule

`endif //!DEF__BodyLineExample__

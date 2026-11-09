`ifndef DEF__CombAlwaysExample__
`define DEF__CombAlwaysExample__

module CombAlwaysExample (
    input  logic a,
    input  logic b,
    output logic y
);

  always_comb begin : and_gate
    y = a & b;
  end

endmodule

`endif //!DEF__CombAlwaysExample__

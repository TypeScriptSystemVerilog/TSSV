`ifndef DEF__BodyExample__
`define DEF__BodyExample__

module BodyExample (
    input logic [7:0] data,
    output logic parity
);

  function automatic logic parity_of(input logic [7:0] d);
    return ^d;
  endfunction

  assign parity = parity_of(data);

endmodule

`endif //!DEF__BodyExample__

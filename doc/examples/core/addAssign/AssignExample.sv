`ifndef DEF__AssignExample__
`define DEF__AssignExample__

module AssignExample (
    input  logic [7:0] data,
    input  logic [7:0] mask,
    output logic [7:0] masked
);

  assign masked = data & mask;

endmodule

`endif //!DEF__AssignExample__

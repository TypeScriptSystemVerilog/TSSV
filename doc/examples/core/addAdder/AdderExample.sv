`ifndef DEF__AdderExample__
`define DEF__AdderExample__

module AdderExample (
    input  logic [7:0] count,
    output logic [7:0] next
);

  assign next = 8'(count + 1'd1);

endmodule

`endif //!DEF__AdderExample__

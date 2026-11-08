`ifndef DEF__SVImportExample__
`define DEF__SVImportExample__
`ifdef USE_INCLUDES
`include "sat_add.sv"
`endif //USE_INCLUDES

module SVImportExample (
    input  logic [15:0] x,
    input  logic [15:0] z,
    output logic [15:0] sum
);


  sat_add #(
      .W(16)
  ) u_add (
      .a(x),
      .b(z),
      .y(sum)
  );

endmodule

`endif //!DEF__SVImportExample__

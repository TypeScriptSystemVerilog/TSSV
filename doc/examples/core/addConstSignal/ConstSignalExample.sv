`ifndef DEF__ConstSignalExample__
`define DEF__ConstSignalExample__

module ConstSignalExample (
    input logic [7:0] level,
    output logic full
);
  const logic [7:0] MAX_LEVEL = 8'd200;

  assign full = level >= MAX_LEVEL;

endmodule

`endif //!DEF__ConstSignalExample__

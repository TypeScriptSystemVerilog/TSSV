`ifndef DEF__InterfaceExample__
`define DEF__InterfaceExample__
`ifdef USE_INCLUDES
`include "memory_bidi_32_32.sv"
`endif //USE_INCLUDES

module InterfaceExample (
    output logic [31:0] addr,
    memory_bidi_32_32.inward regs
);

  assign addr = regs.ADDR;

endmodule

`endif //!DEF__InterfaceExample__

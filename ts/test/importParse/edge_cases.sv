// header forms that trip up simple scanners
module edge_ansi import pkg::*; #(parameter type T = logic) (
  axi_if.slave s_axi,
  input var logic [3:0] a [2],
  output my_t q = '0,
  ref int r,
  inout wire [1:0] io,
  mem_if m
);
endmodule

module edge_lead_intf (simple_bus bus, input logic x);
endmodule

module edge_non (a, b, q, t);
  input wire [3:0] a, b;
  output reg q;
  output my_t t;
  task automatic foo; input x; begin end endtask
endmodule

module automatic edge_empty; endmodule

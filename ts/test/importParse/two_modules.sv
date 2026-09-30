module helper (input logic x, output logic z);
  assign z = x;
endmodule

module two_top (input logic a, output logic y);
  helper u_helper (.x(a), .z(y));
endmodule

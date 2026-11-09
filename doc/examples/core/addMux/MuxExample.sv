`ifndef DEF__MuxExample__
`define DEF__MuxExample__

module MuxExample (
    input  logic [3:0] a,
    input  logic [3:0] b,
    input  logic [3:0] c,
    input  logic [1:0] sel,
    output logic [3:0] out
);

  always_comb
    unique case (sel)
      2'd0: out = a;
      2'd1: out = b;
      2'd2: out = c;

      default: out = a;
    endcase

endmodule

`endif //!DEF__MuxExample__

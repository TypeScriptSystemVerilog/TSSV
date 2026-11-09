`ifndef DEF__SubmoduleExample__
`define DEF__SubmoduleExample__
`ifdef USE_INCLUDES
`include "PipeStage.sv"
`endif //USE_INCLUDES

module SubmoduleExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] in,
    output logic [7:0] out
);
  logic [7:0] mid;


  PipeStage stage0 (
      .d(in),
      .q(mid),
      .clk(clk),
      .rst_b(rst_b)
  );

  PipeStage stage1 (
      .d(mid),
      .q(out),
      .clk(clk),
      .rst_b(rst_b)
  );

endmodule

`endif //!DEF__SubmoduleExample__

`ifndef DEF__PipeStage__
`define DEF__PipeStage__

module PipeStage (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q
);


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

endmodule

`endif //!DEF__PipeStage__

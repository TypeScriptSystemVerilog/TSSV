`ifndef DEF__SequentialAlwaysExample__
`define DEF__SequentialAlwaysExample__

module SequentialAlwaysExample (
    input logic clk,
    input logic rst_b,
    output logic [3:0] count
);

  always_ff @(posedge clk or negedge rst_b) begin : count_up
    if (!rst_b) count <= '0;
    else count <= count + 4'd1;
  end

endmodule

`endif //!DEF__SequentialAlwaysExample__

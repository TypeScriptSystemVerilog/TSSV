`ifndef DEF__RegisterExample__
`define DEF__RegisterExample__

module RegisterExample (
    input logic clk,
    input logic rst_b,
    input logic en,
    input logic [7:0] d,
    output logic [7:0] q
);


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else if (en) begin
      q <= d;
    end

endmodule

`endif //!DEF__RegisterExample__

`ifndef DEF__ActiveViewsNestedExample__
`define DEF__ActiveViewsNestedExample__

module ActiveViewsNestedExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q
);
  logic [7:0] d_q;


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      d_q <= '0;
    end else begin
      d_q <= d;
    end

`ifdef TSSV_XILINX
  logic [7:0] x_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      x_q <= '0;
    end else begin
      x_q <= d_q;
    end

`ifdef TSSV_ULTRASCALE

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= x_q;
    end

`else
  assign q = x_q;

`endif

`else
  assign q = d_q;

`endif

endmodule

`endif //!DEF__ActiveViewsNestedExample__

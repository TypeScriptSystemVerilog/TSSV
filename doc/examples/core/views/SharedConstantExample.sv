`ifndef DEF__SharedConstantExample__
`define DEF__SharedConstantExample__
`ifdef USE_INCLUDES
`include "LimitCheck.sv"
`endif //USE_INCLUDES

module SharedConstantExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q,
    output logic fail,
    output logic sim_fail
);
  const logic [7:0] const_w8u200 = 8'd200;


  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      q <= '0;
    end else begin
      q <= d;
    end

  LimitCheck u_chk (
      .value(d),
      .limit(const_w8u200),
      .fail (fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

`ifdef TSSV_SIM

  LimitCheck u_sim_chk (
      .value(q),
      .limit(const_w8u200),
      .fail (sim_fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

`else
  assign sim_fail = 1'b0;

`endif

endmodule

`endif //!DEF__SharedConstantExample__

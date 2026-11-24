`ifndef DEF__ViewIncludesExample__
`define DEF__ViewIncludesExample__
`ifdef USE_INCLUDES
`include "LimitCheck.sv"
`ifdef TSSV_SIM
`include "SaturationMonitor.sv"
`endif
`ifdef TSSV_FPV
`include "SaturationMonitor.sv"
`endif
`endif //USE_INCLUDES

module ViewIncludesExample (
    input logic clk,
    input logic rst_b,
    input logic [7:0] d,
    output logic [7:0] q,
    output logic fail
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
  logic q_fail;
  always_ff @(posedge clk) if (q_fail) $error("q over 200");

  LimitCheck u_q_chk (
      .value(q),
      .limit(const_w8u200),
      .fail (q_fail),
      .clk  (clk),
      .rst_b(rst_b)
  );

  SaturationMonitor u_mon (
      .value(q),
      .clk  (clk)
  );

`endif

`ifdef TSSV_FPV

  SaturationMonitor u_fpv_mon (
      .value(q),
      .clk  (clk)
  );

`endif

endmodule

`endif //!DEF__ViewIncludesExample__

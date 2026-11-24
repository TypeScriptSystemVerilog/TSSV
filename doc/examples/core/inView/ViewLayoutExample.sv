`ifndef DEF__ViewLayoutExample__
`define DEF__ViewLayoutExample__
`ifdef USE_INCLUDES
`ifdef TSSV_SIM
`include "SaturationMonitor.sv"
`endif
`ifdef TSSV_SIM
`include "SaturationMonitor.sv"
`endif
`endif //USE_INCLUDES

module ViewLayoutExample (
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

`ifdef TSSV_SIM
  logic [7:0] d_q;
  logic [7:0] d_inv;
  assign d_inv = ~d_q;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      d_q <= '0;
    end else begin
      d_q <= d;
    end

  SaturationMonitor u_mon (
      .value(d_q),
      .clk  (clk)
  );

  SaturationMonitor u_mon_inv (
      .value(d_inv),
      .clk  (clk)
  );

`ifdef TSSV_TRACE
  always_ff @(posedge clk) $display("d_q = %0d", d_q);

`endif

`endif

endmodule

`endif //!DEF__ViewLayoutExample__

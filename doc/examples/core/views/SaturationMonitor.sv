`ifndef DEF__SaturationMonitor__
`define DEF__SaturationMonitor__

module SaturationMonitor (
    input logic clk,
    input logic [7:0] value
);

  always_ff @(posedge clk) if (value == 8'hff) $error("value saturated");

endmodule

`endif //!DEF__SaturationMonitor__

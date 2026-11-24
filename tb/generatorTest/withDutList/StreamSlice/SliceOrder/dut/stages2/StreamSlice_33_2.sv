`ifndef DEF__StreamSlice_33_2__
`define DEF__StreamSlice_33_2__

module StreamSlice_33_2 (
    input logic clk,
    input logic rst_b,
    input logic in_valid,
    input logic [32:0] in_data,
    input logic out_ready,
    output logic in_ready,
    output logic out_valid,
    output logic [32:0] out_data
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // stages = 2
  // width = 33
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // d_0: RST-3: datapath, read only while v_0 is high
  // d_1: RST-3: datapath, read only while v_1 is high
  // ------------------------------------------------------------------
  logic v_0;
  logic [32:0] d_0;
  logic r_0;
  logic v_1;
  logic [32:0] d_1;
  logic r_1;

  assign r_0 = !v_0 || r_1;
  assign r_1 = !v_1 || out_ready;
  assign in_ready = r_0;
  assign out_valid = v_1;
  assign out_data = d_1;

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      v_0 <= '0;
    end else if (r_0) begin
      v_0 <= in_valid;
    end

  always_ff @(posedge clk or negedge rst_b)
    if (!rst_b) begin
      v_1 <= '0;
    end else if (r_1) begin
      v_1 <= v_0;
    end

  always_ff @(posedge clk)
    if (r_0 && in_valid) begin
      d_0 <= in_data;
    end

  always_ff @(posedge clk)
    if (r_1 && v_0) begin
      d_1 <= d_0;
    end

endmodule

`endif //!DEF__StreamSlice_33_2__

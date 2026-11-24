`ifndef DEF__SFIFO_8_1_false_false_default_1024_true__
`define DEF__SFIFO_8_1_false_false_default_1024_true__

module SFIFO_8_1_false_false_default_1024_true (
    input logic clk,
    input logic rst_n,
    input logic [7:0] push_data,
    output logic [7:0] pop_data,
    output logic empty,
    output logic full,
    output logic curr_depth,
    input logic push_en,
    input logic pop_en
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 8n
  // depth = 1n
  // inclAlmostEmpty = false
  // inclAlmostFull = false
  // macroConfig = default
  // minMacroBits = 1024n
  // simultPushPop = true
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Reset waivers (SV guide RST-5), checked by writeSystemVerilogFiles()
  // ------------------------------------------------------------------
  // bypass_q: RST-3: datapath, read only while the FIFO isn't empty
  // ------------------------------------------------------------------
  logic push_req;
  logic pop_req;
  logic push_fire;
  logic pop_fire;
  logic fifo_cnt_q;
  logic fifo_cnt_nxt;
  logic load_bypass;
  logic [7:0] bypass_q;

  assign push_req  = push_en;
  assign pop_req   = pop_en;
  assign push_fire = push_req && !full;
  assign pop_fire  = pop_req && !empty;
  always_comb begin : fifo_cnt_next
    fifo_cnt_nxt = fifo_cnt_q;
    if (push_fire && !pop_fire) begin
      fifo_cnt_nxt = 1'(fifo_cnt_q + 1'd1);
    end else if (pop_fire && !push_fire) begin
      fifo_cnt_nxt = 1'(fifo_cnt_q - 1'd1);
    end
  end
  assign full = fifo_cnt_q == 1'd1;
  assign empty = fifo_cnt_q == '0;
  assign curr_depth = fifo_cnt_q;
  assign load_bypass = push_fire && (empty || (pop_fire && (fifo_cnt_q == 1'd1)));
  assign pop_data = bypass_q;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) begin
      fifo_cnt_q <= '0;
    end else begin
      fifo_cnt_q <= fifo_cnt_nxt;
    end

  always_ff @(posedge clk)
    if (load_bypass) begin
      bypass_q <= push_data;
    end

endmodule

`endif //!DEF__SFIFO_8_1_false_false_default_1024_true__

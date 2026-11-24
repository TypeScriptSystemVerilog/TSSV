`ifndef DEF__LZC_2__
`define DEF__LZC_2__

module LZC_2 (
    input logic [1:0] data_in,
    output logic [1:0] zero_num,
    output logic is_zero
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 2
  // ------------------------------------------------------------------
  logic cnt;
  logic val1;

  assign is_zero = (data_in == '0);
  always_comb begin : lz_tree
    cnt  = (data_in[1] == '0);
    val1 = cnt ? data_in[0] : data_in[1];
  end
  assign zero_num = val1 ? 2'(cnt) : 2'd2;

endmodule

`endif //!DEF__LZC_2__

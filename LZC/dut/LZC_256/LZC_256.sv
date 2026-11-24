`ifndef DEF__LZC_256__
`define DEF__LZC_256__

module LZC_256 (
    input logic [255:0] data_in,
    output logic [8:0] zero_num,
    output logic is_zero
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // dataWidth = 256
  // ------------------------------------------------------------------
  logic [7:0] cnt;
  logic [127:0] val128;
  logic [63:0] val64;
  logic [31:0] val32;
  logic [15:0] val16;
  logic [7:0] val8;
  logic [3:0] val4;
  logic [1:0] val2;
  logic val1;

  assign is_zero = (data_in == '0);
  always_comb begin : lz_tree
    cnt[7] = (data_in[255:128] == '0);
    val128 = cnt[7] ? data_in[127:0] : data_in[255:128];
    cnt[6] = (val128[127:64] == '0);
    val64  = cnt[6] ? val128[63:0] : val128[127:64];
    cnt[5] = (val64[63:32] == '0);
    val32  = cnt[5] ? val64[31:0] : val64[63:32];
    cnt[4] = (val32[31:16] == '0);
    val16  = cnt[4] ? val32[15:0] : val32[31:16];
    cnt[3] = (val16[15:8] == '0);
    val8   = cnt[3] ? val16[7:0] : val16[15:8];
    cnt[2] = (val8[7:4] == '0);
    val4   = cnt[2] ? val8[3:0] : val8[7:4];
    cnt[1] = (val4[3:2] == '0);
    val2   = cnt[1] ? val4[1:0] : val4[3:2];
    cnt[0] = (val2[1] == '0);
    val1   = cnt[0] ? val2[0] : val2[1];
  end
  assign zero_num = val1 ? 9'(cnt) : 9'd256;

endmodule

`endif //!DEF__LZC_256__

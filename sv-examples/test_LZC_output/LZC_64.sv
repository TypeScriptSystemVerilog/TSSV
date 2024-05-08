
        

        
/* verilator lint_off WIDTH */        
module LZC_64 
   (
   input logic [63:0] data_in,
   output logic [6:0] zero_num,
   output logic  is_zero
   );

   logic [63:0] val64;
   logic [6:0] tmp_cnt;
   logic [31:0] val32;
   logic [15:0] val16;
   logic [7:0] val8;
   logic [3:0] val4;
   logic [1:0] val2;
   logic  val1;

  assign val64 = data_in;
always_comb
   begin
      if(data_in[63:0] == 64'd0) begin
        is_zero = 1'b1;
        tmp_cnt = 7'd64;
      end else begin
        is_zero = 1'b0;
        tmp_cnt[6] = 1'b0;
        tmp_cnt[5] = (val64[63:32] == 32'd0);
        val32 = tmp_cnt[5] ? val64[31:0] : val64[63:32];
        tmp_cnt[4] = (val32[31:16] == 16'd0);
        val16 = tmp_cnt[4] ? val32[15:0] : val32[31:16];
        tmp_cnt[3] = (val16[15:8] == 8'd0);
        val8 = tmp_cnt[3] ? val16[7:0] : val16[15:8];
        tmp_cnt[2] = (val8[7:4] == 4'd0);
        val4 = tmp_cnt[2] ? val8[3:0] : val8[7:4];
        tmp_cnt[1] = (val4[3:2] == 2'd0);
        val2 = tmp_cnt[1] ? val4[1:0] : val4[3:2];
        tmp_cnt[0] = (val2[1:1] == 1'd0);
        val1 = tmp_cnt[0] ? val2[0:0] : val2[1:1];

      end
    end
  assign zero_num = tmp_cnt;


endmodule
/* verilator lint_on WIDTH */        

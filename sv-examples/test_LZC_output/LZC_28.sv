
        

        
/* verilator lint_off WIDTH */        
module LZC_28 
   (
   input logic [27:0] data_in,
   output logic [4:0] zero_num,
   output logic  is_zero
   );

   logic [31:0] val32;
   logic [5:0] tmp_cnt;
   logic [15:0] val16;
   logic [7:0] val8;
   logic [3:0] val4;
   logic [1:0] val2;
   logic  val1;
   logic [5:0] tmp_zero_num;

  assign val32 = {4'd0,data_in};
always_comb
   begin
      if(data_in[27:0] == 28'd0) begin
        is_zero = 1'b1;
        tmp_cnt = 6'd32;
      end else begin
        is_zero = 1'b0;
        tmp_cnt[5] = 1'b0;
        tmp_cnt[4] = (val32[31:16] == 16'd0);
        val16 = tmp_cnt[4] ? val32[15:0] : val32[31:16];
        tmp_cnt[3] = (val16[15:8] == 8'd0);
        val8 = tmp_cnt[3] ? val16[7:0] : val16[15:8];
        tmp_cnt[2] = (val8[7:4] == 4'd0);
        val4 = tmp_cnt[2] ? val8[3:0] : val8[7:4];
        tmp_cnt[1] = (val4[3:2] == 2'd0);
        val2 = tmp_cnt[1] ? val4[1:0] : val4[3:2];
        tmp_cnt[0] = (val2[1:1] == 1'd0);
      end
    end
  assign tmp_zero_num = tmp_cnt - 6'd4;
  assign zero_num = tmp_zero_num[4:0];


endmodule
/* verilator lint_on WIDTH */        

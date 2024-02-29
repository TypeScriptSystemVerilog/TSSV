
/* verilator lint_off WIDTH */        
module FIR_1pmlbrs_5_8_9_2 
   (
   input  clk,
   input  rst_b,
   input  en,
   input signed [7:0] data_in,
   output reg signed [8:0] data_out
   );

   reg signed [7:0] tap_0;
   wire signed [9:0] prod_tap_0x2d2;
   reg signed [7:0] tap_1;
   wire signed [9:0] prod_tap_1xm2sd2;
   reg signed [7:0] tap_2;
   wire signed [10:0] prod_tap_2x3d4;
   reg signed [7:0] tap_3;
   wire signed [10:0] prod_tap_3xm3sd4;
   reg signed [7:0] tap_4;
   wire signed [11:0] prod_tap_4x4d8;
   reg signed [12:0] sum;
   wire signed [11:0] rounded;
   wire signed [8:0] saturated;

   assign prod_tap_0x2d2 = tap_0 * 2'd2;
   assign prod_tap_1xm2sd2 = tap_1 * -2'sd2;
   assign prod_tap_2x3d4 = tap_2 * 3'd4;
   assign prod_tap_3xm3sd4 = tap_3 * -3'sd4;
   assign prod_tap_4x4d8 = tap_4 * 4'd8;
   assign rounded = 12'((sum + (13'd1<<(2-1)))>>>2);
   assign saturated = (rounded > 12'sd255) ? 9'sd255 :
                       ((rounded < -12'sd256) ? -9'sd256 : 9'(rounded));

   always @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           tap_4 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           tap_0 <= data_in;
           tap_1 <= tap_0;
           tap_2 <= tap_1;
           tap_3 <= tap_2;
           tap_4 <= tap_3;
           sum <= 13'(prod_tap_0x2d2) + 13'(prod_tap_1xm2sd2) + 13'(prod_tap_2x3d4) + 13'(prod_tap_3xm3sd4) + 13'(prod_tap_4x4d8);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        

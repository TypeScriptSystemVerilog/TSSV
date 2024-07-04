
        

        
/* verilator lint_off WIDTH */        
module FIR_1o23b0s_8_9_2 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [7:0] data_in,
   output logic signed [8:0] data_out
   );

   logic signed [7:0] tap_0;
   logic signed [9:0] prod_tap_0x3d2;
   logic signed [7:0] tap_1;
   logic signed [9:0] prod_tap_1xm2d2;
   logic signed [7:0] tap_2;
   logic signed [10:0] prod_tap_2x4d4;
   logic signed [7:0] tap_3;
   logic signed [10:0] prod_tap_3xm3d4;
   logic signed [7:0] tap_4;
   logic signed [11:0] prod_tap_4x5d8;
   logic signed [12:0] sum;
   logic signed [11:0] rounded;
   logic signed [8:0] saturated;

   assign prod_tap_0x3d2 = tap_0 * $signed(3'd2);
   assign prod_tap_1xm2d2 = tap_1 * $signed(-2'd2);
   assign prod_tap_2x4d4 = tap_2 * $signed(4'd4);
   assign prod_tap_3xm3d4 = tap_3 * $signed(-3'd4);
   assign prod_tap_4x5d8 = tap_4 * $signed(5'd8);
   assign rounded = (sum + (13'sd1<<<(2-1)))>>>2;
   assign saturated = (rounded > 12'sd255) ? 9'sd255 :
                       ((rounded < $signed(-12'd256)) ? -9'd256 : rounded);

   always_ff @( posedge clk  or negedge rst_b )
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
           sum <= 13'(prod_tap_0x3d2) + 13'(prod_tap_1xm2d2) + 13'(prod_tap_2x4d4) + 13'(prod_tap_3xm3d4) + 13'(prod_tap_4x5d8);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        

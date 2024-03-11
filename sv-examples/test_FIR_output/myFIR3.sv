
        

        
/* verilator lint_off WIDTH */        
module myFIR3 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [5:0] data_in,
   output logic signed [9:0] data_out
   );

   logic signed [5:0] tap_0;
   logic signed [6:0] prod_tap_0x1d1;
   logic signed [5:0] tap_1;
   logic signed [7:0] prod_tap_1xm2sd2;
   logic signed [5:0] tap_2;
   logic signed [7:0] prod_tap_2x2d3;
   logic signed [5:0] tap_3;
   logic signed [8:0] prod_tap_3xm3sd4;
   logic signed [5:0] tap_4;
   logic signed [8:0] prod_tap_4x3d5;
   logic signed [5:0] tap_5;
   logic signed [9:0] prod_tap_5xm4sd6;
   logic signed [5:0] tap_6;
   logic signed [8:0] prod_tap_6x3d7;
   logic signed [5:0] tap_7;
   logic signed [9:0] prod_tap_7xm4sd8;
   logic signed [5:0] tap_8;
   logic signed [9:0] prod_tap_8x4d9;
   logic signed [5:0] tap_9;
   logic signed [10:0] prod_tap_9xm5sd10;
   logic signed [11:0] sum;
   logic signed [9:0] rounded;
   logic signed [9:0] saturated;

   assign prod_tap_0x1d1 = tap_0 * 1'd1;
   assign prod_tap_1xm2sd2 = tap_1 * -2'sd2;
   assign prod_tap_2x2d3 = tap_2 * 2'd3;
   assign prod_tap_3xm3sd4 = tap_3 * -3'sd4;
   assign prod_tap_4x3d5 = tap_4 * 3'd5;
   assign prod_tap_5xm4sd6 = tap_5 * -4'sd6;
   assign prod_tap_6x3d7 = tap_6 * 3'd7;
   assign prod_tap_7xm4sd8 = tap_7 * -4'sd8;
   assign prod_tap_8x4d9 = tap_8 * 4'd9;
   assign prod_tap_9xm5sd10 = tap_9 * -5'sd10;
   assign rounded = 10'((sum + (12'd1<<(3-1)))>>>3);
   assign saturated = (rounded > 10'sd511) ? 10'sd511 :
                       ((rounded < -10'sd512) ? -10'sd512 : 10'(rounded));

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           tap_4 <= 'd0;
           tap_5 <= 'd0;
           tap_6 <= 'd0;
           tap_7 <= 'd0;
           tap_8 <= 'd0;
           tap_9 <= 'd0;
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
           tap_5 <= tap_4;
           tap_6 <= tap_5;
           tap_7 <= tap_6;
           tap_8 <= tap_7;
           tap_9 <= tap_8;
           sum <= 12'(prod_tap_0x1d1) + 12'(prod_tap_1xm2sd2) + 12'(prod_tap_2x2d3) + 12'(prod_tap_3xm3sd4) + 12'(prod_tap_4x3d5) + 12'(prod_tap_5xm4sd6) + 12'(prod_tap_6x3d7) + 12'(prod_tap_7xm4sd8) + 12'(prod_tap_8x4d9) + 12'(prod_tap_9xm5sd10);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        

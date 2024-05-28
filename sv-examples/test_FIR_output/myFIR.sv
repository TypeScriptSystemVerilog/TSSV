
        

        
/* verilator lint_off WIDTH */        
module myFIR 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [7:0] data_in,
   output logic signed [8:0] data_out
   );

   logic signed [7:0] tap_0;
   logic signed [8:0] prod_tap_0x2d1;
   logic signed [7:0] tap_1;
   logic signed [9:0] prod_tap_1x3d2;
   logic signed [7:0] tap_2;
   logic signed [9:0] prod_tap_2x3d3;
   logic signed [7:0] tap_3;
   logic signed [10:0] prod_tap_3x4d4;
   logic signed [11:0] sum;
   logic signed [10:0] rounded;
   logic signed [8:0] saturated;

   assign prod_tap_0x2d1 = tap_0 * $signed(2'd1);
   assign prod_tap_1x3d2 = tap_1 * $signed(3'd2);
   assign prod_tap_2x3d3 = tap_2 * $signed(3'd3);
   assign prod_tap_3x4d4 = tap_3 * $signed(4'd4);
   assign rounded = (sum + (12'sd1<<<(2-1)))>>>2;
   assign saturated = (rounded > 11'sd255) ? 9'sd255 :
                       ((rounded < $signed(-11'd256)) ? -9'd256 : rounded);

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           tap_0 <= data_in;
           tap_1 <= tap_0;
           tap_2 <= tap_1;
           tap_3 <= tap_2;
           sum <= 12'(prod_tap_0x2d1) + 12'(prod_tap_1x3d2) + 12'(prod_tap_2x3d3) + 12'(prod_tap_3x4d4);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        

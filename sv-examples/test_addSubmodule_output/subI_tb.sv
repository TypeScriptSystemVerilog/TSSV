
    // verilator lint_off DECLFILENAME
    // verilator lint_off UNUSED
    
        

        

        
/* verilator lint_off WIDTH */        
module FIR_1p9jptr_8_9_2 
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
   logic signed [9:0] sum;
   logic signed [8:0] rounded;
   logic signed [8:0] saturated;

   assign prod_tap_0x2d1 = tap_0 * $signed(2'd1);
   assign prod_tap_1x3d2 = tap_1 * $signed(3'd2);
   assign rounded = (sum + (10'sd1<<<(2-1)))>>>2;
   assign saturated = (rounded > 9'sd255) ? 9'sd255 :
                       ((rounded < $signed(-9'd256)) ? -9'd256 : rounded);

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           tap_0 <= data_in;
           tap_1 <= tap_0;
           sum <= 10'(prod_tap_0x2d1) + 10'(prod_tap_1x3d2);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module subC_t 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic  en;
   logic signed [7:0] data_in;
   logic signed [8:0] data_out;



    FIR_1p9jptr_8_9_2 FIR
      (
        .clk(clk),
        .rst_b(rst_b),
        .en(en),
        .data_in(data_in),
        .data_out(data_out)        
      );


endmodule
/* verilator lint_on WIDTH */        


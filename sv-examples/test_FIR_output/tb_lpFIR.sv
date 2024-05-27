
/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */

        

        

        
/* verilator lint_off WIDTH */        
module myFIR3 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [7:0] data_in,
   output logic signed [7:0] data_out
   );

   logic signed [7:0] tap_0;
   logic signed [8:0] prod_tap_0xm1d1;
   logic signed [7:0] tap_1;
   logic signed [7:0] prod_tap_1x1d0;
   logic signed [7:0] tap_2;
   logic signed [10:0] prod_tap_2x4d5;
   logic signed [7:0] tap_3;
   logic signed [11:0] prod_tap_3xm4d6;
   logic signed [7:0] tap_4;
   logic signed [12:0] prod_tap_4xm5d10;
   logic signed [7:0] tap_5;
   logic signed [13:0] prod_tap_5x7d38;
   logic signed [7:0] tap_6;
   logic signed [14:0] prod_tap_6x8d77;
   logic signed [7:0] tap_7;
   logic signed [13:0] prod_tap_7x7d38;
   logic signed [7:0] tap_8;
   logic signed [12:0] prod_tap_8xm5d10;
   logic signed [7:0] tap_9;
   logic signed [11:0] prod_tap_9xm4d6;
   logic signed [7:0] tap_10;
   logic signed [10:0] prod_tap_10x4d5;
   logic signed [7:0] tap_11;
   logic signed [7:0] prod_tap_11x1d0;
   logic signed [7:0] tap_12;
   logic signed [8:0] prod_tap_12xm1d1;
   logic signed [15:0] sum;
   logic signed [9:0] rounded;
   logic signed [7:0] saturated;

   assign prod_tap_0xm1d1 = tap_0 * $signed(-1'd1);
   assign prod_tap_1x1d0 = tap_1 * $signed(1'd0);
   assign prod_tap_2x4d5 = tap_2 * $signed(4'd5);
   assign prod_tap_3xm4d6 = tap_3 * $signed(-4'd6);
   assign prod_tap_4xm5d10 = tap_4 * $signed(-5'd10);
   assign prod_tap_5x7d38 = tap_5 * $signed(7'd38);
   assign prod_tap_6x8d77 = tap_6 * $signed(8'd77);
   assign prod_tap_7x7d38 = tap_7 * $signed(7'd38);
   assign prod_tap_8xm5d10 = tap_8 * $signed(-5'd10);
   assign prod_tap_9xm4d6 = tap_9 * $signed(-4'd6);
   assign prod_tap_10x4d5 = tap_10 * $signed(4'd5);
   assign prod_tap_11x1d0 = tap_11 * $signed(1'd0);
   assign prod_tap_12xm1d1 = tap_12 * $signed(-1'd1);
   assign rounded = (sum + (16'sd1<<<(7-1)))>>>7;
   assign saturated = (rounded > 10'sd127) ? 8'sd127 :
                       ((rounded < $signed(-10'd128)) ? -8'd128 : rounded);

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
           tap_10 <= 'd0;
           tap_11 <= 'd0;
           tap_12 <= 'd0;
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
           tap_10 <= tap_9;
           tap_11 <= tap_10;
           tap_12 <= tap_11;
           sum <= 16'(prod_tap_0xm1d1) + 16'(prod_tap_1x1d0) + 16'(prod_tap_2x4d5) + 16'(prod_tap_3xm4d6) + 16'(prod_tap_4xm5d10) + 16'(prod_tap_5x7d38) + 16'(prod_tap_6x8d77) + 16'(prod_tap_7x7d38) + 16'(prod_tap_8xm5d10) + 16'(prod_tap_9xm4d6) + 16'(prod_tap_10x4d5) + 16'(prod_tap_11x1d0) + 16'(prod_tap_12xm1d1);
           data_out <= saturated;
        end

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
           tap_10 <= 'd0;
           tap_11 <= 'd0;
           tap_12 <= 'd0;
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
           tap_10 <= tap_9;
           tap_11 <= tap_10;
           tap_12 <= tap_11;
           sum <= 16'(prod_tap_0xm1d1) + 16'(prod_tap_1x1d0) + 16'(prod_tap_2x4d5) + 16'(prod_tap_3xm4d6) + 16'(prod_tap_4xm5d10) + 16'(prod_tap_5x7d38) + 16'(prod_tap_6x8d77) + 16'(prod_tap_7x7d38) + 16'(prod_tap_8xm5d10) + 16'(prod_tap_9xm4d6) + 16'(prod_tap_10x4d5) + 16'(prod_tap_11x1d0) + 16'(prod_tap_12xm1d1);
           data_out <= saturated;
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_lpFIR 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [4:0] phase;
   logic [15:0] count;
   logic [4:0] step;
   logic  en;
   logic signed [7:0] data_in;
   logic signed [7:0] data_out;


    always @(posedge clk or negedge rst_b)
      if(!rst_b)
        begin
          en <= 1'b1;
          data_in <= 'd0;
          count <= 'd0;
          phase <= 'd0;
          step <= 'd16;
        end
      else
        begin
          en <= 1'b1;
          count <= count + 1'b1;
          if((step > 'd1) && (count[7:0] == 7'd127))
            begin
              step <= step>>1;
            end
          phase <= phase + step;
          data_in <= (phase == 5'd16) ? -8'sd127 : ((phase == 5'd0) ? 8'sd127 :  8'sd0);
          end

    myFIR3 dut
      (
        .clk(clk),
        .rst_b(rst_b),
        .en(en),
        .data_in(data_in),
        .data_out(data_out)        
      );


endmodule
/* verilator lint_on WIDTH */        


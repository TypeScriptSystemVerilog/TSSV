
            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module myFIR3     #(parameter inWidth = 8,
    parameter outWidth = 8,
    parameter rShift = 7)
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
    tap_0 <= 8'h0;
  end
  else if(en)
  begin
  tap_0 <= data_in;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_1 <= 8'h0;
  end
  else if(en)
  begin
  tap_1 <= tap_0;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_2 <= 8'h0;
  end
  else if(en)
  begin
  tap_2 <= tap_1;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_3 <= 8'h0;
  end
  else if(en)
  begin
  tap_3 <= tap_2;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_4 <= 8'h0;
  end
  else if(en)
  begin
  tap_4 <= tap_3;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_5 <= 8'h0;
  end
  else if(en)
  begin
  tap_5 <= tap_4;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_6 <= 8'h0;
  end
  else if(en)
  begin
  tap_6 <= tap_5;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_7 <= 8'h0;
  end
  else if(en)
  begin
  tap_7 <= tap_6;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_8 <= 8'h0;
  end
  else if(en)
  begin
  tap_8 <= tap_7;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_9 <= 8'h0;
  end
  else if(en)
  begin
  tap_9 <= tap_8;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_10 <= 8'h0;
  end
  else if(en)
  begin
  tap_10 <= tap_9;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_11 <= 8'h0;
  end
  else if(en)
  begin
  tap_11 <= tap_10;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    tap_12 <= 8'h0;
  end
  else if(en)
  begin
  tap_12 <= tap_11;
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    sum <= 16'h0;
  end
  else if(en)
  begin
  sum <= 16'(prod_tap_0xm1d1) + 16'(prod_tap_1x1d0) + 16'(prod_tap_2x4d5) + 16'(prod_tap_3xm4d6) + 16'(prod_tap_4xm5d10) + 16'(prod_tap_5x7d38) + 16'(prod_tap_6x8d77) + 16'(prod_tap_7x7d38) + 16'(prod_tap_8xm5d10) + 16'(prod_tap_9xm4d6) + 16'(prod_tap_10x4d5) + 16'(prod_tap_11x1d0) + 16'(prod_tap_12xm1d1);
  end
  
  
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    data_out <= 8'h0;
  end
  else if(en)
  begin
  data_out <= saturated;
  end
  
  
    
    endmodule
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    
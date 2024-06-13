
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module multB_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] prod_6d20x4d7;
   logic signed [13:0] prod_m8d120xm6d19;
   logic signed [11:0] prod_7d57xm6d23;
   logic signed [15:0] prod_m8d91x9d200;


  always @(posedge clk or negedge rst_b) begin
    if (!rst_b) begin
      // Reset logic if needed
    end
    else begin
      if (!(prod_6d20x4d7 == 8'd140)) begin
        $display("Assertion failed: prod_6d20x4d7 should be 140 at time %0t", $time);
      end
      if (!(prod_m8d120xm6d19 == 14'd2280)) begin
        $display("Assertion failed: prod_m8d120xm6d19 should be 2280 at time %0t", $time);
      end
      if (!(prod_7d57xm6d23 == -12'd1311)) begin
        $display("Assertion failed: prod_7d57xm6d23 should be -1311 at time %0t", $time);
      end
      if (!(prod_m8d91x9d200 == -16'd18200)) begin
        $display("Assertion failed: prod_m8d91x9d200 should be -18200 at time %0t", $time);
      end
    end
  end
   assign prod_6d20x4d7 = $signed(6'd20) * 4'd7;
   assign prod_m8d120xm6d19 = $signed(-8'd120) * $signed(-6'd19);
   assign prod_7d57xm6d23 = $signed(7'd57) * -6'd23;
   assign prod_m8d91x9d200 = $signed(-8'd91) * $signed(9'd200);


endmodule
/* verilator lint_on WIDTH */        


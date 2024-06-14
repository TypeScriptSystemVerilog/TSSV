
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module multUB_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [7:0] a;
   logic signed [14:0] prod_axm7d50;


  logic [15:0] count;
  always @(posedge clk or negedge rst_b)
  if(!rst_b)
  begin
  count <= 'd0;
  end
  else
  begin
  count <= count + 1'b1;

  case(count)
  'd0: begin
      a <= -8'd1;
      assert(prod_axm7d50 == 13'd50) else $display("Assertion failed: prod_axm7d50 should be 50 at time %0t", $time);
  end
  'd1: begin
      a <= -8'd25;
      assert(prod_axm7d50 == 13'd1250) else $display("Assertion failed: prod_axm7d50 should be 1250 at time %0t", $time);
  end
  'd2: begin
      a <= -8'd100;
      assert(prod_axm7d50 == 13'd5000) else $display("Assertion failed: prod_axm7d50 should be 5000 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd59;
      assert(prod_axm7d50 == -13'd2950) else $display("Assertion failed: prod_axm7d50 should be 9850 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'd127;
      assert(prod_axm7d50 == -13'd6350) else $display("Assertion failed: prod_axm7d50 should be 6350 at time %0t", $time);
  end
  'd5: begin
      a <= 8'd255;
      assert(prod_axm7d50 == 13'd12750) else $display("Assertion failed: prod_axm7d50 should be 12750 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
  end
  endcase
  end
   assign prod_axm7d50 = a * $signed(-7'd50);


endmodule
/* verilator lint_on WIDTH */        


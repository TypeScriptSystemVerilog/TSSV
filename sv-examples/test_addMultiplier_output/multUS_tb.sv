
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      
        

        
/* verilator lint_off WIDTH */        
module multUS_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] a;
   logic signed [7:0] b;
   logic signed [15:0] prod_axb;


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
      a <= 8'd1;
      b <= 8'd1;
      assert(prod_axb == 16'd1) else $display("Assertion failed: prod_axb should be 1 at time %0t", $time);
  end
  'd1: begin
      a <= 8'd25;
      b <= -8'd1;
      assert(prod_axb == -16'd25) else $display("Assertion failed: prod_axb should be -25 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd100;
      b <= -8'd20;
      assert(prod_axb == 16'd2000) else $display("Assertion failed: prod_axb should be -2000 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd197;
      b <= -8'd73;
      assert(prod_axb == -16'd14381) else $display("Assertion failed: prod_axb should be -14381 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'd127;
      b <= -8'd128;
      assert(prod_axb == -16'd16256) else $display("Assertion failed: prod_axb should be -16256 at time %0t", $time);
  end
  'd5: begin
      a <= 8'd255;
      b <= -8'd128;
      assert(prod_axb == -16'd32640) else $display("Assertion failed: prod_axb should be -32640 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
      b <= 4'b0000;
  end
  endcase
  end
   assign prod_axb = $signed({1'b0,a}) * $signed(b);


endmodule
/* verilator lint_on WIDTH */        


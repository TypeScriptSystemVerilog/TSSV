
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
      assert(prod_axb == 16'd1) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= 8'd25;
      b <= -8'd1;
      assert(prod_axb == 16'd6375) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd100;
      b <= -8'd20;
      assert(prod_axb == 16'd236) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd73;
      b <= -8'd197;
      assert(prod_axb == 16'd14381) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'd127;
      b <= -8'd128;
      assert(prod_axb == 16'd16256) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
      b <= 4'b0000;
  end
  endcase
  end
   assign prod_axb = a * b;


endmodule
/* verilator lint_on WIDTH */        



    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module sub_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] a;
   logic [3:0] b;
   logic [8:0] diff_axb;


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
      a <= 8'b00000001;
      b <= 4'b0001;
      assert(diff_axb == 9'd0) else $display("Assertion failed: diff_axb should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= 8'b00000010;
      b <= 4'b0001;
      assert(diff_axb == 9'd1) else $display("Assertion failed: diff_axb should be 1 at time %0t", $time);
  end
  'd2: begin
      a <= 8'd100;
      b <= 4'd5;
      assert(diff_axb == 9'd95) else $display("Assertion failed: diff_axb should be 95 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd11;
      b <= 4'd9;
      assert(diff_axb == 9'd2) else $display("Assertion failed: diff_axb should be 2 at time %0t", $time);
  end
  'd4: begin 
      a <= 8'b0;
      b <= 4'd15;
      assert(diff_axb == -9'd15) else $display("Assertion failed: diff_axb should be -15 at time %0t", $time);
  end
  default: begin
      a <= 8'b00000000;
      b <= 4'b0000;
  end
  endcase
  end
   assign diff_axb = a - b;


endmodule
/* verilator lint_on WIDTH */        


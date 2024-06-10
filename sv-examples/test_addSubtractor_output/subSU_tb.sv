
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module subSU_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] a;
   logic signed [7:0] b;
   logic signed [8:0] diff_axb;


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
      a <= -8'b0001;
      b <= 8'b0001;
      assert(diff_axb == -9'd2) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd1: begin
      a <= -8'd6;
      b <= 8'd20;
      assert(diff_axb == -9'd26) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd2: begin
      a <= -8'd4;
      b <= 8'd45;
      assert(diff_axb == -9'd49) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd3: begin
      a <= 8'd8;
      b <= 8'd128;
      assert(diff_axb == -9'd120) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  'd4: begin 
      a <= -8'd5;
      b <= 8'd15;
      assert(diff_axb == -9'd20) else $display("Assertion failed: dSig_q should be 0 at time %0t", $time);
  end
  default: begin
      a <= 4'd0;
      b <= 8'd0;
  end
  endcase
  end
   assign diff_axb = a - b;


endmodule
/* verilator lint_on WIDTH */        


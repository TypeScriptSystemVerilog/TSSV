
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        

        
/* verilator lint_off WIDTH */        
module Subber_9_9 
   (
   input logic signed [8:0] a,
   input logic signed [8:0] b,
   output logic signed [9:0] sum
   );

   

   assign sum = a - b;


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module subU_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] a;
   logic [7:0] b;
   logic signed [9:0] sum;
   logic signed [8:0] ext_w1s_a;
   logic signed [8:0] ext_w1s_b;


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
    a <= 8'd213;
    b <= 8'd181;
    assert(sum == 9'd32) else $display("Assertion failed: sum should be 2 at time %0t", $time);
end
'd1: begin
    a <= 8'd46;
    b <= 8'd155;
    assert(sum == -9'd109) else $display("Assertion failed: sum should be 4 at time %0t", $time);
end
'd2: begin
    a <= 8'd135;
    b <= 8'd228;
    assert(sum == -9'd93) else $display("Assertion failed: sum should be 105 at time %0t", $time);
end
'd3: begin
    a <= 8'd108;
    b <= 8'd80;
    assert(sum == 9'd28) else $display("Assertion failed: sum should be 100 at time %0t", $time);
end
'd4: begin 
    a <= 8'd181;
    b <= 8'd98;
    assert(sum == 9'd8) else $display("Assertion failed: sum should be 270 at time %0t", $time);
end
default: begin
    a <= 16'd0;
    b <= 16'd0;
end
endcase
end
  assign ext_w1s_a = {1'd0,a};
  assign ext_w1s_b = {1'd0,b};

    Subber_9_9 sub
      (
        .a(ext_w1s_a),
        .b(ext_w1s_b),
        .sum(sum)        
      );


endmodule
/* verilator lint_on WIDTH */        


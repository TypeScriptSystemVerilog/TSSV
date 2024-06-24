
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        

        
/* verilator lint_off WIDTH */        
module Subber_8_8 
   (
   input logic signed [7:0] a,
   input logic signed [7:0] b,
   output logic signed [8:0] sum
   );

   

   assign sum = a - b;


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module subA_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [7:0] a;
   logic signed [7:0] b;
   logic signed [8:0] sum;


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
    a <= 8'd7;
    b <= -8'd49;
    assert(sum == 9'd56) else $display("Assertion failed: sum should be 2 at time %0t", $time);
end
'd1: begin
    a <= -8'd3;
    b <= -8'd24;
    assert(sum == 9'd21) else $display("Assertion failed: sum should be 4 at time %0t", $time);
end
'd2: begin
    a <= -8'd13;
    b <= -8'd22;
    assert(sum == 9'd9) else $display("Assertion failed: sum should be 105 at time %0t", $time);
end
'd3: begin
    a <= -8'd108;
    b <= 8'd28;
    assert(sum == -9'd136) else $display("Assertion failed: sum should be 100 at time %0t", $time);
end
'd4: begin 
    a <= 8'd98;
    b <= 16'd63;
    assert(sum == 9'd35) else $display("Assertion failed: sum should be 270 at time %0t", $time);
end
default: begin
    a <= 16'd0;
    b <= 16'd0;
end
endcase
end

    Subber_8_8 subtract
      (
        .a(a),
        .b(b),
        .sum(sum)        
      );


endmodule
/* verilator lint_on WIDTH */        



      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      
        

        
/* verilator lint_off WIDTH */        
module assignAdd_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [3:0] a;
   logic [3:0] b;
   logic [4:0] val;


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
    a <= 4'd1;
    b <= 4'd1;
    assert(val == 5'd2) else $display("Assertion failed: val should be 2 at time %0t", $time);
end
'd1: begin
    a <= 4'd7;
    b <= 4'd6;
    assert(val == 5'd13) else $display("Assertion failed: val should be 13 at time %0t", $time);
end
'd2: begin
    a <= 4'd10;
    b <= 4'd11;
    assert(val == 5'd21) else $display("Assertion failed: val should be 21 at time %0t", $time);
end
'd3: begin
    a <= 4'd14;
    b <= 4'd9;
    assert(val == 5'd23) else $display("Assertion failed: val should be 23 at time %0t", $time);
end
'd4: begin 
    a <= 4'd15;
    b <= 4'd15;
    assert(val == 5'd30) else $display("Assertion failed: val should be 30 at time %0t", $time);
end
default: begin
    a <= 4'd0;
    b <= 4'd0;
end
endcase
end
  assign val = a + b;


endmodule
/* verilator lint_on WIDTH */        


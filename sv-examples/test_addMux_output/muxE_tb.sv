
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module muxE_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [4:0] a;
   logic signed [4:0] b;
   logic signed [4:0] c;
   logic signed [4:0] d;
   logic [1:0] sel;
   logic signed [4:0] out;


logic [15:0] count;
always @(posedge clk or negedge rst_b)
if(!rst_b)
begin
  count <= 'd0;
end
else
begin
  count <= count + 1'b1;

a <= 5'd5;
b <= 5'd10;
c <= 5'd15;
d <= 5'd0;

case(count)
'd0: begin
    sel <= 2'b00;
    assert(out == 5'd5) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd1: begin
    sel <= 2'b01;
    assert(out == 5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd2: begin
    sel <= 2'b10;
    assert(out == 5'd15) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
end
'd3: begin
    sel <= 2'b11;
    assert(out == 5'd0) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd4: begin 
    sel <= 2'b01;
    assert(out == 5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
default: sel <= 2'd0;
endcase
end
  always_comb
    unique case(~sel)
      2'd0: out = a-5;
      2'd1: out = b+5;
      2'd2: out = c-5;
      2'd3: out = d+5;

      default: out = {5{1'bx}};
    endcase


endmodule
/* verilator lint_on WIDTH */        


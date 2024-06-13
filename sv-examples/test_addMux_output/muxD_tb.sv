
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
   logic signed [4:0] e;
   logic [2:0] sel;
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

a <= -5'd10;
b <= -5'd5;
c <= 5'd0;
d <= 5'd5;
e <= 5'd10;

case(count)
'd0: begin
    sel <= 3'd0;
    assert(out == -5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd1: begin
    sel <= 3'd1;
    assert(out == -5'd5) else $fatal("Assertion failed: out should be -5 at time %0t", $time);
end
'd2: begin
    sel <= 3'd2;
    assert(out == 5'd0) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd3: begin
    sel <= 3'd3;
    assert(out == 5'd5) else $fatal("Assertion failed: out should be 5 at time %0t", $time);
end
'd4: begin 
    sel <= 3'd4;
    assert(out == 5'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd5: begin
    sel <= 3'd5;
    assert(out == 5'd11) else $fatal("Assertion failed: out should be 11 at time %0t", $time);
end
default: sel <= 3'd0;
endcase
end
  always_comb
    unique case(sel)
      3'd0: out = a;
      3'd1: out = b;
      3'd2: out = c;
      3'd3: out = d;
      3'd4: out = e;

      default: out = 5'd11;
    endcase


endmodule
/* verilator lint_on WIDTH */        



  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module mux_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [3:0] a;
   logic [3:0] b;
   logic [3:0] c;
   logic [3:0] d;
   logic [1:0] sel;
   logic [3:0] out;


logic [15:0] count;
always @(posedge clk or negedge rst_b)
if(!rst_b)
begin
  count <= 'd0;
end
else
begin
  count <= count + 1'b1;

a <= 4'd3;
b <= 4'd6;
c <= 4'd9;
d <= 4'd12;

case(count)
'd0: begin
    sel <= 2'd0;
    assert(out == 4'd3) else $fatal("Assertion failed: out should be 3 at time %0t", $time);
end
'd1: begin
    sel <= 2'd1;
    assert(out == 4'd6) else $fatal("Assertion failed: out should be 6 at time %0t", $time);
end
'd2: begin
    sel <= 2'd2;
    assert(out == 4'd9) else $fatal("Assertion failed: out should be 9 at time %0t", $time);
end
'd3: begin
    sel <= 2'd3;
    assert(out == 4'd12) else $fatal("Assertion failed: out should be 12 at time %0t", $time);
end
'd4: begin 
    sel <= 2'd1;
    assert(out == 4'd6) else $fatal("Assertion failed: out should be 6 at time %0t", $time);
end
default: sel <= 4'd0;
endcase
end
  always_comb
    unique case(sel)
      2'd0: out = a;
      2'd1: out = b;
      2'd2: out = c;
      2'd3: out = d;

      default: out = {4{1'bx}};
    endcase


endmodule
/* verilator lint_on WIDTH */        


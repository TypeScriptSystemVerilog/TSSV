
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module muxS_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [15:0] a;
   logic signed [15:0] b;
   logic signed [15:0] c;
   logic signed [15:0] d;
   logic signed [15:0] e;
   logic signed [15:0] f;
   logic signed [15:0] g;
   logic signed [15:0] h;
   logic [3:0] sel;
   logic signed [15:0] out;


logic [15:0] count;
always @(posedge clk or negedge rst_b)
if(!rst_b)
begin
  count <= 'd0;
end
else
begin
  count <= count + 1'b1;

a <= 16'd40;
b <= 16'd30;
c <= 16'd20;
d <= 16'd10;
e <= 16'd0;
f <= -16'd10;
g <= -16'd20;
h <= -16'd30;

case(count)
'd0: begin
    sel <= 4'd0;
    assert(out == 16'd40) else $fatal("Assertion failed: out should be 40 at time %0t", $time);
end
'd1: begin
    sel <= 4'd1;
    assert(out == 16'd30) else $fatal("Assertion failed: out should be 30 at time %0t", $time);
end
'd2: begin
    sel <= 4'd2;
    assert(out == 16'd20) else $fatal("Assertion failed: out should be 20 at time %0t", $time);
end
'd3: begin
    sel <= 4'd3;
    assert(out == 16'd10) else $fatal("Assertion failed: out should be 10 at time %0t", $time);
end
'd4: begin 
    sel <= 4'd4;
    assert(out == 16'd0) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
end
'd5: begin 
    sel <= 4'd5;
    assert(out == -16'd10) else $fatal("Assertion failed: out should be -10 at time %0t", $time);
end
'd6: begin 
    sel <= 4'd6;
    assert(out == -16'd20) else $fatal("Assertion failed: out should be -20 at time %0t", $time);
end
'd7: begin 
    sel <= 4'd7;
    assert(out == -16'd30) else $fatal("Assertion failed: out should be -30 at time %0t", $time);
end
default: sel <= 4'd0;
endcase
end
  always_comb
    unique case(sel[2:0])
      3'd0: out = a;
      3'd1: out = b;
      3'd2: out = c;
      3'd3: out = d;
      3'd4: out = e;
      3'd5: out = f;
      3'd6: out = g;
      3'd7: out = h;

      default: out = {16{1'bx}};
    endcase


endmodule
/* verilator lint_on WIDTH */        


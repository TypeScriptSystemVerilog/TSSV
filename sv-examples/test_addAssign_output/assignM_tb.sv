
      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      
        

        
/* verilator lint_off WIDTH */        
module assignM_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] a;
   logic [7:0] b;
   logic [7:0] c;
   logic [7:0] d;
   logic [7:0] e;
   logic signed [15:0] val;


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
    c <= 8'd1;
    d <= 8'd1;
    e <= 8'd1;
    assert(val == 16'd1) else $display("Assertion failed: val should be 1 at time %0t", $time);
end
'd1: begin
    a <= 8'd5;
    b <= 8'd4;
    c <= 8'd3;
    d <= 8'd2;
    e <= 8'd1;
    assert(val == 16'd3) else $display("Assertion failed: val should be 3 at time %0t", $time);
end
'd2: begin
    a <= 8'd10;
    b <= 8'd10;
    c <= 8'd10;
    d <= 8'd10;
    e <= 8'd10;
    assert(val == 16'd10) else $display("Assertion failed: val should be 10 at time %0t", $time);
end
'd3: begin
    a <= 8'd79;
    b <= 8'd89;
    c <= 8'd28;
    d <= 8'd43;
    e <= 8'd14;
    assert(val == 16'd168) else $display("Assertion failed: val should be 168 at time %0t", $time);
end
'd4: begin 
    a <= 8'd255;
    b <= 8'd255;
    c <= 8'd255;
    d <= 8'd255;
    e <= 8'd255;
    assert(val == -16'd255) else $display("Assertion failed: val should be 255 at time %0t", $time);
end
default: begin
    a <= 8'd0;
    b <= 8'd0;
    c <= 8'd0;
    d <= 8'd0;
    e <= 8'd0;
end
endcase
end
  assign val = a + b - ((c / d) * e);


endmodule
/* verilator lint_on WIDTH */        



      /* verilator lint_off DECLFILENAME */
      /* verilator lint_off UNUSED */
      
        

        
/* verilator lint_off WIDTH */        
module assign_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] in;
   logic [5:0] val;


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
    in <= 8'b00111111;
    assert(val == 6'b111111) else $display("Assertion failed: val should be 63 at time %0t", $time);
end
'd1: begin
    in <= 8'b11000000;
    assert(val == 6'b000000) else $display("Assertion failed: val should be 0 at time %0t", $time);
end
'd2: begin
    in <= 8'd50;
    assert(val == 6'd50) else $display("Assertion failed: val should be 50 at time %0t", $time);
end
'd3: begin
    in <= 8'd255;
    assert(val == 6'd63) else $display("Assertion failed: val should be 63 at time %0t", $time);
end
'd4: begin 
    in <= 8'b10000001;
    assert(val == 6'b000001) else $display("Assertion failed: val should be 1 at time %0t", $time);
end
default: begin
    in <= 8'b0;
end
endcase
end
  assign val = in;


endmodule
/* verilator lint_on WIDTH */        


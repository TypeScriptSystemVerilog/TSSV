
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module sub_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [15:0] a;
   logic signed [15:0] b;
   logic signed [17:0] sum;


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
    a <= 16'd7641;
    b <= 16'd4611;
    assert(sum == 17'd12252) else $display("Assertion failed: sum should be 2 at time %0t", $time);
end
'd1: begin
    a <= -16'd20785;
    b <= -16'd6903;
    assert(sum == -17'd27688) else $display("Assertion failed: sum should be 4 at time %0t", $time);
end
'd2: begin
    a <= 16'd20025;
    b <= -16'd11168;
    assert(sum == 17'd8857) else $display("Assertion failed: sum should be 105 at time %0t", $time);
end
'd3: begin
    a <= -16'd30974;
    b <= 16'd26651;
    assert(sum == -17'd4323) else $display("Assertion failed: sum should be 100 at time %0t", $time);
end
'd4: begin 
    a <= 16'd15349;
    b <= -16'd6500;
    assert(sum == 17'd8849) else $display("Assertion failed: sum should be 270 at time %0t", $time);
end
default: begin
    a <= 16'd0;
    b <= 16'd0;
end
endcase
end
   assign sum = $signed(a) + $signed({1'b0,b});


endmodule
/* verilator lint_on WIDTH */        



  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module seq_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [3:0] count;
   logic [4:0] doubleCount;


logic [15:0] count_n;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
    count_n <= 'd0;
    end
    else
    begin
    count_n <= count_n + 1'b1;

    case(count_n)
    'd0: begin
        assert(count == 4'd15) else $display("Assertion failed: count should be 15 at time %0t", $time);
        assert(doubleCount == 5'd0) else $display("Assertion failed: doubleCount should be 0 at time %0t", $time);
    end
    'd1: begin
        assert(count == 4'd14) else $display("Assertion failed: count should be 14 at time %0t", $time);
        assert(doubleCount == 5'd30) else $display("Assertion failed: doubleCount should be 30 at time %0t", $time);
    end
    'd2: begin
        assert(count == 4'd13) else $display("Assertion failed: count should be 13 at time %0t", $time);
        assert(doubleCount == 5'd28) else $display("Assertion failed: doubleCount should be 28 at time %0t", $time);
    end
    'd3: begin
        assert(count == 4'd12) else $display("Assertion failed: count should be 12 at time %0t", $time);
        assert(doubleCount == 5'd26) else $display("Assertion failed: doubleCount should be 26 at time %0t", $time);
    end
    'd4: begin 
        assert(count == 4'd11) else $display("Assertion failed: count should be 11 at time %0t", $time);
        assert(doubleCount == 5'd24) else $display("Assertion failed: doubleCount should be 0 at time %0t", $time);
    end
    endcase
    end
always_ff @( posedge clk or negedge rst_b )

if (!rst_b) begin
    count <= 4'b1111; // Reset the counter
end
else begin
    count <= count - 1; // Decrement the counter
    doubleCount <= 2*count; // delayed 1 cycle
end



endmodule
/* verilator lint_on WIDTH */        


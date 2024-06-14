
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module comb_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] a;
   logic [7:0] b;
   logic [8:0] out;


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
        a <= 8'b00000001;
        b <= 8'b00000001;
        assert(out == 9'd2) else $display("Assertion failed: out should be 2 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 8'b00000010;
        assert(out == 9'd4) else $display("Assertion failed: out should be 4 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 8'd5;
        assert(out == 9'd105) else $display("Assertion failed: out should be 105 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 8'd11;
        assert(out == 9'd100) else $display("Assertion failed: out should be 100 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b11111111;
        b <= 8'b00001111;
        assert(out == 9'd270) else $display("Assertion failed: out should be 270 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 8'b00000000;
    end
    endcase
    end
always @( a or b )

out = a + b;


endmodule
/* verilator lint_on WIDTH */        


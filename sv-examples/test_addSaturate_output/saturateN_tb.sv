
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module saturateN_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] in;
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

    case(count)
    'd0: begin
        in <= 8'b00000000;
        assert(out == 4'b0000) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 8'b00000001;
        assert(out == 4'b0001) else $fatal("Assertion failed: out should be 1 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00001111;
        assert(out == 4'b1111) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
    end
    'd3: begin
        in <= 8'b00100101;
        assert(out == 4'b0101) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'b10000000;
        assert(out == 4'd0) else $fatal("Assertion failed: out should be 15 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
   assign out = in[4:0];


endmodule
/* verilator lint_on WIDTH */        


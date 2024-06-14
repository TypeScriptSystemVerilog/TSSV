
/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */

        

        
/* verilator lint_off WIDTH */        
module roundS_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [3:0] in;
   logic signed [7:0] rounded;


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
        in <= 4'd0;
        assert(rounded == 8'd0) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 4'd1;
        assert(rounded == 8'd1) else $fatal("Assertion failed: rounded should be 1 at time %0t", $time);
    end
    'd2: begin
        in <= -4'd1;
        assert(rounded == -8'd1) else $fatal("Assertion failed: rounded should be -1 at time %0t", $time);
    end
    'd3: begin
        in <= -4'd8;
        assert(rounded == -8'd8) else $fatal("Assertion failed: rounded should be -8 at time %0t", $time);
    end
    'd4: begin 
        in <= 4'd7;
        assert(rounded == 8'd7) else $fatal("Assertion failed: rounded should be 7 at time %0t", $time);
    end
    default: in <= 4'd0;
    endcase
    end
   assign rounded = (in + (4'sd1<<<(0-1)))>>>0;


endmodule
/* verilator lint_on WIDTH */        


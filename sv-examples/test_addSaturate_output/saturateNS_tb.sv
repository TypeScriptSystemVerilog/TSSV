
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module saturateNS_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [7:0] in;
   logic signed [3:0] out;


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
        in <= -8'd18;
        assert(out == -4'd2) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= -8'd15;
        assert(out == -4'd1) else $fatal("Assertion failed: out should be -8 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00010010;
        assert(out == 4'd2) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd3: begin
        in <= -8'd7;
        assert(out == -4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'd12;
        assert(out == 4'd4) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
   assign out = (in > 8'sd7) ? 
                       {1'b0,(in[4-2:0])} : 
                       ((in < $signed(-8'd8)) ? 
                       {1'b1,(in[4-2:0])} : 
                       in[4-1:0]);


endmodule
/* verilator lint_on WIDTH */        


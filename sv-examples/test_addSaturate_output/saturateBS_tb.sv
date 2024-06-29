
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module saturateBS_tb 
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
        assert(out == -4'd7) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= -8'd15;
        assert(out == -4'd7) else $fatal("Assertion failed: out should be -8 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00010010;
        assert(out == 4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd3: begin
        in <= -8'd7;
        assert(out == -4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'd12;
        assert(out == 4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd5: begin
        in <= -8'd4;
        assert(out == -4'd4) else $fatal("Assertion failed: out should be 4 at time %0t", $time);
    end
    'd6: begin
        in <= 8'd4;
        assert(out == 4'd4) else $fatal("Assertion failed: out should be 4 at time %0t", $time);
    end
    'd7: begin
        in <= 8'd6;
        assert(out == 4'd6) else $fatal("Assertion failed: out should be 6 at time %0t", $time);
    end
    'd8: begin
        in <= -8'd6;
        assert(out == -4'd6) else $fatal("Assertion failed: out should be 6 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
   assign out = (in > 8'sd7) ? 4'sd7 :
                      ((in < $signed(-8'd8)) ? -4'd8+1 : in);


endmodule
/* verilator lint_on WIDTH */        


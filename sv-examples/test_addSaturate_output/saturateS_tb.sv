
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module saturateS_tb 
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
        in <= 8'b00000000;
        assert(out == 4'b0000) else $fatal("Assertion failed: out should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 8'b11110001;
        assert(out == -4'd8) else $fatal("Assertion failed: out should be -8 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00010010;
        assert(out == 4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd3: begin
        in <= 8'b00100000;
        assert(out == 4'd7) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'b10000000;
        assert(out == -4'd8) else $fatal("Assertion failed: out should be 7 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
   assign out = (in > 8'sd7) ? 4'sd7 :
                       ((in < $signed(-8'd8)) ? -4'd8 : in);


endmodule
/* verilator lint_on WIDTH */        


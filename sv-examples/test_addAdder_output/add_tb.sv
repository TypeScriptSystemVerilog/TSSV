
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module add_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] a;
   logic [3:0] b;
   logic [8:0] sum_axb;


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
        b <= 4'b0001;
        assert(sum_axb == 12'd2) else $display("Assertion failed: sum_axb should be 2 at time %0t", $time);
    end
    'd1: begin
        a <= 8'b00000010;
        b <= 4'b0010;
        assert(sum_axb == 12'd4) else $display("Assertion failed: sum_axb should be 4 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd100;
        b <= 4'd5;
        assert(sum_axb == 12'd105) else $display("Assertion failed: sum_axb should be 105 at time %0t", $time);
    end
    'd3: begin
        a <= 8'd89;
        b <= 4'd11;
        assert(sum_axb == 12'd100) else $display("Assertion failed: sum_axb should be 100 at time %0t", $time);
    end
    'd4: begin 
        a <= 8'b11111111;
        b <= 4'b1111;
        assert(sum_axb == 12'd270) else $display("Assertion failed: sum_axb should be 270 at time %0t", $time);
    end
    default: begin
        a <= 8'b00000000;
        b <= 4'b0000;
    end
    endcase
    end
   assign sum_axb = a + b;


endmodule
/* verilator lint_on WIDTH */        



    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module addS_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic signed [7:0] a;
   logic signed [7:0] b;
   logic signed [8:0] sum_axb;


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
        a <= -8'd1;
        b <= 8'd1;
        assert(sum_axb == 16'd0) else $display("Assertion failed: sum_axb should be 0 at time %0t", $time);
    end
    'd1: begin
        a <= -8'd47;
        b <= 8'd29;
        assert(sum_axb == -16'd18) else $display("Assertion failed: sum_axb should be -18 at time %0t", $time);
    end
    'd2: begin
        a <= 8'd115;
        b <= -8'd34;
        assert(sum_axb == 16'd81) else $display("Assertion failed: sum_axb should be 81 at time %0t", $time);
    end
    'd3: begin
        a <= -8'd50;
        b <= 8'd50;
        assert(sum_axb == 16'd0) else $display("Assertion failed: sum_axb should be 0 at time %0t", $time);
    end
    'd4: begin 
        a <= -8'd128;
        b <= -8'd128;
        assert(sum_axb == -16'd256) else $display("Assertion failed: sum_axb should be -256 at time %0t", $time);
    end
    default: begin
        a <= 8'd0;
        b <= 8'd0;
    end
    endcase
    end
   assign sum_axb = $signed(a) + $signed({1'b0,b});


endmodule
/* verilator lint_on WIDTH */        


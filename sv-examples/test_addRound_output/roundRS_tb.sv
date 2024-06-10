
/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */

        

        
/* verilator lint_off WIDTH */        
module roundRS_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [4:0] in;
   logic [7:0] rounded;
   logic [3:0] shift;


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
        in <= 5'b00000;
        shift <= 4'd0;
        assert(rounded == 8'b00000000) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 5'b00011;
        shift <= 4'd1;
        assert(rounded == 8'b00000010) else $fatal("Assertion failed: rounded should be 2 at time %0t", $time);
    end
    'd2: begin
        in <= 5'd12; // 01100 >> 3 = 00001.1 = 1.5 rounds up to 2
        shift <= 4'd3;
        assert(rounded == 8'd3) else $fatal("Assertion failed: rounded should be 3 at time %0t", $time);
    end
    'd3: begin
        in <= 5'b01001;
        shift <= 4'd2;
        assert(rounded == 8'b00000010) else $fatal("Assertion failed: rounded should be 2 at time %0t", $time);
    end
    'd4: begin  // 10110 is 22 shifted by 2 becomes 00101.1 which is 5.5 which rounds up to 6
        in <= 5'd22; 
        shift <= 4'd2;
        assert(rounded == 8'd6) else $fatal("Assertion failed: rounded should be 6 at time %0t", $time);
    end
    default: begin
        in <= 4'd0;
        shift <= 4'd0;
    end
    endcase
    end
   assign rounded = (in + (5'sd1<<<(shift-1)))>>>shift;


endmodule
/* verilator lint_on WIDTH */        


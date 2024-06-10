
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module round_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] in;
   logic [6:0] rounded;


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
        assert(rounded == 7'b0000000) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd1: begin
        in <= 8'b00000001;
       assert(rounded == 7'b0000000) else $fatal("Assertion failed: rounded should be 0 at time %0t", $time);
    end
    'd2: begin
        in <= 8'b00000010;
        assert(rounded == 7'b0000001) else $fatal("Assertion failed: rounded should be 1 at time %0t", $time);
    end
    'd3: begin
        in <= 8'b00100000;
        assert(rounded == 7'b0010000) else $fatal("Assertion failed: rounded should be 16 at time %0t", $time);
    end
    'd4: begin 
        in <= 8'b10000000;
        assert(rounded == 7'b1000000) else $fatal("Assertion failed: rounded should be 64 at time %0t", $time);
    end
    default: in <= 8'b00000000;
    endcase
    end
   assign rounded = (in + (8'sd1<<<(1-1)))>>>1;


endmodule
/* verilator lint_on WIDTH */        



    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module addRegisterBW_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] d;
   logic [3:0] q;


    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
      count <= 'd0;
    end
    else
    begin
      count <= count + 1'b1;

    case (count)
      'd0: begin
        d <= 8'b00000000;
        assert(q == 4'b0000) else $fatal("Assertion failed: q should be 8'b0000 at count %0d", count);
      end
      'd1: begin
        d <= 8'b00000001;
        assert(q == 8'b0000) else $fatal("Assertion failed: q should be 8'b00000 at count %0d", count);
      end
      'd2: begin
        d <= 8'b00010010;
        assert(q == 8'b0001) else $fatal("Assertion failed: q should be 8'b0001 at count %0d", count);
      end
      'd3: begin
        d <= 8'b10000011;
        assert(q == 8'b0010) else $fatal("Assertion failed: q should be 8'b0010 at count %0d", count);
      end
      'd4: begin
        d <= 8'b00100100;
        assert(q == 8'b0011) else $fatal("Assertion failed: q should be 8'b0011 at count %0d", count);
      end
      default: begin
        d <= 8'b00000000;
        assert(q == 8'b0100) else $fatal("Assertion failed: q should be 8'b0100 at count %0d", count);
      end
    endcase
    end

   always_ff @( posedge clk  )
   
        begin
           q <= d;
        end


endmodule
/* verilator lint_on WIDTH */        



    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module addRegisterWidth_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [3:0] dSig2;
   logic [3:0] dSig2_q;


    logic [15:0] count;
    
    always @(posedge clk or negedge rst_b)
      if (!rst_b)
        count <= 'd0;
      else begin
        count <= count + 1'b1;

    case (count)
    'd0: begin
      dSig2 <= 4'b0000;
      assert(dSig2_q == 4'b0000) else $fatal("Assertion failed: dSig2_q should be 4'b0000 at count %0d", count);
    end
    'd1: begin
      dSig2 <= 4'b0001;
      assert(dSig2_q == 4'b0000) else $fatal("Assertion failed: dSig2_q should be 4'b0000 at count %0d", count);
    end
    'd2: begin
      dSig2 <= 4'b0010;
      assert(dSig2_q == 4'b0001) else $fatal("Assertion failed: dSig2_q should be 4'b0001 at count %0d", count);
    end
    'd3: begin
      dSig2 <= 4'b0011;
      assert(dSig2_q == 4'b0010) else $fatal("Assertion failed: dSig2_q should be 4'b0010 at count %0d", count);
    end
    'd4: begin
      dSig2 <= 4'b0100;
      assert(dSig2_q == 4'b0011) else $fatal("Assertion failed: dSig2_q should be 4'b0011 at count %0d", count);
    end
    default: begin
      dSig2 <= 4'b0000;
      assert(dSig2_q == 4'b0100) else $fatal("Assertion failed: dSig2_q should be 4'b0100 at count %0d", count);
    end
    endcase
    end

   always_ff @( posedge clk  )
   
        begin
           dSig2_q <= dSig2;
        end


endmodule
/* verilator lint_on WIDTH */        


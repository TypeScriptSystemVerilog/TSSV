
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module addRegisterH_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic  dSig5;
   logic  rst;
   logic  dSig5_q;


    always_comb begin
        rst = ~rst_b;
    end
    
    logic [15:0] count;
    always @(negedge clk or posedge rst) begin
    if(!rst_b)
      begin
        count <= 'd0;
      end
      else
      begin
        count <= count + 1'b1;

    case (count)
    'd0: begin
      dSig5 <= 0;
      assert(dSig5_q == 1) else $fatal("Assertion failed: dSig5_q should be 1 at time %0t", $time);
    end
    'd1: begin
      dSig5 <= 1;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig5_q should be 0 at time %0t", $time);
    end
    'd2: begin
      dSig5 <= 0;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig5_q should be 0 at time %0t", $time);
    end
    'd3: begin
      dSig5 <= 1;
      assert(dSig5_q == 1) else $fatal("Assertion failed: dSig5_q should be 1 at time %0t", $time);
    end
    'd4: begin
      dSig5 <= 1;
      assert(dSig5_q == 0) else $fatal("Assertion failed: dSig5_q should be 0 at time %0t", $time);
    end
    default: dSig5 <= 0;
    endcase
    end
    end

   always_ff @( negedge clk  or posedge rst )
     if(rst)
        begin
           dSig5_q <= 'd1;
        end
      else 
        begin
           dSig5_q <= dSig5;
        end


endmodule
/* verilator lint_on WIDTH */        


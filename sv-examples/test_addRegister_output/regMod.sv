
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module addRegister_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic  dSig;
   logic  dSig_q;


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
      dSig <= 0;
      assert(dSig_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd1: begin
      dSig <= 1;
      assert(dSig_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    'd2: begin
      dSig <= 0;
      assert(dSig_q == 0) else $fatal("Assertion failed: dSig_q should be 0 at time %0t", $time);
    end
    'd3: begin
      dSig <= 1;
      assert(dSig_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    'd4: begin 
      dSig <= 1;
      assert(dSig_q == 1) else $fatal("Assertion failed: dSig_q should be 1 at time %0t", $time);
    end
    default: dSig <= 0;
    endcase
    end

   always_ff @( posedge clk  )
   
        begin
           dSig_q <= dSig;
        end


endmodule
/* verilator lint_on WIDTH */        


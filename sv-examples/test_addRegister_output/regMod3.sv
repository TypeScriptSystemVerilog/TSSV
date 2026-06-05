
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module addRegisterReset_tb 
       (
       input logic  clk,
   input logic  rst_b
       );
    
       logic  dSig3;
   logic  dSig3_q;
    
    
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
  dSig3 <= 0;
  assert(dSig3_q == 0) else $fatal("Assertion failed: dSig3_q should be 0 at time %0t", $time);
end
'd1: begin
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig3_q should be 1 at time %0t", $time);
end
'd2: begin
  dSig3 <= 0;
  assert(dSig3_q == 0) else $fatal("Assertion failed: dSig3_q should be 0 at time %0t", $time);
end
'd3: begin
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig3_q should be 1 at time %0t", $time);
end
'd4: begin 
  dSig3 <= 1;
  assert(dSig3_q == 1) else $fatal("Assertion failed: dSig3_q should be 1 at time %0t", $time);
end
default: dSig3 <= 0;
endcase
end


    

    
     always_ff @( posedge clk  or negedge rst_b )
  
       if(!rst_b)
  begin
    dSig3_q <= 1'h0;
  end
  else
  begin
  dSig3_q <= dSig3;
  end
  
  
    
    endmodule
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    


        

        
/* verilator lint_off WIDTH */        
module counter4b 
   (
   input logic  clk,
   input logic  reset,
   output logic [3:0] q
   );

   


   always_ff @( posedge clk  )
     if(reset)
        begin
           q <= 'd0;
        end
      else 
        begin
           q <= q + 4'd1;
        end


endmodule
/* verilator lint_on WIDTH */        

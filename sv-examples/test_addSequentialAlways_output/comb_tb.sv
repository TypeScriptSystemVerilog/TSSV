
  /* verilator lint_off DECLFILENAME */
  /* verilator lint_off UNUSED */
  
        

        
/* verilator lint_off WIDTH */        
module seq_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] out;


always_ff @( posedge clk or negedge rst_b )



endmodule
/* verilator lint_on WIDTH */        


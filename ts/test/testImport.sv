
/* verilator lint_off WIDTH */        
module testImport
  #(
   parameter aWidth = 8,
   parameter bWidth = 9,
   parameter sumWidth = 10
    )   
  (
   input logic signed [aWidth-1:0]  a,
   input logic signed [bWidth-1:0]  b,
   output logic signed [sumWidth-1:0] sum
   );

   
   assign sum = a + b;


endmodule
/* verilator lint_on WIDTH */        

   
       

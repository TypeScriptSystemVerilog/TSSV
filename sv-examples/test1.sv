


        
/* verilator lint_off WIDTH */        
module Adder_8_8 
   (
   input logic signed [7:0] a,
   input logic signed [7:0] b,
   output logic signed [8:0] sum
   );

   ;

   assign sum = a + b;


endmodule
/* verilator lint_on WIDTH */        


        
/* verilator lint_off WIDTH */        
module Adder_8_9 
   (
   input logic signed [7:0] a,
   input logic signed [8:0] b,
   output logic signed [9:0] sum
   );

   ;

   assign sum = a + b;


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module Adder3_8_8_8 
   (
   input logic signed [7:0] a,
   input logic signed [7:0] b,
   input logic signed [7:0] c,
   output logic signed [9:0] sum
   );

   logic [8:0] psum;


    Adder_8_8 add1
      (
        .sum(psum),
        .a(a),
        .b(b)        
      );

    Adder_8_9 add2
      (
        .a(c),
        .b(psum),
        .sum(sum)        
      );


endmodule
/* verilator lint_on WIDTH */        

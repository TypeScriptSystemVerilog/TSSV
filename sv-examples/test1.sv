


        
/* verilator lint_off WIDTH */        
module Adder_8_8 
   (
   input signed [7:0] a,
   input signed [7:0] b,
   output signed [8:0] sum
   );

   ;

   assign sum = a + b;


endmodule
/* verilator lint_on WIDTH */        


        
/* verilator lint_off WIDTH */        
module Adder_8_9 
   (
   input signed [7:0] a,
   input signed [8:0] b,
   output signed [9:0] sum
   );

   ;

   assign sum = a + b;


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module Adder3_8_8_8 
   (
   input signed [7:0] a,
   input signed [7:0] b,
   input signed [7:0] c,
   output signed [9:0] sum
   );

   wire [8:0] psum;


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




        
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
   output logic signed [9:0] sum,
   input logic  a_valid,
   output logic  a_ready,
   input logic [2:0] a_opcode,
   input logic [31:0] a_address,
   input logic [31:0] a_data,
   input logic [7:0] a_source,
   input logic [2:0] a_size,
   input logic [7:0] a_mask,
   output logic  d_valid,
   input logic  d_ready,
   output logic [2:0] d_opcode,
   output logic  d_error,
   output logic [2:0] d_size,
   output logic [31:0] d_data,
   output logic [7:0] d_source,
   output logic [7:0] d_sink
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

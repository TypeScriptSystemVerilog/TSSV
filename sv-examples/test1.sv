
        


interface TL_UL_3_8_32_8_8_32;

   logic  a_valid;
   logic  a_ready;
   logic [2:0] a_opcode;
   logic [31:0] a_address;
   logic [31:0] a_data;
   logic [7:0] a_source;
   logic [2:0] a_size;
   logic [7:0] a_mask;
   logic  d_valid;
   logic  d_ready;
   logic [2:0] d_opcode;
   logic  d_error;
   logic [2:0] d_size;
   logic [31:0] d_data;
   logic [7:0] d_source;
   logic [7:0] d_sink;


    modport producer (
      output a_valid,
      input a_ready,
      output a_opcode,
      output a_address,
      output a_data,
      output a_source,
      output a_size,
      output a_mask,
      input d_valid,
      output d_ready,
      input d_opcode,
      input d_error,
      input d_size,
      input d_data,
      input d_source,
      input d_sink
    );           

    modport responder (
      input a_valid,
      output a_ready,
      input a_opcode,
      input a_address,
      input a_data,
      input a_source,
      input a_size,
      input a_mask,
      output d_valid,
      input d_ready,
      output d_opcode,
      output d_error,
      output d_size,
      output d_data,
      output d_source,
      output d_sink
    );           


endinterface
        
        

        
/* verilator lint_off WIDTH */        
module Adder_8_8 
   (
   input logic signed [7:0] a,
   input logic signed [7:0] b,
   output logic signed [8:0] sum,
   TL_UL_3_8_32_8_8_32.responder regs
   );

   

   assign sum = a + b;


endmodule
/* verilator lint_on WIDTH */        

        

        
/* verilator lint_off WIDTH */        
module Adder_8_9 
   (
   input logic signed [7:0] a,
   input logic signed [8:0] b,
   output logic signed [9:0] sum,
   TL_UL_3_8_32_8_8_32.responder regs
   );

   

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

   TL_UL_3_8_32_8_8_32 regs1;
   TL_UL_3_8_32_8_8_32 regs2;
   logic [8:0] psum;


    Adder_8_8 add1
      (
        .sum(psum),
        .regs(regs1),
        .a(a),
        .b(b)        
      );

    Adder_8_9 add2
      (
        .a(c),
        .b(psum),
        .sum(sum),
        .regs(regs2)        
      );


endmodule
/* verilator lint_on WIDTH */        

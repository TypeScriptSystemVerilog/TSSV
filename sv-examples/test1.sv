
        


interface TL_UL_4_32_2_8_8;

   logic [2:0] a_opcode;
   logic [2:0] a_param;
   logic [1:0] a_size;
   logic [7:0] a_source;
   logic [31:0] a_address;
   logic [3:0] a_mask;
   logic [31:0] a_data;
   logic  a_corrupt;
   logic  a_valid;
   logic  a_ready;
   logic [2:0] d_opcode;
   logic [1:0] d_param;
   logic [1:0] d_size;
   logic [7:0] d_source;
   logic [7:0] d_sink;
   logic  d_denied;
   logic [31:0] d_data;
   logic  d_corrupt;
   logic  d_valid;
   logic  d_ready;


    modport outward (
      output a_opcode,
      output a_param,
      output a_size,
      output a_source,
      output a_address,
      output a_mask,
      output a_data,
      output a_corrupt,
      output a_valid,
      input a_ready,
      input d_opcode,
      input d_param,
      input d_size,
      input d_source,
      input d_sink,
      input d_denied,
      input d_data,
      input d_corrupt,
      input d_valid,
      output d_ready
    );           

    modport inward (
      input a_opcode,
      input a_param,
      input a_size,
      input a_source,
      input a_address,
      input a_mask,
      input a_data,
      input a_corrupt,
      input a_valid,
      output a_ready,
      output d_opcode,
      output d_param,
      output d_size,
      output d_source,
      output d_sink,
      output d_denied,
      output d_data,
      output d_corrupt,
      output d_valid,
      input d_ready
    );           


endinterface
        
        

        
/* verilator lint_off WIDTH */        
module Adder_8_8 
   (
   input logic signed [7:0] a,
   input logic signed [7:0] b,
   output logic signed [8:0] sum,
   TL_UL_4_32_2_8_8.inward regs
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
   TL_UL_4_32_2_8_8.inward regs
   );

   

   assign sum = a + b;


endmodule
/* verilator lint_on WIDTH */        

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

   
       

        
/* verilator lint_off WIDTH */        
module Adder3_8_8_8 
   (
   input logic signed [7:0] a,
   input logic signed [7:0] b,
   input logic signed [7:0] c,
   input logic  clk,
   input logic  rst_b,
   output logic signed [9:0] sum
   );

   TL_UL_4_32_2_8_8 regs1;
   TL_UL_4_32_2_8_8 regs2;
   logic signed [8:0] psum;
   logic signed [9:0] sum_d;
   logic [9:0] sum_d3;
   logic [9:0] sum_d4;
   const logic signed [4:0] testSignExtend = -5;
   logic signed [7:0] ext_w3s_testSignExtend;
   logic [9:0] sum_d5;
   const logic signed [7:0] const_w8sm32 = -32;

  assign ext_w3s_testSignExtend = {{3{testSignExtend[4]}},testSignExtend};

    always_ff @(posedge clk or negedge rst_b)
      if(!rst_b)
        sum <= '0;
      else
        sum <= sum_d;

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
        .sum(sum_d),
        .regs(regs2)        
      );

    testImport #(.aWidth(8),.bWidth(9),.sumWidth(10)) add3
      (
        .a(c),
        .b(psum),
        .sum(sum_d3)        
      );

    Adder_8_9 add4
      (
        .a(ext_w3s_testSignExtend),
        .b(psum),
        .sum(sum_d),
        .regs(regs2)        
      );

    Adder_8_9 add5
      (
        .a(const_w8sm32),
        .b(psum),
        .sum(sum_d),
        .regs(regs2)        
      );


endmodule
/* verilator lint_on WIDTH */        


        


interface TL_UL_8_32_8_32;

   logic  a_valid;
   logic  a_ready;
   logic [2:0] a_opcode;
   logic [31:0] a_address;
   logic [31:0] a_data;
   logic [7:0] a_source;
   logic [1:0] a_size;
   logic [3:0] a_mask;
   logic  d_valid;
   logic  d_ready;
   logic [2:0] d_opcode;
   logic  d_error;
   logic [1:0] d_size;
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
module testRegBlock 
   (
   input logic  clk,
   input logic  rst_b,
   TL_UL_8_32_8_32.responder regs
   );

   



endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_testRegBlock 
   (
   
   );

   TL_UL_8_32_8_32 regs;
   logic  clk;
   logic  rst_b;


    testRegBlock dut
      (
        .clk(clk),
        .rst_b(rst_b),
        .regs(regs)        
      );


endmodule
/* verilator lint_on WIDTH */        

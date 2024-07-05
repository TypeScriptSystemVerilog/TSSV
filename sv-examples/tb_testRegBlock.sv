
        


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


    modport requester (
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

    modport responder (
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
module testRegBlock 
   (
   input logic  clk,
   input logic  rst_b,
   output logic [31:0] REG0,
   output logic signed [15:0] REG1,
   output logic [15:0] REG2_field0,
   output logic [15:0] REG2_field1,
   input logic [31:0] MEM0_rdata,
   output logic  MEM0_re,
   output logic [31:0] MEM0_wdata,
   output logic  MEM0_we,
   output logic [3:0] MEM0_wstrb,
   input logic [31:0] MEM1_rdata,
   output logic  MEM1_re,
   TL_UL_4_32_2_8_8.responder regs
   );

   



endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_testRegBlock 
   (
   
   );

   TL_UL_4_32_2_8_8 regs;
   logic  clk;
   logic  rst_b;
   logic [31:0] REG0;
   logic signed [15:0] REG1;
   logic [15:0] REG2_field0;
   logic [15:0] REG2_field1;
   logic [31:0] MEM0_rdata;
   logic  MEM0_re;
   logic [31:0] MEM0_wdata;
   logic  MEM0_we;
   logic [3:0] MEM0_wstrb;
   logic [31:0] MEM1_rdata;
   logic  MEM1_re;


    testRegBlock dut
      (
        .clk(clk),
        .rst_b(rst_b),
        .REG0(REG0),
        .REG1(REG1),
        .REG2_field0(REG2_field0),
        .REG2_field1(REG2_field1),
        .MEM0_rdata(MEM0_rdata),
        .MEM0_re(MEM0_re),
        .MEM0_wdata(MEM0_wdata),
        .MEM0_we(MEM0_we),
        .MEM0_wstrb(MEM0_wstrb),
        .MEM1_rdata(MEM1_rdata),
        .MEM1_re(MEM1_re),
        .regs(regs)        
      );


endmodule
/* verilator lint_on WIDTH */        

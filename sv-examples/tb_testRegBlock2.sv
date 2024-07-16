
        

        

        
/* verilator lint_off WIDTH */        
module testRegBlock2 
   (
   input logic  clk,
   input logic  rst_b,
   output logic [15:0] REG2_field0,
   output logic [15:0] REG2_field1,
   input logic [31:0] MEM0_rdata,
   output logic  MEM0_re,
   output logic [31:0] MEM0_wdata,
   output logic  MEM0_we,
   output logic [3:0] MEM0_wstrb,
   TL_UL_4_32_2_8_8.inward regs
   );

   

  assign MEM0_rdata = {MEM1_field1,MEM1_field0};

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           MEM0_rdata <= 'd0;
        end
      else if(MEM0_we)
        begin
           MEM0_rdata <= MEM0_wdata;
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_testRegBlock 
   (
   
   );

   TL_UL_4_32_2_8_8 regs;
   logic  clk;
   logic  rst_b;
   logic [15:0] REG2_field0;
   logic [15:0] REG2_field1;
   logic [31:0] MEM0_rdata;
   logic  MEM0_re;
   logic [31:0] MEM0_wdata;
   logic  MEM0_we;
   logic [3:0] MEM0_wstrb;


    testRegBlock2 dut
      (
        .clk(clk),
        .rst_b(rst_b),
        .REG2_field0(REG2_field0),
        .REG2_field1(REG2_field1),
        .MEM0_rdata(MEM0_rdata),
        .MEM0_re(MEM0_re),
        .MEM0_wdata(MEM0_wdata),
        .MEM0_we(MEM0_we),
        .MEM0_wstrb(MEM0_wstrb),
        .regs(regs)        
      );


endmodule
/* verilator lint_on WIDTH */        

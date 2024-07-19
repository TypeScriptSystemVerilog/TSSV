
        

        

        
/* verilator lint_off WIDTH */        
module testRegBlock2 
   (
   input logic  clk,
   input logic  rst_b,
   output logic [31:0] REG0,
   output logic [31:0] REG1,
   output logic [31:0] REG2,
   output logic  MEM0_addr,
   output logic [31:0] MEM0_data_wr,
   input logic [31:0] MEM0_data_rd,
   output logic  MEM0_re,
   output logic  MEM0_we,
   output logic [31:0] MEM1,
   memory_32_32.inward regs,
   TL_UL_4_32_2_8_8.inward tlulinterface
   );

   logic  ADDR;
   logic [31:0] DATA_WR;
   logic [31:0] DATA_RD;
   logic  RE;
   logic  WE;
   logic  READY;
   logic  REG0_matchExpr;
   logic  REG0_RE;
   logic  REG0_WE;
   logic  REG1_matchExpr;
   logic  REG1_RE;
   logic  REG1_WE;
   logic  REG2_matchExpr;
   logic  REG2_RE;
   logic  REG2_WE;
   logic  MEM0_matchExpr;
   logic  MEM0_Nmatch;
   logic  MEM0_ADDR;
   logic  MEM0_RE;
   logic  MEM0_WE;
   logic  MEM1_matchExpr;
   logic  MEM1_RE;
   logic  MEM1_WE;

  assign REG0_matchExpr = ADDR == 0;
  assign REG0_RE = REG0_matchExpr && RE;
  assign REG0_WE = REG0_matchExpr && WE;
  assign REG1_matchExpr = ADDR == 4;
  assign REG1_RE = REG1_matchExpr && RE;
  assign REG1_WE = REG1_matchExpr && WE;
  assign REG2_matchExpr = ADDR == 8;
  assign REG2_RE = REG2_matchExpr && RE;
  assign REG2_WE = REG2_matchExpr && WE;
  assign MEM0_matchExpr = ADDR == 32;
  assign MEM0_Nmatch = (ADDR & 6'b111000) == 32;
  assign MEM0_WE = MEM0_Nmatch && WE;
  assign MEM0_RE = MEM0_Nmatch && RE;
  assign MEM0_ADDR = ADDR & 6'b000111;
  assign MEM0_re = MEM0_RE;
  assign DATA_RD = MEM0_data_rd;
  assign MEM0_data_wr = DATA_WR;
  assign MEM1_matchExpr = ADDR == 64;
  assign MEM1_RE = MEM1_matchExpr && RE;
  assign MEM1_WE = MEM1_matchExpr && WE;

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG0 <= 'd0;
           REG1 <= 'd0;
           REG2 <= 'd0;
           MEM1 <= 'd0;
        end
      else 
        begin
           REG0 <= DATA_WR;
           REG1 <= DATA_WR;
           REG2 <= DATA_WR;
           MEM1 <= DATA_WR;
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_testRegBlock 
   (
   
   );

   memory_32_32 regs;
   TL_UL_4_32_2_8_8 tlulinterface;
   logic  clk;
   logic  rst_b;
   logic [31:0] REG0;
   logic [31:0] REG1;
   logic [31:0] REG2;
   logic  MEM0_addr;
   logic [31:0] MEM0_data_wr;
   logic [31:0] MEM0_data_rd;
   logic  MEM0_re;
   logic  MEM0_we;
   logic [31:0] MEM1;


    testRegBlock2 dut
      (
        .clk(clk),
        .rst_b(rst_b),
        .REG0(REG0),
        .REG1(REG1),
        .REG2(REG2),
        .MEM0_addr(MEM0_addr),
        .MEM0_data_wr(MEM0_data_wr),
        .MEM0_data_rd(MEM0_data_rd),
        .MEM0_re(MEM0_re),
        .MEM0_we(MEM0_we),
        .MEM1(MEM1),
        .regs(regs),
        .tlulinterface(tlulinterface)        
      );


endmodule
/* verilator lint_on WIDTH */        

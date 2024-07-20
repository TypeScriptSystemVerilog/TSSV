
        

        

        
/* verilator lint_off WIDTH */        
module testRegBlock 
   (
   input logic  clk,
   input logic  rst_b,
   output logic [31:0] REG0,
   output logic [15:0] REG2_field0,
   output logic [15:0] REG2_field1,
   input logic [31:0] MEM0_rdata,
   output logic  MEM0_re,
   output logic  MEM0_we,
   output logic [31:0] MEM0_wdata,
   output logic [31:0] MEM0_wstrb,
   input logic [31:0] MEM1_rdata,
   output logic  MEM1_re
   );

   memory_32_32 regs;
   logic [31:0] ADDR;
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
   logic  REG2_matchExpr;
   logic  REG2_RE;
   logic  REG2_WE;
   logic  MEM0_matchExpr;
   logic  MEM0_Nmatch;
   logic [31:0] MEM0_ADDR;
   logic  MEM0_RE;
   logic  MEM0_WE;
   logic  MEM1_matchExpr;
   logic  MEM1_RE;
   logic [31:0] MEM1_ADDR;

  assign REG0_matchExpr = ADDR == 0;
  assign REG0_RE = REG0_matchExpr && RE;
  assign REG0_WE = REG0_matchExpr && WE;
  assign REG1_matchExpr = ADDR == 4;
  assign REG1_RE = REG1_matchExpr && RE;
  assign REG2_matchExpr = ADDR == 8;
  assign REG2_RE = REG2_matchExpr && RE;
  assign REG2_WE = REG2_matchExpr && WE;
  assign MEM0_matchExpr = ADDR == 32;
  assign MEM0_Nmatch = (ADDR & 4'b1100) == 32;
  assign MEM0_RE = MEM0_Nmatch && RE;
  assign MEM0_WE = MEM0_Nmatch && WE;
  assign MEM0_ADDR = ADDR & 4'b0011;
  assign MEM1_matchExpr = ADDR == 64;
  assign MEM1_RE = MEM1_matchExpr && RE;
  assign MEM1_ADDR = ADDR;

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG0 <= 'd0;
           DATA_RD <= 'd0;
           MEM0_wdata <= 'd0;
           MEM0_re <= 'd0;
           MEM0_we <= 'd0;
           MEM0_wstrb <= 'd0;
           MEM1_re <= 'd0;
        end
      else if(WE)
        begin
           REG0 <= DATA_WR;
           DATA_RD <= MEM1_rdata;
           MEM0_wdata <= DATA_WR;
           MEM0_re <= MEM0_RE;
           MEM0_we <= MEM0_WE;
           MEM0_wstrb <= 1;
           MEM1_re <= MEM1_RE;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG2_field0 <= 'd16;
           REG2_field1 <= 'd32;
        end
      else 
        begin
           REG2_field0 <= DATA_WR[0:15];
           REG2_field1 <= DATA_WR[16:31];
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_testRegBlock 
   (
   
   );

   logic  clk;
   logic  rst_b;
   logic [31:0] REG0;
   logic [15:0] REG2_field0;
   logic [15:0] REG2_field1;
   logic [31:0] MEM0_rdata;
   logic  MEM0_re;
   logic  MEM0_we;
   logic [31:0] MEM0_wdata;
   logic [31:0] MEM0_wstrb;
   logic [31:0] MEM1_rdata;
   logic  MEM1_re;


    testRegBlock dut
      (
        .clk(clk),
        .rst_b(rst_b),
        .REG0(REG0),
        .REG2_field0(REG2_field0),
        .REG2_field1(REG2_field1),
        .MEM0_rdata(MEM0_rdata),
        .MEM0_re(MEM0_re),
        .MEM0_we(MEM0_we),
        .MEM0_wdata(MEM0_wdata),
        .MEM0_wstrb(MEM0_wstrb),
        .MEM1_rdata(MEM1_rdata),
        .MEM1_re(MEM1_re)        
      );


endmodule
/* verilator lint_on WIDTH */        

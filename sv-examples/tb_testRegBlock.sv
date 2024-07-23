
        


interface memory_32_32;

   logic [31:0] ADDR;
   logic [31:0] DATA_WR;
   logic [31:0] DATA_RD;
   logic  RE;
   logic  WE;
   logic  READY;


    modport outward (
      input ADDR,
      output DATA_WR,
      input DATA_RD,
      output WE,
      output RE,
      input READY
    );           

    modport inward (
      output ADDR,
      input DATA_WR,
      output DATA_RD,
      input WE,
      input RE,
      output READY
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
   output logic  MEM0_we,
   output logic [31:0] MEM0_wdata,
   output logic [31:0] MEM0_wstrb,
   input logic [31:0] MEM1_rdata,
   output logic  MEM1_re,
   memory_32_32.inward regs
   );

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

  assign REG0_matchExpr = regs.ADDR == 0;
  assign REG0_RE = REG0_matchExpr && regs.RE;
  assign REG0_WE = REG0_matchExpr && regs.WE;
  assign REG1_matchExpr = regs.ADDR == 4;
  assign REG1_RE = REG1_matchExpr && regs.RE;
  assign REG2_matchExpr = regs.ADDR == 8;
  assign REG2_RE = REG2_matchExpr && regs.RE;
  assign REG2_WE = REG2_matchExpr && regs.WE;
  assign MEM0_matchExpr = regs.ADDR == 32;
  assign MEM0_Nmatch = regs.ADDR & 4'b1100 == 32;
  assign MEM0_RE = MEM0_Nmatch && regs.RE;
  assign MEM0_WE = MEM0_Nmatch && regs.WE;
  assign MEM0_ADDR = regs.ADDR & 4'b0011;
  assign MEM1_matchExpr = regs.ADDR == 64;
  assign MEM1_RE = MEM1_matchExpr && regs.RE;
  assign MEM1_ADDR = regs.ADDR;
   always_comb
    /* verilator lint_off CASEX */
    casex (regs.ADDR)
      8'b0XXXXXXX: regs.DATA_RD = REG0;
      8'b100XXXXX: regs.DATA_RD = REG1;
      8'b1000XXXX: regs.DATA_RD = REG2_field0 | REG2_field1;
      8'b100000XX: regs.DATA_RD = MEM0_rdata;
      8'b1000000X: regs.DATA_RD = MEM1_rdata;
      default: regs.DATA_RD = 0;
    endcase

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG0 <= 'd0;
           REG2_field0 <= 'd16;
           REG2_field1 <= 'd32;
           regs.DATA_RD <= 'd0;
           MEM0_wdata <= 'd0;
           MEM0_re <= 'd0;
           MEM0_we <= 'd0;
           MEM0_wstrb <= 'd0;
           MEM1_re <= 'd0;
        end
      else if(regs.WE)
        begin
           REG0 <= regs.DATA_WR;
           REG2_field0 <= regs.DATA_WR[15:0];
           REG2_field1 <= regs.DATA_WR[31:16];
           regs.DATA_RD <= MEM1_rdata;
           MEM0_wdata <= regs.DATA_WR;
           MEM0_re <= MEM0_RE;
           MEM0_we <= MEM0_WE;
           MEM0_wstrb <= 1;
           MEM1_re <= MEM1_RE;
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_testRegBlock 
   (
   
   );

   memory_32_32 regs();
   logic  clk;
   logic  rst_b;
   logic [31:0] REG0;
   logic signed [15:0] REG1;
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
        .REG1(REG1),
        .REG2_field0(REG2_field0),
        .REG2_field1(REG2_field1),
        .MEM0_rdata(MEM0_rdata),
        .MEM0_re(MEM0_re),
        .MEM0_we(MEM0_we),
        .MEM0_wdata(MEM0_wdata),
        .MEM0_wstrb(MEM0_wstrb),
        .MEM1_rdata(MEM1_rdata),
        .MEM1_re(MEM1_re),
        .regs(regs)        
      );


endmodule
/* verilator lint_on WIDTH */        

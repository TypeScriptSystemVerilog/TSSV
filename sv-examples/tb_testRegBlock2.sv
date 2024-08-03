
        

        

        
/* verilator lint_off WIDTH */        
module ram_32x32 
   (
   input logic  clk,
   input logic  rst_b,
   input logic [31:0] addr,
   input logic  we,
   input logic  re,
   input logic [31:0] wdata,
   output logic [31:0] rdata,
   output logic  ready
   );

   


  logic [31:0] mem [0:31];

  always_ff @(posedge clk or negedge rst_b) begin
      if (!rst_b) begin
          rdata <= 32'd0;
          ready <= 1'b0;
      end else if (we) begin
          mem[addr] <= wdata;
          ready <= 1'b1;
      end else if (re) begin
          rdata <= mem[addr];
          ready <= 1'b1;
      end else begin
          ready <= 1'b0;
      end
  end


endmodule
/* verilator lint_on WIDTH */        

        

        
/* verilator lint_off WIDTH */        
module rom_32x32 
   (
   input logic  clk,
   input logic  rst_b,
   input logic [31:0] addr,
   input logic  re,
   output logic [31:0] rdata,
   output logic  ready
   );

   


  logic [31:0] mem [0:31];

  initial begin
      // Initialize ROM with some values
      mem[0] = 32'h00000001;
      mem[1] = 32'h00000002;
      mem[2] = 32'h00000003;
      mem[3] = 32'h00000004;
      // ...
  end

  always_ff @(posedge clk or negedge rst_b) begin
      if (!rst_b) begin
          rdata <= 32'd0;
          ready <= 1'b0;
      end else if (re) begin
          rdata <= mem[addr];
          ready <= 1'b1;
      end else begin
          ready <= 1'b0;
      end
  end


endmodule
/* verilator lint_on WIDTH */        

        

        
/* verilator lint_off WIDTH */        
module testRegBlock 
   (
   input logic  clk,
   input logic  rst_b,
   output logic [31:0] REG0,
   output logic signed [15:0] REG1,
   output logic [15:0] REG2_field0,
   output logic [15:0] REG2_field1,
   output logic [31:0] MEM0_rdata,
   output logic  MEM0_re,
   output logic  MEM0_we,
   output logic [31:0] MEM0_wdata,
   output logic [31:0] MEM0_wstrb,
   output logic  MEM0_ready,
   output logic [31:0] MEM1_rdata,
   output logic  MEM1_re,
   output logic  MEM1_ready,
   memory_32_32.inward regs
   );

   logic  REG0_matchExpr;
   logic [3:0] REG0_wstrb;
   logic  REG0_RE;
   logic  REG0_WE;
   logic [31:0] REG0_d;
   logic  REG1_matchExpr;
   logic  REG1_RE;
   logic  REG2_matchExpr;
   logic [3:0] REG2_wstrb;
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
  assign REG0_wstrb = regs.WSTRB;
  assign REG0_d = regs.DATA_WR & REG0_wstrb;
  assign REG1_matchExpr = regs.ADDR == 4;
  assign REG1_RE = REG1_matchExpr && regs.RE;
  assign REG2_matchExpr = regs.ADDR == 8;
  assign REG2_RE = REG2_matchExpr && regs.RE;
  assign REG2_WE = REG2_matchExpr && regs.WE;
  assign REG2_wstrb = regs.WSTRB;
  assign MEM0_matchExpr = (regs.ADDR >= 32) && (regs.ADDR <= (63));
  assign MEM0_Nmatch = regs.ADDR & 4'b1100 == 32;
  assign MEM0_RE = MEM0_matchExpr && regs.RE;
  assign MEM0_WE = MEM0_matchExpr && regs.WE;
  assign MEM0_ADDR = regs.ADDR;
  assign MEM1_matchExpr = (regs.ADDR >= 64) && (regs.ADDR <= (95));
  assign MEM1_RE = MEM1_matchExpr && regs.RE;
  assign MEM1_ADDR = regs.ADDR;

always @(regs.ADDR or regs.RE)
  if(regs.RE == 1) begin
    /* verilator lint_off CASEX */
    casex (regs.ADDR)
      8'b00000000: begin
          regs.DATA_RD <= REG0;
          regs.READY <= 1'b1;
      end
     8'b00000100: begin
          regs.DATA_RD <= REG1;
          regs.READY <= 1'b1;
      end
     8'b00001000: begin
          regs.DATA_RD <= {REG2_field1, REG2_field0};
          regs.READY <= 1'b1;
      end
     8'b001XXXXX: begin
          regs.DATA_RD <= MEM0_wdata;
          regs.READY <= MEM0_ready;
      end
     8'b01XXXXXX: begin
          regs.DATA_RD <= MEM1_rdata;
          regs.READY <= MEM1_ready;
      end
      default: regs.DATA_RD <= 0;
    endcase
  end
   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG0 <= 'd0;
        end
      else if(REG0_WE)
        begin
           REG0 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG2_field0 <= 'd16;
           REG2_field1 <= 'd32;
        end
      else if(REG2_WE && REG2_wstrb)
        begin
           REG2_field0 <= regs.DATA_WR[15:0];
           REG2_field1 <= regs.DATA_WR[31:16];
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           MEM0_ready <= 'd0;
           MEM0_wdata <= 'd0;
           MEM0_re <= 'd0;
           MEM0_we <= 'd0;
           MEM0_wstrb <= 'd0;
        end
      else if(MEM0_WE)
        begin
           MEM0_ready <= regs.READY;
           MEM0_wdata <= regs.DATA_WR;
           MEM0_re <= MEM0_RE;
           MEM0_we <= MEM0_WE;
           MEM0_wstrb <= 1;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           MEM1_ready <= 'd0;
        end
      else if(regs.WE)
        begin
           MEM1_ready <= regs.READY;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG0 <= 'd0;
        end
      else if(REG0_WE)
        begin
           REG0 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           REG2_field0 <= 'd16;
           REG2_field1 <= 'd32;
        end
      else if(REG2_WE && REG2_wstrb)
        begin
           REG2_field0 <= regs.DATA_WR[15:0];
           REG2_field1 <= regs.DATA_WR[31:16];
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           MEM0_ready <= 'd0;
           MEM0_wdata <= 'd0;
           MEM0_re <= 'd0;
           MEM0_we <= 'd0;
           MEM0_wstrb <= 'd0;
        end
      else if(MEM0_WE)
        begin
           MEM0_ready <= regs.READY;
           MEM0_wdata <= regs.DATA_WR;
           MEM0_re <= MEM0_RE;
           MEM0_we <= MEM0_WE;
           MEM0_wstrb <= 1;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           MEM1_ready <= 'd0;
        end
      else if(regs.WE)
        begin
           MEM1_ready <= regs.READY;
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_testRegBlock2 
   (
   input logic  clk,
   input logic  rst_b
   );

   memory_32_32 regs();
   logic [31:0] addr;
   logic  we;
   logic  re;
   logic [31:0] wdata;
   logic [31:0] rdata;
   logic  ready;
   logic [31:0] REG0;
   logic signed [15:0] REG1;
   logic [15:0] REG2_field0;
   logic [15:0] REG2_field1;
   logic [31:0] MEM0_rdata;
   logic  MEM0_re;
   logic  MEM0_we;
   logic [31:0] MEM0_wdata;
   logic [31:0] MEM0_wstrb;
   logic  MEM0_ready;
   logic [31:0] MEM1_rdata;
   logic  MEM1_re;
   logic  MEM1_ready;


  logic [15:0] count;

  always @(posedge clk or negedge rst_b) begin
  if (!rst_b) begin
    count <= 'd0;
  end else begin
    count <= count + 1'b1;

    case (count)
        'd0: begin
          regs.ADDR <= 32'h00000000;
          regs.DATA_WR <= 32'h12345678;
          regs.WE <= 1;
        end
        'd1: begin
          regs.ADDR <= 32'h00000008;
          regs.DATA_WR <= 32'h87654321;
          regs.WE <= 1;
        end
        'd2: begin
          regs.ADDR <= 32'h00000020;
          regs.DATA_WR <= 32'hAABBCCDD;
          regs.WE <= 1;
        end
        'd3: begin
          regs.WE <= 0;
        end
        'd4: begin
          regs.ADDR <= 32'h00000000;
          regs.RE <= 1;
        end
        'd5: begin
          regs.RE <= 0;
        end
        'd6: begin
          regs.ADDR <= 32'h00000008;
          regs.RE <= 1;
        end
        'd7: begin
          regs.RE <= 0;
        end
        'd8: begin
          regs.ADDR <= 32'h00000020;
          regs.RE <= 1;
        end
        'd9: begin
          regs.RE <= 0;
          // End of test
          $finish;
        end
        default: ;
    endcase
  end
  end

    ram_32x32 ram_inst
      (
        .clk(clk),
        .rst_b(rst_b),
        .addr(addr),
        .we(we),
        .re(re),
        .wdata(wdata),
        .rdata(rdata),
        .ready(ready)        
      );

    rom_32x32 rom_inst
      (
        .clk(clk),
        .rst_b(rst_b),
        .addr(addr),
        .re(re),
        .rdata(rdata),
        .ready(ready)        
      );

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
        .MEM0_ready(MEM0_ready),
        .MEM1_rdata(MEM1_rdata),
        .MEM1_re(MEM1_re),
        .MEM1_ready(MEM1_ready),
        .regs(regs)        
      );


endmodule
/* verilator lint_on WIDTH */        





interface memory_32_32;

   logic [31:0] ADDR;
   logic [31:0] DATA_WR;
   logic [31:0] DATA_RD;
   logic  RE;
   logic  WE;
   logic  READY;
   logic [3:0] WSTRB;


    modport outward (
      input ADDR,
      output DATA_WR,
      input DATA_RD,
      output WE,
      output RE,
      input READY,
      output WSTRB
    );           

    modport inward (
      output ADDR,
      input DATA_WR,
      output DATA_RD,
      input WE,
      input RE,
      output READY,
      input WSTRB
    );           


endinterface
        



/* verilator lint_off WIDTH */
module myFIR3_coeffRegs 
   (
   input logic  clk,
   input logic  rst_b,
   output logic signed [31:0] COEFF_0,
   output logic signed [31:0] COEFF_1,
   output logic signed [31:0] COEFF_2,
   output logic signed [31:0] COEFF_3,
   output logic signed [31:0] COEFF_4,
   output logic signed [31:0] COEFF_5,
   output logic signed [31:0] COEFF_6,
   output logic signed [31:0] COEFF_7,
   output logic signed [31:0] COEFF_8,
   output logic signed [31:0] COEFF_9,
   output logic signed [31:0] COEFF_10,
   output logic signed [31:0] COEFF_11,
   output logic signed [31:0] COEFF_12,
   memory_32_32.inward regs
   );

   logic  COEFF_0_matchExpr;
   logic [3:0] COEFF_0_wstrb;
   logic  COEFF_0_RE;
   logic  COEFF_0_WE;
   logic [31:0] COEFF_0_d;
   logic  COEFF_1_matchExpr;
   logic [3:0] COEFF_1_wstrb;
   logic  COEFF_1_RE;
   logic  COEFF_1_WE;
   logic [31:0] COEFF_1_d;
   logic  COEFF_2_matchExpr;
   logic [3:0] COEFF_2_wstrb;
   logic  COEFF_2_RE;
   logic  COEFF_2_WE;
   logic [31:0] COEFF_2_d;
   logic  COEFF_3_matchExpr;
   logic [3:0] COEFF_3_wstrb;
   logic  COEFF_3_RE;
   logic  COEFF_3_WE;
   logic [31:0] COEFF_3_d;
   logic  COEFF_4_matchExpr;
   logic [3:0] COEFF_4_wstrb;
   logic  COEFF_4_RE;
   logic  COEFF_4_WE;
   logic [31:0] COEFF_4_d;
   logic  COEFF_5_matchExpr;
   logic [3:0] COEFF_5_wstrb;
   logic  COEFF_5_RE;
   logic  COEFF_5_WE;
   logic [31:0] COEFF_5_d;
   logic  COEFF_6_matchExpr;
   logic [3:0] COEFF_6_wstrb;
   logic  COEFF_6_RE;
   logic  COEFF_6_WE;
   logic [31:0] COEFF_6_d;
   logic  COEFF_7_matchExpr;
   logic [3:0] COEFF_7_wstrb;
   logic  COEFF_7_RE;
   logic  COEFF_7_WE;
   logic [31:0] COEFF_7_d;
   logic  COEFF_8_matchExpr;
   logic [3:0] COEFF_8_wstrb;
   logic  COEFF_8_RE;
   logic  COEFF_8_WE;
   logic [31:0] COEFF_8_d;
   logic  COEFF_9_matchExpr;
   logic [3:0] COEFF_9_wstrb;
   logic  COEFF_9_RE;
   logic  COEFF_9_WE;
   logic [31:0] COEFF_9_d;
   logic  COEFF_10_matchExpr;
   logic [3:0] COEFF_10_wstrb;
   logic  COEFF_10_RE;
   logic  COEFF_10_WE;
   logic [31:0] COEFF_10_d;
   logic  COEFF_11_matchExpr;
   logic [3:0] COEFF_11_wstrb;
   logic  COEFF_11_RE;
   logic  COEFF_11_WE;
   logic [31:0] COEFF_11_d;
   logic  COEFF_12_matchExpr;
   logic [3:0] COEFF_12_wstrb;
   logic  COEFF_12_RE;
   logic  COEFF_12_WE;
   logic [31:0] COEFF_12_d;

  assign COEFF_0_matchExpr = regs.ADDR == 0;
  assign COEFF_0_RE = COEFF_0_matchExpr && regs.RE;
  assign COEFF_0_WE = COEFF_0_matchExpr && regs.WE;
  assign COEFF_0_wstrb = regs.WSTRB;
  assign COEFF_0_d = regs.DATA_WR & COEFF_0_wstrb;
  assign COEFF_1_matchExpr = regs.ADDR == 4;
  assign COEFF_1_RE = COEFF_1_matchExpr && regs.RE;
  assign COEFF_1_WE = COEFF_1_matchExpr && regs.WE;
  assign COEFF_1_wstrb = regs.WSTRB;
  assign COEFF_1_d = regs.DATA_WR & COEFF_1_wstrb;
  assign COEFF_2_matchExpr = regs.ADDR == 8;
  assign COEFF_2_RE = COEFF_2_matchExpr && regs.RE;
  assign COEFF_2_WE = COEFF_2_matchExpr && regs.WE;
  assign COEFF_2_wstrb = regs.WSTRB;
  assign COEFF_2_d = regs.DATA_WR & COEFF_2_wstrb;
  assign COEFF_3_matchExpr = regs.ADDR == 12;
  assign COEFF_3_RE = COEFF_3_matchExpr && regs.RE;
  assign COEFF_3_WE = COEFF_3_matchExpr && regs.WE;
  assign COEFF_3_wstrb = regs.WSTRB;
  assign COEFF_3_d = regs.DATA_WR & COEFF_3_wstrb;
  assign COEFF_4_matchExpr = regs.ADDR == 16;
  assign COEFF_4_RE = COEFF_4_matchExpr && regs.RE;
  assign COEFF_4_WE = COEFF_4_matchExpr && regs.WE;
  assign COEFF_4_wstrb = regs.WSTRB;
  assign COEFF_4_d = regs.DATA_WR & COEFF_4_wstrb;
  assign COEFF_5_matchExpr = regs.ADDR == 20;
  assign COEFF_5_RE = COEFF_5_matchExpr && regs.RE;
  assign COEFF_5_WE = COEFF_5_matchExpr && regs.WE;
  assign COEFF_5_wstrb = regs.WSTRB;
  assign COEFF_5_d = regs.DATA_WR & COEFF_5_wstrb;
  assign COEFF_6_matchExpr = regs.ADDR == 24;
  assign COEFF_6_RE = COEFF_6_matchExpr && regs.RE;
  assign COEFF_6_WE = COEFF_6_matchExpr && regs.WE;
  assign COEFF_6_wstrb = regs.WSTRB;
  assign COEFF_6_d = regs.DATA_WR & COEFF_6_wstrb;
  assign COEFF_7_matchExpr = regs.ADDR == 28;
  assign COEFF_7_RE = COEFF_7_matchExpr && regs.RE;
  assign COEFF_7_WE = COEFF_7_matchExpr && regs.WE;
  assign COEFF_7_wstrb = regs.WSTRB;
  assign COEFF_7_d = regs.DATA_WR & COEFF_7_wstrb;
  assign COEFF_8_matchExpr = regs.ADDR == 32;
  assign COEFF_8_RE = COEFF_8_matchExpr && regs.RE;
  assign COEFF_8_WE = COEFF_8_matchExpr && regs.WE;
  assign COEFF_8_wstrb = regs.WSTRB;
  assign COEFF_8_d = regs.DATA_WR & COEFF_8_wstrb;
  assign COEFF_9_matchExpr = regs.ADDR == 36;
  assign COEFF_9_RE = COEFF_9_matchExpr && regs.RE;
  assign COEFF_9_WE = COEFF_9_matchExpr && regs.WE;
  assign COEFF_9_wstrb = regs.WSTRB;
  assign COEFF_9_d = regs.DATA_WR & COEFF_9_wstrb;
  assign COEFF_10_matchExpr = regs.ADDR == 40;
  assign COEFF_10_RE = COEFF_10_matchExpr && regs.RE;
  assign COEFF_10_WE = COEFF_10_matchExpr && regs.WE;
  assign COEFF_10_wstrb = regs.WSTRB;
  assign COEFF_10_d = regs.DATA_WR & COEFF_10_wstrb;
  assign COEFF_11_matchExpr = regs.ADDR == 44;
  assign COEFF_11_RE = COEFF_11_matchExpr && regs.RE;
  assign COEFF_11_WE = COEFF_11_matchExpr && regs.WE;
  assign COEFF_11_wstrb = regs.WSTRB;
  assign COEFF_11_d = regs.DATA_WR & COEFF_11_wstrb;
  assign COEFF_12_matchExpr = regs.ADDR == 48;
  assign COEFF_12_RE = COEFF_12_matchExpr && regs.RE;
  assign COEFF_12_WE = COEFF_12_matchExpr && regs.WE;
  assign COEFF_12_wstrb = regs.WSTRB;
  assign COEFF_12_d = regs.DATA_WR & COEFF_12_wstrb;

always @(regs.ADDR or regs.RE)
  if(regs.RE == 1) begin
    /* verilator lint_off CASEX */
    casex (regs.ADDR)
      8'b00000000: begin
          regs.DATA_RD <= COEFF_0;
          regs.READY <= 1'b1;
      end
     8'b00000100: begin
          regs.DATA_RD <= COEFF_1;
          regs.READY <= 1'b1;
      end
     8'b00001000: begin
          regs.DATA_RD <= COEFF_2;
          regs.READY <= 1'b1;
      end
     8'b00001100: begin
          regs.DATA_RD <= COEFF_3;
          regs.READY <= 1'b1;
      end
     8'b00010000: begin
          regs.DATA_RD <= COEFF_4;
          regs.READY <= 1'b1;
      end
     8'b00010100: begin
          regs.DATA_RD <= COEFF_5;
          regs.READY <= 1'b1;
      end
     8'b00011000: begin
          regs.DATA_RD <= COEFF_6;
          regs.READY <= 1'b1;
      end
     8'b00011100: begin
          regs.DATA_RD <= COEFF_7;
          regs.READY <= 1'b1;
      end
     8'b00100000: begin
          regs.DATA_RD <= COEFF_8;
          regs.READY <= 1'b1;
      end
     8'b00100100: begin
          regs.DATA_RD <= COEFF_9;
          regs.READY <= 1'b1;
      end
     8'b00101000: begin
          regs.DATA_RD <= COEFF_10;
          regs.READY <= 1'b1;
      end
     8'b00101100: begin
          regs.DATA_RD <= COEFF_11;
          regs.READY <= 1'b1;
      end
     8'b00110000: begin
          regs.DATA_RD <= COEFF_12;
          regs.READY <= 1'b1;
      end
      default: regs.DATA_RD <= 0;
    endcase
  end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_0 <= -'d1;
        end
      else if(COEFF_0_WE)
        begin
           COEFF_0 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_1 <= 'd0;
        end
      else if(COEFF_1_WE)
        begin
           COEFF_1 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_2 <= 'd5;
        end
      else if(COEFF_2_WE)
        begin
           COEFF_2 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_3 <= -'d6;
        end
      else if(COEFF_3_WE)
        begin
           COEFF_3 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_4 <= -'d10;
        end
      else if(COEFF_4_WE)
        begin
           COEFF_4 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_5 <= 'd38;
        end
      else if(COEFF_5_WE)
        begin
           COEFF_5 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_6 <= 'd77;
        end
      else if(COEFF_6_WE)
        begin
           COEFF_6 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_7 <= 'd38;
        end
      else if(COEFF_7_WE)
        begin
           COEFF_7 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_8 <= -'d10;
        end
      else if(COEFF_8_WE)
        begin
           COEFF_8 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_9 <= -'d6;
        end
      else if(COEFF_9_WE)
        begin
           COEFF_9 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_10 <= 'd5;
        end
      else if(COEFF_10_WE)
        begin
           COEFF_10 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_11 <= 'd0;
        end
      else if(COEFF_11_WE)
        begin
           COEFF_11 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_12 <= -'d1;
        end
      else if(COEFF_12_WE)
        begin
           COEFF_12 <= regs.DATA_WR;
        end

endmodule
/* verilator lint_on WIDTH */        


/* verilator lint_off WIDTH */
module myFIR3 
   (
   input logic  clk,
   input logic  rst_b,
   input logic  en,
   input logic signed [7:0] data_in,
   output logic signed [7:0] data_out
   );

   memory_32_32 regs();
   logic signed [31:0] coeff_0;
   logic signed [31:0] coeff_1;
   logic signed [31:0] coeff_2;
   logic signed [31:0] coeff_3;
   logic signed [31:0] coeff_4;
   logic signed [31:0] coeff_5;
   logic signed [31:0] coeff_6;
   logic signed [31:0] coeff_7;
   logic signed [31:0] coeff_8;
   logic signed [31:0] coeff_9;
   logic signed [31:0] coeff_10;
   logic signed [31:0] coeff_11;
   logic signed [31:0] coeff_12;
   logic signed [7:0] tap_0;
   logic signed [39:0] prod_tap_0xcoeff_0;
   logic signed [7:0] tap_1;
   logic signed [39:0] prod_tap_1xcoeff_1;
   logic signed [7:0] tap_2;
   logic signed [39:0] prod_tap_2xcoeff_2;
   logic signed [7:0] tap_3;
   logic signed [39:0] prod_tap_3xcoeff_3;
   logic signed [7:0] tap_4;
   logic signed [39:0] prod_tap_4xcoeff_4;
   logic signed [7:0] tap_5;
   logic signed [39:0] prod_tap_5xcoeff_5;
   logic signed [7:0] tap_6;
   logic signed [39:0] prod_tap_6xcoeff_6;
   logic signed [7:0] tap_7;
   logic signed [39:0] prod_tap_7xcoeff_7;
   logic signed [7:0] tap_8;
   logic signed [39:0] prod_tap_8xcoeff_8;
   logic signed [7:0] tap_9;
   logic signed [39:0] prod_tap_9xcoeff_9;
   logic signed [7:0] tap_10;
   logic signed [39:0] prod_tap_10xcoeff_10;
   logic signed [7:0] tap_11;
   logic signed [39:0] prod_tap_11xcoeff_11;
   logic signed [7:0] tap_12;
   logic signed [39:0] prod_tap_12xcoeff_12;
   logic signed [15:0] sum;
   logic signed [9:0] rounded;
   logic signed [7:0] saturated;

   assign prod_tap_0xcoeff_0 = tap_0 * coeff_0;
   assign prod_tap_1xcoeff_1 = tap_1 * coeff_1;
   assign prod_tap_2xcoeff_2 = tap_2 * coeff_2;
   assign prod_tap_3xcoeff_3 = tap_3 * coeff_3;
   assign prod_tap_4xcoeff_4 = tap_4 * coeff_4;
   assign prod_tap_5xcoeff_5 = tap_5 * coeff_5;
   assign prod_tap_6xcoeff_6 = tap_6 * coeff_6;
   assign prod_tap_7xcoeff_7 = tap_7 * coeff_7;
   assign prod_tap_8xcoeff_8 = tap_8 * coeff_8;
   assign prod_tap_9xcoeff_9 = tap_9 * coeff_9;
   assign prod_tap_10xcoeff_10 = tap_10 * coeff_10;
   assign prod_tap_11xcoeff_11 = tap_11 * coeff_11;
   assign prod_tap_12xcoeff_12 = tap_12 * coeff_12;
   assign rounded = (sum + (16'sd1<<<(7-1)))>>>7;
   assign saturated = (rounded > 10'sd127) ? 8'sd127 :
                       ((rounded < $signed(-10'd128)) ? -8'd128 : rounded);


   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           tap_4 <= 'd0;
           tap_5 <= 'd0;
           tap_6 <= 'd0;
           tap_7 <= 'd0;
           tap_8 <= 'd0;
           tap_9 <= 'd0;
           tap_10 <= 'd0;
           tap_11 <= 'd0;
           tap_12 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           tap_0 <= data_in;
           tap_1 <= tap_0;
           tap_2 <= tap_1;
           tap_3 <= tap_2;
           tap_4 <= tap_3;
           tap_5 <= tap_4;
           tap_6 <= tap_5;
           tap_7 <= tap_6;
           tap_8 <= tap_7;
           tap_9 <= tap_8;
           tap_10 <= tap_9;
           tap_11 <= tap_10;
           tap_12 <= tap_11;
           sum <= 16'(prod_tap_0xcoeff_0) + 16'(prod_tap_1xcoeff_1) + 16'(prod_tap_2xcoeff_2) + 16'(prod_tap_3xcoeff_3) + 16'(prod_tap_4xcoeff_4) + 16'(prod_tap_5xcoeff_5) + 16'(prod_tap_6xcoeff_6) + 16'(prod_tap_7xcoeff_7) + 16'(prod_tap_8xcoeff_8) + 16'(prod_tap_9xcoeff_9) + 16'(prod_tap_10xcoeff_10) + 16'(prod_tap_11xcoeff_11) + 16'(prod_tap_12xcoeff_12);
           data_out <= saturated;
        end

    myFIR3_coeffRegs coeff_block
      (
        .clk(clk),
        .rst_b(rst_b),
        .COEFF_0(coeff_0),
        .COEFF_1(coeff_1),
        .COEFF_2(coeff_2),
        .COEFF_3(coeff_3),
        .COEFF_4(coeff_4),
        .COEFF_5(coeff_5),
        .COEFF_6(coeff_6),
        .COEFF_7(coeff_7),
        .COEFF_8(coeff_8),
        .COEFF_9(coeff_9),
        .COEFF_10(coeff_10),
        .COEFF_11(coeff_11),
        .COEFF_12(coeff_12),
        .regs(regs)
      );

endmodule
/* verilator lint_on WIDTH */        

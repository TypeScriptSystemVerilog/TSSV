

interface AXI4Stream_32_4_0_4;

   logic  ACLK;
   logic  ACLKEN;
   logic  ARESETn;
   logic  TVALID;
   logic  TREADY;
   logic [31:0] TDATA;
   logic [3:0] TSTRB;
   logic [3:0] TKEEP;
   logic  TLAST;
   logic [7:0] TID;
   logic [3:0] TDEST;
   logic  TWAKEUP;


    modport outward (
      input ACLK,
      input ACLKEN,
      input ARESETn,
      output TVALID,
      input TREADY,
      output TDATA,
      output TSTRB,
      output TKEEP,
      output TLAST,
      output TID,
      output TDEST,
      output TWAKEUP
    );           

    modport inward (
      input ACLK,
      input ACLKEN,
      input ARESETn,
      input TVALID,
      output TREADY,
      input TDATA,
      input TSTRB,
      input TKEEP,
      input TLAST,
      input TID,
      input TDEST,
      input TWAKEUP
    );           


endinterface
        



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
module myFIR_coeffRegs 
   (
   input logic  clk,
   input logic  rst_b,
   output logic signed [31:0] COEFF_0,
   output logic signed [31:0] COEFF_1,
   output logic signed [31:0] COEFF_2,
   output logic signed [31:0] COEFF_3,
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
      default: regs.DATA_RD <= 0;
    endcase
  end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_0 <= 'd1;
        end
      else if(COEFF_0_WE)
        begin
           COEFF_0 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_1 <= 'd2;
        end
      else if(COEFF_1_WE)
        begin
           COEFF_1 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_2 <= 'd3;
        end
      else if(COEFF_2_WE)
        begin
           COEFF_2 <= regs.DATA_WR;
        end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           COEFF_3 <= 'd4;
        end
      else if(COEFF_3_WE)
        begin
           COEFF_3 <= regs.DATA_WR;
        end

endmodule
/* verilator lint_on WIDTH */        


/* verilator lint_off WIDTH */
module myFIR 
   (
   input logic  clk,
   input logic  rst_b,
   AXI4Stream_32_4_0_4.inward s_axis,
   AXI4Stream_32_4_0_4.outward m_axis
   );

   memory_32_32 regs();
   logic signed [7:0] data_in;
   logic signed [8:0] data_out;
   logic  en;
   logic  valid_pipe_0;
   logic  valid_pipe_1;
   logic signed [31:0] coeff_0;
   logic signed [31:0] coeff_1;
   logic signed [31:0] coeff_2;
   logic signed [31:0] coeff_3;
   logic signed [7:0] tap_0;
   logic signed [39:0] prod_tap_0xcoeff_0;
   logic signed [7:0] tap_1;
   logic signed [39:0] prod_tap_1xcoeff_1;
   logic signed [7:0] tap_2;
   logic signed [39:0] prod_tap_2xcoeff_2;
   logic signed [7:0] tap_3;
   logic signed [39:0] prod_tap_3xcoeff_3;
   logic signed [11:0] sum;
   logic signed [10:0] rounded;
   logic signed [8:0] saturated;

   assign en = m_axis.TREADY || !valid_pipe_1;
   assign s_axis.TREADY = en;
   assign data_in = $signed(s_axis.TDATA[7:0]);
   assign prod_tap_0xcoeff_0 = tap_0 * coeff_0;
   assign prod_tap_1xcoeff_1 = tap_1 * coeff_1;
   assign prod_tap_2xcoeff_2 = tap_2 * coeff_2;
   assign prod_tap_3xcoeff_3 = tap_3 * coeff_3;
   assign rounded = (sum + (12'sd1<<<(2-1)))>>>2;
   assign saturated = (rounded > 11'sd255) ? 9'sd255 :
                       ((rounded < $signed(-11'd256)) ? -9'd256 : rounded);
   assign m_axis.TVALID = valid_pipe_1;
   assign m_axis.TDATA  = {{23{data_out[8]}}, data_out};
   assign m_axis.TLAST   = 1'b1;
   assign m_axis.TSTRB   = 4'hF;
   assign m_axis.TKEEP   = 4'hF;
   assign m_axis.TID     = '0;
   assign m_axis.TDEST   = '0;
   assign m_axis.TWAKEUP = 1'b0;


   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           valid_pipe_0 <= 'd0;
           valid_pipe_1 <= 'd0;
           tap_0 <= 'd0;
           tap_1 <= 'd0;
           tap_2 <= 'd0;
           tap_3 <= 'd0;
           sum <= 'd0;
           data_out <= 'd0;
        end
      else if(en)
        begin
           valid_pipe_0 <= s_axis.TVALID;
           valid_pipe_1 <= valid_pipe_0;
           tap_0 <= data_in;
           tap_1 <= tap_0;
           tap_2 <= tap_1;
           tap_3 <= tap_2;
           sum <= 12'(prod_tap_0xcoeff_0) + 12'(prod_tap_1xcoeff_1) + 12'(prod_tap_2xcoeff_2) + 12'(prod_tap_3xcoeff_3);
           data_out <= saturated;
        end

    myFIR_coeffRegs coeff_block
      (
        .clk(clk),
        .rst_b(rst_b),
        .COEFF_0(coeff_0),
        .COEFF_1(coeff_1),
        .COEFF_2(coeff_2),
        .COEFF_3(coeff_3),
        .regs(regs)
      );

endmodule
/* verilator lint_on WIDTH */        

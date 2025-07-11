import AIGC_DEMO_Reg_pkg::*;

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

                
               
        module AIGC_DEMO_Reg 
           (
           input   clk,
   input   rst_b,
   input  [15:0] paddr,
   input  [31:0] pwdata,
   output  [31:0] prdata,
   input   psel,
   input   penable,
   input   pwrite,
   output   pready,
   output reg   pslverr,
   input  [31:0] cfg_unit_id,
   output  [31:0] cfg_ctrl,
   output  [31:0] cfg_cfg0,
   input  [31:0] cfg_debug_0,
   input  [31:0] cfg_debug_1_0,
   input  [31:0] cfg_debug_1_1,
   input  [31:0] cfg_debug_1_2,
   input  [31:0] cfg_debug_1_3,
   input  [31:0] cfg_debug_1_4,
   input  [31:0] cfg_debug_1_5,
   input  [31:0] cfg_debug_1_6,
   input  [31:0] cfg_debug_1_7,
   output  [31:0] cfg_dummy_debug
           );
        
           wire  reg_rd;
   wire  reg_wr;
   wire [15:0] reg_addr;
   reg [31:0] reg_rdata;
   wire [31:0] reg_wdata;
   wire [31:0] next_rdata;
   wire  in_range;
   wire  slverr;
   wire  dec_unit_id;
   wire [31:0] reg_unit_id;
   wire  dec_ctrl;
   reg [31:0] reg_ctrl;
   wire  ctrl_we;
   wire  dec_cfg0;
   reg [31:0] reg_cfg0;
   reg  cfg0_sc;
   wire  cfg0_we;
   wire  dec_debug_0;
   wire [31:0] reg_debug_0;
   wire  dec_debug_1_0;
   wire [31:0] reg_debug_1_0;
   wire  dec_debug_1_1;
   wire [31:0] reg_debug_1_1;
   wire  dec_debug_1_2;
   wire [31:0] reg_debug_1_2;
   wire  dec_debug_1_3;
   wire [31:0] reg_debug_1_3;
   wire  dec_debug_1_4;
   wire [31:0] reg_debug_1_4;
   wire  dec_debug_1_5;
   wire [31:0] reg_debug_1_5;
   wire  dec_debug_1_6;
   wire [31:0] reg_debug_1_6;
   wire  dec_debug_1_7;
   wire [31:0] reg_debug_1_7;
   wire  dec_dummy_debug;
   reg [31:0] reg_dummy_debug;
   wire  dummy_debug_we;
        
        // apb interface
assign prdata = reg_rdata;
assign reg_wr = psel && penable && pwrite;
assign reg_rd = psel && !penable && !pwrite;
assign pready = 1'b1;
assign slverr = psel && !in_range;
assign reg_addr = paddr;
assign reg_wdata = pwdata;
assign dec_unit_id = (reg_addr == 16'h0000) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_unit_id = cfg_unit_id;
assign dec_ctrl = (reg_addr == 16'h0004) ? 1'd1 : 1'd0;
assign ctrl_we = reg_wr && dec_ctrl;
// non-RO: output
assign cfg_ctrl = reg_ctrl;
assign dec_cfg0 = (reg_addr == 16'h000C) ? 1'd1 : 1'd0;
assign cfg0_we = reg_wr && dec_cfg0;
// non-RO: output
assign cfg_cfg0 = reg_cfg0;
assign dec_debug_0 = (reg_addr == 16'h0400) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_0 = cfg_debug_0;
assign dec_debug_1_0 = (reg_addr == 16'h0404) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_0 = cfg_debug_1_0;
assign dec_debug_1_1 = (reg_addr == 16'h0408) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_1 = cfg_debug_1_1;
assign dec_debug_1_2 = (reg_addr == 16'h040C) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_2 = cfg_debug_1_2;
assign dec_debug_1_3 = (reg_addr == 16'h0410) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_3 = cfg_debug_1_3;
assign dec_debug_1_4 = (reg_addr == 16'h0414) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_4 = cfg_debug_1_4;
assign dec_debug_1_5 = (reg_addr == 16'h0418) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_5 = cfg_debug_1_5;
assign dec_debug_1_6 = (reg_addr == 16'h041C) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_6 = cfg_debug_1_6;
assign dec_debug_1_7 = (reg_addr == 16'h0420) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1_7 = cfg_debug_1_7;
assign dec_dummy_debug = (reg_addr == 16'h0FFC) ? 1'd1 : 1'd0;
assign dummy_debug_we = reg_wr && dec_dummy_debug;
// non-RO: output
assign cfg_dummy_debug = reg_dummy_debug;
assign in_range = |{dec_unit_id,
dec_ctrl,
dec_cfg0,
dec_debug_0,
dec_debug_1_0,
dec_debug_1_1,
dec_debug_1_2,
dec_debug_1_3,
dec_debug_1_4,
dec_debug_1_5,
dec_debug_1_6,
dec_debug_1_7,
dec_dummy_debug};
// Read data mux
assign next_rdata = 
( {32{dec_unit_id}} & reg_unit_id ) |
( {32{dec_ctrl}} & reg_ctrl ) |
( {32{dec_cfg0}} & 32'h0 ) |
( {32{dec_debug_0}} & reg_debug_0 ) |
( {32{dec_debug_1_0}} & reg_debug_1_0 ) |
( {32{dec_debug_1_1}} & reg_debug_1_1 ) |
( {32{dec_debug_1_2}} & reg_debug_1_2 ) |
( {32{dec_debug_1_3}} & reg_debug_1_3 ) |
( {32{dec_debug_1_4}} & reg_debug_1_4 ) |
( {32{dec_debug_1_5}} & reg_debug_1_5 ) |
( {32{dec_debug_1_6}} & reg_debug_1_6 ) |
( {32{dec_debug_1_7}} & reg_debug_1_7 ) |
( {32{dec_dummy_debug}} & reg_dummy_debug );

    
        
    
        
always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    pslverr <= 1'h0;
      end
  else
  begin
  pslverr <= slverr;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_ctrl <= 32'h10001;
      end
  else if(ctrl_we)
  begin
  reg_ctrl <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_cfg0 <= 32'h0;
      end
  else if(cfg0_we)
  begin
  reg_cfg0 <= reg_wdata;
  end
  else if(cfg0_sc)
  begin
  reg_cfg0 <= 32'h0;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    cfg0_sc <= 1'h0;
      end
  else if(cfg0_we)
  begin
  cfg0_sc <= 1'b1;
  end
  else if(cfg0_sc)
  begin
  cfg0_sc <= 1'b0;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_dummy_debug <= 32'h0;
      end
  else if(dummy_debug_we)
  begin
  reg_dummy_debug <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_rdata <= 32'h0;
      end
  else if(reg_rd)
  begin
  reg_rdata <= next_rdata;
  end
  

        
        endmodule
         : AIGC_DEMO_Reg

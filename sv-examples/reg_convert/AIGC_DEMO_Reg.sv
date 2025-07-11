import AIGC_DEMO_Reg_pkg::*;

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

// Commit ID: 5d881a42678bd22a450b3e43987eb208f7e70cf4



module AIGC_DEMO_Reg
(
input logic  clk,
input logic  rst_b,
input logic [11:0] paddr,
input logic [31:0] pwdata,
output logic [31:0] prdata,
input logic  psel,
input logic  penable,
input logic  pwrite,
output logic  pready,
output reg  pslverr,
input logic [31:0] cfg_unit_id,
output logic [31:0] cfg_ctrl,
output logic [31:0] cfg_cfg0,
input logic [31:0] cfg_debug_0,
input logic [31:0] cfg_debug_1_0,
input logic [31:0] cfg_debug_1_1,
input logic [31:0] cfg_debug_1_2,
input logic [31:0] cfg_debug_1_3,
input logic [31:0] cfg_debug_1_4,
input logic [31:0] cfg_debug_1_5,
input logic [31:0] cfg_debug_1_6,
input logic [31:0] cfg_debug_1_7,
output logic [31:0] cfg_dummy_debug
);

logic  reg_rd;
logic  reg_wr;
logic [11:0] reg_addr;
logic [31:0] reg_rdata;
logic [31:0] reg_wdata;
logic [31:0] next_rdata;
logic  in_range;
logic  slverr;
logic  dec_unit_id;
UNIT_ID_t reg_unit_id;
logic  dec_ctrl;
CTRL_t reg_ctrl;
logic  ctrl_we;
logic  dec_cfg0;
CFG0_t reg_cfg0;
logic  cfg0_sc;
logic  cfg0_we;
logic  dec_debug_0;
DEBUG_0_t reg_debug_0;
logic  dec_debug_1_0;
DEBUG_1_t reg_debug_1_0;
logic  dec_debug_1_1;
DEBUG_1_t reg_debug_1_1;
logic  dec_debug_1_2;
DEBUG_1_t reg_debug_1_2;
logic  dec_debug_1_3;
DEBUG_1_t reg_debug_1_3;
logic  dec_debug_1_4;
DEBUG_1_t reg_debug_1_4;
logic  dec_debug_1_5;
DEBUG_1_t reg_debug_1_5;
logic  dec_debug_1_6;
DEBUG_1_t reg_debug_1_6;
logic  dec_debug_1_7;
DEBUG_1_t reg_debug_1_7;
logic  dec_dummy_debug;
DUMMY_DEBUG_t reg_dummy_debug;
logic  dummy_debug_we;

// apb interface
assign reg_wr = psel && penable && pwrite;
assign reg_rd = psel && !penable && !pwrite;
assign reg_addr = paddr;
assign reg_wdata = pwdata;
assign prdata = reg_rdata;
assign pready = 1'b1;
assign slverr = psel && !in_range;
assign dec_unit_id = (reg_addr == 12'h000) ? 1'd1 : 1'd0;
assign reg_unit_id = cfg_unit_id;
assign dec_ctrl = (reg_addr == 12'h004) ? 1'd1 : 1'd0;
assign ctrl_we = reg_wr && dec_ctrl;
assign cfg_ctrl = reg_ctrl;
assign dec_cfg0 = (reg_addr == 12'h00C) ? 1'd1 : 1'd0;
assign cfg0_we = reg_wr && dec_cfg0;
assign cfg_cfg0 = reg_cfg0;
assign dec_debug_0 = (reg_addr == 12'h400) ? 1'd1 : 1'd0;
assign reg_debug_0 = cfg_debug_0;
assign dec_debug_1_0 = (reg_addr == 12'h404) ? 1'd1 : 1'd0;
assign reg_debug_1_0 = cfg_debug_1_0;
assign dec_debug_1_1 = (reg_addr == 12'h408) ? 1'd1 : 1'd0;
assign reg_debug_1_1 = cfg_debug_1_1;
assign dec_debug_1_2 = (reg_addr == 12'h40C) ? 1'd1 : 1'd0;
assign reg_debug_1_2 = cfg_debug_1_2;
assign dec_debug_1_3 = (reg_addr == 12'h410) ? 1'd1 : 1'd0;
assign reg_debug_1_3 = cfg_debug_1_3;
assign dec_debug_1_4 = (reg_addr == 12'h414) ? 1'd1 : 1'd0;
assign reg_debug_1_4 = cfg_debug_1_4;
assign dec_debug_1_5 = (reg_addr == 12'h418) ? 1'd1 : 1'd0;
assign reg_debug_1_5 = cfg_debug_1_5;
assign dec_debug_1_6 = (reg_addr == 12'h41C) ? 1'd1 : 1'd0;
assign reg_debug_1_6 = cfg_debug_1_6;
assign dec_debug_1_7 = (reg_addr == 12'h420) ? 1'd1 : 1'd0;
assign reg_debug_1_7 = cfg_debug_1_7;
assign dec_dummy_debug = (reg_addr == 12'hFFC) ? 1'd1 : 1'd0;
assign dummy_debug_we = reg_wr && dec_dummy_debug;
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





always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
pslverr <= 1'h0;
end
else
begin
pslverr <= slverr;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_ctrl <= 32'h10001;
end
else if(ctrl_we)
begin
reg_ctrl <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

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
reg_cfg0 <= 32'b0;
end


always_ff @( posedge clk  or negedge rst_b )

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


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_dummy_debug <= 32'h0;
end
else if(dummy_debug_we)
begin
reg_dummy_debug <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

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

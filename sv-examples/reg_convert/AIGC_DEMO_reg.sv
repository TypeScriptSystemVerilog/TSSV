import AIGC_DEMO_reg_pkg::*;

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

// Commit ID: 43ac171b50db426673e378dec36af26f70c8a2df




module AIGC_DEMO_reg
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
output logic  pslverr,
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
output logic [31:0] cfg_dummy_debug,
output logic [31:0] cfg_sysctrl
);

logic  reg_rd;
logic  reg_wr;
logic [11:0] reg_addr;
logic [31:0] reg_rdata;
logic [31:0] reg_wdata;
logic [31:0] next_rdata;
logic  in_range;
logic [31:0] clrzeros;
logic  slverr;
logic  dec_unit_id;
logic [31:0] reg_unit_id;
logic  dec_ctrl;
logic [31:0] reg_ctrl;
logic  ctrl_we;
logic  dec_cfg0;
logic [31:0] reg_cfg0;
logic  cfg0_sc;
logic  cfg0_we;
logic  dec_debug_0;
logic [31:0] reg_debug_0;
logic  dec_debug_1_0;
logic [31:0] reg_debug_1_0;
logic  dec_debug_1_1;
logic [31:0] reg_debug_1_1;
logic  dec_debug_1_2;
logic [31:0] reg_debug_1_2;
logic  dec_debug_1_3;
logic [31:0] reg_debug_1_3;
logic  dec_debug_1_4;
logic [31:0] reg_debug_1_4;
logic  dec_debug_1_5;
logic [31:0] reg_debug_1_5;
logic  dec_debug_1_6;
logic [31:0] reg_debug_1_6;
logic  dec_debug_1_7;
logic [31:0] reg_debug_1_7;
logic  dec_dummy_debug;
logic [31:0] reg_dummy_debug;
logic  dummy_debug_we;
logic  dec_sysctrl;
logic [31:0] reg_sysctrl;
logic [31:0] reg_sysctrl_w1c;
logic  sysctrl_w1ce;

assign clrzeros = 32'h0;
// apb interface
always_comb
begin
reg_wr = psel && penable && pwrite;
reg_rd = psel && !penable && !pwrite;
reg_addr = paddr;
reg_wdata = pwdata;
prdata = reg_rdata;

pready = 1'b1;
end

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
assign dec_sysctrl = (reg_addr == 12'h1000) ? 1'd1 : 1'd0;
assign reg_sysctrl_w1c = reg_sysctrl & ~reg_wdata;
assign sysctrl_w1ce = reg_wr && dec_sysctrl;
assign cfg_sysctrl = reg_sysctrl;
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
dec_dummy_debug,
dec_sysctrl};
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
( {32{dec_dummy_debug}} & reg_dummy_debug ) |
( {32{dec_sysctrl}} & reg_sysctrl );

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
pslverr <= 1'h0;
cfg0_sc <= 1'h0;
end
else
begin
pslverr <= slverr;
cfg0_sc <= cfg0_sc;
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

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
reg_cfg0 <= 32'h0;
end
else if(cfg0_sc)
begin
reg_cfg0 <= clrzeros;
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
reg_sysctrl <= 32'h0;
end
else if(sysctrl_w1ce)
begin
reg_sysctrl <= reg_sysctrl_w1c;
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


endmodule : AIGC_DEMO_reg_pkg

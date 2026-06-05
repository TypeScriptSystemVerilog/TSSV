



interface APB4_12_32;

logic  PCLK;
logic  PRESETn;
logic [11:0] PADDR;
logic  PSELx;
logic  PENABLE;
logic  PWRITE;
logic [31:0] PRDATA;
logic [31:0] PWDATA;
logic [2:0] PPROT;
logic [3:0] PSTRB;
logic  PREADY;
logic  PSLVERR;
logic  PCLKEN;


modport outward (
input PCLK,
input PRESETn,
output PADDR,
output PSELx,
output PENABLE,
output PWRITE,
input PRDATA,
output PWDATA,
output PPROT,
output PSTRB,
input PREADY,
input PSLVERR,
input PCLKEN
);

modport inward (
input PCLK,
input PRESETn,
input PADDR,
input PSELx,
input PENABLE,
input PWRITE,
output PRDATA,
input PWDATA,
input PPROT,
input PSTRB,
output PREADY,
output PSLVERR,
input PCLKEN
);


endinterface




/* verilator lint_off WIDTH */
module AIGC_DEMO_reg
(
input logic  clk,
input logic  rst_b,
input logic [31:0] cfg_unit_id,
output logic [31:0] cfg_ctrl,
output logic [31:0] cfg_cfg0,
input logic [31:0] cfg_debug_0,
input logic [31:0] cfg_debug_1,
output logic [31:0] cfg_dummy_debug,
APB4_12_32.inward regs
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
logic [31:0] reg_unit_id;
logic  dec_ctrl;
logic [31:0] reg_ctrl;
logic  ctrl_re;
logic  ctrl_we;
logic  dec_cfg0;
logic [31:0] reg_cfg0;
logic  cfg0_sc;
logic  cfg0_we;
logic  dec_debug_0;
logic [31:0] reg_debug_0;
logic  dec_debug_1;
logic [31:0] reg_debug_1;
logic  dec_dummy_debug;
logic [31:0] reg_dummy_debug;
logic  dummy_debug_re;
logic  dummy_debug_we;

// apb interface
always_comb
begin
reg_wr = regs.PSELx && regs.PENABLE && regs.PWRITE;
reg_rd = regs.PSELx && !regs.PENABLE && !regs.PWRITE;
reg_addr = regs.PADDR;
reg_wdata = regs.PWDATA;
regs.PRDATA = reg_rdata;

regs.PREADY = 1'b1;
end

assign slverr = regs.PSELx && !in_range;
assign dec_unit_id = (reg_addr == 12'h000) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_unit_id = cfg_unit_id;
assign dec_ctrl = (reg_addr == 12'h004) ? 1'd1 : 1'd0;
assign ctrl_re = reg_rd && dec_ctrl;
assign ctrl_we = reg_wr && dec_ctrl;
// non-RO: output
assign cfg_ctrl = reg_ctrl;
assign dec_cfg0 = (reg_addr == 12'h00C) ? 1'd1 : 1'd0;
assign cfg0_we = reg_wr && dec_cfg0;
// non-RO: output
assign cfg_cfg0 = reg_cfg0;
assign dec_debug_0 = (reg_addr == 12'h400) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_0 = cfg_debug_0;
assign dec_debug_1 = (reg_addr == 12'h404) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_debug_1 = cfg_debug_1;
assign dec_dummy_debug = (reg_addr == 12'hFFC) ? 1'd1 : 1'd0;
assign dummy_debug_re = reg_rd && dec_dummy_debug;
assign dummy_debug_we = reg_wr && dec_dummy_debug;
// non-RO: output
assign cfg_dummy_debug = reg_dummy_debug;
// address decode
assign in_range = |{dec_unit_id,
dec_ctrl,
dec_cfg0,
dec_debug_0,
dec_debug_1,
dec_dummy_debug};
// Read data mux
assign next_rdata =
( {32{dec_unit_id}} & reg_unit_id ) |
( {32{dec_ctrl}} & reg_ctrl ) |
( {32{dec_cfg0}} & 32'h0 ) |
( {32{dec_debug_0}} & reg_debug_0 ) |
( {32{dec_debug_1}} & reg_debug_1 ) |
( {32{dec_dummy_debug}} & reg_dummy_debug );





always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
regs.PSLVERR <= undefined'h0;
end
else
begin
regs.PSLVERR <= slverr;
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
reg_cfg0 <= 32'h0;
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
/* verilator lint_on WIDTH */


/* verilator lint_off WIDTH */
module tb_testRegBlock
(
input logic  clk,
input logic  rst_b
);

APB4_12_32 regs();
logic [31:0] cfg_unit_id;
logic [31:0] cfg_ctrl;
logic [31:0] cfg_cfg0;
logic [31:0] cfg_debug_0;
logic [31:0] cfg_debug_1;
logic [31:0] cfg_dummy_debug;


logic [15:0] count;

always @(posedge clk or negedge rst_b) begin
if (!rst_b) begin
count <= 'd0;
end else begin
count <= count + 1'b1;

case (count)
'd0: begin
regs.PADDR <= 32'h00000000;
regs.PWDATA <= 32'h12345678;
regs.PWRITE <= 1;
regs.PENABLE <= 1;
end
'd1: begin
regs.PWRITE <= 0;
regs.PWRITE <= 0;
regs.PENABLE <= 1;
end
'd2: begin
regs.PWRITE <= 0;
regs.PENABLE <= 0;
end
'd3: begin
regs.PADDR <= 32'h00000008;
regs.PWDATA <= 32'h87654321;
regs.PWRITE <= 1;
end
'd4: begin
regs.PWRITE <= 0;
regs.PENABLE <= 1;
end
'd5: begin
regs.PWRITE <= 0;
regs.PENABLE <= 0;
end
'd6: begin
regs.PADDR <= 32'h00000020;
regs.PWDATA <= 32'hAABBCCDD;
regs.PWRITE <= 1;
end
'd7: begin
regs.PWRITE <= 0;
regs.PENABLE <= 1;
end
'd8: begin
regs.PWRITE <= 0;
regs.PENABLE <= 0;
end
'd9: begin
// End of test
$finish;
end
default: ;
endcase
end
end



AIGC_DEMO_reg dut
(
.clk(clk),
.rst_b(rst_b),
.cfg_unit_id(cfg_unit_id),
.cfg_ctrl(cfg_ctrl),
.cfg_cfg0(cfg_cfg0),
.cfg_debug_0(cfg_debug_0),
.cfg_debug_1(cfg_debug_1),
.cfg_dummy_debug(cfg_dummy_debug),
.regs(regs)
);




endmodule
/* verilator lint_on WIDTH */

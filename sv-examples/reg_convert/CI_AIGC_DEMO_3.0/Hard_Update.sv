import Hard_Update_pkg::*;

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

// Commit ID: de56a3a3dc57d2f8959dd9ed5b5ab4b7b01cd2e9




/* verilator lint_off WIDTH */
module Hard_Update
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
output logic [31:0] cfg_cfg0
);

logic  reg_rd;
logic  reg_wr;
logic [11:0] reg_addr;
logic [31:0] reg_rdata;
logic [31:0] reg_wdata;
logic [31:0] next_rdata;
logic  in_range;
logic  slverr;
logic  dec_cfg0;
CFG0_t reg_cfg0;
logic  cfg0_sc;
logic  cfg0_we;

// apb interface
assign reg_wr = psel && penable && pwrite;
assign reg_rd = psel && !penable && !pwrite;
assign reg_addr = paddr;
assign reg_wdata = pwdata;
assign prdata = reg_rdata;
assign pready = 1'b1;
assign slverr = psel && !in_range;
assign dec_cfg0 = (reg_addr == 12'h00C) ? 1'd1 : 1'd0;
assign cfg0_we = reg_wr && dec_cfg0;
assign cfg_cfg0 = reg_cfg0;
assign in_range = |{dec_cfg0};
// Read data mux
assign next_rdata =
( {32{dec_cfg0}} & 32'h0 );





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
reg_rdata <= 32'h0;
end
else if(reg_rd)
begin
reg_rdata <= next_rdata;
end



endmodule
/* verilator lint_on WIDTH */
 : Hard_Update

import Hard_Update2p0_pkg::*;

// =============================================================================
// Generated Register Block 3.0
// =============================================================================

// Commit ID: 20a6af013fd07393de4c64eaf9009a282150fbc9





/* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */
module Hard_Update2p0
(
input logic  clk,
input logic  rst_b,
input logic [15:0] paddr,
input logic [31:0] pwdata,
output logic [31:0] prdata,
input logic  psel,
input logic  penable,
input logic  pwrite,
output logic  pready,
output reg  pslverr,
output logic [31:0] cfg_wptr,
input logic  wptr_update,
input logic [31:0] wptr_update_value,
output logic [31:0] cfg_fetch_rptr,
input logic  fetch_rptr_update,
input logic [31:0] fetch_rptr_update_value
);

logic  reg_rd;
logic  reg_wr;
logic [15:0] reg_addr;
logic [31:0] reg_rdata;
logic [31:0] reg_wdata;
logic [31:0] next_rdata;
logic  in_range;
logic  slverr;
logic  dec_wptr;
WPTR_t reg_wptr;
logic  wptr_we;
logic  dec_fetch_rptr;
FETCH_RPTR_t reg_fetch_rptr;
logic  fetch_rptr_we;

assign prdata = reg_rdata;
assign reg_wr = psel && penable && pwrite;
assign reg_rd = psel && !penable && !pwrite;
assign pready = 1'b1;
assign slverr = psel && !in_range;
assign reg_addr = paddr;
assign reg_wdata = pwdata;
assign dec_wptr = (reg_addr == 16'hF000) ? 1'd1 : 1'd0;
assign wptr_we = reg_wr && dec_wptr;
assign cfg_wptr = reg_wptr;
assign dec_fetch_rptr = (reg_addr == 16'hF004) ? 1'd1 : 1'd0;
assign fetch_rptr_we = reg_wr && dec_fetch_rptr;
assign cfg_fetch_rptr = reg_fetch_rptr;
assign in_range = |{dec_wptr,
dec_fetch_rptr};
assign next_rdata =
( {32{dec_wptr}} & reg_wptr ) |
( {32{dec_fetch_rptr}} & reg_fetch_rptr );





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
reg_wptr <= 32'h0;
end
else if(wptr_we)
begin
reg_wptr <= reg_wdata;
end
else if(wptr_update)
begin
reg_wptr <= wptr_update_value;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_fetch_rptr <= 32'h0;
end
else if(fetch_rptr_we)
begin
reg_fetch_rptr <= reg_wdata;
end
else if(fetch_rptr_update)
begin
reg_fetch_rptr <= fetch_rptr_update_value;
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
/* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */
 : Hard_Update2p0

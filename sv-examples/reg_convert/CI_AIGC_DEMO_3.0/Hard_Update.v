import Hard_Update_pkg::*;

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

                
               
        module Hard_Update 
           (
           input   clk,
   input   rst_b,
   input  [11:0] paddr,
   input  [31:0] pwdata,
   output  [31:0] prdata,
   input   psel,
   input   penable,
   input   pwrite,
   output   pready,
   output   pslverr,
   output  [31:0] cfg_cfg0
           );
        
           wire  reg_rd;
   wire  reg_wr;
   wire [11:0] reg_addr;
   reg [31:0] reg_rdata;
   wire [31:0] reg_wdata;
   wire [31:0] next_rdata;
   wire  in_range;
   wire  slverr;
   wire  dec_cfg0;
   reg [31:0] reg_cfg0;
   reg  cfg0_sc;
   wire  cfg0_we;
        
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
    reg_rdata <= 32'h0;
      end
  else if(reg_rd)
  begin
  reg_rdata <= next_rdata;
  end
  

        
        endmodule
         : Hard_Update

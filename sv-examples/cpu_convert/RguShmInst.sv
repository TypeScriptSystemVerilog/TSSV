//*****************************************************************************
// Filename   : RguShmInst.sv
// Description: 
//
//      Author: Huoguanting
//      Create:2024-07-12 16:00:41
//
//      V1.0 Huoguanting 2024-07-12
//*****************************************************************************
module RguShmInst
   #(
        parameter         PORT_N  = 3  ,
        parameter         ADDR_W  = 32 ,
        parameter         VAL_W   = 32 ,
        parameter         BANK_N  = 32 
    )(
		//clk && rst
		input                                                 clk		,		
		input                                                 rst_n		,
        
        //req IO 
        input   logic [PORT_N-1:0][BANK_N-1:0]                req_vld   ,
        output  logic [PORT_N-1:0][BANK_N-1:0]                req_rdy   ,
        input   logic [PORT_N-1:0][BANK_N-1:0][1:0]           req_type  ,
        input   logic [PORT_N-1:0][BANK_N-1:0][ADDR_W-1:0]    req_addr  ,
        
        input   logic [PORT_N-1:0][BANK_N-1:0][VAL_W/8-1:0]   req_wstrb ,
        input   logic [PORT_N-1:0][BANK_N-1:0][VAL_W-1:0]     req_wdata ,

        //ack IO 
        output  logic [PORT_N-1:0][BANK_N-1:0]                ack_rvld  ,
        output  logic [PORT_N-1:0][BANK_N-1:0][VAL_W-1:0]     ack_rdata  
        
    );   
    
    localparam SBANK_N = 4;
    localparam SRAM_R  = 1;
    localparam SRAM_W  = 0;
    
//-----------------------------------------------------------------------------
// 3 to 4 crossbar 
//-----------------------------------------------------------------------------
    logic [PORT_N-1:0][BANK_N-1:0][SBANK_N-1:0]          req_rdy_i;
    
    logic [BANK_N-1:0][SBANK_N-1:0][$clog2(PORT_N)-1:0]  sbank_pid;
    
    logic [BANK_N-1:0][SBANK_N-1:0]                      sbank_rvld;
    logic [BANK_N-1:0][SBANK_N-1:0][VAL_W-1:0]           sbank_rdata;
    
    generate 
        for(genvar gi=0;gi<BANK_N;gi++) begin       
            logic [PORT_N-1:0]                             req_vld_rmp;   
            logic [PORT_N-1:0]                             sbank_rdy;   
            logic [PORT_N-1:0][1:0]                        req_type_rmp;             
            logic [PORT_N-1:0][$clog2(SBANK_N)-1:0]        req_sid_rmp;
            logic [PORT_N-1:0][ADDR_W-$clog2(SBANK_N)-1:0] req_addr_rmp;
            
            logic [PORT_N-1:0][VAL_W/8-1:0]                req_wstrb_rmp;
            logic [PORT_N-1:0][VAL_W-1:0]                  req_wdata_rmp;
            
            logic [PORT_N-1:0][2+ADDR_W-$clog2(SBANK_N)+VAL_W/8+VAL_W-1:0] sbank_info;
            
            for(genvar gj=0;gj<PORT_N;gj++) begin 
                assign req_vld_rmp[gj]   = req_vld[gj][gi];
                assign req_sid_rmp[gj]   = req_addr[gj][gi][$clog2(SBANK_N)-1:0];
                assign req_addr_rmp[gj]  = req_addr[gj][gi][ADDR_W-$clog2(SBANK_N)-1:0];
                assign req_type_rmp[gj]  = req_type[gj][gi];
                
                assign req_wstrb_rmp[gj] = req_wstrb[gj][gi];
                assign req_wdata_rmp[gj] = req_wdata[gj][gi];
                
                assign sbank_info[gj] = {req_type_rmp[gj],req_addr_rmp[gj],req_wstrb_rmp[gj],req_wdata_rmp[gj]};
            end 

            for(genvar gj=0;gj<SBANK_N;gj++) begin 
                logic [1:0]                        sram_type;
                logic [ADDR_W-$clog2(SBANK_N)-1:0] sram_addr;
                logic [VAL_W/8-1:0]                sram_wstrb;
                logic [VAL_W-1:0]                  sram_wdata;
                
                logic [PORT_N-1:0]                 sbank_vld;
                logic [PORT_N-1:0]                 sbank_rdy;
                
                for(genvar gk=0;gk<PORT_N;gk++) begin 
                    assign sbank_vld[gk]         = req_vld_rmp[gk] && req_sid_rmp[gk] == gj;
                    assign req_rdy_i[gk][gi][gj] = sbank_vld[gk] && sbank_rdy[gk];
                end
                
                rhc_arbiter
                #(
                    .PORT_N	    (PORT_N	                ),
                    .DATA_W	    ($bits(sbank_info[0])   ),
                    .MODE	    (0					    ),
                    .RADIX	    (2					    )
                )u_arbunit(         
                    .clk	    (clk				    ),
                    .rst_n	    (rst_n				    ),
                    .ivalid	    (sbank_vld              ),
                    .iready	    (sbank_rdy              ),
                    .iprio	    ('0        			    ),
                    .idata	    (sbank_info             ),
                    .ovalid	    (sram_en                ),
                    .oready	    (1'b1        	        ), 
                    .optid	    (sbank_pid[gi][gj]      ),
                    .odata	    ({sram_type,sram_addr,sram_wstrb,sram_wdata})
                );
                
                assign sbank_rvld[gi][gj] = sram_en && sram_type == SRAM_R;
                rhc_spram#(
                    .DATA_W     (VAL_W                  ),
                    .DEPTH      (512                    ),
                    .WREN_W     (VAL_W/8                ),
                    .ADDR_W     ($clog2(512)            ),
                    .MODE_PHY   (0                      ),
                    .MODE_IO    (3                      ) 
                )u_sram(
                    .clk        (clk                    ),
                    .rst_n      (rst_n                  ),
                    .mem_ctrl   ('0                     ),                                 
                    .addr       (sram_addr[$clog2(512)-1:0]),
                    .wr_en      ({(VAL_W/8){sram_en && sram_type == SRAM_W}} & sram_wstrb),
                    .wr_data    (sram_wdata             ),
                    .rd_en      (sbank_rvld[gi][gj]     ),
                    .rd_data    (sbank_rdata[gi][gj]    )
                );
                
            end 
        end 
    endgenerate 
    
//-----------------------------------------------------------------------------
// 4 to 3 crossbar 
//-----------------------------------------------------------------------------        
    generate 
        for(genvar gi=0;gi<BANK_N;gi++) begin          
            for(genvar gj=0;gj<PORT_N;gj++) begin 
                logic [SBANK_N-1:0]            sbank_rvld_mask;
                logic [SBANK_N-1:0][VAL_W-1:0] sbank_rdata_mask;
                for(genvar gk=0;gk<SBANK_N;gk++) begin 
                    logic                      sbank_rdata_vld;
                    logic [$clog2(PORT_N)-1:0] sbank_rdata_pid;
                    
                    rhc_delay_reg#(                                                                                            
                        .DATA_W     ($clog2(PORT_N)         ),
                        .DELAY      (3                      ),                               
                        .DEPTH      (3                      ),
                        .MODE       (0                      )                                                                                
                    )u_delay( 
                        .clk        (clk                    ),                                                                   
                        .rst_n      (rst_n                  ),
                        .ivalid     (sbank_rvld[gi][gk]     ),                                                                   
                        .idata      (sbank_pid[gi][gk]      ), 
                        .ovalid     (sbank_rdata_vld        ),                                                                   
                        .odata      (sbank_rdata_pid        )
                    );
                    
                    assign sbank_rvld_mask[gk]  = sbank_rdata_vld && sbank_rdata_pid == gj;
                    assign sbank_rdata_mask[gk] = sbank_rvld_mask[gk] ? sbank_rdata[gi][gk] : '0;
                end 
                
                assign ack_rvld[gj][gi] = |sbank_rvld_mask;
                rhc_op_ctree#(
                    .DATA_N (SBANK_N         ),
                    .DATA_W (VAL_W           ),
                    .RES_W  (VAL_W           ),
                    .OPCODE ("OR"            )
                )u_optree1(
                    .idata  (sbank_rdata_mask ),
                    .result (ack_rdata[gj][gi])
                );
                
                assign req_rdy[gj][gi] = |req_rdy_i[gj][gi];
            end 
        end 
    endgenerate
    
endmodule 
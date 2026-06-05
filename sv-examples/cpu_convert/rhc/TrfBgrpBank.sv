// =========================================================================
// Module      : TrfBgrpBank
// File        : TrfBgrpBank.sv
// -------------------------------------------------------------------------
// Description : Trf 4bank sram of 4thd and hist reg
//               1. support 4 thd write 1port and read 3port
//               2. support write history reg 
// -------------------------------------------------------------------------
// Revisions   :
//  Date           Version     Author        Company   Description
//  01-06-2024     v0.1        lubing.liu    HX        initial 
//  06-06-2024     v0.2        meng.yao      HX        history reg 
// =========================================================================
module TrfBgrpBank
import TPartCommon::*;

(
    // clk & rst_n
    input  logic                                                clk             ,
    input  logic                                                rst_n           ,
    
    // write bank
    input logic         [BANK_N-1:0]                           port_wen       ,
    input logic         [BANK_N-1:0][BNK_AW-1:0]               port_waddr     ,
    input logic         [BANK_N-1:0][BNK_DW-1:0]               port_wdata     ,
    input logic         [BANK_N-1:0][THDB_N-1:0][THD_DW-1:0]   port_bmask_th  ,

    // read bank
    input logic                                                 tid_wr_en       ,
    input logic         [BANK_N-1:0][BNK_AW-1:0]                bank_raddr      ,    //d0
    input logic         [BANK_N-1:0]                            bank_ren        ,    //d0
    input logic         [BANK_N-1:0][THDB_N-1:0]                bank_rmask      ,    //d0
    output logic        [BANK_N-1:0][BNK_DW-1:0]                bank_rdata      ,    //d2
    output logic        [HIST_N-1:0][BNK_DW-1:0]                port_hist_rdata      //d2  
);


logic         [BANK_N-1:0][THDB_N-1:0][THD_DW-1:0]              port_wdata_d1       ;
logic         [BANK_N-1:0][THDB_N-1:0][THD_DW-1:0]              bank_bitmask        ;

logic         [HIST_N-1:0][THDB_N-1:0][THD_DW-1:0]              hist_data           ;
logic         [BNK_DW-1:0]                                      wr_bmask_4th        ;

//update hist_data
assign wr_bmask_4th = port_bmask_th[0]  ;
assign hist_data[0] = port_wdata[0]     ; 
generate
    for(genvar th=0; th<THDB_N; th++) begin: THDMASK
        always_ff@(posedge clk or negedge rst_n)begin
            if(!rst_n)begin
                hist_data[1][th] <=  'b0                                    ;
                hist_data[2][th] <=  'b0                                    ;
                hist_data[3][th] <=  'b0                                    ;
            end
            else if((|port_wen) && (!tid_wr_en))begin
                hist_data[1][th] <=  (hist_data[0][th] &  wr_bmask_4th  ) 
                                    |(hist_data[1][th] & (~wr_bmask_4th)) ;
                hist_data[2][th] <=  hist_data[1][th]                                     ;
                hist_data[3][th] <=  hist_data[2][th]                                     ;
            end
        end
    end
endgenerate

generate
    for(genvar bk=0; bk<BANK_N; bk++) begin: BKNUM
        always_ff@(posedge clk or negedge rst_n)begin
            if(!rst_n)
                port_wdata_d1[bk] <= 'b0              ;
            else if(port_wen[bk])
                port_wdata_d1[bk] <= port_wdata[bk]   ;
        end
    end
endgenerate

//output hist to regport
assign port_hist_rdata = hist_data;

//bank write and read
generate
    for(genvar bk=0; bk<BANK_N; bk++) begin: BANK
        //write port broadcast to bank
        logic                                                   bank_wen        ;
        logic           [BNK_DW-1:0]                            bank_wdata      ;
        logic           [BNK_AW-1:0]                            bank_waddr      ;
        logic           [BNK_AW-1:0]                            bank_addr       ;
        logic           [BNK_DW-1:0]                            bank_rdata_pre  ;    
        logic           [THDB_N-1:0]                            bank_rmask_d1   ;
        logic                                                   port_wen_d1     ;
        logic           [BNK_AW-1:0]                            port_waddr_d1   ;
        logic           [BNK_DW-1:0]                            port_bmask_th_d1;

        always_ff@(posedge clk or negedge rst_n)begin
            if(!rst_n)
                port_wen_d1       <= 'd0;
            else 
                port_wen_d1       <= port_wen[bk];
        end

        always_ff@(posedge clk or negedge rst_n)begin
            if(!rst_n)begin
                port_waddr_d1     <= 'd0 ;
            end
            else if(port_wen[bk])begin
                port_waddr_d1     <= port_waddr[bk]      ;
            end
        end

        always_ff@(posedge clk or negedge rst_n)begin
            if(!rst_n)begin
                port_bmask_th_d1 <= 'd0 ; 
            end
            else if(port_wen[bk])begin
                port_bmask_th_d1  <= port_bmask_th[bk]   ;
            end
            else begin
                port_bmask_th_d1  <= 'b0                ;
            end
        end

        assign bank_wen   = port_wen_d1  ;
        assign bank_wdata = port_wdata_d1[bk] ; 
        assign bank_waddr = port_waddr_d1;

        assign bank_addr = bank_wen ? bank_waddr : bank_raddr[bk];
        //TODO: add bank rw conflict assertion
        //TODO: add bitmask port for sram
        rhc_spram_phy#(
        .DATA_W (BNK_DW  ),
        .DEPTH  (BNK_DPTH),
        .WREN_W (128       ),
        .MODE   (0       ),
        .MEMC_W (1       )             
        )u_bank(
        .clk        (clk            ),
        .mem_ctrl   (1'b0           ),
        .addr       (bank_addr      ),
        .wr_en      (port_bmask_th_d1       ),
        .wr_data    (bank_wdata     ),
        .rd_en      (bank_ren[bk]   ),
        .rd_data    (bank_rdata_pre )
        );

        //`ifdef RHC_ASSERT_ON 
            `RHC_ASSERT_DYNAMIC(clk, rst_n, bank_wen |-> not $isunknown(bank_wdata),
                                $sformatf ("Error in TrfBgrpBank: write data is X!."))
        //`endif

        //`ifdef RHC_ASSERT_ON 
            `RHC_ASSERT_DYNAMIC(clk, rst_n, bank_ren |=> not $isunknown(bank_rdata_pre),
                                $sformatf ("Error in TrfBgrpBank: read data is X!."))
        //`endif

        //read data reg
        always_ff@(posedge clk or negedge rst_n)begin
            if(!rst_n)
                bank_rmask_d1     <=  'b0             ;
            else if(bank_ren[bk])
                bank_rmask_d1     <=  bank_rmask[bk]     ;
        end

        for(genvar th=0; th<THDB_N; th++) begin: BANK_TH
            always_ff@(posedge clk or negedge rst_n)begin
                if(!rst_n)
                    bank_rdata[bk][th*THD_DW +: THD_DW]  <=  'b0             ;
                else if(bank_rmask_d1[th])
                    bank_rdata[bk][th*THD_DW +: THD_DW]  <=  bank_rdata_pre[th*THD_DW +: THD_DW]  ;
            end
        end
    end
endgenerate


endmodule

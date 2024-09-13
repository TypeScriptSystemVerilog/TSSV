// =========================================================================
// Module      : TPartCommon
// File        : TPartCommon.sv
// -------------------------------------------------------------------------
// Description : TPart common struct
// -------------------------------------------------------------------------
// Revisions   :
//  Date           Version     Author        Company   Description
//  02-07-2024     v0.1        meng.yao        HX        initial 
// =========================================================================

package TPartCommon;

localparam PU_N      = 5 ; //IALU FALU SFU ST TsCore

localparam WARP_N    = 16; //warp num in one subcore
localparam THD_N     = 32; //total thd in one subcore
localparam THDG_N    = 4 ; //32 thd divide to 4 THDGroup
localparam THDSUBG_N = 2 ; //1 THDG has H4THD and L4THD 
localparam BGRP_N    = 2 ; //2 bank group per thd
localparam THD_INGRP = THD_N / THDG_N; // 8 in one THDGroup

localparam BANK_N   = 4 ;
localparam THDB_N   = 4 ; //4 THD combine to one bank
localparam THD_DW   = 32; //1 THD 32bit width 
localparam BNK_DW   = THD_DW*THDB_N; //1 bank 4*32bit width
localparam BNK_DPTH = 136; //bank depth
localparam BNK_AW   = $clog2(BNK_DPTH) ;

localparam HIST_N   = 4 ; // HISTORY entry num
localparam WRPU_N   = 7 ; // FAlu IALU ST SFU TsCore
localparam STRB_W   = 4 ; // write byte strobe for 32bit data

localparam RDPU_N   = 4 ; // FALU IALU LD SFU 
localparam PORT_N   = 3 ; // Reg Port num

localparam LDST_THD        = 16;
localparam LDST_GRP_THD    = LDST_THD / THDG_N;   //4



typedef struct packed
{
    logic [ 3:0]        warpid  ;
    logic [ 5:0]        opcode  ;
    logic [26:0]        op_ctrl ;//isa: {114~88}
    logic [ 3:0]        pudly   ;
    logic [ 7:0]        tmask   ;

    logic [ 2:0][ 3:0]  tp_inf  ; //{pu,pg*2}, bit[3]==!p, bit[2:0]==pred id

    logic [ 2:0]        src_imm ;
    logic [ 2:0][31:0]  src_val ;

    logic               dst_ena ;
    logic [ 8:0]        dst_addr;
}InsThdGrp_t;


typedef struct packed {
logic  [3:0]                  tmask         ;
logic  [26:0]                 op_ctrl       ;
logic  [5:0]                  opcode        ;
logic  [2:0]                  src_imm       ;
logic  [2:0][31:0]            src_val       ;
} AluInsThdGrp_t; 


//write trf use inside trf
typedef struct packed {
    logic [3:0]           tmask        ;  //THDB_N*1
    logic [31:0]          bmask        ;  //THDB_N*32
    logic [10:0]          waddr        ;  //BNK_AW + $log2(BANK_N)
    logic                 bgrpid       ;
    logic [3:0][31:0]     wdata        ;  //THDB_N*32
} WrTRFThd4Wr_t;

//read trf use inside trf
typedef struct packed {
    logic [3:0]    tmask    ;
    logic [2:0]    regid    ;
    logic [9:0]    raddr    ;
    logic [2:0]    hisid    ;
} RdTRFThd4Rd_t;

typedef struct packed {
    logic [7:0]           tmask        ;  //THDB_N*1
    logic [31:0]          bmask        ;  //32
    logic [9:0]           waddr        ;  //BNK_AW + $log2(BANK_N)
    logic                 bgrpid       ;
} PUWrTRF_t;

typedef struct packed {
    logic           tmask           ; 
    logic [26:0]    op_ctrl         ;
    logic [5:0]     opcode          ; 
} Sfu_ins_t;

typedef struct packed {
    logic           tmask           ; 
    logic [26:0]    op_ctrl         ;
    logic [5:0]     opcode          ; 
    logic [3:0]     dst_oft         ;
    logic [3:0]     src_oft         ;
} Cvt_ins_t;

endpackage

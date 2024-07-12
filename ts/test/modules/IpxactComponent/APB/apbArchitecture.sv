`timescale 1ps/1ps
module Specification_Architecture_Structure (
    Init0_P_Addr
,   Init0_P_Selx
,   Init0_P_Enable
,   Init0_P_Write
,   Init0_P_RData
,   Init0_P_WData
,   Init0_P_Ready
,   Init0_P_SlvErr
,   Init1_P_Addr
,   Init1_P_Selx
,   Init1_P_Enable
,   Init1_P_Write
,   Init1_P_RData
,   Init1_P_WData
,   Init1_P_Ready
,   Init1_P_SlvErr
,   Targ0_P_Addr
,   Targ0_P_Selx
,   Targ0_P_Enable
,   Targ0_P_Write
,   Targ0_P_RData
,   Targ0_P_WData
,   Targ0_P_Ready
,   Targ0_P_SlvErr
,   Targ1_P_Addr
,   Targ1_P_Selx
,   Targ1_P_Enable
,   Targ1_P_Write
,   Targ1_P_RData
,   Targ1_P_WData
,   Targ1_P_Ready
,   Targ1_P_SlvErr
);
    input  [52:0]   Init0_Ar_Addr   ;
    input           Init0_P_Selx    ;
    input           Init0_P_Enable  ;
    input           Init0_P_Write   ;
    output [1023:0] Init0_P_RData   ;
    input  [1023:0] Init0_P_WData   ;
    output          Init0_P_Ready   ;
    output          Init0_P_SlvErr  ;
    input  [52:0]   Init1_Ar_Addr   ;
    input           Init1_P_Selx    ;
    input           Init1_P_Enable  ;
    input           Init1_P_Write   ;
    output [1023:0] Init1_P_RData   ;
    input  [1023:0] Init1_P_WData   ;
    output          Init1_P_Ready   ;
    output          Init1_P_SlvErr  ;
    output [52:0]   Targ0_Ar_Addr   ;
    output          Targ0_P_Selx    ;
    output          Targ0_P_Enable  ;
    output          Targ0_P_Write   ;
    input  [1023:0] Targ0_P_RData   ;
    output [1023:0] Targ0_P_WData   ;
    input           Targ0_P_Ready   ;
    input           Targ0_P_SlvErr  ;
    output [52:0]   Targ1_Ar_Addr   ;
    output          Targ1_P_Selx    ;
    output          Targ1_P_Enable  ;
    output          Targ1_P_Write   ;
    input  [1023:0] Targ1_P_RData   ;
    output [1023:0] Targ1_P_WData   ;
    input           Targ1_P_Ready   ;
    input           Targ1_P_SlvErr  ;
    input           noc_prstn       ;
	input           node0_pclk      ;
	input           node1_pclk      ;
	input           tm              ;
endmodule
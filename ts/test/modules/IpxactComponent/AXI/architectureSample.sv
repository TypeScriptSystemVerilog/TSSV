`timescale 1ps/1ps
module Specification_Architecture_Structure (
	Init0_Ar_Addr
,	Init0_Ar_Burst
,	Init0_Ar_Cache
,	Init0_Ar_Id
,	Init0_Ar_Len
,	Init0_Ar_Lock
,	Init0_Ar_Prot
,	Init0_Ar_Qos
,	Init0_Ar_Ready
,	Init0_Ar_Size
,	Init0_Ar_User
,	Init0_Ar_Valid
,	Init0_Aw_Addr
,	Init0_Aw_Burst
,	Init0_Aw_Cache
,	Init0_Aw_Id
,	Init0_Aw_Len
,	Init0_Aw_Lock
,	Init0_Aw_Prot
,	Init0_Aw_Qos
,	Init0_Aw_Ready
,	Init0_Aw_Size
,	Init0_Aw_User
,	Init0_Aw_Valid
,	Init0_B_Id
,	Init0_B_Ready
,	Init0_B_Resp
,	Init0_B_User
,	Init0_B_Valid
,	Init0_R_Data
,	Init0_R_Id
,	Init0_R_Last
,	Init0_R_Ready
,	Init0_R_Resp
,	Init0_R_User
,	Init0_R_Valid
,	Init0_W_Data
,	Init0_W_Id
,	Init0_W_Last
,	Init0_W_Ready
,	Init0_W_Strb
,	Init0_W_Valid
,	Init1_Ar_Addr
,	Init1_Ar_Burst
,	Init1_Ar_Cache
,	Init1_Ar_Id
,	Init1_Ar_Len
,	Init1_Ar_Lock
,	Init1_Ar_Prot
,	Init1_Ar_Qos
,	Init1_Ar_Ready
,	Init1_Ar_Size
,	Init1_Ar_User
,	Init1_Ar_Valid
,	Init1_Aw_Addr
,	Init1_Aw_Burst
,	Init1_Aw_Cache
,	Init1_Aw_Id
,	Init1_Aw_Len
,	Init1_Aw_Lock
,	Init1_Aw_Prot
,	Init1_Aw_Qos
,	Init1_Aw_Ready
,	Init1_Aw_Size
,	Init1_Aw_User
,	Init1_Aw_Valid
,	Init1_B_Id
,	Init1_B_Ready
,	Init1_B_Resp
,	Init1_B_User
,	Init1_B_Valid
,	Init1_R_Data
,	Init1_R_Id
,	Init1_R_Last
,	Init1_R_Ready
,	Init1_R_Resp
,	Init1_R_User
,	Init1_R_Valid
,	Init1_W_Data
,	Init1_W_Id
,	Init1_W_Last
,	Init1_W_Ready
,	Init1_W_Strb
,	Init1_W_Valid
,	Targ0_Ar_Addr
,	Targ0_Ar_Burst
,	Targ0_Ar_Cache
,	Targ0_Ar_Id
,	Targ0_Ar_Len
,	Targ0_Ar_Lock
,	Targ0_Ar_Prot
,	Targ0_Ar_Qos
,	Targ0_Ar_Ready
,	Targ0_Ar_Size
,	Targ0_Ar_User
,	Targ0_Ar_Valid
,	Targ0_Aw_Addr
,	Targ0_Aw_Burst
,	Targ0_Aw_Cache
,	Targ0_Aw_Id
,	Targ0_Aw_Len
,	Targ0_Aw_Lock
,	Targ0_Aw_Prot
,	Targ0_Aw_Qos
,	Targ0_Aw_Ready
,	Targ0_Aw_Size
,	Targ0_Aw_User
,	Targ0_Aw_Valid
,	Targ0_B_Id
,	Targ0_B_Ready
,	Targ0_B_Resp
,	Targ0_B_User
,	Targ0_B_Valid
,	Targ0_R_Data
,	Targ0_R_Id
,	Targ0_R_Last
,	Targ0_R_Ready
,	Targ0_R_Resp
,	Targ0_R_User
,	Targ0_R_Valid
,	Targ0_W_Data
,	Targ0_W_Id
,	Targ0_W_Last
,	Targ0_W_Ready
,	Targ0_W_Strb
,	Targ0_W_Valid
,	Targ1_Ar_Addr
,	Targ1_Ar_Burst
,	Targ1_Ar_Cache
,	Targ1_Ar_Id
,	Targ1_Ar_Len
,	Targ1_Ar_Lock
,	Targ1_Ar_Prot
,	Targ1_Ar_Qos
,	Targ1_Ar_Ready
,	Targ1_Ar_Size
,	Targ1_Ar_User
,	Targ1_Ar_Valid
,	Targ1_Aw_Addr
,	Targ1_Aw_Burst
,	Targ1_Aw_Cache
,	Targ1_Aw_Id
,	Targ1_Aw_Len
,	Targ1_Aw_Lock
,	Targ1_Aw_Prot
,	Targ1_Aw_Qos
,	Targ1_Aw_Ready
,	Targ1_Aw_Size
,	Targ1_Aw_User
,	Targ1_Aw_Valid
,	Targ1_B_Id
,	Targ1_B_Ready
,	Targ1_B_Resp
,	Targ1_B_User
,	Targ1_B_Valid
,	Targ1_R_Data
,	Targ1_R_Id
,	Targ1_R_Last
,	Targ1_R_Ready
,	Targ1_R_Resp
,	Targ1_R_User
,	Targ1_R_Valid
,	Targ1_W_Data
,	Targ1_W_Id
,	Targ1_W_Last
,	Targ1_W_Ready
,	Targ1_W_Strb
,	Targ1_W_Valid
);
	input  [52:0]   Init0_Ar_Addr   ;
	input  [1:0]    Init0_Ar_Burst  ;
	input  [3:0]    Init0_Ar_Cache  ;
	input  [7:0]    Init0_Ar_Id     ;
	input  [7:0]    Init0_Ar_Len    ;
	input  [1:0]    Init0_Ar_Lock   ;
	input  [2:0]    Init0_Ar_Prot   ;
	input  [3:0]    Init0_Ar_Qos    ;
	output          Init0_Ar_Ready  ;
	input  [2:0]    Init0_Ar_Size   ;
	input  [7:0]    Init0_Ar_User   ;
	input           Init0_Ar_Valid  ;
	input  [52:0]   Init0_Aw_Addr   ;
	input  [1:0]    Init0_Aw_Burst  ;
	input  [3:0]    Init0_Aw_Cache  ;
	input  [7:0]    Init0_Aw_Id     ;
	input  [7:0]    Init0_Aw_Len    ;
	input  [1:0]    Init0_Aw_Lock   ;
	input  [2:0]    Init0_Aw_Prot   ;
	input  [3:0]    Init0_Aw_Qos    ;
	output          Init0_Aw_Ready  ;
	input  [2:0]    Init0_Aw_Size   ;
	input  [7:0]    Init0_Aw_User   ;
	input           Init0_Aw_Valid  ;
	output [7:0]    Init0_B_Id      ;
	input           Init0_B_Ready   ;
	output [1:0]    Init0_B_Resp    ;
	output [7:0]    Init0_B_User    ;
	output          Init0_B_Valid   ;
	output [1023:0] Init0_R_Data    ;
	output [7:0]    Init0_R_Id      ;
	output          Init0_R_Last    ;
	input           Init0_R_Ready   ;
	output [1:0]    Init0_R_Resp    ;
	output [7:0]    Init0_R_User    ;
	output          Init0_R_Valid   ;
	input  [1023:0] Init0_W_Data    ;
	input  [7:0]    Init0_W_Id      ;
	input           Init0_W_Last    ;
	output          Init0_W_Ready   ;
	input  [127:0]  Init0_W_Strb    ;
	input           Init0_W_Valid   ;
	input  [52:0]   Init1_Ar_Addr   ;
	input  [1:0]    Init1_Ar_Burst  ;
	input  [3:0]    Init1_Ar_Cache  ;
	input  [7:0]    Init1_Ar_Id     ;
	input  [7:0]    Init1_Ar_Len    ;
	input  [1:0]    Init1_Ar_Lock   ;
	input  [2:0]    Init1_Ar_Prot   ;
	input  [3:0]    Init1_Ar_Qos    ;
	output          Init1_Ar_Ready  ;
	input  [2:0]    Init1_Ar_Size   ;
	input  [7:0]    Init1_Ar_User   ;
	input           Init1_Ar_Valid  ;
	input  [52:0]   Init1_Aw_Addr   ;
	input  [1:0]    Init1_Aw_Burst  ;
	input  [3:0]    Init1_Aw_Cache  ;
	input  [7:0]    Init1_Aw_Id     ;
	input  [7:0]    Init1_Aw_Len    ;
	input  [1:0]    Init1_Aw_Lock   ;
	input  [2:0]    Init1_Aw_Prot   ;
	input  [3:0]    Init1_Aw_Qos    ;
	output          Init1_Aw_Ready  ;
	input  [2:0]    Init1_Aw_Size   ;
	input  [7:0]    Init1_Aw_User   ;
	input           Init1_Aw_Valid  ;
	output [7:0]    Init1_B_Id      ;
	input           Init1_B_Ready   ;
	output [1:0]    Init1_B_Resp    ;
	output [7:0]    Init1_B_User    ;
	output          Init1_B_Valid   ;
	output [1023:0] Init1_R_Data    ;
	output [7:0]    Init1_R_Id      ;
	output          Init1_R_Last    ;
	input           Init1_R_Ready   ;
	output [1:0]    Init1_R_Resp    ;
	output [7:0]    Init1_R_User    ;
	output          Init1_R_Valid   ;
	input  [1023:0] Init1_W_Data    ;
	input  [7:0]    Init1_W_Id      ;
	input           Init1_W_Last    ;
	output          Init1_W_Ready   ;
	input  [127:0]  Init1_W_Strb    ;
	input           Init1_W_Valid   ;
	output [52:0]   Targ0_Ar_Addr   ;
	output [1:0]    Targ0_Ar_Burst  ;
	output [3:0]    Targ0_Ar_Cache  ;
	output [7:0]    Targ0_Ar_Id     ;
	output [7:0]    Targ0_Ar_Len    ;
	output [1:0]    Targ0_Ar_Lock   ;
	output [2:0]    Targ0_Ar_Prot   ;
	output [3:0]    Targ0_Ar_Qos    ;
	input           Targ0_Ar_Ready  ;
	output [2:0]    Targ0_Ar_Size   ;
	output [7:0]    Targ0_Ar_User   ;
	output          Targ0_Ar_Valid  ;
	output [52:0]   Targ0_Aw_Addr   ;
	output [1:0]    Targ0_Aw_Burst  ;
	output [3:0]    Targ0_Aw_Cache  ;
	output [7:0]    Targ0_Aw_Id     ;
	output [7:0]    Targ0_Aw_Len    ;
	output [1:0]    Targ0_Aw_Lock   ;
	output [2:0]    Targ0_Aw_Prot   ;
	output [3:0]    Targ0_Aw_Qos    ;
	input           Targ0_Aw_Ready  ;
	output [2:0]    Targ0_Aw_Size   ;
	output [7:0]    Targ0_Aw_User   ;
	output          Targ0_Aw_Valid  ;
	input  [7:0]    Targ0_B_Id      ;
	output          Targ0_B_Ready   ;
	input  [1:0]    Targ0_B_Resp    ;
	input  [7:0]    Targ0_B_User    ;
	input           Targ0_B_Valid   ;
	input  [1023:0] Targ0_R_Data    ;
	input  [7:0]    Targ0_R_Id      ;
	input           Targ0_R_Last    ;
	output          Targ0_R_Ready   ;
	input  [1:0]    Targ0_R_Resp    ;
	input  [7:0]    Targ0_R_User    ;
	input           Targ0_R_Valid   ;
	output [1023:0] Targ0_W_Data    ;
	output [7:0]    Targ0_W_Id      ;
	output          Targ0_W_Last    ;
	input           Targ0_W_Ready   ;
	output [127:0]  Targ0_W_Strb    ;
	output          Targ0_W_Valid   ;
	output [52:0]   Targ1_Ar_Addr   ;
	output [1:0]    Targ1_Ar_Burst  ;
	output [3:0]    Targ1_Ar_Cache  ;
	output [7:0]    Targ1_Ar_Id     ;
	output [7:0]    Targ1_Ar_Len    ;
	output [1:0]    Targ1_Ar_Lock   ;
	output [2:0]    Targ1_Ar_Prot   ;
	output [3:0]    Targ1_Ar_Qos    ;
	input           Targ1_Ar_Ready  ;
	output [2:0]    Targ1_Ar_Size   ;
	output [7:0]    Targ1_Ar_User   ;
	output          Targ1_Ar_Valid  ;
	output [52:0]   Targ1_Aw_Addr   ;
	output [1:0]    Targ1_Aw_Burst  ;
	output [3:0]    Targ1_Aw_Cache  ;
	output [7:0]    Targ1_Aw_Id     ;
	output [7:0]    Targ1_Aw_Len    ;
	output [1:0]    Targ1_Aw_Lock   ;
	output [2:0]    Targ1_Aw_Prot   ;
	output [3:0]    Targ1_Aw_Qos    ;
	input           Targ1_Aw_Ready  ;
	output [2:0]    Targ1_Aw_Size   ;
	output [7:0]    Targ1_Aw_User   ;
	output          Targ1_Aw_Valid  ;
	input  [7:0]    Targ1_B_Id      ;
	output          Targ1_B_Ready   ;
	input  [1:0]    Targ1_B_Resp    ;
	input  [7:0]    Targ1_B_User    ;
	input           Targ1_B_Valid   ;
	input  [1023:0] Targ1_R_Data    ;
	input  [7:0]    Targ1_R_Id      ;
	input           Targ1_R_Last    ;
	output          Targ1_R_Ready   ;
	input  [1:0]    Targ1_R_Resp    ;
	input  [7:0]    Targ1_R_User    ;
	input           Targ1_R_Valid   ;
	output [1023:0] Targ1_W_Data    ;
	output [7:0]    Targ1_W_Id      ;
	output          Targ1_W_Last    ;
	input           Targ1_W_Ready   ;
	output [127:0]  Targ1_W_Strb    ;
	output          Targ1_W_Valid   ;
    input           noc_arstn       ;
	input           node0_aclk      ;
	input           node1_aclk      ;
	input           tm              ;
endmodule
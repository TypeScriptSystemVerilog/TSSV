
    // verilator lint_off DECLFILENAME
    // verilator lint_off UNUSED
    

interface AXI_4_53_1024_8_withQOS_noREGION;

   logic  ACLK;
   logic  ACLKEN;
   logic  ARESETn;
   logic [7:0] AWID;
   logic [52:0] AWADDR;
   logic [3:0] AWLEN;
   logic [2:0] AWSIZE;
   logic [1:0] AWBURST;
   logic [1:0] AWLOCK;
   logic [3:0] AWCACHE;
   logic [2:0] AWPROT;
   logic  AWVALID;
   logic  AWREADY;
   logic [7:0] WID;
   logic [1023:0] WDATA;
   logic [127:0] WSTRB;
   logic  WLAST;
   logic  WVALID;
   logic  WREADY;
   logic [7:0] BID;
   logic [1:0] BRESP;
   logic  BVALID;
   logic  BREADY;
   logic [7:0] ARID;
   logic [52:0] ARADDR;
   logic [3:0] ARLEN;
   logic [2:0] ARSIZE;
   logic [1:0] ARBURST;
   logic [1:0] ARLOCK;
   logic [3:0] ARCACHE;
   logic [2:0] ARPROT;
   logic  ARVALID;
   logic  ARREADY;
   logic [7:0] RID;
   logic [1023:0] RDATA;
   logic [1:0] RRESP;
   logic  RLAST;
   logic  RVALID;
   logic  RREADY;
   logic [7:0] AWUSER;
   logic [7:0] WUSER;
   logic [7:0] BUSER;
   logic [7:0] ARUSER;
   logic [7:0] RUSER;
   logic [3:0] ARQOS;
   logic [3:0] AWQOS;


    modport outward (
      input ACLK,
      input ACLKEN,
      input ARESETn,
      output AWID,
      output AWADDR,
      output AWLEN,
      output AWSIZE,
      output AWBURST,
      output AWLOCK,
      output AWCACHE,
      output AWPROT,
      output AWVALID,
      input AWREADY,
      output WID,
      output WDATA,
      output WSTRB,
      output WLAST,
      output WVALID,
      input WREADY,
      input BID,
      input BRESP,
      input BVALID,
      output BREADY,
      output ARID,
      output ARADDR,
      output ARLEN,
      output ARSIZE,
      output ARBURST,
      output ARLOCK,
      output ARCACHE,
      output ARPROT,
      output ARVALID,
      input ARREADY,
      input RID,
      input RDATA,
      input RRESP,
      input RLAST,
      input RVALID,
      output RREADY,
      output AWUSER,
      output WUSER,
      input BUSER,
      output ARUSER,
      input RUSER,
      output ARQOS,
      output AWQOS
    );           

    modport inward (
      output ACLK,
      output ACLKEN,
      output ARESETn,
      input AWID,
      input AWADDR,
      input AWLEN,
      input AWSIZE,
      input AWBURST,
      input AWLOCK,
      input AWCACHE,
      input AWPROT,
      input AWVALID,
      output AWREADY,
      input WID,
      input WDATA,
      input WSTRB,
      input WLAST,
      input WVALID,
      output WREADY,
      output BID,
      output BRESP,
      output BVALID,
      input BREADY,
      input ARID,
      input ARADDR,
      input ARLEN,
      input ARSIZE,
      input ARBURST,
      input ARLOCK,
      input ARCACHE,
      input ARPROT,
      input ARVALID,
      output ARREADY,
      output RID,
      output RDATA,
      output RRESP,
      output RLAST,
      output RVALID,
      input RREADY,
      input AWUSER,
      input WUSER,
      output BUSER,
      input ARUSER,
      output RUSER,
      input ARQOS,
      input AWQOS
    );           


endinterface
        
        
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
        
/* verilator lint_off WIDTH */        
module newComponent 
   (
   AXI_4_53_1024_8_withQOS_noREGION.inward Init1,
   AXI_4_53_1024_8_withQOS_noREGION.inward Init0,
   AXI_4_53_1024_8_withQOS_noREGION.outward Targ1,
   AXI_4_53_1024_8_withQOS_noREGION.outward Targ0
   );

   logic  unbound;


    Specification_Architecture_Structure verilognewComponent
      (
        .Init1_Ar_Addr(Init1.ARADDR),
        .Init1_W_Ready(Init1.WREADY),
        .Init1_Aw_Valid(Init1.AWVALID),
        .Init1_Ar_Qos(Init1.ARQOS),
        .Init1_Ar_Id(Init1.ARID),
        .Init1_R_User(Init1.RUSER),
        .Init1_Aw_Lock(Init1.AWLOCK),
        .Init1_Ar_Lock(Init1.ARLOCK),
        .Init1_Aw_Id(Init1.AWID),
        .Init1_Ar_Len(Init1.ARLEN),
        .Init1_Ar_User(Init1.ARUSER),
        .Init1_B_Id(Init1.BID),
        .Init1_W_Valid(Init1.WVALID),
        .Init1_B_Ready(Init1.BREADY),
        .Init1_W_Data(Init1.WDATA),
        .Init1_R_Valid(Init1.RVALID),
        .Init1_R_Data(Init1.RDATA),
        .Init1_R_Id(Init1.RID),
        .Init1_B_Resp(Init1.BRESP),
        .Init1_Aw_Size(Init1.AWSIZE),
        .Init1_Aw_Addr(Init1.AWADDR),
        .Init1_Aw_Cache(Init1.AWCACHE),
        .Init1_W_Last(Init1.WLAST),
        .Init1_R_Ready(Init1.RREADY),
        .Init1_Ar_Ready(Init1.ARREADY),
        .Init1_Ar_Cache(Init1.ARCACHE),
        .Init1_R_Last(Init1.RLAST),
        .Init1_Aw_Qos(Init1.AWQOS),
        .Init1_Ar_Valid(Init1.ARVALID),
        .Init1_Aw_User(Init1.AWUSER),
        .Init1_Ar_Size(Init1.ARSIZE),
        .Init1_Aw_Ready(Init1.AWREADY),
        .Init1_W_Id(Init1.WID),
        .Init1_B_User(Init1.BUSER),
        .Init1_Ar_Prot(Init1.ARPROT),
        .Init1_Ar_Burst(Init1.ARBURST),
        .Init1_R_Resp(Init1.RRESP),
        .Init1_Aw_Len(Init1.AWLEN),
        .Init1_Aw_Prot(Init1.AWPROT),
        .Init1_W_Strb(Init1.WSTRB),
        .Init1_Aw_Burst(Init1.AWBURST),
        .Init1_B_Valid(Init1.BVALID),
        .node1_aclk(Targ1.ACLK),
        .noc_arstn(Targ0.ARESETn),
        .Init0_Ar_Addr(Init0.ARADDR),
        .Init0_W_Ready(Init0.WREADY),
        .Init0_Aw_Valid(Init0.AWVALID),
        .Init0_Ar_Qos(Init0.ARQOS),
        .Init0_Ar_Id(Init0.ARID),
        .Init0_R_User(Init0.RUSER),
        .Init0_Aw_Lock(Init0.AWLOCK),
        .Init0_Ar_Lock(Init0.ARLOCK),
        .Init0_Aw_Id(Init0.AWID),
        .Init0_Ar_Len(Init0.ARLEN),
        .Init0_Ar_User(Init0.ARUSER),
        .Init0_B_Id(Init0.BID),
        .Init0_W_Valid(Init0.WVALID),
        .Init0_B_Ready(Init0.BREADY),
        .Init0_W_Data(Init0.WDATA),
        .Init0_R_Valid(Init0.RVALID),
        .Init0_R_Data(Init0.RDATA),
        .Init0_R_Id(Init0.RID),
        .Init0_B_Resp(Init0.BRESP),
        .Init0_Aw_Size(Init0.AWSIZE),
        .Init0_Aw_Addr(Init0.AWADDR),
        .Init0_Aw_Cache(Init0.AWCACHE),
        .Init0_W_Last(Init0.WLAST),
        .Init0_R_Ready(Init0.RREADY),
        .Init0_Ar_Ready(Init0.ARREADY),
        .Init0_Ar_Cache(Init0.ARCACHE),
        .Init0_R_Last(Init0.RLAST),
        .Init0_Aw_Qos(Init0.AWQOS),
        .Init0_Ar_Valid(Init0.ARVALID),
        .Init0_Aw_User(Init0.AWUSER),
        .Init0_Ar_Size(Init0.ARSIZE),
        .Init0_Aw_Ready(Init0.AWREADY),
        .Init0_W_Id(Init0.WID),
        .Init0_B_User(Init0.BUSER),
        .Init0_Ar_Prot(Init0.ARPROT),
        .Init0_Ar_Burst(Init0.ARBURST),
        .Init0_R_Resp(Init0.RRESP),
        .Init0_Aw_Len(Init0.AWLEN),
        .Init0_Aw_Prot(Init0.AWPROT),
        .Init0_W_Strb(Init0.WSTRB),
        .Init0_Aw_Burst(Init0.AWBURST),
        .Init0_B_Valid(Init0.BVALID),
        .node0_aclk(Targ0.ACLK),
        .Targ1_Ar_Addr(Targ1.ARADDR),
        .Targ1_W_Ready(Targ1.WREADY),
        .Targ1_Aw_Valid(Targ1.AWVALID),
        .Targ1_Ar_Qos(Targ1.ARQOS),
        .Targ1_Ar_Id(Targ1.ARID),
        .Targ1_R_User(Targ1.RUSER),
        .Targ1_Aw_Lock(Targ1.AWLOCK),
        .Targ1_Ar_Lock(Targ1.ARLOCK),
        .Targ1_Aw_Id(Targ1.AWID),
        .Targ1_Ar_Len(Targ1.ARLEN),
        .Targ1_Ar_User(Targ1.ARUSER),
        .Targ1_B_Id(Targ1.BID),
        .Targ1_W_Valid(Targ1.WVALID),
        .Targ1_B_Ready(Targ1.BREADY),
        .Targ1_W_Data(Targ1.WDATA),
        .Targ1_R_Valid(Targ1.RVALID),
        .Targ1_R_Data(Targ1.RDATA),
        .Targ1_R_Id(Targ1.RID),
        .Targ1_B_Resp(Targ1.BRESP),
        .Targ1_Aw_Size(Targ1.AWSIZE),
        .Targ1_Aw_Addr(Targ1.AWADDR),
        .Targ1_Aw_Cache(Targ1.AWCACHE),
        .Targ1_W_Last(Targ1.WLAST),
        .Targ1_R_Ready(Targ1.RREADY),
        .Targ1_Ar_Ready(Targ1.ARREADY),
        .Targ1_Ar_Cache(Targ1.ARCACHE),
        .Targ1_R_Last(Targ1.RLAST),
        .Targ1_Aw_Qos(Targ1.AWQOS),
        .Targ1_Ar_Valid(Targ1.ARVALID),
        .Targ1_Aw_User(Targ1.AWUSER),
        .Targ1_Ar_Size(Targ1.ARSIZE),
        .Targ1_Aw_Ready(Targ1.AWREADY),
        .Targ1_W_Id(Targ1.WID),
        .Targ1_B_User(Targ1.BUSER),
        .Targ1_Ar_Prot(Targ1.ARPROT),
        .Targ1_Ar_Burst(Targ1.ARBURST),
        .Targ1_R_Resp(Targ1.RRESP),
        .Targ1_Aw_Len(Targ1.AWLEN),
        .Targ1_Aw_Prot(Targ1.AWPROT),
        .Targ1_W_Strb(Targ1.WSTRB),
        .Targ1_Aw_Burst(Targ1.AWBURST),
        .Targ1_B_Valid(Targ1.BVALID),
        .Targ0_Ar_Addr(Targ0.ARADDR),
        .Targ0_W_Ready(Targ0.WREADY),
        .Targ0_Aw_Valid(Targ0.AWVALID),
        .Targ0_Ar_Qos(Targ0.ARQOS),
        .Targ0_Ar_Id(Targ0.ARID),
        .Targ0_R_User(Targ0.RUSER),
        .Targ0_Aw_Lock(Targ0.AWLOCK),
        .Targ0_Ar_Lock(Targ0.ARLOCK),
        .Targ0_Aw_Id(Targ0.AWID),
        .Targ0_Ar_Len(Targ0.ARLEN),
        .Targ0_Ar_User(Targ0.ARUSER),
        .Targ0_B_Id(Targ0.BID),
        .Targ0_W_Valid(Targ0.WVALID),
        .Targ0_B_Ready(Targ0.BREADY),
        .Targ0_W_Data(Targ0.WDATA),
        .Targ0_R_Valid(Targ0.RVALID),
        .Targ0_R_Data(Targ0.RDATA),
        .Targ0_R_Id(Targ0.RID),
        .Targ0_B_Resp(Targ0.BRESP),
        .Targ0_Aw_Size(Targ0.AWSIZE),
        .Targ0_Aw_Addr(Targ0.AWADDR),
        .Targ0_Aw_Cache(Targ0.AWCACHE),
        .Targ0_W_Last(Targ0.WLAST),
        .Targ0_R_Ready(Targ0.RREADY),
        .Targ0_Ar_Ready(Targ0.ARREADY),
        .Targ0_Ar_Cache(Targ0.ARCACHE),
        .Targ0_R_Last(Targ0.RLAST),
        .Targ0_Aw_Qos(Targ0.AWQOS),
        .Targ0_Ar_Valid(Targ0.ARVALID),
        .Targ0_Aw_User(Targ0.AWUSER),
        .Targ0_Ar_Size(Targ0.ARSIZE),
        .Targ0_Aw_Ready(Targ0.AWREADY),
        .Targ0_W_Id(Targ0.WID),
        .Targ0_B_User(Targ0.BUSER),
        .Targ0_Ar_Prot(Targ0.ARPROT),
        .Targ0_Ar_Burst(Targ0.ARBURST),
        .Targ0_R_Resp(Targ0.RRESP),
        .Targ0_Aw_Len(Targ0.AWLEN),
        .Targ0_Aw_Prot(Targ0.AWPROT),
        .Targ0_W_Strb(Targ0.WSTRB),
        .Targ0_Aw_Burst(Targ0.AWBURST),
        .Targ0_B_Valid(Targ0.BVALID),
        .tm(unbound)        
      );


endmodule
/* verilator lint_on WIDTH */        


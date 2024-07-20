
      // verilator lint_off DECLFILENAME
      // verilator lint_off UNUSED
      

interface APB_53_1024;

   logic  PCLK;
   logic  PRESETn;
   logic [52:0] PADDR;
   logic  PSELx;
   logic  PENABLE;
   logic  PWRITE;
   logic [1023:0] PRDATA;
   logic [1023:0] PWDATA;
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
      output PREADY,
      output PSLVERR,
      input PCLKEN
    );           


endinterface
        
        
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
        
/* verilator lint_off WIDTH */        
module apbComponent 
   (
   APB_53_1024.inward Init1,
   APB_53_1024.inward Init0,
   APB_53_1024.outward Targ1,
   APB_53_1024.outward Targ0
   );

   logic  unbound;


    Specification_Architecture_Structure verilogapbComponent
      (
        .Init1_P_Addr(Init1.PADDR),
        .Init1_P_Selx(Init1.PSELx),
        .Init1_P_Enable(Init1.PENABLE),
        .Init1_P_Write(Init1.PWRITE),
        .Init1_P_RData(Init1.PRDATA),
        .Init1_P_WData(Init1.PWDATA),
        .Init1_P_Ready(Init1.PREADY),
        .Init1_P_SlvErr(Init1.PSLVERR),
        .node1_pclk(Targ1.PCLK),
        .noc_prstn(Targ0.PRESETn),
        .Init0_P_Addr(Init0.PADDR),
        .Init0_P_Selx(Init0.PSELx),
        .Init0_P_Enable(Init0.PENABLE),
        .Init0_P_Write(Init0.PWRITE),
        .Init0_P_RData(Init0.PRDATA),
        .Init0_P_WData(Init0.PWDATA),
        .Init0_P_Ready(Init0.PREADY),
        .Init0_P_SlvErr(Init0.PSLVERR),
        .node0_pclk(Targ0.PCLK),
        .Targ1_P_Addr(Targ1.PADDR),
        .Targ1_P_Selx(Targ1.PSELx),
        .Targ1_P_Enable(Targ1.PENABLE),
        .Targ1_P_Write(Targ1.PWRITE),
        .Targ1_P_RData(Targ1.PRDATA),
        .Targ1_P_WData(Targ1.PWDATA),
        .Targ1_P_Ready(Targ1.PREADY),
        .Targ1_P_SlvErr(Targ1.PSLVERR),
        .Targ0_P_Addr(Targ0.PADDR),
        .Targ0_P_Selx(Targ0.PSELx),
        .Targ0_P_Enable(Targ0.PENABLE),
        .Targ0_P_Write(Targ0.PWRITE),
        .Targ0_P_RData(Targ0.PRDATA),
        .Targ0_P_WData(Targ0.PWDATA),
        .Targ0_P_Ready(Targ0.PREADY),
        .Targ0_P_SlvErr(Targ0.PSLVERR),
        .Init0_Ar_Addr(unbound),
        .Init1_Ar_Addr(unbound),
        .tm(unbound)        
      );


endmodule
/* verilator lint_on WIDTH */        

  
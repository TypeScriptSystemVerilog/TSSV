
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    

interface AXI_rtl_8_32_8_32;

   logic  ACLK;
   logic  ACLKEN;
   logic  ARESETn;
   logic [7:0] AWID;
   logic [31:0] AWADDR;
   logic [3:0] AWLEN;
   logic [2:0] AWSIZE;
   logic [1:0] AWBURST;
   logic [1:0] AWLOCK;
   logic [3:0] AWCACHE;
   logic [2:0] AWPROT;
   logic  AWVALID;
   logic  AWREADY;
   logic [7:0] WID;
   logic [31:0] WDATA;
   logic [7:0] WSTRB;
   logic  WLAST;
   logic  WVALID;
   logic  WREADY;
   logic [7:0] BID;
   logic [1:0] BRESP;
   logic  BVALID;
   logic  BREADY;
   logic [7:0] ARID;
   logic [31:0] ARADDR;
   logic [3:0] ARLEN;
   logic [2:0] ARSIZE;
   logic [1:0] ARBURST;
   logic [1:0] ARLOCK;
   logic [3:0] ARCACHE;
   logic [2:0] ARPROT;
   logic  ARVALID;
   logic  ARREADY;
   logic [7:0] RID;
   logic [31:0] RDATA;
   logic [1:0] RRESP;
   logic  RLAST;
   logic  RVALID;
   logic  RREADY;
   logic [7:0] AWUSER;
   logic [7:0] WUSER;
   logic [7:0] BUSER;
   logic [7:0] ARUSER;
   logic [7:0] RUSER;
   logic  ACLKCHK;
   logic  ACLKENCHK;
   logic  ARESETnCHK;
   logic [7:0] AWIDCHK;
   logic [7:0] AWADDRCHK;
   logic [7:0] AWLENCHK;
   logic  AWVALIDCHK;
   logic  AWREADYCHK;
   logic [7:0] WIDCHK;
   logic [7:0] WDATACHK;
   logic [7:0] WSTRBCHK;
   logic  WLASTCHK;
   logic  WVALIDCHK;
   logic  WREADYCHK;
   logic [7:0] BIDCHK;
   logic [7:0] BRESPCHK;
   logic  BVALIDCHK;
   logic  BREADYCHK;
   logic [7:0] ARIDCHK;
   logic [7:0] ARADDRCHK;
   logic [7:0] ARLENCHK;
   logic  ARVALIDCHK;
   logic  ARREADYCHK;
   logic [7:0] RIDCHK;
   logic [7:0] RDATACHK;
   logic [7:0] RRESPCHK;
   logic  RLASTCHK;
   logic  RVALIDCHK;
   logic  RREADYCHK;
   logic [7:0] AWUSERCHK;
   logic [7:0] WUSERCHK;
   logic [7:0] BUSERCHK;
   logic [7:0] ARUSERCHK;
   logic [7:0] RUSERCHK;
   logic  AWCTLCHK0;
   logic  AWCTLCHK1;
   logic  ARCTLCHK0;
   logic  ARCTLCHK1;


    modport master (
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
      input ACLKCHK,
      input ACLKENCHK,
      input ARESETnCHK,
      output AWIDCHK,
      output AWADDRCHK,
      output AWLENCHK,
      output AWVALIDCHK,
      input AWREADYCHK,
      output WIDCHK,
      output WDATACHK,
      output WSTRBCHK,
      output WLASTCHK,
      output WVALIDCHK,
      input WREADYCHK,
      input BIDCHK,
      input BRESPCHK,
      input BVALIDCHK,
      output BREADYCHK,
      output ARIDCHK,
      output ARADDRCHK,
      output ARLENCHK,
      output ARVALIDCHK,
      input ARREADYCHK,
      input RIDCHK,
      input RDATACHK,
      input RRESPCHK,
      input RLASTCHK,
      input RVALIDCHK,
      output RREADYCHK,
      output AWUSERCHK,
      output WUSERCHK,
      input BUSERCHK,
      output ARUSERCHK,
      input RUSERCHK,
      output AWCTLCHK0,
      output AWCTLCHK1,
      output ARCTLCHK0,
      output ARCTLCHK1
    );           

    modport slave (
      input ACLK,
      input ACLKEN,
      input ARESETn,
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
      input ACLKCHK,
      input ACLKENCHK,
      input ARESETnCHK,
      input AWIDCHK,
      input AWADDRCHK,
      input AWLENCHK,
      input AWVALIDCHK,
      output AWREADYCHK,
      input WIDCHK,
      input WDATACHK,
      input WSTRBCHK,
      input WLASTCHK,
      input WVALIDCHK,
      output WREADYCHK,
      output BIDCHK,
      output BRESPCHK,
      output BVALIDCHK,
      input BREADYCHK,
      input ARIDCHK,
      input ARADDRCHK,
      input ARLENCHK,
      input ARVALIDCHK,
      output ARREADYCHK,
      output RIDCHK,
      output RDATACHK,
      output RRESPCHK,
      output RLASTCHK,
      output RVALIDCHK,
      input RREADYCHK,
      input AWUSERCHK,
      input WUSERCHK,
      output BUSERCHK,
      input ARUSERCHK,
      output RUSERCHK,
      input AWCTLCHK0,
      input AWCTLCHK1,
      input ARCTLCHK0,
      input ARCTLCHK1
    );           


endinterface
        
        

        
/* verilator lint_off WIDTH */        
module newComponent 
   (
   input logic  ACLK,
   input logic  ARESETn,
   input logic  port,
   AXI_rtl_8_32_8_32.master Init11,
   AXI_rtl_8_32_8_32.master Init7,
   AXI_rtl_8_32_8_32.master Init6,
   AXI_rtl_8_32_8_32.master Init5,
   AXI_rtl_8_32_8_32.master Init4,
   AXI_rtl_8_32_8_32.master Init3,
   AXI_rtl_8_32_8_32.master Init2,
   AXI_rtl_8_32_8_32.master Init1,
   AXI_rtl_8_32_8_32.master Init0,
   AXI_rtl_8_32_8_32.master Init9,
   AXI_rtl_8_32_8_32.master Init8,
   AXI_rtl_8_32_8_32.master Init10,
   AXI_rtl_8_32_8_32.slave Targ9,
   AXI_rtl_8_32_8_32.slave Targ8,
   AXI_rtl_8_32_8_32.slave Targ5,
   AXI_rtl_8_32_8_32.slave Targ4,
   AXI_rtl_8_32_8_32.slave Targ7,
   AXI_rtl_8_32_8_32.slave Targ6,
   AXI_rtl_8_32_8_32.slave Targ1,
   AXI_rtl_8_32_8_32.slave Targ0,
   AXI_rtl_8_32_8_32.slave Targ3,
   AXI_rtl_8_32_8_32.slave Targ2,
   AXI_rtl_8_32_8_32.slave Targ11,
   AXI_rtl_8_32_8_32.slave Targ10
   );

   



endmodule
/* verilator lint_on WIDTH */        


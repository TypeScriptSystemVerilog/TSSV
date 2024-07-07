

interface AXI4_rtl_8_32_8_32;

   logic  ACLK;
   logic  ACLKEN;
   logic  ARESETn;
   logic [7:0] AWID;
   logic [31:0] AWADDR;
   logic [7:0] AWLEN;
   logic [2:0] AWSIZE;
   logic [1:0] AWBURST;
   logic  AWLOCK;
   logic [3:0] AWCACHE;
   logic [2:0] AWPROT;
   logic [3:0] AWQOS;
   logic [3:0] AWREGION;
   logic  AWVALID;
   logic  AWREADY;
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
   logic [7:0] ARLEN;
   logic [2:0] ARSIZE;
   logic [1:0] ARBURST;
   logic  ARLOCK;
   logic [3:0] ARCACHE;
   logic [2:0] ARPROT;
   logic [3:0] ARQOS;
   logic [3:0] ARREGION;
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
      output AWQOS,
      output AWREGION,
      output AWVALID,
      input AWREADY,
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
      output ARQOS,
      output ARREGION,
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
      input RUSER
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
      input AWQOS,
      input AWREGION,
      input AWVALID,
      output AWREADY,
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
      input ARQOS,
      input ARREGION,
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
      output RUSER
    );           


endinterface
        
        

        
/* verilator lint_off WIDTH */        
module AXI4XBar2x4 
   (
   input logic  clk,
   AXI4_rtl_8_32_8_32.slave master1,
   AXI4_rtl_8_32_8_32.slave master2
   );

   



endmodule
/* verilator lint_on WIDTH */        

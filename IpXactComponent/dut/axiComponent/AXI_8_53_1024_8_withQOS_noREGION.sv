`ifndef DEF__AXI_8_53_1024_8_withQOS_noREGION__
`define DEF__AXI_8_53_1024_8_withQOS_noREGION__

interface AXI_8_53_1024_8_withQOS_noREGION;

  logic ACLK;
  logic ACLKEN;
  logic ARESETn;
  logic [7:0] AWID;
  logic [52:0] AWADDR;
  logic [3:0] AWLEN;
  logic [2:0] AWSIZE;
  logic [1:0] AWBURST;
  logic [1:0] AWLOCK;
  logic [3:0] AWCACHE;
  logic [2:0] AWPROT;
  logic AWVALID;
  logic AWREADY;
  logic [7:0] WID;
  logic [1023:0] WDATA;
  logic [127:0] WSTRB;
  logic WLAST;
  logic WVALID;
  logic WREADY;
  logic [7:0] BID;
  logic [1:0] BRESP;
  logic BVALID;
  logic BREADY;
  logic [7:0] ARID;
  logic [52:0] ARADDR;
  logic [3:0] ARLEN;
  logic [2:0] ARSIZE;
  logic [1:0] ARBURST;
  logic [1:0] ARLOCK;
  logic [3:0] ARCACHE;
  logic [2:0] ARPROT;
  logic ARVALID;
  logic ARREADY;
  logic [7:0] RID;
  logic [1023:0] RDATA;
  logic [1:0] RRESP;
  logic RLAST;
  logic RVALID;
  logic RREADY;
  logic [7:0] AWUSER;
  logic [7:0] WUSER;
  logic [7:0] BUSER;
  logic [7:0] ARUSER;
  logic [7:0] RUSER;
  logic [3:0] ARQOS;
  logic [3:0] AWQOS;


  modport outward(
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

  modport inward(
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

`endif //!DEF__AXI_8_53_1024_8_withQOS_noREGION__

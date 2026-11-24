`ifndef DEF__APB_16_32__
`define DEF__APB_16_32__

interface APB_16_32;

  logic PCLK;
  logic PRESETn;
  logic [15:0] PADDR;
  logic PSELx;
  logic PENABLE;
  logic PWRITE;
  logic [31:0] PRDATA;
  logic [31:0] PWDATA;
  logic PREADY;
  logic PSLVERR;
  logic PCLKEN;


  modport outward(
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

  modport inward(
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

`endif //!DEF__APB_16_32__

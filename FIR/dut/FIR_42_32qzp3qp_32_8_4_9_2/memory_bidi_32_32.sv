`ifndef DEF__memory_bidi_32_32__
`define DEF__memory_bidi_32_32__

interface memory_bidi_32_32;

  logic [31:0] ADDR;
  logic [31:0] DATA_WR;
  logic [31:0] DATA_RD;
  logic RE;
  logic WE;
  logic READY;
  logic [3:0] WSTRB;


  modport outward(
      output ADDR,
      output DATA_WR,
      input DATA_RD,
      output WE,
      output RE,
      input READY,
      output WSTRB
  );

  modport inward(
      input ADDR,
      input DATA_WR,
      output DATA_RD,
      input WE,
      input RE,
      output READY,
      input WSTRB
  );


endinterface

`endif //!DEF__memory_bidi_32_32__

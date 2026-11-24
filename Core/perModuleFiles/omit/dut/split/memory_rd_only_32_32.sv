`ifndef DEF__memory_rd_only_32_32__
`define DEF__memory_rd_only_32_32__

interface memory_rd_only_32_32;

  logic [31:0] ADDR;
  logic [31:0] DATA_RD;
  logic RE;
  logic READY;


  modport outward(output ADDR, input DATA_RD, output RE, input READY);

  modport inward(input ADDR, output DATA_RD, input RE, output READY);


endinterface

`endif //!DEF__memory_rd_only_32_32__

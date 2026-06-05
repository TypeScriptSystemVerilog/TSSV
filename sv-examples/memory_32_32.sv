interface memory_32_32;

   logic [31:0] ADDR;
   logic [31:0] DATA_WR;
   logic [31:0] DATA_RD;
   logic  RE;
   logic  WE;
   logic  READY;
   logic [3:0] WSTRB;


    modport outward (
      input ADDR,
      output DATA_WR,
      input DATA_RD,
      output WE,
      output RE,
      input READY,
      output WSTRB
    );

    modport inward (
      output ADDR,
      input DATA_WR,
      output DATA_RD,
      input WE,
      input RE,
      output READY,
      input WSTRB
    );


endinterface

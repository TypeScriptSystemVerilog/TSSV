
        

        
/* verilator lint_off WIDTH */        
module testAddrDecode_5_16_32_2882400000 
   (
   input logic [31:0] addr,
   input logic  we,
   input logic  re,
   output logic  blk_0_re,
   output logic  blk_0_we,
   output logic  blk_1_re,
   output logic  blk_1_we,
   output logic  blk_2_re,
   output logic  blk_2_we,
   output logic  blk_3_re,
   output logic  blk_3_we,
   output logic  blk_4_re,
   output logic  blk_4_we
   );

   

  assign blk_0_re = (addr & 'b11111111111111111111111111000000 == 'habcdef00) && re;
  assign blk_0_we = (addr & 'b11111111111111111111111111000000 == 'habcdef00) && we;
  assign blk_1_re = (addr & 'b11111111111111111111111111000000 == 'habcdef40) && re;
  assign blk_1_we = (addr & 'b11111111111111111111111111000000 == 'habcdef40) && we;
  assign blk_2_re = (addr & 'b11111111111111111111111111000000 == 'habcdef80) && re;
  assign blk_2_we = (addr & 'b11111111111111111111111111000000 == 'habcdef80) && we;
  assign blk_3_re = (addr & 'b11111111111111111111111111000000 == 'habcdefc0) && re;
  assign blk_3_we = (addr & 'b11111111111111111111111111000000 == 'habcdefc0) && we;
  assign blk_4_re = (addr & 'b11111111111111111111111111000000 == 'habcdf000) && re;
  assign blk_4_we = (addr & 'b11111111111111111111111111000000 == 'habcdf000) && we;


endmodule
/* verilator lint_on WIDTH */        

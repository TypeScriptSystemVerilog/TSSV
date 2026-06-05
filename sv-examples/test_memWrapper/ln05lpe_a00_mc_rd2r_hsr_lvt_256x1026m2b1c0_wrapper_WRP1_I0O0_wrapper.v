
                
        
                
                
        module ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I0O0 
           (
           input logic  CK,
   input logic  REN,
   input logic  WEN,
   input logic [255:0] DI,
   input logic [7:0] RA,
   input logic [7:0] WA,
   output logic [255:0] DOUT,
   input logic [1:0] MCSRD,
   input logic [1:0] MCSWR,
   input logic  RET,
   input logic [2:0] ADME
           );
        
        
        
        
    
        
    
        
        
        endmodule        
        
                
                
        module ln05lpe_a00_mc_rd2r_hsr_lvt_256x512m2b1c0_wrapper_WRP1_I0O0 
           (
           input logic  CK,
   input logic  REN,
   input logic  WEN,
   input logic [511:0] DI,
   input logic [7:0] RA,
   input logic [7:0] WA,
   output logic [511:0] DOUT,
   input logic [1:0] MCSRD,
   input logic [1:0] MCSWR,
   input logic  RET,
   input logic [2:0] ADME
           );
        
        
        
        
    
        
    
        
        
        endmodule        
        
                
                
        module ln05lpe_a00_mc_rd2r_hsr_lvt_256x8m2b1c0_wrapper_WRP1_I0O0 
           (
           input logic  CK,
   input logic  REN,
   input logic  WEN,
   input logic [7:0] DI,
   input logic [7:0] RA,
   input logic [7:0] WA,
   output logic [7:0] DOUT,
   input logic [1:0] MCSRD,
   input logic [1:0] MCSWR,
   input logic  RET,
   input logic [2:0] ADME
           );
        
        
        
        
    
        
    
        
        
        endmodule        
               
        module ln05lpe_a00_mc_rd2r_hsr_lvt_256x1026m2b1c0_wrapper_WRP1_I0O0     #(parameter dataWidth = 1026)
           (
           input   CK,
   input   REN,
   input   WEN,
   input  [1025:0] DI,
   input  [7:0] RA,
   input  [7:0] WA,
   output  [1025:0] DOUT,
   input  [1:0] MCSRD,
   input  [1:0] MCSWR,
   input   RET,
   input  [2:0] ADME
           );
        
           wire [255:0] DOUT_U_SRAM_0;
   wire [255:0] DI_U_SRAM_0;
   wire [255:0] DOUT_U_SRAM_1;
   wire [255:0] DI_U_SRAM_1;
   wire [511:0] DOUT_U_SRAM_2;
   wire [511:0] DI_U_SRAM_2;
   wire [7:0] DOUT_U_SRAM_3;
   wire [7:0] DI_U_SRAM_3;
        
        assign DI_U_SRAM_0 = DI[1025:770];
assign DI_U_SRAM_1 = DI[769:514];
assign DI_U_SRAM_2 = DI[513:2];
assign DI_U_SRAM_3 = {DI[1:0], 6'd0};
assign DOUT = {DOUT_U_SRAM_0, DOUT_U_SRAM_1, DOUT_U_SRAM_2, DOUT_U_SRAM_3[7:6]};

    
        
      ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I0O0 u_sram_0
      (
          .DI(DI_U_SRAM_0),
        .DOUT(DOUT_U_SRAM_0),
        .CK(CK),
        .REN(REN),
        .WEN(WEN),
        .RA(RA),
        .WA(WA),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)
      );
  
      ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I0O0 u_sram_1
      (
          .DI(DI_U_SRAM_1),
        .DOUT(DOUT_U_SRAM_1),
        .CK(CK),
        .REN(REN),
        .WEN(WEN),
        .RA(RA),
        .WA(WA),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)
      );
  
      ln05lpe_a00_mc_rd2r_hsr_lvt_256x512m2b1c0_wrapper_WRP1_I0O0 u_sram_2
      (
          .DI(DI_U_SRAM_2),
        .DOUT(DOUT_U_SRAM_2),
        .CK(CK),
        .REN(REN),
        .WEN(WEN),
        .RA(RA),
        .WA(WA),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)
      );
  
      ln05lpe_a00_mc_rd2r_hsr_lvt_256x8m2b1c0_wrapper_WRP1_I0O0 u_sram_3
      (
          .DI(DI_U_SRAM_3),
        .DOUT(DOUT_U_SRAM_3),
        .CK(CK),
        .REN(REN),
        .WEN(WEN),
        .RA(RA),
        .WA(WA),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)
      );
  
    
        
        
        endmodule
        
module ln05lpe_a00_mc_rd2r_hsr_lvt_256x1026m2b1c0_wrapper_WRP1_I1O1     
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
    
    assign DI_U_SRAM_0 = DI[1025:770];
assign DI_U_SRAM_1 = DI[769:514];
assign DI_U_SRAM_2 = DI[513:2];

reg  [1:0]      DI_REG_0 [255:0];
reg  [1:0]      DOUT_REG_0;
always @(posedge CK) begin
    if (~WEN) begin
        DI_REG_0[WA] <= DI[1:0];
    end
end

always @(posedge CK) begin
    if (~REN) begin
        DOUT_REG_0 <= DI_REG_0[RA];
    end
end
    assign DOUT = {DOUT_U_SRAM_0, DOUT_U_SRAM_1, DOUT_U_SRAM_2, DOUT_REG_0};


    
      ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I1O1 u_sram_0
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
  
      ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I1O1 u_sram_1
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
  
      ln05lpe_a00_mc_rd2r_hsr_lvt_256x512m2b1c0_wrapper_WRP1_I1O1 u_sram_2
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
  

    
    
    endmodule
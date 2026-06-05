
        

        

        
module ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I0O0 
   (
   input   CK,
   input   REN,
   input   WEN,
   input  [255:0] DI,
   input  [7:0] RA,
   input  [7:0] WA,
   output  [255:0] DOUT,
   input  [1:0] MCSRD,
   input  [1:0] MCSWR,
   input   RET,
   input  [2:0] ADME
   );

   



endmodule
        

        
module ln05lpe_a00_mc_rd2r_hsr_lvt_512x256m2b1c0_wrapper_WRP1_I0O0 
   (
   input   CK,
   input   REN,
   input   WEN,
   input  [255:0] DI,
   input  [8:0] RA,
   input  [8:0] WA,
   output  [255:0] DOUT,
   input  [1:0] MCSRD,
   input  [1:0] MCSWR,
   input   RET,
   input  [2:0] ADME
   );

   



endmodule
        

        
module ln05lpe_a00_mc_rd2r_hsr_lvt_8x256m2b1c0_wrapper_WRP1_I0O0 
   (
   input   CK,
   input   REN,
   input   WEN,
   input  [255:0] DI,
   input  [2:0] RA,
   input  [2:0] WA,
   output  [255:0] DOUT,
   input  [1:0] MCSRD,
   input  [1:0] MCSWR,
   input   RET,
   input  [2:0] ADME
   );

   



endmodule
        
module ln05lpe_a00_mc_rd2r_hsr_lvt_1026x256m2b1c0_wrapper_WRP1_I0O0 
   (
   input   CK,
   input   REN,
   input   WEN,
   input  [255:0] DI,
   input  [10:0] RA,
   input  [10:0] WA,
   output  [255:0] DOUT,
   input  [1:0] MCSRD,
   input  [1:0] MCSWR,
   input   RET,
   input  [2:0] ADME
   );

   wire [255:0] DOUT_U_SRAM_0;
   wire [255:0] DOUT_TMP_U_SRAM_0;
   wire  REN_U_SRAM_0;
   reg  REN_U_SRAM_0_D0;
   wire  WEN_U_SRAM_0;
   wire [7:0] RA_U_SRAM_0;
   wire [7:0] WA_U_SRAM_0;
   wire [255:0] DOUT_U_SRAM_1;
   wire [255:0] DOUT_TMP_U_SRAM_1;
   wire  REN_U_SRAM_1;
   reg  REN_U_SRAM_1_D0;
   wire  WEN_U_SRAM_1;
   wire [7:0] RA_U_SRAM_1;
   wire [7:0] WA_U_SRAM_1;
   wire [255:0] DOUT_U_SRAM_2;
   wire [255:0] DOUT_TMP_U_SRAM_2;
   wire  REN_U_SRAM_2;
   reg  REN_U_SRAM_2_D0;
   wire  WEN_U_SRAM_2;
   wire [8:0] RA_U_SRAM_2;
   wire [8:0] WA_U_SRAM_2;
   wire [255:0] DOUT_U_SRAM_3;
   wire [255:0] DOUT_TMP_U_SRAM_3;
   wire  REN_U_SRAM_3;
   reg  REN_U_SRAM_3_D0;
   wire  WEN_U_SRAM_3;
   wire [2:0] RA_U_SRAM_3;
   wire [2:0] WA_U_SRAM_3;

assign REN_U_SRAM_0 = ( RA[10:8] != 3'b000) | REN;
assign WEN_U_SRAM_0 = ( WA[10:8] != 3'b000) | WEN;
assign RA_U_SRAM_0 = RA & 11'h0FF;
assign DOUT_TMP_U_SRAM_0 = DOUT_U_SRAM_0 & {256{REN_U_SRAM_0_D0}};
assign REN_U_SRAM_1 = ( RA[10:8] != 3'b000) | REN;
assign WEN_U_SRAM_1 = ( WA[10:8] != 3'b000) | WEN;
assign RA_U_SRAM_1 = RA & 11'h0FF;
assign DOUT_TMP_U_SRAM_1 = DOUT_U_SRAM_1 & {256{REN_U_SRAM_1_D0}};
assign REN_U_SRAM_2 = ( RA[10:9] != 2'b01) | REN;
assign WEN_U_SRAM_2 = ( WA[10:9] != 2'b01) | WEN;
assign RA_U_SRAM_2 = RA & 11'h1FF;
assign DOUT_TMP_U_SRAM_2 = DOUT_U_SRAM_2 & {256{REN_U_SRAM_2_D0}};
assign REN_U_SRAM_3 = ( RA[10] != 1'b1) | REN;
assign WEN_U_SRAM_3 = ( WA[10] != 1'b1) | WEN;
assign RA_U_SRAM_3 = RA & 11'h001;
assign DOUT_TMP_U_SRAM_3 = DOUT_U_SRAM_3 & {256{REN_U_SRAM_3_D0}};
assign DOUT = {DOUT_TMP_U_SRAM_0 | DOUT_TMP_U_SRAM_1 | DOUT_TMP_U_SRAM_2 | DOUT_TMP_U_SRAM_3};

   always @( posedge CK  )
   
        begin
           REN_U_SRAM_0_D0 <= ~REN_U_SRAM_0;
           REN_U_SRAM_1_D0 <= ~REN_U_SRAM_1;
           REN_U_SRAM_2_D0 <= ~REN_U_SRAM_2;
           REN_U_SRAM_3_D0 <= ~REN_U_SRAM_3;
        end

    ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I0O0 u_sram_0
      (
        .REN(REN_U_SRAM_0),
        .WEN(WEN_U_SRAM_0),
        .RA(RA_U_SRAM_0),
        .WA(WA_U_SRAM_0),
        .DOUT(DOUT_U_SRAM_0),
        .CK(CK),
        .DI(DI),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)        
      );

    ln05lpe_a00_mc_rd2r_hsr_lvt_256x256m2b1c0_wrapper_WRP1_I0O0 u_sram_1
      (
        .REN(REN_U_SRAM_1),
        .WEN(WEN_U_SRAM_1),
        .RA(RA_U_SRAM_1),
        .WA(WA_U_SRAM_1),
        .DOUT(DOUT_U_SRAM_1),
        .CK(CK),
        .DI(DI),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)        
      );

    ln05lpe_a00_mc_rd2r_hsr_lvt_512x256m2b1c0_wrapper_WRP1_I0O0 u_sram_2
      (
        .REN(REN_U_SRAM_2),
        .WEN(WEN_U_SRAM_2),
        .RA(RA_U_SRAM_2),
        .WA(WA_U_SRAM_2),
        .DOUT(DOUT_U_SRAM_2),
        .CK(CK),
        .DI(DI),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)        
      );

    ln05lpe_a00_mc_rd2r_hsr_lvt_8x256m2b1c0_wrapper_WRP1_I0O0 u_sram_3
      (
        .REN(REN_U_SRAM_3),
        .WEN(WEN_U_SRAM_3),
        .RA(RA_U_SRAM_3),
        .WA(WA_U_SRAM_3),
        .DOUT(DOUT_U_SRAM_3),
        .CK(CK),
        .DI(DI),
        .MCSRD(MCSRD),
        .MCSWR(MCSWR),
        .RET(RET),
        .ADME(ADME)        
      );


endmodule
 /*                                                                      
  *  Copyright (c) 2018-2023 Nuclei System Technology, Inc.       
  *  All rights reserved.                                                
  */ 
`include "global.v"

module ux900_rams_wrapper (
  input              ilm_cs                        ,
  input              ilm_we                        ,
  input  [   7:   0] ilm_wem                       ,
  input  [  14:   0] ilm_addr                      ,
  input  [  63:   0] ilm_din                       ,
  output [  63:   0] ilm_dout                      ,
  input              clk_ilm                       ,
  input              dlm0_cs                       ,
  input              dlm0_we                       ,
  input  [   3:   0] dlm0_wem                      ,
  input  [  14:   0] dlm0_addr                     ,
  input  [  31:   0] dlm0_din                      ,
  output [  31:   0] dlm0_dout                     ,
  input              clk_dlm0                      ,
  input              dlm1_cs                       ,
  input              dlm1_we                       ,
  input  [   3:   0] dlm1_wem                      ,
  input  [  14:   0] dlm1_addr                     ,
  input  [  31:   0] dlm1_din                      ,
  output [  31:   0] dlm1_dout                     ,
  input              clk_dlm1                      ,
  input              bht_ram_bank0_cs              ,
  input              bht_ram_bank0_we              ,
  input  [  15:   0] bht_ram_bank0_wem             ,
  input  [   9:   0] bht_ram_bank0_addr            ,
  input  [  15:   0] bht_ram_bank0_din             ,
  output [  15:   0] bht_ram_bank0_dout            ,
  input              clk_bht_ram_bank0             ,
  input              bht_ram_bank1_cs              ,
  input              bht_ram_bank1_we              ,
  input  [  15:   0] bht_ram_bank1_wem             ,
  input  [   9:   0] bht_ram_bank1_addr            ,
  input  [  15:   0] bht_ram_bank1_din             ,
  output [  15:   0] bht_ram_bank1_dout            ,
  input              clk_bht_ram_bank1             ,
  input              bht_ram_bank2_cs              ,
  input              bht_ram_bank2_we              ,
  input  [  15:   0] bht_ram_bank2_wem             ,
  input  [   9:   0] bht_ram_bank2_addr            ,
  input  [  15:   0] bht_ram_bank2_din             ,
  output [  15:   0] bht_ram_bank2_dout            ,
  input              clk_bht_ram_bank2             ,
  input              bht_ram_bank3_cs              ,
  input              bht_ram_bank3_we              ,
  input  [  15:   0] bht_ram_bank3_wem             ,
  input  [   9:   0] bht_ram_bank3_addr            ,
  input  [  15:   0] bht_ram_bank3_din             ,
  output [  15:   0] bht_ram_bank3_dout            ,
  input              clk_bht_ram_bank3             ,
  input              btb_ram_bank0_cs              ,
  input              btb_ram_bank0_we              ,
  input  [ 139:   0] btb_ram_bank0_wem             ,
  input  [   4:   0] btb_ram_bank0_addr            ,
  input  [ 139:   0] btb_ram_bank0_din             ,
  output [ 139:   0] btb_ram_bank0_dout            ,
  input              clk_btb_ram_bank0             ,
  input              btb_ram_bank1_cs              ,
  input              btb_ram_bank1_we              ,
  input  [ 139:   0] btb_ram_bank1_wem             ,
  input  [   4:   0] btb_ram_bank1_addr            ,
  input  [ 139:   0] btb_ram_bank1_din             ,
  output [ 139:   0] btb_ram_bank1_dout            ,
  input              clk_btb_ram_bank1             ,
  input              btb_ram_bank2_cs              ,
  input              btb_ram_bank2_we              ,
  input  [ 139:   0] btb_ram_bank2_wem             ,
  input  [   4:   0] btb_ram_bank2_addr            ,
  input  [ 139:   0] btb_ram_bank2_din             ,
  output [ 139:   0] btb_ram_bank2_dout            ,
  input              clk_btb_ram_bank2             ,
  input              btb_ram_bank3_cs              ,
  input              btb_ram_bank3_we              ,
  input  [ 139:   0] btb_ram_bank3_wem             ,
  input  [   4:   0] btb_ram_bank3_addr            ,
  input  [ 139:   0] btb_ram_bank3_din             ,
  output [ 139:   0] btb_ram_bank3_dout            ,
  input              clk_btb_ram_bank3             ,
  input              icache_tag0_cs                ,
  input              icache_tag0_we                ,
  input  [   7:   0] icache_tag0_addr              ,
  input  [  21:   0] icache_tag0_din               ,
  output [  21:   0] icache_tag0_dout              ,
  input              clk_icache_tag0               ,
  input              icache_tag1_cs                ,
  input              icache_tag1_we                ,
  input  [   7:   0] icache_tag1_addr              ,
  input  [  21:   0] icache_tag1_din               ,
  output [  21:   0] icache_tag1_dout              ,
  input              clk_icache_tag1               ,
  input              icache_data0_cs               ,
  input              icache_data0_we               ,
  input  [  10:   0] icache_data0_addr             ,
  input  [  63:   0] icache_data0_din              ,
  output [  63:   0] icache_data0_dout             ,
  input              clk_icache_data0              ,
  input              icache_data1_cs               ,
  input              icache_data1_we               ,
  input  [  10:   0] icache_data1_addr             ,
  input  [  63:   0] icache_data1_din              ,
  output [  63:   0] icache_data1_dout             ,
  input              clk_icache_data1              ,
  input              dcache_w0_tram_cs             ,
  input              dcache_w0_tram_we             ,
  input  [   7:   0] dcache_w0_tram_addr           ,
  input  [  21:   0] dcache_w0_tram_din            ,
  output [  21:   0] dcache_w0_tram_dout           ,
  input              clk_dcache_w0_tram            ,
  input              dcache_w1_tram_cs             ,
  input              dcache_w1_tram_we             ,
  input  [   7:   0] dcache_w1_tram_addr           ,
  input  [  21:   0] dcache_w1_tram_din            ,
  output [  21:   0] dcache_w1_tram_dout           ,
  input              clk_dcache_w1_tram            ,
  input              dcache_dram_b0_cs             ,
  input              dcache_dram_b0_we             ,
  input  [   3:   0] dcache_dram_b0_wem            ,
  input  [   9:   0] dcache_dram_b0_addr           ,
  input  [  31:   0] dcache_dram_b0_din            ,
  output [  31:   0] dcache_dram_b0_dout           ,
  input              clk_dcache_dram_b0            ,
  input              dcache_dram_b1_cs             ,
  input              dcache_dram_b1_we             ,
  input  [   3:   0] dcache_dram_b1_wem            ,
  input  [   9:   0] dcache_dram_b1_addr           ,
  input  [  31:   0] dcache_dram_b1_din            ,
  output [  31:   0] dcache_dram_b1_dout           ,
  input              clk_dcache_dram_b1            ,
  input              dcache_dram_b2_cs             ,
  input              dcache_dram_b2_we             ,
  input  [   3:   0] dcache_dram_b2_wem            ,
  input  [   9:   0] dcache_dram_b2_addr           ,
  input  [  31:   0] dcache_dram_b2_din            ,
  output [  31:   0] dcache_dram_b2_dout           ,
  input              clk_dcache_dram_b2            ,
  input              dcache_dram_b3_cs             ,
  input              dcache_dram_b3_we             ,
  input  [   3:   0] dcache_dram_b3_wem            ,
  input  [   9:   0] dcache_dram_b3_addr           ,
  input  [  31:   0] dcache_dram_b3_din            ,
  output [  31:   0] dcache_dram_b3_dout           ,
  input              clk_dcache_dram_b3            ,
  input              dcache_dram_b4_cs             ,
  input              dcache_dram_b4_we             ,
  input  [   3:   0] dcache_dram_b4_wem            ,
  input  [   9:   0] dcache_dram_b4_addr           ,
  input  [  31:   0] dcache_dram_b4_din            ,
  output [  31:   0] dcache_dram_b4_dout           ,
  input              clk_dcache_dram_b4            ,
  input              dcache_dram_b5_cs             ,
  input              dcache_dram_b5_we             ,
  input  [   3:   0] dcache_dram_b5_wem            ,
  input  [   9:   0] dcache_dram_b5_addr           ,
  input  [  31:   0] dcache_dram_b5_din            ,
  output [  31:   0] dcache_dram_b5_dout           ,
  input              clk_dcache_dram_b5            ,
  input              dcache_dram_b6_cs             ,
  input              dcache_dram_b6_we             ,
  input  [   3:   0] dcache_dram_b6_wem            ,
  input  [   9:   0] dcache_dram_b6_addr           ,
  input  [  31:   0] dcache_dram_b6_din            ,
  output [  31:   0] dcache_dram_b6_dout           ,
  input              clk_dcache_dram_b6            ,
  input              dcache_dram_b7_cs             ,
  input              dcache_dram_b7_we             ,
  input  [   3:   0] dcache_dram_b7_wem            ,
  input  [   9:   0] dcache_dram_b7_addr           ,
  input  [  31:   0] dcache_dram_b7_din            ,
  output [  31:   0] dcache_dram_b7_dout           ,
  input              clk_dcache_dram_b7            ,
  input              tlb_tram_way0_cs              ,
  input              tlb_tram_way0_we              ,
  input  [   7:   0] tlb_tram_way0_addr            ,
  input  [  38:   0] tlb_tram_way0_din             ,
  output [  38:   0] tlb_tram_way0_dout            ,
  input              clk_tlb_tram_way0             ,
  input              tlb_tram_way1_cs              ,
  input              tlb_tram_way1_we              ,
  input  [   7:   0] tlb_tram_way1_addr            ,
  input  [  38:   0] tlb_tram_way1_din             ,
  output [  38:   0] tlb_tram_way1_dout            ,
  input              clk_tlb_tram_way1             ,
  input              tlb_dram_way0_cs              ,
  input              tlb_dram_way0_we              ,
  input  [   7:   0] tlb_dram_way0_addr            ,
  input  [  26:   0] tlb_dram_way0_din             ,
  output [  26:   0] tlb_dram_way0_dout            ,
  input              clk_tlb_dram_way0             ,
  input              tlb_dram_way1_cs              ,
  input              tlb_dram_way1_we              ,
  input  [   7:   0] tlb_dram_way1_addr            ,
  input  [  26:   0] tlb_dram_way1_din             ,
  output [  26:   0] tlb_dram_way1_dout            ,
  input              clk_tlb_dram_way1             ,
  input              tlb_tram_way2_cs              ,
  input              tlb_tram_way2_we              ,
  input  [   7:   0] tlb_tram_way2_addr            ,
  input  [  38:   0] tlb_tram_way2_din             ,
  output [  38:   0] tlb_tram_way2_dout            ,
  input              clk_tlb_tram_way2             ,
  input              tlb_dram_way2_cs              ,
  input              tlb_dram_way2_we              ,
  input  [   7:   0] tlb_dram_way2_addr            ,
  input  [  26:   0] tlb_dram_way2_din             ,
  output [  26:   0] tlb_dram_way2_dout            ,
  input              clk_tlb_dram_way2             ,
  input              tlb_tram_way3_cs              ,
  input              tlb_tram_way3_we              ,
  input  [   7:   0] tlb_tram_way3_addr            ,
  input  [  38:   0] tlb_tram_way3_din             ,
  output [  38:   0] tlb_tram_way3_dout            ,
  input              clk_tlb_tram_way3             ,
  input              tlb_dram_way3_cs              ,
  input              tlb_dram_way3_we              ,
  input  [   7:   0] tlb_dram_way3_addr            ,
  input  [  26:   0] tlb_dram_way3_din             ,
  output [  26:   0] tlb_dram_way3_dout            ,
  input              clk_tlb_dram_way3             ,
  input              rst_n                         ,
  input              clkgate_bypass                
 );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(32768),
    .DW(64),
    .MW(8),
    .AW(15) 
  )u_ilm_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (ilm_cs   ),
    .we   (ilm_we   ),
    .wem  (ilm_wem   ),
    .addr (ilm_addr ),
    .din  (ilm_din  ),
    .dout (ilm_dout ),
    .rst_n(rst_n),
    .clk  (clk_ilm  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(32768),
    .DW(32),
    .MW(4),
    .AW(15) 
  )u_dlm0_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dlm0_cs   ),
    .we   (dlm0_we   ),
    .wem  (dlm0_wem   ),
    .addr (dlm0_addr ),
    .din  (dlm0_din  ),
    .dout (dlm0_dout ),
    .rst_n(rst_n),
    .clk  (clk_dlm0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(32768),
    .DW(32),
    .MW(4),
    .AW(15) 
  )u_dlm1_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dlm1_cs   ),
    .we   (dlm1_we   ),
    .wem  (dlm1_wem   ),
    .addr (dlm1_addr ),
    .din  (dlm1_din  ),
    .dout (dlm1_dout ),
    .rst_n(rst_n),
    .clk  (clk_dlm1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(16),
    .MW(16),
    .AW(10) 
  )u_bht_ram_bank0 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (bht_ram_bank0_cs   ),
    .we   (bht_ram_bank0_we   ),
    .wem  (bht_ram_bank0_wem   ),
    .addr (bht_ram_bank0_addr ),
    .din  (bht_ram_bank0_din  ),
    .dout (bht_ram_bank0_dout ),
    .rst_n(rst_n),
    .clk  (clk_bht_ram_bank0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(16),
    .MW(16),
    .AW(10) 
  )u_bht_ram_bank1 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (bht_ram_bank1_cs   ),
    .we   (bht_ram_bank1_we   ),
    .wem  (bht_ram_bank1_wem   ),
    .addr (bht_ram_bank1_addr ),
    .din  (bht_ram_bank1_din  ),
    .dout (bht_ram_bank1_dout ),
    .rst_n(rst_n),
    .clk  (clk_bht_ram_bank1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(16),
    .MW(16),
    .AW(10) 
  )u_bht_ram_bank2 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (bht_ram_bank2_cs   ),
    .we   (bht_ram_bank2_we   ),
    .wem  (bht_ram_bank2_wem   ),
    .addr (bht_ram_bank2_addr ),
    .din  (bht_ram_bank2_din  ),
    .dout (bht_ram_bank2_dout ),
    .rst_n(rst_n),
    .clk  (clk_bht_ram_bank2  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(16),
    .MW(16),
    .AW(10) 
  )u_bht_ram_bank3 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (bht_ram_bank3_cs   ),
    .we   (bht_ram_bank3_we   ),
    .wem  (bht_ram_bank3_wem   ),
    .addr (bht_ram_bank3_addr ),
    .din  (bht_ram_bank3_din  ),
    .dout (bht_ram_bank3_dout ),
    .rst_n(rst_n),
    .clk  (clk_bht_ram_bank3  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(32),
    .DW(140),
    .MW(140),
    .AW(5) 
  )u_btb_ram_bank0 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (btb_ram_bank0_cs   ),
    .we   (btb_ram_bank0_we   ),
    .wem  (btb_ram_bank0_wem   ),
    .addr (btb_ram_bank0_addr ),
    .din  (btb_ram_bank0_din  ),
    .dout (btb_ram_bank0_dout ),
    .rst_n(rst_n),
    .clk  (clk_btb_ram_bank0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(32),
    .DW(140),
    .MW(140),
    .AW(5) 
  )u_btb_ram_bank1 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (btb_ram_bank1_cs   ),
    .we   (btb_ram_bank1_we   ),
    .wem  (btb_ram_bank1_wem   ),
    .addr (btb_ram_bank1_addr ),
    .din  (btb_ram_bank1_din  ),
    .dout (btb_ram_bank1_dout ),
    .rst_n(rst_n),
    .clk  (clk_btb_ram_bank1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(32),
    .DW(140),
    .MW(140),
    .AW(5) 
  )u_btb_ram_bank2 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (btb_ram_bank2_cs   ),
    .we   (btb_ram_bank2_we   ),
    .wem  (btb_ram_bank2_wem   ),
    .addr (btb_ram_bank2_addr ),
    .din  (btb_ram_bank2_din  ),
    .dout (btb_ram_bank2_dout ),
    .rst_n(rst_n),
    .clk  (clk_btb_ram_bank2  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(32),
    .DW(140),
    .MW(140),
    .AW(5) 
  )u_btb_ram_bank3 (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (btb_ram_bank3_cs   ),
    .we   (btb_ram_bank3_we   ),
    .wem  (btb_ram_bank3_wem   ),
    .addr (btb_ram_bank3_addr ),
    .din  (btb_ram_bank3_din  ),
    .dout (btb_ram_bank3_dout ),
    .rst_n(rst_n),
    .clk  (clk_btb_ram_bank3  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_icache_tag0_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (icache_tag0_cs   ),
    .we   (icache_tag0_we   ),
    .wem  (icache_tag0_we    ),
    .addr (icache_tag0_addr ),
    .din  (icache_tag0_din  ),
    .dout (icache_tag0_dout ),
    .rst_n(rst_n),
    .clk  (clk_icache_tag0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_icache_tag1_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (icache_tag1_cs   ),
    .we   (icache_tag1_we   ),
    .wem  (icache_tag1_we    ),
    .addr (icache_tag1_addr ),
    .din  (icache_tag1_din  ),
    .dout (icache_tag1_dout ),
    .rst_n(rst_n),
    .clk  (clk_icache_tag1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(2048),
    .DW(64),
    .MW(1),
    .AW(11) 
  )u_icache_data0_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (icache_data0_cs   ),
    .we   (icache_data0_we   ),
    .wem  (icache_data0_we    ),
    .addr (icache_data0_addr ),
    .din  (icache_data0_din  ),
    .dout (icache_data0_dout ),
    .rst_n(rst_n),
    .clk  (clk_icache_data0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(2048),
    .DW(64),
    .MW(1),
    .AW(11) 
  )u_icache_data1_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (icache_data1_cs   ),
    .we   (icache_data1_we   ),
    .wem  (icache_data1_we    ),
    .addr (icache_data1_addr ),
    .din  (icache_data1_din  ),
    .dout (icache_data1_dout ),
    .rst_n(rst_n),
    .clk  (clk_icache_data1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_dcache_w0_tram_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_w0_tram_cs   ),
    .we   (dcache_w0_tram_we   ),
    .wem  (dcache_w0_tram_we    ),
    .addr (dcache_w0_tram_addr ),
    .din  (dcache_w0_tram_din  ),
    .dout (dcache_w0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_w0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_dcache_w1_tram_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_w1_tram_cs   ),
    .we   (dcache_w1_tram_we   ),
    .wem  (dcache_w1_tram_we    ),
    .addr (dcache_w1_tram_addr ),
    .din  (dcache_w1_tram_din  ),
    .dout (dcache_w1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_w1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b0_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b0_cs   ),
    .we   (dcache_dram_b0_we   ),
    .wem  (dcache_dram_b0_wem   ),
    .addr (dcache_dram_b0_addr ),
    .din  (dcache_dram_b0_din  ),
    .dout (dcache_dram_b0_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b1_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b1_cs   ),
    .we   (dcache_dram_b1_we   ),
    .wem  (dcache_dram_b1_wem   ),
    .addr (dcache_dram_b1_addr ),
    .din  (dcache_dram_b1_din  ),
    .dout (dcache_dram_b1_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b2_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b2_cs   ),
    .we   (dcache_dram_b2_we   ),
    .wem  (dcache_dram_b2_wem   ),
    .addr (dcache_dram_b2_addr ),
    .din  (dcache_dram_b2_din  ),
    .dout (dcache_dram_b2_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b2  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b3_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b3_cs   ),
    .we   (dcache_dram_b3_we   ),
    .wem  (dcache_dram_b3_wem   ),
    .addr (dcache_dram_b3_addr ),
    .din  (dcache_dram_b3_din  ),
    .dout (dcache_dram_b3_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b3  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b4_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b4_cs   ),
    .we   (dcache_dram_b4_we   ),
    .wem  (dcache_dram_b4_wem   ),
    .addr (dcache_dram_b4_addr ),
    .din  (dcache_dram_b4_din  ),
    .dout (dcache_dram_b4_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b4  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b5_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b5_cs   ),
    .we   (dcache_dram_b5_we   ),
    .wem  (dcache_dram_b5_wem   ),
    .addr (dcache_dram_b5_addr ),
    .din  (dcache_dram_b5_din  ),
    .dout (dcache_dram_b5_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b5  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b6_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b6_cs   ),
    .we   (dcache_dram_b6_we   ),
    .wem  (dcache_dram_b6_wem   ),
    .addr (dcache_dram_b6_addr ),
    .din  (dcache_dram_b6_din  ),
    .dout (dcache_dram_b6_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b6  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(1024),
    .DW(32),
    .MW(4),
    .AW(10) 
  )u_dcache_dram_b7_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (dcache_dram_b7_cs   ),
    .we   (dcache_dram_b7_we   ),
    .wem  (dcache_dram_b7_wem   ),
    .addr (dcache_dram_b7_addr ),
    .din  (dcache_dram_b7_din  ),
    .dout (dcache_dram_b7_dout ),
    .rst_n(rst_n),
    .clk  (clk_dcache_dram_b7  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(39),
    .MW(1),
    .AW(8) 
  )u_tlb_tram_way0_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_tram_way0_cs   ),
    .we   (tlb_tram_way0_we   ),
    .wem  (tlb_tram_way0_we    ),
    .addr (tlb_tram_way0_addr ),
    .din  (tlb_tram_way0_din  ),
    .dout (tlb_tram_way0_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_tram_way0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(39),
    .MW(1),
    .AW(8) 
  )u_tlb_tram_way1_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_tram_way1_cs   ),
    .we   (tlb_tram_way1_we   ),
    .wem  (tlb_tram_way1_we    ),
    .addr (tlb_tram_way1_addr ),
    .din  (tlb_tram_way1_din  ),
    .dout (tlb_tram_way1_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_tram_way1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(27),
    .MW(1),
    .AW(8) 
  )u_tlb_dram_way0_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_dram_way0_cs   ),
    .we   (tlb_dram_way0_we   ),
    .wem  (tlb_dram_way0_we    ),
    .addr (tlb_dram_way0_addr ),
    .din  (tlb_dram_way0_din  ),
    .dout (tlb_dram_way0_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_dram_way0  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(27),
    .MW(1),
    .AW(8) 
  )u_tlb_dram_way1_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_dram_way1_cs   ),
    .we   (tlb_dram_way1_we   ),
    .wem  (tlb_dram_way1_we    ),
    .addr (tlb_dram_way1_addr ),
    .din  (tlb_dram_way1_din  ),
    .dout (tlb_dram_way1_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_dram_way1  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(39),
    .MW(1),
    .AW(8) 
  )u_tlb_tram_way2_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_tram_way2_cs   ),
    .we   (tlb_tram_way2_we   ),
    .wem  (tlb_tram_way2_we    ),
    .addr (tlb_tram_way2_addr ),
    .din  (tlb_tram_way2_din  ),
    .dout (tlb_tram_way2_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_tram_way2  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(27),
    .MW(1),
    .AW(8) 
  )u_tlb_dram_way2_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_dram_way2_cs   ),
    .we   (tlb_dram_way2_we   ),
    .wem  (tlb_dram_way2_we    ),
    .addr (tlb_dram_way2_addr ),
    .din  (tlb_dram_way2_din  ),
    .dout (tlb_dram_way2_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_dram_way2  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(39),
    .MW(1),
    .AW(8) 
  )u_tlb_tram_way3_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_tram_way3_cs   ),
    .we   (tlb_tram_way3_we   ),
    .wem  (tlb_tram_way3_we    ),
    .addr (tlb_tram_way3_addr ),
    .din  (tlb_tram_way3_din  ),
    .dout (tlb_tram_way3_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_tram_way3  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(27),
    .MW(1),
    .AW(8) 
  )u_tlb_dram_way3_ram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (tlb_dram_way3_cs   ),
    .we   (tlb_dram_way3_we   ),
    .wem  (tlb_dram_way3_we    ),
    .addr (tlb_dram_way3_addr ),
    .din  (tlb_dram_way3_din  ),
    .dout (tlb_dram_way3_dout ),
    .rst_n(rst_n),
    .clk  (clk_tlb_dram_way3  )
    );
endmodule

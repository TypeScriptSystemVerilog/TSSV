 /*                                                                      
  *  Copyright (c) 2018-2023 Nuclei System Technology, Inc.       
  *  All rights reserved.                                                
  */ 
`include "global.v"

module ux900_cc_rams_wrapper (
  input              core0_w0_shw_tram_cs          ,
  input              core0_w0_shw_tram_we          ,
  input  [   7:   0] core0_w0_shw_tram_addr        ,
  input  [  21:   0] core0_w0_shw_tram_din         ,
  output [  21:   0] core0_w0_shw_tram_dout        ,
  input              core0_clk_w0_shw_tram         ,
  input              core0_w1_shw_tram_cs          ,
  input              core0_w1_shw_tram_we          ,
  input  [   7:   0] core0_w1_shw_tram_addr        ,
  input  [  21:   0] core0_w1_shw_tram_din         ,
  output [  21:   0] core0_w1_shw_tram_dout        ,
  input              core0_clk_w1_shw_tram         ,
  input              core1_w0_shw_tram_cs          ,
  input              core1_w0_shw_tram_we          ,
  input  [   7:   0] core1_w0_shw_tram_addr        ,
  input  [  21:   0] core1_w0_shw_tram_din         ,
  output [  21:   0] core1_w0_shw_tram_dout        ,
  input              core1_clk_w0_shw_tram         ,
  input              core1_w1_shw_tram_cs          ,
  input              core1_w1_shw_tram_we          ,
  input  [   7:   0] core1_w1_shw_tram_addr        ,
  input  [  21:   0] core1_w1_shw_tram_din         ,
  output [  21:   0] core1_w1_shw_tram_dout        ,
  input              core1_clk_w1_shw_tram         ,
  input              core2_w0_shw_tram_cs          ,
  input              core2_w0_shw_tram_we          ,
  input  [   7:   0] core2_w0_shw_tram_addr        ,
  input  [  21:   0] core2_w0_shw_tram_din         ,
  output [  21:   0] core2_w0_shw_tram_dout        ,
  input              core2_clk_w0_shw_tram         ,
  input              core2_w1_shw_tram_cs          ,
  input              core2_w1_shw_tram_we          ,
  input  [   7:   0] core2_w1_shw_tram_addr        ,
  input  [  21:   0] core2_w1_shw_tram_din         ,
  output [  21:   0] core2_w1_shw_tram_dout        ,
  input              core2_clk_w1_shw_tram         ,
  input              core3_w0_shw_tram_cs          ,
  input              core3_w0_shw_tram_we          ,
  input  [   7:   0] core3_w0_shw_tram_addr        ,
  input  [  21:   0] core3_w0_shw_tram_din         ,
  output [  21:   0] core3_w0_shw_tram_dout        ,
  input              core3_clk_w0_shw_tram         ,
  input              core3_w1_shw_tram_cs          ,
  input              core3_w1_shw_tram_we          ,
  input  [   7:   0] core3_w1_shw_tram_addr        ,
  input  [  21:   0] core3_w1_shw_tram_din         ,
  output [  21:   0] core3_w1_shw_tram_dout        ,
  input              core3_clk_w1_shw_tram         ,
  input              w0_b0_tram_cs                 ,
  input              w0_b0_tram_we                 ,
  input  [   7:   0] w0_b0_tram_addr               ,
  input  [  19:   0] w0_b0_tram_din                ,
  output [  19:   0] w0_b0_tram_dout               ,
  input              clk_w0_b0_tram                ,
  input              w1_b0_tram_cs                 ,
  input              w1_b0_tram_we                 ,
  input  [   7:   0] w1_b0_tram_addr               ,
  input  [  19:   0] w1_b0_tram_din                ,
  output [  19:   0] w1_b0_tram_dout               ,
  input              clk_w1_b0_tram                ,
  input              w2_b0_tram_cs                 ,
  input              w2_b0_tram_we                 ,
  input  [   7:   0] w2_b0_tram_addr               ,
  input  [  19:   0] w2_b0_tram_din                ,
  output [  19:   0] w2_b0_tram_dout               ,
  input              clk_w2_b0_tram                ,
  input              w3_b0_tram_cs                 ,
  input              w3_b0_tram_we                 ,
  input  [   7:   0] w3_b0_tram_addr               ,
  input  [  19:   0] w3_b0_tram_din                ,
  output [  19:   0] w3_b0_tram_dout               ,
  input              clk_w3_b0_tram                ,
  input              w4_b0_tram_cs                 ,
  input              w4_b0_tram_we                 ,
  input  [   7:   0] w4_b0_tram_addr               ,
  input  [  19:   0] w4_b0_tram_din                ,
  output [  19:   0] w4_b0_tram_dout               ,
  input              clk_w4_b0_tram                ,
  input              w5_b0_tram_cs                 ,
  input              w5_b0_tram_we                 ,
  input  [   7:   0] w5_b0_tram_addr               ,
  input  [  19:   0] w5_b0_tram_din                ,
  output [  19:   0] w5_b0_tram_dout               ,
  input              clk_w5_b0_tram                ,
  input              w6_b0_tram_cs                 ,
  input              w6_b0_tram_we                 ,
  input  [   7:   0] w6_b0_tram_addr               ,
  input  [  19:   0] w6_b0_tram_din                ,
  output [  19:   0] w6_b0_tram_dout               ,
  input              clk_w6_b0_tram                ,
  input              w7_b0_tram_cs                 ,
  input              w7_b0_tram_we                 ,
  input  [   7:   0] w7_b0_tram_addr               ,
  input  [  19:   0] w7_b0_tram_din                ,
  output [  19:   0] w7_b0_tram_dout               ,
  input              clk_w7_b0_tram                ,
  input              w8_b0_tram_cs                 ,
  input              w8_b0_tram_we                 ,
  input  [   7:   0] w8_b0_tram_addr               ,
  input  [  19:   0] w8_b0_tram_din                ,
  output [  19:   0] w8_b0_tram_dout               ,
  input              clk_w8_b0_tram                ,
  input              w9_b0_tram_cs                 ,
  input              w9_b0_tram_we                 ,
  input  [   7:   0] w9_b0_tram_addr               ,
  input  [  19:   0] w9_b0_tram_din                ,
  output [  19:   0] w9_b0_tram_dout               ,
  input              clk_w9_b0_tram                ,
  input              w10_b0_tram_cs                ,
  input              w10_b0_tram_we                ,
  input  [   7:   0] w10_b0_tram_addr              ,
  input  [  19:   0] w10_b0_tram_din               ,
  output [  19:   0] w10_b0_tram_dout              ,
  input              clk_w10_b0_tram               ,
  input              w11_b0_tram_cs                ,
  input              w11_b0_tram_we                ,
  input  [   7:   0] w11_b0_tram_addr              ,
  input  [  19:   0] w11_b0_tram_din               ,
  output [  19:   0] w11_b0_tram_dout              ,
  input              clk_w11_b0_tram               ,
  input              w12_b0_tram_cs                ,
  input              w12_b0_tram_we                ,
  input  [   7:   0] w12_b0_tram_addr              ,
  input  [  19:   0] w12_b0_tram_din               ,
  output [  19:   0] w12_b0_tram_dout              ,
  input              clk_w12_b0_tram               ,
  input              w13_b0_tram_cs                ,
  input              w13_b0_tram_we                ,
  input  [   7:   0] w13_b0_tram_addr              ,
  input  [  19:   0] w13_b0_tram_din               ,
  output [  19:   0] w13_b0_tram_dout              ,
  input              clk_w13_b0_tram               ,
  input              w14_b0_tram_cs                ,
  input              w14_b0_tram_we                ,
  input  [   7:   0] w14_b0_tram_addr              ,
  input  [  19:   0] w14_b0_tram_din               ,
  output [  19:   0] w14_b0_tram_dout              ,
  input              clk_w14_b0_tram               ,
  input              w15_b0_tram_cs                ,
  input              w15_b0_tram_we                ,
  input  [   7:   0] w15_b0_tram_addr              ,
  input  [  19:   0] w15_b0_tram_din               ,
  output [  19:   0] w15_b0_tram_dout              ,
  input              clk_w15_b0_tram               ,
  input              b0_aram_cs                    ,
  input              b0_aram_we                    ,
  input  [   7:   0] b0_aram_addr                  ,
  input  [  14:   0] b0_aram_din                   ,
  output [  14:   0] b0_aram_dout                  ,
  input              clk_b0_aram                   ,
  input              w0_b1_tram_cs                 ,
  input              w0_b1_tram_we                 ,
  input  [   7:   0] w0_b1_tram_addr               ,
  input  [  19:   0] w0_b1_tram_din                ,
  output [  19:   0] w0_b1_tram_dout               ,
  input              clk_w0_b1_tram                ,
  input              w1_b1_tram_cs                 ,
  input              w1_b1_tram_we                 ,
  input  [   7:   0] w1_b1_tram_addr               ,
  input  [  19:   0] w1_b1_tram_din                ,
  output [  19:   0] w1_b1_tram_dout               ,
  input              clk_w1_b1_tram                ,
  input              w2_b1_tram_cs                 ,
  input              w2_b1_tram_we                 ,
  input  [   7:   0] w2_b1_tram_addr               ,
  input  [  19:   0] w2_b1_tram_din                ,
  output [  19:   0] w2_b1_tram_dout               ,
  input              clk_w2_b1_tram                ,
  input              w3_b1_tram_cs                 ,
  input              w3_b1_tram_we                 ,
  input  [   7:   0] w3_b1_tram_addr               ,
  input  [  19:   0] w3_b1_tram_din                ,
  output [  19:   0] w3_b1_tram_dout               ,
  input              clk_w3_b1_tram                ,
  input              w4_b1_tram_cs                 ,
  input              w4_b1_tram_we                 ,
  input  [   7:   0] w4_b1_tram_addr               ,
  input  [  19:   0] w4_b1_tram_din                ,
  output [  19:   0] w4_b1_tram_dout               ,
  input              clk_w4_b1_tram                ,
  input              w5_b1_tram_cs                 ,
  input              w5_b1_tram_we                 ,
  input  [   7:   0] w5_b1_tram_addr               ,
  input  [  19:   0] w5_b1_tram_din                ,
  output [  19:   0] w5_b1_tram_dout               ,
  input              clk_w5_b1_tram                ,
  input              w6_b1_tram_cs                 ,
  input              w6_b1_tram_we                 ,
  input  [   7:   0] w6_b1_tram_addr               ,
  input  [  19:   0] w6_b1_tram_din                ,
  output [  19:   0] w6_b1_tram_dout               ,
  input              clk_w6_b1_tram                ,
  input              w7_b1_tram_cs                 ,
  input              w7_b1_tram_we                 ,
  input  [   7:   0] w7_b1_tram_addr               ,
  input  [  19:   0] w7_b1_tram_din                ,
  output [  19:   0] w7_b1_tram_dout               ,
  input              clk_w7_b1_tram                ,
  input              w8_b1_tram_cs                 ,
  input              w8_b1_tram_we                 ,
  input  [   7:   0] w8_b1_tram_addr               ,
  input  [  19:   0] w8_b1_tram_din                ,
  output [  19:   0] w8_b1_tram_dout               ,
  input              clk_w8_b1_tram                ,
  input              w9_b1_tram_cs                 ,
  input              w9_b1_tram_we                 ,
  input  [   7:   0] w9_b1_tram_addr               ,
  input  [  19:   0] w9_b1_tram_din                ,
  output [  19:   0] w9_b1_tram_dout               ,
  input              clk_w9_b1_tram                ,
  input              w10_b1_tram_cs                ,
  input              w10_b1_tram_we                ,
  input  [   7:   0] w10_b1_tram_addr              ,
  input  [  19:   0] w10_b1_tram_din               ,
  output [  19:   0] w10_b1_tram_dout              ,
  input              clk_w10_b1_tram               ,
  input              w11_b1_tram_cs                ,
  input              w11_b1_tram_we                ,
  input  [   7:   0] w11_b1_tram_addr              ,
  input  [  19:   0] w11_b1_tram_din               ,
  output [  19:   0] w11_b1_tram_dout              ,
  input              clk_w11_b1_tram               ,
  input              w12_b1_tram_cs                ,
  input              w12_b1_tram_we                ,
  input  [   7:   0] w12_b1_tram_addr              ,
  input  [  19:   0] w12_b1_tram_din               ,
  output [  19:   0] w12_b1_tram_dout              ,
  input              clk_w12_b1_tram               ,
  input              w13_b1_tram_cs                ,
  input              w13_b1_tram_we                ,
  input  [   7:   0] w13_b1_tram_addr              ,
  input  [  19:   0] w13_b1_tram_din               ,
  output [  19:   0] w13_b1_tram_dout              ,
  input              clk_w13_b1_tram               ,
  input              w14_b1_tram_cs                ,
  input              w14_b1_tram_we                ,
  input  [   7:   0] w14_b1_tram_addr              ,
  input  [  19:   0] w14_b1_tram_din               ,
  output [  19:   0] w14_b1_tram_dout              ,
  input              clk_w14_b1_tram               ,
  input              w15_b1_tram_cs                ,
  input              w15_b1_tram_we                ,
  input  [   7:   0] w15_b1_tram_addr              ,
  input  [  19:   0] w15_b1_tram_din               ,
  output [  19:   0] w15_b1_tram_dout              ,
  input              clk_w15_b1_tram               ,
  input              b1_aram_cs                    ,
  input              b1_aram_we                    ,
  input  [   7:   0] b1_aram_addr                  ,
  input  [  14:   0] b1_aram_din                   ,
  output [  14:   0] b1_aram_dout                  ,
  input              clk_b1_aram                   ,
  input              b0_ck0_dram_cs                ,
  input              b0_ck0_dram_we                ,
  input  [   7:   0] b0_ck0_dram_wem               ,
  input  [  11:   0] b0_ck0_dram_addr              ,
  input  [  63:   0] b0_ck0_dram_din               ,
  output [  63:   0] b0_ck0_dram_dout              ,
  input              clk_b0_ck0_dram               ,
  input              b0_ck1_dram_cs                ,
  input              b0_ck1_dram_we                ,
  input  [   7:   0] b0_ck1_dram_wem               ,
  input  [  11:   0] b0_ck1_dram_addr              ,
  input  [  63:   0] b0_ck1_dram_din               ,
  output [  63:   0] b0_ck1_dram_dout              ,
  input              clk_b0_ck1_dram               ,
  input              b0_ck2_dram_cs                ,
  input              b0_ck2_dram_we                ,
  input  [   7:   0] b0_ck2_dram_wem               ,
  input  [  11:   0] b0_ck2_dram_addr              ,
  input  [  63:   0] b0_ck2_dram_din               ,
  output [  63:   0] b0_ck2_dram_dout              ,
  input              clk_b0_ck2_dram               ,
  input              b0_ck3_dram_cs                ,
  input              b0_ck3_dram_we                ,
  input  [   7:   0] b0_ck3_dram_wem               ,
  input  [  11:   0] b0_ck3_dram_addr              ,
  input  [  63:   0] b0_ck3_dram_din               ,
  output [  63:   0] b0_ck3_dram_dout              ,
  input              clk_b0_ck3_dram               ,
  input              b0_ck4_dram_cs                ,
  input              b0_ck4_dram_we                ,
  input  [   7:   0] b0_ck4_dram_wem               ,
  input  [  11:   0] b0_ck4_dram_addr              ,
  input  [  63:   0] b0_ck4_dram_din               ,
  output [  63:   0] b0_ck4_dram_dout              ,
  input              clk_b0_ck4_dram               ,
  input              b0_ck5_dram_cs                ,
  input              b0_ck5_dram_we                ,
  input  [   7:   0] b0_ck5_dram_wem               ,
  input  [  11:   0] b0_ck5_dram_addr              ,
  input  [  63:   0] b0_ck5_dram_din               ,
  output [  63:   0] b0_ck5_dram_dout              ,
  input              clk_b0_ck5_dram               ,
  input              b0_ck6_dram_cs                ,
  input              b0_ck6_dram_we                ,
  input  [   7:   0] b0_ck6_dram_wem               ,
  input  [  11:   0] b0_ck6_dram_addr              ,
  input  [  63:   0] b0_ck6_dram_din               ,
  output [  63:   0] b0_ck6_dram_dout              ,
  input              clk_b0_ck6_dram               ,
  input              b0_ck7_dram_cs                ,
  input              b0_ck7_dram_we                ,
  input  [   7:   0] b0_ck7_dram_wem               ,
  input  [  11:   0] b0_ck7_dram_addr              ,
  input  [  63:   0] b0_ck7_dram_din               ,
  output [  63:   0] b0_ck7_dram_dout              ,
  input              clk_b0_ck7_dram               ,
  input              b1_ck0_dram_cs                ,
  input              b1_ck0_dram_we                ,
  input  [   7:   0] b1_ck0_dram_wem               ,
  input  [  11:   0] b1_ck0_dram_addr              ,
  input  [  63:   0] b1_ck0_dram_din               ,
  output [  63:   0] b1_ck0_dram_dout              ,
  input              clk_b1_ck0_dram               ,
  input              b1_ck1_dram_cs                ,
  input              b1_ck1_dram_we                ,
  input  [   7:   0] b1_ck1_dram_wem               ,
  input  [  11:   0] b1_ck1_dram_addr              ,
  input  [  63:   0] b1_ck1_dram_din               ,
  output [  63:   0] b1_ck1_dram_dout              ,
  input              clk_b1_ck1_dram               ,
  input              b1_ck2_dram_cs                ,
  input              b1_ck2_dram_we                ,
  input  [   7:   0] b1_ck2_dram_wem               ,
  input  [  11:   0] b1_ck2_dram_addr              ,
  input  [  63:   0] b1_ck2_dram_din               ,
  output [  63:   0] b1_ck2_dram_dout              ,
  input              clk_b1_ck2_dram               ,
  input              b1_ck3_dram_cs                ,
  input              b1_ck3_dram_we                ,
  input  [   7:   0] b1_ck3_dram_wem               ,
  input  [  11:   0] b1_ck3_dram_addr              ,
  input  [  63:   0] b1_ck3_dram_din               ,
  output [  63:   0] b1_ck3_dram_dout              ,
  input              clk_b1_ck3_dram               ,
  input              b1_ck4_dram_cs                ,
  input              b1_ck4_dram_we                ,
  input  [   7:   0] b1_ck4_dram_wem               ,
  input  [  11:   0] b1_ck4_dram_addr              ,
  input  [  63:   0] b1_ck4_dram_din               ,
  output [  63:   0] b1_ck4_dram_dout              ,
  input              clk_b1_ck4_dram               ,
  input              b1_ck5_dram_cs                ,
  input              b1_ck5_dram_we                ,
  input  [   7:   0] b1_ck5_dram_wem               ,
  input  [  11:   0] b1_ck5_dram_addr              ,
  input  [  63:   0] b1_ck5_dram_din               ,
  output [  63:   0] b1_ck5_dram_dout              ,
  input              clk_b1_ck5_dram               ,
  input              b1_ck6_dram_cs                ,
  input              b1_ck6_dram_we                ,
  input  [   7:   0] b1_ck6_dram_wem               ,
  input  [  11:   0] b1_ck6_dram_addr              ,
  input  [  63:   0] b1_ck6_dram_din               ,
  output [  63:   0] b1_ck6_dram_dout              ,
  input              clk_b1_ck6_dram               ,
  input              b1_ck7_dram_cs                ,
  input              b1_ck7_dram_we                ,
  input  [   7:   0] b1_ck7_dram_wem               ,
  input  [  11:   0] b1_ck7_dram_addr              ,
  input  [  63:   0] b1_ck7_dram_din               ,
  output [  63:   0] b1_ck7_dram_dout              ,
  input              clk_b1_ck7_dram               ,
  input              rst_n                         ,
  input              clkgate_bypass                
 );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core0_w0_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core0_w0_shw_tram_cs   ),
    .we   (core0_w0_shw_tram_we   ),
    .wem  (core0_w0_shw_tram_we    ),
    .addr (core0_w0_shw_tram_addr ),
    .din  (core0_w0_shw_tram_din  ),
    .dout (core0_w0_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core0_clk_w0_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core0_w1_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core0_w1_shw_tram_cs   ),
    .we   (core0_w1_shw_tram_we   ),
    .wem  (core0_w1_shw_tram_we    ),
    .addr (core0_w1_shw_tram_addr ),
    .din  (core0_w1_shw_tram_din  ),
    .dout (core0_w1_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core0_clk_w1_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core1_w0_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core1_w0_shw_tram_cs   ),
    .we   (core1_w0_shw_tram_we   ),
    .wem  (core1_w0_shw_tram_we    ),
    .addr (core1_w0_shw_tram_addr ),
    .din  (core1_w0_shw_tram_din  ),
    .dout (core1_w0_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core1_clk_w0_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core1_w1_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core1_w1_shw_tram_cs   ),
    .we   (core1_w1_shw_tram_we   ),
    .wem  (core1_w1_shw_tram_we    ),
    .addr (core1_w1_shw_tram_addr ),
    .din  (core1_w1_shw_tram_din  ),
    .dout (core1_w1_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core1_clk_w1_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core2_w0_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core2_w0_shw_tram_cs   ),
    .we   (core2_w0_shw_tram_we   ),
    .wem  (core2_w0_shw_tram_we    ),
    .addr (core2_w0_shw_tram_addr ),
    .din  (core2_w0_shw_tram_din  ),
    .dout (core2_w0_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core2_clk_w0_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core2_w1_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core2_w1_shw_tram_cs   ),
    .we   (core2_w1_shw_tram_we   ),
    .wem  (core2_w1_shw_tram_we    ),
    .addr (core2_w1_shw_tram_addr ),
    .din  (core2_w1_shw_tram_din  ),
    .dout (core2_w1_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core2_clk_w1_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core3_w0_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core3_w0_shw_tram_cs   ),
    .we   (core3_w0_shw_tram_we   ),
    .wem  (core3_w0_shw_tram_we    ),
    .addr (core3_w0_shw_tram_addr ),
    .din  (core3_w0_shw_tram_din  ),
    .dout (core3_w0_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core3_clk_w0_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(22),
    .MW(1),
    .AW(8) 
  )u_core3_w1_shw_tram_bus (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (core3_w1_shw_tram_cs   ),
    .we   (core3_w1_shw_tram_we   ),
    .wem  (core3_w1_shw_tram_we    ),
    .addr (core3_w1_shw_tram_addr ),
    .din  (core3_w1_shw_tram_din  ),
    .dout (core3_w1_shw_tram_dout ),
    .rst_n(rst_n),
    .clk  (core3_clk_w1_shw_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w0_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w0_b0_tram_cs   ),
    .we   (w0_b0_tram_we   ),
    .wem  (w0_b0_tram_we    ),
    .addr (w0_b0_tram_addr ),
    .din  (w0_b0_tram_din  ),
    .dout (w0_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w0_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w1_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w1_b0_tram_cs   ),
    .we   (w1_b0_tram_we   ),
    .wem  (w1_b0_tram_we    ),
    .addr (w1_b0_tram_addr ),
    .din  (w1_b0_tram_din  ),
    .dout (w1_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w1_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w2_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w2_b0_tram_cs   ),
    .we   (w2_b0_tram_we   ),
    .wem  (w2_b0_tram_we    ),
    .addr (w2_b0_tram_addr ),
    .din  (w2_b0_tram_din  ),
    .dout (w2_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w2_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w3_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w3_b0_tram_cs   ),
    .we   (w3_b0_tram_we   ),
    .wem  (w3_b0_tram_we    ),
    .addr (w3_b0_tram_addr ),
    .din  (w3_b0_tram_din  ),
    .dout (w3_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w3_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w4_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w4_b0_tram_cs   ),
    .we   (w4_b0_tram_we   ),
    .wem  (w4_b0_tram_we    ),
    .addr (w4_b0_tram_addr ),
    .din  (w4_b0_tram_din  ),
    .dout (w4_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w4_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w5_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w5_b0_tram_cs   ),
    .we   (w5_b0_tram_we   ),
    .wem  (w5_b0_tram_we    ),
    .addr (w5_b0_tram_addr ),
    .din  (w5_b0_tram_din  ),
    .dout (w5_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w5_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w6_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w6_b0_tram_cs   ),
    .we   (w6_b0_tram_we   ),
    .wem  (w6_b0_tram_we    ),
    .addr (w6_b0_tram_addr ),
    .din  (w6_b0_tram_din  ),
    .dout (w6_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w6_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w7_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w7_b0_tram_cs   ),
    .we   (w7_b0_tram_we   ),
    .wem  (w7_b0_tram_we    ),
    .addr (w7_b0_tram_addr ),
    .din  (w7_b0_tram_din  ),
    .dout (w7_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w7_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w8_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w8_b0_tram_cs   ),
    .we   (w8_b0_tram_we   ),
    .wem  (w8_b0_tram_we    ),
    .addr (w8_b0_tram_addr ),
    .din  (w8_b0_tram_din  ),
    .dout (w8_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w8_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w9_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w9_b0_tram_cs   ),
    .we   (w9_b0_tram_we   ),
    .wem  (w9_b0_tram_we    ),
    .addr (w9_b0_tram_addr ),
    .din  (w9_b0_tram_din  ),
    .dout (w9_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w9_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w10_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w10_b0_tram_cs   ),
    .we   (w10_b0_tram_we   ),
    .wem  (w10_b0_tram_we    ),
    .addr (w10_b0_tram_addr ),
    .din  (w10_b0_tram_din  ),
    .dout (w10_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w10_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w11_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w11_b0_tram_cs   ),
    .we   (w11_b0_tram_we   ),
    .wem  (w11_b0_tram_we    ),
    .addr (w11_b0_tram_addr ),
    .din  (w11_b0_tram_din  ),
    .dout (w11_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w11_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w12_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w12_b0_tram_cs   ),
    .we   (w12_b0_tram_we   ),
    .wem  (w12_b0_tram_we    ),
    .addr (w12_b0_tram_addr ),
    .din  (w12_b0_tram_din  ),
    .dout (w12_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w12_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w13_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w13_b0_tram_cs   ),
    .we   (w13_b0_tram_we   ),
    .wem  (w13_b0_tram_we    ),
    .addr (w13_b0_tram_addr ),
    .din  (w13_b0_tram_din  ),
    .dout (w13_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w13_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w14_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w14_b0_tram_cs   ),
    .we   (w14_b0_tram_we   ),
    .wem  (w14_b0_tram_we    ),
    .addr (w14_b0_tram_addr ),
    .din  (w14_b0_tram_din  ),
    .dout (w14_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w14_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w15_b0_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w15_b0_tram_cs   ),
    .we   (w15_b0_tram_we   ),
    .wem  (w15_b0_tram_we    ),
    .addr (w15_b0_tram_addr ),
    .din  (w15_b0_tram_din  ),
    .dout (w15_b0_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w15_b0_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(15),
    .MW(1),
    .AW(8) 
  )u_l2c_b0_aram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_aram_cs   ),
    .we   (b0_aram_we   ),
    .wem  (b0_aram_we    ),
    .addr (b0_aram_addr ),
    .din  (b0_aram_din  ),
    .dout (b0_aram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_aram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w0_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w0_b1_tram_cs   ),
    .we   (w0_b1_tram_we   ),
    .wem  (w0_b1_tram_we    ),
    .addr (w0_b1_tram_addr ),
    .din  (w0_b1_tram_din  ),
    .dout (w0_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w0_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w1_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w1_b1_tram_cs   ),
    .we   (w1_b1_tram_we   ),
    .wem  (w1_b1_tram_we    ),
    .addr (w1_b1_tram_addr ),
    .din  (w1_b1_tram_din  ),
    .dout (w1_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w1_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w2_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w2_b1_tram_cs   ),
    .we   (w2_b1_tram_we   ),
    .wem  (w2_b1_tram_we    ),
    .addr (w2_b1_tram_addr ),
    .din  (w2_b1_tram_din  ),
    .dout (w2_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w2_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w3_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w3_b1_tram_cs   ),
    .we   (w3_b1_tram_we   ),
    .wem  (w3_b1_tram_we    ),
    .addr (w3_b1_tram_addr ),
    .din  (w3_b1_tram_din  ),
    .dout (w3_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w3_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w4_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w4_b1_tram_cs   ),
    .we   (w4_b1_tram_we   ),
    .wem  (w4_b1_tram_we    ),
    .addr (w4_b1_tram_addr ),
    .din  (w4_b1_tram_din  ),
    .dout (w4_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w4_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w5_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w5_b1_tram_cs   ),
    .we   (w5_b1_tram_we   ),
    .wem  (w5_b1_tram_we    ),
    .addr (w5_b1_tram_addr ),
    .din  (w5_b1_tram_din  ),
    .dout (w5_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w5_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w6_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w6_b1_tram_cs   ),
    .we   (w6_b1_tram_we   ),
    .wem  (w6_b1_tram_we    ),
    .addr (w6_b1_tram_addr ),
    .din  (w6_b1_tram_din  ),
    .dout (w6_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w6_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w7_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w7_b1_tram_cs   ),
    .we   (w7_b1_tram_we   ),
    .wem  (w7_b1_tram_we    ),
    .addr (w7_b1_tram_addr ),
    .din  (w7_b1_tram_din  ),
    .dout (w7_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w7_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w8_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w8_b1_tram_cs   ),
    .we   (w8_b1_tram_we   ),
    .wem  (w8_b1_tram_we    ),
    .addr (w8_b1_tram_addr ),
    .din  (w8_b1_tram_din  ),
    .dout (w8_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w8_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w9_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w9_b1_tram_cs   ),
    .we   (w9_b1_tram_we   ),
    .wem  (w9_b1_tram_we    ),
    .addr (w9_b1_tram_addr ),
    .din  (w9_b1_tram_din  ),
    .dout (w9_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w9_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w10_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w10_b1_tram_cs   ),
    .we   (w10_b1_tram_we   ),
    .wem  (w10_b1_tram_we    ),
    .addr (w10_b1_tram_addr ),
    .din  (w10_b1_tram_din  ),
    .dout (w10_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w10_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w11_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w11_b1_tram_cs   ),
    .we   (w11_b1_tram_we   ),
    .wem  (w11_b1_tram_we    ),
    .addr (w11_b1_tram_addr ),
    .din  (w11_b1_tram_din  ),
    .dout (w11_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w11_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w12_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w12_b1_tram_cs   ),
    .we   (w12_b1_tram_we   ),
    .wem  (w12_b1_tram_we    ),
    .addr (w12_b1_tram_addr ),
    .din  (w12_b1_tram_din  ),
    .dout (w12_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w12_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w13_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w13_b1_tram_cs   ),
    .we   (w13_b1_tram_we   ),
    .wem  (w13_b1_tram_we    ),
    .addr (w13_b1_tram_addr ),
    .din  (w13_b1_tram_din  ),
    .dout (w13_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w13_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w14_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w14_b1_tram_cs   ),
    .we   (w14_b1_tram_we   ),
    .wem  (w14_b1_tram_we    ),
    .addr (w14_b1_tram_addr ),
    .din  (w14_b1_tram_din  ),
    .dout (w14_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w14_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(20),
    .MW(1),
    .AW(8) 
  )u_l2c_w15_b1_tram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (w15_b1_tram_cs   ),
    .we   (w15_b1_tram_we   ),
    .wem  (w15_b1_tram_we    ),
    .addr (w15_b1_tram_addr ),
    .din  (w15_b1_tram_din  ),
    .dout (w15_b1_tram_dout ),
    .rst_n(rst_n),
    .clk  (clk_w15_b1_tram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(256),
    .DW(15),
    .MW(1),
    .AW(8) 
  )u_l2c_b1_aram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_aram_cs   ),
    .we   (b1_aram_we   ),
    .wem  (b1_aram_we    ),
    .addr (b1_aram_addr ),
    .din  (b1_aram_din  ),
    .dout (b1_aram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_aram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck0_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck0_dram_cs   ),
    .we   (b0_ck0_dram_we   ),
    .wem  (b0_ck0_dram_wem   ),
    .addr (b0_ck0_dram_addr ),
    .din  (b0_ck0_dram_din  ),
    .dout (b0_ck0_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck0_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck1_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck1_dram_cs   ),
    .we   (b0_ck1_dram_we   ),
    .wem  (b0_ck1_dram_wem   ),
    .addr (b0_ck1_dram_addr ),
    .din  (b0_ck1_dram_din  ),
    .dout (b0_ck1_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck1_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck2_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck2_dram_cs   ),
    .we   (b0_ck2_dram_we   ),
    .wem  (b0_ck2_dram_wem   ),
    .addr (b0_ck2_dram_addr ),
    .din  (b0_ck2_dram_din  ),
    .dout (b0_ck2_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck2_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck3_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck3_dram_cs   ),
    .we   (b0_ck3_dram_we   ),
    .wem  (b0_ck3_dram_wem   ),
    .addr (b0_ck3_dram_addr ),
    .din  (b0_ck3_dram_din  ),
    .dout (b0_ck3_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck3_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck4_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck4_dram_cs   ),
    .we   (b0_ck4_dram_we   ),
    .wem  (b0_ck4_dram_wem   ),
    .addr (b0_ck4_dram_addr ),
    .din  (b0_ck4_dram_din  ),
    .dout (b0_ck4_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck4_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck5_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck5_dram_cs   ),
    .we   (b0_ck5_dram_we   ),
    .wem  (b0_ck5_dram_wem   ),
    .addr (b0_ck5_dram_addr ),
    .din  (b0_ck5_dram_din  ),
    .dout (b0_ck5_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck5_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck6_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck6_dram_cs   ),
    .we   (b0_ck6_dram_we   ),
    .wem  (b0_ck6_dram_wem   ),
    .addr (b0_ck6_dram_addr ),
    .din  (b0_ck6_dram_din  ),
    .dout (b0_ck6_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck6_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b0_ck7_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b0_ck7_dram_cs   ),
    .we   (b0_ck7_dram_we   ),
    .wem  (b0_ck7_dram_wem   ),
    .addr (b0_ck7_dram_addr ),
    .din  (b0_ck7_dram_din  ),
    .dout (b0_ck7_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b0_ck7_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck0_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck0_dram_cs   ),
    .we   (b1_ck0_dram_we   ),
    .wem  (b1_ck0_dram_wem   ),
    .addr (b1_ck0_dram_addr ),
    .din  (b1_ck0_dram_din  ),
    .dout (b1_ck0_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck0_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck1_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck1_dram_cs   ),
    .we   (b1_ck1_dram_we   ),
    .wem  (b1_ck1_dram_wem   ),
    .addr (b1_ck1_dram_addr ),
    .din  (b1_ck1_dram_din  ),
    .dout (b1_ck1_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck1_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck2_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck2_dram_cs   ),
    .we   (b1_ck2_dram_we   ),
    .wem  (b1_ck2_dram_wem   ),
    .addr (b1_ck2_dram_addr ),
    .din  (b1_ck2_dram_din  ),
    .dout (b1_ck2_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck2_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck3_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck3_dram_cs   ),
    .we   (b1_ck3_dram_we   ),
    .wem  (b1_ck3_dram_wem   ),
    .addr (b1_ck3_dram_addr ),
    .din  (b1_ck3_dram_din  ),
    .dout (b1_ck3_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck3_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck4_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck4_dram_cs   ),
    .we   (b1_ck4_dram_we   ),
    .wem  (b1_ck4_dram_wem   ),
    .addr (b1_ck4_dram_addr ),
    .din  (b1_ck4_dram_din  ),
    .dout (b1_ck4_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck4_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck5_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck5_dram_cs   ),
    .we   (b1_ck5_dram_we   ),
    .wem  (b1_ck5_dram_wem   ),
    .addr (b1_ck5_dram_addr ),
    .din  (b1_ck5_dram_din  ),
    .dout (b1_ck5_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck5_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck6_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck6_dram_cs   ),
    .we   (b1_ck6_dram_we   ),
    .wem  (b1_ck6_dram_wem   ),
    .addr (b1_ck6_dram_addr ),
    .din  (b1_ck6_dram_din  ),
    .dout (b1_ck6_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck6_dram  )
    );
  ux900_gnrl_ram 
  #(
    .FORCE_X2ZERO(0),
    .GATE_CLK(0),
    .DP(4096),
    .DW(64),
    .MW(8),
    .AW(12) 
  )u_l2c_b1_ck7_dram (
    .sd   (1'b0   ),
    .ds   (1'b0   ),
    .ls   (1'b0   ),
    .clkgate_bypass (clkgate_bypass),
    .cs   (b1_ck7_dram_cs   ),
    .we   (b1_ck7_dram_we   ),
    .wem  (b1_ck7_dram_wem   ),
    .addr (b1_ck7_dram_addr ),
    .din  (b1_ck7_dram_din  ),
    .dout (b1_ck7_dram_dout ),
    .rst_n(rst_n),
    .clk  (clk_b1_ck7_dram  )
    );
endmodule

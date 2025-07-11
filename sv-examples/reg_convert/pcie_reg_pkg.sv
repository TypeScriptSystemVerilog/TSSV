package pcie_reg_pkg;

// =============================================================================
// Generated Register Block 1.0
// Commit ID: 4b5fe2f1c2c38996f19271c3c4a85fca8bbc7b61
// =============================================================================

typedef struct packed {
  logic pipe_lane15_ropll_freq_mode;
  logic pipe_lane14_ropll_freq_mode;
  logic pipe_lane13_ropll_freq_mode;
  logic pipe_lane12_ropll_freq_mode;
  logic pipe_lane11_ropll_freq_mode;
  logic pipe_lane10_ropll_freq_mode;
  logic pipe_lane9_ropll_freq_mode;
  logic pipe_lane8_ropll_freq_mode;
  logic pipe_lane7_ropll_freq_mode;
  logic pipe_lane6_ropll_freq_mode;
  logic pipe_lane5_ropll_freq_mode;
  logic pipe_lane4_ropll_freq_mode;
  logic pipe_lane3_ropll_freq_mode;
  logic pipe_lane2_ropll_freq_mode;
  logic pipe_lane1_ropll_freq_mode;
  logic pipe_lane0_ropll_freq_mode;
  logic pipe_lane15_tx2rx_loopbk;
  logic pipe_lane14_tx2rx_loopbk;
  logic pipe_lane13_tx2rx_loopbk;
  logic pipe_lane12_tx2rx_loopbk;
  logic pipe_lane11_tx2rx_loopbk;
  logic pipe_lane10_tx2rx_loopbk;
  logic pipe_lane9_tx2rx_loopbk;
  logic pipe_lane8_tx2rx_loopbk;
  logic pipe_lane7_tx2rx_loopbk;
  logic pipe_lane6_tx2rx_loopbk;
  logic pipe_lane5_tx2rx_loopbk;
  logic pipe_lane4_tx2rx_loopbk;
  logic pipe_lane3_tx2rx_loopbk;
  logic pipe_lane2_tx2rx_loopbk;
  logic pipe_lane1_tx2rx_loopbk;
  logic pipe_lane0_tx2rx_loopbk;
} PCIEPHY_CTRL_0_t;

typedef struct packed {
  logic pipe_rx15_es_mode;
  logic pipe_rx14_es_mode;
  logic pipe_rx13_es_mode;
  logic pipe_rx12_es_mode;
  logic pipe_rx11_es_mode;
  logic pipe_rx10_es_mode;
  logic pipe_rx9_es_mode;
  logic pipe_rx8_es_mode;
  logic pipe_rx7_es_mode;
  logic pipe_rx6_es_mode;
  logic pipe_rx5_es_mode;
  logic pipe_rx4_es_mode;
  logic pipe_rx3_es_mode;
  logic pipe_rx2_es_mode;
  logic pipe_rx1_es_mode;
  logic pipe_rx0_es_mode;
  logic pipe_rx15_termination;
  logic pipe_rx14_termination;
  logic pipe_rx13_termination;
  logic pipe_rx12_termination;
  logic pipe_rx11_termination;
  logic pipe_rx10_termination;
  logic pipe_rx9_termination;
  logic pipe_rx8_termination;
  logic pipe_rx7_termination;
  logic pipe_rx6_termination;
  logic pipe_rx5_termination;
  logic pipe_rx4_termination;
  logic pipe_rx3_termination;
  logic pipe_rx2_termination;
  logic pipe_rx1_termination;
  logic pipe_rx0_termination;
} PCIEPHY_CTRL_1_t;

typedef struct packed {
  logic [1: 0] pipe_lane15_databuswidth;
  logic [1: 0] pipe_lane14_databuswidth;
  logic [1: 0] pipe_lane13_databuswidth;
  logic [1: 0] pipe_lane12_databuswidth;
  logic [1: 0] pipe_lane11_databuswidth;
  logic [1: 0] pipe_lane10_databuswidth;
  logic [1: 0] pipe_lane9_databuswidth;
  logic [1: 0] pipe_lane8_databuswidth;
  logic [1: 0] pipe_lane7_databuswidth;
  logic [1: 0] pipe_lane6_databuswidth;
  logic [1: 0] pipe_lane5_databuswidth;
  logic [1: 0] pipe_lane4_databuswidth;
  logic [1: 0] pipe_lane3_databuswidth;
  logic [1: 0] pipe_lane2_databuswidth;
  logic [1: 0] pipe_lane1_databuswidth;
  logic [1: 0] pipe_lane0_databuswidth;
} PCIEPHY_CTRL_2_t;

typedef struct packed {
  logic [5:0] res_0;
  logic pipe_lane_cmn_refclk_mode;
  logic [4: 0] max_pclk_div_ratio_g5;
  logic [4: 0] max_pclk_div_ratio_g4;
  logic [4: 0] max_pclk_div_ratio_g3;
  logic [4: 0] max_pclk_div_ratio_g2;
  logic [4: 0] max_pclk_div_ratio_g1;
} PCIEPHY_CTRL_3_t;

typedef struct packed {
  logic [3: 0] phy0_fw_clk_range;
  logic [0:0] res_6;
  logic phy0_refb_clkdet_en;
  logic [1: 0] phy0_refb_clk_sel;
  logic [0:0] res_5;
  logic phy0_refa_clkdet_en;
  logic [1: 0] phy0_refa_clk_sel;
  logic [1: 0] phy0_ref_repeat_clk_sel;
  logic phy0_ref_repeat_clk_en;
  logic phy0_refb_lane_clk_en;
  logic phy0_refa_lane_clk_en;
  logic phy0_mpllb_word_clk_en;
  logic [0:0] res_4;
  logic phy0_mpllb_ssc_en;
  logic phy0_mpllb_short_lock_en;
  logic phy0_mpllb_force_en;
  logic [0:0] res_3;
  logic phy0_mplla_word_clk_en;
  logic [0:0] res_2;
  logic phy0_mplla_ssc_en;
  logic phy0_mplla_short_lock_en;
  logic phy0_mplla_force_en;
  logic [0:0] res_1;
  logic phy0_cr_para_sel;
  logic [0:0] res_0;
  logic reserved;
} PCIEPHY_CTRL_4_t;

typedef struct packed {
  logic phy0_refb_raw_clk_div2_en;
  logic phy0_refb_clk_div2_en;
  logic phy0_refa_raw_clk_div2_en;
  logic phy0_refa_clk_div2_en;
  logic reserved;
  logic phy0_sram_ext_ld_done;
  logic phy0_sram_ecc_en;
  logic phy0_sram_bypass;
  logic phy0_sram_bootload_bypass;
  logic [8: 0] phy0_txup_term_offset;
  logic [8: 0] phy0_txdn_term_offset;
  logic [4: 0] phy0_rx_term_offset;
} PCIEPHY_CTRL_5_t;

typedef struct packed {
  logic [0:0] res_0;
  logic [23: 0] phy0_sup_misc;
  logic [3: 0] phy0_refb_range;
  logic [3: 0] phy0_refa_range;
} PCIEPHY_CTRL_6_t;

typedef struct packed {
  logic [3: 0] phy1_fw_clk_range;
  logic [0:0] res_6;
  logic phy1_refb_clkdet_en;
  logic [1: 0] phy1_refb_clk_sel;
  logic [0:0] res_5;
  logic phy1_refa_clkdet_en;
  logic [1: 0] phy1_refa_clk_sel;
  logic [1: 0] phy1_ref_repeat_clk_sel;
  logic phy1_ref_repeat_clk_en;
  logic phy1_refb_lane_clk_en;
  logic phy1_refa_lane_clk_en;
  logic phy1_mpllb_word_clk_en;
  logic [0:0] res_4;
  logic phy1_mpllb_ssc_en;
  logic phy1_mpllb_short_lock_en;
  logic phy1_mpllb_force_en;
  logic [0:0] res_3;
  logic phy1_mplla_word_clk_en;
  logic [0:0] res_2;
  logic phy1_mplla_ssc_en;
  logic phy1_mplla_short_lock_en;
  logic phy1_mplla_force_en;
  logic [0:0] res_1;
  logic phy1_cr_para_sel;
  logic [0:0] res_0;
  logic reserved;
} PCIEPHY_CTRL_7_t;

typedef struct packed {
  logic phy1_refb_raw_clk_div2_en;
  logic phy1_refb_clk_div2_en;
  logic phy1_refa_raw_clk_div2_en;
  logic phy1_refa_clk_div2_en;
  logic reserved;
  logic phy1_sram_ext_ld_done;
  logic phy1_sram_ecc_en;
  logic phy1_sram_bypass;
  logic phy1_sram_bootload_bypass;
  logic [8: 0] phy1_txup_term_offset;
  logic [8: 0] phy1_txdn_term_offset;
  logic [4: 0] phy1_rx_term_offset;
} PCIEPHY_CTRL_8_t;

typedef struct packed {
  logic [0:0] res_0;
  logic [23: 0] phy1_sup_misc;
  logic [3: 0] phy1_refb_range;
  logic [3: 0] phy1_refa_range;
} PCIEPHY_CTRL_9_t;

typedef struct packed {
  logic [3: 0] phy2_fw_clk_range;
  logic [0:0] res_6;
  logic phy2_refb_clkdet_en;
  logic [1: 0] phy2_refb_clk_sel;
  logic [0:0] res_5;
  logic phy2_refa_clkdet_en;
  logic [1: 0] phy2_refa_clk_sel;
  logic [1: 0] phy2_ref_repeat_clk_sel;
  logic phy2_ref_repeat_clk_en;
  logic phy2_refb_lane_clk_en;
  logic phy2_refa_lane_clk_en;
  logic phy2_mpllb_word_clk_en;
  logic [0:0] res_4;
  logic phy2_mpllb_ssc_en;
  logic phy2_mpllb_short_lock_en;
  logic phy2_mpllb_force_en;
  logic [0:0] res_3;
  logic phy2_mplla_word_clk_en;
  logic [0:0] res_2;
  logic phy2_mplla_ssc_en;
  logic phy2_mplla_short_lock_en;
  logic phy2_mplla_force_en;
  logic [0:0] res_1;
  logic phy2_cr_para_sel;
  logic [0:0] res_0;
  logic reserved;
} PCIEPHY_CTRL_10_t;

typedef struct packed {
  logic phy2_refb_raw_clk_div2_en;
  logic phy2_refb_clk_div2_en;
  logic phy2_refa_raw_clk_div2_en;
  logic phy2_refa_clk_div2_en;
  logic reserved;
  logic phy2_sram_ext_ld_done;
  logic phy2_sram_ecc_en;
  logic phy2_sram_bypass;
  logic phy2_sram_bootload_bypass;
  logic [8: 0] phy2_txup_term_offset;
  logic [8: 0] phy2_txdn_term_offset;
  logic [4: 0] phy2_rx_term_offset;
} PCIEPHY_CTRL_11_t;

typedef struct packed {
  logic [0:0] res_0;
  logic [23: 0] phy2_sup_misc;
  logic [3: 0] phy2_refb_range;
  logic [3: 0] phy2_refa_range;
} PCIEPHY_CTRL_12_t;

typedef struct packed {
  logic [3: 0] phy3_fw_clk_range;
  logic [0:0] res_6;
  logic phy3_refb_clkdet_en;
  logic [1: 0] phy3_refb_clk_sel;
  logic [0:0] res_5;
  logic phy3_refa_clkdet_en;
  logic [1: 0] phy3_refa_clk_sel;
  logic [1: 0] phy3_ref_repeat_clk_sel;
  logic phy3_ref_repeat_clk_en;
  logic phy3_refb_lane_clk_en;
  logic phy3_refa_lane_clk_en;
  logic phy3_mpllb_word_clk_en;
  logic [0:0] res_4;
  logic phy3_mpllb_ssc_en;
  logic phy3_mpllb_short_lock_en;
  logic phy3_mpllb_force_en;
  logic [0:0] res_3;
  logic phy3_mplla_word_clk_en;
  logic [0:0] res_2;
  logic phy3_mplla_ssc_en;
  logic phy3_mplla_short_lock_en;
  logic phy3_mplla_force_en;
  logic [0:0] res_1;
  logic phy3_cr_para_sel;
  logic [0:0] res_0;
  logic reserved;
} PCIEPHY_CTRL_13_t;

typedef struct packed {
  logic phy3_refb_raw_clk_div2_en;
  logic phy3_refb_clk_div2_en;
  logic phy3_refa_raw_clk_div2_en;
  logic phy3_refa_clk_div2_en;
  logic reserved;
  logic phy3_sram_ext_ld_done;
  logic phy3_sram_ecc_en;
  logic phy3_sram_bypass;
  logic phy3_sram_bootload_bypass;
  logic [8: 0] phy3_txup_term_offset;
  logic [8: 0] phy3_txdn_term_offset;
  logic [4: 0] phy3_rx_term_offset;
} PCIEPHY_CTRL_14_t;

typedef struct packed {
  logic [0:0] res_0;
  logic [23: 0] phy3_sup_misc;
  logic [3: 0] phy3_refb_range;
  logic [3: 0] phy3_refa_range;
} PCIEPHY_CTRL_15_t;

typedef struct packed {
  logic [1:0] res_0;
  logic phy_lane5_rx2tx_par_lb_en;
  logic phy_lane5_refb_clk_en;
  logic phy_lane5_refa_clk_en;
  logic phy_lane5_ref_sel;
  logic phy_lane5_cntx_en;
  logic phy_lane4_rx2tx_par_lb_en;
  logic phy_lane4_refb_clk_en;
  logic phy_lane4_refa_clk_en;
  logic phy_lane4_ref_sel;
  logic phy_lane4_cntx_en;
  logic phy_lane3_rx2tx_par_lb_en;
  logic phy_lane3_refb_clk_en;
  logic phy_lane3_refa_clk_en;
  logic phy_lane3_ref_sel;
  logic phy_lane3_cntx_en;
  logic phy_lane2_rx2tx_par_lb_en;
  logic phy_lane2_refb_clk_en;
  logic phy_lane2_refa_clk_en;
  logic phy_lane2_ref_sel;
  logic phy_lane2_cntx_en;
  logic phy_lane1_rx2tx_par_lb_en;
  logic phy_lane1_refb_clk_en;
  logic phy_lane1_refa_clk_en;
  logic phy_lane1_ref_sel;
  logic phy_lane1_cntx_en;
  logic phy_lane0_rx2tx_par_lb_en;
  logic phy_lane0_refb_clk_en;
  logic phy_lane0_refa_clk_en;
  logic phy_lane0_ref_sel;
  logic phy_lane0_cntx_en;
} PCIEPHY_CTRL_16_t;

typedef struct packed {
  logic [1:0] res_0;
  logic phy_lane11_rx2tx_par_lb_en;
  logic phy_lane11_refb_clk_en;
  logic phy_lane11_refa_clk_en;
  logic phy_lane11_ref_sel;
  logic phy_lane11_cntx_en;
  logic phy_lane10_rx2tx_par_lb_en;
  logic phy_lane10_refb_clk_en;
  logic phy_lane10_refa_clk_en;
  logic phy_lane10_ref_sel;
  logic phy_lane10_cntx_en;
  logic phy_lane9_rx2tx_par_lb_en;
  logic phy_lane9_refb_clk_en;
  logic phy_lane9_refa_clk_en;
  logic phy_lane9_ref_sel;
  logic phy_lane9_cntx_en;
  logic phy_lane8_rx2tx_par_lb_en;
  logic phy_lane8_refb_clk_en;
  logic phy_lane8_refa_clk_en;
  logic phy_lane8_ref_sel;
  logic phy_lane8_cntx_en;
  logic phy_lane7_rx2tx_par_lb_en;
  logic phy_lane7_refb_clk_en;
  logic phy_lane7_refa_clk_en;
  logic phy_lane7_ref_sel;
  logic phy_lane7_cntx_en;
  logic phy_lane6_rx2tx_par_lb_en;
  logic phy_lane6_refb_clk_en;
  logic phy_lane6_refa_clk_en;
  logic phy_lane6_ref_sel;
  logic phy_lane6_cntx_en;
} PCIEPHY_CTRL_17_t;

typedef struct packed {
  logic [3:0] res_0;
  logic [3: 0] phy_tx_protocol_family_id;
  logic [3: 0] phy_rx_protocol_family_id;
  logic phy_lane15_rx2tx_par_lb_en;
  logic phy_lane15_refb_clk_en;
  logic phy_lane15_refa_clk_en;
  logic phy_lane15_ref_sel;
  logic phy_lane15_cntx_en;
  logic phy_lane14_rx2tx_par_lb_en;
  logic phy_lane14_refb_clk_en;
  logic phy_lane14_refa_clk_en;
  logic phy_lane14_ref_sel;
  logic phy_lane14_cntx_en;
  logic phy_lane13_rx2tx_par_lb_en;
  logic phy_lane13_refb_clk_en;
  logic phy_lane13_refa_clk_en;
  logic phy_lane13_ref_sel;
  logic phy_lane13_cntx_en;
  logic phy_lane12_rx2tx_par_lb_en;
  logic phy_lane12_refb_clk_en;
  logic phy_lane12_refa_clk_en;
  logic phy_lane12_ref_sel;
  logic phy_lane12_cntx_en;
} PCIEPHY_CTRL_18_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx0_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_19_t;

typedef struct packed {
  logic [7: 0] phy_rx0_cntx_sel_g5;
  logic [7: 0] phy_rx0_cntx_sel_g4;
  logic [7: 0] phy_rx0_cntx_sel_g3;
  logic [7: 0] phy_rx0_cntx_sel_g2;
} PCIEPHY_CTRL_20_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx1_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_21_t;

typedef struct packed {
  logic [7: 0] phy_rx1_cntx_sel_g5;
  logic [7: 0] phy_rx1_cntx_sel_g4;
  logic [7: 0] phy_rx1_cntx_sel_g3;
  logic [7: 0] phy_rx1_cntx_sel_g2;
} PCIEPHY_CTRL_22_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx2_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_23_t;

typedef struct packed {
  logic [7: 0] phy_rx2_cntx_sel_g5;
  logic [7: 0] phy_rx2_cntx_sel_g4;
  logic [7: 0] phy_rx2_cntx_sel_g3;
  logic [7: 0] phy_rx2_cntx_sel_g2;
} PCIEPHY_CTRL_24_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx3_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_25_t;

typedef struct packed {
  logic [7: 0] phy_rx3_cntx_sel_g5;
  logic [7: 0] phy_rx3_cntx_sel_g4;
  logic [7: 0] phy_rx3_cntx_sel_g3;
  logic [7: 0] phy_rx3_cntx_sel_g2;
} PCIEPHY_CTRL_26_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx4_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_27_t;

typedef struct packed {
  logic [7: 0] phy_rx4_cntx_sel_g5;
  logic [7: 0] phy_rx4_cntx_sel_g4;
  logic [7: 0] phy_rx4_cntx_sel_g3;
  logic [7: 0] phy_rx4_cntx_sel_g2;
} PCIEPHY_CTRL_28_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx5_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_29_t;

typedef struct packed {
  logic [7: 0] phy_rx5_cntx_sel_g5;
  logic [7: 0] phy_rx5_cntx_sel_g4;
  logic [7: 0] phy_rx5_cntx_sel_g3;
  logic [7: 0] phy_rx5_cntx_sel_g2;
} PCIEPHY_CTRL_30_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx6_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_31_t;

typedef struct packed {
  logic [7: 0] phy_rx6_cntx_sel_g5;
  logic [7: 0] phy_rx6_cntx_sel_g4;
  logic [7: 0] phy_rx6_cntx_sel_g3;
  logic [7: 0] phy_rx6_cntx_sel_g2;
} PCIEPHY_CTRL_32_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx7_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_33_t;

typedef struct packed {
  logic [7: 0] phy_rx7_cntx_sel_g5;
  logic [7: 0] phy_rx7_cntx_sel_g4;
  logic [7: 0] phy_rx7_cntx_sel_g3;
  logic [7: 0] phy_rx7_cntx_sel_g2;
} PCIEPHY_CTRL_34_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx8_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_35_t;

typedef struct packed {
  logic [7: 0] phy_rx8_cntx_sel_g5;
  logic [7: 0] phy_rx8_cntx_sel_g4;
  logic [7: 0] phy_rx8_cntx_sel_g3;
  logic [7: 0] phy_rx8_cntx_sel_g2;
} PCIEPHY_CTRL_36_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx9_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_37_t;

typedef struct packed {
  logic [7: 0] phy_rx9_cntx_sel_g5;
  logic [7: 0] phy_rx9_cntx_sel_g4;
  logic [7: 0] phy_rx9_cntx_sel_g3;
  logic [7: 0] phy_rx9_cntx_sel_g2;
} PCIEPHY_CTRL_38_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx10_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_39_t;

typedef struct packed {
  logic [7: 0] phy_rx10_cntx_sel_g5;
  logic [7: 0] phy_rx10_cntx_sel_g4;
  logic [7: 0] phy_rx10_cntx_sel_g3;
  logic [7: 0] phy_rx10_cntx_sel_g2;
} PCIEPHY_CTRL_40_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx11_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_41_t;

typedef struct packed {
  logic [7: 0] phy_rx11_cntx_sel_g5;
  logic [7: 0] phy_rx11_cntx_sel_g4;
  logic [7: 0] phy_rx11_cntx_sel_g3;
  logic [7: 0] phy_rx11_cntx_sel_g2;
} PCIEPHY_CTRL_42_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx12_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_43_t;

typedef struct packed {
  logic [7: 0] phy_rx12_cntx_sel_g5;
  logic [7: 0] phy_rx12_cntx_sel_g4;
  logic [7: 0] phy_rx12_cntx_sel_g3;
  logic [7: 0] phy_rx12_cntx_sel_g2;
} PCIEPHY_CTRL_44_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx13_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_45_t;

typedef struct packed {
  logic [7: 0] phy_rx13_cntx_sel_g5;
  logic [7: 0] phy_rx13_cntx_sel_g4;
  logic [7: 0] phy_rx13_cntx_sel_g3;
  logic [7: 0] phy_rx13_cntx_sel_g2;
} PCIEPHY_CTRL_46_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx14_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_47_t;

typedef struct packed {
  logic [7: 0] phy_rx14_cntx_sel_g5;
  logic [7: 0] phy_rx14_cntx_sel_g4;
  logic [7: 0] phy_rx14_cntx_sel_g3;
  logic [7: 0] phy_rx14_cntx_sel_g2;
} PCIEPHY_CTRL_48_t;

typedef struct packed {
  logic [17:0] res_0;
  logic [7: 0] phy_rx15_cntx_sel_g1;
  logic [5: 0] reserved;
} PCIEPHY_CTRL_49_t;

typedef struct packed {
  logic [7: 0] phy_rx15_cntx_sel_g5;
  logic [7: 0] phy_rx15_cntx_sel_g4;
  logic [7: 0] phy_rx15_cntx_sel_g3;
  logic [7: 0] phy_rx15_cntx_sel_g2;
} PCIEPHY_CTRL_50_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn0_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn0_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn0_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn0_cntx_sel_g1;
} PCIEPHY_CTRL_51_t;

typedef struct packed {
  logic [7: 0] phy_tx0_cntx_sel_g4;
  logic [7: 0] phy_tx0_cntx_sel_g3;
  logic [7: 0] phy_tx0_cntx_sel_g2;
  logic [7: 0] phy_tx0_cntx_sel_g1;
} PCIEPHY_CTRL_52_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn1_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn1_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn1_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn1_cntx_sel_g1;
} PCIEPHY_CTRL_53_t;

typedef struct packed {
  logic [7: 0] phy_tx1_cntx_sel_g4;
  logic [7: 0] phy_tx1_cntx_sel_g3;
  logic [7: 0] phy_tx1_cntx_sel_g2;
  logic [7: 0] phy_tx1_cntx_sel_g1;
} PCIEPHY_CTRL_54_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn2_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn2_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn2_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn2_cntx_sel_g1;
} PCIEPHY_CTRL_55_t;

typedef struct packed {
  logic [7: 0] phy_tx2_cntx_sel_g4;
  logic [7: 0] phy_tx2_cntx_sel_g3;
  logic [7: 0] phy_tx2_cntx_sel_g2;
  logic [7: 0] phy_tx2_cntx_sel_g1;
} PCIEPHY_CTRL_56_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn3_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn3_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn3_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn3_cntx_sel_g1;
} PCIEPHY_CTRL_57_t;

typedef struct packed {
  logic [7: 0] phy_tx3_cntx_sel_g4;
  logic [7: 0] phy_tx3_cntx_sel_g3;
  logic [7: 0] phy_tx3_cntx_sel_g2;
  logic [7: 0] phy_tx3_cntx_sel_g1;
} PCIEPHY_CTRL_58_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn4_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn4_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn4_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn4_cntx_sel_g1;
} PCIEPHY_CTRL_59_t;

typedef struct packed {
  logic [7: 0] phy_tx4_cntx_sel_g4;
  logic [7: 0] phy_tx4_cntx_sel_g3;
  logic [7: 0] phy_tx4_cntx_sel_g2;
  logic [7: 0] phy_tx4_cntx_sel_g1;
} PCIEPHY_CTRL_60_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn5_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn5_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn5_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn5_cntx_sel_g1;
} PCIEPHY_CTRL_61_t;

typedef struct packed {
  logic [7: 0] phy_tx5_cntx_sel_g4;
  logic [7: 0] phy_tx5_cntx_sel_g3;
  logic [7: 0] phy_tx5_cntx_sel_g2;
  logic [7: 0] phy_tx5_cntx_sel_g1;
} PCIEPHY_CTRL_62_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn6_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn6_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn6_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn6_cntx_sel_g1;
} PCIEPHY_CTRL_63_t;

typedef struct packed {
  logic [7: 0] phy_tx6_cntx_sel_g4;
  logic [7: 0] phy_tx6_cntx_sel_g3;
  logic [7: 0] phy_tx6_cntx_sel_g2;
  logic [7: 0] phy_tx6_cntx_sel_g1;
} PCIEPHY_CTRL_64_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn7_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn7_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn7_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn7_cntx_sel_g1;
} PCIEPHY_CTRL_65_t;

typedef struct packed {
  logic [7: 0] phy_tx7_cntx_sel_g4;
  logic [7: 0] phy_tx7_cntx_sel_g3;
  logic [7: 0] phy_tx7_cntx_sel_g2;
  logic [7: 0] phy_tx7_cntx_sel_g1;
} PCIEPHY_CTRL_66_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn8_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn8_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn8_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn8_cntx_sel_g1;
} PCIEPHY_CTRL_67_t;

typedef struct packed {
  logic [7: 0] phy_tx8_cntx_sel_g4;
  logic [7: 0] phy_tx8_cntx_sel_g3;
  logic [7: 0] phy_tx8_cntx_sel_g2;
  logic [7: 0] phy_tx8_cntx_sel_g1;
} PCIEPHY_CTRL_68_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn9_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn9_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn9_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn9_cntx_sel_g1;
} PCIEPHY_CTRL_69_t;

typedef struct packed {
  logic [7: 0] phy_tx9_cntx_sel_g4;
  logic [7: 0] phy_tx9_cntx_sel_g3;
  logic [7: 0] phy_tx9_cntx_sel_g2;
  logic [7: 0] phy_tx9_cntx_sel_g1;
} PCIEPHY_CTRL_70_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn10_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn10_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn10_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn10_cntx_sel_g1;
} PCIEPHY_CTRL_71_t;

typedef struct packed {
  logic [7: 0] phy_tx10_cntx_sel_g4;
  logic [7: 0] phy_tx10_cntx_sel_g3;
  logic [7: 0] phy_tx10_cntx_sel_g2;
  logic [7: 0] phy_tx10_cntx_sel_g1;
} PCIEPHY_CTRL_72_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn11_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn11_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn11_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn11_cntx_sel_g1;
} PCIEPHY_CTRL_73_t;

typedef struct packed {
  logic [7: 0] phy_tx11_cntx_sel_g4;
  logic [7: 0] phy_tx11_cntx_sel_g3;
  logic [7: 0] phy_tx11_cntx_sel_g2;
  logic [7: 0] phy_tx11_cntx_sel_g1;
} PCIEPHY_CTRL_74_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn12_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn12_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn12_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn12_cntx_sel_g1;
} PCIEPHY_CTRL_75_t;

typedef struct packed {
  logic [7: 0] phy_tx12_cntx_sel_g4;
  logic [7: 0] phy_tx12_cntx_sel_g3;
  logic [7: 0] phy_tx12_cntx_sel_g2;
  logic [7: 0] phy_tx12_cntx_sel_g1;
} PCIEPHY_CTRL_76_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn13_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn13_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn13_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn13_cntx_sel_g1;
} PCIEPHY_CTRL_77_t;

typedef struct packed {
  logic [7: 0] phy_tx13_cntx_sel_g4;
  logic [7: 0] phy_tx13_cntx_sel_g3;
  logic [7: 0] phy_tx13_cntx_sel_g2;
  logic [7: 0] phy_tx13_cntx_sel_g1;
} PCIEPHY_CTRL_78_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn14_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn14_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn14_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn14_cntx_sel_g1;
} PCIEPHY_CTRL_79_t;

typedef struct packed {
  logic [7: 0] phy_tx14_cntx_sel_g4;
  logic [7: 0] phy_tx14_cntx_sel_g3;
  logic [7: 0] phy_tx14_cntx_sel_g2;
  logic [7: 0] phy_tx14_cntx_sel_g1;
} PCIEPHY_CTRL_80_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn15_cntx_sel_g4;
  logic [7: 0] phy_tx_cmn15_cntx_sel_g3;
  logic [7: 0] phy_tx_cmn15_cntx_sel_g2;
  logic [7: 0] phy_tx_cmn15_cntx_sel_g1;
} PCIEPHY_CTRL_81_t;

typedef struct packed {
  logic [7: 0] phy_tx15_cntx_sel_g4;
  logic [7: 0] phy_tx15_cntx_sel_g3;
  logic [7: 0] phy_tx15_cntx_sel_g2;
  logic [7: 0] phy_tx15_cntx_sel_g1;
} PCIEPHY_CTRL_82_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn3_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn2_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn1_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn0_cntx_sel_g5;
} PCIEPHY_CTRL_83_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn7_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn6_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn5_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn4_cntx_sel_g5;
} PCIEPHY_CTRL_84_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn11_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn10_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn9_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn8_cntx_sel_g5;
} PCIEPHY_CTRL_85_t;

typedef struct packed {
  logic [7: 0] phy_tx_cmn15_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn14_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn13_cntx_sel_g5;
  logic [7: 0] phy_tx_cmn12_cntx_sel_g5;
} PCIEPHY_CTRL_86_t;

typedef struct packed {
  logic [7: 0] phy_tx3_cntx_sel_g5;
  logic [7: 0] phy_tx2_cntx_sel_g5;
  logic [7: 0] phy_tx1_cntx_sel_g5;
  logic [7: 0] phy_tx0_cntx_sel_g5;
} PCIEPHY_CTRL_87_t;

typedef struct packed {
  logic [7: 0] phy_tx7_cntx_sel_g5;
  logic [7: 0] phy_tx6_cntx_sel_g5;
  logic [7: 0] phy_tx5_cntx_sel_g5;
  logic [7: 0] phy_tx4_cntx_sel_g5;
} PCIEPHY_CTRL_88_t;

typedef struct packed {
  logic [7: 0] phy_tx11_cntx_sel_g5;
  logic [7: 0] phy_tx10_cntx_sel_g5;
  logic [7: 0] phy_tx9_cntx_sel_g5;
  logic [7: 0] phy_tx8_cntx_sel_g5;
} PCIEPHY_CTRL_89_t;

typedef struct packed {
  logic [7: 0] phy_tx15_cntx_sel_g5;
  logic [7: 0] phy_tx14_cntx_sel_g5;
  logic [7: 0] phy_tx13_cntx_sel_g5;
  logic [7: 0] phy_tx12_cntx_sel_g5;
} PCIEPHY_CTRL_90_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] upcs_pipe_config;
} PCIEPHY_CTRL_91_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane1_destruct_rxmargin_mode;
  logic pipe_lane1_ext_pll_mode;
  logic [3: 0] pipe_lane1_lanepll_src_sel;
  logic [4: 0] pipe_lane1_lanepll_bypass_mode;
  logic pipe_lane1_cascaded_mpllb_sel;
  logic pipe_lane0_destruct_rxmargin_mode;
  logic pipe_lane0_ext_pll_mode;
  logic [3: 0] pipe_lane0_lanepll_src_sel;
  logic [4: 0] pipe_lane0_lanepll_bypass_mode;
  logic pipe_lane0_cascaded_mpllb_sel;
} PCIEPHY_CTRL_92_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane3_destruct_rxmargin_mode;
  logic pipe_lane3_ext_pll_mode;
  logic [3: 0] pipe_lane3_lanepll_src_sel;
  logic [4: 0] pipe_lane3_lanepll_bypass_mode;
  logic pipe_lane3_cascaded_mpllb_sel;
  logic pipe_lane2_destruct_rxmargin_mode;
  logic pipe_lane2_ext_pll_mode;
  logic [3: 0] pipe_lane2_lanepll_src_sel;
  logic [4: 0] pipe_lane2_lanepll_bypass_mode;
  logic pipe_lane2_cascaded_mpllb_sel;
} PCIEPHY_CTRL_93_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane5_destruct_rxmargin_mode;
  logic pipe_lane5_ext_pll_mode;
  logic [3: 0] pipe_lane5_lanepll_src_sel;
  logic [4: 0] pipe_lane5_lanepll_bypass_mode;
  logic pipe_lane5_cascaded_mpllb_sel;
  logic pipe_lane4_destruct_rxmargin_mode;
  logic pipe_lane4_ext_pll_mode;
  logic [3: 0] pipe_lane4_lanepll_src_sel;
  logic [4: 0] pipe_lane4_lanepll_bypass_mode;
  logic pipe_lane4_cascaded_mpllb_sel;
} PCIEPHY_CTRL_94_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane7_destruct_rxmargin_mode;
  logic pipe_lane7_ext_pll_mode;
  logic [3: 0] pipe_lane7_lanepll_src_sel;
  logic [4: 0] pipe_lane7_lanepll_bypass_mode;
  logic pipe_lane7_cascaded_mpllb_sel;
  logic pipe_lane6_destruct_rxmargin_mode;
  logic pipe_lane6_ext_pll_mode;
  logic [3: 0] pipe_lane6_lanepll_src_sel;
  logic [4: 0] pipe_lane6_lanepll_bypass_mode;
  logic pipe_lane6_cascaded_mpllb_sel;
} PCIEPHY_CTRL_95_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane9_destruct_rxmargin_mode;
  logic pipe_lane9_ext_pll_mode;
  logic [3: 0] pipe_lane9_lanepll_src_sel;
  logic [4: 0] pipe_lane9_lanepll_bypass_mode;
  logic pipe_lane9_cascaded_mpllb_sel;
  logic pipe_lane8_destruct_rxmargin_mode;
  logic pipe_lane8_ext_pll_mode;
  logic [3: 0] pipe_lane8_lanepll_src_sel;
  logic [4: 0] pipe_lane8_lanepll_bypass_mode;
  logic pipe_lane8_cascaded_mpllb_sel;
} PCIEPHY_CTRL_96_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane11_destruct_rxmargin_mode;
  logic pipe_lane11_ext_pll_mode;
  logic [3: 0] pipe_lane11_lanepll_src_sel;
  logic [4: 0] pipe_lane11_lanepll_bypass_mode;
  logic pipe_lane11_cascaded_mpllb_sel;
  logic pipe_lane10_destruct_rxmargin_mode;
  logic pipe_lane10_ext_pll_mode;
  logic [3: 0] pipe_lane10_lanepll_src_sel;
  logic [4: 0] pipe_lane10_lanepll_bypass_mode;
  logic pipe_lane10_cascaded_mpllb_sel;
} PCIEPHY_CTRL_97_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane13_destruct_rxmargin_mode;
  logic pipe_lane13_ext_pll_mode;
  logic [3: 0] pipe_lane13_lanepll_src_sel;
  logic [4: 0] pipe_lane13_lanepll_bypass_mode;
  logic pipe_lane13_cascaded_mpllb_sel;
  logic pipe_lane12_destruct_rxmargin_mode;
  logic pipe_lane12_ext_pll_mode;
  logic [3: 0] pipe_lane12_lanepll_src_sel;
  logic [4: 0] pipe_lane12_lanepll_bypass_mode;
  logic pipe_lane12_cascaded_mpllb_sel;
} PCIEPHY_CTRL_98_t;

typedef struct packed {
  logic [7:0] res_0;
  logic pipe_lane15_destruct_rxmargin_mode;
  logic pipe_lane15_ext_pll_mode;
  logic [3: 0] pipe_lane15_lanepll_src_sel;
  logic [4: 0] pipe_lane15_lanepll_bypass_mode;
  logic pipe_lane15_cascaded_mpllb_sel;
  logic pipe_lane14_destruct_rxmargin_mode;
  logic pipe_lane14_ext_pll_mode;
  logic [3: 0] pipe_lane14_lanepll_src_sel;
  logic [4: 0] pipe_lane14_lanepll_bypass_mode;
  logic pipe_lane14_cascaded_mpllb_sel;
} PCIEPHY_CTRL_99_t;

typedef struct packed {
  logic [1:0] res_0;
  logic pipe_rx2_eq_training;
  logic [1: 0] pipe_rx2_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx2_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx2_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx2_rec_ovrd_8b10b_decerr;
  logic pipe_rx2_rec_ovrd_en;
  logic pipe_rx1_eq_training;
  logic [1: 0] pipe_rx1_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx1_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx1_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx1_rec_ovrd_8b10b_decerr;
  logic pipe_rx1_rec_ovrd_en;
  logic pipe_rx0_eq_training;
  logic [1: 0] pipe_rx0_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx0_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx0_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx0_rec_ovrd_8b10b_decerr;
  logic pipe_rx0_rec_ovrd_en;
} PCIEPHY_CTRL_100_t;

typedef struct packed {
  logic [1:0] res_0;
  logic pipe_rx5_eq_training;
  logic [1: 0] pipe_rx5_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx5_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx5_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx5_rec_ovrd_8b10b_decerr;
  logic pipe_rx5_rec_ovrd_en;
  logic pipe_rx4_eq_training;
  logic [1: 0] pipe_rx4_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx4_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx4_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx4_rec_ovrd_8b10b_decerr;
  logic pipe_rx4_rec_ovrd_en;
  logic pipe_rx3_eq_training;
  logic [1: 0] pipe_rx3_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx3_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx3_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx3_rec_ovrd_8b10b_decerr;
  logic pipe_rx3_rec_ovrd_en;
} PCIEPHY_CTRL_101_t;

typedef struct packed {
  logic [1:0] res_0;
  logic pipe_rx8_eq_training;
  logic [1: 0] pipe_rx8_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx8_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx8_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx8_rec_ovrd_8b10b_decerr;
  logic pipe_rx8_rec_ovrd_en;
  logic pipe_rx7_eq_training;
  logic [1: 0] pipe_rx7_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx7_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx7_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx7_rec_ovrd_8b10b_decerr;
  logic pipe_rx7_rec_ovrd_en;
  logic pipe_rx6_eq_training;
  logic [1: 0] pipe_rx6_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx6_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx6_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx6_rec_ovrd_8b10b_decerr;
  logic pipe_rx6_rec_ovrd_en;
} PCIEPHY_CTRL_102_t;

typedef struct packed {
  logic [1:0] res_0;
  logic pipe_rx11_eq_training;
  logic [1: 0] pipe_rx11_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx11_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx11_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx11_rec_ovrd_8b10b_decerr;
  logic pipe_rx11_rec_ovrd_en;
  logic pipe_rx10_eq_training;
  logic [1: 0] pipe_rx10_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx10_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx10_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx10_rec_ovrd_8b10b_decerr;
  logic pipe_rx10_rec_ovrd_en;
  logic pipe_rx9_eq_training;
  logic [1: 0] pipe_rx9_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx9_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx9_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx9_rec_ovrd_8b10b_decerr;
  logic pipe_rx9_rec_ovrd_en;
} PCIEPHY_CTRL_103_t;

typedef struct packed {
  logic [1:0] res_0;
  logic pipe_rx14_eq_training;
  logic [1: 0] pipe_rx14_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx14_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx14_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx14_rec_ovrd_8b10b_decerr;
  logic pipe_rx14_rec_ovrd_en;
  logic pipe_rx13_eq_training;
  logic [1: 0] pipe_rx13_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx13_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx13_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx13_rec_ovrd_8b10b_decerr;
  logic pipe_rx13_rec_ovrd_en;
  logic pipe_rx12_eq_training;
  logic [1: 0] pipe_rx12_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx12_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx12_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx12_rec_ovrd_8b10b_decerr;
  logic pipe_rx12_rec_ovrd_en;
} PCIEPHY_CTRL_104_t;

typedef struct packed {
  logic [8:0] res_0;
  logic upcs_mpll_ssc_sync_mode;
  logic [4: 0] max_pclk_div_ratio_esm25;
  logic [4: 0] max_pclk_div_ratio_esm20;
  logic pipe_lane_legacy_pin_mode;
  logic pipe_rx_es0_cmn_refclk_mode;
  logic pipe_rx15_eq_training;
  logic [1: 0] pipe_rx15_rec_ovrd_non8b10b_uoflow;
  logic [1: 0] pipe_rx15_rec_ovrd_non8b10b_decerr;
  logic [1: 0] pipe_rx15_rec_ovrd_8b10b_uoflow;
  logic [1: 0] pipe_rx15_rec_ovrd_8b10b_decerr;
  logic pipe_rx15_rec_ovrd_en;
} PCIEPHY_CTRL_105_t;

typedef struct packed {
  logic [15:0] res_0;
  logic pipe_rx15_es_mode;
  logic pipe_rx14_es_mode;
  logic pipe_rx13_es_mode;
  logic pipe_rx12_es_mode;
  logic pipe_rx11_es_mode;
  logic pipe_rx10_es_mode;
  logic pipe_rx9_es_mode;
  logic pipe_rx8_es_mode;
  logic pipe_rx7_es_mode;
  logic pipe_rx6_es_mode;
  logic pipe_rx5_es_mode;
  logic pipe_rx4_es_mode;
  logic pipe_rx3_es_mode;
  logic pipe_rx2_es_mode;
  logic pipe_rx1_es_mode;
  logic pipe_rx0_es_mode;
} PCIEPHY_CTRL_106_t;

typedef struct packed {
  logic [24:0] res_0;
  logic protocol_ext_mpllb_recal_bank_sel_ovrd_en;
  logic [1: 0] protocol_ext_mpllb_recal_bank_sel;
  logic protocol_ext_mplla_recal_bank_sel_ovrd_en;
  logic [1: 0] protocol_ext_mplla_recal_bank_sel;
  logic phy_ext_ctrl_sel;
} PCIEPHY_CTRL_107_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy0_mplla_bw_low;
  logic [15: 0] protocol_ext_phy0_mplla_bw_high;
} PCIEPHY_CTRL_108_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy0_mpllb_bw_low;
  logic [15: 0] protocol_ext_phy0_mpllb_bw_high;
} PCIEPHY_CTRL_109_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy1_mplla_bw_low;
  logic [15: 0] protocol_ext_phy1_mplla_bw_high;
} PCIEPHY_CTRL_110_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy1_mpllb_bw_low;
  logic [15: 0] protocol_ext_phy1_mpllb_bw_high;
} PCIEPHY_CTRL_111_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy2_mplla_bw_low;
  logic [15: 0] protocol_ext_phy2_mplla_bw_high;
} PCIEPHY_CTRL_112_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy2_mpllb_bw_low;
  logic [15: 0] protocol_ext_phy2_mpllb_bw_high;
} PCIEPHY_CTRL_113_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy3_mplla_bw_low;
  logic [15: 0] protocol_ext_phy3_mplla_bw_high;
} PCIEPHY_CTRL_114_t;

typedef struct packed {
  logic [15: 0] protocol_ext_phy3_mpllb_bw_low;
  logic [15: 0] protocol_ext_phy3_mpllb_bw_high;
} PCIEPHY_CTRL_115_t;

typedef struct packed {
  logic [7: 0] protocol_ext_phy1_mpllb_bw_threshold;
  logic [7: 0] protocol_ext_phy1_mplla_bw_threshold;
  logic [7: 0] protocol_ext_phy0_mpllb_bw_threshold;
  logic [7: 0] protocol_ext_phy0_mplla_bw_threshold;
} PCIEPHY_CTRL_116_t;

typedef struct packed {
  logic [7: 0] protocol_ext_phy3_mpllb_bw_threshold;
  logic [7: 0] protocol_ext_phy3_mplla_bw_threshold;
  logic [7: 0] protocol_ext_phy2_mpllb_bw_threshold;
  logic [7: 0] protocol_ext_phy2_mplla_bw_threshold;
} PCIEPHY_CTRL_117_t;

typedef struct packed {
  logic [3: 0] protocol_ext_phy3_mpllb_tx_clk_div;
  logic [3: 0] protocol_ext_phy3_mplla_tx_clk_div;
  logic [3: 0] protocol_ext_phy2_mpllb_tx_clk_div;
  logic [3: 0] protocol_ext_phy2_mplla_tx_clk_div;
  logic [3: 0] protocol_ext_phy1_mpllb_tx_clk_div;
  logic [3: 0] protocol_ext_phy1_mplla_tx_clk_div;
  logic [3: 0] protocol_ext_phy0_mpllb_tx_clk_div;
  logic [3: 0] protocol_ext_phy0_mplla_tx_clk_div;
} PCIEPHY_CTRL_118_t;

typedef struct packed {
  logic [4:0] res_0;
  logic [15: 0] protocol_ext_tx_ropll_postdiv_ovrd_en;
  logic protocol_ext_tx_ropll_ovrd_en;
  logic protocol_ext_rx_misc_ovrd_en;
  logic protocol_ext_rx_eq_afe_ovrd_en;
  logic protocol_ext_phy3_mpllb_tx_clk_div_ovrd_en;
  logic protocol_ext_phy3_mplla_tx_clk_div_ovrd_en;
  logic protocol_ext_phy2_mpllb_tx_clk_div_ovrd_en;
  logic protocol_ext_phy2_mplla_tx_clk_div_ovrd_en;
  logic protocol_ext_phy1_mpllb_tx_clk_div_ovrd_en;
  logic protocol_ext_phy1_mplla_tx_clk_div_ovrd_en;
  logic protocol_ext_phy0_mpllb_tx_clk_div_ovrd_en;
  logic protocol_ext_phy0_mplla_tx_clk_div_ovrd_en;
} PCIEPHY_CTRL_119_t;

typedef struct packed {
  logic [15: 0] protocol_ext_tx_ropll_word_clk_div_sel_ovrd_en;
  logic [15: 0] protocol_ext_tx_ropll_refdiv_ovrd_en;
} PCIEPHY_CTRL_120_t;

typedef struct packed {
  logic [1: 0] protocol0_ext_mplla_word_clk_div;
  logic [11: 0] protocol0_ext_mplla_multiplier;
  logic protocol0_ext_mplla_frac_en;
  logic [15: 0] protocol0_ext_mplla_frac_den;
  logic protocol0_ext_mplla_fb_clk_div4_en;
} PCIEPHY_CTRL_121_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_mplla_frac_rem;
  logic [15: 0] protocol0_ext_mplla_frac_quot;
} PCIEPHY_CTRL_122_t;

typedef struct packed {
  logic [19: 0] protocol0_ext_mplla_ssc_peak;
  logic [11: 0] protocol0_ext_mplla_multiplier;
} PCIEPHY_CTRL_123_t;

typedef struct packed {
  logic [9:0] res_0;
  logic protocol0_ext_mplla_ssc_up_spread;
  logic [20: 0] protocol0_ext_mplla_ssc_step_size;
} PCIEPHY_CTRL_124_t;

typedef struct packed {
  logic [1: 0] protocol0_ext_mpllb_word_clk_div;
  logic [11: 0] protocol0_ext_mpllb_multiplier;
  logic protocol0_ext_mpllb_frac_en;
  logic [15: 0] protocol0_ext_mpllb_frac_den;
  logic protocol0_ext_mpllb_fb_clk_div4_en;
} PCIEPHY_CTRL_125_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_mpllb_frac_rem;
  logic [15: 0] protocol0_ext_mpllb_frac_quot;
} PCIEPHY_CTRL_126_t;

typedef struct packed {
  logic [19: 0] protocol0_ext_mpllb_ssc_peak;
  logic [11: 0] protocol0_ext_mpllb_multiplier;
} PCIEPHY_CTRL_127_t;

typedef struct packed {
  logic [9:0] res_0;
  logic protocol0_ext_mpllb_ssc_up_spread;
  logic [20: 0] protocol0_ext_mpllb_ssc_step_size;
} PCIEPHY_CTRL_128_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [2: 0] protocol0_ext_ref_clk_mpllb_div;
  logic [2: 0] protocol0_ext_ref_clk_mplla_div;
} PCIEPHY_CTRL_129_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_mode_g1_31_0;
} PCIEPHY_CTRL_130_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_mode_g2_31_0;
} PCIEPHY_CTRL_131_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_mode_g3_31_0;
} PCIEPHY_CTRL_132_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_mode_g4_31_0;
} PCIEPHY_CTRL_133_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_mode_g5_31_0;
} PCIEPHY_CTRL_134_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_adapt_mode_g2_47_32;
  logic [15: 0] protocol0_ext_rx_adapt_mode_g1_47_32;
} PCIEPHY_CTRL_135_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_adapt_mode_g4_47_32;
  logic [15: 0] protocol0_ext_rx_adapt_mode_g3_47_32;
} PCIEPHY_CTRL_136_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_adapt_mode_g5_47_32;
} PCIEPHY_CTRL_137_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_sel_piperate0;
} PCIEPHY_CTRL_138_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_sel_piperate1;
} PCIEPHY_CTRL_139_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_sel_piperate2;
} PCIEPHY_CTRL_140_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_sel_piperate3;
} PCIEPHY_CTRL_141_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_adapt_sel_piperate4;
} PCIEPHY_CTRL_142_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g1_31_0;
} PCIEPHY_CTRL_143_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g1_63_32;
} PCIEPHY_CTRL_144_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g2_31_0;
} PCIEPHY_CTRL_145_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g2_63_32;
} PCIEPHY_CTRL_146_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g3_31_0;
} PCIEPHY_CTRL_147_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g3_63_32;
} PCIEPHY_CTRL_148_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g4_31_0;
} PCIEPHY_CTRL_149_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g4_63_32;
} PCIEPHY_CTRL_150_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g5_31_0;
} PCIEPHY_CTRL_151_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_ppm_max_g5_63_32;
} PCIEPHY_CTRL_152_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_cdr_ppm_max_g2_79_64;
  logic [15: 0] protocol0_ext_rx_cdr_ppm_max_g1_79_64;
} PCIEPHY_CTRL_153_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_cdr_ppm_max_g4_79_64;
  logic [15: 0] protocol0_ext_rx_cdr_ppm_max_g3_79_64;
} PCIEPHY_CTRL_154_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_cdr_ppm_max_g5_79_64;
} PCIEPHY_CTRL_155_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g1_31_0;
} PCIEPHY_CTRL_156_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g1_63_32;
} PCIEPHY_CTRL_157_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g1_95_64;
} PCIEPHY_CTRL_158_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g1_127_96;
} PCIEPHY_CTRL_159_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g1_159_128;
} PCIEPHY_CTRL_160_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g1_191_160;
} PCIEPHY_CTRL_161_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_31_0;
} PCIEPHY_CTRL_162_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_63_32;
} PCIEPHY_CTRL_163_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_95_64;
} PCIEPHY_CTRL_164_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_127_96;
} PCIEPHY_CTRL_165_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_159_128;
} PCIEPHY_CTRL_166_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_191_160;
} PCIEPHY_CTRL_167_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_31_0;
} PCIEPHY_CTRL_168_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_63_32;
} PCIEPHY_CTRL_169_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_95_64;
} PCIEPHY_CTRL_170_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_127_96;
} PCIEPHY_CTRL_171_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_159_128;
} PCIEPHY_CTRL_172_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g2_191_160;
} PCIEPHY_CTRL_173_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g3_31_0;
} PCIEPHY_CTRL_174_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g3_63_32;
} PCIEPHY_CTRL_175_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g3_95_64;
} PCIEPHY_CTRL_176_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g3_127_96;
} PCIEPHY_CTRL_177_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g3_159_128;
} PCIEPHY_CTRL_178_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g3_191_160;
} PCIEPHY_CTRL_179_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g4_31_0;
} PCIEPHY_CTRL_180_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g4_63_32;
} PCIEPHY_CTRL_181_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g4_95_64;
} PCIEPHY_CTRL_182_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g4_127_96;
} PCIEPHY_CTRL_183_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g4_159_128;
} PCIEPHY_CTRL_184_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g4_191_160;
} PCIEPHY_CTRL_185_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g5_31_0;
} PCIEPHY_CTRL_186_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g5_63_32;
} PCIEPHY_CTRL_187_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g5_95_64;
} PCIEPHY_CTRL_188_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g5_127_96;
} PCIEPHY_CTRL_189_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g5_159_128;
} PCIEPHY_CTRL_190_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_cdr_vco_config_g5_191_160;
} PCIEPHY_CTRL_191_t;

typedef struct packed {
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_diff_range_g3;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_diff_range_g2;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_diff_range_g1;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_cm_range_g5;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_cm_range_g4;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_cm_range_g3;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_cm_range_g2;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_cm_range_g1;
} PCIEPHY_CTRL_192_t;

typedef struct packed {
  logic [23:0] res_0;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_diff_range_g5;
  logic [3: 0] protocol0_ext_rx_dcc_ctrl_diff_range_g4;
} PCIEPHY_CTRL_193_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g1_31_0;
} PCIEPHY_CTRL_194_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g1_63_32;
} PCIEPHY_CTRL_195_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g2_31_0;
} PCIEPHY_CTRL_196_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g2_63_32;
} PCIEPHY_CTRL_197_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g3_31_0;
} PCIEPHY_CTRL_198_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g3_63_32;
} PCIEPHY_CTRL_199_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g4_31_0;
} PCIEPHY_CTRL_200_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g4_63_32;
} PCIEPHY_CTRL_201_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g5_31_0;
} PCIEPHY_CTRL_202_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_delta_iq_g5_63_32;
} PCIEPHY_CTRL_203_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_dfe_bypass_g2;
  logic [15: 0] protocol0_ext_rx_dfe_bypass_g1;
} PCIEPHY_CTRL_204_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_dfe_bypass_g4;
  logic [15: 0] protocol0_ext_rx_dfe_bypass_g3;
} PCIEPHY_CTRL_205_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_dfe_bypass_g5;
} PCIEPHY_CTRL_206_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g1_31_0;
} PCIEPHY_CTRL_207_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g1_63_32;
} PCIEPHY_CTRL_208_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g1_95_64;
} PCIEPHY_CTRL_209_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g1_127_96;
} PCIEPHY_CTRL_210_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g1_159_128;
} PCIEPHY_CTRL_211_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g1_191_160;
} PCIEPHY_CTRL_212_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g2_31_0;
} PCIEPHY_CTRL_213_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g2_63_32;
} PCIEPHY_CTRL_214_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g2_95_64;
} PCIEPHY_CTRL_215_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g2_127_96;
} PCIEPHY_CTRL_216_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g2_159_128;
} PCIEPHY_CTRL_217_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g2_191_160;
} PCIEPHY_CTRL_218_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g3_31_0;
} PCIEPHY_CTRL_219_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g3_63_32;
} PCIEPHY_CTRL_220_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g3_95_64;
} PCIEPHY_CTRL_221_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g3_127_96;
} PCIEPHY_CTRL_222_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g3_159_128;
} PCIEPHY_CTRL_223_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g3_191_160;
} PCIEPHY_CTRL_224_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g4_31_0;
} PCIEPHY_CTRL_225_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g4_63_32;
} PCIEPHY_CTRL_226_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g4_95_64;
} PCIEPHY_CTRL_227_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g4_127_96;
} PCIEPHY_CTRL_228_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g4_159_128;
} PCIEPHY_CTRL_229_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g4_191_160;
} PCIEPHY_CTRL_230_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g5_31_0;
} PCIEPHY_CTRL_231_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g5_63_32;
} PCIEPHY_CTRL_232_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g5_95_64;
} PCIEPHY_CTRL_233_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g5_127_96;
} PCIEPHY_CTRL_234_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g5_159_128;
} PCIEPHY_CTRL_235_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_config_g5_191_160;
} PCIEPHY_CTRL_236_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_rate_g1_31_0;
} PCIEPHY_CTRL_237_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_rate_g2_31_0;
} PCIEPHY_CTRL_238_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_rate_g3_31_0;
} PCIEPHY_CTRL_239_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_rate_g4_31_0;
} PCIEPHY_CTRL_240_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_afe_rate_g5_31_0;
} PCIEPHY_CTRL_241_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_afe_rate_g2_47_32;
  logic [15: 0] protocol0_ext_rx_eq_afe_rate_g1_47_32;
} PCIEPHY_CTRL_242_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_afe_rate_g4_47_32;
  logic [15: 0] protocol0_ext_rx_eq_afe_rate_g3_47_32;
} PCIEPHY_CTRL_243_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_eq_afe_rate_g5_47_32;
} PCIEPHY_CTRL_244_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_att_lvl_g1_31_0;
} PCIEPHY_CTRL_245_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_att_lvl_g2_31_0;
} PCIEPHY_CTRL_246_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_att_lvl_g2_31_0;
} PCIEPHY_CTRL_247_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_att_lvl_g2_31_0;
} PCIEPHY_CTRL_248_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_att_lvl_g2_31_0;
} PCIEPHY_CTRL_249_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_att_lvl_g2_47_32;
  logic [15: 0] protocol0_ext_rx_eq_att_lvl_g1_47_32;
} PCIEPHY_CTRL_250_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_att_lvl_g4_47_32;
  logic [15: 0] protocol0_ext_rx_eq_att_lvl_g3_47_32;
} PCIEPHY_CTRL_251_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_eq_att_lvl_g5_47_32;
} PCIEPHY_CTRL_252_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g1_31_0;
} PCIEPHY_CTRL_253_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g1_63_32;
} PCIEPHY_CTRL_254_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g2_31_0;
} PCIEPHY_CTRL_255_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g2_63_32;
} PCIEPHY_CTRL_256_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g3_31_0;
} PCIEPHY_CTRL_257_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g3_63_32;
} PCIEPHY_CTRL_258_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g4_31_0;
} PCIEPHY_CTRL_259_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g4_63_32;
} PCIEPHY_CTRL_260_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g5_31_0;
} PCIEPHY_CTRL_261_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_boost_g5_63_32;
} PCIEPHY_CTRL_262_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_ctle_boost_g2_79_64;
  logic [15: 0] protocol0_ext_rx_eq_ctle_boost_g1_79_64;
} PCIEPHY_CTRL_263_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_ctle_boost_g4_79_64;
  logic [15: 0] protocol0_ext_rx_eq_ctle_boost_g3_79_64;
} PCIEPHY_CTRL_264_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_eq_ctle_boost_g5_79_64;
} PCIEPHY_CTRL_265_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_pole_g1;
} PCIEPHY_CTRL_266_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_pole_g2;
} PCIEPHY_CTRL_267_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_pole_g3;
} PCIEPHY_CTRL_268_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_pole_g4;
} PCIEPHY_CTRL_269_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_ctle_pole_g5;
} PCIEPHY_CTRL_270_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_dfe_float_en_g2;
  logic [15: 0] protocol0_ext_rx_eq_dfe_float_en_g1;
} PCIEPHY_CTRL_271_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_dfe_float_en_g4;
  logic [15: 0] protocol0_ext_rx_eq_dfe_float_en_g3;
} PCIEPHY_CTRL_272_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_eq_dfe_float_en_g5;
} PCIEPHY_CTRL_273_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g1_31_0;
} PCIEPHY_CTRL_274_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g1_63_32;
} PCIEPHY_CTRL_275_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g1_95_64;
} PCIEPHY_CTRL_276_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g1_127_96;
} PCIEPHY_CTRL_277_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g2_31_0;
} PCIEPHY_CTRL_278_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g2_63_32;
} PCIEPHY_CTRL_279_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g2_95_64;
} PCIEPHY_CTRL_280_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g2_127_96;
} PCIEPHY_CTRL_281_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g3_31_0;
} PCIEPHY_CTRL_282_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g3_63_32;
} PCIEPHY_CTRL_283_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g3_95_64;
} PCIEPHY_CTRL_284_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g3_127_96;
} PCIEPHY_CTRL_285_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g4_31_0;
} PCIEPHY_CTRL_286_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g4_63_32;
} PCIEPHY_CTRL_287_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g4_95_64;
} PCIEPHY_CTRL_288_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g4_127_96;
} PCIEPHY_CTRL_289_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g5_31_0;
} PCIEPHY_CTRL_290_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g5_63_32;
} PCIEPHY_CTRL_291_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g5_95_64;
} PCIEPHY_CTRL_292_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_eq_dfe_tap1_g5_127_96;
} PCIEPHY_CTRL_293_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_dfe_tap1_g2_143_128;
  logic [15: 0] protocol0_ext_rx_eq_dfe_tap1_g1_143_128;
} PCIEPHY_CTRL_294_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_rx_eq_dfe_tap1_g4_143_128;
  logic [15: 0] protocol0_ext_rx_eq_dfe_tap1_g3_143_128;
} PCIEPHY_CTRL_295_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_rx_eq_dfe_tap1_g5_143_128;
} PCIEPHY_CTRL_296_t;

typedef struct packed {
  logic [7: 0] protocol0_ext_rx_eq_dfe_tap2_g4;
  logic [7: 0] protocol0_ext_rx_eq_dfe_tap2_g3;
  logic [7: 0] protocol0_ext_rx_eq_dfe_tap2_g2;
  logic [7: 0] protocol0_ext_rx_eq_dfe_tap2_g1;
} PCIEPHY_CTRL_297_t;

typedef struct packed {
  logic [3:0] res_0;
  logic [3: 0] protocol0_ext_rx_eq_vga_gain_g5;
  logic [3: 0] protocol0_ext_rx_eq_vga_gain_g4;
  logic [3: 0] protocol0_ext_rx_eq_vga_gain_g3;
  logic [3: 0] protocol0_ext_rx_eq_vga_gain_g2;
  logic [3: 0] protocol0_ext_rx_eq_vga_gain_g1;
  logic [7: 0] protocol0_ext_rx_eq_dfe_tap2_g5;
} PCIEPHY_CTRL_298_t;

typedef struct packed {
  logic [20:0] res_0;
  logic [10: 0] protocol0_ext_rx_los_pwr_up_cnt;
} PCIEPHY_CTRL_299_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_31_0;
} PCIEPHY_CTRL_300_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_63_32;
} PCIEPHY_CTRL_301_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_127_64;
} PCIEPHY_CTRL_302_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_159_128;
} PCIEPHY_CTRL_303_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_191_160;
} PCIEPHY_CTRL_304_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_223_192;
} PCIEPHY_CTRL_305_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_255_224;
} PCIEPHY_CTRL_306_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_287_256;
} PCIEPHY_CTRL_307_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_319_288;
} PCIEPHY_CTRL_308_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_351_320;
} PCIEPHY_CTRL_309_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g1_383_352;
} PCIEPHY_CTRL_310_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_31_0;
} PCIEPHY_CTRL_311_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_63_32;
} PCIEPHY_CTRL_312_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_127_64;
} PCIEPHY_CTRL_313_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_159_128;
} PCIEPHY_CTRL_314_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_191_160;
} PCIEPHY_CTRL_315_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_223_192;
} PCIEPHY_CTRL_316_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_255_224;
} PCIEPHY_CTRL_317_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_287_256;
} PCIEPHY_CTRL_318_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_319_288;
} PCIEPHY_CTRL_319_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_351_320;
} PCIEPHY_CTRL_320_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g2_383_352;
} PCIEPHY_CTRL_321_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_31_0;
} PCIEPHY_CTRL_322_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_63_32;
} PCIEPHY_CTRL_323_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_127_64;
} PCIEPHY_CTRL_324_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_159_128;
} PCIEPHY_CTRL_325_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_191_160;
} PCIEPHY_CTRL_326_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_223_192;
} PCIEPHY_CTRL_327_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_255_224;
} PCIEPHY_CTRL_328_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_287_256;
} PCIEPHY_CTRL_329_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_319_288;
} PCIEPHY_CTRL_330_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_351_320;
} PCIEPHY_CTRL_331_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g3_383_352;
} PCIEPHY_CTRL_332_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_31_0;
} PCIEPHY_CTRL_333_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_63_32;
} PCIEPHY_CTRL_334_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_127_64;
} PCIEPHY_CTRL_335_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_159_128;
} PCIEPHY_CTRL_336_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_191_160;
} PCIEPHY_CTRL_337_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_223_192;
} PCIEPHY_CTRL_338_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_255_224;
} PCIEPHY_CTRL_339_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_287_256;
} PCIEPHY_CTRL_340_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_319_288;
} PCIEPHY_CTRL_341_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_351_320;
} PCIEPHY_CTRL_342_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g4_383_352;
} PCIEPHY_CTRL_343_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_31_0;
} PCIEPHY_CTRL_344_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_63_32;
} PCIEPHY_CTRL_345_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_127_64;
} PCIEPHY_CTRL_346_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_159_128;
} PCIEPHY_CTRL_347_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_191_160;
} PCIEPHY_CTRL_348_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_223_192;
} PCIEPHY_CTRL_349_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_255_224;
} PCIEPHY_CTRL_350_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_287_256;
} PCIEPHY_CTRL_351_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_319_288;
} PCIEPHY_CTRL_352_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_351_320;
} PCIEPHY_CTRL_353_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_rx_misc_g5_383_352;
} PCIEPHY_CTRL_354_t;

typedef struct packed {
  logic [3:0] res_0;
  logic [6: 0] protocol0_ext_rx_ref_ld_val_g4;
  logic [6: 0] protocol0_ext_rx_ref_ld_val_g3;
  logic [6: 0] protocol0_ext_rx_ref_ld_val_g2;
  logic [6: 0] protocol0_ext_rx_ref_ld_val_g1;
} PCIEPHY_CTRL_355_t;

typedef struct packed {
  logic [1:0] res_0;
  logic [3: 0] protocol0_ext_rx_term_ctrl_g2;
  logic [3: 0] protocol0_ext_rx_term_ctrl_g1;
  logic protocol0_ext_rx_sigdet_lfps_filter_en_g5;
  logic protocol0_ext_rx_sigdet_lfps_filter_en_g4;
  logic protocol0_ext_rx_sigdet_lfps_filter_en_g3;
  logic protocol0_ext_rx_sigdet_lfps_filter_en_g2;
  logic protocol0_ext_rx_sigdet_lfps_filter_en_g1;
  logic [1: 0] protocol0_ext_rx_sigdet_lf_threshold_g5;
  logic [1: 0] protocol0_ext_rx_sigdet_lf_threshold_g4;
  logic [1: 0] protocol0_ext_rx_sigdet_lf_threshold_g3;
  logic [1: 0] protocol0_ext_rx_sigdet_lf_threshold_g2;
  logic [1: 0] protocol0_ext_rx_sigdet_lf_threshold_g1;
  logic [6: 0] protocol0_ext_rx_ref_ld_val_g5;
} PCIEPHY_CTRL_356_t;

typedef struct packed {
  logic [19:0] res_0;
  logic [3: 0] protocol0_ext_rx_term_ctrl_g5;
  logic [3: 0] protocol0_ext_rx_term_ctrl_g4;
  logic [3: 0] protocol0_ext_rx_term_ctrl_g3;
} PCIEPHY_CTRL_357_t;

typedef struct packed {
  logic [5:0] res_0;
  logic [12: 0] protocol0_ext_rx_vco_ld_val_g2;
  logic [12: 0] protocol0_ext_rx_vco_ld_val_g1;
} PCIEPHY_CTRL_358_t;

typedef struct packed {
  logic [5:0] res_0;
  logic [12: 0] protocol0_ext_rx_vco_ld_val_g4;
  logic [12: 0] protocol0_ext_rx_vco_ld_val_g3;
} PCIEPHY_CTRL_359_t;

typedef struct packed {
  logic [1:0] res_0;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_cm_range_g3;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_cm_range_g2;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_cm_range_g1;
  logic [4: 0] protocol0_ext_rx_vref_ctrl;
  logic [12: 0] protocol0_ext_rx_vco_ld_val_g5;
} PCIEPHY_CTRL_360_t;

typedef struct packed {
  logic [3:0] res_0;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_diff_range_g5;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_diff_range_g4;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_diff_range_g3;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_diff_range_g2;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_diff_range_g1;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_cm_range_g5;
  logic [3: 0] protocol0_ext_tx_dcc_ctrl_cm_range_g4;
} PCIEPHY_CTRL_361_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g1_31_0;
} PCIEPHY_CTRL_362_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g1_63_32;
} PCIEPHY_CTRL_363_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g1_95_64;
} PCIEPHY_CTRL_364_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g2_31_0;
} PCIEPHY_CTRL_365_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g2_63_32;
} PCIEPHY_CTRL_366_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g2_95_64;
} PCIEPHY_CTRL_367_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g3_31_0;
} PCIEPHY_CTRL_368_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g3_63_32;
} PCIEPHY_CTRL_369_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g3_95_64;
} PCIEPHY_CTRL_370_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g4_31_0;
} PCIEPHY_CTRL_371_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g4_63_32;
} PCIEPHY_CTRL_372_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g4_95_64;
} PCIEPHY_CTRL_373_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g5_31_0;
} PCIEPHY_CTRL_374_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g5_63_32;
} PCIEPHY_CTRL_375_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_main_g5_95_64;
} PCIEPHY_CTRL_376_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_eq_ovrd_g2;
  logic [15: 0] protocol0_ext_tx_eq_ovrd_g1;
} PCIEPHY_CTRL_377_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_eq_ovrd_g4;
  logic [15: 0] protocol0_ext_tx_eq_ovrd_g3;
} PCIEPHY_CTRL_378_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_tx_eq_ovrd_g5;
} PCIEPHY_CTRL_379_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g1_31_0;
} PCIEPHY_CTRL_380_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g1_63_32;
} PCIEPHY_CTRL_381_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g2_31_0;
} PCIEPHY_CTRL_382_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g2_63_32;
} PCIEPHY_CTRL_383_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g3_31_0;
} PCIEPHY_CTRL_384_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g3_63_32;
} PCIEPHY_CTRL_385_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g4_31_0;
} PCIEPHY_CTRL_386_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g4_63_32;
} PCIEPHY_CTRL_387_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g5_31_0;
} PCIEPHY_CTRL_388_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_post_g5_63_32;
} PCIEPHY_CTRL_389_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_eq_post_g2_79_64;
  logic [15: 0] protocol0_ext_tx_eq_post_g1_79_64;
} PCIEPHY_CTRL_390_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_eq_post_g4_79_64;
  logic [15: 0] protocol0_ext_tx_eq_post_g3_79_64;
} PCIEPHY_CTRL_391_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_tx_eq_post_g5_79_64;
} PCIEPHY_CTRL_392_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g1_31_0;
} PCIEPHY_CTRL_393_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g1_63_32;
} PCIEPHY_CTRL_394_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g2_31_0;
} PCIEPHY_CTRL_395_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g2_63_32;
} PCIEPHY_CTRL_396_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g3_31_0;
} PCIEPHY_CTRL_397_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g3_63_32;
} PCIEPHY_CTRL_398_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g4_31_0;
} PCIEPHY_CTRL_399_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g4_63_32;
} PCIEPHY_CTRL_400_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g5_31_0;
} PCIEPHY_CTRL_401_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_eq_pre_g5_63_32;
} PCIEPHY_CTRL_402_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_eq_pre_g2_79_64;
  logic [15: 0] protocol0_ext_tx_eq_pre_g1_79_64;
} PCIEPHY_CTRL_403_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_eq_pre_g4_79_64;
  logic [15: 0] protocol0_ext_tx_eq_pre_g3_79_64;
} PCIEPHY_CTRL_404_t;

typedef struct packed {
  logic [10:0] res_0;
  logic protocol0_ext_tx_fastedge_en_g5;
  logic protocol0_ext_tx_fastedge_en_g4;
  logic protocol0_ext_tx_fastedge_en_g3;
  logic protocol0_ext_tx_fastedge_en_g2;
  logic protocol0_ext_tx_fastedge_en_g1;
  logic [15: 0] protocol0_ext_tx_eq_pre_g5_79_64;
} PCIEPHY_CTRL_405_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_31_0;
} PCIEPHY_CTRL_406_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_63_32;
} PCIEPHY_CTRL_407_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_95_64;
} PCIEPHY_CTRL_408_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_127_96;
} PCIEPHY_CTRL_409_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_159_128;
} PCIEPHY_CTRL_410_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_191_160;
} PCIEPHY_CTRL_411_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_223_192;
} PCIEPHY_CTRL_412_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_255_223;
} PCIEPHY_CTRL_413_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_287_256;
} PCIEPHY_CTRL_414_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_319_288;
} PCIEPHY_CTRL_415_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_351_320;
} PCIEPHY_CTRL_416_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g1_383_352;
} PCIEPHY_CTRL_417_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_31_0;
} PCIEPHY_CTRL_418_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_63_32;
} PCIEPHY_CTRL_419_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_95_64;
} PCIEPHY_CTRL_420_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_127_96;
} PCIEPHY_CTRL_421_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_159_128;
} PCIEPHY_CTRL_422_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_191_160;
} PCIEPHY_CTRL_423_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_223_192;
} PCIEPHY_CTRL_424_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_255_223;
} PCIEPHY_CTRL_425_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_287_256;
} PCIEPHY_CTRL_426_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_319_288;
} PCIEPHY_CTRL_427_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_351_320;
} PCIEPHY_CTRL_428_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g2_383_352;
} PCIEPHY_CTRL_429_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_31_0;
} PCIEPHY_CTRL_430_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_63_32;
} PCIEPHY_CTRL_431_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_95_64;
} PCIEPHY_CTRL_432_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_127_96;
} PCIEPHY_CTRL_433_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_159_128;
} PCIEPHY_CTRL_434_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_191_160;
} PCIEPHY_CTRL_435_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_223_192;
} PCIEPHY_CTRL_436_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_255_223;
} PCIEPHY_CTRL_437_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_287_256;
} PCIEPHY_CTRL_438_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_319_288;
} PCIEPHY_CTRL_439_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_351_320;
} PCIEPHY_CTRL_440_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g3_383_352;
} PCIEPHY_CTRL_441_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_31_0;
} PCIEPHY_CTRL_442_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_63_32;
} PCIEPHY_CTRL_443_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_95_64;
} PCIEPHY_CTRL_444_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_127_96;
} PCIEPHY_CTRL_445_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_159_128;
} PCIEPHY_CTRL_446_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_191_160;
} PCIEPHY_CTRL_447_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_223_192;
} PCIEPHY_CTRL_448_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_255_223;
} PCIEPHY_CTRL_449_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_287_256;
} PCIEPHY_CTRL_450_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_319_288;
} PCIEPHY_CTRL_451_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_351_320;
} PCIEPHY_CTRL_452_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g4_383_352;
} PCIEPHY_CTRL_453_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_31_0;
} PCIEPHY_CTRL_454_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_63_32;
} PCIEPHY_CTRL_455_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_95_64;
} PCIEPHY_CTRL_456_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_127_96;
} PCIEPHY_CTRL_457_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_159_128;
} PCIEPHY_CTRL_458_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_191_160;
} PCIEPHY_CTRL_459_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_223_192;
} PCIEPHY_CTRL_460_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_255_223;
} PCIEPHY_CTRL_461_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_287_256;
} PCIEPHY_CTRL_462_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_319_288;
} PCIEPHY_CTRL_463_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_351_320;
} PCIEPHY_CTRL_464_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_misc_g5_383_352;
} PCIEPHY_CTRL_465_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g1_31_0;
} PCIEPHY_CTRL_466_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g1_63_32;
} PCIEPHY_CTRL_467_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g1_95_64;
} PCIEPHY_CTRL_468_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g2_31_0;
} PCIEPHY_CTRL_469_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g2_63_32;
} PCIEPHY_CTRL_470_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g2_95_64;
} PCIEPHY_CTRL_471_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g3_31_0;
} PCIEPHY_CTRL_472_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g3_63_32;
} PCIEPHY_CTRL_473_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g3_95_64;
} PCIEPHY_CTRL_474_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g4_31_0;
} PCIEPHY_CTRL_475_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g4_63_32;
} PCIEPHY_CTRL_476_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g4_95_64;
} PCIEPHY_CTRL_477_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g5_31_0;
} PCIEPHY_CTRL_478_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g5_63_32;
} PCIEPHY_CTRL_479_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g5_95_64;
} PCIEPHY_CTRL_480_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g1_31_0;
} PCIEPHY_CTRL_481_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g1_63_32;
} PCIEPHY_CTRL_482_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g1_95_64;
} PCIEPHY_CTRL_483_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g2_31_0;
} PCIEPHY_CTRL_484_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g2_63_32;
} PCIEPHY_CTRL_485_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g2_95_64;
} PCIEPHY_CTRL_486_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g3_31_0;
} PCIEPHY_CTRL_487_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g3_63_32;
} PCIEPHY_CTRL_488_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g3_95_64;
} PCIEPHY_CTRL_489_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g4_31_0;
} PCIEPHY_CTRL_490_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g4_63_32;
} PCIEPHY_CTRL_491_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g4_95_64;
} PCIEPHY_CTRL_492_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g5_31_0;
} PCIEPHY_CTRL_493_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g5_63_32;
} PCIEPHY_CTRL_494_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g5_95_64;
} PCIEPHY_CTRL_495_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g2_111_96;
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g1_111_96;
} PCIEPHY_CTRL_496_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g4_111_96;
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g3_111_96;
} PCIEPHY_CTRL_497_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g2_111_96;
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g1_111_96;
} PCIEPHY_CTRL_498_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g4_111_96;
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g3_111_96;
} PCIEPHY_CTRL_499_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_prop_g5_111_96;
  logic [15: 0] protocol0_ext_tx_ropll_cp_ctl_intg_g5_111_96;
} PCIEPHY_CTRL_500_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g1_31_0;
} PCIEPHY_CTRL_501_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g1_63_32;
} PCIEPHY_CTRL_502_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g1_95_64;
} PCIEPHY_CTRL_503_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g2_31_0;
} PCIEPHY_CTRL_504_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g2_63_32;
} PCIEPHY_CTRL_505_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g2_95_64;
} PCIEPHY_CTRL_506_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g3_31_0;
} PCIEPHY_CTRL_507_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g3_63_32;
} PCIEPHY_CTRL_508_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g3_95_64;
} PCIEPHY_CTRL_509_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g4_31_0;
} PCIEPHY_CTRL_510_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g4_63_32;
} PCIEPHY_CTRL_511_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g4_95_64;
} PCIEPHY_CTRL_512_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g5_31_0;
} PCIEPHY_CTRL_513_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g5_63_32;
} PCIEPHY_CTRL_514_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_fbdiv_g5_95_64;
} PCIEPHY_CTRL_515_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_fbdiv_g2_111_96;
  logic [15: 0] protocol0_ext_tx_ropll_fbdiv_g1_111_96;
} PCIEPHY_CTRL_516_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_fbdiv_g4_111_96;
  logic [15: 0] protocol0_ext_tx_ropll_fbdiv_g3_111_96;
} PCIEPHY_CTRL_517_t;

typedef struct packed {
  logic [15:0] res_0;
  logic [15: 0] protocol0_ext_tx_ropll_fbdiv_g5_111_96;
} PCIEPHY_CTRL_518_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_postdiv_g1_31_0;
} PCIEPHY_CTRL_519_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_postdiv_g2_31_0;
} PCIEPHY_CTRL_520_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_postdiv_g3_31_0;
} PCIEPHY_CTRL_521_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_postdiv_g4_31_0;
} PCIEPHY_CTRL_522_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_postdiv_g5_31_0;
} PCIEPHY_CTRL_523_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_rc_filter_g1_31_0;
} PCIEPHY_CTRL_524_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_rc_filter_g2_31_0;
} PCIEPHY_CTRL_525_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_rc_filter_g3_31_0;
} PCIEPHY_CTRL_526_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_rc_filter_g4_31_0;
} PCIEPHY_CTRL_527_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_rc_filter_g5_31_0;
} PCIEPHY_CTRL_528_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_postdiv_g2_47_32;
  logic [15: 0] protocol0_ext_tx_ropll_postdiv_g1_47_32;
} PCIEPHY_CTRL_529_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_postdiv_g4_47_32;
  logic [15: 0] protocol0_ext_tx_ropll_postdiv_g3_47_32;
} PCIEPHY_CTRL_530_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_rc_filter_g2_47_32;
  logic [15: 0] protocol0_ext_tx_ropll_rc_filter_g1_47_32;
} PCIEPHY_CTRL_531_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_rc_filter_g4_47_32;
  logic [15: 0] protocol0_ext_tx_ropll_rc_filter_g3_47_32;
} PCIEPHY_CTRL_532_t;

typedef struct packed {
  logic [15: 0] protocol0_ext_tx_ropll_rc_filter_g5_47_32;
  logic [15: 0] protocol0_ext_tx_ropll_postdiv_g5_47_32;
} PCIEPHY_CTRL_533_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g1_31_0;
} PCIEPHY_CTRL_534_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g1_63_32;
} PCIEPHY_CTRL_535_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g2_31_0;
} PCIEPHY_CTRL_536_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g2_63_32;
} PCIEPHY_CTRL_537_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g3_31_0;
} PCIEPHY_CTRL_538_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g3_63_32;
} PCIEPHY_CTRL_539_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g4_31_0;
} PCIEPHY_CTRL_540_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g4_63_32;
} PCIEPHY_CTRL_541_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g5_31_0;
} PCIEPHY_CTRL_542_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refdiv_g5_63_32;
} PCIEPHY_CTRL_543_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refsel_g1;
} PCIEPHY_CTRL_544_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refsel_g2;
} PCIEPHY_CTRL_545_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refsel_g3;
} PCIEPHY_CTRL_546_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refsel_g4;
} PCIEPHY_CTRL_547_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_refsel_g5;
} PCIEPHY_CTRL_548_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_v2i_mode_g1;
} PCIEPHY_CTRL_549_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_v2i_mode_g2;
} PCIEPHY_CTRL_550_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_v2i_mode_g3;
} PCIEPHY_CTRL_551_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_v2i_mode_g4;
} PCIEPHY_CTRL_552_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_v2i_mode_g5;
} PCIEPHY_CTRL_553_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_vco_low_freq_g1;
} PCIEPHY_CTRL_554_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_vco_low_freq_g2;
} PCIEPHY_CTRL_555_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_vco_low_freq_g3;
} PCIEPHY_CTRL_556_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_vco_low_freq_g4;
} PCIEPHY_CTRL_557_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_vco_low_freq_g5;
} PCIEPHY_CTRL_558_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_word_clk_div_sel_g1;
} PCIEPHY_CTRL_559_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_word_clk_div_sel_g2;
} PCIEPHY_CTRL_560_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_word_clk_div_sel_g3;
} PCIEPHY_CTRL_561_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_word_clk_div_sel_g4;
} PCIEPHY_CTRL_562_t;

typedef struct packed {
  logic [31: 0] protocol0_ext_tx_ropll_word_clk_div_sel_g5;
} PCIEPHY_CTRL_563_t;

typedef struct packed {
  logic [11:0] res_0;
  logic [3: 0] protocol0_ext_tx_term_ctrl_g5;
  logic [3: 0] protocol0_ext_tx_term_ctrl_g4;
  logic [3: 0] protocol0_ext_tx_term_ctrl_g3;
  logic [3: 0] protocol0_ext_tx_term_ctrl_g2;
  logic [3: 0] protocol0_ext_tx_term_ctrl_g1;
} PCIEPHY_CTRL_564_t;

typedef struct packed {
  logic [23:0] res_0;
  logic phy0_refb_clkdet_result;
  logic phy0_refa_clkdet_result;
  logic phy0_mpllb_state;
  logic phy0_mpllb_force_ack;
  logic phy0_mplla_state;
  logic phy0_mplla_force_ack;
  logic phy0_sram_sec_sticky_status;
  logic phy0_sram_ded_sticky_status;
} PCIEPHY_CTRL_565_t;

typedef struct packed {
  logic [30:0] res_0;
  logic phy0_sram_init_done;
} PCIEPHY_CTRL_566_t;

typedef struct packed {
  logic [23:0] res_0;
  logic phy1_refb_clkdet_result;
  logic phy1_refa_clkdet_result;
  logic phy1_mpllb_state;
  logic phy1_mpllb_force_ack;
  logic phy1_mplla_state;
  logic phy1_mplla_force_ack;
  logic phy1_sram_sec_sticky_status;
  logic phy1_sram_ded_sticky_status;
} PCIEPHY_CTRL_567_t;

typedef struct packed {
  logic [30:0] res_0;
  logic phy1_sram_init_done;
} PCIEPHY_CTRL_568_t;

typedef struct packed {
  logic [23:0] res_0;
  logic phy2_refb_clkdet_result;
  logic phy2_refa_clkdet_result;
  logic phy2_mpllb_state;
  logic phy2_mpllb_force_ack;
  logic phy2_mplla_state;
  logic phy2_mplla_force_ack;
  logic phy2_sram_sec_sticky_status;
  logic phy2_sram_ded_sticky_status;
} PCIEPHY_CTRL_569_t;

typedef struct packed {
  logic [30:0] res_0;
  logic phy2_sram_init_done;
} PCIEPHY_CTRL_570_t;

typedef struct packed {
  logic [23:0] res_0;
  logic phy3_refb_clkdet_result;
  logic phy3_refa_clkdet_result;
  logic phy3_mpllb_state;
  logic phy3_mpllb_force_ack;
  logic phy3_mplla_state;
  logic phy3_mplla_force_ack;
  logic phy3_sram_sec_sticky_status;
  logic phy3_sram_ded_sticky_status;
} PCIEPHY_CTRL_571_t;

typedef struct packed {
  logic [30:0] res_0;
  logic phy3_sram_init_done;
} PCIEPHY_CTRL_572_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx0_ppm_drift;
} PCIEPHY_CTRL_573_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx1_ppm_drift;
} PCIEPHY_CTRL_574_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx2_ppm_drift;
} PCIEPHY_CTRL_575_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx3_ppm_drift;
} PCIEPHY_CTRL_576_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx4_ppm_drift;
} PCIEPHY_CTRL_577_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx5_ppm_drift;
} PCIEPHY_CTRL_578_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx6_ppm_drift;
} PCIEPHY_CTRL_579_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx7_ppm_drift;
} PCIEPHY_CTRL_580_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx8_ppm_drift;
} PCIEPHY_CTRL_581_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx9_ppm_drift;
} PCIEPHY_CTRL_582_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx10_ppm_drift;
} PCIEPHY_CTRL_583_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx11_ppm_drift;
} PCIEPHY_CTRL_584_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx12_ppm_drift;
} PCIEPHY_CTRL_585_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx13_ppm_drift;
} PCIEPHY_CTRL_586_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx14_ppm_drift;
} PCIEPHY_CTRL_587_t;

typedef struct packed {
  logic [25:0] res_0;
  logic [5: 0] phy_rx15_ppm_drift;
} PCIEPHY_CTRL_588_t;

typedef struct packed {
  logic [28:0] res_0;
  logic [2: 0] upcs_max_payload_size_supt;
} PCIEPHY_CTRL_589_t;

endpackage : pcie_reg_pkg

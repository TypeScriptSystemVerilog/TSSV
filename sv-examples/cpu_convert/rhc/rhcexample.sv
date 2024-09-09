//////////////////////////////////////////////////////////////////////////////
//
//  Description: Top module with multiple SPRAM instances.
//               
//  Authors:   lhc
//  Version:   1.0
//
//////////////////////////////////////////////////////////////////////////////

module top_module (
    input logic clk,
    input logic clk2x,
    input logic rst_n,
    input logic [9:0] addr0,
    input logic [0:0] wr_en0,
    input logic [31:0] wr_data0,
    input logic rd_en0,
    output logic [31:0] rd_data0,

    input logic [10:0] addr1,
    input logic [0:0] wr_en1,
    input logic [31:0] wr_data1,
    input logic rd_en1,
    output logic [31:0] rd_data1,

    input logic [11:0] addr2,
    input logic [0:0] wr_en2,
    input logic [31:0] wr_data2,
    input logic rd_en2,
    output logic [31:0] rd_data2,

    `MEMC_SIF(0) mem_ctrl
);

    // Instantiation of rhc_spram with constant parameters
    rhc_spram #(
        .DATA_W(32),
        .DEPTH(1024),
        .WREN_W(1),
        .ADDR_W(10),
        .MODE_PHY(0),
        .MODE_IO(0)
    ) spram_instance0 (
        .clk(clk),
        .rst_n(rst_n),
        .mem_ctrl(mem_ctrl),
        .addr(addr0),
        .wr_en(wr_en0),
        .wr_data(wr_data0),
        .rd_en(rd_en0),
        .rd_data(rd_data0)
    );

    rhc_spram #(
        .DATA_W(32),
        .DEPTH(2048),
        .WREN_W(1),
        .ADDR_W(11),
        .MODE_PHY(0),
        .MODE_IO(0)
    ) spram_instance1 (
        .clk(clk),
        .rst_n(rst_n),
        .mem_ctrl(mem_ctrl),
        .addr(addr1),
        .wr_en(wr_en1),
        .wr_data(wr_data1),
        .rd_en(rd_en1),
        .rd_data(rd_data1)
    );

    rhc_spram #(
        .DATA_W(32),
        .DEPTH(4096),
        .WREN_W(1),
        .ADDR_W(12),
        .MODE_PHY(0),
        .MODE_IO(0)
    ) spram_instance2 (
        .clk(clk),
        .rst_n(rst_n),
        .mem_ctrl(mem_ctrl),
        .addr(addr2),
        .wr_en(wr_en2),
        .wr_data(wr_data2),
        .rd_en(rd_en2),
        .rd_data(rd_data2)
    );

    rhc_spram_phy #(
        .DATA_W(32),
        .DEPTH(4096),
        .WREN_W(1),
        .ADDR_W(12),
        .MODE(0),
        .MEMC_W(1)
    ) spram_instance3 (
        .clk(clk),
        .mem_ctrl(mem_ctrl),
        .addr(addr2),
        .wr_en(wr_en2),
        .wr_data(wr_data2),
        .rd_en(rd_en2),
        .rd_data(rd_data2)
    );
    // Instantiation of rhc_tpram with constant parameters
    rhc_tpram #(
        .DATA_W(32),
        .DEPTH(4096),
        .WREN_W(1),
        .ADDR_W(12),
        .MODE_PHY(0),
        .MODE_IO(0)
    ) tpram_instance0 (
        .clk(clk),
        .rst_n(rst_n),
        .mem_ctrl(mem_ctrl),
        .wr_en(wr_en0),
        .wr_addr(wr_addr0),
        .wr_data(wr_data0),
        .rd_en(rd_en0),
        .rd_addr(rd_addr0),
        .rd_data(rd_data0)
    );

    rhc_tpram_phy #(
        .DATA_W(32),
        .DEPTH(4096),
        .WREN_W(1),
        .ADDR_W(12),
        .MODE(0),
        .MEMC_W(1)
    ) tpram_instance1 (
        .clk(clk),
        .mem_ctrl(mem_ctrl),
        .wr_en(wr_en0),
        .wr_addr(wr_addr0),
        .wr_data(wr_data0),
        .rd_en(rd_en0),
        .rd_addr(rd_addr0),
        .rd_data(rd_data0)
    );

    rhc_tpram_s2x #(
        .DATA_W(32),
        .DEPTH(4096),
        .WREN_W(1),
        .ADDR_W(12),
        .MODE_PHY(0),
        .MODE_IO(0)
    ) tpram_instance2 (
        .clk(clk),
        .clk2x(clk2x),
        .rst_n(rst_n),
        .mem_ctrl(mem_ctrl),
        .wr_en(wr_en0),
        .wr_addr(wr_addr0),
        .wr_data(wr_data0),
        .rd_en(rd_en0),
        .rd_addr(rd_addr0),
        .rd_data(rd_data0)
    );

endmodule

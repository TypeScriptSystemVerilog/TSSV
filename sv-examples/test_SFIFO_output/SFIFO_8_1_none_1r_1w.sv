
        

        

        
/* verilator lint_off WIDTH */        
module SRAM_8_1_1r_1w_none_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   output logic [7:0] a_data_out,
   input logic  a_addr,
   input logic  b_we,
   input logic [7:0] b_data_in,
   input logic  b_addr
   );

   logic [7:0] mem;
   logic  addr_a_equal_b;
   logic  b_write_at_same_addr;

  assign addr_a_equal_b = ~(|(a_addr ^ b_addr));
  assign b_write_at_same_addr = b_we & addr_a_equal_b;

    always_ff @ (posedge clk) begin
        if(b_we) begin
            mem[b_addr] <= b_data_in;
        end
        if(a_re & ~b_write_at_same_addr) begin
            a_data_out <= mem[a_addr];
        end
        `ifndef SYNTHESIS
        else if(a_re & b_write_at_same_addr) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end
        `endif
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module SFIFO_8_1_none_1r_1w 
   (
   input logic  clk,
   input logic  rst_n,
   input logic [7:0] data_in,
   output logic [7:0] data_out,
   output logic  empty,
   output logic  full,
   output logic  curr_depth,
   input logic  rd_en,
   input logic  wr_en
   );

   logic  wr_addr;
   logic  rd_addr;
   logic  fifo_cnt;
   logic  sram_read_en;
   logic  sram_write_en;

  assign full = (fifo_cnt == 1'd1) ? 1'b1 : 1'b0;
  assign empty = ~(|fifo_cnt);
  assign curr_depth = fifo_cnt;
  assign sram_read_en = !empty && rd_en;
  assign sram_write_en = !full && wr_en;

    // fifo read
    always_ff @( posedge clk or negedge rst_n ) begin
        if (!rst_n) begin
            rd_addr <= 1'd0;
        end
        else if (sram_read_en) begin
            if (rd_addr == 1'd0) begin
                rd_addr <= 1'd0;
            end else begin
                rd_addr <= rd_addr + 1'd1;
                end
        end
    end
    
    // fifo write
    always_ff @( posedge clk or negedge rst_n ) begin
        if (!rst_n) begin
            wr_addr <= 1'd0;
        end
        else if (sram_write_en) begin
            if (wr_addr == 1'd0) begin
                wr_addr <= 1'd0;
            end else begin
                wr_addr <= wr_addr + 1'd1;
            end
        end
    end
    
    // Setting FIFO counter value for different situations of read and write operations
    always_ff @( posedge clk or negedge rst_n ) begin
        if(!rst_n) begin
            fifo_cnt <= 1'd0;
        end else if (sram_write_en && sram_read_en) begin
            fifo_cnt <= fifo_cnt;
        end else if (sram_write_en) begin
            fifo_cnt <= fifo_cnt + 1'd1;
        end else if (sram_read_en) begin
            fifo_cnt <= fifo_cnt - 1'd1;
        end
    end
    
    SRAM_8_1_1r_1w_none_undefOnWrite_default u_SFIFO_8_1_none_1r_1w_sram
      (
        .clk(clk),
        .a_re(sram_read_en),
        .a_data_out(data_out),
        .a_addr(rd_addr),
        .b_we(sram_write_en),
        .b_data_in(data_in),
        .b_addr(wr_addr)        
      );


endmodule
/* verilator lint_on WIDTH */        

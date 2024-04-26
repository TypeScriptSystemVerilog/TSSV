
        

        

        
/* verilator lint_off WIDTH */        
module SRAM_9_25_1rw_none_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [8:0] a_data_in,
   output logic [8:0] a_data_out,
   input logic [4:0] a_addr
   );

   logic [8:0] mem [0:24];


    always_ff @(posedge clk) begin 
        if(a_we) begin
            mem[a_addr] <= a_data_in;
        end
        if(a_re & ~a_we) begin
            a_data_out <= mem[a_addr];
        end
        `ifndef SYNTHESIS
        else if(a_re & a_we ) begin //output is X after reading and writing the same address at the same time
            a_data_out <= 'hx;
        end 
        `endif
    end          
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module SFIFO_9_25_InclAlmostDepth_1rw 
   (
   input logic  clk,
   input logic  rst_n,
   input logic [8:0] data_in,
   output logic [8:0] data_out,
   output logic  empty,
   output logic  full,
   output logic [4:0] curr_depth,
   input logic  rw_en,
   input logic  rw,
   output logic  almost_full,
   output logic  almost_empty
   );

   logic [4:0] wr_addr;
   logic [4:0] rd_addr;
   logic [4:0] fifo_cnt;
   logic  sram_read_en;
   logic  sram_write_en;
   logic  rd_en;
   logic  wr_en;
   logic [4:0] sram_a_addr;

  assign wr_en = rw_en && rw;
  assign rd_en = rw_en && ~rw;
  assign sram_a_addr = sram_write_en ? wr_addr : rd_addr;
  assign full = (fifo_cnt == 5'd25) ? 1'b1 : 1'b0;
  assign empty = ~(|fifo_cnt);
  assign curr_depth = fifo_cnt;
  assign almost_full = (fifo_cnt >= 24) ? 1 : 0;
  assign almost_empty = (fifo_cnt <= 1) ? 1 : 0;
  assign sram_read_en = !empty && rd_en;
  assign sram_write_en = !full && wr_en;

    // fifo read
    always_ff @( posedge clk or negedge rst_n ) begin
        if (!rst_n) begin
            rd_addr <= 5'd0;
        end
        else if (sram_read_en) begin
            if (rd_addr == 5'd24) begin
                rd_addr <= 5'd0;
            end else begin
                rd_addr <= rd_addr + 5'd1;
                end
        end
    end
    
    // fifo write
    always_ff @( posedge clk or negedge rst_n ) begin
        if (!rst_n) begin
            wr_addr <= 5'd0;
        end
        else if (sram_write_en) begin
            if (wr_addr == 5'd24) begin
                wr_addr <= 5'd0;
            end else begin
                wr_addr <= wr_addr + 5'd1;
            end
        end
    end
    
    // Setting FIFO counter value for different situations of read and write operations
    always_ff @( posedge clk or negedge rst_n ) begin
        if(!rst_n) begin
            fifo_cnt <= 5'd0;
        end else begin
            if (sram_write_en) begin
                fifo_cnt <= fifo_cnt + 5'd1;
            end
            if (sram_read_en) begin
                fifo_cnt <= fifo_cnt - 5'd1;
            end
        end
    end
    
    SRAM_9_25_1rw_none_undefOnWrite_default u_SFIFO_9_25_InclAlmostDepth_1rw_sram
      (
        .clk(clk),
        .a_re(sram_read_en),
        .a_we(sram_write_en),
        .a_data_in(data_in),
        .a_data_out(data_out),
        .a_addr(sram_a_addr)        
      );


endmodule
/* verilator lint_on WIDTH */        

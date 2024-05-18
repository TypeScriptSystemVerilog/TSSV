
        

        
/* verilator lint_off WIDTH */        
module SRAM_8_32_2rw_bit_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [7:0] a_data_in,
   output logic [7:0] a_data_out,
   input logic [4:0] a_addr,
   input logic  b_re,
   input logic  b_we,
   input logic [7:0] b_data_in,
   output logic [7:0] b_data_out,
   input logic [4:0] b_addr,
   input logic [7:0] a_wmask,
   input logic [7:0] b_wmask
   );

   logic [7:0] mem [0:31];
   logic  addr_a_equal_b;
   logic  b_write_at_same_addr;
   logic  a_write_at_same_addr;
   logic  a_rw_conflict;
   logic  b_rw_conflict;

  assign addr_a_equal_b = ~(|(a_addr ^ b_addr));
  assign b_write_at_same_addr = b_we & addr_a_equal_b;
  assign a_write_at_same_addr = a_we & addr_a_equal_b;
  assign a_rw_conflict = a_we | b_write_at_same_addr;
  assign b_rw_conflict = b_we | a_write_at_same_addr;

    always_ff @(posedge clk) begin
        for(integer i=0; i<8; i=i+1) begin
            if(a_we & a_wmask[i] & ~(b_write_at_same_addr & b_wmask[i])) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_we & a_wmask[i] & (b_write_at_same_addr & b_wmask[i])) begin //output is X after reading and writing the same address at the same time
                mem[a_addr][i*1 +: 1] <= 'hx;
            end
            `endif
        end
        for(integer i=0; i<8; i=i+1) begin
            if(a_re & ~a_rw_conflict) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_rw_conflict & ~((a_we & a_wmask[i]) | (b_write_at_same_addr & b_wmask[i]))) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_rw_conflict & ((a_we & a_wmask[i]) | (b_write_at_same_addr & b_wmask[i]))) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end
            `endif
        end
        
    end
    
    always_ff @(posedge clk) begin
        for(integer i=0; i<8; i=i+1) begin
            if(b_we & b_wmask[i] & ~(a_write_at_same_addr & a_wmask[i])) begin
                mem[b_addr][i*1 +: 1] <= b_data_in[i*1 +: 1];
            end 
            `ifndef SYNTHESIS
            else if(b_we & b_wmask[i] & (a_write_at_same_addr & a_wmask[i])) begin //output is X after reading and writing the same address at the same time
                mem[b_addr][i*1 +: 1] <= 'hx;
            end
            `endif
        end
        for(integer i=0; i<8; i=i+1) begin
            if(b_re & ~b_rw_conflict) begin
                b_data_out <= mem[b_addr][i*1 +: 1];
            end
            else if(b_re & b_rw_conflict & ~((b_we & b_wmask[i]) | (a_write_at_same_addr & a_wmask[i]))) begin
                b_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(b_re & b_rw_conflict & ((b_we & b_wmask[i]) | (a_write_at_same_addr & a_wmask[i]))) begin //output is X after reading and writing the same address at the same time
                b_data_out[i*1 +: 1] <= 'hx;
            end
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

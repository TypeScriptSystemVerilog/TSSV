
        

        
/* verilator lint_off WIDTH */        
module SRAM_32_256_1r_1w_byte_readBeforeWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   output logic [31:0] a_data_out,
   input logic [7:0] a_addr,
   input logic  b_we,
   input logic [31:0] b_data_in,
   input logic [7:0] b_addr,
   input logic [3:0] b_wmask
   );

   logic [31:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<4; i=i+1) begin
            if(b_we & b_wmask[i]) begin
                mem[b_addr][i*8 +: 8] <= b_data_in[i*8 +: 8];
            end
        end
        for(integer i=0; i<4; i=i+1) begin
            if(a_re) begin
                a_data_out <= mem[a_addr][i*8 +: 8];
            end
            
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

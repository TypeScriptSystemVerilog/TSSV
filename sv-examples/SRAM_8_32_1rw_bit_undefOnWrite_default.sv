
        

        
/* verilator lint_off WIDTH */        
module SRAM_8_32_1rw_bit_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [7:0] a_data_in,
   output logic [7:0] a_data_out,
   input logic [4:0] a_addr,
   input logic [7:0] a_wmask
   );

   logic [7:0] mem [0:31];


    always_ff @(posedge clk) begin
        for(integer i=0; i<8; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end else if(a_re) begin
                a_data_out <= mem[a_addr];
            end
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

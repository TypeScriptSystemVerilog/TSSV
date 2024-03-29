
        

        
/* verilator lint_off WIDTH */        
module SRAM_8_32_1r_1w_byte_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   output logic [7:0] a_data_out,
   input logic [4:0] a_addr,
   input logic  b_we,
   input logic [7:0] b_data_in,
   input logic [4:0] b_addr,
   input logic  b_wmask
   );

   logic [7:0] mem [0:31];


    always_ff @(posedge clk) begin
        if(b_we & b_wmask) begin
            mem[b_addr] <= b_data_in;
        end 
    end
    
    always_ff @ (posedge clk) begin
        if(a_re) begin
          a_data_out <= mem[a_addr];
        end
    end
                

endmodule
/* verilator lint_on WIDTH */        

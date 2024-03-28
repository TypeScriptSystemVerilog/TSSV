
        

        
/* verilator lint_off WIDTH */        
module SRAM_256_2049_1r_1w_none_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   output logic [255:0] a_data_out,
   input logic [11:0] a_addr,
   input logic  b_we,
   input logic [255:0] b_data_in,
   input logic [11:0] b_addr
   );

   logic [255:0] mem [0:2048];


    always_ff @ (posedge clk) begin
     if(b_we) begin
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

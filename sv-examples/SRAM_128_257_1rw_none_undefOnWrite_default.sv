
        

        
/* verilator lint_off WIDTH */        
module SRAM_128_257_1rw_none_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [127:0] a_data_in,
   output logic [127:0] a_data_out,
   input logic [8:0] a_addr
   );

   logic [127:0] mem [0:256];


     always_ff @(posedge clk)
       begin 
         if(a_we) begin
           mem[a_addr] <= a_data_in;
           end
         else if(a_re) begin
           a_data_out <= mem[a_addr];
           end
       end          
    

endmodule
/* verilator lint_on WIDTH */        

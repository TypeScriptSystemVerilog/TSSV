
        

        
/* verilator lint_off WIDTH */        
module SRAM_256_2048_2rw_none_undefOnWrite_default 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [255:0] a_data_in,
   output logic [255:0] a_data_out,
   input logic [10:0] a_addr,
   input logic  b_re,
   input logic  b_we,
   input logic [255:0] b_data_in,
   output logic [255:0] b_data_out,
   input logic [10:0] b_addr
   );

   logic [255:0] mem [0:2047];


    always_ff @ (posedge clk) begin
     if(a_we) begin
       mem[a_addr] <= a_data_in;
     end 
     else if(a_re) begin
       a_data_out <= mem[a_addr];
     end
    end
                
    always_ff @ (posedge clk) begin
     if(b_we) begin
       mem[b_addr] <= b_data_in;
     end 
     else if(b_re) begin
       b_data_out <= mem[b_addr];
     end
    end
                

endmodule
/* verilator lint_on WIDTH */        

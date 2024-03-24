
        

        
/* verilator lint_off WIDTH */        
module testMem_8_32 
   (
   input logic [7:0] data_in,
   input logic [5:0] addr,
   input logic  we,
   input logic  re,
   input logic  clk,
   output logic signed [7:0] data_out
   );

   logic [7:0] mem [0:31];


  always_ff @(posedge clk)
    begin
      if(we)
        mem[addr] <= data_in;
      if(re)
        data_out <= mem[addr];
    end          


endmodule
/* verilator lint_on WIDTH */        

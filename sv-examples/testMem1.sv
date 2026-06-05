
            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module testMem_8_32     #(parameter dataWidth = 8)
       (
       input logic [7:0] data_in,
   input logic [5:0] addr,
   input logic  we,
   input logic  re,
   input logic  clk,
   output logic [7:0] data_out
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
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    
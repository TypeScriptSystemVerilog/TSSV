
        

        
/* verilator lint_off WIDTH */        
module comb_seq_test 
   (
   input wire  clk,
   input wire  rst_b,
   input wire  en,
   input wire [4:0] data_in,
   output logic [4:0] data_out,
   input wire  a,
   input wire  b,
   output logic  c
   );

   

always_ff @( posedge clk or negedge rst_b )

        begin
          data_out <= data_in;  
        end 

        
        always_ff @( posedge clk or negedge rst_b )
            begin
              data_out <= data_in;  
            end
        always @( a or b )
            begin
              c = a & b;  
            end
        
        always @( a or b )
            begin
              c = a & b;  
            end
        

endmodule
/* verilator lint_on WIDTH */        

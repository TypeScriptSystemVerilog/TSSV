
            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module comb_seq_test     #(parameter data_Width = 5)
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
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    
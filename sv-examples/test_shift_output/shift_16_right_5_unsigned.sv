
            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module shift_16_right_5_unsigned     #(parameter dataWidth = 16,
    parameter shift_val = 5)
       (
       input logic [15:0] data_in,
   output logic [15:0] data_out
       );
    
    
    
    assign data_out = {{5{1'b0}},data_in[15:5]};


    

    
    
    endmodule
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    

            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module shift_5_right_3_unsigned     #(parameter dataWidth = 5,
    parameter shift_val = 3)
       (
       input logic [4:0] data_in,
   output logic [4:0] data_out
       );
    
    
    
    assign data_out = {{3{1'b0}},data_in[4:3]};


    

    
    
    endmodule
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    

        

        
/* verilator lint_off WIDTH */        
module shift_16_right_5_unsigned 
   (
   input logic [15:0] data_in,
   output logic [15:0] data_out
   );

   

  assign data_out = {{5{1'b0}},data_in[15:5]};


endmodule
/* verilator lint_on WIDTH */        

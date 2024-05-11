
        

        
/* verilator lint_off WIDTH */        
module shift_5_right_3_unsigned 
   (
   input logic [4:0] data_in,
   output logic [4:0] data_out
   );

   

  assign data_out = {{3{1'b0}},data_in[4:3]};


endmodule
/* verilator lint_on WIDTH */        

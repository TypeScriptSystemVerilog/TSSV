
        

        
/* verilator lint_off WIDTH */        
module shift_16_right_5_signed 
   (
   input logic [15:0] data_in,
   output logic [15:0] data_out
   );

   

  assign data_out = {{5{data_in[15]}},data_in[15:5]};


endmodule
/* verilator lint_on WIDTH */        

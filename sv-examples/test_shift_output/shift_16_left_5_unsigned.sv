
        

        
/* verilator lint_off WIDTH */        
module shift_16_left_5_unsigned 
   (
   input logic [15:0] data_in,
   output logic [20:0] data_out
   );

   

  assign data_out = {data_in,{5{1'b0}}};


endmodule
/* verilator lint_on WIDTH */        

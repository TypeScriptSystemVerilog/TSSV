
        

        
/* verilator lint_off WIDTH */        
module ROM_9_5_normal_array_test 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [2:0] addr,
   output logic [8:0] data_out
   );

   


      always_ff @(posedge clk) begin
          if (rd_en) begin
              case(addr)
                  3'd0: data_out <= 9'h1FB;
                  3'd1: data_out <= 9'h101;
                  3'd2: data_out <= 9'h000;
                  3'd3: data_out <= 9'h0FF;
                  3'd4: data_out <= 9'h1FF;

                  default: data_out <= 9'hx;
              endcase
          end
      end
      

endmodule
/* verilator lint_on WIDTH */        

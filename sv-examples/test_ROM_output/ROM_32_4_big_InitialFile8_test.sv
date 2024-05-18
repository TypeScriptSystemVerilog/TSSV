
        

        
/* verilator lint_off WIDTH */        
module ROM_32_4_big_InitialFile8_test 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [1:0] addr,
   output logic [31:0] data_out
   );

   


      always_ff @(posedge clk) begin
          if (rd_en) begin
              case(addr)
                  2'd0: data_out <= 32'h00010203;
                  2'd1: data_out <= 32'h04050607;
                  2'd2: data_out <= 32'h08090A0B;
                  2'd3: data_out <= 32'h0C0D0E0F;

                  default: data_out <= 32'hx;
              endcase
          end
      end
      

endmodule
/* verilator lint_on WIDTH */        

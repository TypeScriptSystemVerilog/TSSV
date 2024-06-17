
        

        
/* verilator lint_off WIDTH */        
module ROM_32_4_uint8array_little_test 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [2:0] addr,
   output logic [31:0] data_out
   );

   


      always_ff @(posedge clk) begin
          if (rd_en) begin
              case(addr)
                  3'd0: data_out <= 32'h03020100;
                  3'd1: data_out <= 32'h07060504;
                  3'd2: data_out <= 32'h0B0A0908;
                  3'd3: data_out <= 32'h01FF0D0C;
                  3'd4: data_out <= 32'hundefinedundefinedundefined20;

                  default: data_out <= 32'hx;
              endcase
          end
      end
      

endmodule
/* verilator lint_on WIDTH */        

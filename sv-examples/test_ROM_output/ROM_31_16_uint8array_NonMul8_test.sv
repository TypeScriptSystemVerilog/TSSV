
        

        
/* verilator lint_off WIDTH */        
module ROM_31_16_uint8array_NonMul8_test 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [4:0] addr,
   output logic [30:0] data_out
   );

   


      always_ff @(posedge clk) begin
          if (rd_en) begin
              case(addr)
                  5'd0: data_out <= 31'h00000000;
                  5'd1: data_out <= 31'h00000001;
                  5'd2: data_out <= 31'h00000002;
                  5'd3: data_out <= 31'h00000003;
                  5'd4: data_out <= 31'h00000004;
                  5'd5: data_out <= 31'h00000005;
                  5'd6: data_out <= 31'h00000006;
                  5'd7: data_out <= 31'h00000007;
                  5'd8: data_out <= 31'h00000008;
                  5'd9: data_out <= 31'h00000009;
                  5'd10: data_out <= 31'h0000000A;
                  5'd11: data_out <= 31'h0000000B;
                  5'd12: data_out <= 31'h0000000C;
                  5'd13: data_out <= 31'h0000000D;
                  5'd14: data_out <= 31'h000000FF;
                  5'd15: data_out <= 31'h00000001;
                  5'd16: data_out <= 31'h00000020;

                  default: data_out <= 31'hx;
              endcase
          end
      end
      

endmodule
/* verilator lint_on WIDTH */        

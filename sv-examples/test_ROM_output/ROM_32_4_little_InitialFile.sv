
        

        
/* verilator lint_off WIDTH */        
module ROM_32_4_little_InitialFile 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [3:0] addr,
   output logic [8:0] data_out
   );

   


    always_ff @(posedge clk) begin
        if (rd_en) begin
            case(addr)
                5'd0: data_out <= 9'h000;
                5'd1: data_out <= 9'h001;
                5'd2: data_out <= 9'h002;
                5'd3: data_out <= 9'h003;
                5'd4: data_out <= 9'h004;
                5'd5: data_out <= 9'h005;
                5'd6: data_out <= 9'h006;
                5'd7: data_out <= 9'h007;
                5'd8: data_out <= 9'h008;
                5'd9: data_out <= 9'h009;
                5'd10: data_out <= 9'h00A;
                5'd11: data_out <= 9'h00B;
                5'd12: data_out <= 9'h00C;
                5'd13: data_out <= 9'h00D;
                5'd14: data_out <= 9'h00E;
                5'd15: data_out <= 9'h00F;

                default: data_out <= 9'hx;
            endcase
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

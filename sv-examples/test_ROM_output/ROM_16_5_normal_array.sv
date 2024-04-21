
        

        
/* verilator lint_off WIDTH */        
module ROM_16_5_normal_array 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [2:0] addr,
   output logic [15:0] data_out
   );

   


    always_ff @(posedge clk) begin
        if (rd_en) begin
            case(addr)
                3'd0: data_out <= 16'hFFFB;
                3'd1: data_out <= 16'hFF01;
                3'd2: data_out <= 16'h0000;
                3'd3: data_out <= 16'h7FFF;
                3'd4: data_out <= 16'h8001;

                default: data_out <= 16'hx;
            endcase
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

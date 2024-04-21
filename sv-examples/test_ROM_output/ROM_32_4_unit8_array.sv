
        

        
/* verilator lint_off WIDTH */        
module ROM_32_4_unit8_array 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [1:0] addr,
   output logic [31:0] data_out
   );

   


    always_ff @(posedge clk) begin
        if (rd_en) begin
            case(addr)
                3'd0: data_out <= 32'h00010203;
                3'd1: data_out <= 32'h04050607;
                3'd2: data_out <= 32'h08090A0B;
                3'd3: data_out <= 32'h0C0DFF01;

                default: data_out <= 32'hx;
            endcase
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

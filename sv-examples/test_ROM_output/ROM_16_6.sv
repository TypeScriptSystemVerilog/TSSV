
        

        
/* verilator lint_off WIDTH */        
module ROM_16_6 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [2:0] addr,
   output logic [15:0] data_out
   );

   


    always_ff @(posedge clk) begin
        if (rd_en) begin
            case(addr)
                3'd0: data_out <= 16'h1111;
                3'd1: data_out <= 16'h2222;
                3'd2: data_out <= 16'h3333;
                3'd3: data_out <= 16'h4444;
                3'd4: data_out <= 16'h5555;
                3'd5: data_out <= 16'hAAAA;

                default: data_out <= 16'hx;
            endcase
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

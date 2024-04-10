
        

        
/* verilator lint_off WIDTH */        
module myROM 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [1:0] addr,
   output logic [15:0] data_out
   );

   


    always_ff @(posedge clk) begin
        if (rd_en) begin
            case(addr)
                3'd0: data_out <= 16'h0457;
                3'd1: data_out <= 16'h15B3;
                3'd2: data_out <= 16'hAAAA;
                3'd3: data_out <= 16'hFFFF;

                default: data_out <= 16'hx;
            endcase
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

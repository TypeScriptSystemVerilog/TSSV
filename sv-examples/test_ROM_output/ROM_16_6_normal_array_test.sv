
            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module ROM_16_6_normal_array_test     #(parameter dataWidth = 16)
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
                  3'd3: data_out <= 16'h00FF;
                  3'd4: data_out <= 16'h7FFF;
                  3'd5: data_out <= 16'h8001;

                  default: data_out <= 16'hx;
              endcase
          end
      end
      

    

    
    
    endmodule
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    
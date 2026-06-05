
            
    
            
    /* verilator lint_off WIDTH */
/* verilator lint_off MULTIDRIVEN */
/* verilator lint_off WIDTHTRUNC */
/* verilator lint_off WIDTHEXPAND */        
    module ROM_32_4_little_InitialFile8_test     #(parameter dataWidth = 32)
       (
       input logic  clk,
   input logic  rd_en,
   input logic [1:0] addr,
   output logic [31:0] data_out
       );
    
    
    
    
      always_ff @(posedge clk) begin
          if (rd_en) begin
              case(addr)
                  2'd0: data_out <= 32'h03020100;
                  2'd1: data_out <= 32'h07060504;
                  2'd2: data_out <= 32'h0B0A0908;
                  2'd3: data_out <= 32'h0F0E0D0C;

                  default: data_out <= 32'hx;
              endcase
          end
      end
      

    

    
    
    endmodule
    /* verilator lint_on WIDTHEXPAND */
/* verilator lint_on WIDTHTRUNC */
/* verilator lint_on MULTIDRIVEN */
/* verilator lint_on WIDTH */       
    

        

        

        
/* verilator lint_off WIDTH */        
module ROM_32_big_split2two_lower 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [2:0] addr,
   output logic [31:0] data_out
   );

   


      always_ff @(posedge clk) begin
          if (rd_en) begin
              case(addr)
                  3'd0: data_out <= 32'h0A0B0C0D;
                  3'd1: data_out <= 32'h01020304;
                  3'd2: data_out <= 32'h0A0A0B0B;
                  3'd3: data_out <= 32'h0000FFFF;
                  3'd4: data_out <= 32'hFFFF0001;
                  3'd5: data_out <= 32'h000000FF;
                  3'd6: data_out <= 32'hFFFFFF01;
                  3'd7: data_out <= 32'hAAAAAAAA;

                  default: data_out <= 32'hx;
              endcase
          end
      end
      

endmodule
/* verilator lint_on WIDTH */        

        

        
/* verilator lint_off WIDTH */        
module ROM_32_big_split2two_upper 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [1:0] addr,
   output logic [31:0] data_out
   );

   


      always_ff @(posedge clk) begin
          if (rd_en) begin
              case(addr)
                  2'd0: data_out <= 32'h00000055;
                  2'd1: data_out <= 32'h00559ABC;
                  2'd2: data_out <= 32'h00000000;
                  2'd3: data_out <= 32'h00000000;

                  default: data_out <= 32'hx;
              endcase
          end
      end
      

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module ROM_32_big_split2two 
   (
   input logic  clk,
   input logic  rd_en,
   input logic [3:0] addr,
   output logic [31:0] data_out
   );

   logic  rd_en_l;
   logic  rd_en_u;
   logic  rd_en_l_d1;
   logic  rd_en_u_d1;
   logic [31:0] data_out_l;
   logic [31:0] data_out_u;
   logic [2:0] addr_l;
   logic  addr_u;

  assign rd_en_l = !addr[3] && rd_en;
  assign rd_en_u = addr[3] && (addr < 10) && rd_en;
  assign data_out = rd_en_l_d1? data_out_l : rd_en_u_d1? data_out_u : 'hx;
  assign addr_l = addr[2:0];
  assign addr_u = addr[0:0];

   always_ff @( posedge clk  )
   
        begin
           rd_en_l_d1 <= rd_en_l;
           rd_en_u_d1 <= rd_en_u;
        end

    ROM_32_big_split2two_lower u_ROM_32_big_split2two_lower
      (
        .clk(clk),
        .rd_en(rd_en_l),
        .addr(addr_l),
        .data_out(data_out_l)        
      );

    ROM_32_big_split2two_upper u_ROM_32_big_split2two_upper
      (
        .clk(clk),
        .rd_en(rd_en_u),
        .addr(addr_u),
        .data_out(data_out_u)        
      );


endmodule
/* verilator lint_on WIDTH */        

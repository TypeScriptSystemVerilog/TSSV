/* verilator lint_off DECLFILENAME */
/* verilator lint_off UNUSED */

        

        

        
/* verilator lint_off WIDTH */        
module counter4b 
   (
   input logic  clk,
   input logic  reset,
   output logic [3:0] q
   );

   


   always_ff @( posedge clk  )
     if(reset)
        begin
           q <= 'd0;
        end
      else 
        begin
           q <= q + 4'd1;
        end


endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module tb_counter 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic  reset;
   logic [31:0] cycle_count;
   logic [3:0] q;


    always @(posedge clk)
      begin
        cycle_count <= cycle_count + 1;
        if (cycle_count < 3)
          reset <= 1'b1;
        else if (cycle_count == 21)
          reset <= 1'b1;
        else
          reset <= 1'b0;
      end

    counter4b dut
      (
        .clk(clk),
        .reset(reset),
        .q(q)        
      );


endmodule
/* verilator lint_on WIDTH */        


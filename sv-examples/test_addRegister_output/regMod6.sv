
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module addRegisterSync_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic  reset_sync;
   logic  d;
   logic  d_q;



logic [15:0] count;
always @(posedge clk or negedge rst_b) begin // remove or negedge rst
if(!rst_b) // changed to rst_b from rst
begin
  count <= 'd0;
  reset_sync <= 1'b0;
end
else
begin
  count <= count + 1'b1;
  reset_sync <= 1'b1;
  case (count)
  'd0: begin
  d <= 0;
  assert(d_q == 0) else $fatal("Assertion failed: d_q should be 0 at time %0t", $time);
  end
  'd1: begin
  d <= 1;
  assert(d_q == 0) else $fatal("Assertion failed: d_q should be 0 at time %0t", $time);
  end
  'd2: begin
  d <= 0;
  assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
  end
  'd3: begin
  d <= 1;
  assert(d_q == 0) else $fatal("Assertion failed: d_q should be 0 at time %0t", $time);
  end
  'd4: begin
  d <= 1;
  assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
  end
  default: d <= 0;
  endcase
  end
end

   always_ff @( posedge clk  )
     if(!reset_sync)
        begin
           d_q <= 'd0;
        end
      else 
        begin
           d_q <= d;
        end


endmodule
/* verilator lint_on WIDTH */        


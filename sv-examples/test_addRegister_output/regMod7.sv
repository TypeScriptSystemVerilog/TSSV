
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module addRegisterSyncH_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic  d;
   logic  rst;
   logic  d_q;


    logic [15:0] count;
    initial begin
      count = 'd0;
      rst =1'b1;
    end
    always @(posedge clk or negedge rst_b) begin // remove or negedge rst
    if(!rst_b) // changed to rst_b from rst
    begin
      rst <= 1'b1;
      count <= count + 1'b1;
      case (count)
      'd0: begin
      d <= 0;
      assert(d_q == 0) else $fatal("Assertion failed: d_q should be 0 at time %0t", $time);
      end
      'd1: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      'd2: begin
      d <= 0;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      'd3: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      'd4: begin
      d <= 1;
      assert(d_q == 1) else $fatal("Assertion failed: d_q should be 1 at time %0t", $time);
      end
      default: d <= 0;
      endcase
    end
    else
    begin
      rst <= 1'b0;
      end
    end

   always_ff @( posedge clk  )
     if(rst)
        begin
           d_q <= 'd1;
        end
      else 
        begin
           d_q <= d;
        end


endmodule
/* verilator lint_on WIDTH */        


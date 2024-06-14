
    /* verilator lint_off DECLFILENAME */
    /* verilator lint_off UNUSED */
    
        

        
/* verilator lint_off WIDTH */        
module addRegisterEn_tb 
   (
   input logic  clk,
   input logic  rst_b
   );

   logic [7:0] dSig4;
   logic  en;
   logic [7:0] q;


    logic [15:0] count;
    always @(posedge clk or negedge rst_b)
    if(!rst_b)
    begin
      count <= 'd0;
    end
    else
    begin
      count <= count + 1'b1;

    case (count)
      'd0: begin
        dSig4 <= 8'b00000000;
        en <= 1;
        assert(q == 8'b00001000) else $fatal("Assertion failed: q should be 8'b00001000 at count %0d", count);
      end
      'd1: begin
        dSig4 <= 8'b00000001;
        en <= 1;
        assert(q == 8'b00000000) else $fatal("Assertion failed: q should be 8'b00000000 at count %0d", count);
      end
      'd2: begin
        dSig4 <= 8'b00000010;
        en <= 0;
        assert(q == 8'b00000001) else $fatal("Assertion failed: q should be 8'b00000001 at count %0d", count);
      end
      'd3: begin
        dSig4 <= 8'b00000011;
        en <= 1;
        assert(q == 8'b00000001) else $fatal("Assertion failed: q should be 8'b00000001 at count %0d", count);
      end
      'd4: begin
        dSig4 <= 8'b00000100;
        en <= 1;
        assert(q == 8'b00000011) else $fatal("Assertion failed: q should be 8'b00000011 at count %0d", count);
      end
      default: begin
        dSig4 <= 8'b00000000;
        en <= 0;
        assert(q == 8'b00000100) else $fatal("Assertion failed: q should be 8'b00000100 at count %0d", count);
      end
    endcase
    end

   always_ff @( posedge clk  or negedge rst_b )
     if(!rst_b)
        begin
           q <= 'd8;
        end
      else if(en)
        begin
           q <= dSig4;
        end


endmodule
/* verilator lint_on WIDTH */        


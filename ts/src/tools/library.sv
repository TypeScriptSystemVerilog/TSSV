
        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [123:0] a_data_in,
   output logic [123:0] a_data_out,
   input logic [6:0] a_addr,
   input logic [123:0] a_wmask
   );

   logic [123:0] mem [0:127];


    always_ff @(posedge clk) begin
        for(integer i=0; i<124; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<124; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_128x124_31bw 
   (
   input logic [6:0] a,
   input logic  cen,
   input logic  clk,
   input logic [123:0] d,
   input logic  gwen,
   input logic [123:0] wen,
   output logic [123:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [25:0] a_data_in,
   output logic [25:0] a_data_out,
   input logic [6:0] a_addr,
   input logic [25:0] a_wmask
   );

   logic [25:0] mem [0:127];


    always_ff @(posedge clk) begin
        for(integer i=0; i<26; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<26; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_128x26_13bw 
   (
   input logic [6:0] a,
   input logic  cen,
   input logic  clk,
   input logic [25:0] d,
   input logic  gwen,
   input logic [25:0] wen,
   output logic [25:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [47:0] a_data_in,
   output logic [47:0] a_data_out,
   input logic [6:0] a_addr,
   input logic [47:0] a_wmask
   );

   logic [47:0] mem [0:127];


    always_ff @(posedge clk) begin
        for(integer i=0; i<48; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<48; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_128x48_24bw 
   (
   input logic [6:0] a,
   input logic  cen,
   input logic  clk,
   input logic [47:0] d,
   input logic  gwen,
   input logic [47:0] wen,
   output logic [47:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [57:0] a_data_in,
   output logic [57:0] a_data_out,
   input logic [6:0] a_addr,
   input logic [57:0] a_wmask
   );

   logic [57:0] mem [0:127];


    always_ff @(posedge clk) begin
        for(integer i=0; i<58; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<58; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_128x58_29bw 
   (
   input logic [6:0] a,
   input logic  cen,
   input logic  clk,
   input logic [57:0] d,
   input logic  gwen,
   input logic [57:0] wen,
   output logic [57:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [83:0] a_data_in,
   output logic [83:0] a_data_out,
   input logic [6:0] a_addr,
   input logic [83:0] a_wmask
   );

   logic [83:0] mem [0:127];


    always_ff @(posedge clk) begin
        for(integer i=0; i<84; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<84; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_128x84_1_42bw 
   (
   input logic [6:0] a,
   input logic  cen,
   input logic  clk,
   input logic [83:0] d,
   input logic  gwen,
   input logic [83:0] wen,
   output logic [83:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [97:0] a_data_in,
   output logic [97:0] a_data_out,
   input logic [6:0] a_addr,
   input logic [97:0] a_wmask
   );

   logic [97:0] mem [0:127];


    always_ff @(posedge clk) begin
        for(integer i=0; i<98; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<98; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_128x98_49bw 
   (
   input logic [6:0] a,
   input logic  cen,
   input logic  clk,
   input logic [97:0] d,
   input logic  gwen,
   input logic [97:0] wen,
   output logic [97:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [20:0] a_data_in,
   output logic [20:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [20:0] a_wmask
   );

   logic [20:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<21; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<21; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_256x21_nobw 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [20:0] d,
   input logic  gwen,
   input logic [20:0] wen,
   output logic [20:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_256x32_2bw 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [8:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:511];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_512x32_8bw 
   (
   input logic [8:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [67:0] a_data_in,
   output logic [67:0] a_data_out,
   input logic [8:0] a_addr,
   input logic [67:0] a_wmask
   );

   logic [67:0] mem [0:511];


    always_ff @(posedge clk) begin
        for(integer i=0; i<68; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<68; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_512x68_nobw 
   (
   input logic [8:0] a,
   input logic  cen,
   input logic  clk,
   input logic [67:0] d,
   input logic  gwen,
   input logic [67:0] wen,
   output logic [67:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [123:0] a_data_in,
   output logic [123:0] a_data_out,
   input logic [5:0] a_addr,
   input logic [123:0] a_wmask
   );

   logic [123:0] mem [0:63];


    always_ff @(posedge clk) begin
        for(integer i=0; i<124; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<124; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_64x124_31bw 
   (
   input logic [5:0] a,
   input logic  cen,
   input logic  clk,
   input logic [123:0] d,
   input logic  gwen,
   input logic [123:0] wen,
   output logic [123:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


        

        

        
/* verilator lint_off WIDTH */        
module sram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [19:0] a_data_in,
   output logic [19:0] a_data_out,
   input logic [5:0] a_addr,
   input logic [19:0] a_wmask
   );

   logic [19:0] mem [0:63];


    always_ff @(posedge clk) begin
        for(integer i=0; i<20; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<20; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module pc_spsram_64x20 
   (
   input logic [5:0] a,
   input logic  cen,
   input logic  clk,
   input logic [19:0] d,
   input logic  gwen,
   input logic [19:0] wen,
   output logic [19:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        


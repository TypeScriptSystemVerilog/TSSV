// Input for ts/test/test_importFileList.ts: a second module built on fl_pkg and fl_sub
module fl_other
   (
   input  logic [fl_pkg::W-1:0] a,
   output logic [fl_pkg::W-1:0] y
   );
   logic [fl_pkg::W-1:0] inv;
   fl_sub u_sub (.a(a), .y(inv));
   assign y = inv ^ a;
endmodule

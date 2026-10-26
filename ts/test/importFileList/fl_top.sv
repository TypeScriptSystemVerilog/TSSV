// Input for ts/test/test_importFileList.ts: the module fl_top.f is named after
module fl_top
   (
   input  logic [fl_pkg::W-1:0] a,
   output logic [fl_pkg::W-1:0] y
   );
   fl_sub u_sub (.a(a), .y(y));
endmodule

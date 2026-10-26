// Input for ts/test/test_importFileList.ts: a leaf that fl_top and fl_other both instantiate
module fl_sub
   (
   input  logic [fl_pkg::W-1:0] a,
   output logic [fl_pkg::W-1:0] y
   );
   assign y = ~a;
endmodule

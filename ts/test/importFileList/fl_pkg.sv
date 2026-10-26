// Input for ts/test/test_importFileList.ts: a package that fl_sub and fl_top use.
// TSSV emits an imported file inside a file named after a module, so the package's name never
// matches its file's.
/* verilator lint_off DECLFILENAME */
package fl_pkg;
   localparam int unsigned W = 8;
endpackage
/* verilator lint_on DECLFILENAME */

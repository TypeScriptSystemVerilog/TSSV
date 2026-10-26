// fl_top and the files it needs, for ts/test/test_importFileList.ts.
# Each kind of line the filelist reader takes:

fl_pkg.sv
nested/fl_sub.f   // a nested filelist, read relative to its own directory
fl_pkg.sv  # named again, so read once
$TSSV_ROOT/ts/test/importFileList/fl_top.sv

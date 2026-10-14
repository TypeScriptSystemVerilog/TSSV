// ---------------------------------------------------------------------------
// GrayPointer_checks — the own-domain assertions from GrayPointer's spec (Assertions), on one
// GrayPointer instance. tb_GrayPointer.sv connects it to its DUT, and tb_AFIFO.sv to both of the
// AFIFO's pointers, u_wr_ptr and u_rd_ptr, through hierarchical references.
// ---------------------------------------------------------------------------
module GrayPointer_checks #(
  parameter int    W    = 3,
  parameter string INST = "GrayPointer"     // names the instance in failure messages
) (
  input logic         clk,
  input logic         rst_n,
  input logic         inc,
  input logic [W-1:0] bin_ptr,
  input logic [W-1:0] gray_q
);

  // gray_q changes at most one bit per edge, so a synchronizer can't catch a value that never existed
  a_gray_one_bit: assert property (@(posedge clk) disable iff (!rst_n)
    $countones(gray_q ^ $past(gray_q)) <= 1)
    else $error("%s a_gray_one_bit: gray_q went from 'b%b to 'b%b", INST, $past(gray_q), gray_q);

  // the Gray copy is in step with the pointer
  a_gray_match: assert property (@(posedge clk) disable iff (!rst_n)
    gray_q == (bin_ptr ^ (bin_ptr >> 1)))
    else $error("%s a_gray_match: gray_q = 'b%b, bin_ptr = %0d", INST, gray_q, bin_ptr);

  // the pointer moves only on inc, and then by exactly one, modulo 2**W
  a_hold: assert property (@(posedge clk) disable iff (!rst_n) !inc |=> $stable(bin_ptr))
    else $error("%s a_hold: bin_ptr moved from %0d to %0d without inc", INST, $past(bin_ptr), bin_ptr);
  a_step: assert property (@(posedge clk) disable iff (!rst_n) inc |=> bin_ptr == W'($past(bin_ptr) + 1'b1))
    else $error("%s a_step: bin_ptr went from %0d to %0d on inc", INST, $past(bin_ptr), bin_ptr);

endmodule

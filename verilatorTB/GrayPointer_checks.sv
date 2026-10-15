// ---------------------------------------------------------------------------
// GrayPointer_checks — the assertions from GrayPointer's spec (Assertions), on one GrayPointer
// instance: the own-domain checks and the two reset checks. tb_GrayPointer.sv connects it to
// its DUT, and tb_AFIFO.sv to both of the AFIFO's pointers, u_wr_ptr and u_rd_ptr, through
// hierarchical references. GrayPointer embeds a_gray_one_bit, a_gray_match and the reset checks
// behind TSSV_CDC_ASSERT once #106 builds the mechanism; a_hold and a_step stay testbench checks.
// ---------------------------------------------------------------------------
module GrayPointer_checks #(
  parameter int    W    = 3,
  parameter string INST = "GrayPointer"     // names the instance in failure messages
) (
  input logic         clk,
  input logic         rst_n,
  input logic         inc,
  input logic [W-1:0] bin_ptr,
  input logic [W-1:0] gray_q,
  input logic         far_clk,
  input logic         far_rst_n
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

  // Both resets assert together: when either asserts, the other is asserted by the next edge of
  // its own clock, so no synchronizer samples gray_q's multi-bit jump to 0. Releasing them one
  // after the other is legal. Reads both domains' resets, so simulation-only; never disabled.
  a_rst_together_far: assert property (@(posedge far_clk) $fell(rst_n) |-> !far_rst_n)
    else $error("%s a_rst_together_far: rst_n asserted, far_rst_n not asserted by the next far_clk edge", INST);
  a_rst_together_own: assert property (@(posedge clk) $fell(far_rst_n) |-> !rst_n)
    else $error("%s a_rst_together_own: far_rst_n asserted, rst_n not asserted by the next clk edge", INST);

endmodule

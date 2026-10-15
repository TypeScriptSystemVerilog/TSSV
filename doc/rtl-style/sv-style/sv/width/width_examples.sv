// Width-parameterized datapath examples.
// Every assignment below is lint-clean under `verilator --lint-only -Wall` with the common waivers
// file (../../common_waivers.vlt), for W <= 32 and for W > 32, and simulation checks every output
// against exact integer arithmetic: doc/rtl-style/sv-style/tools/check-width-examples.mjs (run by
// `npm run check:rtl-style`).
//
// a, b : unsigned W-bit     c  : unsigned N-bit (narrower)
// sa,sb: signed   W-bit     sc : signed   N-bit (narrower)
// sh   : variable shift amount, $clog2(W) bits
module width_examples #(
  parameter int W   = 16,   // datapath width
  parameter int N   = 6,    // narrow operand width (N < W)
  parameter int S   = 3,    // fixed shift amount
  parameter int F   = 4,    // fraction bits for the fixed-point multiply
  parameter int LIM = 100,  // an integer parameter used as a constant
  localparam int SW = $clog2(W)
) (
  input  logic        [W-1:0]   a, b,
  input  logic        [N-1:0]   c,
  input  logic signed [W-1:0]   sa, sb,
  input  logic signed [N-1:0]   sc,
  input  logic        [SW-1:0]  sh,

  // Addition
  output logic        [W-1:0]   u_add_wrap,   // a + b, carry dropped (modular)
  output logic        [W:0]     u_add_full,   // a + b, carry kept
  output logic        [W-1:0]   u_inc,        // a + 1
  output logic        [W:0]     u_add_narrow, // a + c, c zero-extended
  output logic        [W-1:0]   u_avg,        // (a + b) / 2, no carry lost
  output logic signed [W-1:0]   s_add_wrap,   // sa + sb, modular
  output logic signed [W:0]     s_add_full,   // sa + sb, no overflow
  output logic signed [W-1:0]   s_sub_lit,    // sa - 3
  output logic signed [W:0]     s_add_narrow, // sa + sc, sc sign-extended
  output logic signed [W+1:0]   s_add_mixed,  // sa + a (signed + unsigned)

  // Multiplication
  output logic        [2*W-1:0] u_mul_full,   // a * b
  output logic        [W-1:0]   u_mul_lo,     // a * b, low W bits
  output logic        [W+N-1:0] u_mul_narrow, // a * c
  output logic        [W+1:0]   u_mul_lit,    // a * 3
  output logic signed [2*W-1:0] s_mul_full,   // sa * sb
  output logic signed [W+2:0]   s_mul_lit,    // sa * -5
  output logic signed [2*W:0]   s_mul_mixed,  // sa * b (signed * unsigned)
  output logic signed [W-1:0]   s_mul_q,      // (sa * sb) >> F, fixed point, truncated

  // Shifts
  output logic        [W-1:0]   u_shl_fix,    // a << S, top bits dropped
  output logic        [W+S-1:0] u_shl_full,   // a << S, nothing dropped
  output logic        [W-1:0]   u_shr_fix,    // a >> S
  output logic        [W-1:0]   u_shl_var,    // a << sh
  output logic        [W-1:0]   u_shr_var,    // a >> sh
  output logic        [W-1:0]   u_onehot,     // 1 << sh
  output logic        [W-1:0]   u_mask,       // (1 << sh) - 1
  output logic signed [W-1:0]   s_sra_fix,    // sa >>> S
  output logic signed [W-1:0]   s_sra_var,    // sa >>> sh
  output logic signed [W+S-1:0] s_sla_full,   // sa <<< S, nothing dropped
  output logic signed [W-1:0]   s_neg_pow,    // -1 <<< sh  (= -2**sh)
  output logic        [W+S-1:0] u_shl_cat,    // a << S, nothing dropped, by concatenation

  // Extension
  output logic        [W-1:0]   u_zext,       // c zero-extended to W
  output logic signed [W-1:0]   s_sext,       // sc sign-extended to W
  output logic signed [W:0]     s_from_u,     // a as a non-negative signed value
  output logic        [W-1:0]   u_lim,        // LIM as a W-bit constant
  output logic        [W-1:0]   u_ones,       // all ones
  output logic        [W-1:0]   u_sa_bits,    // sa's bits, read as unsigned

  // Truncation
  output logic        [N-1:0]   u_trunc,      // low N bits of a
  output logic        [N-1:0]   u_trunc_sum,  // low N bits of a + b
  output logic signed [N-1:0]   s_trunc,      // low N bits of sa, kept signed

  // Comparisons
  output logic                  u_is_zero,    // a == all zeros
  output logic                  u_at_lim,     // a == LIM
  output logic                  u_sum_gt,     // a + b > c, carry counted
  output logic                  s_is_neg,     // sa < 0
  output logic                  s_lt_mixed    // sa < a (signed against unsigned)
);

  // ---- Addition ---------------------------------------------------------------------
  // Written plain: the operation is as wide as its target, so a target one bit wider keeps the
  // carry, and a narrower operand is extended with its own signedness. A target that drops the
  // carry on purpose gets one outer cast.
  assign u_add_wrap   = W'(a + b);
  assign u_add_full   = a + b;
  assign u_inc        = W'(a + 1'b1);
  assign u_add_narrow = a + c;
  assign u_avg        = u_add_full[W:1];  // reuse the full-width sum; never (a + b) >> 1
  assign s_add_wrap   = W'(sa + sb);
  assign s_add_full   = sa + sb;
  assign s_sub_lit    = W'(sa - 3'sd3);
  assign s_add_narrow = sa + sc;
  assign s_add_mixed  = sa + $signed({1'b0, a});  // make the unsigned operand signed first

  // ---- Multiplication ---------------------------------------------------------------
  assign u_mul_full   = a * b;
  assign u_mul_lo     = W'(a * b);
  assign u_mul_narrow = a * c;
  assign u_mul_lit    = a * 2'd3;
  assign s_mul_full   = sa * sb;
  assign s_mul_lit    = -(sa * 4'sd5);  // sa * -4'sd5 would extend 4'sd5 before negating it
  assign s_mul_mixed  = sa * $signed({1'b0, b});
  logic signed [2*W-1:0] s_prod;  // full product, named so the shift sees all 2*W bits
  assign s_prod       = sa * sb;
  assign s_mul_q      = W'(s_prod >>> F);

  // ---- Shifts -----------------------------------------------------------------------
  // >>> is arithmetic only when the operand is signed. A shift is as wide as its operand's
  // context: cast or concatenate so the result holds every bit it needs.
  assign u_shl_fix    = a << S;
  assign u_shl_full   = (W+S)'(a) << S;
  assign u_shr_fix    = a >> S;
  assign u_shl_var    = a << sh;
  assign u_shr_var    = a >> sh;
  assign u_onehot     = W'(1'b1) << sh;
  assign u_mask       = (W'(1'b1) << sh) - 1'b1;
  assign s_sra_fix    = sa >>> S;
  assign s_sra_var    = sa >>> sh;
  assign s_sla_full   = (W+S)'(sa) <<< S;
  assign s_neg_pow    = $signed({W{1'b1}}) <<< sh;  // all ones, signed: -1
  assign u_shl_cat    = {a, {S{1'b0}}};

  // ---- Extension --------------------------------------------------------------------
  // A cast to a wider size extends with the operand's own signedness.
  assign u_zext       = W'(c);
  assign s_sext       = W'(sc);
  assign s_from_u     = $signed({1'b0, a});
  assign u_lim        = W'(LIM);
  assign u_ones       = {W{1'b1}};
  assign u_sa_bits    = $unsigned(sa);  // a change of signedness is explicit

  // ---- Truncation -------------------------------------------------------------------
  // Slice a signal; cast an expression (an expression can't be sliced).
  // A slice is always unsigned. Same-width bits are identical, but N'(sa) keeps the result
  // signed if it is later extended or compared.
  assign u_trunc      = a[N-1:0];
  assign u_trunc_sum  = N'(a + b);
  assign s_trunc      = N'(sa);

  // ---- Comparisons ------------------------------------------------------------------
  // Operands of equal width and the same signedness. A compare has no left-hand side to widen
  // it: size the operands (u_add_full, not a + b).
  assign u_is_zero    = (a == '0);
  assign u_at_lim     = (a == W'(LIM));
  assign u_sum_gt     = (u_add_full > (W+1)'(c)); // or ((W+1)'(a + b) > (W+1)'(c))
  assign s_is_neg     = (sa < W'(1'sd0));
  assign s_lt_mixed   = ((W+1)'(sa) < $signed({1'b0, a}));

endmodule

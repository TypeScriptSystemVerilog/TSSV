// A library of maximal-length feedback polynomials for LFSR (doc/modules/LFSR/LFSR-spec.md, "The
// library"): one for each width from 2 to 168, the default when an LFSR leaves `polynomial` out, and
// the PRBS polynomials of test equipment by name. Every entry is in the convention LFSR uses, where
// the term x^k taps stage k counted from the input, and test_LFSR.ts proves each one primitive.

/**
 * A maximal-length polynomial for each width from 2 to 168, by width.
 *
 * Widths 3 to 168 are the taps of Table 3 of Xilinx XAPP052 (P. Alfke, "Efficient Shift Registers,
 * LFSR Counters, and Long Pseudo-Random Sequence Generators", v1.1, 1996), written as polynomials:
 * XAPP052's taps `16,15,13,4` are x^16 + x^15 + x^13 + x^4 + 1. XAPP052 numbers its stages 1 to n
 * from the input, as LFSR does, so its taps are the polynomial's exponents. Its circuits use XNOR
 * feedback, which LFSR doesn't (the spec says how to match one), but that doesn't change which
 * polynomials are maximal-length.
 *
 * Two entries aren't XAPP052's:
 *   - width 2, below its table, is x^2 + x + 1, the only primitive polynomial of degree 2;
 *   - width 102: XAPP052's taps `102,101,36,35` give x^102 + x^101 + x^36 + x^35 + 1, which is not
 *     primitive (it factors into polynomials of degree 3, 34 and 65), so its LFSR doesn't reach every
 *     state. In its place is x^102 + x^101 + x^26 + x^25 + 1, the only primitive polynomial of the
 *     same shape (x^n + x^(n−1) + x^k + x^(k−1) + 1). There is no primitive trinomial of degree 102.
 */
export const MAXIMAL_LENGTH_POLY: Readonly<Record<number, string>> = {
  2: 'x^2 + x + 1',
  3: 'x^3 + x^2 + 1',
  4: 'x^4 + x^3 + 1',
  5: 'x^5 + x^3 + 1',
  6: 'x^6 + x^5 + 1',
  7: 'x^7 + x^6 + 1',
  8: 'x^8 + x^6 + x^5 + x^4 + 1',
  9: 'x^9 + x^5 + 1',
  10: 'x^10 + x^7 + 1',
  11: 'x^11 + x^9 + 1',
  12: 'x^12 + x^6 + x^4 + x + 1',
  13: 'x^13 + x^4 + x^3 + x + 1',
  14: 'x^14 + x^5 + x^3 + x + 1',
  15: 'x^15 + x^14 + 1',
  16: 'x^16 + x^15 + x^13 + x^4 + 1',
  17: 'x^17 + x^14 + 1',
  18: 'x^18 + x^11 + 1',
  19: 'x^19 + x^6 + x^2 + x + 1',
  20: 'x^20 + x^17 + 1',
  21: 'x^21 + x^19 + 1',
  22: 'x^22 + x^21 + 1',
  23: 'x^23 + x^18 + 1',
  24: 'x^24 + x^23 + x^22 + x^17 + 1',
  25: 'x^25 + x^22 + 1',
  26: 'x^26 + x^6 + x^2 + x + 1',
  27: 'x^27 + x^5 + x^2 + x + 1',
  28: 'x^28 + x^25 + 1',
  29: 'x^29 + x^27 + 1',
  30: 'x^30 + x^6 + x^4 + x + 1',
  31: 'x^31 + x^28 + 1',
  32: 'x^32 + x^22 + x^2 + x + 1',
  33: 'x^33 + x^20 + 1',
  34: 'x^34 + x^27 + x^2 + x + 1',
  35: 'x^35 + x^33 + 1',
  36: 'x^36 + x^25 + 1',
  37: 'x^37 + x^5 + x^4 + x^3 + x^2 + x + 1',
  38: 'x^38 + x^6 + x^5 + x + 1',
  39: 'x^39 + x^35 + 1',
  40: 'x^40 + x^38 + x^21 + x^19 + 1',
  41: 'x^41 + x^38 + 1',
  42: 'x^42 + x^41 + x^20 + x^19 + 1',
  43: 'x^43 + x^42 + x^38 + x^37 + 1',
  44: 'x^44 + x^43 + x^18 + x^17 + 1',
  45: 'x^45 + x^44 + x^42 + x^41 + 1',
  46: 'x^46 + x^45 + x^26 + x^25 + 1',
  47: 'x^47 + x^42 + 1',
  48: 'x^48 + x^47 + x^21 + x^20 + 1',
  49: 'x^49 + x^40 + 1',
  50: 'x^50 + x^49 + x^24 + x^23 + 1',
  51: 'x^51 + x^50 + x^36 + x^35 + 1',
  52: 'x^52 + x^49 + 1',
  53: 'x^53 + x^52 + x^38 + x^37 + 1',
  54: 'x^54 + x^53 + x^18 + x^17 + 1',
  55: 'x^55 + x^31 + 1',
  56: 'x^56 + x^55 + x^35 + x^34 + 1',
  57: 'x^57 + x^50 + 1',
  58: 'x^58 + x^39 + 1',
  59: 'x^59 + x^58 + x^38 + x^37 + 1',
  60: 'x^60 + x^59 + 1',
  61: 'x^61 + x^60 + x^46 + x^45 + 1',
  62: 'x^62 + x^61 + x^6 + x^5 + 1',
  63: 'x^63 + x^62 + 1',
  64: 'x^64 + x^63 + x^61 + x^60 + 1',
  65: 'x^65 + x^47 + 1',
  66: 'x^66 + x^65 + x^57 + x^56 + 1',
  67: 'x^67 + x^66 + x^58 + x^57 + 1',
  68: 'x^68 + x^59 + 1',
  69: 'x^69 + x^67 + x^42 + x^40 + 1',
  70: 'x^70 + x^69 + x^55 + x^54 + 1',
  71: 'x^71 + x^65 + 1',
  72: 'x^72 + x^66 + x^25 + x^19 + 1',
  73: 'x^73 + x^48 + 1',
  74: 'x^74 + x^73 + x^59 + x^58 + 1',
  75: 'x^75 + x^74 + x^65 + x^64 + 1',
  76: 'x^76 + x^75 + x^41 + x^40 + 1',
  77: 'x^77 + x^76 + x^47 + x^46 + 1',
  78: 'x^78 + x^77 + x^59 + x^58 + 1',
  79: 'x^79 + x^70 + 1',
  80: 'x^80 + x^79 + x^43 + x^42 + 1',
  81: 'x^81 + x^77 + 1',
  82: 'x^82 + x^79 + x^47 + x^44 + 1',
  83: 'x^83 + x^82 + x^38 + x^37 + 1',
  84: 'x^84 + x^71 + 1',
  85: 'x^85 + x^84 + x^58 + x^57 + 1',
  86: 'x^86 + x^85 + x^74 + x^73 + 1',
  87: 'x^87 + x^74 + 1',
  88: 'x^88 + x^87 + x^17 + x^16 + 1',
  89: 'x^89 + x^51 + 1',
  90: 'x^90 + x^89 + x^72 + x^71 + 1',
  91: 'x^91 + x^90 + x^8 + x^7 + 1',
  92: 'x^92 + x^91 + x^80 + x^79 + 1',
  93: 'x^93 + x^91 + 1',
  94: 'x^94 + x^73 + 1',
  95: 'x^95 + x^84 + 1',
  96: 'x^96 + x^94 + x^49 + x^47 + 1',
  97: 'x^97 + x^91 + 1',
  98: 'x^98 + x^87 + 1',
  99: 'x^99 + x^97 + x^54 + x^52 + 1',
  100: 'x^100 + x^63 + 1',
  101: 'x^101 + x^100 + x^95 + x^94 + 1',
  102: 'x^102 + x^101 + x^26 + x^25 + 1',
  103: 'x^103 + x^94 + 1',
  104: 'x^104 + x^103 + x^94 + x^93 + 1',
  105: 'x^105 + x^89 + 1',
  106: 'x^106 + x^91 + 1',
  107: 'x^107 + x^105 + x^44 + x^42 + 1',
  108: 'x^108 + x^77 + 1',
  109: 'x^109 + x^108 + x^103 + x^102 + 1',
  110: 'x^110 + x^109 + x^98 + x^97 + 1',
  111: 'x^111 + x^101 + 1',
  112: 'x^112 + x^110 + x^69 + x^67 + 1',
  113: 'x^113 + x^104 + 1',
  114: 'x^114 + x^113 + x^33 + x^32 + 1',
  115: 'x^115 + x^114 + x^101 + x^100 + 1',
  116: 'x^116 + x^115 + x^46 + x^45 + 1',
  117: 'x^117 + x^115 + x^99 + x^97 + 1',
  118: 'x^118 + x^85 + 1',
  119: 'x^119 + x^111 + 1',
  120: 'x^120 + x^113 + x^9 + x^2 + 1',
  121: 'x^121 + x^103 + 1',
  122: 'x^122 + x^121 + x^63 + x^62 + 1',
  123: 'x^123 + x^121 + 1',
  124: 'x^124 + x^87 + 1',
  125: 'x^125 + x^124 + x^18 + x^17 + 1',
  126: 'x^126 + x^125 + x^90 + x^89 + 1',
  127: 'x^127 + x^126 + 1',
  128: 'x^128 + x^126 + x^101 + x^99 + 1',
  129: 'x^129 + x^124 + 1',
  130: 'x^130 + x^127 + 1',
  131: 'x^131 + x^130 + x^84 + x^83 + 1',
  132: 'x^132 + x^103 + 1',
  133: 'x^133 + x^132 + x^82 + x^81 + 1',
  134: 'x^134 + x^77 + 1',
  135: 'x^135 + x^124 + 1',
  136: 'x^136 + x^135 + x^11 + x^10 + 1',
  137: 'x^137 + x^116 + 1',
  138: 'x^138 + x^137 + x^131 + x^130 + 1',
  139: 'x^139 + x^136 + x^134 + x^131 + 1',
  140: 'x^140 + x^111 + 1',
  141: 'x^141 + x^140 + x^110 + x^109 + 1',
  142: 'x^142 + x^121 + 1',
  143: 'x^143 + x^142 + x^123 + x^122 + 1',
  144: 'x^144 + x^143 + x^75 + x^74 + 1',
  145: 'x^145 + x^93 + 1',
  146: 'x^146 + x^145 + x^87 + x^86 + 1',
  147: 'x^147 + x^146 + x^110 + x^109 + 1',
  148: 'x^148 + x^121 + 1',
  149: 'x^149 + x^148 + x^40 + x^39 + 1',
  150: 'x^150 + x^97 + 1',
  151: 'x^151 + x^148 + 1',
  152: 'x^152 + x^151 + x^87 + x^86 + 1',
  153: 'x^153 + x^152 + 1',
  154: 'x^154 + x^152 + x^27 + x^25 + 1',
  155: 'x^155 + x^154 + x^124 + x^123 + 1',
  156: 'x^156 + x^155 + x^41 + x^40 + 1',
  157: 'x^157 + x^156 + x^131 + x^130 + 1',
  158: 'x^158 + x^157 + x^132 + x^131 + 1',
  159: 'x^159 + x^128 + 1',
  160: 'x^160 + x^159 + x^142 + x^141 + 1',
  161: 'x^161 + x^143 + 1',
  162: 'x^162 + x^161 + x^75 + x^74 + 1',
  163: 'x^163 + x^162 + x^104 + x^103 + 1',
  164: 'x^164 + x^163 + x^151 + x^150 + 1',
  165: 'x^165 + x^164 + x^135 + x^134 + 1',
  166: 'x^166 + x^165 + x^128 + x^127 + 1',
  167: 'x^167 + x^161 + 1',
  168: 'x^168 + x^166 + x^153 + x^151 + 1'
}

// The pseudo-random binary sequences (PRBS) that test equipment generates and checks, as polynomials.
// PRBS9 to PRBS31 are ITU-T O.150's; PRBS7 isn't in O.150, but is as widely used. O.150 also says how
// each pattern is sent, for example that some are inverted; that is outside the LFSR, which gives the
// sequence itself (take ~value to invert it). Check the inversion and bit order a piece of equipment
// expects before matching it.

/** PRBS7, x^7 + x^6 + 1: 2^7 − 1 = 127 bits long. Not in O.150, but common in test equipment */
export const PRBS7_POLY = 'x^7 + x^6 + 1'
/** PRBS9, x^9 + x^5 + 1 (ITU-T O.150): 2^9 − 1 = 511 bits long */
export const PRBS9_POLY = 'x^9 + x^5 + 1'
/** PRBS11, x^11 + x^9 + 1 (ITU-T O.150): 2^11 − 1 = 2047 bits long */
export const PRBS11_POLY = 'x^11 + x^9 + 1'
/** PRBS15, x^15 + x^14 + 1 (ITU-T O.150): 2^15 − 1 = 32767 bits long */
export const PRBS15_POLY = 'x^15 + x^14 + 1'
/** PRBS20, x^20 + x^3 + 1 (ITU-T O.150): 2^20 − 1 = 1048575 bits long */
export const PRBS20_POLY = 'x^20 + x^3 + 1'
/** PRBS23, x^23 + x^18 + 1 (ITU-T O.150): 2^23 − 1 = 8388607 bits long */
export const PRBS23_POLY = 'x^23 + x^18 + 1'
/** PRBS31, x^31 + x^28 + 1 (ITU-T O.150): 2^31 − 1 = 2147483647 bits long */
export const PRBS31_POLY = 'x^31 + x^28 + 1'

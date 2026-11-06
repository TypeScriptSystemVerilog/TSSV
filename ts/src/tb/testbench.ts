// Marks a generated module as a testbench: a test harness or a simulation model, not RTL.
// The SV guide's SYN-1 keeps `initial`, `#` delays and system tasks out of RTL, and says they
// are fine in testbenches. The generated-SV checks (doc/rtl-style/sv-style/tools/sv-scans.mjs)
// can't tell the two apart by name, so a test script marks each testbench module it writes, and
// SYN-1 skips the modules that carry the marker. Every other check still applies to them.
import { type Module } from 'tssv/lib/core/TSSV'

/**
 * The comment that marks a module as a testbench. It goes inside the module, between its header
 * and `endmodule`. `sv-scans.mjs` matches `// tssv: testbench` at the start of a line.
 */
export const TESTBENCH_MARKER = '// tssv: testbench (simulation only; SYN-1 does not apply)'

/** Adds {@link TESTBENCH_MARKER} to `module`'s body, and returns `module`. */
export function markTestbench<M extends Module> (module: M): M {
  // The body passed to the constructor may not end in a newline
  module.addBodyLine(`\n${TESTBENCH_MARKER}`)
  return module
}

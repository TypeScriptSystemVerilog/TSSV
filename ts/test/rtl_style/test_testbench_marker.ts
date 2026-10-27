/**
 * Self-checking test for the testbench marker (ts/test/models/testbench.ts) and the SYN-1 scan
 * that honors it (doc/rtl-style/sv-style/tools/sv-scans.mjs).
 *
 * SYN-1 bans `initial`, `#` delays and system tasks from RTL, and allows them in testbenches.
 * A generated file often holds both: a testbench and the design it instantiates. So the scan
 * works per module: it skips a module marked as a testbench, and still reports a design module
 * in the same file.
 *
 * Test 1: the emitted files, joined, hold the marked testbench and the unmarked design
 * Test 2: SYN-1 reports the design's `initial` and `$display`, and nothing in the testbench
 * Test 3: without its marker, the testbench is reported too
 *
 * It writes nothing under sv-examples/: the design breaks SYN-1 on purpose, and
 * check-generated-sv.mjs checks everything there.
 */
import { Module } from 'tssv/lib/core/TSSV'
import { emittedFiles } from 'tssv/test/models/emitted'
import { markTestbench, TESTBENCH_MARKER } from 'tssv/test/models/testbench'

interface Scans {
  svModules: (sv: string) => Array<{ name: string, testbench: boolean }>
  scanFile: (sv: string) => Array<{ rule: string, finding: string }>
}
// Resolved from out/test/rtl_style/, where this script runs
const scans = await import(new URL('../../../doc/rtl-style/sv-style/tools/sv-scans.mjs', import.meta.url).href) as Scans

let passed = 0
let failed = 0

function check (label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}${detail !== undefined ? `\n  ${detail}` : ''}`)
    failed++
  }
}

const syn1 = (sv: string): string[] => scans.scanFile(sv).filter((f) => f.rule === 'SYN-1').map((f) => f.finding).sort()

// A design that breaks SYN-1 with an `initial` and a `$display`
const design = new Module(
  { name: 'syn1_design' },
  {
    clk: { direction: 'input' },
    q: { direction: 'output' }
  },
  {},
  `
  initial q = 1'b0;
  always_ff @(posedge clk) begin : toggle
    q <= ~q;
    $display("q = %b", q);
  end
`)

// A testbench for it, using what SYN-1 bans from RTL: `initial`, a delay and system tasks
const tb = markTestbench(new Module(
  { name: 'syn1_tb' },
  {},
  {
    clk: {},
    q: {}
  },
  `
  initial begin
    clk = 1'b0;
    repeat (4) #5 clk = ~clk;
    $display("q = %b", q);
    $finish;
  end
`))
tb.addSubmodule('dut', design, { clk: 'clk', q: 'q' })
// One text with both modules: each file writeSystemVerilogFiles() writes, joined in the order it
// returns them, as a build that names every file reads them
const sv = [...emittedFiles(tb).values()].join('\n')

// ---- Test 1 ---------------------------------------------------------------------------------
const modules = scans.svModules(sv).map((m) => `${m.name}${m.testbench ? ' (testbench)' : ''}`)
check('the emitted files hold the marked testbench and the unmarked design',
  modules.join(', ') === 'syn1_design, syn1_tb (testbench)', `modules: ${modules.join(', ')}`)

// ---- Test 2 ---------------------------------------------------------------------------------
const expected = ['system task "$display"', 'testbench-only construct "initial"']
check('SYN-1 reports the design\'s initial and $display, and nothing in the testbench',
  syn1(sv).join('\n') === expected.join('\n'), `SYN-1 found:\n  ${syn1(sv).join('\n  ')}\n${sv}`)

// ---- Test 3 ---------------------------------------------------------------------------------
const unmarked = syn1(sv.replace(TESTBENCH_MARKER, ''))
check('without its marker, the testbench\'s delay and $finish are reported too',
  unmarked.includes('delay "#"') && unmarked.includes('system task "$finish"') &&
  unmarked.filter((f) => f === 'testbench-only construct "initial"').length === 2,
  `SYN-1 found:\n  ${unmarked.join('\n  ')}`)

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

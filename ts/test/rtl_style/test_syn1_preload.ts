/**
 * Self-checking test for SYN-1's one exception (SV guide, section 7): a pattern memory's preload,
 * `initial $readmemh("<file>", mem);`, which FPGA tools build as block RAM contents. The SYN-1
 * scan (doc/rtl-style/sv-style/tools/sv-scans.mjs), which check-harness and check-generated-sv
 * both run, must accept exactly that line and nothing more.
 *
 * Test 1: a preloaded PatternMemory, $readmemh or $readmemb, and a reloaded one have no SYN-1 finding
 * Test 2: each change to the preload makes it a finding again: another initial beside it, the
 *         preload inside begin ... end, a second statement on its line, an address range, and
 *         $readmemh outside an initial
 *
 * It writes nothing under sv-examples/: the changed copies break SYN-1 on purpose, and
 * check-generated-sv.mjs checks everything there.
 */
import { PatternMemory } from 'tssv/lib/tb/PatternMemory'
import { recordLayout } from 'tssv/lib/tb/patternRecord'
import { moduleSV } from 'tssv/test/models/emitted'

interface Scans {
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

const fields = [{ name: 'head', width: 1 }, { name: 'data', width: 8 }]
const memory = (radix: 'h' | 'b', mode: 'preloaded' | 'reloaded'): string => moduleSV(new PatternMemory({
  name: `syn1_${mode}_${radix}`,
  layout: recordLayout(fields, radix),
  depth: 4,
  mode,
  file: mode === 'preloaded' ? 'patterns/x.hex' : undefined
}))
const preloaded = memory('h', 'preloaded')
const PRELOAD = 'initial $readmemh("patterns/x.hex", mem);'

// ---- Test 1 ---------------------------------------------------------------------------------
check('the generated preload is the one line SYN-1 accepts', preloaded.includes(`  ${PRELOAD}\n`), preloaded)
for (const [what, sv] of [
  ['a preloaded $readmemh memory', preloaded],
  ['a preloaded $readmemb memory', memory('b', 'preloaded')],
  ['a reloaded memory', memory('h', 'reloaded')]
]) {
  check(`${what} has no SYN-1 finding`, syn1(sv).length === 0, syn1(sv).join(', '))
}

// ---- Test 2 ---------------------------------------------------------------------------------
const initial = 'testbench-only construct "initial"'
const readmemh = 'system task "$readmemh"'
const changes: Array<[string, string, string[]]> = [
  ['another initial beside the preload', `${PRELOAD}\n  initial mem[0] = '0;`, [initial]],
  ['the preload inside begin ... end', `initial begin\n    $readmemh("patterns/x.hex", mem);\n  end`, [initial, readmemh]],
  ['a second statement on the preload\'s line', `${PRELOAD} $display("loaded");`, ['system task "$display"', initial, readmemh]],
  ['an address range', 'initial $readmemh("patterns/x.hex", mem, 0, 3);', [initial, readmemh]],
  ['$readmemh in an always block', 'always_ff @(posedge clk) $readmemh("patterns/x.hex", mem);', [readmemh]]
]
for (const [what, line, expected] of changes) {
  const findings = syn1(preloaded.replace(PRELOAD, line))
  check(`${what} is a finding`, findings.join('\n') === [...expected].sort().join('\n'), `SYN-1 found: ${findings.join(', ')}`)
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

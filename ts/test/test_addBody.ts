import { Module } from 'tssv/lib/core/TSSV'
import { readFileSync } from 'fs'
import { moduleSV } from 'tssv/test/models/emitted'

const OUT = 'sv-examples/Core/addBody'

// What addBody()/addBodyLine() added, as the module's SV carries it: the text between the port
// list and `endmodule`, unformatted, so the check sees indentation exactly as appended. The
// modules here have no signals, parameter comment or submodules, so nothing else sits there.
function emittedBody (m: Module): string {
  Module.setFormatterConfig({ engine: 'off' })
  let sv: string
  try {
    sv = moduleSV(m)
  } finally {
    Module.setFormatterConfig({ engine: 'verible', failOnFormatError: true })
  }
  const head = '   );\n\n'
  const start = sv.indexOf(head)
  const end = sv.lastIndexOf('\nendmodule')
  if (start < 0 || end < start + head.length) return `<unexpected SV: ${sv}>`
  return sv.slice(start + head.length, end)
}

let passed = 0
let failed = 0

function check (label: string, actual: string, expected: string): void {
  if (actual === expected) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}`)
    console.error(`  expected: ${JSON.stringify(expected)}`)
    console.error(`  actual:   ${JSON.stringify(actual)}`)
    failed++
  }
}

// --- Test 1: common indent stripped, leading/trailing blank lines removed ---
const m1 = new Module({ name: 'test_normalize' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  out: { direction: 'output', width: 8 },
  in: { direction: 'input', width: 8 }
})
m1.addBody(`
        always_ff @(posedge clk) begin
          out <= in;
        end
`)
check(
  'normalize strips common indent and blank lines',
  emittedBody(m1),
`   always_ff @(posedge clk) begin
     out <= in;
   end
`
)
m1.writeSystemVerilogFiles(OUT)

// --- Test 2: verbatim preserves indent ---
const m2 = new Module({ name: 'test_verbatim' }, {
  out: { direction: 'output', width: 8 },
  in: { direction: 'input', width: 8 }
})
m2.addBody('  assign out = in;\n', { indentMode: 'verbatim' })
check(
  'verbatim preserves indentation',
  emittedBody(m2),
  '  assign out = in;\n'
)
m2.writeSystemVerilogFiles(OUT)

// --- Test 3: addBodyLine appends with newline ---
const m3 = new Module({ name: 'test_addBodyLine' }, {
  a: { direction: 'input', width: 8 },
  b: { direction: 'output', width: 8 }
})
m3.addBodyLine('  assign b = a;')
check(
  'addBodyLine appends line with trailing newline',
  emittedBody(m3),
  '  assign b = a;\n'
)
m3.writeSystemVerilogFiles(OUT)

// --- Test 4: addBody normalizes and indents body content ---
const m4ref = new Module({ name: 'test_equiv_ref' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  out: { direction: 'output', width: 8 },
  in: { direction: 'input', width: 8 }
})
// the body addBody() should produce, appended as is
m4ref.addBody(
`   always_ff @(posedge clk) begin
     out <= in;
   end`, { indentMode: 'verbatim' })
const m4 = new Module({ name: 'test_equiv_addBody' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  out: { direction: 'output', width: 8 },
  in: { direction: 'input', width: 8 }
})
m4.addBody(`
  always_ff @(posedge clk) begin
    out <= in;
  end
`)

const m4refSV = readFileSync(m4ref.writeSystemVerilogFiles(OUT).at(-1) ?? '', 'utf8')
// the module name, and its file's DEF__<name>__ guard
const m4SV = readFileSync(m4.writeSystemVerilogFiles(OUT).at(-1) ?? '', 'utf8').split('test_equiv_addBody').join('test_equiv_ref')
check(
  'addBody normalizes and indents body content',
  m4SV,
  m4refSV
)

// --- Test 5: empty addBody call is a no-op ---
// No ports: with an empty body, any port would go unused or undriven
const m5 = new Module({ name: 'test_empty' }, {})
m5.addBody('   \n\n   ')
check(
  'addBody with only whitespace/blank lines is a no-op',
  emittedBody(m5),
  ''
)
m5.writeSystemVerilogFiles(OUT)

// --- Test 6: default engine is verible (output is verible-verilog-format formatted) ---
const m6 = new Module({ name: 'test_engine_default' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  out: { direction: 'output', width: 4 },
  in: { direction: 'input', width: 4 }
})
m6.addBody('always_ff @(posedge clk) begin\n      out <=    in;\nend\n', { indentMode: 'verbatim' })
const sv = readFileSync(m6.writeSystemVerilogFiles(OUT).at(-1) ?? '', 'utf8')
const hasModule = sv.includes('module test_engine_default')
const hasEndmodule = sv.includes('endmodule')
const isFormatted = sv.includes('    out <= in;')
if (hasModule && hasEndmodule && isFormatted) {
  console.log('PASS: writeSystemVerilogFiles formats output with default engine=verible')
  passed++
} else {
  console.error('FAIL: writeSystemVerilogFiles output not formatted with default engine=verible')
  console.error(sv)
  failed++
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

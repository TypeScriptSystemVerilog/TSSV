import { Module } from 'tssv/lib/core/TSSV'
import { readFileSync } from 'fs'

const OUT = 'sv-examples/Core/addBody'

// Expose protected body for assertions
class TestModule extends Module {
  getBody (): string { return this.body }
  setBody (s: string): void { this.body = s }
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
const m1 = new TestModule({ name: 'test_normalize' }, {
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
  m1.getBody(),
`   always_ff @(posedge clk) begin
     out <= in;
   end
`
)
m1.writeSystemVerilogFiles(OUT)

// --- Test 2: verbatim preserves indent ---
const m2 = new TestModule({ name: 'test_verbatim' }, {
  out: { direction: 'output', width: 8 },
  in: { direction: 'input', width: 8 }
})
m2.addBody('  assign out = in;\n', { indentMode: 'verbatim' })
check(
  'verbatim preserves indentation',
  m2.getBody(),
  '  assign out = in;\n'
)
m2.writeSystemVerilogFiles(OUT)

// --- Test 3: addBodyLine appends with newline ---
const m3 = new TestModule({ name: 'test_addBodyLine' }, {
  a: { direction: 'input', width: 8 },
  b: { direction: 'output', width: 8 }
})
m3.addBodyLine('  assign b = a;')
check(
  'addBodyLine appends line with trailing newline',
  m3.getBody(),
  '  assign b = a;\n'
)
m3.writeSystemVerilogFiles(OUT)

// --- Test 4: addBody normalizes and indents body content ---
const m4ref = new TestModule({ name: 'test_equiv_ref' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  out: { direction: 'output', width: 8 },
  in: { direction: 'input', width: 8 }
})
m4ref.setBody(
`   always_ff @(posedge clk) begin
     out <= in;
   end`)
const m4 = new TestModule({ name: 'test_equiv_addBody' }, {
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
const m5 = new TestModule({ name: 'test_empty' }, {})
m5.addBody('   \n\n   ')
check(
  'addBody with only whitespace/blank lines is a no-op',
  m5.getBody(),
  ''
)
m5.writeSystemVerilogFiles(OUT)

// --- Test 6: default engine is verible (output is verible-verilog-format formatted) ---
const m6 = new TestModule({ name: 'test_engine_default' }, {
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

import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { Module } from 'tssv/lib/core/TSSV'
import { runVerible } from 'tssv/lib/tools/formatters/verible'
import { moduleSV } from 'tssv/test/models/emitted'

const OUT = 'sv-examples/Core/verible'

try { mkdirSync(OUT, { recursive: true }) } catch (e) {}

let passed = 0
let failed = 0

function check (label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}${detail ? `\n  ${detail}` : ''}`)
    failed++
  }
}

function skip (label: string): void {
  console.log(`SKIP: ${label}`)
}

// Each case writes its copy of SAMPLE_SV, which defines module sample, to a folder named for the
// case: the file has to be sample.sv (DECLFILENAME)
function writeSample (testCase: string, sv: string): void {
  mkdirSync(`${OUT}/${testCase}`, { recursive: true })
  writeFileSync(`${OUT}/${testCase}/sample.sv`, sv)
}

const SAMPLE_SV =
`module sample(input logic clk, output logic [7:0] out);
  always_ff @(posedge clk) begin
    out <= 8'd0;
  end
endmodule
`

// Probe for Verible once
const probe = spawnSync('verible-verilog-format', ['--version'], { encoding: 'utf8' })
const veribleAvailable = probe.status === 0

// --- Test 1: successful format (skipped if Verible not installed) ---
if (veribleAvailable) {
  const result = runVerible(SAMPLE_SV, {})
  writeSample('formatted', result)
  check(
    'runVerible returns non-empty formatted SV',
    result.length > 0 && result.includes('module'),
    `got: ${JSON.stringify(result.slice(0, 80))}`
  )
  // output larger than spawnSync's default 1 MiB maxBuffer
  const bigSV = `module big(input logic clk, output logic [7:0] out);\n${Array.from({ length: 80000 }, (_, i) => `  logic [7:0] sig_${i};\n`).join('')}endmodule\n`
  const bigResult = runVerible(bigSV, { failOnFormatError: true, formatTimeoutMs: 60000 })
  check(
    'runVerible formats output larger than 1 MiB',
    bigResult.length > (1 << 20) && bigResult.includes('sig_79999'),
    `got length ${bigResult.length}`
  )
} else {
  skip('runVerible successful format (verible-verilog-format not found on PATH)')
}

// --- Test 2: missing binary, failOnFormatError=false → returns original ---
const result2 = runVerible(SAMPLE_SV, {
  veriblePath: '/nonexistent/verible-verilog-format',
  failOnFormatError: false
})
writeSample('missing_binary_fallback', result2)
check(
  'missing binary with failOnFormatError=false returns original SV',
  result2 === SAMPLE_SV
)

// --- Test 3: missing binary, failOnFormatError=true → throws ---
let threw = false
try {
  runVerible(SAMPLE_SV, {
    veriblePath: '/nonexistent/verible-verilog-format',
    failOnFormatError: true
  })
} catch (e) {
  threw = true
}
check('missing binary with failOnFormatError=true throws', threw)

// --- Test 4: timeout, failOnFormatError=false → returns original ---
// a stand-in formatter that sleeps, so the timeout fires however fast Verible is. runVerible adds
// its own flags after these, and `--` hands them to the script: node would reject them
const result4 = runVerible(SAMPLE_SV, {
  veriblePath: process.execPath,
  veribleFlags: ['-e', 'setTimeout(() => {}, 5000)', '--'],
  formatTimeoutMs: 100,
  failOnFormatError: false
})
writeSample('timeout_fallback', result4)
check(
  'timeout with failOnFormatError=false returns original SV',
  result4 === SAMPLE_SV
)

// --- Test 5: timeout, failOnFormatError=true → the error names the timeout ---
let timeoutMsg = ''
try {
  runVerible(SAMPLE_SV, {
    veriblePath: process.execPath,
    veribleFlags: ['-e', 'setTimeout(() => {}, 5000)', '--'],
    formatTimeoutMs: 100,
    failOnFormatError: true
  })
} catch (e) {
  timeoutMsg = (e as Error).message
}
check(
  'timeout with failOnFormatError=true reports the timeout',
  timeoutMsg.includes('timeout:   100 ms (exceeded'),
  `got: ${JSON.stringify(timeoutMsg)}`
)

// --- Tests 6 and 7: a syntax error, in the formatter ---
// Neither writes its SV: lint:sv would reject the syntax error
const BAD_SV = SAMPLE_SV.replace("out <= 8'd0;", 'out <= ;')
if (veribleAvailable) {
  // where Verible reports the error: 1-based, at the ';' after '<= '
  const lines = BAD_SV.split('\n')
  const errorLine = lines.findIndex((l) => l.includes('<= ;'))
  const errorColumn = (lines[errorLine] ?? '').indexOf('<= ;') + 4
  const location = `<stdin>:${errorLine + 1}:${errorColumn}: syntax error at token ";"`

  // Test 6: failOnFormatError=true throws, with Verible's line, column and token
  let syntaxMsg = ''
  try {
    runVerible(BAD_SV, { failOnFormatError: true })
  } catch (e) {
    syntaxMsg = (e as Error).message
  }
  check(
    'syntax error with failOnFormatError=true throws with its location',
    syntaxMsg.includes(location),
    `expected ${JSON.stringify(location)}, got: ${JSON.stringify(syntaxMsg)}`
  )

  // Test 7: failOnFormatError=false warns with the location and returns the SV unformatted
  const warnings: string[] = []
  const warn = console.warn
  console.warn = (msg: string) => { warnings.push(msg) }
  let warned = ''
  try {
    warned = runVerible(BAD_SV, { failOnFormatError: false })
  } finally {
    console.warn = warn
  }
  check(
    'syntax error with failOnFormatError=false warns with its location',
    warnings.length === 1 && (warnings[0] ?? '').includes(location),
    `expected one warning with ${JSON.stringify(location)}, got: ${JSON.stringify(warnings)}`
  )
  check(
    'syntax error with failOnFormatError=false returns the SV unformatted',
    warned === BAD_SV
  )
} else {
  skip('syntax error in the formatter (verible-verilog-format not found on PATH)')
}

// --- Test 8: a syntax error in a module, through writeSystemVerilogFiles() ---
// writeSystemVerilogFiles() checks each module's SV before it formats the output, so the check finds
// the syntax error first, and throws whatever the formatter configuration says: the formatter
// never runs, and failOnFormatError=false doesn't make the error a warning
if (veribleAvailable) {
  const bad = new Module({ name: 'syntax_error' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    q: { direction: 'output', width: 8 }
  })
  bad.addBody(`
    always_ff @(posedge clk) begin
      q <= ;
    end
  `)
  const checkError = /^syntax_error: SystemVerilog syntax error at line \d+, column \d+, near ';': q <= ;$/
  const configs = [
    { engine: 'verible', failOnFormatError: true },
    { engine: 'verible', failOnFormatError: false },
    { engine: 'off' }
  ] as const
  for (const config of configs) {
    Module.setFormatterConfig(config)
    const warnings: string[] = []
    const warn = console.warn
    console.warn = (msg: string) => { warnings.push(msg) }
    let msg = ''
    try {
      moduleSV(bad)
    } catch (e) {
      msg = (e as Error).message
    } finally {
      console.warn = warn
      Module.setFormatterConfig({ engine: 'verible', failOnFormatError: true })
    }
    check(
      `syntax error in a module with ${JSON.stringify(config)} throws from the module check, before formatting`,
      checkError.test(msg) && warnings.length === 0,
      `got: ${JSON.stringify(msg)}, warnings: ${JSON.stringify(warnings)}`
    )
  }
} else {
  skip('syntax error through writeSystemVerilogFiles (verible-verilog-format not found on PATH)')
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { runVerible } from 'tssv/lib/tools/formatters/verible'

try { mkdirSync('sv-examples/Core/verible', { recursive: true }) } catch (e) {}

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
  writeFileSync('sv-examples/Core/verible/sample_formatted.sv', result)
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
writeFileSync('sv-examples/Core/verible/missing_binary_fallback.sv', result2)
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
// a stand-in formatter that sleeps, so the timeout fires however fast Verible is
const result4 = runVerible(SAMPLE_SV, {
  veriblePath: process.execPath,
  veribleFlags: ['-e', 'setTimeout(() => {}, 5000)'],
  formatTimeoutMs: 100,
  failOnFormatError: false
})
writeFileSync('sv-examples/Core/verible/timeout_fallback.sv', result4)
check(
  'timeout with failOnFormatError=false returns original SV',
  result4 === SAMPLE_SV
)

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

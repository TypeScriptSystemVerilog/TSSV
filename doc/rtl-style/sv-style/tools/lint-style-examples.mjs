#!/usr/bin/env node
// Lint every SystemVerilog example in doc/rtl-style/sv-style/sv-coding-style.md with the pinned Verilator.
//
// Each ```systemverilog block must be preceded by an annotation comment:
//
//   <!-- lint: do                       (must be clean under -Wall)
//   <!-- lint: dont CODE [CODE ...]     (must trigger every listed warning)
//   <!-- lint: dont                     (no warning cited; must still elaborate)
//   input  logic [1:0] req              (one port per line ...)
//   output logic [1:0] grant
//   logic tmp;                          (... or a module-scope declaration, ending in ';')
//   -->
//
// The block is wrapped in a module with those ports and declarations, then linted.
// Exits 0 if every example behaves as annotated, 1 otherwise.

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const DOC = 'doc/rtl-style/sv-style/sv-coding-style.md'

// The pin lives in README.md's Verilator install block; don't duplicate it here.
const pinMatch = readFileSync('README.md', 'utf8').match(/^VERILATOR_VERSION=v(\S+)$/m)
if (!pinMatch) {
  console.error('ERROR: no VERILATOR_VERSION=v<version> line in README.md')
  process.exit(1)
}
const pin = pinMatch[1]
let version
try {
  version = execFileSync('verilator', ['--version'], { encoding: 'utf8' }).trim()
} catch {
  console.error('ERROR: verilator not found on PATH')
  process.exit(1)
}
if (!version.startsWith(`Verilator ${pin} `)) {
  console.error(`ERROR: expected Verilator ${pin} (README.md pin), found "${version}"`)
  process.exit(1)
}

// Collect each systemverilog fence with the annotation comment that precedes it.
const lines = readFileSync(DOC, 'utf8').split('\n')
const examples = []
const errors = []
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() !== '```systemverilog') continue
  const start = i + 1
  let end = start
  while (end < lines.length && lines[end].trim() !== '```') end++
  const code = lines.slice(start, end).join('\n')

  // The annotation must end on the last non-blank line before the fence.
  let j = i - 1
  while (j >= 0 && lines[j].trim() === '') j--
  if (j < 0 || lines[j].trim() !== '-->') {
    errors.push(`${DOC}:${i + 1}: systemverilog block has no <!-- lint: ... --> annotation`)
    i = end
    continue
  }
  let k = j - 1
  while (k >= 0 && !lines[k].trim().startsWith('<!-- lint:')) k--
  const header = lines[k].trim().replace(/^<!-- lint:\s*/, '').split(/\s+/)
  const kind = header[0]
  if (kind !== 'do' && kind !== 'dont') {
    errors.push(`${DOC}:${k + 1}: lint kind must be "do" or "dont", got "${kind}"`)
    i = end
    continue
  }
  const decls = lines.slice(k + 1, j).map((l) => l.trim()).filter((l) => l !== '')
  examples.push({
    line: i + 1,
    kind,
    expect: header.slice(1),
    ports: decls.filter((d) => /^(input|output|inout)\b/.test(d)),
    locals: decls.filter((d) => !/^(input|output|inout)\b/.test(d)),
    code
  })
  i = end
}

const dir = mkdtempSync(join(tmpdir(), 'lint-style-examples-'))
let failed = errors.length
try {
  for (const ex of examples) {
    const name = `example_l${ex.line}`
    const src = [
      `module ${name} (`,
      ex.ports.map((p) => `  ${p}`).join(',\n'),
      ');',
      ...ex.locals.map((l) => `  ${l}`),
      ex.code,
      'endmodule',
      ''
    ].join('\n')
    const file = join(dir, `${name}.sv`)
    writeFileSync(file, src)
    const run = spawnSync('verilator', ['--lint-only', '-Wall', '-Wno-fatal', file], { encoding: 'utf8' })
    const out = run.stdout + run.stderr
    const warnings = [...new Set([...out.matchAll(/%Warning-([A-Z0-9_]+)/g)].map((m) => m[1]))].sort()
    const hardErrors = out.split('\n').filter((l) => l.startsWith('%Error') && !l.includes('Exiting due to'))

    let problem = null
    if (hardErrors.length > 0) {
      problem = `does not elaborate:\n    ${hardErrors.join('\n    ')}`
    } else if (ex.kind === 'do' && warnings.length > 0) {
      problem = `"do" example has warnings: ${warnings.join(', ')}\n${out.replace(/^/gm, '    ')}`
    } else if (ex.kind === 'dont') {
      const missing = ex.expect.filter((w) => !warnings.includes(w))
      if (missing.length > 0) problem = `"dont" example did not trigger ${missing.join(', ')} (got: ${warnings.join(', ') || 'none'})`
    }

    const label = ex.kind === 'do' ? 'do  ' : `dont${ex.expect.length > 0 ? ` [${ex.expect.join(' ')}]` : ''}`
    if (problem) {
      console.log(`FAIL: ${DOC}:${ex.line} ${label} ${problem}`)
      failed++
    } else {
      console.log(`PASS: ${DOC}:${ex.line} ${label}${ex.kind === 'dont' ? ` (got: ${warnings.join(', ') || 'none'})` : ''}`)
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true })
}

for (const e of errors) console.log(`FAIL: ${e}`)
console.log(`\n${examples.length + errors.length - failed} passed, ${failed} failed (Verilator ${pin})`)
process.exit(failed > 0 ? 1 : 0)

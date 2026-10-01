#!/usr/bin/env node
// Run every check that verifies the RTL coding style guide (`npm run check:rtl-style`).
// Run from the repo root. Exits 0 only if every check passes.

import { spawnSync } from 'node:child_process'

const TOOLS = 'doc/rtl-style/tools'
const CHECKS = [
  ['Doc examples lint as annotated', 'lint-style-examples.mjs'],
  ['Every rule covered; sim examples pass', 'check-rules.mjs'],
  ['Width examples: lint and exact arithmetic', 'check-width-examples.mjs'],
  ['Builder examples and generated SV', 'check-builder-examples.mjs']
]

const summary = []
for (const [title, script] of CHECKS) {
  console.log(`\n=== ${title} (${script})`)
  const run = spawnSync('node', [`${TOOLS}/${script}`], { stdio: 'inherit' })
  summary.push([run.status === 0 ? 'PASS' : 'FAIL', title])
}

console.log('\n=== Summary')
for (const [status, title] of summary) console.log(`${status}: ${title}`)
process.exit(summary.every(([s]) => s === 'PASS') ? 0 : 1)

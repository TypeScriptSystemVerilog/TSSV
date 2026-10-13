#!/usr/bin/env node
// Run every check that verifies the two style guides in doc/rtl-style/ (`npm run check:rtl-style`):
// the SV guide (sv-style/) and the TSSV guide (tssv-style/).
// Run from the repo root. Exits 0 only if every check passes.

import { spawnSync } from 'node:child_process'

const CHECKS = [
  ['SV guide: doc examples lint as annotated', 'sv-style/tools/lint-style-examples.mjs'],
  ['SV guide: every rule covered; sim examples pass', 'sv-style/tools/check-rules.mjs'],
  ['SV guide: width examples lint and match exact arithmetic', 'sv-style/tools/check-width-examples.mjs'],
  ['Both guides: builder checks and generated SV', 'sv-style/tools/check-builder-examples.mjs'],
  ['TSSV guide: every rule covered; IDs apart from the SV guide; repo scans', 'tssv-style/tools/check-rules.mjs'],
  ['TSSV guide: ts examples type-check, run and lint as annotated', 'tssv-style/tools/check-ts-examples.mjs']
]

const summary = []
for (const [title, script] of CHECKS) {
  console.log(`\n=== ${title} (${script})`)
  const run = spawnSync('node', [`doc/rtl-style/${script}`], { stdio: 'inherit' })
  summary.push([run.status === 0 ? 'PASS' : 'FAIL', title])
}

console.log('\n=== Summary')
for (const [status, title] of summary) console.log(`${status}: ${title}`)
process.exit(summary.every(([s]) => s === 'PASS') ? 0 : 1)

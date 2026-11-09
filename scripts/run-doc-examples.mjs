#!/usr/bin/env node
// Runs every doc example under ts/doc-examples/core/ (`npm run docs:examples`, which builds
// first), so each writes the SystemVerilog it emits under doc/examples/core/<example>/. The
// core's JSDoc includes the example's TypeScript and that SV with {@includeCode}, so the SV in
// the reference is always what the call emits. The output is committed; the docs-reference
// workflow reruns this in the tssv-ci image (the SV is Verible-formatted) and fails on a diff.
//
// doc/examples/core/ is emptied first, so an example that is removed or renamed leaves nothing
// behind. Each example runs in its own node process, from the repo root.
//
// Usage: node scripts/run-doc-examples.mjs   (after `npx tsc`)

import { execFileSync } from 'node:child_process'
import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'ts/doc-examples/core'
const OUT = 'out/doc-examples/core'
const DOC = 'doc/examples/core'
// Shared by the examples; not an example itself
const HELPERS = new Set(['writeExample.ts'])

const examples = readdirSync(SRC).filter(f => f.endsWith('.ts') && !HELPERS.has(f)).sort()
if (examples.length === 0) throw Error(`no examples in ${SRC}`)

rmSync(DOC, { recursive: true, force: true })
for (const file of examples) {
  const js = join(OUT, file.replace(/\.ts$/, '.js'))
  console.log(`running ${js}`)
  execFileSync(process.execPath, [js], { stdio: 'inherit' })
}
console.log(`${examples.length} example(s) written to ${DOC}/`)

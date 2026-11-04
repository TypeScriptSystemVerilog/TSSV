#!/usr/bin/env node
// Checks every port contract the generated modules declare (doc/framework/concepts.md, "Port
// contracts"). A contract promises no combinational path from an input bit to an output bit of a
// module, declared with Module.addNoCombinationalPathContract().
//
// writeSystemVerilogFiles() writes `<module>.contracts.json` beside `<module>.sv` for each module
// with contracts. It holds two kinds of wrapper around the module:
//
//   - the open one, every port brought out, as a lint wrapper does;
//   - one per contract, which ties the contract's `to` back into its `from`, so a path through the
//     module becomes a combinational loop.
//
// Each is linted with `verilator --lint-only -Wall`, and only UNOPTFLAT (a combinational loop)
// and errors count; other warnings are the module's own lint's business. A contract fails when its
// wrapper has a loop and the open one has none. Comparing with the open wrapper, rather than
// reading the loop's path, is what keeps a loop inside the module from being blamed on a contract:
// Verilator merges a module's ports into the wrapper's nets, so the path it prints can name
// wrapper lines for a loop that never leaves the module. If the open wrapper already has a loop,
// a closed one can't tell its own loop apart, so every contract of that module is reported as not
// checked, which counts as a failure.
//
// The arguments are directories, searched recursively for `*.contracts.json`; the default is
// sv-examples. Finding no contracts is a failure, so a wrong directory can't pass.
//
// It finds its own files from where it is, so a project runs it through its link to TSSV:
//
// Usage: node scripts/check-port-contracts.mjs [<dir>...]                     (in TSSV)
//        node node_modules/tssv/scripts/check-port-contracts.mjs [<dir>...]   (in a project)
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { lint } from '../doc/rtl-style/tools/verilator.mjs'

// Lints wrapper `top`, whose text is `sv`, from `work`, finding the module's files in `dir`.
// Returns the UNOPTFLAT warnings with their path lines, and the errors.
function run (work, dir, { top, sv }) {
  const file = join(work, `${top}.sv`)
  writeFileSync(file, sv)
  const { errors, out } = lint([file], [`-I${dir}`, '--top-module', top])
  const lines = out.split('\n')
  const loops = []
  lines.forEach((line, i) => {
    if (!line.startsWith('%Warning-UNOPTFLAT')) return
    loops.push(line)
    // The loop's path follows, one "Example path:" line per step, among Verilator's other notes
    for (let j = i + 1; j < lines.length && !lines[j].startsWith('%'); j++) {
      if (lines[j].includes('Example path:')) loops.push(lines[j])
    }
  })
  return { loops, errors }
}

const dirs = process.argv.length > 2 ? process.argv.slice(2) : ['sv-examples']
const manifests = []
for (const dir of dirs) {
  if (!existsSync(dir)) {
    console.error(`ERROR: ${dir} doesn't exist`)
    process.exit(2)
  }
  for (const f of readdirSync(dir, { recursive: true })) {
    if (String(f).endsWith('.contracts.json')) manifests.push(join(dir, String(f)))
  }
}
manifests.sort()

let passed = 0
let failed = 0
for (const path of manifests) {
  const dir = dirname(path)
  const { module, open, contracts } = JSON.parse(readFileSync(path, 'utf8'))
  const work = mkdtempSync(join(tmpdir(), 'port-contracts-'))
  const fail = (contract, why, detail) => {
    failed++
    console.error(`FAIL: ${module}: ${contract}: ${why}`)
    for (const l of detail) console.error(`    ${l.trim()}`)
  }
  let kept = false
  if (!existsSync(join(dir, `${module}.sv`))) {
    for (const c of contracts) fail(c.contract, `not checked: ${module}.sv isn't in ${dir}`, [])
  } else {
    const base = run(work, dir, open)
    if (base.errors.length > 0 || base.loops.length > 0) {
      kept = true
      for (const c of contracts) fail(c.contract, 'not checked', [])
      console.error(base.errors.length > 0
        ? `  ${module}: the open wrapper ${open.top} doesn't lint:`
        : `  ${module} has a combinational loop of its own, so a loop through a contract can't be told apart:`)
      for (const l of [...base.errors, ...base.loops]) console.error(`    ${l.trim()}`)
    } else {
      for (const c of contracts) {
        const result = run(work, dir, c)
        if (result.errors.length > 0) {
          kept = true
          fail(c.contract, `not checked: its wrapper ${c.top} doesn't lint`, result.errors)
        } else if (result.loops.length > 0) {
          kept = true
          fail(c.contract, `broken: tying the output back into the input makes a combinational loop (${c.top})`, result.loops)
        } else {
          passed++
          console.log(`PASS: ${module}: ${c.contract}`)
        }
      }
    }
  }
  // Keep the wrappers of a failure, so it can be looked at
  if (kept) console.error(`    wrappers: ${work}`)
  else rmSync(work, { recursive: true, force: true })
}

if (manifests.length === 0) {
  console.error(`FAIL: no port contracts found under ${dirs.join(', ')}`)
  process.exit(1)
}
console.log(`\n${passed} passed, ${failed} failed, in ${manifests.length} modules`)
if (failed > 0) process.exit(1)

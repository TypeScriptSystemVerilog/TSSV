#!/usr/bin/env node
// Checks that the harness under each testbench is synthesizable (doc/framework/testbench.md).
// A harness must
//
//   1. lint clean with `verilator --lint-only -Wall --no-timing`, the common waivers and
//      doc/rtl-style/sv-style/harness_waivers.vlt (SV guide LINT-1). --no-timing makes a delay a
//      warning (STMTDLY) and an event control inside a block an error (NOTIMING); without it, or
//      with --timing, lint accepts both. And
//   2. pass the SYN-1 scan in every file it includes: no initial, force or release, no # delay,
//      and no system task (doc/rtl-style/sv-style/tools/sv-scans.mjs).
//
// The arguments are testbenches, each a SimTop's .sv. A SimTop instantiates only its harness, so
// the harness is the one file the testbench includes. --harness names harness files directly
// instead, which is how to see the check fail on a SimTop.
//
// It finds its own files from where it is, so a project runs it through its link to TSSV:
//
// Usage: node scripts/check-harness.mjs <testbench.sv>...                     (in TSSV)
//        node node_modules/tssv/scripts/check-harness.mjs <testbench.sv>...   (in a project)
//        ... --harness <harness.sv>...
import { readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lint } from '../doc/rtl-style/tools/verilator.mjs'
import { scanFile, svModules } from '../doc/rtl-style/sv-style/tools/sv-scans.mjs'

const WAIVERS = fileURLToPath(new URL('../doc/rtl-style/sv-style/harness_waivers.vlt', import.meta.url))

// The files `file` includes, by name from its own directory. Matches an include line,
// `include "<name>", capturing <name>, as lintTops() in verilator.mjs does.
function includes (file) {
  return [...readFileSync(file, 'utf8').matchAll(/^[ \t]*`include[ \t]+"([^"]+)"/gm)].map(m => join(dirname(file), m[1]))
}

// `top` and every file it reaches through its includes
function reached (top, seen = new Set()) {
  if (seen.has(top)) return seen
  seen.add(top)
  for (const f of includes(top)) reached(f, seen)
  return seen
}

// The harness under testbench `tb`: the one file it includes
function harnessOf (tb) {
  const modules = svModules(readFileSync(tb, 'utf8'))
  if (!modules.some(m => m.testbench)) throw Error(`${tb}: not a testbench (no "tssv: testbench" marker), so not a SimTop`)
  const files = includes(tb)
  if (files.length !== 1) throw Error(`${tb}: includes ${files.length} files; a SimTop includes only its harness`)
  return files[0]
}

const args = process.argv.slice(2)
const direct = args[0] === '--harness'
const inputs = direct ? args.slice(1) : args
if (inputs.length === 0) {
  console.error('usage: node scripts/check-harness.mjs [--harness] <file.sv>...')
  process.exit(2)
}

let failed = 0
for (const input of inputs) {
  const harness = direct ? input : harnessOf(input)
  const top = basename(harness, '.sv')
  const problems = []

  const { warnings, errors, out } = lint([harness], ['--no-timing', WAIVERS, `-I${dirname(harness)}`, '--top-module', top])
  if (warnings.length > 0 || errors.length > 0) {
    problems.push(`verilator --lint-only -Wall --no-timing: ${[...errors, ...warnings.map(w => `%Warning-${w}`)].join(', ')}`)
    problems.push(...out.trim().split('\n').map(l => `    ${l}`))
  }
  for (const file of reached(harness)) {
    for (const { rule, finding } of scanFile(readFileSync(file, 'utf8'))) problems.push(`${rule}: ${basename(file)}: ${finding}`)
  }

  if (problems.length === 0) {
    console.log(`PASS: ${top} is synthesizable (lint -Wall --no-timing, SYN-1 over ${reached(harness).size} files)`)
  } else {
    failed++
    console.error(`FAIL: ${top}`)
    for (const p of problems) console.error(`  ${p}`)
  }
}
if (failed > 0) {
  console.error(`\n${failed} of ${inputs.length} harnesses failed`)
  process.exit(1)
}

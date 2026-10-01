#!/usr/bin/env node
// Run the TSSV builder examples (ts/test/rtl_style/test_rtl_style_builders.ts), then check
// the SV they generate: it must lint clean under -Wall and pass the generated-SV rules
// (COMB-9, SYN-1, LINT-3). Exits 0 if everything passes, 1 otherwise.
//
// Known framework violations (rules.json "known") are reported but don't fail the run.
// Each one should be tracked by an issue and removed from rules.json when it's fixed.

import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { GENERATED_RULES, SCANS } from './sv-scans.mjs'
import { lint, requirePinnedVerilator } from './verilator.mjs'

const TEST = 'out/test/rtl_style/test_rtl_style_builders.js'
const OUT = 'sv-examples/rtl_style'
const RULES = JSON.parse(readFileSync('doc/rtl-style/rules.json', 'utf8'))

function isKnown (rule, finding) {
  return (RULES[rule]?.known ?? []).some((k) => finding.includes(k.match))
}

const pin = requirePinnedVerilator()
let failed = 0
const fail = (msg) => { failed++; console.log(`FAIL: ${msg}`) }

rmSync(OUT, { recursive: true, force: true })
const tsc = spawnSync('npx', ['tsc', '-p', '.'], { encoding: 'utf8' })
if (tsc.status !== 0) {
  console.log(`FAIL: npx tsc\n${tsc.stdout}${tsc.stderr}`)
  process.exit(1)
}
const run = spawnSync('node', [TEST], { encoding: 'utf8' })
if (run.status !== 0) fail(`${TEST} exited ${run.status}\n${run.stdout}${run.stderr}`)

// Builder checks.
const results = run.stdout.split('\n').filter((l) => l.startsWith('RESULT ')).map((l) => JSON.parse(l.slice(7)))
const builderRules = Object.keys(RULES).filter((r) => RULES[r].checks.includes('builder'))
for (const r of results) {
  if (!builderRules.includes(r.rule)) fail(`${r.rule}: builder check "${r.what}" but rules.json doesn't list "builder" for it`)
  else if (r.pass) console.log(`PASS: ${r.rule} ${r.what}`)
  else fail(`${r.rule} ${r.what}: ${r.msg}`)
}
for (const rule of builderRules) {
  if (!results.some((r) => r.rule === rule)) fail(`${rule}: rules.json lists "builder" but no builder check exists`)
}

// Generated SV: lint, then scans.
const known = new Map()
for (const f of readdirSync(OUT).filter((n) => n.endsWith('.sv')).sort()) {
  const file = join(OUT, f)
  const l = lint([file])
  if (l.errors.length > 0 || l.warnings.length > 0) fail(`${file}: lint ${[...l.errors, ...l.warnings].join(', ')}`)
  else console.log(`PASS: ${file} lints clean`)
  const sv = readFileSync(file, 'utf8')
  for (const [rule, scan] of Object.entries(SCANS)) {
    for (const finding of new Set(scan(sv))) {
      if (isKnown(rule, finding)) {
        const k = `${rule}: ${finding}`
        known.set(k, (known.get(k) ?? 0) + 1)
      } else {
        fail(`${file} ${rule}: ${finding}`)
      }
    }
  }
}

for (const [k, n] of known) console.log(`KNOWN: ${k} (${n} file${n === 1 ? '' : 's'})`)
for (const rule of Object.keys(RULES).filter((r) => RULES[r].checks.includes('generated'))) {
  if (!GENERATED_RULES.includes(rule)) fail(`${rule}: rules.json lists "generated" but no generated-SV check exists`)
}

console.log(`\n${results.length} builder checks, ${failed} failed, ${known.size} known framework violations (Verilator ${pin})`)
process.exit(failed > 0 ? 1 : 0)

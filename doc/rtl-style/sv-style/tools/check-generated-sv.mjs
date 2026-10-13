#!/usr/bin/env node
// Check the SV the test scripts generate (`npm run check:generated-sv`, after `bash runAllTests.sh`):
// `verilator --lint-only -Wall` (LINT-1) and the scans in sv-scans.mjs (COMB-9, SYN-1, LINT-3) on
// everything under sv-examples/, against a per-file baseline of the findings it has today,
// ../generated-baseline.json. The SV guide's #59 work removes them file by file.
//
// Lint groups files as scripts/lint-sv.sh does. A test script writes a Verilator filelist,
// <top>.f, for an emission that has to be linted through a top: a testbench emitted apart from
// its DUT, or a module with interface ports, through a wrapper that instantiates the interfaces
// (ts/test/models/lintFilelist.ts, lintWrapper.ts). Each filelist is linted with -F, and the .sv
// files it names aren't linted alone. Every other .sv file is linted alone. A warning is a
// finding against the file it points at. One in a file outside sv-examples/, such as a
// hand-written testbench in verilatorTB/, isn't generated SV and isn't checked.
//
// The scans run on each .sv file. SYN-1 skips the modules a test script marked as testbenches
// (ts/test/models/testbench.ts).
//
// A finding is its rule and message, with no line number, so an edit elsewhere in the file
// doesn't change it. The baseline lists each file's findings with how often each occurs. The
// check fails on a Verilator error, on a finding the baseline doesn't list (or more of one than
// it lists), and on a baseline entry that occurs less often than listed, or not at all. A fix
// therefore has to remove its entries. `--update-baseline` rewrites the baseline from what the
// check finds, and prints what it added and removed.
//
// Left out: sv-examples/rtl_style_ts/, which `npm run check:rtl-style` writes rather than the
// test scripts, and the paths in the baseline's "exempt", each with its reason. Run this before
// `npm run check:rtl-style`, as CI does: the TSSV guide's TEST-1 example also writes an SFIFO
// configuration under sv-examples/SFIFO/ that no test script writes.
//
// Exits 0 if every finding matches the baseline, 1 otherwise.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { lint, requirePinnedVerilator } from '../../tools/verilator.mjs'
import { scanFile } from './sv-scans.mjs'

const OUT = 'sv-examples'
const NOT_TEST_OUTPUT = `${OUT}/rtl_style_ts/`
const BASELINE = 'doc/rtl-style/sv-style/generated-baseline.json'
const update = process.argv.includes('--update-baseline')

const pin = requirePinnedVerilator()
if (!existsSync(OUT)) {
  console.error(`ERROR: no ${OUT}/: run bash runAllTests.sh first`)
  process.exit(1)
}
const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'))
const exempt = Object.keys(baseline.exempt ?? {})

const repoPath = (p) => relative('.', resolve(p))
const inScope = (p) => p.startsWith(`${OUT}/`) && !p.startsWith(NOT_TEST_OUTPUT) && !exempt.some((e) => p.startsWith(e))

const generated = readdirSync(OUT, { recursive: true }).map((p) => join(OUT, p)).filter(inScope).sort()
const svFiles = generated.filter((p) => p.endsWith('.sv'))
const filelists = generated.filter((p) => p.endsWith('.f'))

let failed = 0
const fail = (msg) => { failed++; console.log(`FAIL: ${msg}`) }

// file -> finding -> where each occurrence is ('' for a scan finding, which has no line)
const found = new Map()
const record = (file, finding, where) => {
  if (!found.has(file)) found.set(file, new Map())
  const f = found.get(file)
  f.set(finding, [...(f.get(finding) ?? []), where])
}

// Lint units, grouped as lint-sv.sh groups them
const grouped = new Set()
const units = []
for (const filelist of filelists) {
  for (const line of readFileSync(filelist, 'utf8').split('\n').map((l) => l.trim())) {
    if (line.endsWith('.sv') && !line.startsWith('//') && !line.startsWith('-')) grouped.add(repoPath(join(dirname(filelist), line)))
  }
  units.push({ label: filelist, files: [], flags: ['-F', filelist] })
}
for (const file of svFiles.filter((f) => !grouped.has(f))) units.push({ label: file, files: [file], flags: [] })

const seen = new Set() // a file in two units reports the same warning twice
for (const unit of units) {
  const { errors, out } = lint(unit.files, unit.flags)
  if (errors.length > 0) {
    fail(`${unit.label}: Verilator error\n    ${errors.join('\n    ')}`)
    continue
  }
  for (const m of out.matchAll(/^%Warning-(\w+):(?: ([^:\n]+):(\d+):(\d+):)? (.*)$/gm)) {
    const [, code, path, line, col, message] = m
    const file = path === undefined ? unit.label : repoPath(path)
    if (!inScope(file)) continue
    const finding = `LINT-1 ${code}: ${message}`
    const key = `${file}:${line}:${col} ${finding}`
    if (seen.has(key)) continue
    seen.add(key)
    record(file, finding, line === undefined ? '' : `line ${line}`)
  }
}

for (const file of svFiles) {
  for (const { rule, finding } of scanFile(readFileSync(file, 'utf8'))) record(file, `${rule} ${finding}`, '')
}

// Compare with the baseline. In update mode the differences are reported, not failed.
const listed = baseline.findings ?? {}
const files = [...new Set([...svFiles, ...found.keys(), ...Object.keys(listed)])].sort()
const report = update ? (msg) => console.log(msg) : fail
let total = 0
for (const file of files) {
  const have = found.get(file) ?? new Map()
  const want = listed[file] ?? {}
  if (listed[file] !== undefined && !generated.includes(file)) {
    report(`${file}: the baseline lists it, but it ${inScope(file) ? "wasn't generated (run bash runAllTests.sh first)" : 'is outside the check'}`)
    continue
  }
  let ok = true
  for (const finding of [...new Set([...have.keys(), ...Object.keys(want)])].sort()) {
    const where = (have.get(finding) ?? []).filter((w) => w !== '')
    const n = have.get(finding)?.length ?? 0
    const b = want[finding] ?? 0
    total += n
    if (n === b) continue
    ok = false
    const at = where.length > 0 ? ` (${where.join(', ')})` : ''
    if (update) report(`${n > b ? 'ADDED' : 'REMOVED'}: ${file}: ${finding} (${b} -> ${n})`)
    else if (b === 0) fail(`${file}: new finding: ${finding}${at}`)
    else if (n > b) fail(`${file}: occurs ${n} times, the baseline lists ${b}: ${finding}${at}`)
    else if (n === 0) fail(`${file}: no longer occurs; remove it from the baseline: ${finding}`)
    else fail(`${file}: occurs ${n} times, the baseline lists ${b}; lower its count to ${n}: ${finding}`)
  }
  if (ok && !update) console.log(`PASS: ${file}${have.size > 0 ? ` (${[...have.values()].reduce((s, w) => s + w.length, 0)} in the baseline)` : ''}`)
}

if (update && failed > 0) {
  console.log(`\nNot writing ${BASELINE}: a Verilator error isn't a finding the baseline can hold`)
} else if (update) {
  const findings = Object.fromEntries([...found.keys()].sort().map((file) =>
    [file, Object.fromEntries([...found.get(file)].sort(([a], [b]) => a < b ? -1 : 1).map(([finding, where]) => [finding, where.length]))]))
  writeFileSync(BASELINE, JSON.stringify({ ...baseline, findings }, null, 2) + '\n')
  console.log(`\nWrote ${BASELINE}: ${total} findings in ${found.size} files (Verilator ${pin})`)
} else {
  console.log(`\n${units.length} lint units, ${svFiles.length} files scanned, ${total} findings in ${found.size} files; ${failed} failed (Verilator ${pin})`)
}
process.exit(failed > 0 ? 1 : 0)

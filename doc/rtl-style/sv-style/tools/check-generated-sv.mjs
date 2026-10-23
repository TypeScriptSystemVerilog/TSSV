#!/usr/bin/env node
// Check the SV the test scripts generate (`npm run check:generated-sv`, after `bash runAllTests.sh`):
// `verilator --lint-only -Wall` with the common waivers file (LINT-1, through lint() in
// ../../tools/verilator.mjs) and the scans in sv-scans.mjs (SYN-1, LINT-3) on
// everything under sv-examples/. Every finding fails.
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
// Left out: the paths in LEFT_OUT below, each with its reason. Run this before
// `npm run check:rtl-style`, as CI does: the TSSV guide's TEST-1 example also writes an SFIFO
// configuration under sv-examples/SFIFO/ that no test script writes.
//
// Exits 0 if there are no findings and no Verilator errors, 1 otherwise.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { lint, requirePinnedVerilator } from '../../tools/verilator.mjs'
import { scanFile } from './sv-scans.mjs'

const OUT = 'sv-examples'
// Paths under sv-examples/ that the check skips, and why. Add one only when the SV guide doesn't
// apply to what is written there, never to get a finding past the check.
const LEFT_OUT = {
  [`${OUT}/rtl_style_ts/`]: '`npm run check:rtl-style` writes it, not the test scripts.',
  [`${OUT}/AXI4XBar/`]: "Rocket Chip's generator writes this SV, not TSSV's builders, so the SV guide doesn't apply to it. test_AXI4XBar also needs Docker, so runAllTests.sh skips it (scripts/test-skips.sh)."
}

const pin = requirePinnedVerilator()
if (!existsSync(OUT)) {
  console.error(`ERROR: no ${OUT}/: run bash runAllTests.sh first`)
  process.exit(1)
}

const repoPath = (p) => relative('.', resolve(p))
const inScope = (p) => p.startsWith(`${OUT}/`) && !Object.keys(LEFT_OUT).some((e) => p.startsWith(e))

const generated = readdirSync(OUT, { recursive: true }).map((p) => join(OUT, p)).filter(inScope).sort()
const svFiles = generated.filter((p) => p.endsWith('.sv'))
const filelists = generated.filter((p) => p.endsWith('.f'))

let failed = 0
const fail = (msg) => { failed++; console.log(`FAIL: ${msg}`) }

// file -> its findings, each with its line if it has one (a scan finding doesn't)
const found = new Map()
const record = (file, finding, line) => {
  if (!found.has(file)) found.set(file, [])
  found.get(file).push(line === undefined ? finding : `${finding} (line ${line})`)
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
    record(file, finding, line)
  }
}

for (const file of svFiles) {
  for (const { rule, finding } of scanFile(readFileSync(file, 'utf8'))) record(file, `${rule} ${finding}`)
}

let total = 0
for (const file of [...new Set([...svFiles, ...found.keys()])].sort()) {
  const findings = found.get(file) ?? []
  total += findings.length
  if (findings.length === 0) console.log(`PASS: ${file}`)
  for (const finding of findings.sort()) fail(`${file}: ${finding}`)
}

console.log(`\n${units.length} lint units, ${svFiles.length} files scanned, ${total} findings in ${found.size} files; ${failed} failed (Verilator ${pin})`)
process.exit(failed > 0 ? 1 : 0)

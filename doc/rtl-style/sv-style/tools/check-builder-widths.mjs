#!/usr/bin/env node
// Check the SV the expression builders in ts/src/core/Base.ts emit (#146): addAdder,
// addSubtractor, addMultiplier, addRound, addSaturate, addMux, addConstSignal, addSubmodule's
// width extension and constant bindings, and addRegister's reset values.
//
// ts/test/rtl_style/test_builder_widths.ts builds each case: one builder at signed, unsigned and
// mismatched widths, with test vectors from a reference model in exact integer arithmetic. Here,
// each case's module must lint clean under -Wall with only the common waivers file, which lint()
// passes (../common_waivers.vlt), and every vector must give the reference result in simulation.
// A clocked case is simulated held in reset, so its outputs must be the reset values. A case whose
// result is narrower than its input leaves input bits unused on purpose; it records why, and is
// linted without UNUSEDSIGNAL.
//
// Run from the repo root. Exits 0 if every case passes, 1 otherwise.

import { spawnSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { lint, requirePinnedVerilator, simulate } from '../../tools/verilator.mjs'

const GENERATOR = 'out/test/rtl_style/test_builder_widths.js'

const pin = requirePinnedVerilator()
let failed = 0
const fail = (msg) => { failed++; console.log(`FAIL: ${msg}`) }

const tsc = spawnSync('npx', ['tsc', '-p', '.'], { encoding: 'utf8' })
if (tsc.status !== 0) {
  console.log(`FAIL: npx tsc\n${tsc.stdout}${tsc.stderr}`)
  process.exit(1)
}

const dir = mkdtempSync(join(tmpdir(), 'builder-widths-'))
try {
  const gen = spawnSync('node', [GENERATOR, dir], { encoding: 'utf8' })
  if (gen.status !== 0) {
    console.log(`FAIL: ${GENERATOR} exited ${gen.status}\n${gen.stdout}${gen.stderr}`)
    process.exit(1)
  }
  const cases = JSON.parse(readFileSync(join(dir, 'cases.json'), 'utf8'))

  // Lint each case with the common waivers. Its files are in <dir>/<case>/, one module per file:
  // the top's includes bring in a submodule's file where the case has one (USE_INCLUDES).
  const lintFailed = new Set()
  for (const c of cases) {
    const file = join(dir, c.file)
    const caseDir = join(dir, c.name)
    for (const f of readdirSync(caseDir)) {
      if (/lint_off/.test(readFileSync(join(caseDir, f), 'utf8'))) fail(`${c.name}: ${f} has a lint waiver`)
    }
    // A case that narrows on purpose leaves input bits unused, and says why
    const { errors, out } = lint([file], ['--top-module', c.top, `+incdir+${caseDir}`, ...(c.unused ? ['-Wno-UNUSEDSIGNAL'] : [])])
    const warnings = out.split('\n').filter((l) => l.startsWith('%Warning')).map((l) => l.replace(`${file}:`, ''))
    if (errors.length > 0 || warnings.length > 0) {
      lintFailed.add(c.name)
      fail(`${c.name}: lint with the common waivers\n    ${[...errors, ...warnings].join('\n    ')}`)
    }
  }

  // Simulate every case with vectors in one testbench: drive each vector, wait, compare.
  const simulated = cases.filter((c) => c.vectors.length > 0)
  const tb = ['module builder_widths_tb;', '  int errors [string];']
  const run = ['  initial begin']
  simulated.forEach((c, i) => {
    const inW = c.inputs.reduce((n, p) => n + p.width, 0)
    const outW = c.outputs.reduce((n, p) => n + p.width, 0)
    const pack = (ports, values) => ports.reduce((acc, p, k) => (acc << BigInt(p.width)) | BigInt(`0x${values[k]}`), 0n).toString(16)
    writeFileSync(join(dir, `${c.name}.vin`), c.vectors.map((v) => pack(c.inputs, v.in)).join('\n') + '\n')
    writeFileSync(join(dir, `${c.name}.vexp`), c.vectors.map((v) => pack(c.outputs, v.out)).join('\n') + '\n')
    const slice = (ports) => {
      let hi = ports.reduce((n, p) => n + p.width, 0) - 1
      return ports.map((p) => { const s = `[${hi}:${hi - p.width + 1}]`; hi -= p.width; return [p.name, s] })
    }
    const conns = [
      ...(c.clocked ? ['.clk(1\'b0)', `.rst_n(rst_n_${i})`] : []),
      ...slice(c.inputs).map(([n, s]) => `.${n}(in_${i}${s})`),
      ...slice(c.outputs).map(([n, s]) => `.${n}(out_${i}${s})`)
    ]
    tb.push(`  // ${c.name}`)
    // A clocked case's reset starts high, and falls before its vectors: a negedge of rst_n
    if (c.clocked) tb.push(`  logic rst_n_${i} = 1'b1;`)
    if (inW > 0) tb.push(`  logic [${inW - 1}:0] vin_${i} [${c.vectors.length}];`, `  logic [${inW - 1}:0] in_${i};`)
    tb.push(`  logic [${outW - 1}:0] vexp_${i} [${c.vectors.length}];`, `  wire  [${outW - 1}:0] out_${i};`)
    tb.push(`  ${c.top} u_${i} (${conns.join(', ')});`)
    run.push(`    errors["${c.name}"] = 0;`)
    if (inW > 0) run.push(`    $readmemh("${join(dir, `${c.name}.vin`)}", vin_${i});`)
    run.push(`    $readmemh("${join(dir, `${c.name}.vexp`)}", vexp_${i});`)
    if (c.clocked) run.push(`    rst_n_${i} = 1'b0;`)
    run.push(`    for (int k = 0; k < ${c.vectors.length}; k++) begin`)
    if (inW > 0) run.push(`      in_${i} = vin_${i}[k];`)
    run.push('      #1;')
    run.push(`      if (out_${i} !== vexp_${i}[k]) begin`)
    run.push(`        if (errors["${c.name}"] < 3) $display("MISMATCH ${c.name}: in=%h out=%h expected=%h", ${inW > 0 ? `in_${i}` : "1'b0"}, out_${i}, vexp_${i}[k]);`)
    run.push(`        errors["${c.name}"]++;`)
    run.push('      end')
    run.push('    end')
  })
  run.push('    foreach (errors[name]) $display("CASE %s %0d", name, errors[name]);', '    $finish;', '  end')
  writeFileSync(join(dir, 'builder_widths_tb.sv'), [...tb, ...run, 'endmodule', ''].join('\n'))

  let out = ''
  try {
    out = simulate([...simulated.map((c) => join(dir, c.file)), join(dir, 'builder_widths_tb.sv')], 'builder_widths_tb',
      simulated.map((c) => `+incdir+${join(dir, c.name)}`))
  } catch (e) {
    fail(`simulation: ${e.message}`)
  }
  const mismatches = new Map()
  for (const m of out.matchAll(/^MISMATCH (\w+): (.*)$/gm)) mismatches.set(m[1], [...(mismatches.get(m[1]) ?? []), m[2]])
  const counts = new Map([...out.matchAll(/^CASE (\w+) (\d+)$/gm)].map((m) => [m[1], Number(m[2])]))

  for (const c of cases) {
    if (c.vectors.length === 0) {
      if (!lintFailed.has(c.name)) console.log(`PASS: ${c.name} (lint only)`)
      continue
    }
    const n = counts.get(c.name)
    if (n === undefined) {
      if (out !== '') fail(`${c.name}: no result from the simulation`)
    } else if (n > 0) {
      fail(`${c.name}: ${n} of ${c.vectors.length} vectors differ from the reference\n    ${(mismatches.get(c.name) ?? []).join('\n    ')}`)
    } else if (!lintFailed.has(c.name)) {
      console.log(`PASS: ${c.name} (${c.vectors.length} vectors)`)
    }
  }
  console.log(`\n${cases.length} cases, ${simulated.length} simulated, ${failed} failed (Verilator ${pin})`)
} finally {
  rmSync(dir, { recursive: true, force: true })
}
process.exit(failed > 0 ? 1 : 0)

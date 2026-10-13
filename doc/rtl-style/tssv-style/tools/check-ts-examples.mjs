#!/usr/bin/env node
// Run every TypeScript example in doc/rtl-style/tssv-style/tssv-coding-style.md as annotated.
//
// Each ```ts block must be preceded by an annotation comment:
//
//   <!-- ts: <do|dont> <body|file> [expectation ...]
//   <hidden lines>
//   -->
//
// Shape:
//   body  The example is the body of a Module constructor. Each hidden line either declares one
//         IO of that module (`clk: { direction: 'input', isClock: 'posedge' }`) or is a statement
//         run before the example (`this.addSignal('tmp', {})`). The module is emitted afterwards.
//   file  The example is a whole TypeScript file, imports included. The hidden lines are
//         statements run after it, usually `emit(new MyModule({ ... }))`.
//
// Expectations:
//   throws "text"   running the example throws an error whose message contains text
//   emits "text"    an emitted module contains text (whitespace-normalized)
//   lacks "text"    no emitted module contains text (whitespace-normalized)
//   lint CODE       an emitted module raises this Verilator -Wall warning
//   allow CODE      a "do" example's modules may raise this warning; the guide's text says why
//   tserror TSnnnn  type-checking the example reports this error; the example isn't run
//
// Without throws or tserror, the example must type-check and run to completion. Every module a
// "do" example emits must lint clean under -Wall and pass the generated-SV scans of the SV guide
// (sv-style/tools/sv-scans.mjs), apart from that guide's known framework violations.
//
// Two helpers are in scope in every example: emit(m) writes m's SV for checking and returns it,
// and expect(cond, msg) throws msg unless cond holds.
//
// Run from the repo root. Exits 0 if every example behaves as annotated, 1 otherwise.

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SCANS } from '../../sv-style/tools/sv-scans.mjs'
import { lint, requirePinnedVerilator } from '../../tools/verilator.mjs'

const DOC = 'doc/rtl-style/tssv-style/tssv-coding-style.md'
const SV_RULES = JSON.parse(readFileSync('doc/rtl-style/sv-style/rules.json', 'utf8'))
const WORK = 'sv-examples/rtl_style_ts'
const EXPECTATIONS = ['throws', 'emits', 'lacks', 'lint', 'allow', 'tserror']
// writeSystemVerilog() puts a module's submodule definitions ahead of it in the same file, so a
// file named after the module starts with another module. That is the emission layout, not
// something an example can change.
const LINT_FLAGS = ['-Wno-DECLFILENAME']

// ---------------------------------------------------------------- parse the doc
export function parseExamples (doc) {
  const lines = doc.split('\n')
  const examples = []
  const errors = []
  for (let i = 0; i < lines.length; i++) {
    if (!/^```(ts|typescript)\s*$/.test(lines[i].trim())) continue
    const start = i + 1
    let end = start
    while (end < lines.length && lines[end].trim() !== '```') end++
    const code = lines.slice(start, end).join('\n')

    // The annotation must end on the last non-blank line before the fence.
    let j = i - 1
    while (j >= 0 && lines[j].trim() === '') j--
    if (j < 0 || lines[j].trim() !== '-->') {
      errors.push(`${DOC}:${i + 1}: ts block has no <!-- ts: ... --> annotation`)
      i = end
      continue
    }
    let k = j - 1
    while (k >= 0 && !lines[k].trim().startsWith('<!-- ts:')) k--
    if (k < 0) {
      errors.push(`${DOC}:${i + 1}: ts block has no <!-- ts: ... --> annotation`)
      i = end
      continue
    }
    const header = lines[k].trim().replace(/^<!-- ts:\s*/, '')
    const [kind, shape] = header.split(/\s+/)
    const expect = [...header.matchAll(/(\w+)\s+(?:"([^"]*)"|(\S+))/g)].slice(1)
      .map((m) => ({ what: m[1], arg: m[2] ?? m[3] }))
    const problems = []
    if (kind !== 'do' && kind !== 'dont') problems.push(`kind must be "do" or "dont", got "${kind}"`)
    if (shape !== 'body' && shape !== 'file') problems.push(`shape must be "body" or "file", got "${shape}"`)
    for (const e of expect) if (!EXPECTATIONS.includes(e.what)) problems.push(`unknown expectation "${e.what}"`)
    if (problems.length > 0) {
      errors.push(`${DOC}:${k + 1}: ${problems.join('; ')}`)
      i = end
      continue
    }
    examples.push({ line: i + 1, kind, shape, expect, hidden: lines.slice(k + 1, j).filter((l) => l.trim() !== ''), code })
    i = end
  }
  return { examples, errors }
}

// ---------------------------------------------------------------- generate the sources
const PRELUDE = `import { mkdirSync, writeFileSync } from 'fs'
import { type Module } from 'tssv/lib/core/TSSV'

const OUT = process.env.EXAMPLE_OUT ?? '${WORK}/sv'

export function emit (m: Module): string {
  mkdirSync(OUT, { recursive: true })
  const sv = m.writeSystemVerilog()
  writeFileSync(\`\${OUT}/\${m.name}.sv\`, sv)
  return sv
}

export function expect (cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg)
}
`

const BODY_IMPORTS = `import { Module, Expr, Sig, Interface, type TSSVParameters, type IntRange } from 'tssv/lib/core/TSSV'
import { SRAM } from 'tssv/lib/modules/SRAM'
import { Memory } from 'tssv/lib/interfaces/Memory'
`

function source (ex) {
  const head = "import { emit, expect } from './prelude.js'\n"
  if (ex.shape === 'file') return `${head}${ex.code}\n\n// hidden\n${ex.hidden.join('\n')}\n`
  const isIO = (l) => /^\s*\w+\s*:\s*\{/.test(l)
  const ios = ex.hidden.filter(isIO).map((l) => `      ${l.trim()}`).join(',\n')
  const pre = ex.hidden.filter((l) => !isIO(l)).map((l) => `    ${l.trim()}`).join('\n')
  const body = ex.code.split('\n').map((l) => (l === '' ? '' : `    ${l}`)).join('\n')
  return `${head}${BODY_IMPORTS}
class Example extends Module {
  constructor () {
    super({ name: 'ex_l${ex.line}' }, {
${ios}
    })
${pre}
${body}
  }
}

emit(new Example())
`
}

// ---------------------------------------------------------------- run
function isKnown (rule, finding) {
  return (SV_RULES[rule]?.known ?? []).some((k) => finding.includes(k.match))
}

function main () {
  const pin = requirePinnedVerilator()
  const { examples, errors } = parseExamples(readFileSync(DOC, 'utf8'))
  let failed = 0
  const fail = (msg) => { failed++; console.log(`FAIL: ${msg}`) }
  for (const e of errors) fail(e)

  // The examples import 'tssv/lib/...', which resolves to the compiled framework in out/.
  const build = spawnSync('npx', ['tsc', '-p', '.'], { encoding: 'utf8' })
  if (build.status !== 0) {
    console.log(`FAIL: npx tsc\n${build.stdout}${build.stderr}`)
    process.exit(1)
  }

  rmSync(WORK, { recursive: true, force: true })
  mkdirSync(WORK, { recursive: true })
  writeFileSync(join(WORK, 'prelude.ts'), PRELUDE)
  writeFileSync(join(WORK, 'tsconfig.json'), JSON.stringify({
    extends: '../../tsconfig.json',
    compilerOptions: { rootDir: '.', outDir: './js', noEmitOnError: false, declaration: false, sourceMap: false },
    include: ['*.ts'],
    exclude: []
  }, null, 2))
  for (const ex of examples) writeFileSync(join(WORK, `ex_l${ex.line}.ts`), source(ex))

  // One type-check for every example; JS is emitted even for the ones with expected errors.
  const tsc = spawnSync('npx', ['tsc', '-p', WORK], { encoding: 'utf8' })
  const diags = {}
  for (const m of (tsc.stdout + tsc.stderr).matchAll(/(?:^|\/)(ex_l\d+|prelude)\.ts\(\d+,\d+\): error (TS\d+): (.*)$/gm)) {
    (diags[m[1]] ??= []).push({ code: m[2], text: `${m[2]}: ${m[3]}` })
  }
  if (diags.prelude) fail(`prelude.ts does not type-check: ${diags.prelude.map((d) => d.text).join('; ')}`)

  for (const ex of examples) {
    const id = `ex_l${ex.line}`
    const where = `${DOC}:${ex.line} ${ex.kind} ${ex.shape}`
    const want = (what) => ex.expect.filter((e) => e.what === what).map((e) => e.arg)
    const problems = []

    const tsErrors = diags[id] ?? []
    const wantTs = want('tserror')
    if (wantTs.length > 0) {
      const got = [...new Set(tsErrors.map((d) => d.code))]
      const missing = wantTs.filter((c) => !got.includes(c))
      if (missing.length > 0) problems.push(`expected type error ${missing.join(', ')}, got ${got.join(', ') || 'none'}`)
      if (problems.length > 0) fail(`${where}: ${problems.join('; ')}`)
      else console.log(`PASS: ${where} (type error ${got.join(', ')})`)
      continue
    }
    if (tsErrors.length > 0) {
      fail(`${where}: does not type-check:\n    ${tsErrors.map((d) => d.text).join('\n    ')}`)
      continue
    }

    const out = join(WORK, 'sv', id)
    const run = spawnSync('node', [join(WORK, 'js', `${id}.js`)], { encoding: 'utf8', env: { ...process.env, EXAMPLE_OUT: out } })
    const output = run.stdout + run.stderr
    const wantThrow = want('throws')
    if (wantThrow.length > 0) {
      if (run.status === 0) problems.push(`expected it to throw "${wantThrow.join('", "')}", but it ran to completion`)
      for (const t of wantThrow) if (run.status !== 0 && !output.includes(t)) problems.push(`expected an error containing "${t}", got:\n    ${output.trim().split('\n').slice(0, 6).join('\n    ')}`)
    } else if (run.status !== 0) {
      problems.push(`exited ${run.status}:\n    ${output.trim().split('\n').slice(0, 8).join('\n    ')}`)
    }

    const files = existsSync(out) ? readdirSync(out).filter((f) => f.endsWith('.sv')).sort().map((f) => join(out, f)) : []
    const svs = files.map((f) => readFileSync(f, 'utf8'))
    const flat = svs.map((s) => s.replace(/\s+/g, ' '))
    const norm = (t) => t.replace(/\s+/g, ' ')
    for (const t of want('emits')) if (!flat.some((s) => s.includes(norm(t)))) problems.push(`no emitted module contains "${t}"`)
    for (const t of want('lacks')) if (flat.some((s) => s.includes(norm(t)))) problems.push(`an emitted module contains "${t}"`)
    if ((want('emits').length > 0 || want('lacks').length > 0 || want('lint').length > 0) && files.length === 0) {
      problems.push('emitted no module to check')
    }

    const warnings = new Set()
    files.forEach((f, n) => {
      const l = lint([f], LINT_FLAGS)
      if (l.errors.length > 0) problems.push(`${f} does not elaborate: ${l.errors.join('; ')}`)
      for (const w of l.warnings) warnings.add(w)
      if (ex.kind === 'do') {
        const unexpected = l.warnings.filter((w) => !want('allow').includes(w))
        if (unexpected.length > 0) problems.push(`${f} has lint warnings: ${unexpected.join(', ')}\n${l.out.replace(/^/gm, '    ')}`)
        for (const [rule, scan] of Object.entries(SCANS)) {
          for (const finding of new Set(scan(svs[n]))) {
            if (!isKnown(rule, finding)) problems.push(`${f} ${rule}: ${finding}`)
          }
        }
      }
    })
    const missingLint = want('lint').filter((c) => !warnings.has(c))
    if (missingLint.length > 0) problems.push(`expected lint ${missingLint.join(', ')}, got ${[...warnings].join(', ') || 'none'}`)

    if (problems.length > 0) {
      fail(`${where}: ${problems.join('; ')}`)
    } else {
      const notes = [
        ...(wantThrow.length > 0 ? ['throws as expected'] : []),
        `${files.length} module(s) emitted`,
        ...(warnings.size > 0 ? [`lint: ${[...warnings].join(', ')}`] : [])
      ]
      console.log(`PASS: ${where} (${notes.join(', ')})`)
    }
  }

  console.log(`\n${examples.length + errors.length - failed} passed, ${failed} failed (Verilator ${pin})`)
  process.exit(failed > 0 ? 1 : 0)
}

if (import.meta.url === `file://${process.argv[1]}`) main()

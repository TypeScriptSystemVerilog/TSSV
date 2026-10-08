#!/usr/bin/env node
// Check that rules.json covers every rule in tssv-coding-style.md, that the two style guides'
// rule IDs stay apart, and run the per-rule checks that live in this script:
//   - every rule ID in the doc has a rules.json entry, and every entry is a rule in the doc
//   - no rule ID, and no ID prefix, is used by both guides
//   - every rule the SV guide marks "movedTo" names a rule in this guide
//   - "example": the rule has at least one annotated ts example (check-ts-examples.mjs runs them)
//   - "repo":    a scan of the repo's TypeScript (REPO_SCANS below) finds no violation
//   - "review":  the entry gives a reason
// "builder" is run by sv-style/tools/check-builder-examples.mjs.
// Repo findings that match a "known" entry are reported as KNOWN and don't fail the run.
// Exits 0 if everything passes, 1 otherwise.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseExamples } from './check-ts-examples.mjs'

const DOC = 'doc/rtl-style/tssv-style/tssv-coding-style.md'
const SV_DOC = 'doc/rtl-style/sv-style/sv-coding-style.md'
const KINDS = ['example', 'builder', 'repo', 'review']

const rules = JSON.parse(readFileSync('doc/rtl-style/tssv-style/rules.json', 'utf8'))
const svRules = JSON.parse(readFileSync('doc/rtl-style/sv-style/rules.json', 'utf8'))

// Each rule's text runs from its **ID (MUST|SHOULD...)** heading to the next rule or section.
function ruleSections (doc) {
  const headings = [...doc.matchAll(/^\*\*([A-Z]+-\d+)\b[^*]*\*\*/gm)]
  const sections = {}
  headings.forEach((h, i) => {
    const end = Math.min(headings[i + 1]?.index ?? doc.length, ...[...doc.slice(h.index).matchAll(/^## /gm)].map((m) => h.index + m.index))
    sections[h[1]] = { start: h.index, end, text: doc.slice(h.index, end) }
  })
  return sections
}

const doc = readFileSync(DOC, 'utf8')
const sections = ruleSections(doc)
const svSections = ruleSections(readFileSync(SV_DOC, 'utf8'))

// ---------------------------------------------------------------- repo scans
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : [p]
})
const tsFiles = (dir) => (existsSync(dir) ? walk(dir).filter((f) => f.endsWith('.ts')) : [])
const MODULES = 'ts/src/modules'
const moduleNames = readdirSync(MODULES).filter((m) => statSync(join(MODULES, m)).isDirectory()).sort()

const REPO_SCANS = {
  // MOD-1: folder, class file, index re-export and spec link for every module
  'MOD-1': () => moduleNames.flatMap((m) => {
    const file = join(MODULES, m, `${m}.ts`)
    const index = join(MODULES, m, 'index.ts')
    if (!existsSync(file)) return [`${m}: no ${file}`]
    const src = readFileSync(file, 'utf8')
    const found = []
    if (!new RegExp(`^export class ${m}\\b`, 'm').test(src)) found.push(`${m}: ${file} doesn't export class ${m}`)
    if (!src.includes(`@see doc/modules/${m}/${m}-spec.md`)) found.push(`${m}: ${file} has no @see doc/modules/${m}/${m}-spec.md`)
    if (!existsSync(`doc/modules/${m}/${m}-spec.md`)) found.push(`${m}: no doc/modules/${m}/${m}-spec.md`)
    if (!existsSync(index) || !readFileSync(index, 'utf8').includes(`from './${m}.js'`)) found.push(`${m}: ${index} doesn't re-export ./${m}.js`)
    return found
  }),
  // PARAM-4: no SV parameter declared in a module or interface, and no setVerilogParameter() on one
  'PARAM-4': () => [...tsFiles(MODULES), ...tsFiles('ts/src/interfaces')].flatMap((f) =>
    readFileSync(f, 'utf8').split('\n').flatMap((l, i) =>
      /^\s*parameter\s/.test(l) || /\bsetVerilogParameter\s*\(/.test(l) ? [`${f}:${i + 1}: ${l.trim()}`] : [])),
  // BUILD-7: no direct this.body += in a module or interface
  'BUILD-7': () => [...tsFiles(MODULES), ...tsFiles('ts/src/interfaces')].flatMap((f) =>
    readFileSync(f, 'utf8').split('\n').flatMap((l, i) => /this\.body\s*\+=/.test(l) ? [`${f}:${i + 1}: ${l.trim()}`] : [])),
  // TEST-1: some ts/test script imports every module
  'TEST-1': () => {
    const tests = tsFiles('ts/test').map((f) => readFileSync(f, 'utf8'))
    return moduleNames.filter((m) => !tests.some((t) => new RegExp(`modules/${m}['/]`).test(t)))
      .map((m) => `${m}: no ts/test script imports it`)
  }
}

// ---------------------------------------------------------------- checks
let passed = 0
let failed = 0
const known = []
const report = (ok, msg) => {
  if (ok) passed++
  else failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${msg}`)
}

for (const id of Object.keys(sections)) {
  if (!rules[id]) report(false, `${id} is in the doc but has no rules.json entry`)
}
for (const id of Object.keys(rules)) {
  if (!sections[id]) report(false, `rules.json has ${id}, which isn't a rule in the doc`)
}

// The two guides' IDs stay apart: no shared ID, and no shared prefix.
const prefix = (id) => id.replace(/-\d+$/, '')
const svPrefixes = new Set(Object.keys(svSections).map(prefix))
const shared = Object.keys(sections).filter((id) => svSections[id] !== undefined || svPrefixes.has(prefix(id)))
report(shared.length === 0, `no rule ID or ID prefix is used by both guides${shared.length ? ` (shared: ${shared.join(', ')})` : ''}`)

// Every rule the SV guide moved here exists here, and nothing moved is also still live there.
for (const [id, r] of Object.entries(svRules)) {
  if (r.movedTo === undefined) continue
  report(sections[r.movedTo] !== undefined, `SV guide ${id} moved to ${r.movedTo}, which is a rule in this guide`)
}
const movedHere = Object.values(svRules).map((r) => r.movedTo).filter((m) => m !== undefined)
report(new Set(movedHere).size === movedHere.length, 'no two SV guide rules moved to the same rule')

const { examples } = parseExamples(doc)
const lineOf = (index) => doc.slice(0, index).split('\n').length

for (const [id, rule] of Object.entries(rules)) {
  const section = sections[id]
  if (!section) continue
  const bad = (rule.checks ?? []).filter((k) => !KINDS.includes(k))
  if (!rule.checks?.length || bad.length > 0) {
    report(false, `${id}: checks must be a non-empty list of ${KINDS.join(', ')}`)
    continue
  }

  if (rule.checks.includes('example')) {
    const [from, to] = [lineOf(section.start), lineOf(section.end)]
    const n = examples.filter((e) => e.line > from && e.line <= to).length
    report(n > 0, `${id} example: ${n} annotated ts example(s)`)
  }

  if (rule.checks.includes('repo')) {
    const scan = REPO_SCANS[id]
    if (!scan) {
      report(false, `${id}: rules.json lists "repo" but there is no repo scan for it`)
    } else {
      const findings = scan()
      const isKnown = (f) => (rule.known ?? []).some((k) => f.includes(k.match))
      for (const f of findings.filter(isKnown)) known.push(`${id}: ${f}`)
      const real = findings.filter((f) => !isKnown(f))
      report(real.length === 0, `${id} repo: ${real.length === 0 ? 'no violations' : real.join('; ')}`)
    }
  }

  if (rule.checks.includes('review')) {
    report(typeof rule.reason === 'string' && rule.reason.length > 0, `${id} review: ${rule.reason ?? 'no reason given'}`)
  }
}
for (const id of Object.keys(REPO_SCANS)) {
  if (!rules[id]?.checks?.includes('repo')) report(false, `${id} has a repo scan but rules.json doesn't list "repo" for it`)
}

for (const k of known) console.log(`KNOWN: ${k}`)
const covered = Object.keys(sections).filter((id) => rules[id])
console.log(`\n${passed} passed, ${failed} failed, ${known.length} known; ${covered.length}/${Object.keys(sections).length} rules covered`)
process.exit(failed > 0 ? 1 : 0)

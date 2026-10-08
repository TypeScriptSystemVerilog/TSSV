#!/usr/bin/env node
// Check that rules.json covers every rule in sv-coding-style.md, and run the per-rule
// checks that live in this script:
//   - every rule ID in the doc has a rules.json entry, and every entry is a rule in the doc
//   - "lint":   the rule has at least one annotated systemverilog example (lint-style-examples.mjs lints them)
//   - "width":  every [`name`] the rule cites is an output or signal in sv/width/width_examples.sv
//   - "sim":    the rule's RTL files lint clean, and each testbench builds, runs and prints PASS
//   - "review": the entry gives a reason
//   - docVerbatim: each named doc example appears verbatim in its example file
//   - "movedTo": a rule that moved to the TSSV guide is only a *moved* note here, naming its new
//     ID, with no examples (doc/rtl-style/tssv-style/tools/check-rules.mjs checks the new ID exists)
// "builder" and "generated" are run by check-builder-examples.mjs.
// Exits 0 if everything passes, 1 otherwise.

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { lint, requirePinnedVerilator, simulate } from '../../tools/verilator.mjs'

const ROOT = 'doc/rtl-style/sv-style'
const DOC = `${ROOT}/sv-coding-style.md`
const WIDTH_EXAMPLES = `${ROOT}/sv/width/width_examples.sv`
const KINDS = ['lint', 'width', 'sim', 'builder', 'generated', 'review']

const doc = readFileSync(DOC, 'utf8')
const rules = JSON.parse(readFileSync(`${ROOT}/rules.json`, 'utf8'))

// Each rule's text runs from its **ID (MUST|SHOULD...)** heading to the next rule or section.
const headings = [...doc.matchAll(/^\*\*([A-Z]+-\d+)\b[^*]*\*\*/gm)]
const sections = {}
headings.forEach((h, i) => {
  const end = Math.min(headings[i + 1]?.index ?? doc.length, ...[...doc.slice(h.index).matchAll(/^## /gm)].map((m) => h.index + m.index))
  sections[h[1]] = doc.slice(h.index, end)
})

const normalize = (s) => s.replace(/\s+/g, ' ').trim()
const svBlocks = (text) => [...text.matchAll(/^```systemverilog\n([\s\S]*?)^```/gm)].map((m) => m[1])

let passed = 0
let failed = 0
const report = (ok, msg) => {
  if (ok) passed++
  else failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${msg}`)
}

const pin = requirePinnedVerilator()

for (const id of Object.keys(sections)) {
  if (!rules[id]) report(false, `${id} is in the doc but has no rules.json entry`)
}
for (const id of Object.keys(rules)) {
  if (!sections[id]) report(false, `rules.json has ${id}, which isn't a rule in the doc`)
}

const widthSrc = readFileSync(WIDTH_EXAMPLES, 'utf8')

for (const [id, rule] of Object.entries(rules)) {
  const text = sections[id]
  if (!text) continue
  if (rule.movedTo !== undefined) {
    const stub = /^\*\*[A-Z]+-\d+\*\* \*\(moved\)\*: now ([A-Z]+-\d+) in the \[TSSV guide\]/.exec(text)
    report(stub?.[1] === rule.movedTo && !text.includes('```') && rule.checks === undefined,
      `${id} moved: the doc has only a *moved* note naming ${rule.movedTo}`)
    continue
  }
  const bad = (rule.checks ?? []).filter((k) => !KINDS.includes(k))
  if (!rule.checks?.length || bad.length > 0) {
    report(false, `${id}: checks must be a non-empty list of ${KINDS.join(', ')}`)
    continue
  }

  if (rule.checks.includes('lint')) {
    const n = svBlocks(text).length
    report(n > 0, `${id} lint: ${n} annotated systemverilog example(s)`)
  }

  if (rule.checks.includes('width')) {
    const cited = [...new Set([...text.matchAll(/\[([^\]]*`[us]_\w+`[^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/`(\w+)`/g)].map((n) => n[1])))]
    const missing = cited.filter((n) => !new RegExp(`\\b${n}\\b`).test(widthSrc))
    report(cited.length > 0 && missing.length === 0,
      `${id} width: cites ${cited.length} example output(s)${missing.length ? `, missing from width_examples.sv: ${missing.join(', ')}` : ''}`)
  }

  if (rule.checks.includes('sim')) {
    for (const f of rule.lintClean ?? []) {
      const l = lint([join(ROOT, f)])
      report(l.errors.length === 0 && l.warnings.length === 0, `${id} sim: ${f} lints clean${l.warnings.length ? ` (got ${l.warnings.join(', ')})` : ''}`)
    }
    for (const s of rule.sim ?? []) {
      let ok = false
      let msg = ''
      try {
        const out = simulate(s.files.map((f) => join(ROOT, f)), s.top)
        ok = /^PASS\b/m.test(out) && !/^FAIL\b/m.test(out)
        msg = out.split('\n').find((l) => /^(PASS|FAIL)\b/.test(l)) ?? 'no PASS line'
      } catch (e) {
        msg = e.message.split('\n').slice(0, 3).join(' ')
      }
      report(ok, `${id} sim: ${s.top}: ${msg}`)
    }
  }

  if (rule.checks.includes('review')) {
    report(typeof rule.reason === 'string' && rule.reason.length > 0, `${id} review: ${rule.reason ?? 'no reason given'}`)
  }

  for (const [label, file] of Object.entries(rule.docVerbatim ?? {})) {
    const path = join(ROOT, file)
    const block = svBlocks(text).find((b) => new RegExp(`^// ${label.replace(/'/g, "'")}(\\b|:|$)`).test(b.split('\n')[0]) &&
      !(label === 'Do' && /^\/\/ Don't/.test(b)))
    if (!block) report(false, `${id}: no "${label}" example in the doc`)
    else if (!existsSync(path)) report(false, `${id}: ${file} doesn't exist`)
    else report(normalize(readFileSync(path, 'utf8')).includes(normalize(block)), `${id}: doc's "${label}" example matches ${file}`)
  }

  for (const f of [...(rule.lintClean ?? []), ...(rule.sim ?? []).flatMap((s) => s.files)]) {
    if (!existsSync(join(ROOT, f))) report(false, `${id}: ${f} doesn't exist`)
  }
}

const live = Object.keys(sections).filter((id) => rules[id]?.movedTo === undefined)
const covered = live.filter((id) => rules[id])
console.log(`\n${passed} passed, ${failed} failed; ${covered.length}/${live.length} rules covered, ${Object.keys(sections).length - live.length} moved (Verilator ${pin})`)
process.exit(failed > 0 ? 1 : 0)

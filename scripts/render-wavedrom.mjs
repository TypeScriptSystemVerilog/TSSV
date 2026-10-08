#!/usr/bin/env node
// Render the WaveDrom timing diagrams embedded in markdown docs to SVG
// (`npm run render:wavedrom`), or check that the committed SVGs are current
// (`npm run check:wavedrom`). GitHub doesn't render WaveDrom, so docs keep the
// diagram source in an HTML comment and link the rendered SVG beside it:
//
//   <!-- wavedrom SFIFO-timing-dual-port.svg
//   { "signal": [ ... ] }
//   -->
//   ![SFIFO timing: dual-port](SFIFO-timing-dual-port.svg)
//
// The SVG path is relative to the markdown file. The JSON must not contain
// "--", which would end the comment.
//
// Usage: node scripts/render-wavedrom.mjs [--check] [file.md ...]
// With no files, every .md under doc/ is scanned. With --check nothing is
// written; exits 1 if any SVG is missing, stale, or not linked from its doc.

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import wavedrom from 'wavedrom'

const args = process.argv.slice(2)
const check = args.includes('--check')
const files = args.filter(a => a !== '--check')
if (files.length === 0) {
  files.push(...readdirSync('doc', { recursive: true })
    .filter(f => f.endsWith('.md'))
    .map(f => join('doc', f))
    .sort())
}

function render (source) {
  // renderAny mutates the skins, so give each diagram a fresh copy
  const tree = wavedrom.renderAny(0, source, structuredClone(wavedrom.waveSkin))
  // Opaque background: the default skin draws black on transparent, which is
  // unreadable in GitHub's dark mode
  tree.splice(2, 0, ['rect', { width: '100%', height: '100%', fill: 'white' }])
  return wavedrom.onml.stringify(tree) + '\n'
}

const COMMENT = /<!-- wavedrom (\S+\.svg)\n([\s\S]*?)\n-->/g
let diagrams = 0
let stale = false
const failures = []

for (const md of files) {
  const text = readFileSync(md, 'utf8')
  for (const m of text.matchAll(COMMENT)) {
    const [, svg, json] = m
    const line = text.slice(0, m.index).split('\n').length
    const where = `${md}:${line} (${svg})`
    diagrams++

    let source
    try {
      source = JSON.parse(json)
    } catch (e) {
      failures.push(`${where}: invalid JSON: ${e.message}`)
      continue
    }
    if (!text.includes(`](${svg})`)) failures.push(`${where}: SVG is not linked from the doc`)

    const out = join(dirname(md), svg)
    const rendered = render(source)
    if (check) {
      const state = !existsSync(out) ? 'missing' : readFileSync(out, 'utf8') !== rendered ? 'stale' : ''
      if (state !== '') {
        failures.push(`${where}: ${out} is ${state}`)
        stale = true
      }
    } else {
      writeFileSync(out, rendered)
      console.log(`wrote ${out}`)
    }
  }
}

for (const f of failures) console.error(`FAIL: ${f}`)
if (failures.length > 0) {
  if (stale) console.error('Run `npm run render:wavedrom` to regenerate.')
  process.exit(1)
}
console.log(`${diagrams} diagram(s) ${check ? 'up to date' : 'rendered'}`)

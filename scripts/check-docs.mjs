#!/usr/bin/env node
// Checks that the doc layout stays as AGENTS.md describes it (`npm run check:docs`):
//
//   1. modules:     every ts/src/modules/<M>/ has doc/modules/<M>/<M>-spec.md, and every
//                   doc/modules/<M>/ has a matching source module
//   2. see:         each module class (a class that extends Module in ts/src/modules/<M>/)
//                   has an `@see doc/modules/<M>/<M>-spec.md` line, and that file exists
//   3. no-ts-md:    no .md files under ts/
//   4. reachable:   every .md under doc/ is reachable from AGENTS.md's Key Documents table,
//                   listed there directly (a `<Name>` placeholder matches one path segment)
//                   or through the relative links of a doc that is
//   5. links:       every relative link in the repo's markdown resolves to a file or folder
//                   (skips node_modules/, third-party/ and doc/reference/, whose links
//                   TypeDoc validates)
//
// Run from the repo root. Prints `<file>: [<check>] <problem>` for each failure, then a
// summary, and exits 0 only if every check passes. Files are the ones git tracks plus any
// untracked ones it doesn't ignore, so a new file is checked before it's committed.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\0')
  .filter((f) => f !== '' && existsSync(f))
const SKIP_DIRS = ['node_modules/', 'third-party/']
const mdFiles = files.filter((f) => f.endsWith('.md') && !SKIP_DIRS.some((d) => f.startsWith(d) || f.includes(`/${d}`)))

const isDir = (p) => existsSync(p) && statSync(p).isDirectory()
const subdirs = (dir) => [...new Set(files.filter((f) => f.startsWith(`${dir}/`)).map((f) => f.slice(dir.length + 1).split('/')).filter((parts) => parts.length > 1).map((parts) => parts[0]))].sort()

// Markdown text with fenced code blocks and inline code blanked out (keeping line numbers),
// so a link-shaped string inside code isn't read as a link.
function proseOf (text) {
  const lines = text.split('\n')
  let fence = null
  return lines.map((line) => {
    const m = line.match(/^\s*(`{3,}|~{3,})/)
    if (fence !== null) {
      if (m !== null && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null
      return ''
    }
    if (m !== null) { fence = m[1]; return '' }
    return line.replace(/(`+)(?:(?!\1).)+?\1/g, '')
  }).join('\n')
}

// The relative link targets in a markdown file: [text](target), ![alt](target) and
// reference definitions `[id]: target`. Returns { target, line } with any #fragment removed.
function relativeLinks (file) {
  const prose = proseOf(readFileSync(file, 'utf8'))
  const out = []
  prose.split('\n').forEach((line, i) => {
    const targets = []
    for (const m of line.matchAll(/\]\(\s*(<[^>]*>|[^)\s]+)(?:\s+"[^"]*")?\s*\)/g)) targets.push(m[1])
    const def = line.match(/^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/)
    if (def !== null) targets.push(def[1])
    for (let t of targets) {
      // A template's placeholder, such as `[module spec](<path>)` or `(<Module>-spec.md)`, isn't a link.
      if (/^<[\w -]+>$/.test(t) || /.<[A-Za-z][\w -]*>/.test(t)) continue
      t = t.replace(/^<|>$/g, '')
      if (/^[a-z][a-z0-9+.-]*:/i.test(t) || t.startsWith('#') || t.startsWith('//')) continue
      t = t.split('#')[0].split('?')[0]
      if (t === '') continue
      try { t = decodeURIComponent(t) } catch {}
      out.push({ target: t, line: i + 1 })
    }
  })
  return out
}

// Where a link in `file` points, as a repo-relative path. A leading / is the repo root, as
// GitHub renders it.
const resolveLink = (file, target) => target.startsWith('/')
  ? path.posix.normalize(target.slice(1))
  : path.posix.normalize(path.posix.join(path.posix.dirname(file), target))

// ---- the checks; each returns a list of [file, problem] ----

function checkModules () {
  const failures = []
  const src = subdirs('ts/src/modules')
  const docs = subdirs('doc/modules')
  for (const m of src) {
    const spec = `doc/modules/${m}/${m}-spec.md`
    if (!existsSync(spec)) failures.push([`ts/src/modules/${m}/`, `no spec: expected ${spec}`])
  }
  for (const m of docs) {
    if (!src.includes(m)) failures.push([`doc/modules/${m}/`, `no source module: expected ts/src/modules/${m}/`])
  }
  return failures
}

function checkSee () {
  const failures = []
  for (const m of subdirs('ts/src/modules')) {
    const spec = `doc/modules/${m}/${m}-spec.md`
    const tsFiles = files.filter((f) => f.startsWith(`ts/src/modules/${m}/`) && f.endsWith('.ts'))
    let classes = 0
    for (const f of tsFiles) {
      const text = readFileSync(f, 'utf8')
      for (const c of text.matchAll(/^export\s+(?:default\s+)?(?:abstract\s+)?class\s+(\w+)[^{\n]*\bextends\s+(?:\w+\.)?Module\b/gm)) {
        classes++
        const line = text.slice(0, c.index).split('\n').length
        // The JSDoc block that ends right before the class (blank lines and decorators allowed).
        const before = text.slice(0, c.index)
        const doc = before.match(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*$/)
        const sees = doc === null ? [] : [...doc[1].matchAll(/@see\s+(\S+)/g)].map((s) => s[1])
        if (sees.length === 0) {
          failures.push([`${f}:${line}`, `class ${c[1]} has no @see line; expected @see ${spec}`])
        } else if (!sees.includes(spec)) {
          failures.push([`${f}:${line}`, `class ${c[1]}'s @see is ${sees.join(', ')}; expected ${spec}`])
        } else if (!existsSync(spec)) {
          failures.push([`${f}:${line}`, `class ${c[1]}'s @see ${spec} doesn't exist`])
        }
      }
    }
    if (classes === 0) failures.push([`ts/src/modules/${m}/`, 'no class that extends Module'])
  }
  return failures
}

function checkNoTsMd () {
  return files.filter((f) => f.startsWith('ts/') && f.endsWith('.md'))
    .map((f) => [f, '.md file under ts/; docs live under doc/'])
}

function checkReachable () {
  const failures = []
  const agents = readFileSync('AGENTS.md', 'utf8').split('\n')
  const start = agents.findIndex((l) => /^##\s+Key Documents\s*$/.test(l))
  if (start < 0) return [['AGENTS.md', 'no "## Key Documents" section']]
  const seeds = []
  for (let i = start + 1; i < agents.length && !/^##\s/.test(agents[i]); i++) {
    const row = agents[i].match(/^\|([^|]*)\|/)
    if (row === null) continue
    for (const m of row[1].matchAll(/`([^`]+)`/g)) seeds.push({ entry: m[1], line: i + 1 })
  }
  if (seeds.length === 0) return [['AGENTS.md', 'Key Documents table lists no documents']]

  const reached = new Set()
  const queue = []
  const visit = (p) => {
    if (isDir(p)) p = path.posix.join(p, 'README.md')
    if (!p.endsWith('.md') || reached.has(p) || !existsSync(p)) return
    reached.add(p)
    queue.push(p)
  }
  for (const { entry, line } of seeds) {
    if (entry.includes('<')) {
      const re = new RegExp('^' + entry.split(/<[^>]+>/).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]+') + '$')
      const matches = mdFiles.filter((f) => re.test(f))
      if (matches.length === 0) failures.push([`AGENTS.md:${line}`, `Key Documents entry \`${entry}\` matches no file`])
      matches.forEach(visit)
    } else if (!existsSync(entry)) {
      failures.push([`AGENTS.md:${line}`, `Key Documents lists \`${entry}\`, which doesn't exist`])
    } else {
      visit(entry)
    }
  }
  while (queue.length > 0) {
    const f = queue.shift()
    for (const { target } of relativeLinks(f)) visit(resolveLink(f, target))
  }
  for (const f of mdFiles.filter((f) => f.startsWith('doc/'))) {
    if (!reached.has(f)) failures.push([f, 'not reachable from AGENTS.md\'s Key Documents table, directly or through a doc it lists'])
  }
  return failures
}

function checkLinks () {
  const failures = []
  for (const f of mdFiles.filter((f) => !f.startsWith('doc/reference/'))) {
    for (const { target, line } of relativeLinks(f)) {
      const p = resolveLink(f, target)
      if (p.startsWith('../') || !existsSync(p)) failures.push([`${f}:${line}`, `link to ${target} doesn't resolve`])
    }
  }
  return failures
}

const CHECKS = [
  ['modules', 'Every source module has a spec, and every spec folder a source module', checkModules],
  ['see', 'Each module class\'s @see points to its spec, which exists', checkSee],
  ['no-ts-md', 'No .md files under ts/', checkNoTsMd],
  ['reachable', 'Every doc under doc/ is reachable from AGENTS.md\'s Key Documents', checkReachable],
  ['links', 'Every relative link in the repo\'s markdown resolves', checkLinks]
]

const summary = []
for (const [id, title, check] of CHECKS) {
  console.log(`\n=== ${title} [${id}]`)
  const failures = check()
  for (const [file, problem] of failures) console.log(`${file}: [${id}] ${problem}`)
  if (failures.length === 0) console.log('ok')
  summary.push([failures.length === 0 ? 'PASS' : `FAIL (${failures.length})`, `${title} [${id}]`])
}

console.log('\n=== Summary')
for (const [status, title] of summary) console.log(`${status}: ${title}`)
process.exit(summary.every(([s]) => s === 'PASS') ? 0 : 1)

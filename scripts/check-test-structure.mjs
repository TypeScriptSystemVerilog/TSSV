#!/usr/bin/env node
// Checks the testbench tiers' import rule (doc/framework/testbench.md): a tier may depend only on
// the tiers below it, and must not name anything above it.
//
//   tier 1, TSSV's ts/src/tb/                  TSSV's core (tssv/lib/core/), Node built-ins and
//           (tssv/lib/tb/...)                  its own files
//   tier 2, a project's ts/test/vip/<protocol>/ the above, TSSV's interfaces
//                                              (tssv/lib/interfaces/), and the project's
//                                              ts/test/vip/, ts/src/interfaces/ and ts/src/tools/
//
// So neither tier can import a DUT, TSSV's (tssv/lib/modules/) or the project's (ts/src/modules/),
// nor a per-DUT test directory. Tier 3, a project's ts/test/<DUT>/, may import anything.
//
// The exception is BUILDING_BLOCKS: TSSV design modules that are building blocks, not DUTs, such as
// LFSR. Both tiers may import them (tssv/lib/modules/<block>), and tier 1 may reach them by a
// relative import (ts/src/modules/<block>/).
//
// Tier 1 is always checked: the ts/src/tb/ of the TSSV this script is in, or with --tier1 <root>,
// of that directory instead, which is how test_checkTestStructure.ts checks the script on fixtures.
// Given a project's root, the script also checks that project's tier 2; a project with no
// ts/test/vip/ has none to check.
//
// Given a project's root, it also checks that no TS-side test reads a file (doc/framework/
// testbench.md, "What TS-side tests may check"): no .ts file under the project's ts/test/ uses an
// fs function that reads a file's content. TSSV returns a module's SV only as files, so a test that
// reads no file cannot read the SV. A read of something else, such as a spec, is allowed when its
// line, or the line above it, says what it reads:
//
//   // test-structure: reads <what>, not generated SV
//
// TSSV's own ts/test/ is not checked: its tests that read emitted SV predate the rule.
//
// Usage: node scripts/check-test-structure.mjs                                     (in TSSV)
//        node node_modules/tssv/scripts/check-test-structure.mjs <project root>    (in a project)
//        node scripts/check-test-structure.mjs --tier1 <root> [<project root>]     (on fixtures)
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { isBuiltin } from 'node:module'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
// --tier1 <root>: check that directory's ts/src/tb/ as tier 1, in place of this TSSV's
const tier1At = args.indexOf('--tier1')
const tier1Root = tier1At < 0 ? undefined : args.splice(tier1At, 2)[1]
if (args.length > 1 || (tier1At >= 0 && tier1Root === undefined)) {
  console.error('usage: node scripts/check-test-structure.mjs [--tier1 <root>] [<project root>]')
  process.exit(2)
}
const TSSV_ROOT = tier1Root === undefined ? resolve(dirname(fileURLToPath(import.meta.url)), '..') : resolve(tier1Root)

// TSSV design modules that are building blocks, not DUTs: a testbench component of tier 1 or 2 may
// use them. A module joins only when a generic testbench component needs it, and it must not depend
// on anything a tier may not import.
const BUILDING_BLOCKS = ['LFSR']
const blockSpecs = BUILDING_BLOCKS.flatMap(b => [`tssv/lib/modules/${b}`, `tssv/lib/modules/${b}/`])

// Each tier: the directory it is (under `root`), and what it may import. `tssv` lists the TSSV
// specifiers it may name, `local` the files under `root` it may reach by a relative import. An entry
// that ends in / allows everything under it; any other allows exactly that specifier.
const TIERS = [
  {
    name: 'tier 1',
    root: TSSV_ROOT,
    dir: 'ts/src/tb',
    tssv: ['tssv/lib/core/', 'tssv/lib/tb/', ...blockSpecs],
    local: ['ts/src/tb/', 'ts/src/core/', ...BUILDING_BLOCKS.map(b => `ts/src/modules/${b}/`)]
  },
  ...args.map(root => ({
    name: 'tier 2',
    root: resolve(root),
    dir: 'ts/test/vip',
    tssv: ['tssv/lib/core/', 'tssv/lib/tb/', 'tssv/lib/interfaces/', ...blockSpecs],
    local: ['ts/test/vip/', 'ts/src/interfaces/', 'ts/src/tools/']
  }))
]

// Whether `target` is one of `allowed`: under an entry that ends in /, or equal to any other
const isAllowed = (allowed, target) => allowed.some(a => a.endsWith('/') ? target.startsWith(a) : target === a)

// Every .ts file under `dir`, relative to `root`
function tsFiles (root, dir) {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? tsFiles(root, join(dir, e.name)) : e.name.endsWith('.ts') ? [join(dir, e.name)] : [])
}

// The module specifiers the file at `path` imports or re-exports from
function imports (path) {
  const text = readFileSync(path, 'utf8')
  // An import statement at the start of a line, `import <anything> from '<spec>'` (over several
  // lines if need be) or `import '<spec>'`, capturing <spec>
  const imported = [...text.matchAll(/^\s*import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/gm)]
  // A re-export, `export * from '<spec>'` or `export { ... } from '<spec>'`, capturing <spec>
  const reexported = [...text.matchAll(/^\s*export\s+(?:type\s+)?(?:\*|\{[^}]*\})(?:\s+as\s+\w+)?\s+from\s+['"]([^'"]+)['"]/gm)]
  return [...imported, ...reexported].map(m => m[1])
}

// ---- No TS-side test reads a file

// The fs functions that read a file's content, from 'fs' or 'node:fs', and from their promises API
// ('fs/promises', or fs's `promises` export)
const FS_READS = ['readFileSync', 'readFile', 'createReadStream', 'readSync', 'read']
const PROMISE_READS = ['readFile']

// A comment saying what a read reads: `// test-structure: reads <what>, not generated SV`
const WAIVER = /\/\/\s*test-structure:\s*reads\s+\S.*,\s*not generated SV/

// The text of `text` with its comments blanked, newlines kept, so that line numbers still match
function stripComments (text) {
  // A block comment, /* ... */ over any number of lines
  const noBlocks = text.replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ' '))
  // A line comment, from // to the end of its line
  return noBlocks.replace(/\/\/[^\n]*/g, c => ' '.repeat(c.length))
}

// Escapes `s` for use inside a RegExp
const reEscape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * What the file's code imports from fs that can read a file: `direct`, local names bound to a read
 * function, and `spaces`, local names of a namespace or default import with the read functions
 * reached through it
 */
function fsBindings (code) {
  const direct = []
  const spaces = []
  // A static import from fs, 'node:fs', 'fs/promises' or 'node:fs/promises', over several lines if
  // need be: group 1 is the import clause, group 2 is '/promises' when it is the promises API
  for (const m of code.matchAll(/^\s*import\s+(?!type\s)([^'";]*?)\s+from\s+['"](?:node:)?fs(\/promises)?['"]/gm)) {
    const clause = m[1]
    const reads = m[2] === undefined ? FS_READS : PROMISE_READS
    // The named imports, between braces
    const named = /\{([^}]*)\}/.exec(clause)
    for (const spec of named === null ? [] : named[1].split(',')) {
      // One named import, `name` or `name as alias`, not a type: group 1 the name, group 2 the alias
      const n = /^\s*(?!type\s)(\w+)(?:\s+as\s+(\w+))?\s*$/.exec(spec)
      if (n === null) continue
      const local = n[2] ?? n[1]
      if (reads.includes(n[1])) direct.push({ local, name: n[1] })
      // fs's promises API, imported by name
      if (m[2] === undefined && n[1] === 'promises') spaces.push({ local, reads: PROMISE_READS })
    }
    // A namespace import, `* as name`: group 1 the name
    const ns = /\*\s*as\s+(\w+)/.exec(clause)
    // A default import, the name the clause starts with (before any comma or brace): group 1
    const def = /^\s*(\w+)\s*(?:,|$)/.exec(clause)
    for (const local of [ns?.[1], def?.[1]]) {
      if (local === undefined) continue
      spaces.push({ local, reads })
      if (m[2] === undefined) spaces.push({ local: `${local}.promises`, reads: PROMISE_READS })
    }
  }
  return { direct, spaces }
}

/** Each read in the file at `path`, unwaived: its 1-based line number and what it uses */
function reads (path) {
  const text = readFileSync(path, 'utf8')
  const lines = text.split('\n')
  const code = stripComments(text).split('\n')
  const { direct, spaces } = fsBindings(code.join('\n'))
  const patterns = [
    // A use of a read function imported by name, anywhere but its import
    ...direct.map(d => ({ re: new RegExp(`(?<![\\w.])${reEscape(d.local)}\\b`), what: d.name })),
    // A read function reached through a namespace or default import, `fs.readFileSync`
    ...spaces.map(s => ({ re: new RegExp(`(?<![\\w.])${reEscape(s.local)}\\.(${s.reads.join('|')})\\b`), what: null })),
    // fs loaded at run time, with require('fs') or import('node:fs/promises'), where this check
    // cannot see which functions it uses
    { re: /\b(?:require|import)\s*\(\s*['"](?:node:)?fs(?:\/promises)?['"]\s*\)/, what: 'fs loaded at run time' }
  ]
  // The code with its import statements blanked, since an import is not a use. A static import,
  // `import <clause> from '<spec>'` over several lines if need be, or `import '<spec>'`
  const uses = code.join('\n').replace(/^\s*import\s+(?:[^'";]*?\sfrom\s+)?['"][^'"]+['"]/gm, s => s.replace(/[^\n]/g, ' '))
  const found = []
  uses.split('\n').forEach((line, i) => {
    for (const p of patterns) {
      const m = p.re.exec(line)
      if (m === null) continue
      if (WAIVER.test(lines[i]) || (i > 0 && WAIVER.test(lines[i - 1]))) break
      found.push({ line: i + 1, what: p.what ?? m[1] })
      break
    }
  })
  return found
}

let violations = 0
const checked = []
for (const tier of TIERS) {
  // The repo, by its folder's name; TSSV's may be a worktree's
  const where = tier.root === TSSV_ROOT ? 'TSSV' : basename(tier.root)
  if (!existsSync(join(tier.root, tier.dir))) {
    if (tier.root === TSSV_ROOT) throw Error(`${join(tier.root, tier.dir)} is missing`)
    console.log(`${where}: no ${tier.dir}/, so no ${tier.name} to check`)
    continue
  }
  checked.push(`${where}'s ${tier.dir}/ (${tier.name})`)
  for (const file of tsFiles(tier.root, tier.dir)) {
    for (const spec of imports(join(tier.root, file))) {
      if (isBuiltin(spec)) continue
      // A relative import, as the .ts file it names, relative to the tier's root
      const target = spec.startsWith('.') ? relative(tier.root, resolve(tier.root, dirname(file), spec)).replace(/\.js$/, '.ts') : spec
      const allowed = spec.startsWith('.') ? tier.local : tier.tssv
      if (isAllowed(allowed, target)) continue
      console.error(`FAIL: ${where}: ${file} (${tier.name}) imports ${target}; ${tier.name} may import only Node, ` +
        `${tier.tssv.filter(a => a.endsWith('/')).join(', ')}, the building blocks (${BUILDING_BLOCKS.join(', ')}) ` +
        `and its repo's ${tier.local.join(', ')}`)
      violations++
    }
  }
}
if (violations === 0) console.log(`PASS: ${checked.join(' and ')} import only the tiers below them`)

// Each project's TS-side tests read no file but those they name
let readViolations = 0
for (const root of args.map(r => resolve(r))) {
  const where = basename(root)
  if (!existsSync(join(root, 'ts/test'))) {
    console.log(`${where}: no ts/test/, so no TS-side tests to check`)
    continue
  }
  let waived = 0
  const before = readViolations
  for (const file of tsFiles(root, 'ts/test')) {
    const text = readFileSync(join(root, file), 'utf8')
    waived += text.split('\n').filter(l => WAIVER.test(l)).length
    for (const r of reads(join(root, file))) {
      console.error(`FAIL: ${where}: ${file}:${r.line} (TS-side test) reads a file, with ${r.what}`)
      readViolations++
    }
  }
  if (readViolations === before) {
    console.log(`PASS: ${where}'s ts/test/ reads no files${waived > 0 ? `, but for ${waived} it names as not generated SV` : ''}`)
  }
}
if (readViolations > 0) {
  console.error('A TS-side test never reads the generated SV (TSSV\'s doc/framework/testbench.md, "What TS-side tests ' +
    'may check"). A read of anything else says what it reads, on its line or the line above:\n' +
    '  // test-structure: reads <what>, not generated SV')
}
if (violations + readViolations > 0) process.exit(1)

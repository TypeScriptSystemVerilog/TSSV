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
if (violations > 0) process.exit(1)
console.log(`PASS: ${checked.join(' and ')} import only the tiers below them`)

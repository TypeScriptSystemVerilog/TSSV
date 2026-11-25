#!/usr/bin/env node
// Checks the generated DUT RTL that an rtl branch would commit, in an sv-examples/ worktree on that
// branch (doc/process/issue-workflow.md §5, "The RTL PR"). What `git add -A` would commit there is
// what the checks look at, so they run before the commit:
//
//   1. It is exactly the files under dut/ folders, plus the branch's .gitignore and .github/.
//      This catches a .gitignore that lets in, or leaves out, the wrong files.
//   2. Every `include in a committed .sv, .svh or .v file names a committed file, in the
//      including file's folder or at the top of its DUT folder.
//   3. Every DUT folder (<...>/dut/<cfg>/) declares a module.
//
// Usage: node scripts/check-rtl.mjs [<sv-examples dir>]   (default: sv-examples)
// Prints one line per check. Exits 1 if a check fails, 2 on an error.
//
// tssv-noc has a script of the same name; keep the two in step.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, posix } from 'node:path'

const dir = process.argv[2] ?? 'sv-examples'
const MAX_LISTED = 10

function git (...args) {
  return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 })
}

// A plain sv-examples/ folder is inside the outer repo, so its prefix isn't empty
try {
  if (git('rev-parse', '--show-prefix').trim() !== '') {
    throw new Error(`${dir} isn't a worktree on an rtl branch; see scripts/worktree rtl`)
  }
} catch (e) {
  console.error(`check-rtl: ${e.message.split('\n')[0]}`)
  process.exit(2)
}

const isDut = f => /(^|\/)dut\//.test(f)
const isBranchFile = f => f === '.gitignore' || f.startsWith('.github/')
// The DUT folder a file is in: everything up to and including the last dut/<cfg>
const dutFolder = f => /^((?:.*\/)?dut\/[^/]+)\//.exec(f)?.[1]

// What `git add -A` would commit: tracked files still on disk, and untracked files not ignored
const committed = new Set(
  git('ls-files', '-z', '--cached', '--others', '--exclude-standard')
    .split('\0').filter(f => f !== '' && existsSync(join(dir, f))))

// Every file on disk under a dut/ folder
const onDisk = []
function walk (rel) {
  for (const e of readdirSync(join(dir, rel), { withFileTypes: true })) {
    const p = rel === '' ? e.name : `${rel}/${e.name}`
    if (p === '.git') continue
    if (e.isDirectory()) walk(p)
    else if (isDut(p)) onDisk.push(p)
  }
}
walk('')

let failed = false
function report (ok, okText, problems, failText) {
  if (ok) {
    console.log(`check-rtl: ok: ${okText}`)
    return
  }
  failed = true
  console.log(`check-rtl: FAILED: ${failText}`)
  for (const p of problems.slice(0, MAX_LISTED)) console.log(`  ${p}`)
  if (problems.length > MAX_LISTED) console.log(`  ... and ${problems.length - MAX_LISTED} more`)
}

// 1. exactly the files under dut/ folders
const dutFiles = [...committed].filter(f => !isBranchFile(f))
const outside = dutFiles.filter(f => !isDut(f))
const left = onDisk.filter(f => !committed.has(f))
report(outside.length === 0 && left.length === 0,
  `${dutFiles.length} files under dut/ folders would be committed, and nothing else`,
  [...outside.map(f => `would be committed, but isn't under a dut/ folder: ${f}`),
    ...left.map(f => `under a dut/ folder, but the .gitignore leaves it out: ${f}`)],
  'what would be committed differs from the files under dut/ folders')

// 2. every `include resolves to a committed file
let includes = 0
const unresolved = []
for (const f of dutFiles) {
  if (!/\.(sv|svh|v)$/.test(f)) continue
  const folder = posix.dirname(f)
  const top = dutFolder(f)
  for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/^[ \t]*`include[ \t]+"([^"]+)"/gm)) {
    includes++
    const inc = m[1]
    if (!committed.has(posix.join(folder, inc)) && !(top !== undefined && committed.has(posix.join(top, inc)))) {
      unresolved.push(`${f} includes ${inc}, which isn't committed`)
    }
  }
}
report(unresolved.length === 0, `all ${includes} \`includes resolve to committed files`,
  unresolved, `${unresolved.length} \`includes name a file that isn't committed`)

// 3. every DUT folder declares a module
const folders = new Map()
for (const f of dutFiles) {
  const d = dutFolder(f)
  if (d === undefined) continue
  if (!folders.has(d)) folders.set(d, false)
  if (!folders.get(d) && /\.(sv|v)$/.test(f) && /^[ \t]*module[ \t]/m.test(readFileSync(join(dir, f), 'utf8'))) {
    folders.set(d, true)
  }
}
const empty = [...folders].filter(([, has]) => !has).map(([d]) => `${d}/ declares no module`)
report(empty.length === 0, `all ${folders.size} DUT folders declare a module`,
  empty, `${empty.length} DUT folders declare no module`)

process.exit(failed ? 1 : 0)

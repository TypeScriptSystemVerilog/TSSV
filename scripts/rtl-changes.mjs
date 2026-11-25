#!/usr/bin/env node
// The distinct changes between two trees of generated DUT RTL, as Markdown for an RTL PR's
// description (doc/process/issue-workflow.md §5, "The RTL PR"). A generator change usually
// repeats across many files, one per configuration that uses the changed class, so the list
// shows each kind of change once:
//
// - Changed files are grouped by generator class, read from the file header's Generator line,
//   then by the lines their diff removes and adds. Lines that differ only in numbers, such as a
//   width in a module name, count as the same change; the row says how many variants it holds.
// - A .contracts.json file goes with the class of the .sv file of the same name in its folder.
// - DUT folders added or deleted whole are listed by folder, and a folder moved unchanged as one
//   move. Other added and deleted files are grouped by class. There is no rename detection: across
//   configurations it would pair unrelated files that happen to look alike.
// - Each row names an example file, linked when --url is given.
//
// Usage: node scripts/rtl-changes.mjs [--dir <sv-examples>] [--url <blob URL prefix>]
//                                     [--max-chars <n>] <base> <head>
//   <base>, <head>  commits or trees of the rtl branch
//   --url           e.g. https://github.com/<owner>/<repo>/blob, to which /<commit>/<path> is added
//   --max-chars     the longest output, so a PR description stays under GitHub's limit
//                   (default 60000); rows past it are left out, and the output says how many
//
// Prints the Markdown to stdout and a one-line summary to stderr.
//
// tssv-noc has a script of the same name; keep the two in step.
import { execFileSync } from 'node:child_process'

const args = process.argv.slice(2)
let dir = 'sv-examples'
let url
let maxChars = 60000
const refs = []
while (args.length > 0) {
  const a = args.shift()
  if (a === '--dir') dir = args.shift()
  else if (a === '--url') url = args.shift()
  else if (a === '--max-chars') maxChars = Number(args.shift())
  else if (a === '-h' || a === '--help') {
    console.log('Usage: node scripts/rtl-changes.mjs [--dir <sv-examples>] [--url <prefix>] [--max-chars <n>] <base> <head>')
    process.exit(0)
  } else refs.push(a)
}
if (refs.length !== 2) {
  console.error('rtl-changes: give a base and a head')
  process.exit(2)
}

function git (...a) {
  return execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', maxBuffer: 1 << 30 })
}
const [base, head] = refs.map(r => git('rev-parse', '--verify', r).trim())
// A link names a commit; a tree has no URL
const linkable = r => git('cat-file', '-t', r).trim() === 'commit'

// --- what changed -------------------------------------------------------------

/** @type {{status: 'M' | 'A' | 'D', path: string, removed: string[], added: string[]}[]} */
const files = []
{
  const z = git('diff', '--name-status', '-z', '--no-renames', base, head).split('\0')
  z.pop()
  for (let i = 0; i < z.length; i += 2) {
    // T, a change of type, reads as a change
    files.push({ status: z[i] === 'A' || z[i] === 'D' ? z[i] : 'M', path: z[i + 1], removed: [], added: [] })
  }
}
const byPath = new Map(files.map(f => [f.path, f]))

// The removed and added lines of each changed file, from one diff
{
  let cur
  for (const line of git('diff', '-U0', '--no-color', '--no-ext-diff', '--no-renames', base, head).split('\n')) {
    if (line.startsWith('diff --git ')) cur = undefined
    else if (line.startsWith('+++ ')) cur = line === '+++ /dev/null' ? undefined : byPath.get(line.slice(6))
    else if (line.startsWith('--- ') || line.startsWith('@@')) continue
    else if (cur !== undefined && cur.status === 'M') {
      if (line.startsWith('-')) cur.removed.push(line.slice(1))
      else if (line.startsWith('+')) cur.added.push(line.slice(1))
    }
  }
}

// --- each file's generator class ---------------------------------------------------

// The first lines of many blobs at once, through one `git cat-file --batch`
function heads (specs) {
  const out = new Map()
  if (specs.length === 0) return out
  const buf = execFileSync('git', ['-C', dir, 'cat-file', '--batch'],
    { input: specs.join('\n') + '\n', maxBuffer: 1 << 30 })
  let pos = 0
  for (const spec of specs) {
    const nl = buf.indexOf(10, pos)
    const header = buf.toString('utf8', pos, nl)
    pos = nl + 1
    if (header.endsWith(' missing')) continue
    const size = Number(header.split(' ')[2])
    out.set(spec, buf.toString('utf8', pos, pos + Math.min(size, 2048)))
    pos += size + 1
  }
  return out
}

const GENERATOR = /^\/\/ Generator: ([^,\s]+)/m
const sideOf = f => f.status === 'D' ? base : head
const specs = []
for (const f of files) {
  specs.push(`${sideOf(f)}:${f.path}`)
  const json = /^(.*)\.contracts\.json$/.exec(f.path)
  if (json !== null) specs.push(`${sideOf(f)}:${json[1]}.sv`)
}
const firstLines = heads(specs)
function classOf (f) {
  const json = /^(.*)\.contracts\.json$/.exec(f.path)
  const text = firstLines.get(`${sideOf(f)}:${json === null ? f.path : `${json[1]}.sv`}`)
  const m = text === undefined ? null : GENERATOR.exec(text)
  if (m === null) return json === null ? '(no file header)' : '(port contracts)'
  return m[1]
}
for (const f of files) f.cls = classOf(f)

// --- Markdown ------------------------------------------------------------------

const html = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\|/g, '&#124;').replace(/^ +/, sp => '&nbsp;'.repeat(sp.length))
const MAX_LINES = 8
function lines (ls) {
  if (ls.length === 0) return 'none'
  const shown = ls.slice(0, MAX_LINES).map(l => `<code>${html(l) || '&nbsp;'}</code>`)
  if (ls.length > MAX_LINES) shown.push(`… and ${ls.length - MAX_LINES} more lines`)
  return shown.join('<br>')
}
function link (f) {
  const at = sideOf(f)
  const text = `<code>${html(f.path)}</code>`
  return url !== undefined && linkable(at) ? `<a href="${url}/${at}/${encodeURI(f.path)}">${text}</a>` : text
}
const example = fs => fs.reduce((a, b) => (b.path.length < a.path.length || (b.path.length === a.path.length && b.path < a.path)) ? b : a)
const plural = (n, one, many = `${one}s`) => `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`

// Files of DUT folders that were added or deleted whole
const dutFolder = p => /^((?:.*\/)?dut\/[^/]+)\//.exec(p)?.[1]
function wholeFolders (status, ref) {
  const touched = new Map()
  for (const f of files.filter(x => x.status === status)) {
    const d = dutFolder(f.path)
    if (d !== undefined) touched.set(d, (touched.get(d) ?? 0) + 1)
  }
  const whole = new Map()
  for (const [d, n] of touched) {
    // whole if the other side has nothing in that folder
    const other = ref === base ? head : base
    if (git('ls-tree', '-r', '--name-only', other, '--', `${d}/`).trim() === '') whole.set(d, n)
  }
  return whole
}
const newFolders = wholeFolders('A', head)
const goneFolders = wholeFolders('D', base)
const inWhole = f => (f.status === 'A' && newFolders.has(dutFolder(f.path))) ||
  (f.status === 'D' && goneFolders.has(dutFolder(f.path)))


// A folder deleted whole and one added whole with the same tree moved unchanged
const treeOf = (ref, d) => git('rev-parse', `${ref}:${d}`).trim()
const moved = []
for (const [gone] of goneFolders) {
  const t = treeOf(base, gone)
  const to = [...newFolders.keys()].find(d => treeOf(head, d) === t)
  if (to === undefined) continue
  moved.push([gone, to, goneFolders.get(gone)])
  goneFolders.delete(gone)
  newFolders.delete(to)
}
const inMoved = f => moved.some(([gone, to]) => dutFolder(f.path) === (f.status === 'D' ? gone : to))

const counts = { M: 0, A: 0, D: 0 }
for (const f of files) counts[f.status]++

// Changed files, by class, then by the change, numbers masked
const changed = files.filter(f => f.status === 'M')
const mask = ls => ls.map(l => l.replace(/\d+/g, '#'))
const groups = new Map()
for (const f of changed) {
  const key = JSON.stringify([f.cls, mask(f.removed), mask(f.added)])
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(f)
}
const classTotal = new Map()
for (const f of changed) classTotal.set(f.cls, (classTotal.get(f.cls) ?? 0) + 1)
const rows = [...groups.values()].sort((a, b) =>
  (classTotal.get(b[0].cls) - classTotal.get(a[0].cls)) || a[0].cls.localeCompare(b[0].cls) || (b.length - a.length))
const rowText = fs => {
  const ex = example(fs)
  const variants = new Set(fs.map(f => JSON.stringify([f.removed, f.added]))).size
  const n = variants > 1 ? `${fs.length} (${variants} variants, differing in numbers)` : `${fs.length}`
  return `| \`${fs[0].cls}\` | ${n} | ${lines(ex.removed)} | ${lines(ex.added)} | ${link(ex)} |`
}

const summary = [`${plural(files.length, 'file')} differ`]
if (counts.M > 0) summary.push(`${counts.M.toLocaleString('en-US')} changed`)
if (counts.A > 0) summary.push(`${counts.A.toLocaleString('en-US')} added`)
if (counts.D > 0) summary.push(`${counts.D.toLocaleString('en-US')} deleted`)
const shortstat = git('diff', '--shortstat', '--no-renames', base, head).trim()

const out = []
let left = 0
const budget = () => maxChars - out.join('\n').length - 400
function table (title, intro, head1, rowsText) {
  if (rowsText.length === 0) return
  out.push(`### ${title}`, '', ...(intro ? [intro, ''] : []), head1, head1.replace(/[^|]+/g, '---'))
  for (const r of rowsText) {
    if (r.length > budget()) { left++; continue }
    out.push(r)
  }
  out.push('')
}

out.push(files.length === 0
  ? 'No file differs.'
  : `${summary[0]}: ${summary.slice(1).join(', ')} (${shortstat.replace(/^[^,]*, /, '')}).`, '')

table('Changed files',
  `${plural(changed.length, 'file')} in ${plural(rows.length, 'kind')} of change, grouped by the class that generated them. ` +
  'Each row shows one example file\'s removed and added lines.',
  '| Class | Files | Removed | Added | For example |', rows.map(rowText))

const folderRows = (m, word) => [...m].sort((a, b) => a[0].localeCompare(b[0]))
  .map(([d, n]) => `| <code>${html(d)}/</code> | ${n} | ${word} |`)
table('DUT folders added, deleted or moved whole', '', '| Folder | Files | |',
  [...folderRows(newFolders, 'added'), ...folderRows(goneFolders, 'deleted'),
    ...moved.map(([gone, to, n]) => `| <code>${html(gone)}/</code> → <code>${html(to)}/</code> | ${n} | moved unchanged |`)])

const byClass = (fs, render) => {
  const m = new Map()
  for (const f of fs) {
    if (!m.has(f.cls)) m.set(f.cls, [])
    m.get(f.cls).push(f)
  }
  return [...m].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).map(([c, g]) => render(c, g))
}
const addedOrDeleted = files.filter(f => f.status !== 'M' && !inWhole(f) && !inMoved(f))
table('Files added or deleted in other folders', '', '| Class | Added | Deleted | For example |',
  byClass(addedOrDeleted, (c, g) => {
    const a = g.filter(f => f.status === 'A').length
    return `| \`${c}\` | ${a} | ${g.length - a} | ${link(example(g))} |`
  }))

if (left > 0) {
  out.push(`**${plural(left, 'row')} left out** to keep this description under GitHub's limit. ` +
    `\`node scripts/rtl-changes.mjs ${base.slice(0, 7)} ${head.slice(0, 7)}\` in \`sv-examples/\`'s repo lists them all.`, '')
}
process.stdout.write(out.join('\n'))
console.error(`rtl-changes: ${summary.join(', ')}; ${plural(rows.length, 'kind')} of change${left > 0 ? `; ${left} rows left out` : ''}`)

/**
 * Checks scripts/check-test-structure.mjs (doc/framework/testbench.md, "Three tiers") on fixture
 * trees, so that each way it can pass or fail is shown, not only that TSSV passes it:
 *
 *   - tier 1 and tier 2 may import a building block, LFSR, as tssv/lib/modules/LFSR, and tier 1 may
 *     also reach it by a relative import;
 *   - each still fails on a file that imports another TSSV module, SFIFO, either way;
 *   - a tier-2 file may not import a project's own module either;
 *   - a project's TS-side test, anywhere under its ts/test/, fails when it reads a file, by each
 *     way fs can be imported or loaded, unless its line or the line above says what it reads; one
 *     that reads nothing, or names a read only in a comment, passes.
 *
 * Each fixture is a directory with a tier-1 ts/src/tb/ (passed with --tier1) and, for tier 2 and
 * the TS-side tests, a project with a ts/test/vip/ or a test under ts/test/.
 */
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { after, test } from 'node:test'
import assert from 'node:assert/strict'

const SCRIPT = join(TSSV_ROOT, 'scripts/check-test-structure.mjs')
const FIXTURES = mkdtempSync(join(tmpdir(), 'check-test-structure-'))
after(() => { rmSync(FIXTURES, { recursive: true, force: true }) })

let made = 0

/** A fixture tree: each file's path under a new directory, and its contents; returns the directory */
function tree (files: Record<string, string>): string {
  const root = join(FIXTURES, `t${made++}`)
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), text)
  }
  return root
}

/** A tier 1 whose one file imports `spec` */
const tier1 = (spec: string): string => tree({ 'ts/src/tb/Component.ts': `import { X } from '${spec}'\nexport const y = X\n` })

/** A project whose one tier-2 file imports `spec` */
const project = (spec: string): string => tree({ 'ts/test/vip/proto/Agent.ts': `import { X } from '${spec}'\nexport const y = X\n` })

/** The script's exit code and output, on tier 1 at `t1`, and the project at `prj` if given */
function run (t1: string, prj?: string): { status: number | null, out: string } {
  const r = spawnSync(process.execPath, [SCRIPT, '--tier1', t1, ...(prj === undefined ? [] : [prj])], { encoding: 'utf8' })
  return { status: r.status, out: r.stdout + r.stderr }
}

const CLEAN = tier1('tssv/lib/core/TSSV')

void test('tier 1 may import LFSR, a building block, by its package path or relatively', () => {
  for (const spec of ['tssv/lib/modules/LFSR', 'tssv/lib/modules/LFSR/model', '../modules/LFSR/LFSR.js']) {
    const r = run(tier1(spec))
    assert.equal(r.status, 0, `${spec}: ${r.out}`)
    assert.ok(r.out.includes("PASS: TSSV's ts/src/tb/ (tier 1) import only the tiers below them"), r.out)
  }
})

void test('tier 1 still may not import another TSSV module, by its package path or relatively', () => {
  for (const [spec, target] of [['tssv/lib/modules/SFIFO', 'tssv/lib/modules/SFIFO'], ['../modules/SFIFO/SFIFO.js', 'ts/src/modules/SFIFO/SFIFO.ts'],
    ['tssv/lib/modules/LFSRX', 'tssv/lib/modules/LFSRX']]) {
    const r = run(tier1(spec))
    assert.equal(r.status, 1, `${spec}: ${r.out}`)
    assert.ok(r.out.includes(`FAIL: TSSV: ts/src/tb/Component.ts (tier 1) imports ${target}`), r.out)
  }
})

void test('tier 2 may import LFSR, a building block', () => {
  const r = run(CLEAN, project('tssv/lib/modules/LFSR'))
  assert.equal(r.status, 0, r.out)
  assert.ok(r.out.includes("'s ts/test/vip/ (tier 2) import only the tiers below them"), r.out)
})

void test('tier 2 still may not import another TSSV module, or the project\'s own', () => {
  for (const [spec, target] of [['tssv/lib/modules/SFIFO', 'tssv/lib/modules/SFIFO'], ['../../../src/modules/Arbiter/Arbiter.js', 'ts/src/modules/Arbiter/Arbiter.ts']]) {
    const r = run(CLEAN, project(spec))
    assert.equal(r.status, 1, `${spec}: ${r.out}`)
    assert.ok(r.out.includes(`: ts/test/vip/proto/Agent.ts (tier 2) imports ${target};`), r.out)
  }
})

void test('this TSSV\'s own tier 1 passes', () => {
  const r = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' })
  assert.equal(r.status, 0, r.stdout + r.stderr)
})

// ---- No TS-side test reads a file (doc/framework/testbench.md, "What TS-side tests may check")

/** A project whose one TS-side test, at `path` under it, holds `text` */
const tsTest = (text: string, path = 'ts/test/Dut/test_dut.ts'): string => tree({ [path]: text })

/** Each way a test can read a file, with the line the script names and the function it reports */
const READS: Array<[string, string, number, string]> = [
  ['a named import', "import { readFileSync } from 'fs'\nexport const s = readFileSync('dut.sv', 'utf8')\n", 2, 'readFileSync'],
  ['an aliased import from node:fs', "import { readFileSync as rd } from 'node:fs'\nexport const s = rd('dut.sv', 'utf8')\n", 2, 'readFileSync'],
  ['an import over several lines', "import {\n  existsSync,\n  readFileSync\n} from 'fs'\nexport const s = existsSync('dut.sv') ? readFileSync('dut.sv', 'utf8') : ''\n", 5, 'readFileSync'],
  ['a read function passed as a value', "import { readFileSync } from 'fs'\nexport const all = ['dut.sv'].map(f => f).map(readFileSync)\n", 2, 'readFileSync'],
  ['a namespace import', "import * as fs from 'fs'\nexport const s = fs.readFileSync('dut.sv', 'utf8')\n", 2, 'readFileSync'],
  ['a default import', "import fs from 'node:fs'\nexport const s = fs.createReadStream('dut.sv')\n", 2, 'createReadStream'],
  ['fs/promises', "import { readFile } from 'fs/promises'\nexport const s = await readFile('dut.sv', 'utf8')\n", 2, 'readFile'],
  ["fs's promises export", "import { promises as fsp } from 'fs'\nexport const s = await fsp.readFile('dut.sv', 'utf8')\n", 2, 'readFile'],
  ['promises through a namespace', "import * as fs from 'fs'\nexport const s = await fs.promises.readFile('dut.sv', 'utf8')\n", 2, 'readFile'],
  ['fs loaded at run time', "const fs = require('fs')\nexport const s = fs.readFileSync('dut.sv', 'utf8')\n", 1, 'fs loaded at run time'],
  ['a waiver two lines up, which is too far', "import { readFileSync } from 'fs'\n// test-structure: reads the spec, not generated SV\n\nexport const s = readFileSync('spec.md', 'utf8')\n", 4, 'readFileSync']
]
for (const [what, text, line, fn] of READS) {
  void test(`a TS-side test fails when it reads a file: ${what}`, () => {
    const r = run(CLEAN, tsTest(text))
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes(`: ts/test/Dut/test_dut.ts:${line} (TS-side test) reads a file, with ${fn}`), r.out)
    assert.ok(r.out.includes('// test-structure: reads <what>, not generated SV'), r.out)
  })
}

void test('a read in tier 2, ts/test/vip/, fails too', () => {
  const r = run(CLEAN, tsTest("import { readFileSync } from 'fs'\nexport const s = readFileSync('dut.sv', 'utf8')\n", 'ts/test/vip/proto/Agent.ts'))
  assert.equal(r.status, 1, r.out)
  assert.ok(r.out.includes(': ts/test/vip/proto/Agent.ts:2 (TS-side test) reads a file, with readFileSync'), r.out)
})

/** TS-side tests that read no file, or say what they read */
const CLEAN_TESTS: Array<[string, string, number]> = [
  ['a read waived on its line', "import { readFileSync } from 'fs'\nexport const s = readFileSync('spec.md', 'utf8') // test-structure: reads the spec's markdown, not generated SV\n", 1],
  ['a read waived on the line above', "import { readFileSync } from 'fs'\n// test-structure: reads the spec's markdown, not generated SV\nexport const s = readFileSync('spec.md', 'utf8')\n", 1],
  ['fs calls that read no content', "import { existsSync, mkdirSync, writeFileSync } from 'fs'\nmkdirSync('out')\nwriteFileSync('out/a.txt', '')\nexport const ok = existsSync('out/a.txt')\n", 0],
  ['a read named only in comments', "import * as fs from 'fs'\n// fs.readFileSync() would read the SV\n/* readFileSync, fs.createReadStream */\nexport const ok = fs.existsSync('dut.sv')\n", 0],
  ['a type-only import', "import type { ReadStream } from 'fs'\nexport type R = ReadStream\n", 0]
]
for (const [what, text, waived] of CLEAN_TESTS) {
  void test(`a TS-side test passes: ${what}`, () => {
    const r = run(CLEAN, tsTest(text))
    assert.equal(r.status, 0, r.out)
    const named = waived > 0 ? `, but for ${waived} it names as not generated SV` : ''
    assert.ok(r.out.includes(`'s ts/test/ reads no files${named}`), r.out)
  })
}

void test('a project with no ts/test/ has no TS-side tests to check', () => {
  const r = run(CLEAN, tree({ 'ts/src/x.ts': 'export const x = 1\n' }))
  assert.equal(r.status, 0, r.out)
  assert.ok(r.out.includes(': no ts/test/, so no TS-side tests to check'), r.out)
})

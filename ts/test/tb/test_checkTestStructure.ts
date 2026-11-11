/**
 * Checks scripts/check-test-structure.mjs (doc/framework/testbench.md, "Three tiers") on fixture
 * trees, so that each way it can pass or fail is shown, not only that TSSV passes it:
 *
 *   - tier 1 and tier 2 may import a building block, LFSR, as tssv/lib/modules/LFSR, and tier 1 may
 *     also reach it by a relative import;
 *   - each still fails on a file that imports another TSSV module, SFIFO, either way;
 *   - a tier-2 file may not import a project's own module either.
 *
 * Each fixture is a directory with a tier-1 ts/src/tb/ (passed with --tier1) and, for tier 2, a
 * project with a ts/test/vip/.
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

/**
 * The port-contract check, scripts/check-port-contracts.mjs, run on ReadyPaths
 * (ts/test/models/ReadyPaths.ts): the mutation evidence that it passes a registered ready path
 * and fails a combinational one (doc/framework/concepts.md, "Port contracts").
 *
 * Each case writes a ReadyPaths configuration to a scratch directory, runs the check on it, and
 * reads only the check's exit status and the contracts it names, never the generated SV:
 *
 *   - the contracts ReadyPaths declares pass: channel a and channel s, both registered, and lane 1
 *     of the ready vector;
 *   - a contract on channel b, which is combinational, fails, naming it;
 *   - a contract on lane 0 of the vector fails while lane 1 passes, so one bit is checked exactly;
 *   - with channel a mutated to combinational, a's contract fails;
 *   - with a combinational loop inside the module, no contract is blamed: each is "not checked";
 *   - a directory with no contracts fails.
 *
 * It also writes the passing configuration to sv-examples/ReadyPaths/, with its lint wrapper, so
 * `npm run check:port-contracts` has a contract to check in CI (TEST-1).
 */
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { ReadyPaths, type ReadyPaths_Parameters } from './models/ReadyPaths.js'
import { writeLintWrapped } from './models/lintWrapper.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const base = new ReadyPaths()
writeLintWrapped(base, `sv-examples/ReadyPaths/${base.name}`, 'ts/test/test_checkPortContracts.ts')

const verilator = spawnSync('verilator', ['--version']).status === 0
const skip = verilator ? false : 'verilator not found'

/** Runs the check on ReadyPaths(params), with the extra contracts, in a scratch directory */
function check (params: ReadyPaths_Parameters, extra: Array<[string, string]> = []): { status: number | null, out: string } {
  const dir = mkdtempSync(join(tmpdir(), 'check-port-contracts-test-'))
  try {
    const m = new ReadyPaths(params)
    for (const [from, to] of extra) m.addNoCombinationalPathContract(from, to)
    m.writeSystemVerilogFiles(dir)
    const run = spawnSync('node', [`${TSSV_ROOT}/scripts/check-port-contracts.mjs`, dir], { encoding: 'utf8' })
    return { status: run.status, out: run.stdout + run.stderr }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

/** Asserts that `out` has `line` as a whole line */
function hasLine (out: string, line: string): void {
  assert.ok(out.split('\n').includes(line), `no line "${line}" in:\n${out}`)
}

const A = 'no combinational path from a_out_ready to a_in_ready'
const S = 'no combinational path from s_out.ready to s_in.ready'
const V1 = 'no combinational path from v_out_ready[1] to v_in_ready[1]'

void test('the registered paths pass: channels a and s, and lane 1 of the vector', { skip }, () => {
  const { status, out } = check({})
  assert.equal(status, 0, out)
  for (const c of [A, S, V1]) hasLine(out, `PASS: ReadyPaths_false_false: ${c}`)
})

void test('the combinational path fails: a contract on channel b', { skip }, () => {
  const { status, out } = check({}, [['b_out_ready', 'b_in_ready']])
  assert.equal(status, 1, out)
  assert.match(out, /^FAIL: ReadyPaths_false_false: no combinational path from b_out_ready to b_in_ready: broken/m)
  for (const c of [A, S, V1]) hasLine(out, `PASS: ReadyPaths_false_false: ${c}`)
})

void test('one bit of a vector is checked exactly: lane 0 fails, lane 1 passes', { skip }, () => {
  const { status, out } = check({}, [['v_out_ready[0]', 'v_in_ready[0]']])
  assert.equal(status, 1, out)
  assert.match(out, /^FAIL: ReadyPaths_false_false: no combinational path from v_out_ready\[0\] to v_in_ready\[0\]: broken/m)
  hasLine(out, `PASS: ReadyPaths_false_false: ${V1}`)
})

void test('the registered path mutated to combinational fails: channel a with mutate', { skip }, () => {
  const { status, out } = check({ mutate: true })
  assert.equal(status, 1, out)
  assert.ok(out.includes(`FAIL: ReadyPaths_false_true: ${A}: broken`), out)
  for (const c of [S, V1]) hasLine(out, `PASS: ReadyPaths_false_true: ${c}`)
})

void test('a loop inside the module blames no contract: each is not checked', { skip }, () => {
  const { status, out } = check({ internalLoop: true })
  assert.equal(status, 1, out)
  for (const c of [A, S, V1]) hasLine(out, `FAIL: ReadyPaths_true_false: ${c}: not checked`)
  assert.doesNotMatch(out, /broken/)
  assert.match(out, /ReadyPaths_true_false has a combinational loop of its own/)
})

void test('a directory with no contracts fails', { skip }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'check-port-contracts-test-'))
  try {
    const run = spawnSync('node', [`${TSSV_ROOT}/scripts/check-port-contracts.mjs`, dir], { encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /no port contracts found/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

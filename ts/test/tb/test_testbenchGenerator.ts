/**
 * Tests (node:test) of the testbench generator (ts/src/tb/testbenchGenerator.ts) and SimTop's load
 * list (formatLoadList), with SliceOrderHarness as the project's harness (TSSV#200). They read
 * the files the generator writes, never the SV in them; tb_regression_sim simulates the SV.
 *
 *   - names: a preloaded build per pair, a reloaded build per configuration with a run folder per
 *     testcase; the regression index has a line per run;
 *   - the output lands in <outRoot>/<dut>/<testbench>/, with each build's configuration, each
 *     run's patterns, and in reloaded mode its load list;
 *   - the load list names each memory in load_sel order, and is refused for a preloaded harness,
 *     a memory without a file, and a path with whitespace;
 *   - each configuration check: a depth for a memory the harness doesn't have, none for one it
 *     has, a harness that ignores the configured depth;
 *   - each testcase check: a file for no memory, no file for a memory, the wrong radix, more
 *     records than the depth, a count the file doesn't hold, a word of the wrong width, and a
 *     preloaded harness that ignores memory();
 *   - names that would collide, a configuration or testcase twice, a bad dut or testbench name
 *     and no modes are refused, and a refused run leaves the previous output as it was;
 *   - a testcase that names its configurations runs only with those (TSSV#223), and a name that
 *     isn't a configuration, none, one twice, and a configuration left with no testcase are
 *     refused;
 *   - a cycle table (SliceCycleHarness, a cycleExact checker) is built preloaded from its
 *     testcase's files and rows, and reloaded once per configuration, where only the testcases
 *     that name it run (TSSV#225); a harness that builds preloaded whatever build.mode says is
 *     refused, and so is a testcase whose tables hold different row counts, or none.
 */
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { writeManifest, writePatternFile, type ManifestFile, type Manifest } from 'tssv/lib/tb/patternFile'
import { checkerLayout, injectorLayout } from 'tssv/lib/tb/recordStream'
import { RecordChecker } from 'tssv/lib/tb/RecordChecker'
import { formatLoadList } from 'tssv/lib/tb/SimTop'
import { writeConfiguration, type TestbenchConfiguration } from 'tssv/lib/tb/testbenchConfiguration'
import { formatRegressionIndex, generateTestbenches, testbenchNames, type GenerateTestbenches_Parameters, type HarnessBuild } from 'tssv/lib/tb/testbenchGenerator'
import {
  SliceCycleHarness, SliceOrderHarness, SLICE_FIELDS, SLICE_LFSR, recordsOf, sliceCycleTable, sliceOrderParameters, sliceOrderTestcase, type SliceOrderParameters
} from './RecordStreamHarness.js'
import { existsSync, readFileSync, rmSync } from 'fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const ROOT = `${TSSV_ROOT}/sv-examples/tb/generatorTest`
const IN = `${ROOT}/inputs`
const OUT = `${ROOT}/out`
const TB = `${OUT}/StreamSlice/SliceOrder`
rmSync(ROOT, { recursive: true, force: true })

const DEPTHS = { 'h.inj_s_in.pattern': 48, 'h.chk_m_out.pattern': 48 }
/** Writes configuration `name` to the inputs, and returns its path */
function config (name: string, extra: Partial<TestbenchConfiguration> = {}): string {
  const path = `${IN}/configurations/${name}.json`
  writeConfiguration(path, { configuration: name, parameters: { stages: 2 }, depths: DEPTHS, maxCycles: 2000, ...extra })
  return path
}

/**
 * Writes testcase `name`, `records` seeded records, to the inputs, and returns its manifest's
 * path. `files` edits the manifest's entries; `stored` writes the stimulus without seeds, at the
 * wrong width for SliceOrder's memories.
 */
function testcase (name: string, records: number, files: (f: ManifestFile[]) => ManifestFile[] = f => f, stored = false): string {
  const dir = `${IN}/testcases/${name}`
  const objects = sliceOrderTestcase(records)
  const content = { dut: 'StreamSlice', testcase: name, purpose: 'a test', recordNoun: 'record', objectNoun: 'packet' }
  const unseeded = objects.map(o => ({ ...o, records: o.records.map(r => ({ last: r.last ?? 0n, data: 0n })) }))
  const stimulus = stored
    ? writePatternFile(`${dir}/stimulus.hex`, injectorLayout(SLICE_FIELDS), { ...content, objects: unseeded })
    : writePatternFile(`${dir}/stimulus.hex`, injectorLayout(SLICE_FIELDS, { lfsr: SLICE_LFSR }), { ...content, objects })
  const expected = writePatternFile(`${dir}/expected.hex`, checkerLayout(SLICE_FIELDS, { lfsr: SLICE_LFSR }), { ...content, objects })
  const path = `${dir}/${name}.json`
  writeManifest(path, {
    testcase: name,
    files: files([
      { file: 'stimulus.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records: stimulus },
      { file: 'expected.hex', memory: 'h.chk_m_out.pattern', radix: 'h', records: expected }
    ])
  })
  return path
}

const stages2 = config('stages2')
const full = testcase('full', 48)
const short = testcase('short', 12)

/** The generator's parameters for SliceOrder, with `extra` in place of any of them */
const slice = (extra: Partial<GenerateTestbenches_Parameters<SliceOrderParameters>> = {}): GenerateTestbenches_Parameters<SliceOrderParameters> => ({
  dut: 'StreamSlice',
  testbench: 'SliceOrder',
  outRoot: OUT,
  configurations: [stages2],
  testcases: [full, short],
  modes: ['reloaded'],
  parameters: sliceOrderParameters,
  harness: build => new SliceOrderHarness(build),
  ...extra
})

void test('a preloaded build per configuration and testcase; a reloaded one per configuration, run per testcase', () => {
  assert.deepEqual(testbenchNames('SliceOrder', 'preloaded', 'stages2', 'full'),
    { top: 'tb_SliceOrder_stages2_full', harness: 'SliceOrder_stages2_full', buildDir: 'preloaded/stages2/full', runDir: 'preloaded/stages2/full' })
  assert.deepEqual(testbenchNames('SliceOrder', 'reloaded', 'stages2', 'full'),
    { top: 'tb_SliceOrder_stages2_reloaded', harness: 'SliceOrder_stages2_reloaded', buildDir: 'reloaded/stages2', runDir: 'reloaded/stages2/full' })
})

void test('the regression index has a line per run: mode, configuration, testcase, top, build and run folders', () => {
  assert.equal(formatRegressionIndex([
    { mode: 'preloaded', configuration: 'a', testcase: 'x', top: 'tb_T_a_x', buildDir: 'preloaded/a/x', runDir: 'preloaded/a/x' },
    { mode: 'reloaded', configuration: 'a', testcase: 'x', top: 'tb_T_a_reloaded', buildDir: 'reloaded/a', runDir: 'reloaded/a/x' }
  ]), 'preloaded a x tb_T_a_x preloaded/a/x preloaded/a/x\nreloaded a x tb_T_a_reloaded reloaded/a reloaded/a/x\n')
})

void test('the output lands in <outRoot>/<dut>/<testbench>/, with the index, each build\'s configuration and each run\'s patterns', () => {
  const runs = generateTestbenches(slice({ modes: ['preloaded', 'reloaded'] }))
  assert.deepEqual(runs.map(r => `${r.mode} ${r.testcase} ${r.top} ${r.runDir}`), [
    'preloaded full tb_SliceOrder_stages2_full preloaded/stages2/full',
    'preloaded short tb_SliceOrder_stages2_short preloaded/stages2/short',
    'reloaded full tb_SliceOrder_stages2_reloaded reloaded/stages2/full',
    'reloaded short tb_SliceOrder_stages2_reloaded reloaded/stages2/short'
  ])
  assert.equal(readFileSync(`${TB}/regression.txt`, 'utf8'), formatRegressionIndex(runs))
  for (const file of [
    'preloaded/stages2/full/tb_SliceOrder_stages2_full.sv', 'preloaded/stages2/full/stages2.json',
    'preloaded/stages2/full/patterns/full.json', 'preloaded/stages2/full/patterns/stimulus.hex', 'preloaded/stages2/full/patterns/expected.hex',
    'reloaded/stages2/tb_SliceOrder_stages2_reloaded.sv', 'reloaded/stages2/stages2.json',
    'reloaded/stages2/short/patterns/short.json', 'reloaded/stages2/short/patterns/stimulus.hex', 'reloaded/stages2/short/patterns/load.txt'
  ]) assert.ok(existsSync(`${TB}/${file}`), file)
  assert.equal(existsSync(`${TB}/preloaded/stages2/full/patterns/load.txt`), false)
  assert.equal(readFileSync(`${TB}/reloaded/stages2/short/patterns/load.txt`, 'utf8'),
    'testcase short\nh.inj_s_in.pattern 12 patterns/stimulus.hex\nh.chk_m_out.pattern 12 patterns/expected.hex\n')
})

// A reloaded SliceOrder harness, for the load list
const reloaded = (): SliceOrderHarness => new SliceOrderHarness({
  config: { configuration: 'stages2', parameters: { stages: 2 }, depths: DEPTHS, maxCycles: 2000 },
  name: 'load_list',
  mode: 'reloaded',
  memory: path => ({ depth: DEPTHS[path as keyof typeof DEPTHS] })
})
const manifest = (files: Manifest['files']): Manifest => ({ testcase: 'tc', files })
const stimulusFile: ManifestFile = { file: 'in/stimulus.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records: 3 }
const expectedFile: ManifestFile = { file: 'expected.hex', memory: 'h.chk_m_out.pattern', radix: 'h', records: 2 }

void test('the load list names each memory in load_sel order, whatever the manifest\'s order', () => {
  assert.equal(formatLoadList(reloaded(), manifest([expectedFile, stimulusFile])),
    'testcase tc\nh.inj_s_in.pattern 3 patterns/in/stimulus.hex\nh.chk_m_out.pattern 2 patterns/expected.hex\n')
})

void test('a load list is refused for a preloaded harness, a memory without a file, and a path with whitespace', () => {
  const preloaded = new SliceOrderHarness({
    config: { configuration: 'stages2', parameters: { stages: 2 }, depths: DEPTHS, maxCycles: 2000 },
    name: 'pre',
    mode: 'preloaded',
    memory: path => ({ depth: 48, file: 'patterns/x.hex', records: path === 'h.inj_s_in.pattern' ? 3 : 2 })
  })
  assert.throws(() => formatLoadList(preloaded, manifest([stimulusFile, expectedFile])), { message: 'formatLoadList: harness pre\'s memories aren\'t reloaded' })
  assert.throws(() => formatLoadList(reloaded(), manifest([stimulusFile])), { message: 'formatLoadList: testcase tc has no file for h.chk_m_out.pattern' })
  assert.throws(() => formatLoadList(reloaded(), manifest([stimulusFile, { ...expectedFile, file: 'my expected.hex' }])),
    { message: 'formatLoadList: the path "patterns/my expected.hex" has whitespace, which a load list can\'t hold' })
})

// ---- Testcases that name their configurations

const stages3 = config('stages3', { parameters: { stages: 3 } })
const PAIRED = `${ROOT}/paired`

void test('a testcase that names configurations runs only with those; one that names none runs with every one', () => {
  const runs = generateTestbenches(slice({
    outRoot: PAIRED, configurations: [stages2, stages3], testcases: [full, { manifest: short, configurations: ['stages3'] }], modes: ['preloaded', 'reloaded']
  }))
  assert.deepEqual(runs.map(r => `${r.mode} ${r.configuration} ${r.testcase}`), [
    'preloaded stages2 full', 'preloaded stages3 full', 'preloaded stages3 short',
    'reloaded stages2 full', 'reloaded stages3 full', 'reloaded stages3 short'
  ])
  const tb = `${PAIRED}/StreamSlice/SliceOrder`
  assert.equal(readFileSync(`${tb}/regression.txt`, 'utf8'), formatRegressionIndex(runs))
  assert.equal(existsSync(`${tb}/preloaded/stages2/short`), false)
  assert.equal(existsSync(`${tb}/reloaded/stages2/short`), false)
  assert.ok(existsSync(`${tb}/reloaded/stages3/short/patterns/load.txt`))
})

// ---- Cycle tables: SliceCycle, a cycleExact checker on a 2- or 3-stage slice

const CYCLE_DEPTHS = { 'h.inj_s_in.pattern': 12, 'h.chk_m_out.play.pattern': 32, 'h.chk_m_out.chk.pattern': 32 }
const cycle2 = config('cycle2', { depths: CYCLE_DEPTHS, maxCycles: 100 })
const cycle3 = config('cycle3', { parameters: { stages: 3 }, depths: CYCLE_DEPTHS, maxCycles: 100 })

/**
 * Writes SliceCycle testcase `name`, 12 records and a 28-row table for a slice of `stages`
 * stages, and returns its manifest's path. `readyRows` and `expectedRows` keep the first rows of
 * each table file only, for a testcase whose tables differ.
 */
function cycleTestcase (name: string, stages = 2, readyRows = 28, expectedRows = 28): string {
  const dir = `${IN}/testcases/${name}`
  const stimulus = sliceOrderTestcase(12)
  const table = RecordChecker.cycleRecords(SLICE_FIELDS, sliceCycleTable(recordsOf(stimulus), 28, stages))
  const layouts = RecordChecker.cycleLayouts(SLICE_FIELDS)
  const content = { dut: 'StreamSlice', testcase: name, purpose: 'a test', recordNoun: 'cycle', objectNoun: 'table' }
  const path = `${dir}/${name}.json`
  writeManifest(path, {
    testcase: name,
    files: [
      { file: 'stimulus.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records: writePatternFile(`${dir}/stimulus.hex`, injectorLayout(SLICE_FIELDS, { lfsr: SLICE_LFSR }), { ...content, objects: stimulus }) },
      { file: 'ready.hex', memory: 'h.chk_m_out.play.pattern', radix: 'h', records: writePatternFile(`${dir}/ready.hex`, layouts.ready, { ...content, objects: [{ records: table.ready.slice(0, readyRows) }] }) },
      { file: 'expected.hex', memory: 'h.chk_m_out.chk.pattern', radix: 'h', records: writePatternFile(`${dir}/expected.hex`, layouts.expected, { ...content, objects: [{ records: table.expected.slice(0, expectedRows) }] }) }
    ]
  })
  return path
}
const stalls = cycleTestcase('stalls')
const stalls3 = cycleTestcase('stalls3', 3)

/** The generator's parameters for SliceCycle, with `extra` in place of any of them */
const sliceCycle = (extra: Partial<GenerateTestbenches_Parameters<SliceOrderParameters>> = {}): GenerateTestbenches_Parameters<SliceOrderParameters> => ({
  dut: 'StreamSlice',
  testbench: 'SliceCycle',
  outRoot: `${ROOT}/cycle`,
  configurations: [cycle2],
  testcases: [stalls],
  modes: ['preloaded'],
  parameters: sliceOrderParameters,
  harness: build => new SliceCycleHarness(build),
  ...extra
})

void test('a cycle table is built preloaded, its two memories registered with the testcase\'s files and rows', () => {
  const runs = generateTestbenches(sliceCycle())
  assert.deepEqual(runs.map(r => `${r.mode} ${r.top}`), ['preloaded tb_SliceCycle_cycle2_stalls'])
  const dir = `${ROOT}/cycle/StreamSlice/SliceCycle/preloaded/cycle2/stalls`
  for (const file of ['tb_SliceCycle_cycle2_stalls.sv', 'patterns/stimulus.hex', 'patterns/ready.hex', 'patterns/expected.hex']) assert.ok(existsSync(`${dir}/${file}`), file)
})

void test('a cycle table is built reloaded once per configuration, running only the testcases that name it', () => {
  const runs = generateTestbenches(sliceCycle({
    outRoot: `${ROOT}/cycle_paired`,
    configurations: [cycle2, cycle3],
    testcases: [{ manifest: stalls, configurations: ['cycle2'] }, { manifest: stalls3, configurations: ['cycle3'] }],
    modes: ['preloaded', 'reloaded']
  }))
  assert.deepEqual(runs.map(r => `${r.mode} ${r.configuration} ${r.testcase} ${r.top}`), [
    'preloaded cycle2 stalls tb_SliceCycle_cycle2_stalls', 'preloaded cycle3 stalls3 tb_SliceCycle_cycle3_stalls3',
    'reloaded cycle2 stalls tb_SliceCycle_cycle2_reloaded', 'reloaded cycle3 stalls3 tb_SliceCycle_cycle3_reloaded'
  ])
  const tb = `${ROOT}/cycle_paired/StreamSlice/SliceCycle`
  assert.equal(existsSync(`${tb}/reloaded/cycle2/stalls3`), false)
  assert.equal(existsSync(`${tb}/reloaded/cycle3/stalls`), false)
  // The table's two memories load in order, each with the testcase's 28 rows
  assert.equal(readFileSync(`${tb}/reloaded/cycle2/stalls/patterns/load.txt`, 'utf8'), 'testcase stalls\n' +
    'h.inj_s_in.pattern 12 patterns/stimulus.hex\nh.chk_m_out.play.pattern 28 patterns/ready.hex\nh.chk_m_out.chk.pattern 28 patterns/expected.hex\n')
})

void test('a reloaded build of a harness that builds its tables preloaded anyway is refused', () => {
  const preloadedAnyway = (build: HarnessBuild<SliceOrderParameters>): SliceCycleHarness =>
    new SliceCycleHarness({ ...build, mode: 'preloaded', memory: path => ({ ...build.memory(path), file: 'patterns/x.hex', records: path === 'h.inj_s_in.pattern' ? 12 : 28 }) })
  assert.throws(() => generateTestbenches(sliceCycle({ modes: ['reloaded'], harness: preloadedAnyway })), {
    message: 'tb_SliceCycle_cycle2_reloaded: is built reloaded, but h.inj_s_in.pattern, h.chk_m_out.play.pattern, h.chk_m_out.chk.pattern are preloaded; ' +
      'a harness passes build.mode to each component'
  })
})

void test('a testcase whose tables hold different row counts, or none, is refused in either mode', () => {
  const short = cycleTestcase('short_expected', 2, 28, 27)
  const empty = cycleTestcase('no_rows', 2, 0, 0)
  for (const mode of ['reloaded', 'preloaded'] as const) {
    const top = mode === 'reloaded' ? 'tb_SliceCycle_cycle2_reloaded' : 'tb_SliceCycle_cycle2_short_expected'
    // A preloaded SliceCycleHarness refuses the mismatch itself; the generator checks it in a reloaded build
    const message = mode === 'reloaded'
      ? `${top}: testcase short_expected (${short}): the harness's cycle tables need one row count, at least 1, but the files hold h.chk_m_out.play.pattern 28, h.chk_m_out.chk.pattern 27`
      : `${top}: SliceCycle_cycle2_short_expected: the table's ready and expected files need one row count and depth, got 28 and 27 rows, depths 32 and 32`
    assert.throws(() => generateTestbenches(sliceCycle({ modes: [mode], testcases: [short] })), { message }, mode)
  }
  assert.throws(() => generateTestbenches(sliceCycle({ modes: ['reloaded'], testcases: [empty] })), {
    message: `tb_SliceCycle_cycle2_reloaded: testcase no_rows (${empty}): the harness's cycle tables need one row count, at least 1, but the files hold h.chk_m_out.play.pattern 0, h.chk_m_out.chk.pattern 0`
  })
})

// Each refusal, with the generator's parameters that cause it
const top = 'tb_SliceOrder_stages2_reloaded'
const refusals: Array<[string, () => Partial<GenerateTestbenches_Parameters<SliceOrderParameters>>, string]> = [
  ['a depth for a memory the harness doesn\'t have', () => ({ configurations: [config('extra', { configuration: 'extra', depths: { ...DEPTHS, 'h.chk_x.pattern': 8 } })] }),
    'tb_SliceOrder_extra_reloaded: configuration extra has a depth for h.chk_x.pattern, which isn\'t a pattern memory of the harness (h.inj_s_in.pattern, h.chk_m_out.pattern)'],
  ['no depth for a memory the harness has', () => ({ configurations: [config('missing', { configuration: 'missing', depths: { 'h.inj_s_in.pattern': 48 } })] }),
    'tb_SliceOrder_missing_reloaded: configuration missing has no depth for h.chk_m_out.pattern'],
  ['a harness that ignores the configured depth', () => ({ harness: build => new SliceOrderHarness({ ...build, memory: path => ({ ...build.memory(path), depth: 12 }) }) }),
    `${top}: h.inj_s_in.pattern has depth 12, but configuration stages2 says 48`],
  ['a file for a memory the harness doesn\'t have', () => ({ testcases: [testcase('extra_file', 12, f => [...f, { ...f[0], memory: 'h.chk_x.pattern' }])] }),
    `${top}: testcase extra_file (${IN}/testcases/extra_file/extra_file.json) has a file for h.chk_x.pattern, which isn't a pattern memory of the harness (h.inj_s_in.pattern, h.chk_m_out.pattern)`],
  ['no file for a memory', () => ({ testcases: [testcase('no_expected', 12, f => f.slice(0, 1))] }),
    `${top}: testcase no_expected (${IN}/testcases/no_expected/no_expected.json) has no file for h.chk_m_out.pattern`],
  ['the wrong radix', () => ({ testcases: [testcase('binary', 12, f => [{ ...f[0], radix: 'b' }, f[1]])] }),
    `${top}: testcase binary (${IN}/testcases/binary/binary.json): stimulus.hex is $readmemb, but h.inj_s_in.pattern is $readmemh`],
  ['more records than the depth', () => ({ testcases: [testcase('too_many', 12, f => [{ ...f[0], records: 49 }, f[1]])] }),
    `${top}: testcase too_many (${IN}/testcases/too_many/too_many.json): stimulus.hex has 49 records, but h.inj_s_in.pattern holds 48`],
  ['a count the file doesn\'t hold', () => ({ testcases: [testcase('miscounted', 12, f => [{ ...f[0], records: 11 }, f[1]])] }),
    `${top}: testcase miscounted (${IN}/testcases/miscounted/miscounted.json): stimulus.hex holds 12 records, but the manifest says 11`],
  ['a word of the wrong width', () => ({ testcases: [testcase('stored', 12, f => f, true)] }),
    `${top}: testcase stored (${IN}/testcases/stored/stored.json): record 0 of stimulus.hex has 9 digits, but a word of h.inj_s_in.pattern has 17`],
  ['a preloaded harness that ignores memory()', () => ({ modes: ['preloaded'], harness: build => new SliceOrderHarness({ ...build, memory: path => ({ ...build.memory(path), file: 'patterns/other.hex' }) }) }),
    'tb_SliceOrder_stages2_full: testcase full (' + full + '): h.inj_s_in.pattern loads patterns/other.hex with 48 records, not patterns/stimulus.hex with 48; build it from memory()'],
  ['a preloaded testcase without a file for a memory', () => ({ modes: ['preloaded'], testcases: [testcase('no_expected', 12, f => f.slice(0, 1))] }),
    'tb_SliceOrder_stages2_no_expected: testcase no_expected has no file for h.chk_m_out.pattern'],
  ['two runs that would share a top', () => ({ modes: ['preloaded', 'reloaded'], testcases: [testcase('reloaded', 12)] }),
    'StreamSlice/SliceOrder: reloaded stages2 and preloaded stages2 reloaded would both be tb_SliceOrder_stages2_reloaded; rename a configuration or testcase'],
  ['a configuration twice', () => ({ configurations: [stages2, stages2] }), 'StreamSlice/SliceOrder: two configurations are named stages2'],
  ['a testcase twice', () => ({ testcases: [full, full] }), 'StreamSlice/SliceOrder: two testcases are named full'],
  ['a testcase that names a configuration there isn\'t', () => ({ testcases: [{ manifest: full, configurations: ['stages9'] }] }),
    'StreamSlice/SliceOrder: testcase full names configuration stages9, which isn\'t one of stages2'],
  ['a testcase that names no configuration', () => ({ testcases: [{ manifest: full, configurations: [] }] }),
    'StreamSlice/SliceOrder: testcase full names no configuration; leave its configurations out to run it with every one'],
  ['a testcase that names a configuration twice', () => ({ testcases: [{ manifest: full, configurations: ['stages2', 'stages2'] }] }),
    'StreamSlice/SliceOrder: testcase full names configuration stages2 twice'],
  ['a configuration that runs no testcase', () => ({ configurations: [stages2, stages3], testcases: [{ manifest: full, configurations: ['stages2'] }] }),
    'StreamSlice/SliceOrder: configuration stages3 runs no testcase; name it in a testcase\'s configurations, or leave it out'],
  ['a dut that isn\'t an SV identifier', () => ({ dut: 'Stream-Slice' }), 'generateTestbenches: dut "Stream-Slice" isn\'t an SV identifier'],
  ['a testbench that isn\'t an SV identifier', () => ({ testbench: '2Order' }), 'generateTestbenches: testbench "2Order" isn\'t an SV identifier'],
  ['no modes', () => ({ modes: [] }), 'StreamSlice/SliceOrder: modes must name each mode once, got '],
  ['parameters the project refuses', () => ({ configurations: [config('wide', { configuration: 'wide', parameters: { stages: 2, width: 8 } })] }),
    `${IN}/configurations/wide.json: parameters has width; a SliceOrder configuration has only stages`]
]
for (const [what, extra, message] of refusals) {
  void test(`refused: ${what}, leaving the previous output as it was`, () => {
    const before = readFileSync(`${TB}/regression.txt`, 'utf8')
    assert.throws(() => generateTestbenches(slice(extra())), { message })
    assert.equal(readFileSync(`${TB}/regression.txt`, 'utf8'), before)
    assert.ok(existsSync(`${TB}/preloaded/stages2/full/tb_SliceOrder_stages2_full.sv`))
  })
}

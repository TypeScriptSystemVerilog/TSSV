// SliceCycle, a cycleExact testbench that the testbench generator builds (TSSV#223;
// doc/framework/testbench.md, "Configurations, testcases and the generator"). Its table fits one
// slice: it says in which cycle each record leaves, which depends on the slice's stages. So each
// testcase names the configuration it runs with, and the generator builds only those pairs,
// preloaded, as a cycle table is, under sv-examples/tb/StreamSlice/SliceCycle/:
//
//   - configurations/stages2.json, stages3.json: the slice's stages, the injector's memory 12
//     deep, and the table's two memories 32 deep for stages2 and 40 deep for stages3. 40 is more
//     than the 28 rows need, so stages3's memories have a wider address than the table's fetch;
//   - testcases/stalls2/, stalls3/: the same 12 records, with a seed per packet, and a table of
//     28 rows for each slice, in which the output stalls for 3, 1 and 2 cycles (sliceCycleTable()).
//
// Two runs, listed in regression.txt. verilatorTB/Makefile's tb_regression_sim builds and runs each.
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { writeManifest, writePatternFile, type PatternFileContent, type PatternObject } from 'tssv/lib/tb/patternFile'
import { RecordChecker } from 'tssv/lib/tb/RecordChecker'
import { injectorLayout } from 'tssv/lib/tb/recordStream'
import { writeConfiguration } from 'tssv/lib/tb/testbenchConfiguration'
import { generateTestbenches } from 'tssv/lib/tb/testbenchGenerator'
import { SliceCycleHarness, SLICE_FIELDS, SLICE_LFSR, recordsOf, sliceCycleTable, sliceOrderParameters, sliceOrderTestcase } from './RecordStreamHarness.js'
import { rmSync } from 'fs'

const OUT = `${TSSV_ROOT}/sv-examples/tb`
const DIR = `${OUT}/StreamSlice/SliceCycle`
rmSync(DIR, { recursive: true, force: true })

const RECORDS = 12
const ROWS = 28
const TABLE_DEPTH = new Map([[2, 32], [3, 40]])

// The configurations: what changes the build
const configurations = [...TABLE_DEPTH].map(([stages, depth]) => {
  const path = `${DIR}/configurations/stages${stages}.json`
  writeConfiguration(path, {
    configuration: `stages${stages}`,
    parameters: { stages },
    depths: { 'h.inj_s_in.pattern': RECORDS, 'h.chk_m_out.play.pattern': depth, 'h.chk_m_out.chk.pattern': depth },
    maxCycles: 100
  })
  return path
})

/**
 * Writes the testcase for a slice of `stages` stages to testcases/stalls<stages>/: the stimulus,
 * and the table's ready and expected files. Returns its manifest, paired with its configuration.
 */
function writeTestcase (stages: number, stimulus: PatternObject[]): { manifest: string, configurations: string[] } {
  const testcase = `stalls${stages}`
  const dir = `${DIR}/testcases/${testcase}`
  const table = RecordChecker.cycleRecords(SLICE_FIELDS, sliceCycleTable(recordsOf(stimulus), ROWS, stages))
  const layouts = RecordChecker.cycleLayouts(SLICE_FIELDS)
  const content = (purpose: string, objectNoun: string, recordNoun: string, objects: PatternObject[]): PatternFileContent =>
    ({ dut: 'StreamSlice', testcase, purpose, recordNoun, objectNoun, objects })
  const records = writePatternFile(`${dir}/stimulus.hex`, injectorLayout(SLICE_FIELDS, { lfsr: SLICE_LFSR }),
    content('stimulus for s_in, a seed per packet', 'packet', 'record', stimulus))
  const ready = writePatternFile(`${dir}/ready.hex`, layouts.ready,
    content(`ready on m_out, per cycle, for ${stages} stages`, 'table', 'cycle', [{ records: table.ready }]))
  const expected = writePatternFile(`${dir}/expected.hex`, layouts.expected,
    content(`expected valid and record on m_out, per cycle, for ${stages} stages`, 'table', 'cycle', [{ records: table.expected }]))
  writeManifest(`${dir}/${testcase}.json`, {
    testcase,
    files: [
      { file: 'stimulus.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records },
      { file: 'ready.hex', memory: 'h.chk_m_out.play.pattern', radix: 'h', records: ready },
      { file: 'expected.hex', memory: 'h.chk_m_out.chk.pattern', radix: 'h', records: expected }
    ]
  })
  return { manifest: `${dir}/${testcase}.json`, configurations: [`stages${stages}`] }
}

// The testcases: one stimulus, and a table for each slice
const stimulus = sliceOrderTestcase(RECORDS)
const runs = generateTestbenches({
  dut: 'StreamSlice',
  testbench: 'SliceCycle',
  outRoot: OUT,
  configurations,
  testcases: [...TABLE_DEPTH.keys()].map(stages => writeTestcase(stages, stimulus)),
  modes: ['preloaded'],
  parameters: sliceOrderParameters,
  harness: build => new SliceCycleHarness(build)
})
for (const r of runs) console.log(`${r.mode} ${r.configuration} ${r.testcase}: ${r.top}, run in sv-examples/tb/StreamSlice/SliceCycle/${r.runDir}/`)

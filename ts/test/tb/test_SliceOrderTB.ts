// SliceOrder, the testbench generator's example (TSSV#200; its TB spec is
// doc/framework/examples/StreamSlice-tb-spec.md). The runner holds no test content in the harness:
// it writes the configurations and the testcases as files, and the generator builds a testbench
// for every pair, in both run modes, under sv-examples/tb/StreamSlice/SliceOrder/:
//
//   - configurations/stages2.json, stages3.json: the slice's stages, both memories 48 deep;
//   - testcases/seeded_packets/: 48 records, a seed on every packet's first record;
//   - testcases/continued/: 44 records, seeds on every third packet only, so the data continues
//     the LFSR's sequence across packets, and from its reset seed at record 0.
//
// That is 4 preloaded builds and 2 reloaded ones, 8 runs, listed in regression.txt.
// verilatorTB/Makefile's tb_regression_sim builds and runs each.
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { writeManifest, writePatternFile, type PatternObject } from 'tssv/lib/tb/patternFile'
import { checkerLayout, injectorLayout } from 'tssv/lib/tb/recordStream'
import { writeConfiguration } from 'tssv/lib/tb/testbenchConfiguration'
import { generateTestbenches } from 'tssv/lib/tb/testbenchGenerator'
import { SliceOrderHarness, SLICE_FIELDS, SLICE_LFSR, sliceContinuedTestcase, sliceOrderParameters, sliceOrderTestcase } from './RecordStreamHarness.js'
import { rmSync } from 'fs'

const OUT = `${TSSV_ROOT}/sv-examples/tb`
const DIR = `${OUT}/StreamSlice/SliceOrder`
rmSync(DIR, { recursive: true, force: true })

// The configurations: what changes the build
const DEPTH = 48
const configurations = [2, 3].map(stages => {
  const path = `${DIR}/configurations/stages${stages}.json`
  writeConfiguration(path, {
    configuration: `stages${stages}`,
    parameters: { stages },
    depths: { 'h.inj_s_in.pattern': DEPTH, 'h.chk_m_out.pattern': DEPTH },
    maxCycles: 2000
  })
  return path
})

/** Writes a testcase's stimulus, expected file and manifest to testcases/<testcase>/, and returns the manifest's path */
function writeTestcase (testcase: string, packets: PatternObject[], what: string): string {
  const dir = `${DIR}/testcases/${testcase}`
  const content = (purpose: string): Parameters<typeof writePatternFile>[2] =>
    ({ dut: 'StreamSlice', testcase, purpose, recordNoun: 'record', objectNoun: 'packet', objects: packets })
  const stimulus = writePatternFile(`${dir}/stimulus.hex`, injectorLayout(SLICE_FIELDS, { lfsr: SLICE_LFSR }), content(`stimulus for s_in, ${what}`))
  const expected = writePatternFile(`${dir}/expected.hex`, checkerLayout(SLICE_FIELDS, { lfsr: SLICE_LFSR }), content('expected on m_out: the packets as sent'))
  writeManifest(`${dir}/${testcase}.json`, {
    testcase,
    files: [
      { file: 'stimulus.hex', memory: 'h.inj_s_in.pattern', radix: 'h', records: stimulus },
      { file: 'expected.hex', memory: 'h.chk_m_out.pattern', radix: 'h', records: expected }
    ]
  })
  return `${dir}/${testcase}.json`
}

// The testcases: content, which a reloaded build runs without a rebuild
const testcases = [
  writeTestcase('seeded_packets', sliceOrderTestcase(DEPTH), 'a seed per packet'),
  writeTestcase('continued', sliceContinuedTestcase(44), 'a seed on every third packet')
]

const runs = generateTestbenches({
  dut: 'StreamSlice',
  testbench: 'SliceOrder',
  outRoot: OUT,
  configurations,
  testcases,
  modes: ['preloaded', 'reloaded'],
  parameters: sliceOrderParameters,
  harness: build => new SliceOrderHarness(build)
})
for (const r of runs) console.log(`${r.mode} ${r.configuration} ${r.testcase}: ${r.top}, run in sv-examples/tb/StreamSlice/SliceOrder/${r.runDir}/`)

// LoadBus, the load port's framework test (TSSV#200): a reloaded testbench whose memories differ in
// depth and width, sit in two clock domains, and include a perSource checker with an empty source
// (LoadBusHarness.ts). One configuration and two testcases, in reloaded mode only, under
// sv-examples/tb/AFIFO/LoadBus/:
//
//   - configurations/depth16.json: the injector's memory 16 deep, each checker source's 8 deep;
//   - testcases/all_sources/: 16 records, the injector's depth, from all three sources;
//   - testcases/one_empty/: 13 records from sources 0 and 1, so source 2 loads no records.
//
// One build runs both, as regression.txt lists them; verilatorTB/Makefile's tb_regression_sim
// builds and runs it.
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { writeManifest, writePatternFile, type PatternObject } from 'tssv/lib/tb/patternFile'
import { checkerLayout, injectorLayout } from 'tssv/lib/tb/recordStream'
import { writeConfiguration } from 'tssv/lib/tb/testbenchConfiguration'
import { generateTestbenches } from 'tssv/lib/tb/testbenchGenerator'
import { LoadBusHarness, LOAD_BUS_FIELDS, LOAD_BUS_SOURCES, loadBusParameters, loadBusTestcase } from './LoadBusHarness.js'
import { rmSync } from 'fs'

const OUT = `${TSSV_ROOT}/sv-examples/tb`
const DIR = `${OUT}/AFIFO/LoadBus`
rmSync(DIR, { recursive: true, force: true })

const sources = Array.from({ length: LOAD_BUS_SOURCES }, (_, k) => k)
const configuration = `${DIR}/configurations/depth16.json`
writeConfiguration(configuration, {
  configuration: 'depth16',
  parameters: {},
  depths: { 'h.inj_wr.pattern': 16, ...Object.fromEntries(sources.map(k => [`h.chk_rd.pattern_${k}`, 8])) },
  maxCycles: 1000
})

/** Writes a testcase's stream, each source's expected file, and the manifest, and returns the manifest's path */
function writeTestcase (testcase: string, content: { stream: PatternObject[], expected: PatternObject[][] }): string {
  const dir = `${DIR}/testcases/${testcase}`
  const header = { dut: 'AFIFO', testcase, recordNoun: 'record', objectNoun: 'source' }
  const stream = writePatternFile(`${dir}/stimulus.hex`, injectorLayout(LOAD_BUS_FIELDS), { ...header, purpose: 'stimulus for wr, every source interleaved', objectNoun: 'stream', objects: content.stream })
  const expected = sources.map(k => writePatternFile(`${dir}/expected_${k}.hex`, checkerLayout(LOAD_BUS_FIELDS, { sourceField: 'src' }), {
    ...header, purpose: `expected on rd from source ${k}`, objects: content.expected[k] ?? []
  }))
  writeManifest(`${dir}/${testcase}.json`, {
    testcase,
    files: [
      { file: 'stimulus.hex', memory: 'h.inj_wr.pattern', radix: 'h', records: stream },
      ...sources.map(k => ({ file: `expected_${k}.hex`, memory: `h.chk_rd.pattern_${k}`, radix: 'h' as const, records: expected[k] ?? 0 }))
    ]
  })
  return `${dir}/${testcase}.json`
}

const runs = generateTestbenches({
  dut: 'AFIFO',
  testbench: 'LoadBus',
  outRoot: OUT,
  configurations: [configuration],
  testcases: [
    writeTestcase('all_sources', loadBusTestcase(16, [0, 1, 2], 1)),
    writeTestcase('one_empty', loadBusTestcase(13, [0, 1], 2))
  ],
  modes: ['reloaded'],
  parameters: loadBusParameters,
  harness: build => new LoadBusHarness(build)
})
for (const r of runs) console.log(`${r.mode} ${r.configuration} ${r.testcase}: ${r.top}, run in sv-examples/tb/AFIFO/LoadBus/${r.runDir}/`)

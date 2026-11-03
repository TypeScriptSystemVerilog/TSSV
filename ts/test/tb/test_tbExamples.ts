// Example testbenches built on tier 1 alone (doc/framework/testbench.md): each is a SimTop over a
// harness, written to sv-examples/tb/<testbench>/, with its testcase's pattern files and manifest
// in patterns/ beside it. verilatorTB/Makefile's tb_examples_sim checks each harness with
// scripts/check-harness.mjs, then builds each testbench and runs it from its folder, where the
// harness's $readmemh paths (patterns/<file>) lead.
//
//   - tb_SFIFOWave_dual_port replays the SFIFO spec's dual-port timing diagram against the RTL.
//     Its stimulus and expected values are written from the diagram.
//   - tb_Lfsr checks Lfsr against a model of the xorshift sequence. Its expected values are
//     written from the model, and the loads its loadable case sees from LOADS.
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { SimTop } from 'tssv/lib/tb/SimTop'
import { VectorPlayer } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'
import { writeManifest, writePatternFile } from 'tssv/lib/tb/patternFile'
import { SFIFOWaveHarness, sfifoWaveTable } from './SFIFOWaveHarness.js'
import { LfsrHarness, CASES, ROWS, caseLane, caseWidths, loadLanes } from './LfsrHarness.js'
import { rmSync } from 'fs'

const OUT = `${TSSV_ROOT}/sv-examples/tb`

// ---- tb_SFIFOWave_dual_port: the dual-port diagram, as the diagram draws it: depth 4, and 8 bits
// for its letter labels
const SVG = 'SFIFO-timing-dual-port.svg'
const SFIFO_CONFIG = { dataWidth: 8n, depth: 4n }
const sfifoDir = `${OUT}/tb_SFIFOWave_dual_port`
rmSync(sfifoDir, { recursive: true, force: true })
const sfifoTable = sfifoWaveTable(SVG, SFIFO_CONFIG)
const sfifoFile = (purpose: string): { dut: string, testcase: string, purpose: string, recordNoun: string, objectNoun: string } =>
  ({ dut: 'SFIFO', testcase: 'dual_port', purpose, recordNoun: 'cycle', objectNoun: 'diagram' })
const stimulus = writePatternFile(`${sfifoDir}/patterns/stimulus.hex`, VectorPlayer.layout(sfifoTable.driven), {
  ...sfifoFile(`stimulus from ${SVG}`),
  objects: [{ label: SVG, records: VectorPlayer.records(sfifoTable.driven, sfifoTable.cycles) }]
})
const expected = writePatternFile(`${sfifoDir}/patterns/expected.hex`, VectorChecker.layout(sfifoTable.checked), {
  ...sfifoFile(`expected values from ${SVG}`),
  objects: [{ label: SVG, records: VectorChecker.records(sfifoTable.checked, sfifoTable.cycles) }]
})
writeManifest(`${sfifoDir}/patterns/dual_port.json`, {
  testcase: 'dual_port',
  files: [
    { file: 'stimulus.hex', memory: 'h.play.pattern', radix: 'h', records: stimulus },
    { file: 'expected.hex', memory: 'h.chk.pattern', radix: 'h', records: expected }
  ]
})

// ---- tb_Lfsr: the loads, and each case's expected values from the xorshift model
const lfsrDir = `${OUT}/tb_Lfsr`
rmSync(lfsrDir, { recursive: true, force: true })
const loads = writePatternFile(`${lfsrDir}/patterns/stimulus.hex`, VectorPlayer.layout(loadLanes()), {
  dut: 'Lfsr',
  testcase: 'xorshift',
  purpose: 'load and seed_in of each loadable Lfsr',
  recordNoun: 'cycle',
  objectNoun: 'sequence',
  objects: [{ label: `${ROWS} cycles from reset`, records: VectorPlayer.records(loadLanes(), ROWS) }]
})
writeManifest(`${lfsrDir}/patterns/xorshift.json`, {
  testcase: 'xorshift',
  files: [{ file: 'stimulus.hex', memory: 'h.play.pattern', radix: 'h' as const, records: loads }, ...CASES.map(c => {
    const { width, outWidth } = caseWidths(c)
    const lane = caseLane(c)
    const records = writePatternFile(`${lfsrDir}/patterns/expect_${c.tag}.hex`, VectorChecker.layout([lane]), {
      dut: 'Lfsr',
      testcase: 'xorshift',
      purpose: `expected value of lfsr_${c.tag}, xorshift${width}'s low ${outWidth} bits from seed 0x${c.config.seed.toString(16)}`,
      recordNoun: 'cycle',
      objectNoun: 'sequence',
      objects: [{ label: `${ROWS} steps from reset`, records: VectorChecker.records([lane], ROWS) }]
    })
    return { file: `expect_${c.tag}.hex`, memory: `h.chk_${c.tag}.pattern`, radix: 'h' as const, records }
  })]
})

const testbenches = [
  new SimTop({
    name: 'tb_SFIFOWave_dual_port',
    harness: new SFIFOWaveHarness({
      name: 'SFIFOWave_dual_port',
      svg: SVG,
      config: SFIFO_CONFIG,
      stimulus: 'patterns/stimulus.hex',
      expected: 'patterns/expected.hex'
    }),
    maxCycles: 100
  }),
  new SimTop({ name: 'tb_Lfsr', harness: new LfsrHarness({ name: 'LfsrHarness', patterns: 'patterns' }), maxCycles: 100 })
]

for (const tb of testbenches) {
  const files = tb.writeSystemVerilogFiles(`${OUT}/${tb.name}`)
  console.log(`${tb.name}: wrote ${files.length} files and its patterns to sv-examples/tb/${tb.name}/`)
}

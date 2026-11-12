// SFIFOWave, a cycle-table testbench that the testbench generator builds (TSSV#223;
// doc/framework/testbench.md, "Configurations, testcases and the generator"). The runner writes
// the configuration and the testcase as files, and the generator builds the testbench, preloaded,
// as a cycle table is, under sv-examples/tb/SFIFO/SFIFOWave/:
//
//   - configurations/depth4.json: the SFIFO the diagrams are drawn for, 4 deep and 8 bits wide,
//     for the diagram's letter labels, with both table memories 16 deep;
//   - testcases/dual_port/: the SFIFO spec's dual-port timing diagram, as the player's stimulus
//     and the checker's expected values (sfifoWaveTable()).
//
// One run, listed in regression.txt. verilatorTB/Makefile's tb_regression_sim builds and runs it.
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { writeManifest, writePatternFile, type PatternFileContent } from 'tssv/lib/tb/patternFile'
import { type PatternRecord } from 'tssv/lib/tb/patternRecord'
import { writeConfiguration } from 'tssv/lib/tb/testbenchConfiguration'
import { generateTestbenches } from 'tssv/lib/tb/testbenchGenerator'
import { VectorPlayer } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'
import { SFIFOWaveHarness, sfifoWaveParameters, sfifoWaveTable, type SFIFOWaveParameters } from './SFIFOWaveHarness.js'
import { rmSync } from 'fs'

const OUT = `${TSSV_ROOT}/sv-examples/tb`
const DIR = `${OUT}/SFIFO/SFIFOWave`
rmSync(DIR, { recursive: true, force: true })

// The configuration: the SFIFO, and memories deep enough for any of the spec's diagrams
const SFIFO: SFIFOWaveParameters = { dataWidth: 8, depth: 4 }
const configuration = `${DIR}/configurations/depth4.json`
writeConfiguration(configuration, {
  configuration: 'depth4',
  parameters: { ...SFIFO },
  depths: { 'h.play.pattern': 16, 'h.chk.pattern': 16 },
  maxCycles: 100
})

// The testcase: the dual-port diagram, its input lanes for the player and its output lanes for the checker
const SVG = 'SFIFO-timing-dual-port.svg'
const dir = `${DIR}/testcases/dual_port`
const table = sfifoWaveTable(SVG, SFIFO)
const content = (purpose: string, records: PatternRecord[]): PatternFileContent =>
  ({ dut: 'SFIFO', testcase: 'dual_port', purpose, recordNoun: 'cycle', objectNoun: 'diagram', objects: [{ label: SVG, records }] })
const stimulus = writePatternFile(`${dir}/stimulus.hex`, VectorPlayer.layout(table.driven),
  content(`stimulus from ${SVG}`, VectorPlayer.records(table.driven, table.cycles)))
const expected = writePatternFile(`${dir}/expected.hex`, VectorChecker.layout(table.checked),
  content(`expected values from ${SVG}`, VectorChecker.records(table.checked, table.cycles)))
writeManifest(`${dir}/dual_port.json`, {
  testcase: 'dual_port',
  files: [
    { file: 'stimulus.hex', memory: 'h.play.pattern', radix: 'h', records: stimulus },
    { file: 'expected.hex', memory: 'h.chk.pattern', radix: 'h', records: expected }
  ]
})

const runs = generateTestbenches({
  dut: 'SFIFO',
  testbench: 'SFIFOWave',
  outRoot: OUT,
  configurations: [configuration],
  testcases: [`${dir}/dual_port.json`],
  modes: ['preloaded'],
  parameters: sfifoWaveParameters,
  harness: build => new SFIFOWaveHarness(build)
})
for (const r of runs) console.log(`${r.mode} ${r.configuration} ${r.testcase}: ${r.top}, run in sv-examples/tb/SFIFO/SFIFOWave/${r.runDir}/`)

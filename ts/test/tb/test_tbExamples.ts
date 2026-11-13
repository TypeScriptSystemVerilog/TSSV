// Example testbenches built on tier 1 alone (doc/framework/testbench.md): each is a SimTop over a
// harness, written to sv-examples/tb/<testbench>/, with its testcase's pattern files and manifest
// in patterns/ beside it. verilatorTB/Makefile's tb_examples_sim checks each harness with
// scripts/check-harness.mjs, then builds each testbench and runs it from its folder, where the
// harness's $readmemh paths (patterns/<file>) lead. The examples that the testbench generator
// builds instead are in test_SliceOrderTB.ts, test_SliceCycleTB.ts, test_SFIFOWaveTB.ts and
// test_loadBusTB.ts.
//
//   - tb_LFSR checks the LFSR module against its model, LFSRModel, for several polynomials,
//     widths and advances (LFSRHarness.ts). Its expected values are written from the model, and
//     the loads its loadable case sees from LOADS.
//   - tb_RecordStream_* drive small valid/ready DUTs with RecordInjectors and check them with
//     RecordCheckers (RecordStreamHarness.ts): sources (perSource) and tied (two tied inOrder
//     checkers). The inOrder example with LFSR payloads and TrafficPhases, SliceOrder, and the
//     cycleExact one, SliceCycle, are built by the testbench generator instead.
//   - tb_AFIFOStream_two_domains carries a record stream through an AFIFO from one clock domain
//     to another (AFIFOStreamHarness.ts): the example of a harness with two domains.
import { TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { SimTop } from 'tssv/lib/tb/SimTop'
import { VectorPlayer } from 'tssv/lib/tb/VectorPlayer'
import { VectorChecker } from 'tssv/lib/tb/VectorChecker'
import { writeManifest, writePatternFile, type ManifestFile, type PatternFileContent, type PatternObject } from 'tssv/lib/tb/patternFile'
import { type RecordLayout } from 'tssv/lib/tb/patternRecord'
import { checkerLayout, injectorLayout } from 'tssv/lib/tb/recordStream'
import {
  MergeSourcesHarness, MERGE_FIELDS, MERGE_LFSR, SplitTiedHarness, SPLIT_FIELDS, mergeTestcase, splitExpected, splitTestcase, withoutSource
} from './RecordStreamHarness.js'
import { AFIFOStreamHarness, AFIFO_FIELDS, afifoTestcase } from './AFIFOStreamHarness.js'
import { LFSRHarness, CASES, ROWS, caseDescription, caseLane, loadLanes } from './LFSRHarness.js'
import { rmSync } from 'fs'

const OUT = `${TSSV_ROOT}/sv-examples/tb`

// ---- tb_LFSR: the loads, and each case's expected values from the model
const lfsrDir = `${OUT}/tb_LFSR`
rmSync(lfsrDir, { recursive: true, force: true })
const loads = writePatternFile(`${lfsrDir}/patterns/stimulus.hex`, VectorPlayer.layout(loadLanes()), {
  dut: 'LFSR',
  testcase: 'sequence',
  purpose: 'load and seed_in of each loadable LFSR',
  recordNoun: 'cycle',
  objectNoun: 'sequence',
  objects: [{ label: `${ROWS} cycles from reset`, records: VectorPlayer.records(loadLanes(), ROWS) }]
})
writeManifest(`${lfsrDir}/patterns/sequence.json`, {
  testcase: 'sequence',
  files: [{ file: 'stimulus.hex', memory: 'h.play.pattern', radix: 'h' as const, records: loads }, ...CASES.map(c => {
    const lane = caseLane(c)
    const records = writePatternFile(`${lfsrDir}/patterns/expect_${c.tag}.hex`, VectorChecker.layout([lane]), {
      dut: 'LFSR',
      testcase: 'sequence',
      purpose: `expected value of lfsr_${c.tag}: ${caseDescription(c)}`,
      recordNoun: 'cycle',
      objectNoun: 'sequence',
      objects: [{ label: `${ROWS} steps from reset`, records: VectorChecker.records([lane], ROWS) }]
    })
    return { file: `expect_${c.tag}.hex`, memory: `h.chk_${c.tag}.pattern`, radix: 'h' as const, records }
  })]
})

// ---- tb_RecordStream_*: each writes its pattern files and manifest, then its testbench

/**
 * One pattern file of a record-stream testcase: its name, the memory it loads, and its content,
 * which is records in packets unless it says otherwise
 */
interface StreamFile {
  file: string
  memory: string
  layout: RecordLayout
  purpose: string
  objects: PatternObject[]
  recordNoun?: string
  objectNoun?: string
}

/** Writes a testcase's files and manifest into `<tb>/patterns/`, and returns the manifest's entries */
function writeTestcase (tb: string, dut: string, testcase: string, files: StreamFile[]): ManifestFile[] {
  const dir = `${OUT}/${tb}`
  rmSync(dir, { recursive: true, force: true })
  const entries = files.map(f => {
    const content: PatternFileContent = {
      dut, testcase, purpose: f.purpose, recordNoun: f.recordNoun ?? 'record', objectNoun: f.objectNoun ?? 'packet', objects: f.objects
    }
    return { file: f.file, memory: f.memory, radix: 'h' as const, records: writePatternFile(`${dir}/patterns/${f.file}`, f.layout, content) }
  })
  writeManifest(`${dir}/patterns/${testcase}.json`, { testcase, files: entries })
  return entries
}

// tb_RecordStream_sources: two sources through the merge, each with a seed per packet
const SOURCE_RECORDS = 16
const sources = [0, 1].map(k => mergeTestcase(SOURCE_RECORDS, k))
writeTestcase('tb_RecordStream_sources', 'StreamMerge', 'two_sources', [0, 1].flatMap(k => [
  { file: `stimulus_${k}.hex`, memory: `h.inj_${'ab'[k] ?? ''}.pattern`, layout: injectorLayout(MERGE_FIELDS, { lfsr: MERGE_LFSR }), purpose: `stimulus from source ${k}`, objects: sources[k] ?? [] },
  { file: `expected_${k}.hex`, memory: `h.chk_m_out.pattern_${k}`, layout: checkerLayout(MERGE_FIELDS, { lfsr: MERGE_LFSR, sourceField: 'src' }), purpose: `expected on m_out from source ${k}`, objects: withoutSource(sources[k] ?? []) }
]))

// tb_RecordStream_tied: the split, its outputs tied
const TIED_RECORDS = 24
const tiedTie = { peers: 2, countWidth: Math.ceil(Math.log2(TIED_RECORDS + 1)) }
const split = splitTestcase(TIED_RECORDS)
const splitOut = [0, 1].map(dst => splitExpected(split, dst))
const tied = writeTestcase('tb_RecordStream_tied', 'StreamSplit', 'interleaved', [
  { file: 'stimulus.hex', memory: 'h.inj_s_in.pattern', layout: injectorLayout(SPLIT_FIELDS), purpose: 'stimulus for s_in', objectNoun: 'sequence', objects: [{ label: 'in input order', records: split }] },
  ...[0, 1].map(dst => ({
    file: `expected_${'ab'[dst] ?? ''}.hex`,
    memory: `h.chk_out_${'ab'[dst] ?? ''}.pattern`,
    layout: checkerLayout(SPLIT_FIELDS, { tie: tiedTie }),
    purpose: `expected on out_${'ab'[dst] ?? ''}, each after the records sent to the other output before it`,
    objectNoun: 'sequence',
    objects: [{ label: 'in input order', records: splitOut[dst] ?? [] }]
  }))
])

// tb_AFIFOStream_two_domains: the AFIFO, from the write domain to the read domain
const AFIFO_RECORDS = 40
const afifo = afifoTestcase(AFIFO_RECORDS)
writeTestcase('tb_AFIFOStream_two_domains', 'AFIFO', 'two_domains', [
  { file: 'stimulus.hex', memory: 'h.inj_wr.pattern', layout: injectorLayout(AFIFO_FIELDS), purpose: 'stimulus for the write side', objects: afifo },
  { file: 'expected.hex', memory: 'h.chk_rd.pattern', layout: checkerLayout(AFIFO_FIELDS), purpose: 'expected on the read side: the packets as sent', objects: afifo }
])

const testbenches = [
  new SimTop({ name: 'tb_LFSR', harness: new LFSRHarness({ name: 'LFSRHarness', patterns: 'patterns' }), maxCycles: ROWS + 40 }),
  new SimTop({
    name: 'tb_RecordStream_sources',
    harness: new MergeSourcesHarness({
      name: 'RecordStream_sources', records: SOURCE_RECORDS, stimulus: ['patterns/stimulus_0.hex', 'patterns/stimulus_1.hex'], expected: ['patterns/expected_0.hex', 'patterns/expected_1.hex']
    }),
    maxCycles: 500
  }),
  new SimTop({
    name: 'tb_RecordStream_tied',
    harness: new SplitTiedHarness({
      name: 'RecordStream_tied',
      records: TIED_RECORDS,
      stimulus: 'patterns/stimulus.hex',
      expected: ['patterns/expected_a.hex', 'patterns/expected_b.hex'],
      expectedRecords: [tied[1]?.records ?? 0, tied[2]?.records ?? 0]
    }),
    maxCycles: 500
  }),
  new SimTop({
    name: 'tb_AFIFOStream_two_domains',
    harness: new AFIFOStreamHarness({ name: 'AFIFOStream_two_domains', records: AFIFO_RECORDS, stimulus: 'patterns/stimulus.hex', expected: 'patterns/expected.hex' }),
    maxCycles: 1000
  })
]

for (const tb of testbenches) {
  const files = tb.writeSystemVerilogFiles(`${OUT}/${tb.name}`)
  console.log(`${tb.name}: wrote ${files.length} files and its patterns to sv-examples/tb/${tb.name}/`)
}

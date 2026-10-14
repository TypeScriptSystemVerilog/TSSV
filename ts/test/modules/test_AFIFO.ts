// Generate AFIFO variants and the inputs for verilatorTB/tb_AFIFO.sv:
//
// 1. Self-checks against the spec: ports for every combination of the almost flags, distinct
//    module names, every depth and a 1026-bit width, ASYNC_REG on every synchronizer flop, each
//    module in its own file, fpgaRamStyle reaching the storage, and the invalid parameters that
//    throw.
// 2. The testbench configurations (TB_CONFIGS), each emitted one module per file with a lint
//    filelist (emitSplit), plus sv-examples/AFIFO/tb/:
//    - AFIFO_tb_configs.svh: per-configuration DUT name, width, depth, syncStages and flags
//    - AFIFO_tb_vectors.svh: one task per timing diagram in the spec
//    - configs.txt: "<config> <.sv paths>" per line, read by `make afifo_sim`
//
// Run `make -C verilatorTB afifo_sim` to generate everything, lint each variant with -Wall and
// simulate each configuration.

import { AFIFO, type AFIFO_Parameters } from 'tssv/lib/modules/AFIFO'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { emitSplit } from '../models/emitSplit.js'
import { diagramTasks } from '../models/wavedromVectors.js'

const SPEC = 'doc/modules/AFIFO/AFIFO-spec.md'
const OUT = 'sv-examples/AFIFO'
const TB_DIR = `${OUT}/tb`
const GENERATOR = 'ts/test/modules/test_AFIFO.ts'

let passed = 0
let failed = 0

function check (label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}${detail !== undefined ? `\n  ${detail}` : ''}`)
    failed++
  }
}

function expectThrow (label: string, fn: () => unknown, message: string): void {
  try {
    fn()
    check(label, false, 'did not throw')
  } catch (e) {
    const got = (e instanceof Error) ? e.message : String(e)
    check(label, got.includes(message), `expected a message containing '${message}', got '${got}'`)
  }
}

/** emit an AFIFO one module per file under sv-examples/AFIFO/<name>/ and return the paths, the AFIFO's last */
const emit = (f: AFIFO): string[] => emitSplit(f, `${OUT}/${f.name}`, GENERATOR)
const portsOf = (f: AFIFO): string => Object.keys((f as unknown as { IOs: Record<string, unknown> }).IOs).sort().join(' ')
const fileOf = (files: string[], module: string): string => {
  const path = files.find(p => p.endsWith(`/${module}.sv`))
  return path === undefined ? '' : readFileSync(path, 'utf8')
}

// ============================================ 1. checks against the spec
const ALWAYS_PORTS = ['wr_clk', 'wr_rst_n', 'push_en', 'push_data', 'full', 'wr_curr_depth',
  'rd_clk', 'rd_rst_n', 'pop_en', 'pop_data', 'empty', 'rd_curr_depth']
for (const inclAlmostFull of [false, true]) {
  for (const inclAlmostEmpty of [false, true]) {
    const f = new AFIFO({ dataWidth: 8n, depth: 4n, inclAlmostFull, inclAlmostEmpty })
    emit(f)
    const want = [...ALWAYS_PORTS,
      ...(inclAlmostFull ? ['almost_full_depth', 'almost_full'] : []),
      ...(inclAlmostEmpty ? ['almost_empty_depth', 'almost_empty'] : [])].sort().join(' ')
    check(`${f.name}: ports match the spec`, portsOf(f) === want, `got: ${portsOf(f)}\n  spec: ${want}`)
  }
}

const variants: AFIFO_Parameters[] = [
  { dataWidth: 8n, depth: 4n },
  { dataWidth: 9n, depth: 4n },
  { dataWidth: 8n, depth: 8n },
  { dataWidth: 8n, depth: 4n, syncStages: 3n },
  { dataWidth: 8n, depth: 4n, inclAlmostFull: true },
  { dataWidth: 8n, depth: 4n, inclAlmostEmpty: true },
  { dataWidth: 8n, depth: 4n, fpgaRamStyle: 'distributed' },
  { dataWidth: 8n, depth: 4n, fpgaRamStyle: 'block' }
]
const names = variants.map(p => new AFIFO(p).name)
check(`AFIFOs that differ in any parameter get different names (${names.join(', ')})`, new Set(names).size === names.length)
check('the default name is AFIFO_<dataWidth>_<depth>_<syncStages>_<inclAlmostFull>_<inclAlmostEmpty>',
  names[0] === 'AFIFO_8_4_2_false_false' &&
  new AFIFO({ dataWidth: 8n, depth: 4n, syncStages: 2n, inclAlmostFull: false, inclAlmostEmpty: false }).name === names[0])

for (const depth of [4n, 8n, 16n, 32n]) {
  for (const syncStages of [2n, 3n]) {
    const f = new AFIFO({ dataWidth: 8n, depth, syncStages })
    const files = emit(f)
    const ptrWidth = depth.toString(2).length
    const cdc = `CDCSynchronizer_${ptrWidth}_${syncStages}`
    const gp = `GrayPointer_${ptrWidth}_${syncStages}`
    const rf = `TwoClockRegFile_8_${depth}`
    const want = [cdc, gp, rf, f.name].map(m => `${m}.sv`).sort().join(' ')
    const got = files.map(p => p.split('/').pop() ?? '').sort().join(' ')
    check(`${f.name}: depth ${depth} generates, one module per file`, got === want, `got: ${got}\n  want: ${want}`)
    for (const path of files) {
      const modules = (readFileSync(path, 'utf8').match(/^module /gm) ?? []).length
      if (modules !== 1) check(`${path} defines exactly one module`, false, `it defines ${modules}`)
    }
    // every flop in each synchronizer carries ASYNC_REG: the pointers cross only through cdc
    const marked = [...fileOf(files, cdc).matchAll(/\(\* ASYNC_REG = "TRUE" \*\)\s*logic \[\d+:0\] (sync_\d+);/g)].map(m => m[1])
    const stages = Array.from({ length: Number(syncStages) }, (_, i) => `sync_${i}`)
    check(`${f.name}: every flop in ${cdc} (sync_0 to sync_${syncStages - 1n}) carries ASYNC_REG`,
      marked.join(' ') === stages.join(' '), `got: ${marked.join(' ')}`)
    check(`${f.name}: both pointers cross through ${cdc}`,
      (fileOf(files, f.name).match(new RegExp(`^\\s*${gp} u_(wr|rd)_ptr`, 'gm')) ?? []).length === 2 &&
      fileOf(files, gp).includes(`${cdc} u_sync`))
  }
}

const wide = new AFIFO({ dataWidth: 1026n, depth: 32n })
check('dataWidth 1026, depth 32 generates', fileOf(emit(wide), wide.name).includes('output logic [1025:0] pop_data'))

const styled = new AFIFO({ dataWidth: 8n, depth: 4n, fpgaRamStyle: 'distributed' })
check("fpgaRamStyle 'distributed' reaches the storage's ram_style attribute",
  fileOf(emit(styled), 'TwoClockRegFile_8_4_distributed').includes('(* ram_style = "distributed" *)'))

expectThrow('depth 2 throws', () => new AFIFO({ dataWidth: 8n, depth: 2n }), 'AFIFO: depth must be 4, 8, 16 or 32, got 2')
expectThrow('depth 6 throws', () => new AFIFO({ dataWidth: 8n, depth: 6n }), 'AFIFO: depth must be 4, 8, 16 or 32, got 6')
expectThrow('depth 64 throws', () => new AFIFO({ dataWidth: 8n, depth: 64n }), 'AFIFO: depth must be 4, 8, 16 or 32, got 64')
expectThrow('dataWidth 0 throws', () => new AFIFO({ dataWidth: 0n, depth: 4n }), 'AFIFO: dataWidth must be at least 1, got 0')
expectThrow('syncStages 1 throws', () => new AFIFO({ dataWidth: 8n, depth: 4n, syncStages: 1n }), 'AFIFO: syncStages must be at least 2, got 1')
expectThrow('an unlisted fpgaRamStyle throws',
  () => new AFIFO({ dataWidth: 8n, depth: 4n, fpgaRamStyle: 'ultra' as unknown as 'block' }),
  "AFIFO: fpgaRamStyle must be 'distributed' or 'block', got 'ultra'")

// ============================================ 2. testbench configurations
interface TbConfig {
  cfg: string
  dataWidth: bigint
  depth: bigint
  syncStages: bigint
  /** both almost flags, or neither */
  flags: boolean
  /** timing diagrams (SVG names in the spec, without the AFIFO- prefix) to replay */
  diagrams: string[]
  /** run the throughput test (Test Plan: d8 only) */
  throughput: boolean
}

const BOTH_DIAGRAMS = ['timing-fill-drain', 'timing-almost-flags']
const TB_CONFIGS: TbConfig[] = [
  { cfg: 'd4_flags', dataWidth: 8n, depth: 4n, syncStages: 2n, flags: true, diagrams: BOTH_DIAGRAMS, throughput: false },
  { cfg: 'd8', dataWidth: 8n, depth: 8n, syncStages: 2n, flags: false, diagrams: [], throughput: true },
  { cfg: 'd16_s3_flags', dataWidth: 8n, depth: 16n, syncStages: 3n, flags: true, diagrams: [], throughput: false },
  { cfg: 'd32', dataWidth: 8n, depth: 32n, syncStages: 2n, flags: false, diagrams: [], throughput: false },
  // tssv-noc's wide_data channel plus head and tail
  { cfg: 'd4_flags_w1026', dataWidth: 1026n, depth: 4n, syncStages: 2n, flags: true, diagrams: BOTH_DIAGRAMS, throughput: false }
]

mkdirSync(TB_DIR, { recursive: true })
const header = `// Generated by ${GENERATOR}. Do not edit.\n`
let configs = header
const configList: string[] = []
TB_CONFIGS.forEach((c, i) => {
  const f = new AFIFO({
    dataWidth: c.dataWidth,
    depth: c.depth,
    syncStages: c.syncStages,
    inclAlmostFull: c.flags,
    inclAlmostEmpty: c.flags
  })
  configList.push(`${c.cfg} ${emit(f).join(' ')}`)
  configs += `\`${i === 0 ? 'ifdef' : 'elsif'} CFG_${c.cfg}\n`
  configs += `  \`define CFG_NAME "${c.cfg}"\n`
  configs += `  \`define AFIFO_DUT ${f.name}\n`
  configs += `  \`define DATA_WIDTH ${c.dataWidth}\n`
  configs += `  \`define DEPTH ${c.depth}\n`
  configs += `  \`define SYNC_STAGES ${c.syncStages}\n`
  if (c.flags) configs += '  `define HAS_FLAGS\n'
  configs += `  \`define THROUGHPUT ${c.throughput ? 1 : 0}\n`
  configs += `  \`define RUN_DIAGRAMS ${c.diagrams.map(d => `diagram_${d.replace(/-/g, '_')}();`).join(' ')}\n`
  console.log(`${f.name}: testbench config ${c.cfg}`)
})
configs += '`else\n  `error "define one of the CFG_<config> macros"\n`endif\n'
writeFileSync(`${TB_DIR}/AFIFO_tb_configs.svh`, configs)
writeFileSync(`${TB_DIR}/configs.txt`, configList.join('\n') + '\n')

// ============================================ 3. timing-diagram vectors
// wr_clk is the fast clock and rd_clk the slow one, in the struct field order tb_AFIFO.sv
// declares. A lane a diagram leaves out (the thresholds in the first, the data in the second)
// is ABSENT.
const { sv: vectors, names: diagrams } = diagramTasks(SPEC, 'AFIFO',
  { clock: 'wr_clk', type: 'wr_vec_t', fields: ['push_en', 'push_data', 'almost_full_depth', 'full', 'wr_curr_depth', 'almost_full'] },
  { clock: 'rd_clk', type: 'rd_vec_t', fields: ['pop_en', 'almost_empty_depth', 'pop_data', 'empty', 'rd_curr_depth', 'almost_empty'] })
for (const c of TB_CONFIGS) {
  for (const d of c.diagrams) check(`${c.cfg}: the spec has diagram AFIFO-${d}.svg`, diagrams.includes(d))
}
writeFileSync(`${TB_DIR}/AFIFO_tb_vectors.svh`, header + vectors)
console.log(`${diagrams.length} timing diagram(s) from ${SPEC} written to ${TB_DIR}/AFIFO_tb_vectors.svh`)

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

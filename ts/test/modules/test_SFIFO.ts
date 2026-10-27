// Generate the SFIFO variants and the inputs for verilatorTB/tb_SFIFO.sv:
//
// 1. Every combination of simultPushPop, inclAlmostFull and inclAlmostEmpty, checking each
//    one's ports against the spec's IO tables.
// 2. The testbench configurations (TB_CONFIGS), plus sv-examples/SFIFO/tb/:
//    - SFIFO_tb_configs.svh: per-configuration DUT name, depth and port options
//    - SFIFO_tb_vectors.svh: one task per timing diagram in the spec, built from the
//      diagram's WaveDrom JSON so the testbench checks exactly what the spec shows
//    - configs.txt: "<config> <top .sv path>" per line, read by `make sfifo_sim`
//
// Each FIFO is emitted one module per file (writeSystemVerilogFiles()); its own file includes the
// SRAM's under USE_INCLUDES.
// Run `make -C verilatorTB sfifo_sim` to generate everything, lint each variant with -Wall and
// simulate each configuration.

import { SFIFO } from 'tssv/lib/modules/SFIFO'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'

const SPEC = 'doc/modules/SFIFO/SFIFO-spec.md'
const TB_DIR = 'sv-examples/SFIFO/tb'
const DATA_WIDTH = 8n

/** write a FIFO one module per file under sv-examples/SFIFO/<name>/ and return the path of its own file */
function emit (fifo: SFIFO): string {
  return fifo.writeSystemVerilogFiles(`sv-examples/SFIFO/${fifo.name}`).at(-1) ?? ''
}

/** the port list the spec's IO tables give for a configuration */
function specPorts (simult: boolean, almostFull: boolean, almostEmpty: boolean): string[] {
  const ports = ['clk', 'rst_n', 'push_data', 'pop_data', 'empty', 'full', 'curr_depth']
  ports.push(...(simult ? ['push_en', 'pop_en'] : ['en', 'push1_pop0']))
  if (almostFull) ports.push('almost_full_depth', 'almost_full')
  if (almostEmpty) ports.push('almost_empty_depth', 'almost_empty')
  return ports.sort()
}

// ============================================ 1. every port combination
for (const simult of [true, false]) {
  for (const almostFull of [false, true]) {
    for (const almostEmpty of [false, true]) {
      const fifo = new SFIFO({ dataWidth: DATA_WIDTH, depth: 5n, simultPushPop: simult, inclAlmostFull: almostFull, inclAlmostEmpty: almostEmpty })
      const got = Object.keys((fifo as unknown as { IOs: Record<string, unknown> }).IOs).sort().join(' ')
      const want = specPorts(simult, almostFull, almostEmpty).join(' ')
      if (got !== want) throw Error(`${fifo.name} ports\n  got:  ${got}\n  spec: ${want}`)
      emit(fifo)
      console.log(`${fifo.name}: ports match the spec`)
    }
  }
}

// ============================================ the SRAM's parameters, rippled up
// macroConfig and minMacroBits reach the storage SRAM (its parameter comment shows them), and a
// depth-1 FIFO, which builds no SRAM, still rejects a minMacroBits the SRAM would
{
  const fifo = new SFIFO({ dataWidth: DATA_WIDTH, depth: 4n, macroConfig: 'hd', minMacroBits: 2048n })
  emit(fifo)
  const { submodules } = fifo as unknown as { submodules: Record<string, { module: { name: string } }> }
  const sv = readFileSync(`sv-examples/SFIFO/${fifo.name}/${submodules.u_sram?.module.name ?? ''}.sv`, 'utf8')
  for (const want of ['// macroConfig = hd', '// minMacroBits = 2048n']) {
    if (!sv.includes(want)) throw Error(`${fifo.name}: its SRAM's parameters don't include "${want}"`)
  }
  console.log(`${fifo.name}: macroConfig and minMacroBits reach the SRAM`)
  let message = ''
  try {
    void new SFIFO({ dataWidth: DATA_WIDTH, depth: 1n, minMacroBits: 31n })
  } catch (e) {
    message = e instanceof Error ? e.message : String(e)
  }
  if (message !== 'SFIFO: minMacroBits must be at least 32, got 31') throw Error(`depth-1 SFIFO with minMacroBits 31: got "${message}"`)
  console.log('a depth-1 SFIFO rejects minMacroBits 31')
}

// ============================================ 2. testbench configurations
interface TbConfig {
  cfg: string
  dataWidth: bigint
  depth: bigint
  simultPushPop: boolean
  inclAlmostFull: boolean
  inclAlmostEmpty: boolean
  /** timing diagrams (SVG names in the spec, without the SFIFO-timing- prefix) to replay */
  diagrams: string[]
}

const TB_CONFIGS: TbConfig[] = [
  { cfg: 'd8_dual_flags', dataWidth: DATA_WIDTH, depth: 8n, simultPushPop: true, inclAlmostFull: true, inclAlmostEmpty: true, diagrams: [] },
  { cfg: 'd4_dual_flags', dataWidth: DATA_WIDTH, depth: 4n, simultPushPop: true, inclAlmostFull: true, inclAlmostEmpty: true, diagrams: ['dual-port', 'almost-flags'] },
  { cfg: 'd4_single', dataWidth: DATA_WIDTH, depth: 4n, simultPushPop: false, inclAlmostFull: false, inclAlmostEmpty: false, diagrams: ['single-port'] },
  { cfg: 'd5_single_flags', dataWidth: DATA_WIDTH, depth: 5n, simultPushPop: false, inclAlmostFull: true, inclAlmostEmpty: true, diagrams: [] },
  { cfg: 'd1_dual', dataWidth: DATA_WIDTH, depth: 1n, simultPushPop: true, inclAlmostFull: false, inclAlmostEmpty: false, diagrams: [] },
  // wider than the old 256-bit limit: tssv-noc's wide_data channel plus head and tail
  { cfg: 'd4_dual_flags_w1026', dataWidth: 1026n, depth: 4n, simultPushPop: true, inclAlmostFull: true, inclAlmostEmpty: true, diagrams: ['dual-port', 'almost-flags'] }
]

mkdirSync(TB_DIR, { recursive: true })
const header = `// Generated by ts/test/modules/test_SFIFO.ts. Do not edit.\n`
let configs = header
const configList: string[] = []
TB_CONFIGS.forEach((c, i) => {
  const fifo = new SFIFO({ dataWidth: c.dataWidth, depth: c.depth, simultPushPop: c.simultPushPop, inclAlmostFull: c.inclAlmostFull, inclAlmostEmpty: c.inclAlmostEmpty })
  configList.push(`${c.cfg} ${emit(fifo)}`)
  configs += `\`${i === 0 ? 'ifdef' : 'elsif'} CFG_${c.cfg}\n`
  configs += `  \`define CFG_NAME "${c.cfg}"\n`
  configs += `  \`define SFIFO_DUT ${fifo.name}\n`
  configs += `  \`define DATA_WIDTH ${c.dataWidth}\n`
  configs += `  \`define DEPTH ${c.depth}\n`
  if (c.simultPushPop) configs += '  `define SIMULT\n'
  if (c.inclAlmostFull) configs += '  `define ALMOST_FULL\n'
  if (c.inclAlmostEmpty) configs += '  `define ALMOST_EMPTY\n'
  configs += `  \`define RUN_DIAGRAMS ${c.diagrams.map(d => `diagram_${d.replace(/-/g, '_')}();`).join(' ')}\n`
  console.log(`${fifo.name}: testbench config ${c.cfg}`)
})
configs += '`else\n  `error "define one of the CFG_<config> macros"\n`endif\n'
writeFileSync(`${TB_DIR}/SFIFO_tb_configs.svh`, configs)
writeFileSync(`${TB_DIR}/configs.txt`, configList.join('\n') + '\n')

// ============================================ 3. timing-diagram vectors
// vec_t field order in tb_SFIFO.sv. ABSENT: the signal isn't in the diagram (input left at
// its default, output not checked). DONT_CARE: 'x' in the diagram (input randomized,
// output not checked).
const FIELDS = ['rst_n', 'push_en', 'pop_en', 'en', 'push1_pop0', 'push_data', 'almost_full_depth', 'almost_empty_depth',
  'pop_data', 'empty', 'full', 'curr_depth', 'almost_full', 'almost_empty']
const ABSENT = -2
const DONT_CARE = -1

interface Lane { name?: string, wave?: string, data?: string[] | string }

/** a data label as a number: decimal digits as-is, a single letter as its character code */
function labelValue (label: string, where: string): number {
  if (/^\d+$/.test(label)) return Number(label)
  if (/^[A-Za-z]$/.test(label)) return label.charCodeAt(0)
  throw Error(`${where}: data label "${label}" is neither a number nor a single letter`)
}

/** expand a lane's wave into one value per cycle */
function expandLane (lane: Lane, where: string): number[] {
  const data = typeof lane.data === 'string' ? lane.data.split(/\s+/) : (lane.data ?? [])
  let next = 0
  let prev: number | undefined
  const values: number[] = []
  for (const ch of lane.wave ?? '') {
    if (ch === '.') {
      if (prev === undefined) throw Error(`${where}: wave starts with '.'`)
    } else if (ch === '0' || ch === '1') {
      prev = Number(ch)
    } else if (ch === 'x') {
      prev = DONT_CARE
    } else if (ch === '=' || /[2-9]/.test(ch)) {
      const label = data[next++]
      if (label === undefined) throw Error(`${where}: more data bricks than data labels`)
      prev = labelValue(label, where)
    } else {
      throw Error(`${where}: unsupported wave character '${ch}'`)
    }
    values.push(prev)
  }
  return values
}

const spec = readFileSync(SPEC, 'utf8')
let vectors = header
let diagrams = 0
for (const m of spec.matchAll(/<!-- wavedrom SFIFO-timing-(\S+)\.svg\n([\s\S]*?)\n-->/g)) {
  const [, name, json] = m
  if (name === undefined || json === undefined) continue
  const lanes = (JSON.parse(json) as { signal: Lane[] }).signal
  const perField = new Map<string, number[]>()
  let cycles = 0
  for (const lane of lanes) {
    if (lane.name === undefined || lane.name === 'clk') continue
    if (!FIELDS.includes(lane.name)) throw Error(`${SPEC} ${name}: signal ${lane.name} is not an SFIFO port`)
    const values = expandLane(lane, `${SPEC} ${name} ${lane.name}`)
    if (cycles !== 0 && values.length !== cycles) throw Error(`${SPEC} ${name}: ${lane.name} has ${values.length} cycles, expected ${cycles}`)
    cycles = values.length
    perField.set(lane.name, values)
  }
  const rows: string[] = []
  for (let k = 0; k < cycles; k++) {
    rows.push(`    '{${FIELDS.map(f => perField.get(f)?.[k] ?? ABSENT).join(', ')}}`)
  }
  vectors += `
// ${name}: ${cycles} cycles. Fields: ${FIELDS.join(', ')}
task automatic diagram_${name.replace(/-/g, '_')}();
  vec_t v[${cycles}] = '{
${rows.join(',\n')}
  };
  run_vectors("${name}", v);
endtask
`
  diagrams++
}
for (const c of TB_CONFIGS) {
  for (const d of c.diagrams) {
    if (!vectors.includes(`task automatic diagram_${d.replace(/-/g, '_')}()`)) throw Error(`${c.cfg}: no diagram SFIFO-timing-${d}.svg in ${SPEC}`)
  }
}
writeFileSync(`${TB_DIR}/SFIFO_tb_vectors.svh`, vectors)
console.log(`${diagrams} timing diagrams from ${SPEC} written to ${TB_DIR}/SFIFO_tb_vectors.svh`)

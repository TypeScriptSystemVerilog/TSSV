// Generate TwoClockRegFile variants and the inputs for verilatorTB/tb_TwoClockRegFile.sv:
//
// 1. Self-checks against the spec: ports, the ram_style attribute for each fpgaRamStyle,
//    distinct module names, a 1026 x 32 register file, and the invalid parameters that throw.
// 2. The testbench configurations (TB_CONFIGS), plus sv-examples/TwoClockRegFile/tb/:
//    - TwoClockRegFile_tb_configs.svh: per-configuration DUT name, width and depth
//    - TwoClockRegFile_tb_vectors.svh: one task per timing diagram in the spec, built from
//      the diagram's WaveDrom JSON so the testbench checks exactly what the spec shows
//    - configs.txt: "<config> <DUT .sv path>" per line, read by `make twoclockregfile_sim`
//
// Run `make -C verilatorTB twoclockregfile_sim` to generate everything, lint each variant
// with -Wall and simulate each configuration.

import { TwoClockRegFile, type TwoClockRegFile_Parameters } from 'tssv/lib/modules/TwoClockRegFile'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'

const SPEC = 'doc/modules/TwoClockRegFile/TwoClockRegFile-spec.md'
const OUT = 'sv-examples/TwoClockRegFile'
const TB_DIR = `${OUT}/tb`

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

/** write a register file's SV under sv-examples/TwoClockRegFile/<name>/ and return its own file's text and path */
function emit (rf: TwoClockRegFile): { sv: string, path: string } {
  const path = rf.writeSystemVerilogFiles(`${OUT}/${rf.name}`).at(-1) ?? ''
  return { sv: readFileSync(path, 'utf8'), path }
}

// ============================================ 1. checks against the spec
const SPEC_PORTS = ['a_clk', 'a_we', 'a_addr', 'a_data_in', 'b_clk', 'b_re', 'b_addr', 'b_data_out'].sort().join(' ')
const STYLES: Array<TwoClockRegFile_Parameters['fpgaRamStyle']> = [undefined, 'distributed', 'block']

/** the SV with the module name, the ram_style attribute and fpgaRamStyle's parameter comment taken out */
const withoutStyle = (sv: string, name: string): string =>
  sv.split(name).join('DUT').replace(/\(\* ram_style = "\w+" \*\) /, '').replace(/^.*\/\/ fpgaRamStyle = .*\n/m, '')

let unstyled = ''
for (const style of STYLES) {
  const rf = new TwoClockRegFile({ dataWidth: 8n, depth: 4n, fpgaRamStyle: style })
  const { sv } = emit(rf)
  const tag = style ?? 'unset'
  const ports = Object.keys((rf as unknown as { IOs: Record<string, unknown> }).IOs).sort().join(' ')
  check(`fpgaRamStyle ${tag}: ports match the spec`, ports === SPEC_PORTS, `got: ${ports}\n  spec: ${SPEC_PORTS}`)
  const memLine = sv.split('\n').map(l => l.trim()).find(l => /\bmem\[0:3\];$/.test(l)) ?? '(no mem declaration)'
  const wantMem = (style === undefined) ? 'logic [7:0] mem[0:3];' : `(* ram_style = "${style}" *) logic [7:0] mem[0:3];`
  check(`fpgaRamStyle ${tag}: mem is declared as '${wantMem}'`, memLine === wantMem, `got: ${memLine}`)
  if (style === undefined) {
    unstyled = withoutStyle(sv, rf.name)
    check('fpgaRamStyle unset: no ram_style attribute anywhere', !sv.includes('ram_style'))
  } else {
    check(`fpgaRamStyle ${tag}: SV matches the unset variant apart from the attribute and the name`,
      withoutStyle(sv, rf.name) === unstyled)
  }
}

const names = [
  { dataWidth: 8n, depth: 4n },
  { dataWidth: 8n, depth: 4n, fpgaRamStyle: 'distributed' as const },
  { dataWidth: 8n, depth: 4n, fpgaRamStyle: 'block' as const },
  { dataWidth: 8n, depth: 5n },
  { dataWidth: 9n, depth: 4n },
  { dataWidth: 84n, depth: 2n }
].map(p => new TwoClockRegFile(p).name)
check(`register files that differ in any parameter get different names (${names.join(', ')})`,
  new Set(names).size === names.length)
check('the default name is TwoClockRegFile_<dataWidth>_<depth>_<fpgaRamStyle>, X when unset', names[0] === 'TwoClockRegFile_8_4_X')

const wide = new TwoClockRegFile({ dataWidth: 1026n, depth: 32n })
check('dataWidth 1026, depth 32 generates', emit(wide).sv.includes('logic [1025:0] mem[0:31];'))

expectThrow('depth 1 throws', () => new TwoClockRegFile({ dataWidth: 8n, depth: 1n }), 'depth must be 2 to 32, got 1')
expectThrow('depth 33 throws', () => new TwoClockRegFile({ dataWidth: 8n, depth: 33n }), 'depth must be 2 to 32, got 33')
expectThrow('dataWidth 0 throws', () => new TwoClockRegFile({ dataWidth: 0n, depth: 4n }), 'dataWidth must be at least 1, got 0')
expectThrow('an unlisted fpgaRamStyle throws',
  () => new TwoClockRegFile({ dataWidth: 8n, depth: 4n, fpgaRamStyle: 'ultra' as unknown as 'block' }),
  "fpgaRamStyle must be 'distributed' or 'block', got 'ultra'")

// ============================================ 2. testbench configurations
interface TbConfig {
  cfg: string
  dataWidth: bigint
  depth: bigint
  /** timing diagrams (SVG names in the spec, without the TwoClockRegFile- prefix) to replay */
  diagrams: string[]
}

const TB_CONFIGS: TbConfig[] = [
  { cfg: 'w8_d4', dataWidth: 8n, depth: 4n, diagrams: ['timing'] },
  // not a power of two: addresses 5 to 7 don't exist
  { cfg: 'w8_d5', dataWidth: 8n, depth: 5n, diagrams: [] },
  // tssv-noc's wide_data channel plus head and tail, at the AFIFO's largest depth
  { cfg: 'w1026_d32', dataWidth: 1026n, depth: 32n, diagrams: [] }
]

mkdirSync(TB_DIR, { recursive: true })
const header = '// Generated by ts/test/modules/test_TwoClockRegFile.ts. Do not edit.\n'
let configs = header
const configList: string[] = []
TB_CONFIGS.forEach((c, i) => {
  const rf = new TwoClockRegFile({ dataWidth: c.dataWidth, depth: c.depth })
  configList.push(`${c.cfg} ${emit(rf).path}`)
  configs += `\`${i === 0 ? 'ifdef' : 'elsif'} CFG_${c.cfg}\n`
  configs += `  \`define CFG_NAME "${c.cfg}"\n`
  configs += `  \`define TCRF_DUT ${rf.name}\n`
  configs += `  \`define DATA_WIDTH ${c.dataWidth}\n`
  configs += `  \`define DEPTH ${c.depth}\n`
  configs += `  \`define RUN_DIAGRAMS ${c.diagrams.map(d => `diagram_${d.replace(/-/g, '_')}();`).join(' ')}\n`
  console.log(`${rf.name}: testbench config ${c.cfg}`)
})
configs += '`else\n  `error "define one of the CFG_<config> macros"\n`endif\n'
writeFileSync(`${TB_DIR}/TwoClockRegFile_tb_configs.svh`, configs)
writeFileSync(`${TB_DIR}/configs.txt`, configList.join('\n') + '\n')

// ============================================ 3. timing-diagram vectors
// The diagrams draw b_clk at half a_clk's frequency, so lanes with "period": 2 are b_clk
// lanes and the rest are a_clk lanes. a_vec_t and b_vec_t field order in
// tb_TwoClockRegFile.sv. ABSENT: the signal isn't in the diagram (input left at 0, output not
// checked). DONT_CARE: 'x' in the diagram (input randomized, output not checked).
const A_FIELDS = ['a_we', 'a_addr', 'a_data_in']
const B_FIELDS = ['b_re', 'b_addr', 'b_data_out']
const ABSENT = -2
const DONT_CARE = -1

interface Lane { name?: string, wave?: string, data?: string[] | string, period?: number }

/** a data label as a number: decimal digits as-is, a single letter as its character code */
function labelValue (label: string, where: string): number {
  if (/^\d+$/.test(label)) return Number(label)
  if (/^[A-Za-z]$/.test(label)) return label.charCodeAt(0)
  throw Error(`${where}: data label "${label}" is neither a number nor a single letter`)
}

/** expand a lane's wave into one value per cycle of its own clock */
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

/** the vector rows for one clock's fields */
function rows (fields: string[], perField: Map<string, number[]>, cycles: number): string {
  const out: string[] = []
  for (let k = 0; k < cycles; k++) out.push(`    '{${fields.map(f => perField.get(f)?.[k] ?? ABSENT).join(', ')}}`)
  return out.join(',\n')
}

const spec = readFileSync(SPEC, 'utf8')
let vectors = header
let diagrams = 0
for (const m of spec.matchAll(/<!-- wavedrom TwoClockRegFile-(\S+)\.svg\n([\s\S]*?)\n-->/g)) {
  const [, name, json] = m
  if (name === undefined || json === undefined) continue
  const where = `${SPEC} ${name}`
  const perField = new Map<string, number[]>()
  let aCycles = 0
  let bCycles = 0
  for (const lane of (JSON.parse(json) as { signal: Lane[] }).signal) {
    // clocks are generated by the testbench; "word N" lanes show the storage, which isn't a port
    if (lane.name === undefined || lane.name === 'a_clk' || lane.name === 'b_clk' || lane.name.startsWith('word ')) continue
    const isB = B_FIELDS.includes(lane.name)
    if (!isB && !A_FIELDS.includes(lane.name)) throw Error(`${where}: signal ${lane.name} is not a TwoClockRegFile port`)
    if ((lane.period ?? 1) !== (isB ? 2 : 1)) throw Error(`${where}: ${lane.name} must have period ${isB ? 2 : 1}`)
    const values = expandLane(lane, `${where} ${lane.name}`)
    const cycles = isB ? bCycles : aCycles
    if (cycles !== 0 && values.length !== cycles) throw Error(`${where}: ${lane.name} has ${values.length} cycles, expected ${cycles}`)
    if (isB) bCycles = values.length
    else aCycles = values.length
    perField.set(lane.name, values)
  }
  if (aCycles !== 2 * bCycles) throw Error(`${where}: ${aCycles} a_clk cycles but ${bCycles} b_clk cycles; expected 2:1`)
  vectors += `
// ${name}: ${aCycles} a_clk cycles (fields: ${A_FIELDS.join(', ')}) and ${bCycles} b_clk cycles (fields: ${B_FIELDS.join(', ')})
task automatic diagram_${name.replace(/-/g, '_')}();
  a_vec_t av[${aCycles}] = '{
${rows(A_FIELDS, perField, aCycles)}
  };
  b_vec_t bv[${bCycles}] = '{
${rows(B_FIELDS, perField, bCycles)}
  };
  run_diagram("${name}", av, bv);
endtask
`
  diagrams++
}
for (const c of TB_CONFIGS) {
  for (const d of c.diagrams) {
    check(`${c.cfg}: the spec has diagram TwoClockRegFile-${d}.svg`, vectors.includes(`task automatic diagram_${d.replace(/-/g, '_')}()`))
  }
}
writeFileSync(`${TB_DIR}/TwoClockRegFile_tb_vectors.svh`, vectors)
console.log(`${diagrams} timing diagram(s) from ${SPEC} written to ${TB_DIR}/TwoClockRegFile_tb_vectors.svh`)

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

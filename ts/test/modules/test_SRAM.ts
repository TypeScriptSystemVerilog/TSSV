// Generate the SRAM variants and the inputs for verilatorTB/tb_SRAM.sv:
//
// 1. Every combination of ports, writeEnableMask and readBehavior (TB_CONFIGS), each checked
//    against the spec's IO tables, two 1026-bit SRAMs, and the parameter values the
//    constructor rejects.
// 2. sv-examples/SRAM/tb/:
//    - SRAM_tb_configs.svh: per-configuration DUT name, its port connections, sizes, options
//      and the timing diagrams it replays
//    - SRAM_tb_vectors.svh: one task per timing diagram and readBehavior in the spec, built
//      from the diagram's WaveDrom JSON so the testbench checks exactly what the spec shows
//    - configs.txt: "<config> <DUT .sv path> <defines>" per line, read by `make sram_sim`.
//      The defines turn off the SRAM assertions the configuration's random traffic breaks
//    - assert_checks.txt: "<check> <config> <DUT .sv path> <CHECK_ASSERT> <assertion>" per
//      line: tb_SRAM breaks the assertion on purpose, and `make sram_sim` checks it fires
//
// Run `make -C verilatorTB sram_sim` to generate everything, lint each variant with -Wall and
// simulate each configuration.

import { SRAM, type SRAM_Parameters } from 'tssv/lib/modules/SRAM'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { moduleSV } from '../models/emitted.js'
import { ABSENT, expandLane, type Lane } from 'tssv/lib/tb/wavedromVectors'

const SPEC = 'doc/modules/SRAM/SRAM-spec.md'
const OUT = 'sv-examples/SRAM'
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

/** write an SRAM's SV under sv-examples/SRAM/<name>/ and return the path of its own file */
function emit (mem: SRAM): string {
  return mem.writeSystemVerilogFiles(`${OUT}/${mem.name}`).at(-1) ?? ''
}

type Ports = SRAM_Parameters['ports']
type Mask = NonNullable<SRAM_Parameters['writeEnableMask']>

/** the ports a configuration reads and writes on, as the spec's IO tables give them */
const READS: Record<Ports, string[]> = { '1rw': ['a'], '1r_1w': ['a'], '2rw': ['a', 'b'] }
const WRITES: Record<Ports, string[]> = { '1rw': ['a'], '1r_1w': ['b'], '2rw': ['a', 'b'] }

/** the port list, with widths, the spec's IO tables give for a configuration */
function specPorts (ports: Ports, mask: Mask, dataWidth: number, addrWidth: number): string {
  const list = new Map<string, number>([['clk', 1]])
  for (const p of READS[ports]) {
    list.set(`${p}_re`, 1).set(`${p}_addr`, addrWidth).set(`${p}_data_out`, dataWidth)
  }
  for (const p of WRITES[ports]) {
    list.set(`${p}_we`, 1).set(`${p}_addr`, addrWidth).set(`${p}_data_in`, dataWidth)
    if (mask !== 'none') list.set(`${p}_wmask`, mask === 'bit' ? dataWidth : dataWidth / 8)
  }
  return [...list].map(([n, w]) => `${n}:${w}`).sort().join(' ')
}

const portsOf = (mem: SRAM): string =>
  Object.entries((mem as unknown as { IOs: Record<string, { width?: number }> }).IOs)
    .map(([n, io]) => `${n}:${io.width ?? 1}`).sort().join(' ')

// ============================================ 1. every configuration
interface TbConfig {
  cfg: string
  dataWidth: bigint
  depth: bigint
  ports: Ports
  writeEnableMask: Mask
  readBehavior: NonNullable<SRAM_Parameters['readBehavior']>
  /** built with SYNTHESIS defined: the RTL's synthesis behavior, without its X assignments */
  synthesis: boolean
}

// A few words, so the testbench's random addresses collide often. Each mask shape: none, one
// lane per bit, four byte lanes, and a byte mask on an 8-bit word (one lane, a 1-bit wmask)
const DEPTH = 4n
const MASKS: Array<{ label: string, mask: Mask, dataWidth: bigint }> = [
  { label: 'none', mask: 'none', dataWidth: 8n },
  { label: 'bit', mask: 'bit', dataWidth: 8n },
  { label: 'byte', mask: 'byte', dataWidth: 32n },
  { label: 'byte1', mask: 'byte', dataWidth: 8n }
]
const TB_CONFIGS: TbConfig[] = []
for (const ports of ['1rw', '1r_1w', '2rw'] as const) {
  for (const m of MASKS) {
    for (const readBehavior of ['undefOnWrite', 'readBeforeWrite'] as const) {
      const rb = readBehavior === 'undefOnWrite' ? 'undef' : 'rbw'
      TB_CONFIGS.push({ cfg: `${ports}_${m.label}_${rb}`, dataWidth: m.dataWidth, depth: DEPTH, ports, writeEnableMask: m.mask, readBehavior, synthesis: false })
    }
  }
}
// The unmasked configurations again, with SYNTHESIS defined: they replay the diagrams'
// synthesis lanes, and the random phase checks that a conflicting read holds and a collision
// writes nothing
for (const c of TB_CONFIGS.filter(c => c.writeEnableMask === 'none')) {
  TB_CONFIGS.push({ ...c, cfg: `${c.cfg}_synth`, synthesis: true })
}

mkdirSync(TB_DIR, { recursive: true })
const header = '// Generated by ts/test/modules/test_SRAM.ts. Do not edit.\n'

// ============================================ timing-diagram vectors
// The spec's diagrams are SRAM-timing-<ports>[-<what>].svg. Input lanes are named after the
// ports. A read data lane is `<p>_data_out (<behavior>)`, where <behavior> names a
// readBehavior, simulation or synthesis, or one of each ("undefOnWrite, synthesis"); a lane
// that names no readBehavior holds for both, and one that names neither simulation nor
// synthesis holds for both. Each (readBehavior, simulation or synthesis) a diagram has read
// data for becomes a task, which configuration <ports>_none_<undef|rbw>[_synth] replays.
// FIELDS is vec_t's field order in tb_SRAM.sv: ABSENT means the lane isn't in the diagram
// (input low, output not checked), and DONT_CARE is an 'x' in it (input random, output not
// checked). A brick labelled XX is an X the RTL assigns in simulation: DONT_CARE too, since
// Verilator is two-state.
const FIELDS = ['a_re', 'a_we', 'a_addr', 'a_data_in', 'b_re', 'b_we', 'b_addr', 'b_data_in', 'a_data_out', 'b_data_out']
const OUTPUTS = ['a_data_out', 'b_data_out']
const RB_LABEL: Record<string, string> = { undefOnWrite: 'undef', readBeforeWrite: 'rbw' }
const MODES = ['simulation', 'synthesis']
const diagramTasks = new Map<string, string[]>()

/** the lane with each brick labelled XX turned into an 'x' */
function withoutXX (lane: Lane): Lane {
  const data = typeof lane.data === 'string' ? lane.data.split(/\s+/) : (lane.data ?? [])
  let next = 0
  let wave = ''
  const kept: string[] = []
  for (const ch of lane.wave ?? '') {
    if (ch === '=' || /[2-9]/.test(ch)) {
      const label = data[next++]
      if (label === 'XX') {
        wave += 'x'
        continue
      }
      if (label !== undefined) kept.push(label)
    }
    wave += ch
  }
  return { ...lane, wave, data: kept }
}

let vectors = header
for (const m of readFileSync(SPEC, 'utf8').matchAll(/<!-- wavedrom SRAM-timing-(\S+)\.svg\n([\s\S]*?)\n-->/g)) {
  const [, name, json] = m
  if (name === undefined || json === undefined) continue
  const where = `${SPEC} SRAM-timing-${name}`
  const ports = name.split('-')[0] ?? ''
  if (!(ports in READS)) throw Error(`${where}: ${ports} is not a ports value`)
  let cycles = 0
  const inputs = new Map<string, number[]>()
  const outputs: Array<{ port: string, readBehavior?: string, mode?: string, values: number[] }> = []
  for (const lane of (JSON.parse(json) as { signal: Lane[] }).signal) {
    if (Array.isArray(lane)) throw Error(`${where}: a lane group; name read data lanes <p>_data_out (<behavior>) instead`)
    if (lane.name === undefined || lane.name === 'clk') continue
    const [, port, behavior] = /^(\w+)(?: \(([^)]+)\))?$/.exec(lane.name) ?? []
    if (port === undefined || !FIELDS.includes(port)) throw Error(`${where}: ${lane.name} is not an SRAM port`)
    if (OUTPUTS.includes(port) !== (behavior !== undefined)) {
      throw Error(`${where}: ${lane.name}: read data lanes, and only they, are named <p>_data_out (<behavior>)`)
    }
    const values = expandLane(withoutXX(lane), false, `${where} ${lane.name}`)
    if (cycles !== 0 && values.length !== cycles) throw Error(`${where}: ${lane.name} has ${values.length} cycles, expected ${cycles}`)
    cycles = values.length
    if (behavior === undefined) {
      inputs.set(port, values)
      continue
    }
    const words = behavior.split(/,\s*/)
    const readBehavior = words.find(w => RB_LABEL[w] !== undefined)
    const mode = words.find(w => MODES.includes(w))
    if (words.length !== Number(readBehavior !== undefined) + Number(mode !== undefined) || words.length === 0) {
      throw Error(`${where}: ${lane.name}: "${behavior}" is not a readBehavior, simulation or synthesis, or one of each`)
    }
    outputs.push({ port, readBehavior, mode, values })
  }
  for (const readBehavior of Object.keys(RB_LABEL)) {
    for (const mode of MODES) {
      // the read data lanes that hold for this readBehavior and mode: one per port at most
      const lanes = new Map<string, number[]>()
      for (const o of outputs) {
        if ((o.readBehavior ?? readBehavior) !== readBehavior || (o.mode ?? mode) !== mode) continue
        if (lanes.has(o.port)) throw Error(`${where}: two ${o.port} lanes hold for ${readBehavior} in ${mode}`)
        lanes.set(o.port, o.values)
      }
      if (lanes.size === 0) continue
      const cfg = `${ports}_none_${RB_LABEL[readBehavior]}${mode === 'synthesis' ? '_synth' : ''}`
      if (!TB_CONFIGS.some(c => c.cfg === cfg)) throw Error(`${where}: no testbench configuration ${cfg}`)
      const rows: string[] = []
      for (let k = 0; k < cycles; k++) rows.push(`    '{${FIELDS.map(f => (lanes.get(f) ?? inputs.get(f))?.[k] ?? ABSENT).join(', ')}}`)
      const task = `diagram_${name.replace(/-/g, '_')}_${RB_LABEL[readBehavior]}_${mode === 'synthesis' ? 'synth' : 'sim'}`
      vectors += `
// SRAM-timing-${name}.svg, ${readBehavior}, ${mode}: ${cycles} cycles. Fields: ${FIELDS.join(', ')}
task automatic ${task}();
  vec_t v[${cycles}] = '{
${rows.join(',\n')}
  };
  run_vectors("${name} ${readBehavior} ${mode}", v);
endtask
`
      diagramTasks.set(cfg, [...(diagramTasks.get(cfg) ?? []), task])
    }
  }
}
writeFileSync(`${TB_DIR}/SRAM_tb_vectors.svh`, vectors)
// every ports value and readBehavior has a diagram, in simulation and synthesis
for (const c of TB_CONFIGS.filter(c => c.writeEnableMask === 'none')) {
  check(`${c.cfg}: replays ${(diagramTasks.get(c.cfg) ?? []).length} timing diagram(s) from the spec`, diagramTasks.has(c.cfg))
}

let configs = header
const configList: string[] = []
const dutOf = new Map<string, string>()
TB_CONFIGS.forEach((c, i) => {
  const mem = new SRAM({ dataWidth: c.dataWidth, depth: c.depth, ports: c.ports, writeEnableMask: c.writeEnableMask, readBehavior: c.readBehavior })
  const dataWidth = Number(c.dataWidth)
  const addrWidth = mem.bitWidth(c.depth - 1n)
  if (!c.synthesis) {
    check(`${mem.name}: ports match the spec`, portsOf(mem) === specPorts(c.ports, c.writeEnableMask, dataWidth, addrWidth),
      `got:  ${portsOf(mem)}\n  spec: ${specPorts(c.ports, c.writeEnableMask, dataWidth, addrWidth)}`)
  }
  const dut = emit(mem)
  dutOf.set(c.cfg, dut)
  // the random traffic conflicts (undefOnWrite) and collides (2rw) on purpose; SYNTHESIS also
  // leaves the assertions out
  const defines = [
    ...(c.readBehavior === 'undefOnWrite' ? ['-DNOASSERT_SRAM_RW_CONFLICT'] : []),
    ...(c.ports === '2rw' ? ['-DNOASSERT_SRAM_W_COLLISION'] : []),
    ...(c.synthesis ? ['-DSYNTHESIS'] : [])
  ]
  configList.push([c.cfg, dut, ...defines].join(' '))
  const lanes = c.writeEnableMask === 'bit' ? dataWidth : c.writeEnableMask === 'byte' ? dataWidth / 8 : 1
  const has = (list: string[], p: string): number => list.includes(p) ? 1 : 0
  configs += `\`${i === 0 ? 'ifdef' : 'elsif'} CFG_${c.cfg}\n`
  configs += `  \`define CFG_NAME "${c.cfg}"\n`
  configs += `  \`define SRAM_DUT ${mem.name}\n`
  // every DUT port connects to the testbench signal of the same name
  configs += `  \`define SRAM_PORTS ${Object.keys((mem as unknown as { IOs: Record<string, unknown> }).IOs).map(n => `.${n}(${n})`).join(', ')}\n`
  configs += `  \`define DATA_WIDTH ${dataWidth}\n`
  configs += `  \`define DEPTH ${c.depth}\n`
  configs += `  \`define LANES ${lanes}\n`
  configs += `  \`define MASK ${c.writeEnableMask === 'none' ? 0 : 1}\n`
  configs += `  \`define UNDEF_ON_WRITE ${c.readBehavior === 'undefOnWrite' ? 1 : 0}\n`
  configs += `  \`define RD_A ${has(READS[c.ports], 'a')}\n  \`define RD_B ${has(READS[c.ports], 'b')}\n`
  configs += `  \`define WR_A ${has(WRITES[c.ports], 'a')}\n  \`define WR_B ${has(WRITES[c.ports], 'b')}\n`
  configs += `  \`define RUN_DIAGRAMS ${(diagramTasks.get(c.cfg) ?? []).map(t => `${t}();`).join(' ')}\n`
})
configs += '`else\n  `error "define one of the CFG_<config> macros"\n`endif\n'
writeFileSync(`${TB_DIR}/SRAM_tb_configs.svh`, configs)
writeFileSync(`${TB_DIR}/configs.txt`, configList.join('\n') + '\n')
console.log(`${TB_CONFIGS.length} testbench configurations written to ${TB_DIR}/`)

// Runs that must stop on an assertion: tb_SRAM's break_assertion(<CHECK_ASSERT>) breaks it with
// every write mask bit low. A readBeforeWrite configuration has no conflict assertion, so the
// collision check uses one to show that it alone fires
const ASSERT_CHECKS: Array<[string, string, number, string]> = [
  ['rw_conflict_1rw', '1rw_bit_undef', 1, 'a_no_rw_conflict'],
  ['rw_conflict_1r_1w', '1r_1w_none_undef', 1, 'a_no_rw_conflict'],
  ['rw_conflict_2rw_from_b', '2rw_byte_undef', 1, 'a_no_rw_conflict'],
  ['rw_conflict_2rw_own_b', '2rw_none_undef', 2, 'b_no_rw_conflict'],
  ['w_collision', '2rw_bit_rbw', 3, 'no_w_collision']
]
writeFileSync(`${TB_DIR}/assert_checks.txt`, ASSERT_CHECKS.map(([name, cfg, mode, label]) => {
  const dut = dutOf.get(cfg)
  if (dut === undefined) throw Error(`assertion check ${name}: no configuration ${cfg}`)
  return `${name} ${cfg} ${dut} ${mode} ${label}`
}).join('\n') + '\n')

// wider than the old 256-bit dataWidth limit, in both single- and dual-port forms
for (const ports of ['1rw', '1r_1w'] as const) {
  const wide = new SRAM({ dataWidth: 1026n, depth: 4n, ports })
  check(`${wide.name}: ports match the spec`, portsOf(wide) === specPorts(ports, 'none', 1026, 2))
  emit(wide)
}

// ============================================ minMacroBits (spec: Synthesis mapping)
// Vivado isn't told how to build mem on either side of minMacroBits: no ram_style attribute
const hasRamStyle = (mem: SRAM): boolean => moduleSV(mem).includes('ram_style')
const at = (minMacroBits: bigint | undefined, dataWidth = 8n, depth = 4n): SRAM => new SRAM({ dataWidth, depth, ports: '1rw', minMacroBits })
check('no ram_style below minMacroBits (32 bits, 1024) or at it (1024 bits, 1024)', !hasRamStyle(at(undefined)) && !hasRamStyle(at(undefined, 8n, 128n)))
check('the module name includes minMacroBits', at(undefined).name === 'SRAM_8_4_default_1024_1rw_undefOnWrite_none' && at(64n).name.includes('_default_64_'),
  `got ${at(undefined).name} and ${at(64n).name}`)

// ============================================ parameter checks (TSSV guide PARAM-5)
expectThrow('dataWidth 0 is rejected', () => new SRAM({ dataWidth: 0n, depth: 4n, ports: '1rw' }), 'SRAM: dataWidth must be at least 1, got 0')
expectThrow('depth 1 is rejected', () => new SRAM({ dataWidth: 8n, depth: 1n, ports: '1rw' }), 'SRAM: depth must be at least 2, got 1')
expectThrow('a byte mask on 12 bits is rejected', () => new SRAM({ dataWidth: 12n, depth: 4n, ports: '2rw', writeEnableMask: 'byte' }),
  'SRAM: dataWidth must be a multiple of 8 for a byte write mask, got 12')
expectThrow('minMacroBits 31 is rejected', () => at(31n), 'SRAM: minMacroBits must be at least 32, got 31')
expectThrow('readBeforeWrite at minMacroBits bits is rejected', () => new SRAM({ dataWidth: 32n, depth: 32n, ports: '1r_1w', readBehavior: 'readBeforeWrite' }),
  'SRAM: readBeforeWrite is built from flip-flops, so depth * dataWidth must be below minMacroBits (1024), got 32 * 32 = 1024')
check('readBeforeWrite one bit below minMacroBits is accepted', (() => {
  try {
    return new SRAM({ dataWidth: 8n, depth: 4n, ports: '1rw', readBehavior: 'readBeforeWrite', minMacroBits: 33n }).name.includes('_default_33_')
  } catch {
    return false
  }
})())

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

/**
 * Self-checking test for PatternMemory (ts/src/tb/PatternMemory.ts), in both of its modes, with the
 * record layout and the pattern file of the lead's burst_mix example (tssv-noc#207). It writes,
 * under sv-examples/tb/PatternMemory/, the pattern file, its manifest, and a sim-only testbench for
 * each mode. verilatorTB/Makefile's pattern_memory_sim runs both testbenches from that folder:
 *
 *   - tb_PatternMemory_preloaded: the memory loads the file itself. The testbench reads every record
 *     back through rd_addr and compares each field with the file, read into an array of its own.
 *   - tb_PatternMemory_reloaded: the testbench is the host. It reads the file, writes each word
 *     through the load port, and reads the records back. Then it loads them again in reverse
 *     order, as a second testcase would, and reads them back again.
 *
 * Test 1: a preloaded memory has the read port and one output per field, and no load port
 * Test 2: a reloaded memory adds load_en, load_addr and load_data, a whole word wide
 * Test 3: a preloaded memory loads its file with one `initial $readmemh`, a reloaded one has none
 * Test 4: bad parameters are refused
 */
import { Interface, Module } from 'tssv/lib/core/TSSV'
import { PatternMemory, type PatternMemoryMode } from 'tssv/lib/tb/PatternMemory'
import { recordFields, recordLayout } from 'tssv/lib/tb/patternRecord'
import { writeManifest, writePatternFile } from 'tssv/lib/tb/patternFile'
import { markTestbench } from 'tssv/lib/tb/testbench'
import { moduleSV } from 'tssv/test/models/emitted'
import { rmSync } from 'fs'

const OUT = 'sv-examples/tb/PatternMemory'
rmSync(OUT, { recursive: true, force: true })

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

/** The message `f` throws, or undefined if it doesn't throw */
function thrown (f: () => unknown): string | undefined {
  try {
    f()
  } catch (e) {
    return (e as Error).message
  }
  return undefined
}

/** A module's ports, as `<direction> <name>[<width>]` in declaration order */
function ports (sv: string): string[] {
  // A port declaration: input or output, logic, an optional [hi:0] range, the name
  return [...sv.matchAll(/^\s*(input|output)\s+logic\s*(?:\[(\d+):0\])?\s*(\w+)/gm)]
    .map(m => `${m[1]} ${m[3]}[${m[2] === undefined ? 1 : Number(m[2]) + 1}]`)
}

// The record of the lead's burst_mix example: head, tail and data of a FlitStream-like interface
const flitStream = new Interface('flit_stream', {}, undefined, {
  head: { width: 1 },
  tail: { width: 1 },
  data: { width: 32 },
  valid: { width: 1 },
  ready: { width: 1 }
})
const layout = recordLayout(recordFields(flitStream, ['head', 'tail', 'data']))
const DEPTH = 8
const FILE = 'burst_mix_s_in.hex'

// The lead's example, written by the pattern file writer, and its manifest
const RECORDS = writePatternFile(`${OUT}/${FILE}`, layout, {
  dut: 'FlitStreamPipe',
  testcase: 'burst_mix',
  purpose: 'stimulus for s_in',
  recordNoun: 'flit',
  objectNoun: 'packet',
  objects: [
    {
      label: 'source 0',
      records: [{ head: 1n, tail: 0n, data: 0x0a01n }, { head: 0n, tail: 0n, data: 0x0a02n }, { head: 0n, tail: 1n, data: 0x0a03n }]
    },
    { label: 'source 1', records: [{ head: 1n, tail: 1n, data: 0x0b01n }] }
  ]
})
writeManifest(`${OUT}/burst_mix.json`, { testcase: 'burst_mix', files: [{ file: FILE, memory: 'dut', radix: 'h', records: RECORDS }] })

/**
 * A sim-only testbench for `memory`, run from OUT. It reads the pattern file into `words` as the
 * reference, loads the memory through its load port first when `mode` is reloaded, and checks that
 * every record reads back with each field equal to its slot in the word.
 */
function memoryTestbench (mode: PatternMemoryMode, memory: PatternMemory): Module {
  const aw = Math.ceil(Math.log2(DEPTH))
  const w = layout.wordWidth
  const tb = new Module({ name: `tb_PatternMemory_${mode}` })
  tb.addSignal('clk', { width: 1 })
  tb.addSignal('rd_addr', { width: aw })
  tb.addSignal('words', { width: w, isArray: BigInt(RECORDS) })
  const bindings: Record<string, string> = { clk: 'clk', rd_addr: 'rd_addr' }
  for (const f of layout.fields) {
    tb.addSignal(f.name, { width: f.width })
    bindings[f.name] = f.name
  }
  if (mode === 'reloaded') {
    tb.addSignal('load_en', { width: 1 })
    tb.addSignal('load_addr', { width: aw })
    tb.addSignal('load_data', { width: w })
    Object.assign(bindings, { load_en: 'load_en', load_addr: 'load_addr', load_data: 'load_data' })
  }
  tb.addSubmodule('dut', memory, bindings, false)

  // The fields together, as read and as the file's word i holds them
  const got = layout.fields.map(f => f.name).join(', ')
  const want = layout.fields.map(f => `words[i][${f.lo + f.width - 1}:${f.lo}]`).join(', ')
  // `order` is a task argument: 0 loads word i at address i, 1 at address RECORDS-1-i
  const at = (order: string): string => `${aw}'(${order} ? ${RECORDS - 1} - i : i)`
  tb.addBody(`
// Clock
initial clk = 1'b0;
always #5 clk = ~clk;

// Reads every record back, in address order: address i must hold word i, or word RECORDS-1-i in
// reverse order. Each read shows at the rising edge after its address
task automatic read_back(input bit reverse);
  for (int i = 0; i < ${RECORDS}; i++) begin
    @(negedge clk) rd_addr = ${at('reverse')};
    @(negedge clk);
    if ({${got}} != {${want}}) begin
      $display("FAIL: address %0d holds %h, expected %h", rd_addr, {${got}}, {${want}});
      $fatal(1, "tb_PatternMemory_${mode} failed");
    end
  end
endtask
${mode === 'reloaded'
    ? `
// Writes every word through the load port, at address i, or RECORDS-1-i in reverse order
task automatic load(input bit reverse);
  for (int i = 0; i < ${RECORDS}; i++) begin
    @(negedge clk);
    load_en = 1'b1;
    load_addr = ${at('reverse')};
    load_data = words[i];
  end
  @(negedge clk) load_en = 1'b0;
endtask
`
    : ''}
initial begin
  $readmemh("${FILE}", words);
  rd_addr = '0;${mode === 'reloaded'
    ? `
  load_en = 1'b0;
  load_addr = '0;
  load_data = '0;
  load(1'b0);
  read_back(1'b0);
  load(1'b1);
  read_back(1'b1);
  $display("PASS: tb_PatternMemory_reloaded loaded ${RECORDS} records through the load port, twice, and read them back");`
    : `
  read_back(1'b0);
  $display("PASS: tb_PatternMemory_preloaded read back the ${RECORDS} records of ${FILE}");`}
  $finish;
end
`, { indentMode: 'relative' })
  return markTestbench(tb)
}

const preloaded = new PatternMemory({ name: 'pm_preloaded', layout, depth: DEPTH, mode: 'preloaded', file: FILE })
const reloaded = new PatternMemory({ name: 'pm_reloaded', layout, depth: DEPTH, mode: 'reloaded' })
for (const [mode, m] of [['preloaded', preloaded], ['reloaded', reloaded]] as const) {
  const tb = memoryTestbench(mode, m)
  tb.writeSystemVerilogFiles(`${OUT}/${tb.name}`)
}
const preSV = moduleSV(preloaded)
const reSV = moduleSV(reloaded)

// ---- Test 1 ---------------------------------------------------------------------------------
const readPorts = ['input clk[1]', 'input rd_addr[3]', 'output head[1]', 'output tail[1]', 'output data[32]']
check('a preloaded memory has the read port and one output per field, and no load port',
  ports(preSV).join(', ') === readPorts.join(', '), ports(preSV).join(', '))

// ---- Test 2 ---------------------------------------------------------------------------------
const loadPorts = ['input load_en[1]', 'input load_addr[3]', 'input load_data[40]']
check('a reloaded memory adds the load port, a whole 40-bit word wide',
  ports(reSV).join(', ') === [...readPorts.slice(0, 2), ...loadPorts, ...readPorts.slice(2)].join(', '), ports(reSV).join(', '))

// ---- Test 3 ---------------------------------------------------------------------------------
// An initial statement, from the keyword to the end of its line
const initials = (sv: string): string[] => [...sv.matchAll(/^\s*initial\b.*$/gm)].map(m => m[0].trim())
check('a preloaded memory loads its file with one initial $readmemh',
  initials(preSV).join('\n') === `initial $readmemh("${FILE}", mem);`, initials(preSV).join('\n'))
check('a reloaded memory has no initial', initials(reSV).length === 0, initials(reSV).join('\n'))

// ---- Test 4 ---------------------------------------------------------------------------------
const refusals: Array<[string, () => unknown, string]> = [
  ['a preloaded memory without a file', () => new PatternMemory({ name: 'x', layout, depth: 4, mode: 'preloaded' }),
    'x: a preloaded memory needs a file'],
  ['a reloaded memory with a file', () => new PatternMemory({ name: 'x', layout, depth: 4, mode: 'reloaded', file: 'a.hex' }),
    'x: a reloaded memory loads through its load port, not from a.hex'],
  ['a depth of 1', () => new PatternMemory({ name: 'x', layout, depth: 1, mode: 'reloaded' }),
    'x: depth must be an integer of at least 2, got 1'],
  ['a path with a quote', () => new PatternMemory({ name: 'x', layout, depth: 4, mode: 'preloaded', file: 'a".hex' }),
    'x: the file path "a\\".hex" has a quote, a backslash or a line break'],
  ['a field named like a port', () => new PatternMemory({ name: 'x', layout: recordLayout([{ name: 'rd_addr', width: 4 }]), depth: 4, mode: 'reloaded' }),
    'x: field rd_addr has the name of one of the memory\'s own signals']
]
for (const [what, f, message] of refusals) {
  const got = thrown(f)
  check(`${what} is refused`, got === message, got)
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

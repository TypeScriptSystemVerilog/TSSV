/**
 * Self-checking test for PatternMemory (ts/src/tb/PatternMemory.ts), in both of its modes, with the
 * record layout of the lead's burst_mix example (tssv-noc#207). It writes the SV under
 * sv-examples/tb/PatternMemory/.
 *
 * Test 1: a preloaded memory has the read port and one output per field, and no load port
 * Test 2: a reloaded memory adds load_en, load_addr and load_data, a whole word wide
 * Test 3: a preloaded memory loads its file with one `initial $readmemh`, a reloaded one has none
 * Test 4: bad parameters are refused
 */
import { Interface } from 'tssv/lib/core/TSSV'
import { PatternMemory } from 'tssv/lib/tb/PatternMemory'
import { recordFields, recordLayout } from 'tssv/lib/tb/patternRecord'
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

const preloaded = new PatternMemory({ name: 'pm_preloaded', layout, depth: DEPTH, mode: 'preloaded', file: 'burst_mix_s_in.hex' })
const reloaded = new PatternMemory({ name: 'pm_reloaded', layout, depth: DEPTH, mode: 'reloaded' })
for (const m of [preloaded, reloaded]) m.writeSystemVerilogFiles(`${OUT}/${m.name}`)
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
  initials(preSV).join('\n') === 'initial $readmemh("burst_mix_s_in.hex", mem);', initials(preSV).join('\n'))
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

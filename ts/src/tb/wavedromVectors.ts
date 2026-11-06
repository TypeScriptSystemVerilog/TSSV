// Test vectors from a spec's WaveDrom timing diagrams, for a testbench that replays a diagram
// cycle for cycle. A spec keeps each diagram's source in an HTML comment beside its rendered SVG
// (`<!-- wavedrom NAME.svg { ...json... } -->`, scripts/render-wavedrom.mjs), so the JSON
// replayed here is exactly the JSON drawn. Two readers:
//
//   - diagramLanes(): one diagram on one clock, as a list of values per lane, for a harness's
//     VectorPlayer and VectorChecker (doc/framework/testbench.md).
//   - diagramTasks(): each diagram with a given prefix on a fast and a slow clock, as SV tasks for
//     a hand-written testbench such as tb_AFIFO.sv. A diagram draws its slow clock at half the
//     fast clock's frequency, so lanes with "period": 2 belong to the slow clock.
//
// Each lane becomes one int per cycle of its clock: a number label as-is (decimal, or hex with
// 0x), a single-letter label as its character code, and a binary label (in a lane listed as
// binary) in base 2. ABSENT: the lane isn't in the diagram (an input is left at 0, an output isn't
// checked). DONT_CARE: 'x' in the diagram (an input is randomized, an output isn't checked).
import { readFileSync } from 'fs'
import { absolutePath } from 'tssv/lib/core/TSSV'

export const ABSENT = -2
export const DONT_CARE = -1

export interface Lane { name?: string, wave?: string, data?: string[] | string, period?: number }

/** One lane expanded to a value per cycle. `undefined` is a don't-care ('x'). */
export interface LaneValues { name: string, values: Array<number | undefined> }

/** one clock's lanes in a diagram */
export interface ClockLanes {
  /** the clock's own lane, which the testbench generates rather than replays */
  clock: string
  /** the SV struct type the testbench declares for one cycle of this clock */
  type: string
  /** this clock's lanes, in the struct's field order. A lane the diagram leaves out is ABSENT */
  fields: string[]
}

function labelValue (label: string, binary: boolean, where: string): number {
  if (binary) {
    if (/^[01]+$/.test(label)) return parseInt(label, 2) // binary digits only
    throw Error(`${where}: data label "${label}" is not binary`)
  }
  if (/^\d+$/.test(label)) return Number(label) // decimal digits only
  if (/^0x[0-9a-fA-F]+$/.test(label)) return parseInt(label.slice(2), 16) // 0x then hex digits
  if (/^[A-Za-z]$/.test(label)) return label.charCodeAt(0) // a single letter
  throw Error(`${where}: data label "${label}" is neither a number nor a single letter`)
}

/**
 * expand a lane's wave into one value per cycle of its own clock: '0'/'l' and '1'/'h' are levels,
 * 'x' is DONT_CARE, '=' and '2'-'9' take the next data label, and '.' repeats the previous value
 * ('.' first is DONT_CARE). Throws on any other character, and unless every data label is used.
 */
export function expandLane (lane: Lane, binary: boolean, where: string): number[] {
  const data = typeof lane.data === 'string' ? lane.data.split(/\s+/) : (lane.data ?? [])
  let next = 0
  let prev = DONT_CARE
  const values: number[] = []
  for (const ch of lane.wave ?? '') {
    if (ch === '.') {
      // repeats prev
    } else if (ch === '0' || ch === 'l') {
      prev = 0
    } else if (ch === '1' || ch === 'h') {
      prev = 1
    } else if (ch === 'x') {
      prev = DONT_CARE
    } else if (ch === '=' || /[2-9]/.test(ch)) { // a data brick: '=' or a digit 2-9
      const label = data[next++]
      if (label === undefined) throw Error(`${where}: more data bricks than data labels`)
      prev = labelValue(label, binary, where)
    } else {
      throw Error(`${where}: unsupported wave character '${ch}'`)
    }
    values.push(prev)
  }
  if (next !== data.length) throw Error(`${where}: ${data.length} data labels but ${next} data bricks`)
  return values
}

/** `s` with every character a RegExp gives a meaning escaped, to match it literally */
const literally = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * The diagram whose SVG is `svg` in the spec at `spec`, as one LaneValues per signal lane, all of
 * one length. Spacers and clock lanes (a wave starting with 'p', 'n', 'P' or 'N') are left out.
 * `spec` starts with a root, as in `$TSSV_ROOT/doc/modules/SFIFO/SFIFO-spec.md`, or is absolute.
 */
export function diagramLanes (spec: string, svg: string, binaryLanes: string[] = []): { cycles: number, lanes: LaneValues[] } {
  const text = readFileSync(absolutePath(spec, 'spec'), 'utf8')
  // `<!-- wavedrom <svg>`, then the JSON on the lines up to the one that is `-->`
  const m = new RegExp(`<!-- wavedrom ${literally(svg)}\\s*\\n([\\s\\S]*?)\\n-->`).exec(text)
  if (m?.[1] === undefined) throw Error(`${spec}: no wavedrom diagram for ${svg}`)
  const lanes: LaneValues[] = []
  let cycles: number | undefined
  for (const lane of (JSON.parse(m[1]) as { signal: Lane[] }).signal) {
    if (lane.name === undefined || lane.wave === undefined) continue // a spacer
    if (/^[pnPN]/.test(lane.wave)) continue // a clock: a wave starting with p, n, P or N
    const values = expandLane(lane, binaryLanes.includes(lane.name), `${svg} lane ${lane.name}`)
    if (cycles !== undefined && values.length !== cycles) {
      throw Error(`${svg}: lane ${lane.name} has ${values.length} cycles, the others ${cycles}`)
    }
    cycles = values.length
    lanes.push({ name: lane.name, values: values.map(v => v === DONT_CARE ? undefined : v) })
  }
  if (cycles === undefined) throw Error(`${svg}: no signal lanes`)
  return { cycles, lanes }
}

function rows (fields: string[], perField: Map<string, number[]>, cycles: number): string {
  const out: string[] = []
  for (let k = 0; k < cycles; k++) out.push(`    '{${fields.map(f => perField.get(f)?.[k] ?? ABSENT).join(', ')}}`)
  return out.join(',\n')
}

/**
 * One SV task per diagram in `spec` whose SVG is named `<prefix>-<name>.svg`. Task
 * `diagram_<name>()` declares the vectors for both clocks and calls
 * `run_diagram("<name>", fast, slow)`, which the testbench defines. Returns the tasks and the
 * diagram names. Throws on a lane that belongs to neither clock, on a lane with the wrong period,
 * and on lanes of one clock that differ in length. `spec` starts with a root, as in
 * `$TSSV_ROOT/doc/modules/AFIFO/AFIFO-spec.md`, or is absolute.
 */
export function diagramTasks (spec: string, prefix: string, fast: ClockLanes, slow: ClockLanes,
  binaryLanes: string[] = []): { sv: string, names: string[] } {
  const text = readFileSync(absolutePath(spec, 'spec'), 'utf8')
  let sv = ''
  const names: string[] = []
  // `<!-- wavedrom <prefix>-<name>.svg`, then the JSON on the lines up to the one that is `-->`
  for (const m of text.matchAll(new RegExp(`<!-- wavedrom ${literally(prefix)}-(\\S+)\\.svg\\n([\\s\\S]*?)\\n-->`, 'g'))) {
    const [, name, json] = m
    if (name === undefined || json === undefined) continue
    const where = `${spec} ${name}`
    const perField = new Map<string, number[]>()
    let fastCycles = 0
    let slowCycles = 0
    for (const lane of (JSON.parse(json) as { signal: Lane[] }).signal) {
      if (lane.name === undefined || lane.name === fast.clock || lane.name === slow.clock) continue
      const isSlow = slow.fields.includes(lane.name)
      if (!isSlow && !fast.fields.includes(lane.name)) throw Error(`${where}: lane ${lane.name} belongs to neither clock`)
      if ((lane.period ?? 1) !== (isSlow ? 2 : 1)) throw Error(`${where}: ${lane.name} must have period ${isSlow ? 2 : 1}`)
      const values = expandLane(lane, binaryLanes.includes(lane.name), `${where} ${lane.name}`)
      const cycles = isSlow ? slowCycles : fastCycles
      if (cycles !== 0 && values.length !== cycles) throw Error(`${where}: ${lane.name} has ${values.length} cycles, expected ${cycles}`)
      if (isSlow) slowCycles = values.length
      else fastCycles = values.length
      perField.set(lane.name, values)
    }
    if (fastCycles !== 2 * slowCycles) {
      throw Error(`${where}: ${fastCycles} ${fast.clock} cycles but ${slowCycles} ${slow.clock} cycles; expected 2:1`)
    }
    const task = name.replace(/-/g, '_')
    sv += `
// ${name}: ${fastCycles} ${fast.clock} cycles (${fast.fields.join(', ')}) and ${slowCycles} ${slow.clock} cycles (${slow.fields.join(', ')})
task automatic diagram_${task}();
  ${fast.type} fv[${fastCycles}] = '{
${rows(fast.fields, perField, fastCycles)}
  };
  ${slow.type} sv[${slowCycles}] = '{
${rows(slow.fields, perField, slowCycles)}
  };
  run_diagram("${name}", fv, sv);
endtask
`
    names.push(name)
  }
  return { sv, names }
}

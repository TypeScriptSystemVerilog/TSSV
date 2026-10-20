// Test vectors from a spec's WaveDrom timing diagrams, for a testbench on two clocks that
// replays each diagram cycle for cycle, as tb_TwoClockRegFile.sv does. A diagram draws its slow
// clock at half the fast clock's frequency, so lanes with "period": 2 belong to the slow clock.
//
// Each lane becomes one int per cycle of its clock: a number label as-is, a single-letter label
// as its character code, and a binary label (in a lane listed as binary) in base 2. ABSENT: the
// lane isn't in the diagram (an input is left at 0, an output isn't checked). DONT_CARE: 'x' in
// the diagram (an input is randomized, an output isn't checked).
import { readFileSync } from 'fs'

export const ABSENT = -2
export const DONT_CARE = -1

export interface Lane { name?: string, wave?: string, data?: string[] | string, period?: number }

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
    if (/^[01]+$/.test(label)) return parseInt(label, 2)
    throw Error(`${where}: data label "${label}" is not binary`)
  }
  if (/^\d+$/.test(label)) return Number(label)
  if (/^[A-Za-z]$/.test(label)) return label.charCodeAt(0)
  throw Error(`${where}: data label "${label}" is neither a number nor a single letter`)
}

/** expand a lane's wave into one value per cycle of its own clock */
export function expandLane (lane: Lane, binary: boolean, where: string): number[] {
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
      prev = labelValue(label, binary, where)
    } else {
      throw Error(`${where}: unsupported wave character '${ch}'`)
    }
    values.push(prev)
  }
  return values
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
 * and on lanes of one clock that differ in length.
 */
export function diagramTasks (spec: string, prefix: string, fast: ClockLanes, slow: ClockLanes,
  binaryLanes: string[] = []): { sv: string, names: string[] } {
  const text = readFileSync(spec, 'utf8')
  let sv = ''
  const names: string[] = []
  for (const m of text.matchAll(new RegExp(`<!-- wavedrom ${prefix}-(\\S+)\\.svg\\n([\\s\\S]*?)\\n-->`, 'g'))) {
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

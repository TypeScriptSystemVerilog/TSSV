// Small valid/ready DUTs for the record-stream examples (test_tbExamples.ts): the slice, merge
// and split that RecordInjector and RecordChecker are shown working on. They are test code, not
// tier 1. Each carries a word of `width` bits; a harness packs a record's fields into it.
import TSSV, { Expr } from 'tssv/lib/core/TSSV'

export interface StreamSlice_Parameters extends TSSV.TSSVParameters {
  name: string
  /** Bits in a word. */
  width: number
  /** Register stages. Default 2. */
  stages?: number
}

/**
 * StreamSlice — `stages` register stages on a valid/ready stream. A stage takes a word when it is
 * empty or when the word it holds leaves, so the ready chain is combinational and the slice
 * carries a word every cycle: latency `stages`, full rate. While `out_ready` is low, the output
 * holds, the stages fill, and then `in_ready` falls. Nothing is lost, duplicated or reordered.
 *
 * Ports: `clk`, `rst_b`, `in_valid`, `in_data`, `out_ready` in; `in_ready`, `out_valid`,
 * `out_data` out.
 */
export class StreamSlice extends TSSV.Module {
  constructor (params: StreamSlice_Parameters) {
    const stages = params.stages ?? 2
    super({ name: params.name, width: params.width, stages })
    if (!Number.isInteger(stages) || stages < 1) throw Error(`${params.name}: stages must be a positive integer, got ${stages}`)
    const w = params.width
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      in_valid: { direction: 'input' },
      in_data: { direction: 'input', width: w },
      out_ready: { direction: 'input' },
      in_ready: { direction: 'output' },
      out_valid: { direction: 'output' },
      out_data: { direction: 'output', width: w }
    }

    // Stage i holds v_i and d_i. It may take a word, r_i, when it is empty or its word leaves
    for (let i = 0; i < stages; i++) {
      this.addSignal(`v_${i}`, { width: 1 })
      this.addSignal(`d_${i}`, { width: w })
      this.addSignal(`r_${i}`, { width: 1 })
    }
    for (let i = 0; i < stages; i++) {
      const vIn = i === 0 ? 'in_valid' : `v_${i - 1}`
      const dIn = i === 0 ? 'in_data' : `d_${i - 1}`
      const rOut = i === stages - 1 ? 'out_ready' : `r_${i + 1}`
      this.addAssign({ in: new Expr(`!v_${i} || ${rOut}`), out: `r_${i}` })
      this.addRegister({ d: vIn, clk: 'clk', reset: 'rst_b', en: `r_${i}`, q: `v_${i}` })
      this.addRegister({ d: dIn, clk: 'clk', en: new Expr(`r_${i} && ${vIn}`), q: `d_${i}` })
    }
    this.addAssign({ in: new Expr('r_0'), out: 'in_ready' })
    this.addAssign({ in: new Expr(`v_${stages - 1}`), out: 'out_valid' })
    this.addAssign({ in: new Expr(`d_${stages - 1}`), out: 'out_data' })
  }
}

export interface StreamMerge_Parameters extends TSSV.TSSVParameters {
  name: string
  /** Bits in a word. */
  width: number
}

/**
 * StreamMerge — two valid/ready streams, `a` and `b`, into one. When both offer a word, it takes
 * them in turn; while the output stalls, it holds its choice, so `out_data` doesn't change under
 * `out_valid`. Each input's words leave in their order, interleaved with the other's.
 *
 * Ports: `clk`, `rst_b`, `a_valid`, `a_data`, `b_valid`, `b_data`, `out_ready` in; `a_ready`,
 * `b_ready`, `out_valid`, `out_data` out.
 */
export class StreamMerge extends TSSV.Module {
  constructor (params: StreamMerge_Parameters) {
    super({ name: params.name, width: params.width })
    const w = params.width
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      a_valid: { direction: 'input' },
      a_data: { direction: 'input', width: w },
      b_valid: { direction: 'input' },
      b_data: { direction: 'input', width: w },
      out_ready: { direction: 'input' },
      a_ready: { direction: 'output' },
      b_ready: { direction: 'output' },
      out_valid: { direction: 'output' },
      out_data: { direction: 'output', width: w }
    }

    // The choice: held while the output stalls, otherwise a unless b offers and it is b's turn
    this.addSignal('turn_b', { width: 1 }) // b goes next when both offer
    this.addSignal('stalled', { width: 1 }) // a word waited last cycle; held_b says whose
    this.addSignal('held_b', { width: 1 })
    this.addSignal('pick_b', { width: 1 })
    this.addSignal('moved', { width: 1 })
    this.addAssign({ in: new Expr('stalled ? held_b : b_valid && (!a_valid || turn_b)'), out: 'pick_b' })
    this.addAssign({ in: new Expr('out_valid && out_ready'), out: 'moved' })
    this.addRegister({ d: new Expr('out_valid && !out_ready'), clk: 'clk', reset: 'rst_b', q: 'stalled' })
    this.addRegister({ d: 'pick_b', clk: 'clk', reset: 'rst_b', q: 'held_b' })
    this.addRegister({ d: new Expr('!pick_b'), clk: 'clk', reset: 'rst_b', en: 'moved', q: 'turn_b' })

    this.addAssign({ in: new Expr('a_valid || b_valid'), out: 'out_valid' })
    this.addAssign({ in: new Expr('pick_b ? b_data : a_data'), out: 'out_data' })
    this.addAssign({ in: new Expr('!pick_b && out_ready'), out: 'a_ready' })
    this.addAssign({ in: new Expr('pick_b && out_ready'), out: 'b_ready' })
  }
}

export interface StreamSplit_Parameters extends TSSV.TSSVParameters {
  name: string
  /** Bits in a word. */
  width: number
  /** The bit of the word that picks the output: 0 for `a`, 1 for `b`. */
  selBit: number
}

/**
 * StreamSplit — one valid/ready stream to two, `a` and `b`, by one bit of the word. A word waits
 * at the input until its output takes it, so the words leave in their input order across both
 * outputs: a word reaches its output only after every earlier word has left.
 *
 * Ports: `in_valid`, `in_data`, `a_ready`, `b_ready` in; `in_ready`, `a_valid`, `a_data`,
 * `b_valid`, `b_data` out. It has no state.
 */
export class StreamSplit extends TSSV.Module {
  constructor (params: StreamSplit_Parameters) {
    super({ name: params.name, width: params.width, selBit: params.selBit })
    const w = params.width
    if (!Number.isInteger(params.selBit) || params.selBit < 0 || params.selBit >= w) throw Error(`${params.name}: selBit must be a bit of the word, got ${params.selBit}`)
    this.IOs = {
      in_valid: { direction: 'input' },
      in_data: { direction: 'input', width: w },
      a_ready: { direction: 'input' },
      b_ready: { direction: 'input' },
      in_ready: { direction: 'output' },
      a_valid: { direction: 'output' },
      a_data: { direction: 'output', width: w },
      b_valid: { direction: 'output' },
      b_data: { direction: 'output', width: w }
    }
    const sel = `in_data[${params.selBit}]`
    this.addAssign({ in: new Expr(`in_valid && !${sel}`), out: 'a_valid' })
    this.addAssign({ in: new Expr(`in_valid && ${sel}`), out: 'b_valid' })
    this.addAssign({ in: new Expr('in_data'), out: 'a_data' })
    this.addAssign({ in: new Expr('in_data'), out: 'b_data' })
    this.addAssign({ in: new Expr(`${sel} ? b_ready : a_ready`), out: 'in_ready' })
  }
}

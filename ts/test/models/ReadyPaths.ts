// The example module for the port-contract check (test_checkPortContracts.ts): ready paths of
// both kinds, so the check is shown passing one and failing the other. It is test code.
import TSSV, { Expr } from 'tssv/lib/core/TSSV'

/** Each handshake's signals from the source's side; the sink's are the opposite */
const SOURCE: Record<string, 'input' | 'output'> = { valid: 'output', data: 'output', ready: 'input' }

/**
 * A valid/ready handshake with a data word, as an interface: `valid`, `data` and `ready`, with
 * modports `source` and `sink`. Its SV name is `handshake_<DATA_WIDTH>`.
 */
export class Handshake extends TSSV.Interface {
  constructor (params: { DATA_WIDTH: number }, role?: 'source' | 'sink') {
    super('handshake', { DATA_WIDTH: params.DATA_WIDTH }, role, {
      valid: { width: 1 },
      data: { width: params.DATA_WIDTH },
      ready: { width: 1 }
    })
    this.modports = {
      source: SOURCE,
      sink: Object.fromEntries(Object.entries(SOURCE).map(([name, dir]) => [name, dir === 'output' ? 'input' : 'output']))
    }
  }
}

export interface ReadyPaths_Parameters extends TSSV.TSSVParameters {
  /** Make channel `a`'s ready combinational: the mutation the check must catch. Default false. */
  mutate?: boolean
  /** Add a combinational loop inside the module, on its own output `loop_out`. Default false. */
  internalLoop?: boolean
}

/**
 * ReadyPaths — independent one-entry handshake buffers, each with a registered or a
 * combinational ready path:
 *
 * | Channel | Ports | `in_ready` | Declared contract |
 * |---|---|---|---|
 * | `a` | `a_in_valid`, `a_in_ready`, `a_out_valid`, `a_out_ready` | registered | `a_out_ready` to `a_in_ready` |
 * | `b` | `b_in_valid`, `b_in_ready`, `b_out_valid`, `b_out_ready` | combinational | none |
 * | `s` | interface ports `s_in` (sink) and `s_out` (source), with an 8-bit `data` | registered | `s_out.ready` to `s_in.ready` |
 * | `v` | 2-bit `v_in_valid`, `v_in_ready`, `v_out_valid`, `v_out_ready`, one lane per bit | lane 0 combinational, lane 1 registered | `v_out_ready[1]` to `v_in_ready[1]` |
 *
 * A registered buffer takes a token only when it is empty, so `in_ready` is the inverse of a flop
 * and the buffer runs at half rate. A combinational one also takes a token while its own leaves,
 * so `in_ready` reads `out_ready` and it runs at full rate.
 *
 * With `mutate`, channel `a` is built combinational but keeps its contract, which is now false.
 * With `internalLoop`, `loop_out` comes from a loop of two assigns that never reaches a ready.
 */
export class ReadyPaths extends TSSV.Module {
  constructor (params: ReadyPaths_Parameters = {}) {
    const mutate = params.mutate ?? false
    const internalLoop = params.internalLoop ?? false
    super({ name: params.name, mutate, internalLoop })
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      a_in_valid: { direction: 'input' },
      a_out_ready: { direction: 'input' },
      a_in_ready: { direction: 'output' },
      a_out_valid: { direction: 'output' },
      b_in_valid: { direction: 'input' },
      b_out_ready: { direction: 'input' },
      b_in_ready: { direction: 'output' },
      b_out_valid: { direction: 'output' },
      v_in_valid: { direction: 'input', width: 2 },
      v_out_ready: { direction: 'input', width: 2 },
      v_in_ready: { direction: 'output', width: 2 },
      v_out_valid: { direction: 'output', width: 2 },
      ...(internalLoop ? { loop_out: { direction: 'output' as const } } : {})
    }
    this.addInterface('s_in', new Handshake({ DATA_WIDTH: 8 }, 'sink'))
    this.addInterface('s_out', new Handshake({ DATA_WIDTH: 8 }, 'source'))

    this.buffer('a', { inValid: 'a_in_valid', outReady: 'a_out_ready', inReady: 'a_in_ready', outValid: 'a_out_valid' }, mutate)
    this.buffer('b', { inValid: 'b_in_valid', outReady: 'b_out_ready', inReady: 'b_in_ready', outValid: 'b_out_valid' }, true)
    this.buffer('s', { inValid: 's_in.valid', outReady: 's_out.ready', inReady: 's_in.ready', outValid: 's_out.valid' }, false)
    this.addRegister({ d: 's_in.data', clk: 'clk', en: new Expr('s_in.valid && s_in.ready'), q: 's_out.data' })
    for (const lane of [0, 1]) {
      for (const sig of ['in_ready', 'out_valid']) this.addSignal(`v${lane}_${sig}`, { width: 1 })
      this.buffer(`v${lane}`, {
        inValid: `v_in_valid[${lane}]`,
        outReady: `v_out_ready[${lane}]`,
        inReady: `v${lane}_in_ready`,
        outValid: `v${lane}_out_valid`
      }, lane === 0)
    }
    this.addAssign({ in: new Expr('{v1_in_ready, v0_in_ready}'), out: 'v_in_ready' })
    this.addAssign({ in: new Expr('{v1_out_valid, v0_out_valid}'), out: 'v_out_valid' })

    if (internalLoop) {
      this.addSignal('loop_x', { width: 1 })
      this.addSignal('loop_y', { width: 1 })
      this.addAssign({ in: new Expr('loop_y && b_in_valid'), out: 'loop_x' })
      this.addAssign({ in: new Expr('loop_x || a_in_valid'), out: 'loop_y' })
      this.addAssign({ in: new Expr('loop_x'), out: 'loop_out' })
    }

    this.addNoCombinationalPathContract('a_out_ready', 'a_in_ready')
    this.addNoCombinationalPathContract('s_out.ready', 's_in.ready')
    this.addNoCombinationalPathContract('v_out_ready[1]', 'v_in_ready[1]')
  }

  /**
   * A one-entry buffer, `<name>_full`, between the four handshake signals named. Registered, it
   * takes a token only when empty; combinational, also while its token leaves.
   */
  private buffer (name: string, s: { inValid: string, outReady: string, inReady: string, outValid: string }, combinational: boolean): void {
    const full = `${name}_full`
    this.addSignal(full, { width: 1 })
    // Registered: a full buffer empties when its token leaves, an empty one fills when offered one.
    // Combinational: it also refills in the cycle its token leaves.
    const next = combinational ? `${s.inValid} || (${full} && !${s.outReady})` : `${full} ? !${s.outReady} : ${s.inValid}`
    this.addRegister({ d: new Expr(next), clk: 'clk', reset: 'rst_b', q: full })
    this.addAssign({ in: new Expr(combinational ? `!${full} || ${s.outReady}` : `!${full}`), out: s.inReady })
    this.addAssign({ in: new Expr(full), out: s.outValid })
  }
}

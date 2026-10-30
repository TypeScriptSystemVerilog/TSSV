import TSSV, { Expr } from 'tssv/lib/core/TSSV'

/**
 * How a failed check failed, printed under its FAIL line: a `$display` format and the signals it
 * prints, each a path inside the harness (`chk.err_count`).
 */
export interface CheckDetail {
  format: string
  args: string[]
}

/** One check of a harness. Bit i of the harness's `fail` port is `checks[i]`. */
export interface HarnessCheck {
  /** Names the check's fail net, `fail_<name>`, and its FAIL line. */
  name: string
  /** What the check requires. SimTop prints it as `FAIL <name>: <description>`. */
  description: string
  detail?: CheckDetail
}

export interface Harness_Parameters {
  name: string
}

/**
 * Harness — the synthesizable half of a block testbench (doc/framework/testbench.md). A subclass
 * instantiates the DUT and the components that drive and check it, and wires them together.
 * SimTop supplies the clock and reset, and reports the result.
 *
 * Ports: `clk`, `rst_b` (active low, asynchronous) in; `done` and `fail` out.
 *
 *   - `fail` has one bit per check. The component making a check raises its bit when the check
 *     fails, and holds it.
 *   - `done` rises when the test has run to the end. SimTop reads `fail` first, so a check that
 *     fails in the last cycle still fails the run.
 *
 * A subclass calls `check()` once per check and binds the net it returns to the fail output of
 * the component making the check, and calls `finish()` last.
 */
export class Harness extends TSSV.Module {
  /** The checks, in `fail` bit order. */
  readonly checks: HarnessCheck[] = []

  constructor (params: Harness_Parameters) {
    super({ name: params.name })
    this.IOs = {
      clk: { direction: 'input', isClock: 'posedge' },
      rst_b: { direction: 'input', isReset: 'lowasync' },
      done: { direction: 'output' },
      fail: { direction: 'output' }
    }
  }

  /** Adds a check, and returns its fail net, `fail_<name>`, for the component that makes it. */
  check (name: string, description: string, detail?: CheckDetail): string {
    const net = `fail_${name}`
    this.addSignal(net, { width: 1 })
    this.checks.push({ name, description, detail })
    return net
  }

  /**
   * A signal inside a submodule, read by hierarchical reference (`dut.valid_0`): returns a net
   * that carries it, `tap_<path>`, to bind to a checker. For a DUT's internal state, which a
   * spec's timing diagram shows but no port carries. It synthesizes as long as `path` names a
   * signal, not a member reached through an interface port.
   */
  protected tap (path: string, width: number): string {
    const net = `tap_${path.replace(/\./g, '_')}` // each '.' of the path becomes '_'
    this.addSignal(net, { width })
    this.addAssign({ in: new Expr(path), out: net })
    return net
  }

  /** Sizes `fail` to the checks and drives it, bit i from checks[i]. Call it last. */
  protected finish (): void {
    if (this.checks.length === 0) throw Error(`${this.name}: a harness needs at least one check`)
    this.IOs.fail.width = this.checks.length
    const msbFirst = this.checks.map(c => `fail_${c.name}`).reverse().join(', ')
    this.addAssign({ in: new Expr(`{${msbFirst}}`), out: 'fail' })
  }
}

export default Harness

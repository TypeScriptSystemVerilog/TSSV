import TSSV, { Expr } from 'tssv/lib/core/TSSV'

/**
 * A check's detail line: how the check failed, as values from inside the harness. SimTop prints it
 * under the check's FAIL line, as `$display(format, h.<args[0]>, h.<args[1]>, ...)`. A checker that
 * holds its first mismatch supplies one: `VectorChecker.firstError('chk_x64', 'value', 'cycle')`
 * is the format `first differs in cycle %0d: %h, expected %h` over `chk_x64.err_row_value`,
 * `chk_x64.err_got_value` and `chk_x64.err_want_value`, and prints
 * `first differs in cycle 1: 1e2b7e2ad5623bc2, expected 3f2800d6569e01b4`.
 */
export interface CheckDetail {
  /** A `$display` format, with one format specifier per arg */
  format: string
  /** The signals the format prints, each a path from the harness (`chk.err_row_value`) */
  args: string[]
}

/** One check of a harness. Bit i of the harness's `fail` port is `checks[i]`. */
export interface HarnessCheck {
  /** Names the check's fail net, `fail_<name>`, and its FAIL line. */
  name: string
  /** What the check requires. SimTop prints it as `FAIL <name>: <description>`. */
  description: string
  /** How the check failed, printed under its FAIL line. */
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

  /**
   * Adds a check: one requirement on the DUT that the run passes or fails on, such as "pop_data
   * follows the timing diagram". The harness doesn't evaluate it. A component the harness
   * instantiates does, such as a VectorChecker comparing a DUT output with its expected value
   * each cycle, and drives the returned net high at the first violation and holds it. `finish()`
   * gathers the nets into `fail`, and SimTop prints a FAIL line for each one that is high.
   * @param name names the net, `fail_<name>`, and the check in its FAIL line
   * @param description what the check requires, printed as `FAIL <name>: <description>`
   * @param detail how the check failed, printed under the FAIL line (CheckDetail)
   * @returns the fail net, to bind to the fail output of the component that evaluates the check
   */
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

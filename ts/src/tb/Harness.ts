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

/**
 * One clock domain of a harness. SimTop generates its clock and its reset, and the harness has a
 * port pair for it, `clk_<name>` and `rst_b_<name>`.
 */
export interface ClockDomain {
  /** Names the domain's ports, `clk_<name>` and `rst_b_<name>`: lower snake_case. */
  name: string
  /**
   * The clock's period, in SimTop's time units: an even integer, at least 2. A harness without
   * domains has a clock of period 10.
   */
  period: number
  /**
   * How much later than with phase 0 every edge of the clock is: an integer, at least 0. With
   * phase 0, the first rising edge is at period / 2. Default 0.
   */
  phase?: number
  /**
   * Another domain, whose reset is released first. This domain's reset is held for SimTop's
   * `resetCycles` rising edges after that, then released.
   */
  releaseAfter?: string
}

export interface Harness_Parameters {
  name: string
  /**
   * The harness's clock domains, each with its own clock and reset (ClockDomain). Without them,
   * the harness has one clock and one reset, `clk` and `rst_b`.
   */
  domains?: ClockDomain[]
  /**
   * The domain that `done` and every `fail` bit belong to. SimTop reads them at its rising edges,
   * and counts `maxCycles` in its cycles. Required with two or more domains; with one, it is that
   * one.
   */
  reportDomain?: string
}

/**
 * Checks a harness's domains (ClockDomain), and returns its report domain: undefined for a
 * harness without domains.
 */
function checkDomains (harness: string, domains: ClockDomain[], reportDomain?: string): string | undefined {
  if (domains.length === 0) {
    if (reportDomain !== undefined) throw Error(`${harness}: reportDomain is ${reportDomain}, but the harness has no domains`)
    return undefined
  }
  const byName = new Map<string, ClockDomain>()
  for (const d of domains) {
    // A lower snake_case name: a lowercase letter, then lowercase letters, digits and underscores
    if (!/^[a-z][a-z0-9_]*$/.test(d.name)) throw Error(`${harness}: domain name '${d.name}' isn't lower snake_case`)
    if (byName.has(d.name)) throw Error(`${harness}: two domains are named ${d.name}`)
    byName.set(d.name, d)
    if (!Number.isInteger(d.period) || d.period < 2 || d.period % 2 !== 0) throw Error(`${harness}: domain ${d.name}'s period must be an even integer, at least 2, got ${d.period}`)
    if (d.phase !== undefined && (!Number.isInteger(d.phase) || d.phase < 0)) throw Error(`${harness}: domain ${d.name}'s phase must be an integer, at least 0, got ${d.phase}`)
  }
  for (const d of domains) {
    if (d.releaseAfter !== undefined && !byName.has(d.releaseAfter)) throw Error(`${harness}: domain ${d.name} is released after ${d.releaseAfter}, which isn't a domain`)
    // Each step follows one releaseAfter. A chain longer than the number of domains is a cycle
    let next = d.releaseAfter
    for (let steps = 0; next !== undefined; steps++) {
      if (steps === domains.length) throw Error(`${harness}: domain ${d.name}'s releaseAfter leads back to itself`)
      next = byName.get(next)?.releaseAfter
    }
  }
  const report = reportDomain ?? (domains.length === 1 ? domains[0]?.name : undefined)
  if (report === undefined) throw Error(`${harness}: a harness with ${domains.length} domains needs a reportDomain`)
  if (!byName.has(report)) throw Error(`${harness}: reportDomain ${report} isn't a domain`)
  return report
}

/**
 * Harness — the synthesizable half of a block testbench (doc/framework/testbench.md). A subclass
 * instantiates the DUT and the components that drive and check it, and wires them together.
 * SimTop supplies the clock and reset, and reports the result.
 *
 * Ports: `clk`, `rst_b` (active low, asynchronous) in; `done` and `fail` out. A harness that
 * declares clock domains has `clk_<d>` and `rst_b_<d>` for each domain `<d>` in their place.
 *
 *   - `fail` has one bit per check. The component making a check raises its bit when the check
 *     fails, and holds it.
 *   - `done` rises when the test has run to the end. SimTop reads `fail` first, so a check that
 *     fails in the last cycle still fails the run.
 *   - With domains, `done` and `fail` belong to the report domain. A check made in another
 *     domain crosses into it through a synchronizer, as any signal does (SV guide SYN-3).
 *
 * A subclass calls `check()` once per check and binds the net it returns to the fail output of
 * the component making the check, and calls `finish()` last.
 */
export class Harness extends TSSV.Module {
  /** The checks, in `fail` bit order. */
  readonly checks: HarnessCheck[] = []
  /** The clock domains, in the order declared: none for a harness with one `clk` and `rst_b`. */
  readonly domains: ClockDomain[]
  /** The domain that `done` and `fail` belong to: undefined for a harness without domains. */
  readonly reportDomain: string | undefined

  constructor (params: Harness_Parameters) {
    super({ name: params.name })
    this.domains = params.domains ?? []
    this.reportDomain = checkDomains(params.name, this.domains, params.reportDomain)
    const clocks = this.domains.length === 0 ? [''] : this.domains.map(d => `_${d.name}`)
    this.IOs = {}
    for (const s of clocks) {
      this.IOs[`clk${s}`] = { direction: 'input', isClock: 'posedge' }
      this.IOs[`rst_b${s}`] = { direction: 'input', isReset: 'lowasync' }
    }
    this.IOs.done = { direction: 'output' }
    this.IOs.fail = { direction: 'output' }
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

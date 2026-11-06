import TSSV, { Expr } from 'tssv/lib/core/TSSV'
import { type ComponentMemory, type PatternMemoryMode } from './PatternMemory.js'

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
   * `resetCycles` rising edges of its own clock, as every domain's is, and also until that
   * domain's reset is released. It is released at its own next falling edge.
   */
  releaseAfter?: string
}

/**
 * A pattern memory of the harness, as `registerMemories()` records it: the component's
 * description of it (ComponentMemory), with its path from the harness, and where it sits on the
 * harness's load port.
 */
export interface HarnessMemory extends ComponentMemory {
  /** Its instance path from the harness: `inj_s_in.pattern`. Under SimTop, a manifest names it `h.<path>`. */
  path: string
  /** The component instance that holds it: `inj_s_in`. */
  instance: string
  /** The clock domain it loads in: undefined for a harness without domains. */
  domain?: string
  /** Its value on `load_sel`: the order it was registered in, from 0. */
  select: number
  /** Its record count's lowest bit in `records`. */
  recordsLo: number
  /** Its record count's width in `records`: bitWidth(depth). */
  recordsWidth: number
}

/**
 * The widths of a reloaded harness's load port, which SimTop drives (`load_en` is one bit). Every
 * bit is used: the select names every memory, the address and data are as wide as the deepest and
 * widest memory need, and `records` holds every memory's count, packed with memory 0's lowest.
 */
export interface LoadPort {
  selWidth: number
  addrWidth: number
  dataWidth: number
  recordsWidth: number
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
 *
 * **Pattern memories.** A subclass registers each component that holds pattern memories, such as
 * a RecordInjector or RecordChecker, with `registerMemories()`, so that the testbench generator
 * can check a testcase against them and SimTop can load them. Every memory of a harness has one
 * mode. In reloaded mode the harness has one load port for all of them, which SimTop drives while
 * reset is held:
 *
 *   - `load_en`, `load_sel`, `load_addr`, `load_data`: write word `load_data` at `load_addr` of
 *     the memory whose `select` is `load_sel`, on a rising edge of that memory's clock;
 *   - `records`: each memory's record count (HarnessMemory.recordsLo, recordsWidth).
 *
 * The harness decodes the port into each component's own load port. A preloaded harness has no
 * load port, and its ports are as above.
 */
export class Harness extends TSSV.Module {
  /** The checks, in `fail` bit order. */
  readonly checks: HarnessCheck[] = []
  /** The clock domains, in the order declared: none for a harness with one `clk` and `rst_b`. */
  readonly domains: ClockDomain[]
  /** The domain that `done` and `fail` belong to: undefined for a harness without domains. */
  readonly reportDomain: string | undefined
  /** The registered pattern memories, in `load_sel` order (registerMemories()). */
  readonly memories: HarnessMemory[] = []
  /** The components registered, by instance, with the domain they load in. */
  private readonly registered = new Map<string, { component: TSSV.Module, domain?: string }>()
  private finished = false
  private port: LoadPort | undefined

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

  /** The mode of the harness's pattern memories: undefined when it has none. */
  get mode (): PatternMemoryMode | undefined {
    return this.memories[0]?.mode
  }

  /** The load port's widths: undefined unless the harness's memories are reloaded. Set by `finish()`. */
  get loadPort (): LoadPort | undefined {
    return this.port
  }

  /**
   * Registers the pattern memories of `component`, instance `instance` of this harness, and
   * returns the bindings its load port needs, to spread into its `addSubmodule()` call:
   *
   *     const inj = new RecordInjector({ ...,  memory: build.mode, ...build.memory('h.inj_s_in.pattern') })
   *     this.addSubmodule('inj_s_in', inj, { clk: 'clk', ..., ...this.registerMemories('inj_s_in', inj) }, false)
   *
   * In preloaded mode it only records the memories, and returns no bindings. In reloaded mode it
   * also declares the component's load nets, `load_en_<instance>`, `load_addr_<instance>`,
   * `load_data_<instance>`, `load_src_<instance>` (with several memories) and
   * `records_<instance>`, which `finish()` drives from the harness's load port.
   * @param options.domain the clock domain the component runs in, whose clock loads its
   * memories. Required with two or more domains; with one, it is that one.
   */
  protected registerMemories (instance: string, component: TSSV.Module & { readonly memories: readonly ComponentMemory[] }, options: { domain?: string } = {}): Record<string, string> {
    const what = `${this.name}: ${instance}`
    if (this.finished) throw Error(`${what}: registerMemories() comes before finish()`)
    if (this.registered.has(instance)) throw Error(`${what}: is registered twice`)
    const domain = this.loadDomain(what, options.domain)
    const mems = component.memories
    if (mems.length === 0) throw Error(`${what}: has no pattern memories to register`)
    const mode = this.mode ?? mems[0]?.mode
    for (const m of mems) {
      if (m.mode !== mode) throw Error(`${what}: its memory ${m.path} is ${m.mode}, but the harness's memories are ${mode}; every memory of a harness has one mode`)
    }
    this.registered.set(instance, { component, domain })
    for (const m of mems) {
      const last = this.memories[this.memories.length - 1]
      this.memories.push({
        ...m,
        path: `${instance}.${m.path}`,
        instance,
        domain,
        select: this.memories.length,
        recordsLo: last === undefined ? 0 : last.recordsLo + last.recordsWidth,
        recordsWidth: this.bitWidth(m.depth)
      })
    }
    if (mode === 'preloaded') return {}

    // The component's load port, as ComponentMemory says it is, and a net for each of its ports
    const first = mems[0]
    if (first === undefined) return {}
    for (const m of mems) {
      if (m.depth !== first.depth || m.layout.wordWidth !== first.layout.wordWidth) throw Error(`${what}: its memories differ in depth or width, so they can't share one load port`)
    }
    const want: Array<[string, number]> = [
      ['load_en', 1],
      ...(mems.length > 1 ? [['load_src', this.bitWidth(mems.length - 1)] as [string, number]] : []),
      ['load_addr', this.bitWidth(first.depth - 1)],
      ['load_data', first.layout.wordWidth],
      ['records', mems.length * this.bitWidth(first.depth)]
    ]
    const ports = component.ports().plain
    const bindings: Record<string, string> = {}
    for (const [port, width] of want) {
      const p = ports.find(q => q.name === port)
      if (p === undefined || p.direction !== 'input' || p.width !== width) {
        throw Error(`${what}: a reloaded component needs input ${port} of ${width} bits, got ${p === undefined ? 'none' : `${p.direction} ${p.name} of ${p.width}`}`)
      }
      this.addSignal(`${port}_${instance}`, { width })
      bindings[port] = `${port}_${instance}`
    }
    return bindings
  }

  /** The domain a component registered in `what` loads in, checked against the harness's domains. */
  private loadDomain (what: string, domain: string | undefined): string | undefined {
    if (this.domains.length === 0) {
      if (domain !== undefined) throw Error(`${what}: has domain ${domain}, but the harness has no domains`)
      return undefined
    }
    if (domain === undefined) {
      if (this.domains.length > 1) throw Error(`${what}: a harness with ${this.domains.length} domains needs the domain its memories load in`)
      return this.domains[0]?.name
    }
    if (!this.domains.some(d => d.name === domain)) throw Error(`${what}: domain ${domain} isn't one of the harness's domains`)
    return domain
  }

  /**
   * Sizes `fail` to the checks and drives it, bit i from checks[i]. In reloaded mode, also adds
   * the load port and drives each registered component's load nets from it. Call it last.
   */
  protected finish (): void {
    if (this.checks.length === 0) throw Error(`${this.name}: a harness needs at least one check`)
    this.IOs.fail.width = this.checks.length
    const msbFirst = this.checks.map(c => `fail_${c.name}`).reverse().join(', ')
    this.addAssign({ in: new Expr(`{${msbFirst}}`), out: 'fail' })

    // Each registered component is a submodule, clocked by its domain's clock
    for (const [instance, { component, domain }] of this.registered) {
      const sub = this.submodules[instance]
      if (sub?.module !== component) throw Error(`${this.name}: ${instance} is registered, but isn't a submodule of the harness under that name`)
      const clk = domain === undefined ? 'clk' : `clk_${domain}`
      if (String(sub.bindings.clk) !== clk) throw Error(`${this.name}: ${instance} loads in ${clk}, but its clk is bound to ${String(sub.bindings.clk)}`)
    }
    this.finished = true
    if (this.mode === 'reloaded') this.addLoadPort()
  }

  /** The load port, decoded into each registered component's load nets. */
  private addLoadPort (): void {
    const mems = this.memories
    const last = mems[mems.length - 1]
    if (last === undefined) return
    const port: LoadPort = {
      selWidth: Math.max(1, this.bitWidth(mems.length - 1)),
      addrWidth: Math.max(...mems.map(m => this.bitWidth(m.depth - 1))),
      dataWidth: Math.max(...mems.map(m => m.layout.wordWidth)),
      recordsWidth: last.recordsLo + last.recordsWidth
    }
    this.port = port

    // The load port's inputs go after the clocks and resets, before done and fail
    const { done, fail, ...clocks } = this.IOs
    this.IOs = {
      ...clocks,
      load_en: { direction: 'input' },
      load_sel: { direction: 'input', width: port.selWidth },
      load_addr: { direction: 'input', width: port.addrWidth },
      load_data: { direction: 'input', width: port.dataWidth },
      records: { direction: 'input', width: port.recordsWidth },
      done,
      fail
    }

    // Per component: enabled when load_sel names one of its memories, which are consecutive
    const low = (value: string, total: number, width: number, lo = 0): string =>
      width === total ? value : width === 1 ? `${value}[${lo}]` : `${value}[${lo + width - 1}:${lo}]`
    const sw = port.selWidth
    for (const instance of this.registered.keys()) {
      const own = mems.filter(m => m.instance === instance)
      const first = own[0]
      if (first === undefined) continue
      const sels = own.map(m => `load_sel == ${sw}'d${m.select}`)
      this.addAssign({ in: new Expr(`load_en && ${sels.length === 1 ? sels[0] ?? '' : `(${sels.join(' || ')})`}`), out: `load_en_${instance}` })
      if (own.length > 1) {
        const srcWidth = this.bitWidth(own.length - 1)
        const offset = first.select === 0 ? 'load_sel' : `load_sel - ${sw}'d${first.select}`
        this.addAssign({ in: new Expr(srcWidth === sw && first.select === 0 ? 'load_sel' : `${srcWidth}'(${offset})`), out: `load_src_${instance}` })
      }
      this.addAssign({ in: new Expr(low('load_addr', port.addrWidth, this.bitWidth(first.depth - 1))), out: `load_addr_${instance}` })
      this.addAssign({ in: new Expr(low('load_data', port.dataWidth, first.layout.wordWidth)), out: `load_data_${instance}` })
      this.addAssign({ in: new Expr(low('records', port.recordsWidth, own.length * first.recordsWidth, first.recordsLo)), out: `records_${instance}` })
    }
  }
}

export default Harness

import TSSV from 'tssv/lib/core/TSSV'
import { markTestbench } from './testbench.js'
import { type ClockDomain, type Harness } from './Harness.js'

export interface SimTop_Parameters {
  /** The testbench's name: its top module, written to `<name>.sv`. */
  name: string
  harness: Harness
  /** Cycles after reset by which the harness must raise `done`, in its report domain's cycles. */
  maxCycles: number
  /** Rising edges with each rst_b low before it is released. Default 4. */
  resetCycles?: number
}

/** `s` inside an SV string literal: each backslash and each double quote escaped with a backslash. */
const svString = (s: string): string => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
/** `s` as literal text in a $display format: an SV string with each `%` doubled. */
const svFormat = (s: string): string => svString(s).replace(/%/g, '%%')

/**
 * SimTop — the simulation-only top of a block testbench (doc/framework/testbench.md), and the
 * only SV in a testbench that isn't built from TSSV constructs. The same class wraps every
 * harness:
 *
 *   - It generates the clock (period 10) and holds rst_b low for `resetCycles` rising edges,
 *     releasing it at a falling edge.
 *   - For a harness with clock domains, it does the same for each domain, with the domain's
 *     period and phase. A domain with `releaseAfter` is also held until that domain's reset is
 *     released, then released at its own next falling edge.
 *   - At each rising edge after reset it reads the harness's `fail` and then its `done`. For a
 *     set fail bit it prints the check's FAIL line and detail, then calls `$fatal`. When `done`
 *     rises it prints one PASS line and calls `$finish`. It calls `$fatal` if `done` hasn't risen
 *     after `maxCycles`. With domains, these are the report domain's edges and cycles.
 *
 * Failures end in `$fatal`, not `$finish(1)`, because Verilator discards the `$finish` argument:
 * the simulation's exit status is what tells a failed run from a passing one. Build it with
 * `verilator --binary --timing`.
 */
export class SimTop extends TSSV.Module {
  constructor (params: SimTop_Parameters) {
    const h = params.harness
    super({ name: params.name })
    this.IOs = {}
    // Each domain's clock and reset, as the harness names its ports; one pair without domains
    const pairs = h.domains.length === 0
      ? [{ clk: 'clk', rst_b: 'rst_b' }]
      : h.domains.map(d => ({ clk: `clk_${d.name}`, rst_b: `rst_b_${d.name}` }))
    for (const p of pairs) {
      this.addSignal(p.clk, { width: 1 })
      this.addSignal(p.rst_b, { width: 1 })
    }
    this.addSignal('done', { width: 1 })
    this.addSignal('fail', { width: h.checks.length })
    const bindings = Object.fromEntries(pairs.flatMap(p => [[p.clk, p.clk], [p.rst_b, p.rst_b]]))
    this.addSubmodule('h', h, { ...bindings, done: 'done', fail: 'fail' }, false)

    // A harness with one check has a 1-bit fail, which takes no index
    const bit = (i: number): string => h.checks.length === 1 ? 'fail' : `fail[${i}]`
    const failLines = h.checks.flatMap((c, i) => [
      `      if (${bit(i)}) $display("FAIL ${svFormat(c.name)}: ${svFormat(c.description)}");`,
      ...(c.detail === undefined
        ? []
        : [`      if (${bit(i)}) $display("  ${svString(c.detail.format)}", ${c.detail.args.map(a => `h.${a}`).join(', ')});`])
    ])
    const resetCycles = params.resetCycles ?? 4
    // The result at every rising edge of clk after reset, as the body of a process
    const result = (clk: string): string => `  forever begin
    @(posedge ${clk});
    if (fail != '0) begin
${failLines.join('\n')}
      $fatal(1, "${params.name} failed in cycle %0d", cycle);
    end else if (done) begin
      $display("PASS: ${params.name} in %0d cycles", cycle);
      $finish;
    end else if (cycle == ${params.maxCycles}) begin
      $display("FAIL timeout: the harness is not done after ${params.maxCycles} cycles");
      $fatal(1, "${params.name} failed in cycle %0d", cycle);
    end
    cycle = cycle + 1;
  end`

    // The reset and the result are one process, so nothing reads rst_b at a clock edge: the
    // harness's flops use it as an asynchronous reset, and lint -Wall reports a net used both
    // ways (SYNCASYNCNET)
    if (h.domains.length === 0) {
      this.addBody(`
// Clock
initial clk = 1'b0;
always #5 clk = ~clk;

// Reset, then the result at every rising edge after it: fail first, then done
int unsigned cycle;
initial begin
  cycle = 0;
  rst_b = 1'b0;
  repeat (${resetCycles}) @(posedge clk);
  @(negedge clk) rst_b = 1'b1;
${result('clk')}
end
`, { indentMode: 'relative' })
    } else {
      this.addBody(domainsBody(h.domains, h.reportDomain ?? '', resetCycles, result), { indentMode: 'relative' })
    }

    markTestbench(this)
  }
}

/**
 * The clocks and resets of a harness with domains, and the result in its report domain. A domain
 * that another is released after sets `released_<d>` as its reset is released, and the other
 * waits for it, so no process reads another domain's rst_b.
 */
function domainsBody (domains: ClockDomain[], report: string, resetCycles: number, result: (clk: string) => string): string {
  const awaited = new Set(domains.flatMap(d => d.releaseAfter ?? []))
  const lines: string[] = []
  for (const d of domains) {
    const phase = d.phase ?? 0
    lines.push('', `// Clock ${d.name}: period ${d.period}${phase === 0 ? '' : `, phase ${phase}`}`, 'initial begin', `  clk_${d.name} = 1'b0;`)
    if (phase !== 0) lines.push(`  #${phase};`)
    lines.push(`  forever #${d.period / 2} clk_${d.name} = ~clk_${d.name};`, 'end')
  }
  if (awaited.size > 0) {
    lines.push(
      '',
      '// Set when a domain\'s reset is released, for the domains released after it. Set with <=, so',
      '// a domain waiting for it sees it only after every clock edge of that time step, and is',
      '// released at a later falling edge even when the two clocks fall together',
      ...[...awaited].map(n => `bit released_${n};`)
    )
  }

  // A domain's reset process, up to its release: resetCycles of its own clock, and then, with
  // releaseAfter, until that domain's reset is released
  const reset = (d: ClockDomain): string[] => [
    `  rst_b_${d.name} = 1'b0;`,
    `  repeat (${resetCycles}) @(posedge clk_${d.name});`,
    ...(d.releaseAfter === undefined ? [] : [`  wait (released_${d.releaseAfter});`]),
    `  @(negedge clk_${d.name}) rst_b_${d.name} = 1'b1;`,
    ...(awaited.has(d.name) ? [`  released_${d.name} <= 1'b1;`] : [])
  ]
  const after = (d: ClockDomain): string => d.releaseAfter === undefined ? '' : `, released after ${d.releaseAfter}`
  for (const d of domains.filter(d => d.name !== report)) {
    lines.push('', `// Reset ${d.name}${after(d)}`, 'initial begin', ...reset(d), 'end')
  }
  const r = domains.find(d => d.name === report)
  if (r === undefined) throw Error(`report domain ${report} isn't a domain`)
  lines.push(
    '',
    `// Reset ${report}${after(r)}, then the result at every rising edge after it: fail first, then done`,
    'int unsigned cycle;',
    'initial begin',
    '  cycle = 0;',
    ...reset(r),
    result(`clk_${report}`),
    'end',
    ''
  )
  return lines.join('\n')
}

export default SimTop

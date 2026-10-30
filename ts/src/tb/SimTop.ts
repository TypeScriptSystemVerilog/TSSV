import TSSV from 'tssv/lib/core/TSSV'
import { markTestbench } from './testbench.js'
import { type Harness } from './Harness.js'

export interface SimTop_Parameters {
  /** The testbench's name: its top module, written to `<name>.sv`. */
  name: string
  harness: Harness
  /** Cycles after reset by which the harness must raise `done`. */
  maxCycles: number
  /** Rising edges with rst_b low before it is released. Default 4. */
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
 *   - At each rising edge after reset it reads the harness's `fail` and then its `done`. For a
 *     set fail bit it prints the check's FAIL line and detail, then calls `$fatal`. When `done`
 *     rises it prints one PASS line and calls `$finish`. It calls `$fatal` if `done` hasn't risen
 *     after `maxCycles`.
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
    this.addSignal('clk', { width: 1 })
    this.addSignal('rst_b', { width: 1 })
    this.addSignal('done', { width: 1 })
    this.addSignal('fail', { width: h.checks.length })
    this.addSubmodule('h', h, { clk: 'clk', rst_b: 'rst_b', done: 'done', fail: 'fail' }, false)

    const failLines = h.checks.flatMap((c, i) => [
      `      if (fail[${i}]) $display("FAIL ${svFormat(c.name)}: ${svFormat(c.description)}");`,
      ...(c.detail === undefined
        ? []
        : [`      if (fail[${i}]) $display("  ${svString(c.detail.format)}", ${c.detail.args.map(a => `h.${a}`).join(', ')});`])
    ])

    // The reset and the result are one process, so nothing reads rst_b at a clock edge: the
    // harness's flops use it as an asynchronous reset, and lint -Wall reports a net used both
    // ways (SYNCASYNCNET)
    this.addBody(`
// Clock
initial clk = 1'b0;
always #5 clk = ~clk;

// Reset, then the result at every rising edge after it: fail first, then done
int unsigned cycle;
initial begin
  cycle = 0;
  rst_b = 1'b0;
  repeat (${params.resetCycles ?? 4}) @(posedge clk);
  @(negedge clk) rst_b = 1'b1;
  forever begin
    @(posedge clk);
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
  end
end
`, { indentMode: 'relative' })

    markTestbench(this)
  }
}

export default SimTop

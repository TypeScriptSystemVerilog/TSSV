import TSSV from 'tssv/lib/core/TSSV'
import { markTestbench } from './testbench.js'
import { type ClockDomain, type Harness, type LoadPort } from './Harness.js'
import { type Manifest } from './patternFile.js'

export interface SimTop_Parameters {
  /** The testbench's name: its top module, written to `<name>.sv`. */
  name: string
  harness: Harness
  /** Cycles after reset by which the harness must raise `done`, in its report domain's cycles. */
  maxCycles: number
  /** Rising edges with each rst_b low before it is released. Default 4. */
  resetCycles?: number
  /**
   * Reloaded mode only: the load list the loader reads (formatLoadList()), relative to the
   * directory the simulation runs in. Default `patterns/load.txt` (DEFAULT_LOAD_LIST).
   */
  loadList?: string
}

/** Where a reloaded SimTop reads its load list, relative to the directory the simulation runs in. */
export const DEFAULT_LOAD_LIST = 'patterns/load.txt'

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
 *
 * For a harness whose pattern memories are reloaded (Harness.registerMemories()), SimTop also
 * loads them, so one build runs any testcase that fits its memories. Its loader reads the load
 * list (formatLoadList()) at run time: the testcase's name, then one line per memory, in the
 * harness's `load_sel` order, with its path, its record count and its pattern file. It checks
 * each line's path and that the count fits the memory, reads the file with `$readmem`, sets the
 * memory's count on `records`, and writes each word through the harness's load port at a falling
 * edge of the memory's clock. Every reset is held until the loader is done. The PASS and FAIL
 * lines then name the testcase.
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

    // Reloaded mode: the harness's load port, and an array per memory for its file's words
    const port = h.loadPort
    if (h.mode === 'reloaded' && port === undefined) throw Error(`${params.name}: harness ${h.name} has reloaded memories but no load port; it must call finish()`)
    if (port !== undefined) {
      for (const [net, width] of [['load_en', 1], ['load_sel', port.selWidth], ['load_addr', port.addrWidth], ['load_data', port.dataWidth], ['records', port.recordsWidth]] as const) {
        this.addSignal(net, { width })
        bindings[net] = net
      }
      for (const m of h.memories) this.addSignal(`words_${m.select}`, { width: m.layout.wordWidth, isArray: BigInt(m.depth) })
    }
    this.addSubmodule('h', h, { ...bindings, done: 'done', fail: 'fail' }, false)
    const reloaded = port !== undefined
    // In reloaded mode the result names the testcase the loader read
    const named = reloaded ? ', testcase %s' : ''
    const namedArg = reloaded ? ', testcase' : ''

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
      $fatal(1, "${params.name}${named} failed in cycle %0d"${namedArg}, cycle);
    end else if (done) begin
      $display("PASS: ${params.name}${named} in %0d cycles"${namedArg}, cycle);
      $finish;
    end else if (cycle == ${params.maxCycles}) begin
      $display("FAIL timeout: the harness is not done after ${params.maxCycles} cycles");
      $fatal(1, "${params.name}${named} failed in cycle %0d"${namedArg}, cycle);
    end
    cycle = cycle + 1;
  end`

    // The reset and the result are one process, so nothing reads rst_b at a clock edge: the
    // harness's flops use it as an asynchronous reset, and lint -Wall reports a net used both
    // ways (SYNCASYNCNET)
    // The loader first, so the resets and the result read names declared above them
    if (port !== undefined) this.addBody(loaderBody(params.name, h, port, params.loadList ?? DEFAULT_LOAD_LIST), { indentMode: 'relative' })
    if (h.domains.length === 0) {
      this.addBody(`
// Clock
initial clk = 1'b0;
always #5 clk = ~clk;

// Reset${reloaded ? ', held until the loader is done' : ''}, then the result at every rising edge after it: fail first, then done
int unsigned cycle;
initial begin
  cycle = 0;
  rst_b = 1'b0;
  repeat (${resetCycles}) @(posedge clk);${reloaded ? '\n  wait (loaded);' : ''}
  @(negedge clk) rst_b = 1'b1;
${result('clk')}
end
`, { indentMode: 'relative' })
    } else {
      this.addBody(domainsBody(h.domains, h.reportDomain ?? '', resetCycles, result, reloaded), { indentMode: 'relative' })
    }

    markTestbench(this)
  }
}

/**
 * The clocks and resets of a harness with domains, and the result in its report domain. A domain
 * that another is released after sets `released_<d>` as its reset is released, and the other
 * waits for it, so no process reads another domain's rst_b.
 */
function domainsBody (domains: ClockDomain[], report: string, resetCycles: number, result: (clk: string) => string, reloaded: boolean): string {
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
    ...(reloaded ? ['  wait (loaded);'] : []),
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

/**
 * The loader of a reloaded SimTop: reads the load list, and writes each memory's words through the
 * harness's load port at falling edges of the memory's clock, then sets `loaded`.
 */
function loaderBody (top: string, h: Harness, port: LoadPort, loadList: string): string {
  const list = svFormat(loadList)
  // A field of a wider bus: the whole bus, one bit, or a range
  const bits = (value: string, total: number, lo: number, width: number): string =>
    width === total ? value : width === 1 ? `${value}[${lo}]` : `${value}[${lo + width - 1}:${lo}]`
  const lines = [
    '',
    '// The loader: reads the load list, then writes each pattern memory through the harness\'s',
    '// load port, a word per falling edge of the memory\'s clock, while every reset is held. Set',
    '// with <=, as released_<d> is, so a reset waiting for it is released at a later falling edge',
    'string testcase;',
    'string load_path;',
    'string load_file;',
    'int load_fd;',
    'int load_n;',
    'bit loaded;',
    'initial begin',
    "  load_en = 1'b0;",
    "  load_sel = '0;",
    "  load_addr = '0;",
    "  load_data = '0;",
    "  records = '0;",
    `  load_fd = $fopen("${svString(loadList)}", "r");`,
    `  if (load_fd == 0) $fatal(1, "${top}: can't open ${list}");`,
    `  if ($fscanf(load_fd, "testcase %s\\n", testcase) != 1) $fatal(1, "${top}: ${list} doesn't start with its testcase");`
  ]
  for (const m of h.memories) {
    const k = m.select
    const clk = m.domain === undefined ? 'clk' : `clk_${m.domain}`
    const path = `h.${m.path}`
    const word = m.layout.wordWidth === port.dataWidth ? `words_${k}[i]` : `${port.dataWidth}'(words_${k}[i])`
    lines.push(
      `  // ${path}: load_sel ${k}, ${m.depth} words of ${m.layout.wordWidth} bits, on ${clk}`,
      `  if ($fscanf(load_fd, "%s %d %s\\n", load_path, load_n, load_file) != 3 || load_path != "${path}") begin`,
      `    $fatal(1, "${top}: line ${k + 2} of ${list} isn't for ${path}");`,
      '  end',
      `  if (load_n < 0 || load_n > ${m.depth}) $fatal(1, "${top}: ${list} has %0d records for ${path}, which holds ${m.depth}", load_n);`,
      `  if (load_n > 0) $readmem${m.layout.radix}(load_file, words_${k});`,
      `  ${bits('records', port.recordsWidth, m.recordsLo, m.recordsWidth)} = ${m.recordsWidth}'(load_n);`,
      '  for (int i = 0; i < load_n; i++) begin',
      `    @(negedge ${clk});`,
      `    load_sel = ${port.selWidth}'d${k};`,
      `    load_addr = ${port.addrWidth}'(i);`,
      `    load_data = ${word};`,
      "    load_en = 1'b1;",
      '  end',
      `  if (load_n > 0) @(negedge ${clk}) load_en = 1'b0;`
    )
  }
  lines.push('  $fclose(load_fd);', "  loaded <= 1'b1;", 'end', '')
  return lines.join('\n')
}

/**
 * The load list of a reloaded SimTop for testcase `manifest`, which SimTop reads at run time: a
 * line `testcase <name>`, then one line per memory of `harness`, in `load_sel` order:
 * `h.<path> <records> <patterns>/<file>`. `patterns` is the manifest's folder, as the simulation
 * sees it. Every memory needs a file in the manifest, and no path may hold whitespace, which would
 * split the line's words.
 */
export function formatLoadList (harness: Harness, manifest: Manifest, patterns = 'patterns'): string {
  if (harness.mode !== 'reloaded') throw Error(`formatLoadList: harness ${harness.name}'s memories aren't reloaded`)
  const lines = [`testcase ${manifest.testcase}`]
  for (const m of harness.memories) {
    const path = `h.${m.path}`
    const f = manifest.files.find(f => f.memory === path)
    if (f === undefined) throw Error(`formatLoadList: testcase ${manifest.testcase} has no file for ${path}`)
    const file = `${patterns}/${f.file}`
    if (/\s/.test(file)) throw Error(`formatLoadList: the path ${JSON.stringify(file)} has whitespace, which a load list can't hold`) // any whitespace
    lines.push(`${path} ${f.records} ${file}`)
  }
  return `${lines.join('\n')}\n`
}

export default SimTop

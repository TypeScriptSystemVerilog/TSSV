/**
 * Self-checking test of the scoped views prototype (#109 spike): Module.inView(), Module.views(),
 * Module.defineView() and the null view (Module.setNullView()).
 *
 * ViewTop is shaped like #232's harness: a simulation-only check whose `fail` is tied to 0 in every
 * other build, a vendor view with a view nested in it, and RTL for either of two vendors.
 *
 * Test 1: ViewTop lints clean under -Wall with each set of views defined, and with none
 * Test 2: what the SV looks like: one `ifdef chain per group, the OR list repeated, a register in
 *         a view in an always_ff of its own, a file reached only through views included under them
 * Test 3: a build without TSSV_SIM never reads the simulation-only check's file
 * Test 4: activeViews, and the errors: a signal used outside its view, a port in a view
 * Test 5: a view with lint off (#232): a module reached only through it is written unchecked,
 *         and the same module reached from the top level throws
 * Test 6: the null view: Heavy's stub, and both ways a build picks it up in place of Heavy
 * Test 7: the view examples under doc/examples/core/ (`npm run docs:examples`) lint clean with
 *         each set of their views defined, and with none
 */
import { Module, Expr, TSSV_ROOT, type TSSVParameters, type ViewCondition } from 'tssv/lib/core/TSSV'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { existsSync, readdirSync, readFileSync, rmSync } from 'fs'
import { spawnSync } from 'child_process'

const OUT = 'sv-examples/Core/views'
// A stale file from an earlier run would otherwise be linted with the new ones
rmSync(OUT, { recursive: true, force: true })

let passed = 0
let failed = 0

function check (label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS: ${label}`)
    passed++
  } else {
    console.error(`FAIL: ${label}${detail !== undefined ? `\n  ${detail}` : ''}`)
    failed++
  }
}

function errorOf (build: () => void): string {
  try {
    build()
  } catch (e) {
    return (e as Error).message
  }
  return ''
}

const CLK = { direction: 'input', isClock: 'posedge' } as const
const RST = { direction: 'input', isReset: 'lowasync' } as const
const BYTE_IN = { direction: 'input', width: 8 } as const
const BYTE_OUT = { direction: 'output', width: 8 } as const

// The simulation-only view, as #232 uses it: its RTL isn't linted
Module.defineView('TSSV_SIM', { lint: false })

/** Flags a value above a limit, a cycle later: the kind of check #232 keeps out of synthesis */
class RangeCheck extends Module {
  constructor (params: TSSVParameters & { name: string }) {
    super(params)
    this.IOs = { clk: CLK, rst_b: RST, value: BYTE_IN, limit: BYTE_IN, fail: { direction: 'output' } }
    this.addSignal('over', {})
    this.addAssign({ in: new Expr('value > limit'), out: 'over' })
    this.addRegister({ d: 'over', clk: 'clk', reset: 'rst_b', q: 'fail' })
  }
}

const views: Record<string, readonly ViewCondition[]> = {}

class ViewTop extends Module {
  constructor () {
    super({ name: 'ViewTop' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, x_q: BYTE_OUT, fail: { direction: 'output' }, over: { direction: 'output' } }
    views.top = this.activeViews
    this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
    // A simulation-only check; every other build ties its fail off
    this.views({
      TSSV_SIM: () => {
        this.addSignal('chk_fail', {})
        this.addSubmodule('u_chk', new RangeCheck({ name: 'SimRangeCheck' }),
          { clk: 'clk', rst_b: 'rst_b', value: 'q', limit: 200n, fail: 'chk_fail' }, false)
        this.addAssign({ in: new Expr('chk_fail'), out: 'fail' })
      },
      default: () => {
        this.addAssign({ in: new Expr("1'b0"), out: 'fail' })
      }
    })
    // The constant the check declared (200), used at the top level too: it moves out of the view
    this.addSubmodule('u_over', new RangeCheck({ name: 'RangeCheck' }),
      { clk: 'clk', rst_b: 'rst_b', value: 'd', limit: 200n, fail: 'over' }, false)
    // A vendor view with a view nested in it; its register shares the top level's clock and reset
    this.views({
      TSSV_XILINX: () => {
        this.addSignal('x_d', { width: 8 })
        this.addAssign({ in: new Expr('~d'), out: 'x_d' })
        this.addSignal('x_stage', { width: 8 })
        this.addRegister({ d: 'x_d', clk: 'clk', reset: 'rst_b', q: 'x_stage' })
        this.views({
          TSSV_ULTRASCALE: () => {
            views.nested = this.activeViews
            this.addRegister({ d: 'x_stage', clk: 'clk', reset: 'rst_b', q: 'x_q' })
          },
          default: () => {
            this.addAssign({ in: new Expr('x_stage'), out: 'x_q' })
          }
        })
      },
      default: () => {
        this.addAssign({ in: new Expr('d'), out: 'x_q' })
      }
    })
    // RTL for either vendor
    this.inView(['TSSV_XILINX', 'TSSV_ALTERA'], () => {
      this.addSignal('unused_fpga_fail', {})
      this.addSubmodule('u_fpga_chk', new RangeCheck({ name: 'FpgaRangeCheck' }),
        { clk: 'clk', rst_b: 'rst_b', value: 'd', limit: 100n, fail: 'unused_fpga_fail' }, false)
    })
  }
}

const files = new ViewTop().writeSystemVerilogFiles(OUT)
const top = readFileSync(`${OUT}/ViewTop.sv`, 'utf8')

// ---- Test 1: each view lints clean --------------------------------------------------------
const probe = spawnSync('verilator', ['--version'], { encoding: 'utf8' })
const haveVerilator = probe.status === 0
const verilator = (args: string[]): { ok: boolean, out: string } => {
  const run = spawnSync('verilator', args, { encoding: 'utf8', maxBuffer: 1 << 26 })
  return { ok: run.status === 0, out: `${run.stdout}${run.stderr}` }
}
const lintArgs = ['--lint-only', '-Wall', `${TSSV_ROOT}/doc/rtl-style/sv-style/common_waivers.vlt`]
const defineArgs = (defines: string[]): string[] => defines.map(d => `+define+${d}`)
if (haveVerilator) {
  for (const defines of [[], ['TSSV_SIM'], ['TSSV_XILINX'], ['TSSV_XILINX', 'TSSV_ULTRASCALE'], ['TSSV_ALTERA'], ['TSSV_SIM', 'TSSV_XILINX']]) {
    const run = verilator([...lintArgs, '--top-module', 'ViewTop', '+define+USE_INCLUDES', ...defineArgs(defines), `+incdir+${OUT}`, `${OUT}/ViewTop.sv`])
    check(`ViewTop lints clean with ${defines.length === 0 ? 'no view' : defines.join(' and ')} defined`, run.ok, run.out)
  }
} else {
  console.log('SKIP: Verilator lints (verilator not found)')
}

// ---- Test 2: the emitted SV ---------------------------------------------------------------
// Lines of the file, each trimmed, to compare runs of them
const lines = top.split('\n').map(l => l.trim())
const run = (...want: string[]): boolean => lines.some((_, i) => want.every((w, k) => lines[i + k] === w))
check('the simulation-only group is one `ifdef / `else chain', run('`ifdef TSSV_SIM') && lines.includes('`else') && lines.includes('`endif'))
check('the OR list repeats its RTL under `ifdef TSSV_XILINX / `elsif TSSV_ALTERA',
  lines.filter(l => l.startsWith('FpgaRangeCheck u_fpga_chk')).length === 2 && lines.includes('`elsif TSSV_ALTERA'), top)
check('a register in a view gets an always_ff of its own: three blocks for three scopes',
  lines.filter(l => l.startsWith('always_ff')).length === 3, top)
check('a file reached only through a view is included under it',
  run('`ifdef TSSV_SIM', '`include "SimRangeCheck.sv"', '`endif') &&
    run('`ifdef TSSV_XILINX', '`include "FpgaRangeCheck.sv"', '`elsif TSSV_ALTERA', '`include "FpgaRangeCheck.sv"', '`endif'), top)
const at = lines.indexOf('`include "RangeCheck.sv"')
// The line before it isn't a view's directive: `ifdef, `elsif, `ifndef or `else, then a TSSV_ macro
check('a file reached from the top level is included unconditionally',
  at > 0 && !/^`(ifdef|elsif|ifndef|else) TSSV_/.test(lines[at - 1] ?? ''), top)
// The module's text, after the include block, so the first `ifdef TSSV_SIM there is the view's
const definition = top.slice(top.indexOf('module ViewTop'))
check('a constant first declared in a view moves out to the top level when the top level uses it too',
  definition.split("8'd200").length === 2 && definition.indexOf("8'd200") < definition.indexOf('`ifdef TSSV_SIM'), top)
check('every module is written', ['ViewTop', 'RangeCheck', 'SimRangeCheck', 'FpgaRangeCheck'].every(n => files.includes(`${OUT}/${n}.sv`)), files.join(', '))

// Two views beside each other that bind the same constant each get a copy of their own: one
// shared at the top level would be unused, and fail -Wall, in a build that defines neither
class Siblings extends Module {
  constructor () {
    super({ name: 'Siblings' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, y: { direction: 'output' } }
    const bind = (limit: bigint | string): Record<string, string | bigint> => ({ clk: 'clk', rst_b: 'rst_b', value: 'd', limit, fail: 'y' })
    this.views({
      TSSV_XILINX: () => { this.addSubmodule('u_x', new RangeCheck({ name: 'RangeCheck' }), bind(50n), false) },
      TSSV_ALTERA: () => { this.addSubmodule('u_a', new RangeCheck({ name: 'RangeCheck' }), bind(50n), false) },
      default: () => { this.addSubmodule('u_d', new RangeCheck({ name: 'RangeCheck' }), bind('d'), false) }
    })
  }
}
new Siblings().writeSystemVerilogFiles(`${OUT}/siblings`)
const siblings = readFileSync(`${OUT}/siblings/Siblings.sv`, 'utf8')
check('views beside each other declare their own copies of a constant',
  siblings.includes("const_w8u50 = 8'd50") && siblings.includes("const_w8u50_v2 = 8'd50") &&
    siblings.indexOf('const_w8u50') > siblings.indexOf('`ifdef TSSV_XILINX', siblings.indexOf('module Siblings')), siblings)
if (haveVerilator) {
  for (const defines of [[], ['TSSV_XILINX'], ['TSSV_ALTERA']]) {
    const lint = verilator([...lintArgs, '--top-module', 'Siblings', '+define+USE_INCLUDES', ...defineArgs(defines), `+incdir+${OUT}/siblings`, `${OUT}/siblings/Siblings.sv`])
    check(`Siblings lints clean with ${defines.length === 0 ? 'no view' : defines.join(' and ')} defined`, lint.ok, lint.out)
  }
}

// ---- Test 3: a build without TSSV_SIM never reads the check -------------------------------
if (haveVerilator) {
  const pre = (defines: string[]): string => verilator(['-E', '+define+USE_INCLUDES', ...defineArgs(defines), `+incdir+${OUT}`, `${OUT}/ViewTop.sv`]).out
  check('a build without TSSV_SIM never reads SimRangeCheck.sv', !pre([]).includes('SimRangeCheck.sv'))
  check('a build with TSSV_SIM reads it', pre(['TSSV_SIM']).includes('SimRangeCheck.sv'))
}

// ---- Test 4: activeViews and the scope errors ---------------------------------------------
check('activeViews is empty at the top level', JSON.stringify(views.top) === '[]', JSON.stringify(views.top))
check('activeViews lists the nested views, outermost first',
  JSON.stringify(views.nested) === JSON.stringify([{ anyOf: ['TSSV_XILINX'] }, { anyOf: ['TSSV_ULTRASCALE'] }]), JSON.stringify(views.nested))

class Leaky extends Module {
  constructor (use: 'top' | 'sibling') {
    super({ name: 'Leaky' })
    this.IOs = { a: { direction: 'input' }, y: { direction: 'output' } }
    this.views({
      TSSV_SIM: () => { this.addSignal('sim_only', {}) },
      TSSV_XILINX: () => { if (use === 'sibling') this.addAssign({ in: new Expr('a'), out: 'sim_only' }) }
    })
    if (use === 'top') this.addAssign({ in: new Expr('a'), out: 'sim_only' })
  }
}
const leakTop = errorOf(() => new Leaky('top'))
check('a signal declared in a view and used outside it throws', leakTop.includes('signal sim_only is declared in view TSSV_SIM') && leakTop.includes('outside it'), leakTop)
const leakSibling = errorOf(() => new Leaky('sibling'))
check('a signal declared in a view and used in a sibling view throws', leakSibling.includes('in view TSSV_XILINX'), leakSibling)
const portError = errorOf(() => {
  const m = new Module({ name: 'PortInView' })
  m.inView(['TSSV_SIM'], () => { m.addInterface('mem', new Memory({ type: 'rd_only' }, 'inward')) })
})
check('an interface port declared in a view throws', portError.includes("interface port mem can't be declared in a view"), portError)
check('a bad view name throws', errorOf(() => { new Module({ name: 'BadView' }).inView(['NOT-A-MACRO'], () => {}) }).includes('not a legal macro name'))

// ---- Test 5: a view with lint off ---------------------------------------------------------
/** A check with a flop and no reset: it breaks RST-5, which a simulation-only view doesn't mind */
class SloppyCheck extends Module {
  constructor () {
    super({ name: 'SloppyCheck' })
    this.IOs = { clk: CLK, value: BYTE_IN, seen: { direction: 'output', width: 8 } }
    this.addRegister({ d: 'value', clk: 'clk', q: 'seen' })
  }
}
class SimOnlyTop extends Module {
  constructor (simOnly: boolean) {
    super({ name: 'SimOnlyTop' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT }
    const instantiate = (): void => { this.addSubmodule('u_sloppy', new SloppyCheck(), { clk: 'clk', value: 'd', seen: 'q' }, false) }
    if (simOnly) {
      this.views({ TSSV_SIM: instantiate, default: () => { this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' }) } })
    } else {
      instantiate()
    }
  }
}
const simOnlyError = errorOf(() => new SimOnlyTop(true).writeSystemVerilogFiles(`${OUT}/sim_only`))
check('a module reached only through a view with lint off is written without the SV-guide check', simOnlyError === '', simOnlyError)
const checkedError = errorOf(() => new SimOnlyTop(false).writeSystemVerilogFiles(`${OUT}/errors/checked`))
check('the same module reached from the top level is checked, and fails RST-5', checkedError.includes('SloppyCheck') && checkedError.includes('RST-5'), checkedError)
// A linted view is checked with its macro defined, and the error names the macro
class XilinxNoReset extends Module {
  constructor () {
    super({ name: 'XilinxNoReset' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT }
    this.views({
      TSSV_XILINX: () => { this.addRegister({ d: 'd', clk: 'clk', q: 'q' }) },
      default: () => { this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' }) }
    })
  }
}
const viewError = errorOf(() => new XilinxNoReset().writeSystemVerilogFiles(`${OUT}/errors/view`))
check('a linted view that breaks the SV guide throws, naming its macro',
  viewError.includes('RST-5') && viewError.endsWith('(with TSSV_XILINX defined)'), viewError)
if (haveVerilator) {
  const run = verilator([...lintArgs, '--top-module', 'SimOnlyTop', '+define+USE_INCLUDES', `+incdir+${OUT}/sim_only`, `${OUT}/sim_only/SimOnlyTop.sv`])
  check('SimOnlyTop\'s synthesizable view lints clean without reading SloppyCheck.sv', run.ok, run.out)
}

// ---- Test 6: the null view ----------------------------------------------------------------
class HeavyLeaf extends Module {
  constructor () {
    super({ name: 'HeavyLeaf' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT }
    this.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
  }
}
class Heavy extends Module {
  constructor () {
    super({ name: 'Heavy' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, ready: { direction: 'output' } }
    this.addSignal('mid', { width: 8 })
    this.addSubmodule('u_leaf', new HeavyLeaf(), { clk: 'clk', rst_b: 'rst_b', d: 'd', q: 'mid' }, false)
    this.addSubmodule('u_leaf2', new HeavyLeaf(), { clk: 'clk', rst_b: 'rst_b', d: 'mid', q: 'q' }, false)
    this.addConstSignal('one', 1n)
    this.addAssign({ in: new Expr('one'), out: 'ready' })
    this.setNullView({ ties: { ready: 1n } })
  }
}
class NullTop extends Module {
  constructor () {
    super({ name: 'NullTop' })
    this.IOs = { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, ready: { direction: 'output' } }
    this.addSubmodule('u_heavy', new Heavy(), {}, true)
  }
}
const GEN = `${OUT}/null_view/gen`
const NULL = `${OUT}/null_view/null`
const genFiles = new NullTop().writeSystemVerilogFiles(GEN, { nullViewDir: NULL })
const stub = existsSync(`${NULL}/Heavy.sv`) ? readFileSync(`${NULL}/Heavy.sv`, 'utf8') : ''
check('the null view is written for Heavy only', readdirSync(NULL).join(', ') === 'Heavy.sv', readdirSync(NULL).join(', '))
check('the null view has Heavy\'s guard, ties its outputs and includes nothing',
  stub.startsWith('`ifndef DEF__Heavy__\n`define DEF__Heavy__\n') && stub.includes("assign ready = 1'd1;") &&
    stub.includes("assign q = '0;") && !stub.includes('`include'), stub)
check('setNullView throws for a tie that names no output',
  errorOf(() => { new Heavy().setNullView({ ties: { d: 1n } }) }).includes('d is not an output port'))

if (haveVerilator) {
  const stubLint = verilator([...lintArgs, '--top-module', 'Heavy', `${NULL}/Heavy.sv`])
  check('the null view lints clean on its own', stubLint.ok, stubLint.out)
  // Which definitions a build compiles, from Verilator's preprocessed output: the stub's
  // unused_inputs sink, the real Heavy's u_leaf instance, and HeavyLeaf's module
  const reads = (args: string[]): { stub: boolean, real: boolean, leaf: boolean } => {
    const text = verilator(['-E', ...args]).out
    return { stub: text.includes('assign unused_inputs'), real: text.includes('u_leaf'), leaf: text.includes('module HeavyLeaf') }
  }
  // Each route compiles the stub in place of Heavy. With USE_INCLUDES nothing below Heavy is read;
  // without it every file is named, so HeavyLeaf is read but nothing instantiates it.
  const routes: Array<{ label: string, args: string[], leaf: boolean }> = [
    { label: '+incdir+ route: the null folder ahead of the generated one', leaf: false, args: ['+define+USE_INCLUDES', `+incdir+${NULL}`, `+incdir+${GEN}`, `${GEN}/NullTop.sv`] },
    { label: 'read-first route with USE_INCLUDES: the stub named before the top', leaf: false, args: ['+define+USE_INCLUDES', `+incdir+${GEN}`, `${NULL}/Heavy.sv`, `${GEN}/NullTop.sv`] },
    { label: 'read-first route without USE_INCLUDES: the stub named before every file', leaf: true, args: [`${NULL}/Heavy.sv`, ...genFiles] }
  ]
  for (const { label, args, leaf } of routes) {
    const r = reads(args)
    check(`${label}: compiles the stub, not the real Heavy${leaf ? '' : ', and reads nothing below it'}`,
      r.stub && !r.real && r.leaf === leaf, JSON.stringify(r))
    const lint = verilator([...lintArgs, '--top-module', 'NullTop', ...args])
    check(`${label}: lints clean`, lint.ok, lint.out)
  }
  // The reverse order on the include path picks the real Heavy: the order is what selects
  const reverse = reads(['+define+USE_INCLUDES', `+incdir+${GEN}`, `+incdir+${NULL}`, `${GEN}/NullTop.sv`])
  check('the generated folder ahead of the null one compiles the real Heavy', !reverse.stub && reverse.real && reverse.leaf, JSON.stringify(reverse))
}

// ---- Test 7: the view examples lint clean -------------------------------------------------
// Each example's top, under doc/examples/core/<example>/, and the sets of views it is linted
// with besides none
const EXAMPLES: Array<{ example: string, top: string, sets: string[][] }> = [
  { example: 'inView', top: 'InViewExample', sets: [['TSSV_SIM']] },
  { example: 'inView', top: 'ViewListExample', sets: [['TSSV_SIM'], ['TSSV_FPV'], ['TSSV_SIM', 'TSSV_FPV']] },
  { example: 'inView', top: 'ViewRegistersExample', sets: [['TSSV_SIM']] },
  { example: 'inView', top: 'ViewLayoutExample', sets: [['TSSV_SIM'], ['TSSV_SIM', 'TSSV_TRACE']] },
  { example: 'views', top: 'ViewsExample', sets: [['TSSV_SIM']] },
  { example: 'views', top: 'ViewsNoDefaultExample', sets: [['TSSV_SIM'], ['TSSV_FPV'], ['TSSV_SIM', 'TSSV_FPV']] },
  { example: 'views', top: 'NestedViewsExample', sets: [['TSSV_XILINX'], ['TSSV_XILINX', 'TSSV_ULTRASCALE']] },
  { example: 'views', top: 'SharedConstantExample', sets: [['TSSV_SIM']] },
  { example: 'views', top: 'SiblingConstantExample', sets: [['TSSV_XILINX'], ['TSSV_ALTERA']] },
  { example: 'views', top: 'ViewIncludesExample', sets: [['TSSV_SIM'], ['TSSV_FPV'], ['TSSV_SIM', 'TSSV_FPV']] },
  { example: 'activeViews', top: 'ActiveViewsExample', sets: [['TSSV_SIM']] },
  { example: 'activeViews', top: 'ActiveViewsNestedExample', sets: [['TSSV_XILINX'], ['TSSV_XILINX', 'TSSV_ULTRASCALE']] },
  { example: 'defineView', top: 'DefineViewExample', sets: [['TSSV_SIM']] },
  { example: 'setNullView', top: 'NullViewExample', sets: [] }
]
if (haveVerilator) {
  for (const { example, top, sets } of EXAMPLES) {
    const dir = `${TSSV_ROOT}/doc/examples/core/${example}`
    for (const defines of [[], ...sets]) {
      const lint = verilator([...lintArgs, '--top-module', top, '+define+USE_INCLUDES', ...defineArgs(defines), `+incdir+${dir}`, `${dir}/${top}.sv`])
      check(`example ${top} lints clean with ${defines.length === 0 ? 'no view' : defines.join(' and ')} defined`, lint.ok, lint.out)
    }
  }
  const nullStub = `${TSSV_ROOT}/doc/examples/core/setNullView/null/NullViewExample.sv`
  const stubLint = verilator([...lintArgs, '--top-module', 'NullViewExample', nullStub])
  check('example NullViewExample\'s null view lints clean', stubLint.ok, stubLint.out)
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

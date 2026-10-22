/**
 * Self-checking test for Module.writeSystemVerilogFiles(), which writes one guarded file per
 * module and interface (#172).
 *
 * The design has three levels, a leaf with two parameter sets, one of them instantiated by two
 * different parents, an interface port on each mid-level module joined by a bundle in the top,
 * and two imported SV modules: one plain, one that already has the include guard.
 *
 * Test 1: each file defines one module or interface, named after the file, and together they
 *         define what the single-file emission does
 * Test 2: each file has the include guard, and its includes come before it in the returned list
 * Test 3: imported SV is guarded once, and a guarded source is written unchanged
 * Test 4: parseSVModules still reads a guarded module's header
 * Test 5: Verilator lints the files with USE_INCLUDES naming only the top, without it naming
 *         every file, and with both, so that every file is reached twice
 * Test 6: writeSystemVerilog() is unchanged by a writeSystemVerilogFiles() call
 * Test 7: names that differ only in case, and names that aren't identifiers, throw before
 *         anything is written
 */
import { Module, Expr, type TSSVParameters } from 'tssv/lib/core/TSSV'
import { Memory } from 'tssv/lib/interfaces/Memory'
import { parseSVModules } from 'tssv/lib/core/SVModuleHeader'
import { existsSync, readFileSync, rmSync } from 'fs'
import { basename } from 'path'
import { spawnSync } from 'child_process'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'

const OUT = 'sv-examples/Core/perModuleFiles'
const FIXTURES = 'ts/test/perModuleFiles'
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

/** Every top-level module/interface DEFINED in `sv` - not those merely instantiated. */
function definitions (sv: string): Set<string> {
  const names = new Set<string>()
  for (const line of sv.split('\n')) {
    // `module` or `interface` at the start of a line, then the identifier it defines, captured.
    // An instantiation is indented and starts with the module's name, so it doesn't match.
    const m = /^(?:module|interface)\s+([A-Za-z_][A-Za-z0-9_$]*)/.exec(line)
    if (m !== null) names.add(m[1])
  }
  return names
}

/** The names of the files `sv` includes, without `.sv`. */
function includes (sv: string): string[] {
  // A whole line `include "<file>.sv", capturing <file>: everything between the quotes but the
  // .sv extension. 'g' finds every one, and 'm' makes ^ and $ match at each line's ends.
  return [...sv.matchAll(/^`include "([^"]+)\.sv"$/gm)].map(m => m[1])
}

const sorted = (s: Set<string>): string => [...s].sort().join(', ')

// ---- The design ---------------------------------------------------------------------------
// MidA answers reads on its memory port with the address, a cycle later; MidB issues them from
// the top's inputs. Every port is driven and used, so the files lint clean under -Wall.
const MEMORY = { type: 'rd_only' } as const
const CLK = { direction: 'input', isClock: 'posedge' } as const

class Leaf extends Module {
  constructor (params: TSSVParameters & { width: number }) {
    super(params)
    this.IOs = {
      clk: CLK,
      d: { direction: 'input', width: params.width },
      q: { direction: 'output', width: params.width }
    }
    this.addRegister({ d: 'd', clk: 'clk', q: 'q' })
  }
}

class MidA extends Module {
  constructor () {
    super({ name: 'MidA' })
    this.IOs = {
      clk: CLK,
      a_d: { direction: 'input', width: 8 },
      a_q: { direction: 'output', width: 8 },
      b_d: { direction: 'input', width: 16 },
      b_q: { direction: 'output', width: 16 }
    }
    this.addInterface('mem', new Memory(MEMORY, 'inward'))
    this.addRegister({ d: 'mem.ADDR', clk: 'clk', en: 'mem.RE', q: 'mem.DATA_RD' })
    this.addAssign({ in: new Expr("1'b1"), out: 'mem.READY' })
    this.addSubmodule('u_leaf8', new Leaf({ width: 8 }), { clk: 'clk', d: 'a_d', q: 'a_q' }, false)
    this.addSubmodule('u_leaf16', new Leaf({ width: 16 }), { clk: 'clk', d: 'b_d', q: 'b_q' }, false)
  }
}

class MidB extends Module {
  constructor () {
    super({ name: 'MidB' })
    this.IOs = {
      clk: CLK,
      re: { direction: 'input' },
      addr: { direction: 'input', width: 32 },
      data: { direction: 'output', width: 32 },
      ready: { direction: 'output' },
      c_d: { direction: 'input', width: 8 },
      c_q: { direction: 'output', width: 8 },
      p_d: { direction: 'input', width: 8 },
      p_q: { direction: 'output', width: 8 }
    }
    this.addInterface('mem', new Memory(MEMORY, 'outward'))
    this.addAssign({ in: new Expr('addr'), out: 'mem.ADDR' })
    this.addAssign({ in: new Expr('re'), out: 'mem.RE' })
    this.addAssign({ in: new Expr('mem.DATA_RD'), out: 'data' })
    this.addAssign({ in: new Expr('mem.READY'), out: 'ready' })
    this.addSubmodule('u_leaf8', new Leaf({ width: 8 }), { clk: 'clk', d: 'c_d', q: 'c_q' }, false)
    this.addSystemVerilogSubmodule('u_plain', `${FIXTURES}/plain_import.sv`, {}, { clk: 'clk', d: 'p_d', q: 'p_q' })
  }
}

class Top extends Module {
  constructor () {
    super({ name: 'Top' })
    this.IOs = {
      clk: CLK,
      re: { direction: 'input' },
      addr: { direction: 'input', width: 32 },
      data: { direction: 'output', width: 32 },
      ready: { direction: 'output' },
      a_d: { direction: 'input', width: 8 },
      a_q: { direction: 'output', width: 8 },
      b_d: { direction: 'input', width: 16 },
      b_q: { direction: 'output', width: 16 },
      c_d: { direction: 'input', width: 8 },
      c_q: { direction: 'output', width: 8 },
      p_d: { direction: 'input', width: 8 },
      p_q: { direction: 'output', width: 8 },
      g_d: { direction: 'input', width: 8 },
      g_q: { direction: 'output', width: 8 }
    }
    this.addInterface('w_mem', new Memory(MEMORY))
    this.addSubmodule('u_a', new MidA(),
      { clk: 'clk', a_d: 'a_d', a_q: 'a_q', b_d: 'b_d', b_q: 'b_q', mem: 'w_mem' }, false)
    this.addSubmodule('u_b', new MidB(), {
      clk: 'clk',
      re: 're',
      addr: 'addr',
      data: 'data',
      ready: 'ready',
      c_d: 'c_d',
      c_q: 'c_q',
      p_d: 'p_d',
      p_q: 'p_q',
      mem: 'w_mem'
    }, false)
    this.addSystemVerilogSubmodule('u_guarded', `${FIXTURES}/guarded_import.sv`, {}, { clk: 'clk', d: 'g_d', q: 'g_q' })
  }
}

const top = new Top()
const singleFile = top.writeSystemVerilog()
const files = top.writeSystemVerilogFiles(OUT)
const text = new Map(files.map(f => [basename(f, '.sv'), readFileSync(f, 'utf8')]))
writeLintFilelist(OUT, 'Top', files.map(f => basename(f)), 'ts/test/test_perModuleFiles.ts')

// ---- Test 1: one definition per file, and together the whole design ----------------------
const expected = ['memory_rd_only_32_32', 'Leaf_8', 'Leaf_16', 'MidA', 'plain_import', 'MidB',
  'guarded_import', 'Top']
check('one file per module and interface', sorted(new Set(text.keys())) === sorted(new Set(expected)),
  `files: ${sorted(new Set(text.keys()))}`)
for (const [name, sv] of text) {
  check(`${name}.sv defines ${name} and nothing else`, sorted(definitions(sv)) === name,
    `defines: ${sorted(definitions(sv))}`)
}
check('together the files define what the single-file emission does',
  sorted(definitions(singleFile)) === sorted(new Set(text.keys())),
  `single file: ${sorted(definitions(singleFile))}`)
check('the top file is returned last', files[files.length - 1] === `${OUT}/Top.sv`, files.join(', '))

// ---- Test 2: guards, includes and order ---------------------------------------------------
for (const [name, sv] of text) {
  check(`${name}.sv is inside its include guard`,
    sv.startsWith(`\`ifndef DEF__${name}__\n\`define DEF__${name}__\n`) && sv.endsWith(`\n\`endif //!DEF__${name}__\n`))
}
check('MidA includes its interface, then its two leaves',
  includes(text.get('MidA') ?? '').join(' ') === 'memory_rd_only_32_32 Leaf_8 Leaf_16',
  `includes: ${includes(text.get('MidA') ?? '').join(' ')}`)
check('Top includes the bundle\'s interface and every module it instantiates',
  includes(text.get('Top') ?? '').join(' ') === 'memory_rd_only_32_32 MidA MidB guarded_import',
  `includes: ${includes(text.get('Top') ?? '').join(' ')}`)
check('a leaf has no USE_INCLUDES block', !(text.get('Leaf_8') ?? '').includes('USE_INCLUDES'))
check('an interface has no USE_INCLUDES block',
  !(text.get('memory_rd_only_32_32') ?? '').includes('USE_INCLUDES'))
const names = files.map(f => basename(f, '.sv'))
names.forEach((name, i) => {
  const later = includes(text.get(name) ?? '').filter(inc => !names.slice(0, i).includes(inc))
  check(`everything ${name}.sv includes comes before it`, later.length === 0, `after it: ${later.join(', ')}`)
})

// ---- Test 3: imported SV ------------------------------------------------------------------
const plainSource = readFileSync(`${FIXTURES}/plain_import.sv`, 'utf8')
check('an imported file is written inside the guard, otherwise unchanged',
  text.get('plain_import') ===
    `\`ifndef DEF__plain_import__\n\`define DEF__plain_import__\n\n${plainSource.trimEnd()}\n\n\`endif //!DEF__plain_import__\n`)
check('an imported file that already has the guard is written unchanged',
  text.get('guarded_import') === readFileSync(`${FIXTURES}/guarded_import.sv`, 'utf8'))

// ---- Test 4: a guarded file's header still parses -----------------------------------------
const [midHeader] = parseSVModules(text.get('MidA') ?? '')
check('parseSVModules reads MidA\'s header from its guarded file',
  midHeader?.name === 'MidA' &&
    JSON.stringify(midHeader.ports) ===
    JSON.stringify({ clk: 'input', a_d: 'input', a_q: 'output', b_d: 'input', b_q: 'output', mem: 'interface' }),
  JSON.stringify(midHeader))

// ---- Test 5: Verilator, three ways --------------------------------------------------------
const probe = spawnSync('verilator', ['--version'], { encoding: 'utf8' })
if (probe.status === 0) {
  const lint = (label: string, args: string[]): void => {
    const run = spawnSync('verilator', ['--lint-only', '-Wall', 'doc/rtl-style/sv-style/common_waivers.vlt',
      '--top-module', 'Top', ...args], { encoding: 'utf8' })
    check(label, run.status === 0, `${run.stdout}${run.stderr}`)
  }
  const includeArgs = ['+define+USE_INCLUDES', `+incdir+${OUT}`]
  lint('lints with USE_INCLUDES, naming only the top file (Leaf_8.sv is included twice)',
    [...includeArgs, `${OUT}/Top.sv`])
  lint('lints without USE_INCLUDES, naming every file', files)
  lint('lints with USE_INCLUDES and every file named, so each is reached twice', [...includeArgs, ...files])
} else {
  console.log('SKIP: Verilator lints (verilator not found)')
}

// ---- Test 6: single-file emission is unaffected -------------------------------------------
check('writeSystemVerilog() is unchanged by writeSystemVerilogFiles()', top.writeSystemVerilog() === singleFile)
// guarded_import's source is emitted verbatim, so its own guard is the only one. The regex
// captures the macro of every line that is exactly `ifndef <macro> ('m': ^ and $ match per line).
const guards = [...singleFile.matchAll(/^`ifndef (\S+)$/gm)].map(m => m[1])
check('writeSystemVerilog() adds no include guard', guards.join(' ') === 'DEF__guarded_import__', `guards: ${guards.join(' ')}`)

// ---- Test 7: names that can't be files ----------------------------------------------------
class Named extends Module {
  constructor (name: string) {
    super({ name })
    this.IOs = { clk: CLK, d: { direction: 'input' }, q: { direction: 'output' } }
    this.addRegister({ d: 'd', clk: 'clk', q: 'q' })
  }
}

function errorOf (top: Module, dir: string): string {
  try {
    top.writeSystemVerilogFiles(dir)
  } catch (e) {
    return (e as Error).message
  }
  return ''
}

class Pair extends Module {
  constructor (a: string, b: string) {
    super({ name: 'Pair' })
    this.IOs = { clk: CLK, d: { direction: 'input' }, qa: { direction: 'output' }, qb: { direction: 'output' } }
    this.addSubmodule('u_a', new Named(a), { clk: 'clk', d: 'd', q: 'qa' }, false)
    this.addSubmodule('u_b', new Named(b), { clk: 'clk', d: 'd', q: 'qb' }, false)
  }
}

const caseError = errorOf(new Pair('Clash', 'clash'), `${OUT}/errors/case`)
check('names that differ only in case throw, naming both',
  caseError.includes('module Clash') && caseError.includes('module clash'), caseError)
const identError = errorOf(new Pair('ok_name', 'bad-name'), `${OUT}/errors/ident`)
check('a name that isn\'t an identifier throws, naming it and its parent',
  identError.includes('module bad-name') && identError.includes('used by Pair'), identError)
check('nothing is written when emission throws', !existsSync(`${OUT}/errors`))

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

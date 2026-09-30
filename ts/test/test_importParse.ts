import { Module } from 'tssv/lib/core/TSSV'
import { parseSVModules } from 'tssv/lib/core/SVModuleHeader'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'

// Regression test for addSystemVerilogSubmodule header parsing (issue #48)

try {
  mkdirSync('sv-examples/Core/importParse', { recursive: true })
} catch (e) {}

let failures = 0
function check (what: string, actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) {
    failures++
    console.error(`FAIL ${what}: got ${a}, expected ${e}`)
  }
}
function checkThrows (what: string, fn: () => unknown, pattern: RegExp): void {
  try {
    fn()
    failures++
    console.error(`FAIL ${what}: did not throw`)
  } catch (e) {
    if (!pattern.test(String(e))) {
      failures++
      console.error(`FAIL ${what}: threw ${String(e)}`)
    }
  }
}
function directions (m: Module): Record<string, string> {
  return Object.fromEntries(Object.entries((m as unknown as { IOs: Record<string, { direction: string }> }).IOs).map(([k, v]) => [k, v.direction]))
}

// ANSI ports bound to internal signals, `module <word>` in comments, strings and identifiers
const ansiTop = new Module({ name: 'importParse_ansi' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  y: { direction: 'output', width: 8 }
})
ansiTop.addSignal('sa', { width: 8 })
ansiTop.addSignal('sen', { width: 1 })
ansiTop.addSignal('sb', { width: 1 })
ansiTop.addSignal('sc', { width: 1 })
ansiTop.addSignal('ss', { width: 4, isSigned: true })
ansiTop.addSignal('ssy', { width: 4, isSigned: true })
const ansiLeaf = ansiTop.addSystemVerilogSubmodule(
  'u_leaf',
  'ts/test/importParse/leaf.sv',
  { W: 8, N: 4 },
  { s: 'ss', a: 'sa', en: 'sen', b: 'sb', c: 'sc', y: 'y', sy: 'ssy' },
  false
)
check('ANSI module name', ansiLeaf.name, 'leaf')
check('ANSI directions', directions(ansiLeaf),
  { s: 'input', a: 'input', en: 'input', b: 'input', c: 'input', y: 'output', sy: 'output' })
check('ANSI instance', ansiTop.writeSystemVerilog().replace(/\s+/g, '').includes('leaf#(.W(8),.N(4))u_leaf('), true)

// child direction does not depend on the parent signal's direction
const mixedTop = new Module({ name: 'importParse_mixed' }, {
  a: { direction: 'output', width: 8 },
  en: { direction: 'input' },
  y: { direction: 'output', width: 8 }
})
const mixedLeaf = mixedTop.addSystemVerilogSubmodule('u_leaf', 'ts/test/importParse/leaf.sv', { W: 8 }, { a: 'a', en: 'en', y: 'y' }, false)
check('parent output bound to child input', directions(mixedLeaf), { a: 'input', en: 'input', y: 'output' })

// non-ANSI port declarations, with a function whose arguments must be ignored
const nonAnsiTop = new Module({ name: 'importParse_nonansi' }, {
  clk: { direction: 'input', isClock: 'posedge' }
})
nonAnsiTop.addSignal('na', { width: 8 })
nonAnsiTop.addSignal('nen', { width: 1 })
nonAnsiTop.addSignal('ny', { width: 8 })
nonAnsiTop.addSignal('nsy', { width: 4, isSigned: true })
const nonAnsiLeaf = nonAnsiTop.addSystemVerilogSubmodule(
  'u_leaf',
  'ts/test/importParse/leaf_nonansi.sv',
  { W: 8 },
  { a: 'na', en: 'nen', y: 'ny', sy: 'nsy' },
  false
)
check('non-ANSI module name', nonAnsiLeaf.name, 'leaf_nonansi')
check('non-ANSI directions', directions(nonAnsiLeaf), { a: 'input', en: 'input', y: 'output', sy: 'output' })

// several modules in one file
const multiTop = new Module({ name: 'importParse_multi' }, {
  a: { direction: 'input' },
  y: { direction: 'output' }
})
checkThrows('ambiguous multi-module file',
  () => multiTop.addSystemVerilogSubmodule('u_x', 'ts/test/importParse/two_modules.sv', {}, { a: 'a', y: 'y' }, true),
  /several modules \(helper, two_top\)/)
const multiLeaf = multiTop.addSystemVerilogSubmodule('u_top', 'ts/test/importParse/two_modules.sv', {}, { a: 'a', y: 'y' }, true, { moduleName: 'two_top' })
check('selected module name', multiLeaf.name, 'two_top')
check('selected module directions', directions(multiLeaf), { a: 'input', y: 'output' })
checkThrows('missing selected module',
  () => multiTop.addSystemVerilogSubmodule('u_x', 'ts/test/importParse/two_modules.sv', {}, { a: 'a' }, true, { moduleName: 'nope' }),
  /module nope not found/)

// binding a name that is not a port
checkThrows('unknown port',
  () => mixedTop.addSystemVerilogSubmodule('u_bad', 'ts/test/importParse/leaf.sv', {}, { a: 'a', bogus: 'en' }, false),
  /bogus is not a port of module leaf/)

const edgeCases = [
  { name: 'edge_ansi', ports: { s_axi: 'interface', a: 'input', q: 'output', r: 'ref', io: 'inout', m: 'inout' } },
  { name: 'edge_lead_intf', ports: { bus: 'interface', x: 'input' } },
  { name: 'edge_non', ports: { a: 'input', b: 'input', q: 'output', t: 'output' } },
  { name: 'edge_empty', ports: {} }
]
check('edge cases', parseSVModules(readFileSync('ts/test/importParse/edge_cases.sv', 'utf8')), edgeCases)
check('testImport.sv', parseSVModules(readFileSync('ts/test/testImport.sv', 'utf8')),
  [{ name: 'testImport', ports: { a: 'input', b: 'input', sum: 'output' } }])
checkThrows('syntax error',
  () => parseSVModules('module bad(input logic a,, output y);\nendmodule\n'),
  /syntax error at line 1, column 26/)
checkThrows('missing verible-verilog-syntax',
  () => parseSVModules('module m; endmodule', { veribleSyntaxPath: '/nonexistent/verible-verilog-syntax' }),
  /could not run \/nonexistent\/verible-verilog-syntax/)

try {
  writeFileSync('sv-examples/Core/importParse/importParse_ansi.sv', ansiTop.writeSystemVerilog())
  writeFileSync('sv-examples/Core/importParse/importParse_nonansi.sv', nonAnsiTop.writeSystemVerilog())
  writeFileSync('sv-examples/Core/importParse/importParse_multi.sv', multiTop.writeSystemVerilog())
} catch (err) {
  console.error(err)
}

if (failures > 0) {
  throw Error(`${failures} importParse check(s) failed`)
}
console.log('importParse: all checks passed')

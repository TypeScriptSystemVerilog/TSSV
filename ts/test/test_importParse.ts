import { Module, type SVImportOptions, TSSV_ROOT } from 'tssv/lib/core/TSSV'
import { parseSVModules } from 'tssv/lib/core/SVModuleHeader'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { posix } from 'path'
import { spawnSync } from 'child_process'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'

// Regression test for addSystemVerilogSubmodule header parsing (issue #48)

const OUT = 'sv-examples/Core/importParse'
const GENERATOR = 'ts/test/test_importParse.ts'

try {
  mkdirSync(OUT, { recursive: true })
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

// ANSI ports, `module <word>` in comments, strings and identifiers
const ansiTop = new Module({ name: 'importParse_ansi' }, {
  sa: { direction: 'input', width: 8 },
  sen: { direction: 'input' },
  sb: { direction: 'input' },
  sc: { direction: 'input' },
  ss: { direction: 'input', width: 4, isSigned: true },
  y: { direction: 'output', width: 8 },
  ssy: { direction: 'output', width: 4, isSigned: true }
})
const ansiLeaf = ansiTop.addSystemVerilogSubmodule(
  'u_leaf',
  '$TSSV_ROOT/ts/test/importParse/leaf.sv',
  { W: 8, N: 4 },
  { s: 'ss', a: 'sa', en: 'sen', b: 'sb', c: 'sc', y: 'y', sy: 'ssy' },
  false,
  { moduleName: 'leaf' }
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
const mixedLeaf = mixedTop.addSystemVerilogSubmodule('u_leaf', '$TSSV_ROOT/ts/test/importParse/leaf.sv', { W: 8 }, { a: 'a', en: 'en', y: 'y' }, false, { moduleName: 'leaf' })
check('parent output bound to child input', directions(mixedLeaf), { a: 'input', en: 'input', y: 'output' })

// non-ANSI port declarations, with a function whose arguments must be ignored
const nonAnsiTop = new Module({ name: 'importParse_nonansi' }, {
  na: { direction: 'input', width: 8 },
  nen: { direction: 'input' },
  ny: { direction: 'output', width: 8 },
  nsy: { direction: 'output', width: 4, isSigned: true }
})
const nonAnsiLeaf = nonAnsiTop.addSystemVerilogSubmodule(
  'u_leaf',
  '$TSSV_ROOT/ts/test/importParse/leaf_nonansi.sv',
  { W: 8 },
  { a: 'na', en: 'nen', y: 'ny', sy: 'nsy' },
  false,
  { moduleName: 'leaf_nonansi' }
)
check('non-ANSI module name', nonAnsiLeaf.name, 'leaf_nonansi')
check('non-ANSI directions', directions(nonAnsiLeaf), { a: 'input', en: 'input', y: 'output', sy: 'output' })

// several modules in one file
const multiTop = new Module({ name: 'importParse_multi' }, {
  a: { direction: 'input' },
  y: { direction: 'output' }
})
// The module is never inferred, so a JavaScript caller that leaves moduleName out gets an error
checkThrows('missing moduleName',
  () => multiTop.addSystemVerilogSubmodule('u_x', '$TSSV_ROOT/ts/test/importParse/two_modules.sv', {}, { a: 'a', y: 'y' }, true, {} as SVImportOptions),
  /options\.moduleName is required/)
const multiLeaf = multiTop.addSystemVerilogSubmodule('u_top', '$TSSV_ROOT/ts/test/importParse/two_modules.sv', {}, { a: 'a', y: 'y' }, true, { moduleName: 'two_top' })
check('selected module name', multiLeaf.name, 'two_top')
check('selected module directions', directions(multiLeaf), { a: 'input', y: 'output' })
checkThrows('missing selected module',
  () => multiTop.addSystemVerilogSubmodule('u_x', '$TSSV_ROOT/ts/test/importParse/two_modules.sv', {}, { a: 'a' }, true, { moduleName: 'nope' }),
  /module nope not found/)

// binding a name that is not a port
checkThrows('unknown port',
  () => mixedTop.addSystemVerilogSubmodule('u_bad', '$TSSV_ROOT/ts/test/importParse/leaf.sv', {}, { a: 'a', bogus: 'en' }, false, { moduleName: 'leaf' }),
  /bogus is not a port of module leaf/)

const edgeCases = [
  { name: 'edge_ansi', ports: { s_axi: 'interface', a: 'input', q: 'output', r: 'ref', io: 'inout', m: 'inout' } },
  { name: 'edge_lead_intf', ports: { bus: 'interface', x: 'input' } },
  { name: 'edge_non', ports: { a: 'input', b: 'input', q: 'output', t: 'output' } },
  { name: 'edge_empty', ports: {} }
]
check('edge cases', parseSVModules(readFileSync(`${TSSV_ROOT}/ts/test/importParse/edge_cases.sv`, 'utf8')), edgeCases)
check('testImport.sv', parseSVModules(readFileSync(`${TSSV_ROOT}/ts/test/testImport.sv`, 'utf8')),
  [{ name: 'testImport', ports: { a: 'input', b: 'input', sum: 'output' } }])
checkThrows('syntax error',
  () => parseSVModules('module bad(input logic a,, output y);\nendmodule\n'),
  /syntax error at line 1, column 26/)
// Verible comes from PATH only, so the missing-binary error needs a process whose PATH has none.
// The child imports the parser by its file URL, so it doesn't depend on the cwd.
const parserUrl = new URL('../src/core/SVModuleHeader.js', import.meta.url).href
const noVerible = spawnSync(process.execPath, ['--input-type=module', '-e',
  `import { parseSVModules } from '${parserUrl}'
   try { parseSVModules('module m; endmodule') } catch (e) { console.log(e.message) }`],
{ encoding: 'utf8', env: { ...process.env, PATH: '' } })
checkThrows('missing verible-verilog-syntax',
  () => { if (noVerible.stdout !== '') throw Error(noVerible.stdout) },
  /could not run verible-verilog-syntax \(is Verible installed\?\)/)

// The imported files are this test's inputs, written by hand to hold the cases the parser must
// handle, not generated SV. So each top is written without the module it imports, and its lint
// filelist names the imported file where it is.
function writeTop (top: Module, child: Module, imported: string): void {
  writeFileSync(`${OUT}/${top.name}.sv`, top.writeSystemVerilog({ exclude: new Set([child.name]) }))
  writeLintFilelist(OUT, top.name, [posix.relative(OUT, imported), `${top.name}.sv`], GENERATOR)
}

try {
  writeTop(ansiTop, ansiLeaf, 'ts/test/importParse/leaf.sv')
  writeTop(nonAnsiTop, nonAnsiLeaf, 'ts/test/importParse/leaf_nonansi.sv')
  writeTop(multiTop, multiLeaf, 'ts/test/importParse/two_modules.sv')
} catch (err) {
  console.error(err)
}

if (failures > 0) {
  throw Error(`${failures} importParse check(s) failed`)
}
console.log('importParse: all checks passed')

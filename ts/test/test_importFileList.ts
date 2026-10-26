/**
 * Self-checking test for addSystemVerilogSubmodule()'s file lists and include guards, and for
 * TSSV_ROOT and environment variables in paths (#181).
 *
 * The inputs in ts/test/importFileList/ are a package, fl_pkg, and three modules built on it:
 * fl_sub, and fl_top and fl_other, which both instantiate fl_sub. fl_top.f lists fl_top and what
 * it needs. A top imports fl_top through fl_top.f and fl_other through an array, so fl_pkg.sv and
 * fl_sub.sv are read by both imports.
 *
 * Test 1: a .f (comments, blank lines, a nested .f, a duplicate, a $TSSV_ROOT line) and an array
 *         list the same files
 * Test 2: moduleName is required, and finds the module in any of the files
 * Test 3: writeSystemVerilogFiles() writes each imported file once, untouched inside exactly one
 *         SVIMPORT guard; only the generated file has a DEF guard; writeSystemVerilog() is
 *         unchanged, with no guards
 * Test 4: Verilator lints the files three ways, so each shared file is reached more than once
 * Test 5: each error throws, naming its file and line where it has one
 * Test 6: expandPath() and absolutePath()
 * Test 7: TSSV_ROOT, projectRoot() from a nested package, and an inherited value
 */
import { Module, type SVImportOptions, TSSV_ROOT, absolutePath, expandPath, projectRoot } from 'tssv/lib/core/TSSV'
import { expandSVFileList, guardSVImport, importGuard } from 'tssv/lib/core/SVFileList'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'fs'
import { basename, join } from 'path'
import { tmpdir } from 'os'
import { pathToFileURL, fileURLToPath } from 'url'
import { spawnSync } from 'child_process'
import { writeLintFilelist } from 'tssv/test/models/lintFilelist'

const GENERATOR = 'ts/test/test_importFileList.ts'
const OUT = 'sv-examples/Core/importFileList'
const IN = '$TSSV_ROOT/ts/test/importFileList'
const DIR = `${TSSV_ROOT}/ts/test/importFileList`
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

/** the message `fn` throws, or '' if it doesn't */
function errorOf (fn: () => unknown): string {
  try {
    fn()
  } catch (e) {
    return (e as Error).message
  }
  return ''
}

/** whether `message`, a thrown error's, holds every one of `parts` */
function mentions (message: string, ...parts: string[]): boolean {
  return message !== '' && parts.every(p => message.includes(p))
}

// ---- Test 1: a .f and an array list the same files ---------------------------------------
const listed = [`${DIR}/fl_pkg.sv`, `${DIR}/fl_sub.sv`, `${DIR}/fl_top.sv`]
const fromFilelist = expandSVFileList(`${IN}/fl_top.f`, 'SVFilePath')
check('fl_top.f lists the package, then fl_sub through the nested .f, then fl_top, each once',
  fromFilelist.join(' ') === listed.join(' '), fromFilelist.join(' '))
// The braced form, ${TSSV_ROOT}, is what's under test, so it's a plain string
// eslint-disable-next-line no-template-curly-in-string
const fromArray = expandSVFileList([`${IN}/fl_pkg.sv`, `${IN}/fl_sub.sv`, '${TSSV_ROOT}/ts/test/importFileList/fl_top.sv'], 'SVFilePath')
check('an array lists the same files', fromArray.join(' ') === listed.join(' '), fromArray.join(' '))

// ---- Test 2: moduleName -------------------------------------------------------------------
const byte = { width: 8 }
class Top extends Module {
  readonly flTop: Module
  readonly flOther: Module
  constructor () {
    super({ name: 'importFileList_top' })
    this.IOs = {
      a: { direction: 'input', ...byte },
      y_top: { direction: 'output', ...byte },
      y_other: { direction: 'output', ...byte }
    }
    this.flTop = this.addSystemVerilogSubmodule('u_top', `${IN}/fl_top.f`, {}, { a: 'a', y: 'y_top' }, false, { moduleName: 'fl_top' })
    this.flOther = this.addSystemVerilogSubmodule('u_other', [`${IN}/fl_pkg.sv`, `${IN}/fl_sub.sv`, `${IN}/fl_other.sv`],
      {}, { a: 'a', y: 'y_other' }, false, { moduleName: 'fl_other' })
  }
}
const top = new Top()
check('moduleName finds the module in a .f\'s files', top.flTop.name === 'fl_top', top.flTop.name)
check('moduleName finds the module in an array\'s files', top.flOther.name === 'fl_other', top.flOther.name)
// A JavaScript caller can leave it out, whatever the type says
const unnamedError = errorOf(() => new Module({ name: 'x' }).addSystemVerilogSubmodule('u', `${IN}/fl_sub.sv`, {}, {}, false, {} as SVImportOptions))
check('a missing moduleName throws, even for a file with one module: it is never inferred',
  mentions(unnamedError, 'options.moduleName is required'), unnamedError)
const notFoundError = errorOf(() => new Module({ name: 'x' }).addSystemVerilogSubmodule('u', [`${IN}/fl_pkg.sv`, `${IN}/fl_sub.sv`],
  {}, {}, false, { moduleName: 'fl_top' }))
check('a moduleName the files don\'t declare throws, naming what they do',
  mentions(notFoundError, 'module fl_top not found', 'which declare fl_sub'), notFoundError)

// ---- Test 3: the files and their guards ---------------------------------------------------
check('writeSystemVerilog() is unchanged: the imported files\' text has no guard',
  !top.writeSystemVerilog().includes('SVIMPORT__'))
const files = top.writeSystemVerilogFiles(OUT)
writeLintFilelist(OUT, top.name, files.map(f => basename(f)), GENERATOR)
const imports = ['fl_pkg', 'fl_sub', 'fl_top', 'fl_other']
check('the imported files are written each once, in order, then the top',
  files.map(f => basename(f)).join(' ') === [...imports, top.name].map(n => `${n}.sv`).join(' '), files.join(' '))
for (const name of imports) {
  const source = readFileSync(`${DIR}/${name}.sv`, 'utf8')
  const guard = `SVIMPORT__${name}__`
  check(`${name}.sv is its source, untouched, inside exactly one SVIMPORT guard and nothing else`,
    readFileSync(`${OUT}/${name}.sv`, 'utf8') ===
      `\`ifndef ${guard}\n\`define ${guard}\n${source}${source.endsWith('\n') ? '' : '\n'}\`endif //!${guard}\n`)
}
const topFile = readFileSync(`${OUT}/${top.name}.sv`, 'utf8')
check('the generated file has the DEF guard', topFile.startsWith(`\`ifndef DEF__${top.name}__\n`))
// The file each whole line `include "<file>" names, captured: everything between the quotes. 'g'
// finds every one, and 'm' makes ^ and $ match at each line's ends.
const included = [...topFile.matchAll(/^`include "([^"]+)"$/gm)].map(m => m[1])
check('the top includes every imported file, once and in order',
  included.join(' ') === imports.map(n => `${n}.sv`).join(' '), included.join(' '))
check('a guard turns each character that can\'t be in a macro name into _',
  importGuard('/x/my-ip.v1.sv') === 'SVIMPORT__my_ip_v1__' &&
    guardSVImport('/x/my-ip.v1.sv', 'module my_ip; endmodule\n').startsWith('`ifndef SVIMPORT__my_ip_v1__\n'))

// ---- Test 4: Verilator --------------------------------------------------------------------
const probe = spawnSync('verilator', ['--version'], { encoding: 'utf8' })
if (probe.status === 0) {
  const lint = (label: string, args: string[]): void => {
    const run = spawnSync('verilator', ['--lint-only', '-Wall', 'doc/rtl-style/sv-style/common_waivers.vlt',
      '--top-module', top.name, ...args], { encoding: 'utf8', cwd: TSSV_ROOT })
    check(label, run.status === 0, `${run.stdout}${run.stderr}`)
  }
  const outDir = join(process.cwd(), OUT)
  const includeArgs = ['+define+USE_INCLUDES', `+incdir+${outDir}`]
  lint('the files lint together, each named once', files.map(f => join(process.cwd(), f)))
  lint('the files lint with USE_INCLUDES, naming only the top', [...includeArgs, `${outDir}/${top.name}.sv`])
  lint('the files lint with USE_INCLUDES and every file named, so each is reached twice',
    [...includeArgs, ...files.map(f => join(process.cwd(), f))])
} else {
  console.log('SKIP: Verilator lints (verilator not found)')
}

// ---- Test 5: errors -----------------------------------------------------------------------
const tmp = realpathSync(mkdtempSync(join(tmpdir(), 'importFileList-')))
try {
  const write = (name: string, text: string): string => {
    const path = join(tmp, name)
    mkdirSync(join(path, '..'), { recursive: true })
    writeFileSync(path, text)
    return path
  }
  // These fail while the files are listed or read, before the module is looked for
  const importOf = (paths: string | string[]): string =>
    errorOf(() => new Module({ name: 'x' }).addSystemVerilogSubmodule('u', paths, {}, {}, false, { moduleName: 'fl_sub' }))

  const optionError = importOf(write('option.f', `${DIR}/fl_sub.sv\n+incdir+${DIR}\n`))
  check('a simulator option throws, naming the file and line',
    mentions(optionError, `${tmp}/option.f:2`, '+incdir+'), optionError)
  delete process.env.TSSV_TEST_UNSET
  const unsetError = importOf(write('unset.f', '\n$TSSV_TEST_UNSET/x.sv\n'))
  check('an unset variable throws, naming it, the file and the line',
    mentions(unsetError, 'TSSV_TEST_UNSET', `${tmp}/unset.f:2`), unsetError)
  write('cycle_b.f', 'cycle_a.f\n')
  const cycleError = importOf(write('cycle_a.f', 'cycle_b.f\n'))
  check('a .f that reads itself throws, with the chain',
    mentions(cycleError, 'reads itself', 'cycle_a.f -> ', 'cycle_b.f -> '), cycleError)
  const missingError = importOf(write('missing.f', '# nothing else\nnope.sv\n'))
  check('a missing listed file throws, naming the file and line',
    mentions(missingError, `${tmp}/missing.f:2`, `${tmp}/nope.sv`), missingError)
  const missingTopError = importOf(`${IN}/nope.sv`)
  check('a missing path throws, naming it', mentions(missingTopError, `'${IN}/nope.sv'`, "doesn't exist"), missingTopError)
  const emptyError = importOf(write('empty.f', '// nothing\n'))
  check('a .f that lists nothing throws', mentions(emptyError, 'names no SystemVerilog file'), emptyError)
  const relativeError = importOf('ts/test/importFileList/fl_sub.sv')
  check('a relative path throws, suggesting $TSSV_ROOT',
    mentions(relativeError, "SVFilePath 'ts/test/importFileList/fl_sub.sv' is a relative path", '$TSSV_ROOT/'), relativeError)
  const syntaxError = importOf(write('bad.sv', 'module bad(input logic a,, output y);\nendmodule\n'))
  check('a syntax error names its file', mentions(syntaxError, `${tmp}/bad.sv: SystemVerilog syntax error`), syntaxError)

  // These fail when the files are written: the clash is between the files of one emission
  const clash = new Module({ name: 'clash_top' })
  clash.addSystemVerilogSubmodule('u_a', write('a/defs.sv', 'module defs_a; endmodule\n'), {}, {}, false, { moduleName: 'defs_a' })
  clash.addSystemVerilogSubmodule('u_b', write('b/defs.sv', 'module defs_b; endmodule\n'), {}, {}, false, { moduleName: 'defs_b' })
  const clashError = errorOf(() => clash.writeSystemVerilogFiles(join(tmp, 'clash_out')))
  check('two imported files with the same name and different contents throw, naming both',
    mentions(clashError, `${tmp}/a/defs.sv`, `${tmp}/b/defs.sv`, 'SVIMPORT__defs__'), clashError)
  check('and nothing is written', !existsSync(join(tmp, 'clash_out')))
  const upper = new Module({ name: 'FL_SUB' })
  upper.addSystemVerilogSubmodule('u', [`${IN}/fl_pkg.sv`, `${IN}/fl_sub.sv`], {}, {}, false, { moduleName: 'fl_sub' })
  const caseError = errorOf(() => upper.writeSystemVerilogFiles(join(tmp, 'case_out')))
  check('an imported file and a generated one whose names differ only in case throw, naming both',
    mentions(caseError, `imported file ${DIR}/fl_sub.sv`, 'module FL_SUB'), caseError)
  const copy = new Module({ name: 'copy_top' })
  copy.addSystemVerilogSubmodule('u', [`${IN}/fl_pkg.sv`, `${IN}/fl_sub.sv`, write('copy/fl_sub.sv', readFileSync(`${DIR}/fl_sub.sv`, 'utf8'))],
    {}, {}, false, { moduleName: 'fl_sub' })
  const copyFiles = copy.writeSystemVerilogFiles(join(tmp, 'copy_out')).map(f => basename(f))
  check('a copy of a file, with the same contents, is written once',
    copyFiles.join(' ') === 'fl_pkg.sv fl_sub.sv copy_top.sv', copyFiles.join(' '))
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

// ---- Test 6: expandPath() and absolutePath() ----------------------------------------------
process.env.TSSV_TEST_A = '/p'
check('$NAME expands', expandPath('$TSSV_TEST_A/x.sv') === '/p/x.sv')
// eslint-disable-next-line no-template-curly-in-string
check('${NAME} expands, and ends where the braces do', expandPath('${TSSV_TEST_A}_v2/x.sv') === '/p_v2/x.sv')
check('$NAME runs as far as name characters do', mentions(errorOf(() => expandPath('$TSSV_TEST_A_v2/x.sv')), 'TSSV_TEST_A_v2 is not set'))
check('a path without variables is unchanged', expandPath('/a/b c/d.sv') === '/a/b c/d.sv')
check('an unset variable\'s error names where the path came from',
  mentions(errorOf(() => expandPath('$TSSV_TEST_UNSET/x', 'rtl.f:3')), 'TSSV_TEST_UNSET', '(rtl.f:3)'))
check('absolutePath() expands', absolutePath('$TSSV_TEST_A/x.sv', 'p') === '/p/x.sv')
check('absolutePath() rejects a relative path', mentions(errorOf(() => absolutePath('x.sv', 'xmlDataPath')), "xmlDataPath 'x.sv' is a relative path"))

// ---- Test 7: roots ------------------------------------------------------------------------
// This file is out/test/test_importFileList.js, two levels below the root
const repoRoot = realpathSync(fileURLToPath(new URL('../..', import.meta.url)))
check('TSSV_ROOT is this checkout\'s root', TSSV_ROOT === repoRoot, `${TSSV_ROOT} vs ${repoRoot}`)
check('$TSSV_ROOT is set to it', process.env.TSSV_ROOT === TSSV_ROOT)
const shell = spawnSync('sh', ['-c', 'printf %s "$TSSV_ROOT"'], { encoding: 'utf8' })
check('a process this one starts inherits $TSSV_ROOT', shell.stdout === TSSV_ROOT, shell.stdout)

// A worktree nested inside another checkout: each has a package.json, and the nearer one wins
const nest = realpathSync(mkdtempSync(join(tmpdir(), 'projectRoot-')))
try {
  const inner = join(nest, '.worktrees', '7', 'project')
  mkdirSync(join(inner, 'out', 'src'), { recursive: true })
  writeFileSync(join(nest, 'package.json'), '{}\n')
  writeFileSync(join(inner, 'package.json'), '{}\n')
  const root = projectRoot('TSSV_TEST_ROOT', pathToFileURL(join(inner, 'out', 'src', 'paths.js')).href)
  check('projectRoot() stops at the nearest package.json, as a nested worktree needs', root === inner, root)
  check('projectRoot() sets its variable', process.env.TSSV_TEST_ROOT === inner)
} finally {
  rmSync(nest, { recursive: true, force: true })
}

// An inherited value that differs is replaced, with a warning
const pathsUrl = new URL('../src/core/Paths.js', import.meta.url).href
const inherited = spawnSync(process.execPath, ['--input-type=module', '-e',
  `import { TSSV_ROOT } from '${pathsUrl}'
   console.log(TSSV_ROOT + ' ' + process.env.TSSV_ROOT)`],
{ encoding: 'utf8', env: { ...process.env, TSSV_ROOT: '/wrong' } })
check('an inherited TSSV_ROOT is replaced by the derived root', inherited.stdout.trim() === `${repoRoot} ${repoRoot}`, inherited.stdout)
check('and the replacement warns, naming both', mentions(inherited.stderr, 'TSSV_ROOT was /wrong', `using ${repoRoot}`), inherited.stderr)

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

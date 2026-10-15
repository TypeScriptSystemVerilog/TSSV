import { type Write, readAlwaysBody } from 'tssv/lib/core/AlwaysBody'

// Unit test of the always-block reader the builders' SV-guide checks use (issue #149):
// what it reads from Verible's syntax tree, and the syntax errors it reports.

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

const comb = (body: string): ReturnType<typeof readAlwaysBody> => readAlwaysBody('test', 'always_comb\n', body)
const summary = (writes: Write[]): Array<[string, string, string[], string[]]> =>
  writes.map((w) => [w.kind, w.target, w.names, w.reads])

// <= as a comparison isn't an assignment
check('comparison', summary(comb('begin\n  le = a <= b;\n  if (a <= b) min = a;\nend\n').writes), [
  ['blocking', 'le', ['le'], ['a', 'b']],
  ['blocking', 'min', ['min'], ['a']]
])

// a target names its variables; an index or a member select is read
check('targets', summary(comb('begin\n  {a, {b, c}} = x;\n  mem[idx] <= \'0;\n  s.f = x.y[i];\nend\n').writes), [
  ['blocking', '{a, {b, c}}', ['a', 'b', 'c'], ['x']],
  ['nonblocking', 'mem[idx]', ['mem'], []],
  ['blocking', 's.f', ['s'], ['x', 'i']]
])

// statements under any case label, including one in parentheses
check('case labels', summary(comb('unique case (sel)\n  (A | B): y <= 1\'b1;\n  default: y = 1\'b0;\nendcase\n').writes), [
  ['nonblocking', 'y', ['y'], []],
  ['blocking', 'y', ['y'], []]
])

// += and ++ read their target; a for header assigns its variable
check('modify and loops', summary(comb('begin\n  k += j;\n  cnt++;\n  for (int i = 0; i < 4; i++) t = i;\n  for (n = 0; n < 4; n = n + 1) t = n;\nend\n').writes), [
  ['blocking', 'k', ['k'], ['k', 'j']],
  ['blocking', 'cnt', ['cnt'], ['cnt']],
  ['blocking', 'i', ['i'], ['i']],
  ['blocking', 't', ['t'], ['i']],
  ['blocking', 'n', ['n'], []],
  ['blocking', 'n', ['n'], ['n']],
  ['blocking', 't', ['t'], ['n']]
])

// locals: declared in the body or in a for header, not a variable a for header assigns
const decls = comb('begin\n  automatic logic [1:0] idx = 2\'d0;\n  logic t = 1\'b0, u;\n  state_t s = IDLE;\n  for (int i = 0; i < 4; i++) ;\n  for (n = 0; n < 4; n++) ;\nend\n')
check('locals', [...decls.locals], ['idx', 't', 'u', 's', 'i'])
check('initialized', decls.initialized, [
  { names: ['idx'], automatic: true },
  { names: ['t'], automatic: false },
  { names: ['s'], automatic: false }
])

// reset branches
const ff = 'always_ff @( posedge clk or negedge rst_n )\n'
const resetReads = (body: string, name: string, activeLow: boolean): string[][] =>
  readAlwaysBody('test', ff, body, { name, activeLow }).resetWrites.map((w) => w.reads)
check('if (!rst_n)', resetReads('if (!rst_n) q <= r0;\nelse q <= d;\n', 'rst_n', true), [['r0']])
check('else of if (rst_n)', resetReads('if (rst_n) q <= d;\nelse begin\n  q <= r0;\n  p <= r1;\nend\n', 'rst_n', true), [['r0'], ['r1']])
check('if ((rst_n == 1\'b0))', resetReads('if ((rst_n == 1\'b0)) q <= r0;\nelse q <= d;\n', 'rst_n', true), [['r0']])
check('active high', resetReads('if (rst) q <= r0;\nelse q <= d;\n', 'rst', false), [['r0']])
check('not a reset condition', resetReads('if (en) q <= d;\n', 'rst_n', true), [])

// a syntax error gives its line in the body, after the header the builder writes
checkThrows('syntax error after a header',
  () => readAlwaysBody('addCombAlways(y)', 'always_comb\n', 'begin\n  y = ;\nend\n'),
  /^Error: addCombAlways\(y\): SystemVerilog syntax error at line 2, column 7 of the body, near ';'/)
checkThrows('syntax error in a body with its own header',
  () => readAlwaysBody('addCombAlways(y)', '', 'always_comb begin\n  y = a\nend\n'),
  /syntax error at line 3, column 1 of the body, near 'end'/)

if (failures > 0) {
  throw Error(`${failures} alwaysBody check(s) failed`)
}
console.log('alwaysBody: all checks passed')

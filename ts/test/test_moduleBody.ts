import { type AlwaysBlock, type Write, readModuleBody } from 'tssv/lib/core/ModuleBody'

// Unit test of the module reader the SV-guide checks in emission use (issues #149,
// #166): what it reads from Verible's syntax tree, and the syntax errors it reports.

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

const read = (items: string): ReturnType<typeof readModuleBody> => readModuleBody('m', `module m;\n${items}\nendmodule\n`)
function block (items: string): AlwaysBlock {
  const b = read(items).blocks[0]
  if (b === undefined) throw Error(`no always block in ${items}`)
  return b
}
const comb = (body: string): AlwaysBlock => block(`always_comb\n${body}`)
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
  block(ff + body).resetWrites({ name, activeLow }).map((w) => w.reads)
check('if (!rst_n)', resetReads('if (!rst_n) q <= r0;\nelse q <= d;\n', 'rst_n', true), [['r0']])
check('else of if (rst_n)', resetReads('if (rst_n) q <= d;\nelse begin\n  q <= r0;\n  p <= r1;\nend\n', 'rst_n', true), [['r0'], ['r1']])
check('if ((rst_n == 1\'b0))', resetReads('if ((rst_n == 1\'b0)) q <= r0;\nelse q <= d;\n', 'rst_n', true), [['r0']])
check('active high', resetReads('if (rst) q <= r0;\nelse q <= d;\n', 'rst', false), [['r0']])
check('not a reset condition', resetReads('if (en) q <= d;\n', 'rst_n', true), [])
check('another reset', resetReads('if (!rst_n) q <= r0;\nelse q <= d;\n', 'srst', false), [])

// block kinds and event controls
const kind = (items: string): [string, string, Array<[string | undefined, string | undefined, string]>] => {
  const b = block(items)
  return [b.keyword, b.kind, b.events.map((e) => [e.edge, e.name, e.text])]
}
check('always_ff', kind('always_ff @(posedge clk or negedge rst_n) q <= d;'), ['always_ff', 'seq', [['posedge', 'clk', 'clk'], ['negedge', 'rst_n', 'rst_n']]])
check('always with an edge', kind('always @(posedge clk, posedge bus.clk) q <= d;'), ['always', 'seq', [['posedge', 'clk', 'clk'], ['posedge', undefined, 'bus.clk']]])
check('both edges', kind('always_ff @(edge clk) q <= d;'), ['always_ff', 'seq', [['edge', 'clk', 'clk']]])
check('always_comb', kind('always_comb y = a;'), ['always_comb', 'comb', []])
check('always @*', kind('always @* y = a;'), ['always', 'comb', []])
check('always @(*)', kind('always @(*) y = a;'), ['always', 'comb', []])
check('a list of levels', kind('always @(a or b) y = a;'), ['always', 'comb', [[undefined, 'a', 'a'], [undefined, 'b', 'b']]])
check('always_latch', kind('always_latch if (en) q = d;'), ['always_latch', 'latch', []])
check('no event control', kind('always #5 clk = ~clk;'), ['always', 'other', []])

// a header runs to its first begin and label, or to the end of its line
check('header with a label', block('always_ff @( posedge clk )\n  begin : q_reg\n    q <= d;\n  end').header, 'always_ff @( posedge clk ) begin : q_reg')
check('header without a begin', block('always_ff @(posedge clk)\n  q <= d;').header, 'always_ff @(posedge clk)')

// continuous assignments, and nets declared with a value
check('assigns', read('assign a = b & c;\nassign {d, e[1]} = ~f;\nwire g = h, k;\nalways_comb y = a;').assigns, [
  { names: ['a'], rhs: 'b & c' },
  { names: ['d', 'e'], rhs: '~f' },
  { names: ['g'], rhs: 'h' }
])

// module-level declarations: variables, nets and instances, but not constants or procedural locals
check('declared', [...read(`logic a, b = 1'b0;
wire [3:0] c;
const logic k = 1'b1;
localparam int P = 3;
APB4 bus();
sub u_sub (.x(a));
function automatic logic f (input logic x);
  logic t;
  return x;
endfunction
always_comb begin : blk
  logic l;
  l = a;
end
`).declared], ['a', 'b', 'c', 'bus', 'u_sub'])

// a syntax error gives its line in the module, and quotes it
checkThrows('syntax error',
  () => read('always_comb begin\n  y = ;\nend'),
  /^Error: m: SystemVerilog syntax error at line 3, column 7, near ';': y = ;$/)

if (failures > 0) {
  throw Error(`${failures} moduleBody check(s) failed`)
}
console.log('moduleBody: all checks passed')

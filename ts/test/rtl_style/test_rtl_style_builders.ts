// Builder and module checks for the style guides in doc/rtl-style/: the SV guide's rules that
// writeSystemVerilog() enforces on every module, SEQ-5's headers, and the TSSV guide's rules about
// what a builder emits or rejects. Each check() builds small modules with the TSSV builders, or
// raw SV through addBody(), and confirms what the guide claims. Every module that should be clean
// is written to sv-examples/rtl_style/ for doc/rtl-style/sv-style/tools/check-builder-examples.mjs to lint.
//
// Prints one `RESULT {json}` line per check; check-builder-examples.mjs reads them.

import { Module, Expr } from 'tssv/lib/core/TSSV'
import { mkdirSync, writeFileSync } from 'fs'

const OUT = 'sv-examples/rtl_style'
mkdirSync(OUT, { recursive: true })

function check (rule: string, what: string, fn: () => void): void {
  let pass = true
  let msg = ''
  try {
    fn()
  } catch (e) {
    pass = false
    msg = e instanceof Error ? e.message : String(e)
  }
  console.log(`RESULT ${JSON.stringify({ rule, what, pass, msg })}`)
}

function expect (cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg)
}

function expectThrows (fn: () => void, pattern: RegExp): void {
  try {
    fn()
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    expect(pattern.test(msg), `threw "${msg}", expected ${pattern.toString()}`)
    return
  }
  throw new Error(`expected an error matching ${pattern.toString()}`)
}

// Emit a module and keep it for linting.
function emit (m: Module): string {
  const sv = m.writeSystemVerilog()
  writeFileSync(`${OUT}/${m.name}.sv`, sv)
  return sv
}

const flat = (sv: string): string => sv.replace(/\s+/g, ' ')

function arbiter (name: string): Module {
  return new Module({ name }, {
    req: { direction: 'input', width: 2 },
    grant: { direction: 'output', width: 2 }
  })
}

const arbBody = `
  begin : arb
    grant = '0;
    if (req[0]) grant = 2'b01;
    else if (req[1]) grant = 2'b10;
  end
`

check('BUILD-4', 'addCombAlways without inputs emits always_comb', () => {
  const m = arbiter('build4_do')
  m.addCombAlways({ outputs: ['grant'] }, arbBody)
  expect(emit(m).includes('always_comb'), 'no always_comb in the output')
})

check('BUILD-4', 'addCombAlways with inputs emits a legacy always @( ... ) list', () => {
  const m = arbiter('build4_dont')
  m.addCombAlways({ inputs: ['req'], outputs: ['grant'] }, arbBody)
  const sv = m.writeSystemVerilog()
  expect(/always\s*@\(\s*req\s*\)/.test(sv), 'expected always @( req )')
  expect(!sv.includes('always_comb'), 'unexpected always_comb')
})

check('BUILD-2', 'addAssign emits a continuous assignment', () => {
  const m = new Module({ name: 'build2_do' }, {
    valid_in: { direction: 'input' },
    stall: { direction: 'input' },
    valid_out: { direction: 'output' }
  })
  m.addAssign({ in: new Expr('valid_in & ~stall'), out: 'valid_out' })
  expect(/assign\s+valid_out\s*=\s*valid_in\s*&\s*~stall\s*;/.test(emit(m)), 'no assign statement in the output')
})

function counter (name: string, reset: 'lowasync' | 'highasync' | 'lowsync' | 'highsync', rst: string): Module {
  const m = new Module({ name }, {
    clk: { direction: 'input', isClock: 'posedge' },
    [rst]: { direction: 'input', isReset: reset },
    en: { direction: 'input' },
    cnt_q: { direction: 'output', width: 8 }
  })
  m.addSignal('cnt_nxt', { width: 8 })
  m.addAssign({ in: new Expr("cnt_q + 8'd1"), out: 'cnt_nxt' })
  m.addRegister({ d: 'cnt_nxt', clk: 'clk', reset: rst, en: 'en', q: 'cnt_q' })
  return m
}

check('BUILD-3', 'addRegister emits a flop with enable', () => {
  const sv = flat(emit(counter('build3_do', 'lowasync', 'rst_n')))
  expect(sv.includes('always_ff @(posedge clk or negedge rst_n)'), 'wrong sensitivity list')
  expect(sv.includes('else if (en) begin cnt_q <= cnt_nxt;'), 'enable not applied')
})

check('MOD-3', 'addRegister rejects a clock not marked isClock', () => {
  const m = new Module({ name: 'mod3_noclk' }, {
    clk: { direction: 'input' },
    d: { direction: 'input' },
    q: { direction: 'output' }
  })
  expectThrows(() => m.addRegister({ d: 'd', clk: 'clk', q: 'q' }), /not a clock signal/)
})

check('MOD-3', 'addRegister rejects a reset not marked isReset', () => {
  const m = new Module({ name: 'mod3_norst' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input' },
    d: { direction: 'input' },
    q: { direction: 'output' }
  })
  expectThrows(() => m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_n', q: 'q' }), /not a reset signal/)
})

check('BUILD-3', 'addRegister groups registers sharing clock, reset and enable into one block', () => {
  const m = new Module({ name: 'build3_group' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input', isReset: 'lowasync' },
    en: { direction: 'input' },
    a: { direction: 'input', width: 4 },
    b: { direction: 'input', width: 4 },
    y: { direction: 'output', width: 8 }
  })
  m.addRegister({ d: 'a', clk: 'clk', reset: 'rst_n', en: 'en' })
  m.addRegister({ d: 'b', clk: 'clk', reset: 'rst_n', en: 'en' })
  m.addAssign({ in: new Expr('{a_q, b_q}'), out: 'y' })
  const blocks = emit(m).match(/always_ff/g) ?? []
  expect(blocks.length === 1, `expected 1 always_ff block, found ${blocks.length}`)
})

check('IDENT-1', 'addRegister names q <d>_q when d is a simple signal', () => {
  const m = new Module({ name: 'ident1_do' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input', isReset: 'lowasync' },
    vld: { direction: 'input' },
    vld_out: { direction: 'output' }
  })
  const q = m.addRegister({ d: 'vld', clk: 'clk', reset: 'rst_n' })
  expect(q.toString() === 'vld_q', `q named ${q.toString()}`)
  m.addAssign({ in: new Expr('vld_q'), out: 'vld_out' })
  expect(/logic\s+vld_q\s*;/.test(emit(m)), 'vld_q not declared')
})

// SEQ-5: the sensitivity list and reset condition follow the reset kind.
const RESET_KINDS = [
  { kind: 'lowasync', rst: 'rst_n', sense: 'always_ff @(posedge clk or negedge rst_n)', cond: 'if (!rst_n)' },
  { kind: 'highasync', rst: 'rst', sense: 'always_ff @(posedge clk or posedge rst)', cond: 'if (rst)' },
  { kind: 'lowsync', rst: 'rst_n', sense: 'always_ff @(posedge clk)', cond: 'if (!rst_n)' },
  { kind: 'highsync', rst: 'rst', sense: 'always_ff @(posedge clk)', cond: 'if (rst)' }
] as const
for (const r of RESET_KINDS) {
  check('SEQ-5', `addRegister with a ${r.kind} reset emits "${r.sense}"`, () => {
    const sv = flat(emit(counter(`seq5_${r.kind}`, r.kind, r.rst)))
    expect(sv.includes(r.sense), `expected "${r.sense}"`)
    expect(sv.includes(r.cond), `expected "${r.cond}"`)
  })
}

check('BUILD-4', 'addSequentialAlways rejects a header missing the async reset', () => {
  const m = new Module({ name: 'build4_mismatch' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input', isReset: 'lowasync' },
    d: { direction: 'input' },
    q: { direction: 'output' }
  })
  expectThrows(() => {
    m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['q'] }, `
    always_ff @(posedge clk) begin : q_reg
      if (!rst_n) q <= 1'b0;
      else        q <= d;
    end
  `)
  }, /Sensitivity mismatch/)
})

check('MOD-4', 'the default reset (lowasync rst_n) resets asynchronously, active low', () => {
  const sv = flat(emit(counter('mod4_do', 'lowasync', 'rst_n')))
  expect(sv.includes('negedge rst_n') && sv.includes('if (!rst_n)'), 'not an active-low async reset')
})

check('BUILD-5', 'addLatchAlways emits always_latch', () => {
  const m = new Module({ name: 'build5_do' }, {
    en: { direction: 'input' },
    d: { direction: 'input', width: 4 },
    q: { direction: 'output', width: 4 }
  })
  // Intentional latch: example only.
  m.addLatchAlways({ outputs: ['q'] }, `
  begin : q_latch
    if (en) q = d;
  end
`)
  expect(emit(m).includes('always_latch'), 'no always_latch in the output')
})

check('PARAM-3', 'widths computed in TypeScript appear as numbers in the SV', () => {
  const depth = 10
  const m = new Module({ name: 'param3_do' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input', isReset: 'lowasync' },
    ptr_q: { direction: 'output', width: Math.ceil(Math.log2(depth)) }
  })
  const w = Math.ceil(Math.log2(depth))
  m.addSignal('ptr_nxt', { width: w })
  m.addAssign({ in: new Expr(`(ptr_q == ${w}'d${depth - 1}) ? '0 : ptr_q + ${w}'d1`), out: 'ptr_nxt' })
  m.addRegister({ d: 'ptr_nxt', clk: 'clk', reset: 'rst_n', q: 'ptr_q' })
  expect(emit(m).includes('output logic [3:0] ptr_q'), 'ptr_q is not 4 bits wide')
})

// The SV guide's rules on always blocks: writeSystemVerilog() checks every block in the module,
// whether a builder or raw SV wrote it (#149, #166). Each Don't breaks only the rule it tests.

// COMB-3: no nonblocking assignment in combinational logic; <= as a comparison is fine.
check('COMB-3', 'writeSystemVerilog rejects a nonblocking assignment from addCombAlways', () => {
  const m = arbiter('comb3_dont')
  m.addCombAlways({ outputs: ['grant'] }, `
  begin : arb
    grant = '0;
    if (req[0]) grant <= 2'b01;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /COMB-3/)
})

check('COMB-3', 'addCombAlways accepts <= as a comparison', () => {
  const m = new Module({ name: 'comb3_do' }, {
    a: { direction: 'input', width: 4 },
    b: { direction: 'input', width: 4 },
    le: { direction: 'output' },
    min: { direction: 'output', width: 4 }
  })
  m.addCombAlways({ outputs: ['le', 'min'] }, `
  begin : compare
    le = a <= b;
    if (a <= b) min = a;
    else        min = b;
  end
`)
  expect(emit(m).includes('le = a <= b;'), 'comparison not emitted')
})

check('COMB-3', 'writeSystemVerilog rejects a nonblocking assignment under a case label in parentheses', () => {
  const m = arbiter('comb3_case_dont')
  m.addCombAlways({ outputs: ['grant'] }, `
  begin : arb
    unique case (req)
      (2'b01), (2'b11): grant <= 2'b01;
      default:          grant = req;
    endcase
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /COMB-3/)
})

check('COMB-3', 'writeSystemVerilog rejects a nonblocking assignment in raw SV, in always @*', () => {
  const m = arbiter('comb3_raw_dont')
  m.addBody(`
  always @* begin : arb
    grant = '0;
    if (req[0]) grant <= 2'b01;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /COMB-3/)
})

// COMB-2: an always block rejects a local that is initialized but static.
const firstSet = (name: string): Module => new Module({ name }, {
  rdy: { direction: 'input', width: 4 },
  sel: { direction: 'output', width: 2 },
  valid: { direction: 'output' }
})
const firstSetBody = (local: string): string => `
  begin : first_set
    ${local} logic [1:0] idx   = 2'd0;
    ${local} logic       found = 1'b0;
    for (int i = 0; i < 4; i++) begin
      if (!found && rdy[i]) begin
        idx   = 2'(i);
        found = 1'b1;
      end
    end
    sel   = idx;
    valid = found;
  end
`

check('COMB-2', 'writeSystemVerilog rejects an initialized local that is not automatic, from addCombAlways', () => {
  const m = firstSet('comb2_dont')
  m.addCombAlways({ outputs: ['sel', 'valid'] }, firstSetBody(''))
  expectThrows(() => m.writeSystemVerilog(), /COMB-2/)
})

check('COMB-2', 'addCombAlways accepts an initialized automatic local', () => {
  const m = firstSet('comb2_do')
  m.addCombAlways({ outputs: ['sel', 'valid'] }, firstSetBody('automatic'))
  expect(emit(m).includes('automatic logic [1:0] idx'), 'automatic local not emitted')
})

check('COMB-2', 'writeSystemVerilog rejects an initialized static local from addSequentialAlways and addLatchAlways too', () => {
  const ports = {
    clk: { direction: 'input', isClock: 'posedge' },
    en: { direction: 'input' },
    d: { direction: 'input' },
    q: { direction: 'output' }
  } as const
  const seq = new Module({ name: 'comb2_seq' }, { ...ports })
  seq.addSequentialAlways({ clk: 'clk', outputs: ['q'] }, 'begin : q_reg\n  logic t = 1\'b0;\n  q <= d;\nend\n')
  expectThrows(() => seq.writeSystemVerilog(), /COMB-2/)
  const latch = new Module({ name: 'comb2_latch' }, { ...ports })
  latch.addLatchAlways({ outputs: ['q'] }, 'begin : q_latch\n  logic t = 1\'b0;\n  if (en) q = d;\nend\n')
  expectThrows(() => latch.writeSystemVerilog(), /COMB-2/)
})

check('COMB-2', 'writeSystemVerilog rejects an initialized static local in raw SV', () => {
  const m = firstSet('comb2_raw_dont')
  m.addBody(`always_comb ${firstSetBody('')}`)
  expectThrows(() => m.writeSystemVerilog(), /COMB-2/)
})

// SEQ-1: a sequential block assigns = only to its own locals.
const seqModule = (name: string): Module => new Module({ name }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_n: { direction: 'input', isReset: 'lowasync' },
  a: { direction: 'input', width: 4 },
  b: { direction: 'input', width: 4 },
  cfg: { direction: 'input', width: 5 },
  sum_q: { direction: 'output', width: 5 }
})

check('SEQ-1', 'writeSystemVerilog rejects a blocking assignment to a register, from addSequentialAlways', () => {
  const m = seqModule('seq1_dont')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    if (!rst_n) sum_q = '0;
    else        sum_q = a + b;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /SEQ-1/)
})

check('SEQ-1', 'addSequentialAlways accepts = to an automatic local, and <= to the register', () => {
  const m = seqModule('seq1_do')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    automatic logic [4:0] sum;
    sum = a + b;
    if (!rst_n) sum_q <= '0;
    else        sum_q <= sum ^ cfg;
  end
`)
  expect(emit(m).includes('sum_q <= sum ^ cfg;'), 'block not emitted')
})

check('SEQ-1', 'addSequentialAlways accepts = to a concatenation of automatic locals', () => {
  const m = seqModule('seq1_concat_do')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    automatic logic       carry;
    automatic logic [3:0] low;
    {carry, low} = a + b;
    if (!rst_n) sum_q <= '0;
    else        sum_q <= {carry, low} ^ cfg;
  end
`)
  expect(flat(emit(m)).includes('{carry, low} = a + b;'), 'block not emitted')
})

check('SEQ-1', 'writeSystemVerilog rejects a blocking assignment to a register in raw SV, in always @(posedge ...)', () => {
  const m = seqModule('seq1_raw_dont')
  m.addBody(`
  always @(posedge clk or negedge rst_n) begin : sum_reg
    if (!rst_n) sum_q = '0;
    else        sum_q = a + b;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /SEQ-1/)
})

// SEQ-4: one clock per sequential block, and one edge.
const twoClocks = (name: string, rst: { direction: 'input', isReset?: 'lowasync' } = { direction: 'input', isReset: 'lowasync' }): Module => new Module({ name }, {
  clk_a: { direction: 'input', isClock: 'posedge' },
  clk_b: { direction: 'input', isClock: 'posedge' },
  rst_n: rst,
  da: { direction: 'input' },
  db: { direction: 'input' },
  qa: { direction: 'output' },
  qb: { direction: 'output' }
})

check('SEQ-4', 'writeSystemVerilog rejects a block sensitive to two clocks', () => {
  const m = twoClocks('seq4_dont')
  m.addBody(`
  always_ff @(posedge clk_a or posedge clk_b) begin : sync
    qa <= da;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /2 clocks, clk_a and clk_b, in its event control \(SEQ-4/)
})

check('SEQ-4', 'writeSystemVerilog rejects a block on both edges of its clock', () => {
  const m = twoClocks('seq4_edges_dont')
  m.addBody(`
  always_ff @(posedge clk_a or negedge clk_a) begin : ddr
    qa <= da;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /SEQ-4/)
})

check('SEQ-4', 'writeSystemVerilog takes an async reset not marked isReset for a second clock', () => {
  const m = twoClocks('seq4_unmarked_dont', { direction: 'input' })
  m.addBody(`
  always_ff @(posedge clk_a or negedge rst_n) begin : a_reg
    if (!rst_n) qa <= 1'b0;
    else        qa <= da;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /clk_a and rst_n.*SEQ-4.*marked isReset/)
})

check('SEQ-4', 'writeSystemVerilog accepts one block per clock, from a builder and from raw SV', () => {
  const m = twoClocks('seq4_do')
  m.addSequentialAlways({ clk: 'clk_a', reset: 'rst_n', outputs: ['qa'] }, `
  begin : a_reg
    if (!rst_n) qa <= 1'b0;
    else        qa <= da;
  end
`)
  m.addBody(`
  always_ff @(posedge clk_b or negedge rst_n) begin : b_reg
    if (!rst_n) qb <= 1'b0;
    else        qb <= db;
  end
`)
  expect((emit(m).match(/always_ff/g) ?? []).length === 2, 'expected two always_ff blocks')
})

// SEQ-5 in raw SV: the sensitivity list matches the reset kind.
const stateModule = (name: string, kind: 'lowasync' | 'lowsync'): Module => new Module({ name }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_n: { direction: 'input', isReset: kind },
  st_nxt: { direction: 'input', width: 2 },
  st_q: { direction: 'output', width: 2 }
})
const stateBody = (sense: string): string => `
  localparam logic [1:0] IDLE = 2'd0;
  always_ff @(${sense}) begin : st_reg
    if (!rst_n) st_q <= IDLE;
    else        st_q <= st_nxt;
  end
`

check('SEQ-5', 'writeSystemVerilog rejects an async reset missing from the event control', () => {
  const m = stateModule('seq5_raw_dont', 'lowasync')
  m.addBody(stateBody('posedge clk'))
  expectThrows(() => m.writeSystemVerilog(), /rst_n is lowasync, but it isn't in the event control.*SEQ-5/)
})

check('SEQ-5', 'writeSystemVerilog rejects a sync reset in the event control', () => {
  const m = stateModule('seq5_raw_sync_dont', 'lowsync')
  m.addBody(stateBody('posedge clk or negedge rst_n'))
  expectThrows(() => m.writeSystemVerilog(), /a sync reset, but it's in the event control.*SEQ-5/)
})

check('SEQ-5', 'writeSystemVerilog rejects an async reset on the wrong edge', () => {
  const m = stateModule('seq5_raw_edge_dont', 'lowasync')
  m.addBody(stateBody('posedge clk or posedge rst_n'))
  expectThrows(() => m.writeSystemVerilog(), /its event is negedge rst_n.*SEQ-5/)
})

check('SEQ-5', 'writeSystemVerilog accepts raw SV whose sensitivity list matches the reset kind', () => {
  const m = stateModule('seq5_raw_do', 'lowasync')
  m.addBody(stateBody('posedge clk or negedge rst_n'))
  expect(flat(emit(m)).includes('always_ff @(posedge clk or negedge rst_n)'), 'block not emitted')
})

// SEQ-6: reset values are constants.
check('SEQ-6', 'writeSystemVerilog rejects a reset to a signal, from addSequentialAlways', () => {
  const m = seqModule('seq6_dont')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    if (!rst_n) begin
      sum_q <= cfg;
    end else begin
      sum_q <= a + b;
    end
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /SEQ-6/)
})

check('SEQ-6', 'writeSystemVerilog rejects a reset to a signal in the else branch of if (rst_n)', () => {
  const m = seqModule('seq6_else_dont')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    if (rst_n) sum_q <= a + b;
    else       sum_q <= cfg;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /SEQ-6/)
})

check('SEQ-6', 'addSequentialAlways accepts a constant reset value', () => {
  const m = seqModule('seq6_do')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    if (!rst_n) sum_q <= 5'd16;
    else        sum_q <= (a + b) ^ cfg;
  end
`)
  expect(emit(m).includes("sum_q <= 5'd16;"), 'reset value not emitted')
})

check('SEQ-6', 'addRegister rejects a reset value that is not a bigint', () => {
  const m = counter('seq6_reg', 'lowasync', 'rst_n')
  m.addSignal('base', { width: 8 })
  const resetVal = 'base' as unknown as bigint
  expectThrows(() => m.addRegister({ d: 'base', clk: 'clk', reset: 'rst_n', resetVal }), /SEQ-6/)
})

check('SEQ-6', 'writeSystemVerilog rejects a reset to a port in raw SV', () => {
  const m = seqModule('seq6_raw_dont')
  m.addBody(`
  always_ff @(posedge clk or negedge rst_n) begin : sum_reg
    if (!rst_n) sum_q <= cfg;
    else        sum_q <= (a + b) ^ cfg;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /sum_q resets to cfg, a signal \(SEQ-6/)
})

check('SEQ-6', 'writeSystemVerilog rejects a reset to a variable that raw SV declares', () => {
  const m = seqModule('seq6_raw_decl_dont')
  m.addBody(`
  logic [4:0] seed;
  assign seed = cfg ^ 5'd16;
  always_ff @(posedge clk or negedge rst_n) begin : sum_reg
    if (!rst_n) sum_q <= seed;
    else        sum_q <= (a + b) ^ cfg;
  end
`)
  expectThrows(() => m.writeSystemVerilog(), /sum_q resets to seed, a signal \(SEQ-6/)
})

check('SEQ-6', 'writeSystemVerilog accepts a reset to a localparam in raw SV', () => {
  const m = seqModule('seq6_raw_do')
  m.addBody(`
  localparam logic [4:0] SEED = 5'd16;
  always_ff @(posedge clk or negedge rst_n) begin : sum_reg
    if (!rst_n) sum_q <= SEED;
    else        sum_q <= (a + b) ^ cfg;
  end
`)
  expect(emit(m).includes('sum_q <= SEED;'), 'reset value not emitted')
})

// RST-2: one reset kind per module.
const twoResets = (name: string): Module => new Module({ name }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_n: { direction: 'input', isReset: 'lowasync' },
  srst: { direction: 'input', isReset: 'highsync' },
  a: { direction: 'input' },
  b: { direction: 'input' },
  y: { direction: 'output', width: 2 }
})
const srstBlock = `
  always_ff @(posedge clk) begin : b_reg
    if (srst) y[1] <= 1'b0;
    else      y[1] <= b;
  end
`

check('RST-2', 'writeSystemVerilog rejects registers of two reset kinds', () => {
  const m = twoResets('rst2_dont')
  m.addRegister({ d: 'a', clk: 'clk', reset: 'rst_n' })
  m.addRegister({ d: 'b', clk: 'clk', reset: 'srst' })
  expectThrows(() => m.writeSystemVerilog(), /rst_n, which is lowasync.*srst, which is highsync.*RST-2/)
})

check('RST-2', 'writeSystemVerilog rejects addRegister and addSequentialAlways with two reset kinds', () => {
  const m = twoResets('rst2_seq_dont')
  m.addRegister({ d: 'a', clk: 'clk', reset: 'rst_n' })
  m.addSequentialAlways({ clk: 'clk', reset: 'srst', outputs: ['y'] }, 'begin : y_reg\n  if (srst) y <= \'0;\n  else y <= {a, b};\nend\n')
  expectThrows(() => m.writeSystemVerilog(), /RST-2/)
})

check('RST-2', 'writeSystemVerilog rejects raw SV with two reset kinds', () => {
  const m = twoResets('rst2_raw_dont')
  m.addBody(`
  always_ff @(posedge clk or negedge rst_n) begin : a_reg
    if (!rst_n) y[0] <= 1'b0;
    else        y[0] <= a;
  end
${srstBlock}`)
  expectThrows(() => m.writeSystemVerilog(), /RST-2/)
})

check('RST-2', 'writeSystemVerilog rejects raw SV and addRegister with two reset kinds', () => {
  const m = twoResets('rst2_mixed_dont')
  m.addRegister({ d: 'a', clk: 'clk', reset: 'rst_n' })
  m.addBody(srstBlock)
  expectThrows(() => m.writeSystemVerilog(), /RST-2/)
})

check('RST-2', 'a module accepts two resets of the same kind', () => {
  const m = new Module({ name: 'rst2_do' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_a_n: { direction: 'input', isReset: 'lowasync' },
    rst_b_n: { direction: 'input', isReset: 'lowasync' },
    a: { direction: 'input' },
    b: { direction: 'input' },
    y: { direction: 'output', width: 2 }
  })
  m.addRegister({ d: 'a', clk: 'clk', reset: 'rst_a_n' })
  m.addRegister({ d: 'b', clk: 'clk', reset: 'rst_b_n' })
  m.addAssign({ in: new Expr('{a_q, b_q}'), out: 'y' })
  expect((emit(m).match(/always_ff/g) ?? []).length === 2, 'expected two always_ff blocks')
})

// RST-4: a reset is never generated in logic.
const resetUser = (name: string): Module => new Module({ name }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_n: { direction: 'input', isReset: 'lowasync' },
  clr: { direction: 'input' },
  d: { direction: 'input' },
  q: { direction: 'output' }
})

check('RST-4', 'writeSystemVerilog rejects a reset assigned an expression', () => {
  const m = resetUser('rst4_assign_dont')
  m.addSignal('rst_int_n', { isReset: 'lowasync' })
  m.addAssign({ in: new Expr('rst_n & !clr'), out: 'rst_int_n' })
  m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_int_n', q: 'q' })
  expectThrows(() => m.writeSystemVerilog(), /reset rst_int_n is generated in logic: rst_int_n is assigned rst_n & !clr \(RST-4/)
})

check('RST-4', 'writeSystemVerilog rejects a reset assigned in always_comb', () => {
  const m = resetUser('rst4_comb_dont')
  m.addSignal('rst_int_n', { isReset: 'lowasync' })
  m.addCombAlways({ outputs: ['rst_int_n'] }, 'begin : rst_gen\n  rst_int_n = rst_n && !clr;\nend\n')
  m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_int_n', q: 'q' })
  expectThrows(() => m.writeSystemVerilog(), /rst_int_n is assigned in a combinational block \(RST-4/)
})

check('RST-4', 'writeSystemVerilog rejects a submodule reset bound to a signal generated in logic', () => {
  const child = resetUser('rst4_child')
  child.addRegister({ d: 'd', clk: 'clk', reset: 'rst_n', q: 'q' })
  const m = resetUser('rst4_bind_dont')
  m.addSignal('soft_rst_n', {})
  m.addAssign({ in: new Expr('rst_n & !clr'), out: 'soft_rst_n' })
  m.addSubmodule('u_child', child, { rst_n: 'soft_rst_n' })
  expectThrows(() => m.writeSystemVerilog(), /reset soft_rst_n is generated in logic.*RST-4/)
})

check('RST-4', 'writeSystemVerilog accepts a reset assigned from an input', () => {
  const m = resetUser('rst4_alias_do')
  m.addSignal('rst_int_n', { isReset: 'lowasync' })
  m.addAssign({ in: new Expr('rst_n'), out: 'rst_int_n' })
  m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_int_n', en: 'clr', q: 'q' })
  emit(m)
})

check('RST-4', 'writeSystemVerilog accepts a reset that inverts an input', () => {
  const m = resetUser('rst4_invert_do')
  m.addSignal('rst', { isReset: 'highasync' })
  m.addAssign({ in: new Expr('~rst_n'), out: 'rst' })
  m.addRegister({ d: 'd', clk: 'clk', reset: 'rst', en: 'clr', q: 'q' })
  emit(m)
})

// A sync reset, registered through two flops. (An async reset from a synchronizer passes RST-4
// too, but Verilator's SYNCASYNCNET flags it, so it isn't a clean Do module.)
check('RST-4', 'writeSystemVerilog accepts a reset from a register', () => {
  const m = new Module({ name: 'rst4_reg_do' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input', isReset: 'lowsync' },
    clr: { direction: 'input' },
    d: { direction: 'input' },
    q: { direction: 'output' }
  })
  m.addSignal('sync_q', { width: 2 })
  m.addSignal('rst_sync_n', { isReset: 'lowsync' })
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sync_q'] }, `
  begin : rst_pipe
    if (!rst_n) sync_q <= '0;
    else        sync_q <= {sync_q[0], 1'b1};
  end
`)
  m.addAssign({ in: new Expr('sync_q[1]'), out: 'rst_sync_n' })
  m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_sync_n', en: 'clr', q: 'q' })
  emit(m)
})

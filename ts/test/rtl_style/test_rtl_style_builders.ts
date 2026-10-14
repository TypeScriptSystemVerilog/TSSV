// Builder checks for the style guides in doc/rtl-style/: SEQ-5 in the SV guide, and the TSSV
// guide's rules about what a builder emits or rejects. Each check() builds small modules with
// the TSSV builders and confirms what the guide claims. Every module that should be clean is
// written to sv-examples/rtl_style/ for doc/rtl-style/sv-style/tools/check-builder-examples.mjs to lint.
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

// COMB-3: addCombAlways rejects a nonblocking assignment, and accepts <= as a comparison.
check('COMB-3', 'addCombAlways rejects a nonblocking assignment', () => {
  const m = arbiter('comb3_dont')
  expectThrows(() => {
    m.addCombAlways({ outputs: ['grant'] }, `
  begin : arb
    grant = '0;
    if (req[0]) grant <= 2'b01;
  end
`)
  }, /COMB-3/)
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

// COMB-2: an always-block builder rejects a local that is initialized but static.
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

check('COMB-2', 'addCombAlways rejects an initialized local that is not automatic', () => {
  expectThrows(() => { firstSet('comb2_dont').addCombAlways({ outputs: ['sel', 'valid'] }, firstSetBody('')) }, /COMB-2/)
})

check('COMB-2', 'addCombAlways accepts an initialized automatic local', () => {
  const m = firstSet('comb2_do')
  m.addCombAlways({ outputs: ['sel', 'valid'] }, firstSetBody('automatic'))
  expect(emit(m).includes('automatic logic [1:0] idx'), 'automatic local not emitted')
})

check('COMB-2', 'addSequentialAlways and addLatchAlways reject an initialized static local too', () => {
  const m = new Module({ name: 'comb2_seq_latch' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    en: { direction: 'input' },
    d: { direction: 'input' },
    q: { direction: 'output' },
    l: { direction: 'output' }
  })
  expectThrows(() => { m.addSequentialAlways({ clk: 'clk', outputs: ['q'] }, 'begin : q_reg\n  logic t = 1\'b0;\n  q <= d;\nend\n') }, /COMB-2/)
  expectThrows(() => { m.addLatchAlways({ outputs: ['l'] }, 'begin : l_latch\n  logic t = 1\'b0;\n  if (en) l = d;\nend\n') }, /COMB-2/)
})

// SEQ-1: addSequentialAlways rejects = to anything but the block's own locals.
const seqModule = (name: string): Module => new Module({ name }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_n: { direction: 'input', isReset: 'lowasync' },
  a: { direction: 'input', width: 4 },
  b: { direction: 'input', width: 4 },
  cfg: { direction: 'input', width: 5 },
  sum_q: { direction: 'output', width: 5 }
})

check('SEQ-1', 'addSequentialAlways rejects a blocking assignment to a register', () => {
  expectThrows(() => {
    seqModule('seq1_dont').addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    if (!rst_n) sum_q = '0;
    else        sum_q = 5'(a) + 5'(b);
  end
`)
  }, /SEQ-1/)
})

check('SEQ-1', 'addSequentialAlways accepts = to an automatic local, and <= to the register', () => {
  const m = seqModule('seq1_do')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    automatic logic [4:0] sum;
    sum = 5'(a) + 5'(b);
    if (!rst_n) sum_q <= '0;
    else        sum_q <= sum ^ cfg;
  end
`)
  expect(emit(m).includes('sum_q <= sum ^ cfg;'), 'block not emitted')
})

// SEQ-6: reset values are constants.
check('SEQ-6', 'addSequentialAlways rejects a reset to a signal', () => {
  expectThrows(() => {
    seqModule('seq6_dont').addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    if (!rst_n) begin
      sum_q <= cfg;
    end else begin
      sum_q <= 5'(a) + 5'(b);
    end
  end
`)
  }, /SEQ-6/)
})

check('SEQ-6', 'addSequentialAlways accepts a constant reset value', () => {
  const m = seqModule('seq6_do')
  m.addSequentialAlways({ clk: 'clk', reset: 'rst_n', outputs: ['sum_q'] }, `
  begin : sum_reg
    if (!rst_n) sum_q <= 5'd16;
    else        sum_q <= (5'(a) + 5'(b)) ^ cfg;
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

// RST-2: one reset kind per module.
check('RST-2', 'a module rejects a second reset kind', () => {
  const m = new Module({ name: 'rst2_dont' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input', isReset: 'lowasync' },
    srst: { direction: 'input', isReset: 'highsync' },
    a: { direction: 'input' },
    b: { direction: 'input' },
    y: { direction: 'output', width: 2 }
  })
  m.addRegister({ d: 'a', clk: 'clk', reset: 'rst_n' })
  expectThrows(() => m.addRegister({ d: 'b', clk: 'clk', reset: 'srst' }), /RST-2/)
  expectThrows(() => { m.addSequentialAlways({ clk: 'clk', reset: 'srst', outputs: ['y'] }, 'begin : y_reg\n  if (srst) y <= \'0;\n  else y <= {a, b};\nend\n') }, /RST-2/)
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

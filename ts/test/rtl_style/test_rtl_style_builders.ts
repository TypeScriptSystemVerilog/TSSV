// Builder examples for doc/rtl-style/sv-style/sv-coding-style.md: the rules whose examples are
// TypeScript rather than SystemVerilog. Each check() builds small modules with the TSSV
// builders and confirms what the doc claims they emit. Every module that should be clean is
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

check('COMB-7', 'addCombAlways without inputs emits always_comb', () => {
  const m = arbiter('comb7_do')
  m.addCombAlways({ outputs: ['grant'] }, arbBody)
  expect(emit(m).includes('always_comb'), 'no always_comb in the output')
})

check('COMB-7', 'addCombAlways with inputs emits a legacy always @( ... ) list', () => {
  const m = arbiter('comb7_dont')
  m.addCombAlways({ inputs: ['req'], outputs: ['grant'] }, arbBody)
  const sv = m.writeSystemVerilog()
  expect(/always\s*@\(\s*req\s*\)/.test(sv), 'expected always @( req )')
  expect(!sv.includes('always_comb'), 'unexpected always_comb')
})

check('COMB-8', 'addAssign emits a continuous assignment', () => {
  const m = new Module({ name: 'comb8_do' }, {
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

check('SEQ-3', 'addRegister emits a flop with enable', () => {
  const sv = flat(emit(counter('seq3_do', 'lowasync', 'rst_n')))
  expect(sv.includes('always_ff @(posedge clk or negedge rst_n)'), 'wrong sensitivity list')
  expect(sv.includes('else if (en) begin cnt_q <= cnt_nxt;'), 'enable not applied')
})

check('SEQ-3', 'addRegister rejects a clock not marked isClock', () => {
  const m = new Module({ name: 'seq3_noclk' }, {
    clk: { direction: 'input' },
    d: { direction: 'input' },
    q: { direction: 'output' }
  })
  expectThrows(() => m.addRegister({ d: 'd', clk: 'clk', q: 'q' }), /not a clock signal/)
})

check('SEQ-3', 'addRegister rejects a reset not marked isReset', () => {
  const m = new Module({ name: 'seq3_norst' }, {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_n: { direction: 'input' },
    d: { direction: 'input' },
    q: { direction: 'output' }
  })
  expectThrows(() => m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_n', q: 'q' }), /not a reset signal/)
})

check('SEQ-3', 'addRegister groups registers sharing clock, reset and enable into one block', () => {
  const m = new Module({ name: 'seq3_group' }, {
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

check('NAME-1', 'addRegister names q <d>_q when d is a simple signal', () => {
  const m = new Module({ name: 'name1_do' }, {
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

check('SEQ-5', 'addSequentialAlways rejects a header missing the async reset', () => {
  const m = new Module({ name: 'seq5_mismatch' }, {
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

check('RST-1', 'the default reset (lowasync rst_n) resets asynchronously, active low', () => {
  const sv = flat(emit(counter('rst1_do', 'lowasync', 'rst_n')))
  expect(sv.includes('negedge rst_n') && sv.includes('if (!rst_n)'), 'not an active-low async reset')
})

check('LATCH-1', 'addLatchAlways emits always_latch', () => {
  const m = new Module({ name: 'latch1_do' }, {
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

check('WIDTH-8', 'widths computed in TypeScript appear as numbers in the SV', () => {
  const depth = 10
  const m = new Module({ name: 'width8_do' }, {
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

// The example on Module.setNullView(): a module with two pipeline stages below it, and the stub
// that a build can use in place of it. Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const CLK = { direction: 'input', isClock: 'posedge' } as const
const RST = { direction: 'input', isReset: 'lowasync' } as const
const BYTE_IN = { direction: 'input', width: 8 } as const
const BYTE_OUT = { direction: 'output', width: 8 } as const

const stage = new Module({ name: 'NullViewStage' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
stage.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })

const m = new Module({ name: 'NullViewExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT, ready: { direction: 'output' } })
m.addSignal('mid', { width: 8 })
m.addSubmodule('u_stage0', stage, { d: 'd', q: 'mid' })
m.addSubmodule('u_stage1', stage, { d: 'mid', q: 'q' })
m.addConstSignal('one', 1n)
m.addAssign({ in: new Expr('one'), out: 'ready' })
// #region example
// The stub ties ready to 1 and q, which has no tie here, to 0
m.setNullView({ ties: { ready: 1n } })
// writeExample calls m.writeSystemVerilogFiles(dir, { nullViewDir: `${dir}/null` }): the
// stub is null/NullViewExample.sv, beside the generated NullViewExample.sv
writeExample('setNullView', m, { nullViewDir: 'null' })
// #endregion example

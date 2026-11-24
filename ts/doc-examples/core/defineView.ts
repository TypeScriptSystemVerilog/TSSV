// The example on Module.defineView(): a simulation-only view whose tracer breaks the SV guide,
// written without the SV-guide check. Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const CLK = { direction: 'input', isClock: 'posedge' } as const
const RST = { direction: 'input', isReset: 'lowasync' } as const
const BYTE_IN = { direction: 'input', width: 8 } as const
const BYTE_OUT = { direction: 'output', width: 8 } as const

/** Prints each value with a cycle count. The counter has no reset, which RST-5 forbids */
const tracer = new Module({ name: 'CycleTracer' }, { clk: CLK, value: BYTE_IN })
tracer.addSignal('cycle', { width: 32 })
tracer.addSignal('cycle_next', { width: 32 })
tracer.addAssign({ in: new Expr('cycle + 1'), out: 'cycle_next' })
tracer.addRegister({ d: 'cycle_next', clk: 'clk', q: 'cycle' })
tracer.addBody('always_ff @(posedge clk) $display("%0d: value %0d", cycle, value);')

const m = new Module({ name: 'DefineViewExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region example
// TSSV_SIM's RTL is for simulation only: it isn't checked against the SV guide. Without this
// line, writing the module throws, because tracer, a CycleTracer, breaks RST-5
Module.defineView('TSSV_SIM', { lint: false })
m.inView(['TSSV_SIM'], () => {
  m.addSubmodule('u_trace', tracer, { value: 'q' })
})
// #endregion example
writeExample('defineView', m)

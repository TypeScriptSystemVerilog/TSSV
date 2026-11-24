// The examples on Module.inView(): a monitor that only a simulation build compiles, the same
// monitor in either of two builds, a view's registers, and the order a view's RTL is emitted in.
// Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const CLK = { direction: 'input', isClock: 'posedge' } as const
const RST = { direction: 'input', isReset: 'lowasync' } as const
const BYTE_IN = { direction: 'input', width: 8 } as const
const BYTE_OUT = { direction: 'output', width: 8 } as const

/** Reports a value of 255 when it is clocked: a check with no output, for simulation */
const monitor = new Module({ name: 'SaturationMonitor' }, { clk: CLK, value: BYTE_IN })
monitor.addBody(`
    always_ff @(posedge clk)
      if (value == 8'hff) $error("value saturated");
`)

const m = new Module({ name: 'InViewExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region example
// monitor is a SaturationMonitor, with ports clk and value. Only a build that defines
// TSSV_SIM compiles the instance, and only that build reads SaturationMonitor.sv
m.inView(['TSSV_SIM'], () => {
  m.addSubmodule('u_mon', monitor, { value: 'q' })
})
// #endregion example
writeExample('inView', m)

const list = new Module({ name: 'ViewListExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
list.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
// #region list
// Simulation and formal builds both compile the monitor
list.inView(['TSSV_SIM', 'TSSV_FPV'], () => {
  list.addSubmodule('u_mon', monitor, { value: 'q' })
})
// #endregion list
writeExample('inView', list)

const regs = new Module({ name: 'ViewRegistersExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
// #region registers
// Two registers in a view, on the same clock and reset as one at the top level
regs.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
regs.inView(['TSSV_SIM'], () => {
  regs.addSignal('d_q', { width: 8 })
  regs.addSignal('d_qq', { width: 8 })
  regs.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
  regs.addRegister({ d: 'd_q', clk: 'clk', reset: 'rst_b', q: 'd_qq' })
  regs.addSubmodule('u_mon', monitor, { value: 'd_qq' })
})
// #endregion registers
writeExample('inView', regs)

const layout = new Module({ name: 'ViewLayoutExample' }, { clk: CLK, rst_b: RST, d: BYTE_IN, q: BYTE_OUT })
// #region layout
// A view's calls, with the kinds of RTL mixed up
layout.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })
layout.inView(['TSSV_SIM'], () => {
  layout.addSignal('d_q', { width: 8 })
  layout.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'd_q' })
  layout.addSubmodule('u_mon', monitor, { value: 'd_q' })
  layout.addSignal('d_inv', { width: 8 })
  layout.inView(['TSSV_TRACE'], () => {
    layout.addBody('always_ff @(posedge clk) $display("d_q = %0d", d_q);')
  })
  layout.addAssign({ in: new Expr('~d_q'), out: 'd_inv' })
  layout.addSubmodule('u_mon_inv', monitor, { value: 'd_inv' })
})
// #endregion layout
writeExample('inView', layout)

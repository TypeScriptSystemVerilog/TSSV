// The example on Module.addSubmodule(): two instances of one register module, chained into a
// two-stage pipeline. Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const stage = new Module({ name: 'PipeStage' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_b: { direction: 'input', isReset: 'lowasync' },
  d: { direction: 'input', width: 8 },
  q: { direction: 'output', width: 8 }
})
stage.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', q: 'q' })

const m = new Module({ name: 'SubmoduleExample' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_b: { direction: 'input', isReset: 'lowasync' },
  in: { direction: 'input', width: 8 },
  out: { direction: 'output', width: 8 }
})
m.addSignal('mid', { width: 8 })
// #region example
// stage is a PipeStage module, with ports clk, rst_b, d and q. Its clk and rst_b
// bind to the parent's ports of the same name (autoBind)
m.addSubmodule('stage0', stage, { d: 'in', q: 'mid' })
m.addSubmodule('stage1', stage, { d: 'mid', q: 'out' })
// #endregion example

writeExample('addSubmodule', m)

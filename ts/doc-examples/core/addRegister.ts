// The example on Module.addRegister(): an 8-bit register with an enable and an
// active-low asynchronous reset. Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'RegisterExample' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_b: { direction: 'input', isReset: 'lowasync' },
  en: { direction: 'input' },
  d: { direction: 'input', width: 8 },
  q: { direction: 'output', width: 8 }
})
// #region example
m.addRegister({ d: 'd', clk: 'clk', reset: 'rst_b', en: 'en', q: 'q' })
// #endregion example

writeExample('addRegister', m)

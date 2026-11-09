// The example on Module.addNoCombinationalPathContract(): a registered valid, which promises no
// combinational path from its input to its output. Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'ContractExample' }, {
  clk: { direction: 'input', isClock: 'posedge' },
  rst_b: { direction: 'input', isReset: 'lowasync' },
  in_valid: { direction: 'input' },
  out_valid: { direction: 'output' }
})
m.addRegister({ d: 'in_valid', clk: 'clk', reset: 'rst_b', q: 'out_valid' })
// #region example
// Every path from in_valid to out_valid goes through a flop
m.addNoCombinationalPathContract('in_valid', 'out_valid')
// #endregion example

writeExample('addNoCombinationalPathContract', m)

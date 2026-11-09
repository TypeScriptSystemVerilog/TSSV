// The example on Module.addCombAlways(): an AND gate in an always_comb block.
// Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'CombAlwaysExample' }, {
  a: { direction: 'input' },
  b: { direction: 'input' },
  y: { direction: 'output' }
})
// #region example
m.addCombAlways({ outputs: ['y'] }, `
  begin : and_gate
    y = a & b;
  end
`)
// #endregion example

writeExample('addCombAlways', m)

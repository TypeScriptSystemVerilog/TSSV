// The example on Module.addMux(): a 3-input, 4-bit multiplexer with a default for the select
// value that has no input. Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'MuxExample' }, {
  a: { direction: 'input', width: 4 },
  b: { direction: 'input', width: 4 },
  c: { direction: 'input', width: 4 },
  sel: { direction: 'input', width: 2 },
  out: { direction: 'output', width: 4 }
})
// #region example
m.addMux({ in: ['a', 'b', 'c'], sel: 'sel', out: 'out', default: 'a' })
// #endregion example

writeExample('addMux', m)

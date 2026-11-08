// The example on Module.addBodyLine(): one line of raw SV, appended as given.
// Run by `npm run docs:examples`.
import { Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'BodyLineExample' }, {
  a: { direction: 'input' },
  y: { direction: 'output' }
})
// #region example
m.addBodyLine('   assign y = ~a;')
// #endregion example

writeExample('addBodyLine', m)

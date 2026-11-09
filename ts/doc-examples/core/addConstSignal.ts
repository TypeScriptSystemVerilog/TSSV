// The example on Module.addConstSignal(): a named 8-bit constant, compared with an input.
// Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'ConstSignalExample' }, {
  level: { direction: 'input', width: 8 },
  full: { direction: 'output' }
})
// #region example
const max = m.addConstSignal('MAX_LEVEL', 200n, false, 8)
m.addAssign({ in: new Expr(`level >= ${max.toString()}`), out: 'full' })
// #endregion example

writeExample('addConstSignal', m)

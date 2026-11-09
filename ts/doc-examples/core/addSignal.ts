// The example on Module.addSignal(): a signed internal signal between an input and an output.
// Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'SignalExample' }, {
  a: { direction: 'input', width: 8, isSigned: true },
  y: { direction: 'output', width: 8, isSigned: true }
})
// #region example
const neg = m.addSignal('neg', { width: 8, isSigned: true })
m.addAssign({ in: new Expr('-a'), out: neg })
m.addAssign({ in: new Expr(`${neg.toString()} >>> 1`), out: 'y' })
// #endregion example

writeExample('addSignal', m)

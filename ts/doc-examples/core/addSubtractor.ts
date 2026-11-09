// The example on Module.addSubtractor(): a signed signal minus an unsigned one, auto-sized.
// Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'SubtractorExample' }, {
  a: { direction: 'input', width: 8, isSigned: true },
  b: { direction: 'input', width: 8 },
  y: { direction: 'output', width: 10, isSigned: true }
})
// #region example
// b is unsigned, so it is $signed({1'b0, b}), 9 bits: the difference is 10 bits, signed
const diff = m.addSubtractor({ a: 'a', b: 'b' })
// #endregion example
m.addAssign({ in: new Expr(diff.toString()), out: 'y' })

writeExample('addSubtractor', m)

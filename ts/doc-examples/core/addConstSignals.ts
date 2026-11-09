// The example on Module.addConstSignals(): three signed coefficients at one width, summed.
// Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'ConstSignalsExample' }, {
  total: { direction: 'output', width: 6, isSigned: true }
})
// #region example
const coeffs = m.addConstSignals('COEFF', [3n, -5n, 12n], true, 6)
m.addAssign({ in: new Expr(coeffs.join(' + ')), out: 'total' })
// #endregion example

writeExample('addConstSignals', m)

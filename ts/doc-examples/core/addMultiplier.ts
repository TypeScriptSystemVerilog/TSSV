// The example on Module.addMultiplier(): a signed 8-bit signal times an unsigned 4-bit one, with
// an auto-sized product. Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'MultiplierExample' }, {
  sample: { direction: 'input', width: 8, isSigned: true },
  gain: { direction: 'input', width: 4 },
  scaled: { direction: 'output', width: 12, isSigned: true }
})
// #region example
// Without result, the product is a new signal prod_samplexgain, 8 + 4 bits wide
const prod = m.addMultiplier({ a: 'sample', b: 'gain' })
// #endregion example
m.addAssign({ in: new Expr(prod.toString()), out: 'scaled' })

writeExample('addMultiplier', m)

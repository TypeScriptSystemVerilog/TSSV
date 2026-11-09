// The example on Module.addAssign(): an input bus masked by another.
// Run by `npm run docs:examples`.
import { Expr, Module } from 'tssv/lib/core/TSSV'
import { writeExample } from './writeExample.js'

const m = new Module({ name: 'AssignExample' }, {
  data: { direction: 'input', width: 8 },
  mask: { direction: 'input', width: 8 },
  masked: { direction: 'output', width: 8 }
})
// #region example
m.addAssign({ in: new Expr('data & mask'), out: 'masked' })
// #endregion example

writeExample('addAssign', m)
